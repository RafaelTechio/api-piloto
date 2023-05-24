require('express-async-errors');
const { Router } = require('express');

const MainteinerRouter = require('./mainteiner.router');
const HistoricRouter = require('./historic.router');

const router = Router();

router.use('/mainteiners/', MainteinerRouter);
router.use('/historics/', HistoricRouter);


module.exports = router;
