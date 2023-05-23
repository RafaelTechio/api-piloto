require('express-async-errors');
const { Router } = require('express');

const MainteinerRouter = require('./mainteiner.router');
const EspRouter = require('./esp.router');

const router = Router();

router.use('/mainteiners/', MainteinerRouter);
router.use('/esps/', EspRouter);

module.exports = router;
