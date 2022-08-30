const config = require('../config');
const db = require('../libs/db');
const positionMapper = require('../mappers/position.mapper');
const pricePositionMapper = require('../mappers/pricePositon.mapper');
const imageMapper = require('../mappers/image.mapper');

module.exports.priceAll = async (ctx) => {
  const positions = await _getPricePosition.call(null, ctx.queryParam);

  const res = positions.map((pos) => pricePositionMapper(pos));

  ctx.body = res;
};

module.exports.getAll = async (ctx) => {
  const positions = await _getPosition.call(null, ctx.queryParam);

  const res = positions.map((pos) => positionMapper(pos));

  for (const pos of res) {
    const images = await _getImages(pos.id);
    pos.images = images.map((image) => imageMapper(image));
  }

  ctx.body = res;
};

module.exports.get = async (ctx) => {
  const positions = await _getPositionByCode.call(null, ctx.params.code);

  if (!positions.length) {
    ctx.throw(404, 'position not found');
  }

  const position = positionMapper(positions[0]);

  const images = await _getImages(position.id);
  position.images = images.map((image) => imageMapper(image));

  ctx.body = position;
};

function _getPositionByCode(code) {
  return db.query(
    `
    select 
      P.id,
      P.code, 
      P.article, 
      P.price, 
      P.external_id, 
      P.storage,
      
      S.pagetitle, 
      S.uri, 
      S.uri_override, 
      S.parent as groupid, 
      (select pagetitle from ${config.mysql.prefix}site_content where id=S.parent) as grouptitle,
      S.content, 
      S.searchable, 
      S.published, 
      S.deleted

      from ${config.mysql.prefix}ms2_products P
      join ${config.mysql.prefix}site_content S
      on P.id = S.id
      where P.code=?
    `,
    [code],
  )
    .catch((error) => {
      throw error;
    });
}

function _getImages(positionId) {
  return db.query(`
    select parent, name, file, url
    from ${config.mysql.prefix}ms2_product_files
    where product_id=?
  `, positionId)
    .catch((error) => {
      throw error;
    });
}

function _getPosition(param) {
  return db.query(
    `
    select 
      P.id,
      P.code, 
      P.article, 
      P.price, 
      P.external_id, 
      P.storage,
      
      S.pagetitle, 
      S.uri, 
      S.uri_override, 
      S.parent as groupid,  
      (select pagetitle from ${config.mysql.prefix}site_content where id=S.parent) as grouptitle,
      S.content, 
      S.searchable, 
      S.published, 
      S.deleted

      from ${config.mysql.prefix}ms2_products P
      join ${config.mysql.prefix}site_content S
      on P.id = S.id
      limit ?, ?
    `,
    [param.start, param.limit],
  )
    .catch((error) => {
      throw error;
    });
}

function _getPricePosition(param) {
  return db.query(
    `
    select
      P.id,
      P.code, 
      P.article, 
      P.price, 
      P.storage,
      
      S.pagetitle, 
      S.uri, 
      (select pagetitle from ${config.mysql.prefix}site_content where id=S.parent) as grouptitle

      from ${config.mysql.prefix}ms2_products P
      join ${config.mysql.prefix}site_content S
      on P.id = S.id
      where P.code is not null and P.code != '' and P.price != 0
      limit ?, ?
    `,
    [param.start, param.limit],
  )
    .catch((error) => {
      throw error;
    });
}
