const Controller = require('./controller');
const sectorServiceProvider = require('../providers/sector.provider');

module.exports = class SectorController extends Controller {
    static async list(req, res) {
        const sectorService = sectorServiceProvider();

        const sectorList = await sectorService.list();

        res.json(sectorList);
    }

    static async find(req, res) {
        const sectorService = sectorServiceProvider();

        const sector = await sectorService.findById(req.params.id);

        res.json(sector);
    }

    static async findByVar(req, res) {
        const sectorService = sectorServiceProvider();

        const filter = {};
        filter[req.params.name] = req.params.value;
        const sector = await sectorService.find(filter);

        res.json(sector);
    }

    static async create(req, res) {
        Controller.validationResult(req);
        const { name } = Controller.matchData(req);

        const sectorService = await sectorServiceProvider();
        const { _id } = await sectorService.create(name);
        const sector = await sectorService.findById(_id);

        res.json(sector);
    }

    static async update(req, res) {
        const body = Controller.matchData(req);

        const sectorService = sectorServiceProvider();
        await sectorService.update({
            ...body,
            _id: req.params.id,
        });

        const sector = await sectorService.findById(req.params.id);

        res.json(sector);
    }

    static async delete(req, res) {
        const sectorService = sectorServiceProvider();

        const sector = await sectorService.delete(req.params.id);

        res.json(sector);
    }
};
