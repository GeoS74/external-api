module.exports = async (ctx, next) => {
  ctx.queryParam = {
    start: Number.parseInt(ctx.query?.start, 10) || 0,
    limit: Number.parseInt(ctx.query?.limit, 10) || 100,
  };

  await next();
};
