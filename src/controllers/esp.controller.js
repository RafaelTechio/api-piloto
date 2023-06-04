const Controller = require('./controller');
const espServiceProvider = require('../providers/esp.provider');

module.exports = class EspController extends Controller {
    static async list(req, res) {
        const espService = espServiceProvider();

        const espList = await espService.list();

        res.json(espList);
    }

    static async find(req, res) {
        const espService = espServiceProvider();

        const esp = await espService.findById(req.params.id);

        res.json(esp);
    }

    static async findByVar(req, res) {
        const espService = espServiceProvider();

        const filter = {};
        filter[req.params.name] = req.params.value;
        const esp = await espService.find(filter);

        res.json(esp);
    }

    static async create(req, res) {
        Controller.validationResult(req);
        const { mac } = Controller.matchData(req);

        const espService = espServiceProvider();
        const { _id } = await espService.create(mac);
        const esp = await espService.findById(_id);

        res.json(esp);
    }

    static async update(req, res) {
        const body = Controller.matchData(req);

        const espService = espServiceProvider();
        await espService.update({
            ...body,
            _id: req.params.id,
        });

        const esp = await espService.findById(req.params.id);

        res.json(esp);
    }

    static async delete(req, res) {
        const espService = espServiceProvider();

        const esp = await espService.delete(req.params.id);

        res.json(esp);
    }
};
