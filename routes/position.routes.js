const Router = require('koa-router');

const paramsValidator = require('../middleware/validators/params.validator');
const position = require('../controllers/position.controller');

const router = new Router({ prefix: '/api' });

router.get('/position', paramsValidator, position.getAll);
router.get('/position/:code', position.get);
router.get('/price', paramsValidator, position.priceAll);

module.exports = router.routes();
