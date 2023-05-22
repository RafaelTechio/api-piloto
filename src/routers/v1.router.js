require('express-async-errors');
const { Router } = require('express');

const MainteinerRouter = require('./mainteiner.router');

const router = Router();

router.use('/mainteiners/', MainteinerRouter);

module.exports = router;
