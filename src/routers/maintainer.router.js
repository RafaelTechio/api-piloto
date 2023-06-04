const { Router } = require('express');
const MainteinerController = require('../controllers/maintainer.controller');
const createMainteinerValidation = require('../validations/mainteiner/create-maintainer.validation');
const updateMainteinerValidation = require('../validations/mainteiner/update-maintainer.validation');

const router = Router();

router.get('/', MainteinerController.list);
router.get('/:id', MainteinerController.find);
router.get('/:name/:value', MainteinerController.findByVar);
router.post('/', ...createMainteinerValidation, MainteinerController.create);
router.put('/:id', ...updateMainteinerValidation, MainteinerController.update);
router.delete('/:id', MainteinerController.delete);

module.exports = router;
