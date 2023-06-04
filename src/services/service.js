module.exports = class Service {
    constructor(repository) {
        this.repository = repository;
    }

    getDefaultRelations() {
        return this.repository.getSchemaRefs();
    }

    async update(data) {
        return await this.repository.update(data);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }

    async create(data) {
        return await this.repository.create(data);
    }

    async findById(id, populates = this.getDefaultRelations()) {
        return await this.repository.findById(id, populates);
    }

    async find(filters, populates = this.getDefaultRelations()) {
        return await this.repository.find(filters, populates);
    }

    async list(filters, populates = this.getDefaultRelations(), orders, select, limit) {
        return await this.repository.list(filters, populates, orders, select, limit);
    }
};
