const Koa = require('koa');

const errorInterceptor = require('./middleware/error.interceptor');
const positionRoutes = require('./routes/position.routes');

const app = new Koa();

app.use(errorInterceptor);
app.use(positionRoutes);

module.exports = app;
