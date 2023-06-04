const mongoose = require('mongoose');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found.error');
const BadRequestError = require('../errors/bad-request.error');

module.exports = class MongoRepository {
    constructor(schema, collectionName) {
        this.schema = schema;
        this.collectionName = collectionName;
        this.model = mongoose.model(this.collectionName, this.schema);
    }

    getSchemaRefs() {
        const refs = [];
        this.model.schema.eachPath((path, schemaType) => {
            if (schemaType.instance === 'ObjectId' && schemaType.options.ref) {
                refs.push(path);
            }
        });

        return refs;
    }

    getModelName() {
        return this.model.modelName;
    }

    normalizeFilters(filters) {
        const normalizedFilters = {};
        Object.entries(filters)
            .filter((entrie) => {
                return Object.keys(this.schema.paths).includes(entrie[0]);
            })
            .map((entrie) => {
                const schemaAttribute = this.schema.paths[entrie[0]];
                if (schemaAttribute.instance == 'ObjectId') {
                    if (!mongoose.Types.ObjectId.isValid(entrie[1])) {
                        throw new InternalServerError("Object isn't valid");
                    }
                    entrie[1] = entrie[1];
                } else if (schemaAttribute.instance == 'Boolean') {
                    entrie[1] = !!entrie[1];
                } else if (schemaAttribute.instance == 'Number') {
                    entrie[1] = entrie[1];
                } else {
                    entrie[1] = {
                        $regex: new RegExp(entrie[1], 'i'),
                    };
                }
                return entrie;
            })
            .forEach((entrie) => (normalizedFilters[entrie[0]] = entrie[1]));

        return normalizedFilters;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(data) {
        if (!data._id) {
            throw new InternalServerError(`${this.getModelName()} must have and Id to been updated`);
        }

        try {
            return await this.model.updateOne({ _id: data._id }, data, { runValidators: true });
        } catch (err) {
            if (err._message == 'Validation failed') {
                throw new BadRequestError(`${this.getModelName()} error: ${Object.values(err.errors)[0].properties.message}`);
            }
            throw new NotFoundError(`${this.getModelName()} not found`);
        }
    }

    async delete(id) {
        if (!id) {
            throw new InternalServerError(`${this.getModelName()} must have and Id to been deleted`);
        }

        try {
            return await this.model.findByIdAndDelete(id);
        } catch (err) {
            throw new NotFoundError(`${this.getModelName()} not found`);
        }
    }

    async findById(id, populates = this.getSchemaRefs()) {
        if (!id) {
            throw new InternalServerError(`${this.getModelName()} must have and Id to been found`);
        }

        try {
            return await this.find({ _id: id }, populates);
        } catch (err) {
            throw new NotFoundError(`${this.getModelName()} not found`);
        }
    }

    async find(filters = {}, populates = this.getSchemaRefs(), sort = null, select = null) {
        try {
            filters = this.normalizeFilters(filters);
        } catch (error) {
            return [];
        }

        const query = this.model.find(filters);

        if (sort) {
            query.sort(sort);
        }

        populates.forEach((populate) => {
            query.populate(populate);
        });

        if (select) {
            query.select(select);
        }

        return (await query.exec())[0] || null;
    }

    async list(filters = {}, populates = this.getSchemaRefs(), sort = null, select = null, limit = null) {
        try {
            filters = this.normalizeFilters(filters);
        } catch (error) {
            return [];
        }

        const query = this.model.find(filters);

        if (sort) {
            query.sort(sort);
        }

        if (select) {
            query.select(select);
        }

        if (limit) {
            query.limit(limit);
        }

        populates.forEach((populate) => {
            query.populate(populate);
        });

        return await query.exec();
    }
};
