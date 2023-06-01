const maintainerSchema = require('../schemas/maintainer.schema');
const MongoRepository = require('./mongo.repository');

class maintainerMongoRepository extends MongoRepository {}

module.exports = new maintainerMongoRepository(maintainerSchema, 'maintainer');
