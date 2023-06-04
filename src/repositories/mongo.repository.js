const mongoose = require('mongoose');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found.error');

module.exports = class SMongoRepository {
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

    async create(data) {
        return await this.model.create(data);
    }

    async update(data) {
        if (!data._id) {
            throw new InternalServerError(`${this.getModelName()} must have and Id to been updated`);
        }

        try {
            return await this.model.updateOne({ _id: data._id }, data);
        } catch (err) {
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

    async find(filters, populates = this.getSchemaRefs(), sort = null, select = null) {
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

    async list(filters, populates = this.getSchemaRefs(), sort = null, select = null, limit = null) {
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
