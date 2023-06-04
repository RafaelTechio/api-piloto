const notificationServiceProvider = require('../providers/notification.provider');
const Controller = require('./controller');

module.exports = class NotificationController extends Controller {
    static async list(req, res) {
        const notificationService = notificationServiceProvider();

        const notificationList = await notificationService.list();

        res.json(notificationList);
    }

    static async find(req, res) {
        const notificationService = notificationServiceProvider();

        const notification = await notificationService.findById(req.params.id);

        res.json(notification);
    }

    static async findByVar(req, res) {
        const notificationService = notificationServiceProvider();

        const filter = {};
        filter[req.params.name] = req.params.value;
        const notification = await notificationService.find(filter);

        res.json(notification);
    }

    static async create(req, res) {
        Controller.validationResult(req);
        const { espId, manteinerId, state, urgency, sector, content } = Controller.matchData(req);

        const notificationService = await notificationServiceProvider();
        const { _id } = await notificationService.create(espId, manteinerId, state, urgency, sector, content);
        const notification = await notificationService.findById(_id);

        res.json(notification);
    }

    static async update(req, res) {
        const body = Controller.matchData(req);

        const notificationService = notificationServiceProvider();
        await notificationService.update({
            ...body,
            _id: req.params.id,
        });

        const notification = await notificationService.findById(req.params.id);

        res.json(notification);
    }

    static async delete(req, res) {
        const notificationService = notificationServiceProvider();
        const notification = await notificationService.delete(req.params.id);

        res.json(notification);
    }
};
