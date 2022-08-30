const { expect } = require('chai');
const fetch = require('node-fetch');
const { validate: uuidValidate } = require('uuid');

const config = require('../config');
const app = require('../app');

describe('/test/position.test.js', () => {
  let _server;
  before(async () => {
    _server = app.listen(config.server.port);
  });

  after(async () => {
    _server.close();
  });

  describe('position for Python', () => {
    it('get positions use default query params', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/position`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 200').to.be.equal(200);
      expect(response.data, 'сервер возвращает массив').that.is.an('array');
      expect(response.data.length, 'сервер возвращает массив из 100 элементов').to.be.equal(100);
      _checkStructurePosition.call(this, response.data[0]);
    });

    it('get positions use query params', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/position/?start=5000&limit=2`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 200').to.be.equal(200);
      expect(response.data, 'сервер возвращает массив').that.is.an('array');
      expect(response.data.length, 'сервер возвращает массив из 2 элементов').to.be.equal(2);
      _checkStructurePosition.call(this, response.data[0]);
    });

    it('get positions use code', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/position/258124`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 200').to.be.equal(200);
      _checkStructurePosition.call(this, response.data);
      _checkStructureStorage.call(this, response.data.storage[0]);
      _checkStructureImages.call(this, response.data.images[0]);
    });

    it('exceeding the limit of positions', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/position/?start=9999999`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 200').to.be.equal(200);
      expect(response.data, 'сервер возвращает массив').that.is.an('array');
      expect(response.data.length, 'сервер возвращает пустой массив').to.be.equal(0);
    });

    it('position not found', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/position/99999999`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 404').to.be.equal(404);
      _checkErrorMessage.call(this, response.data);
    });

    it('error message', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/position/?start=-100`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 500').to.be.equal(500);
      _checkErrorMessage.call(this, response.data);
    });
  });

  describe('external price', () => {
    it('get price positions use default query params', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/price`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 200').to.be.equal(200);
      expect(response.data, 'сервер возвращает массив')
        .that.is.an('array');
      expect(response.data.length, 'сервер возвращает массив из 100 элементов').to.be.equal(100);
      _checkStructurePricePosition.call(this, response.data[0]);
      _checkStructurePriceStorage.call(this, response.data[0].storage[0]);
    });

    it('get price positions use query params', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/price/?start=50&limit=2`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 200').to.be.equal(200);
      expect(response.data, 'сервер возвращает массив')
        .that.is.an('array');
      expect(response.data.length, 'сервер возвращает массив из 2 элементов').to.be.equal(2);
      _checkStructurePricePosition.call(this, response.data[0]);
      _checkStructurePriceStorage.call(this, response.data[0].storage[0]);
    });

    it('exceeding the limit of price positions', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/price/?start=9999999`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 200').to.be.equal(200);
      expect(response.data, 'сервер возвращает массив').that.is.an('array');
      expect(response.data.length, 'сервер возвращает пустой массив').to.be.equal(0);
    });

    it('error message', async () => {
      const response = await fetch(`http://localhost:${config.server.port}/api/price/?start=-100`)
        .then(async (res) => ({
          status: res.status,
          data: await res.json(),
        }));

      expect(response.status, 'сервер возвращает статус 500').to.be.equal(500);
      _checkErrorMessage.call(this, response.data);
    });
  });
});

function _checkStructurePosition(data) {
  expect(data, 'сервер возвращает объект')
    .that.is.an('object')
    .to.have.keys([
      'id',
      'code',
      'article',
      'price',
      'external_id',
      'grouptitle',
      'storage',
      'title',
      'uri',
      'uri_override',
      'groupid',
      'content',
      'searchable',
      'published',
      'deleted',
      'images',
    ]);
  expect(data.id, 'свойство id должно быть числом').that.is.an('number');
  expect(data.price, 'свойство price должно быть числом').that.is.an('number');
  expect(data.groupid, 'свойство groupid должно быть числом').that.is.an('number');
  expect(uuidValidate(data.external_id), 'свойство external_id должно быть uuid').to.be.equal(true);
  expect(data.storage, 'свойство storage должно быть массивом').that.is.an('array');
  expect(data.images, 'свойство images должно быть массивом').that.is.an('array');
}

function _checkStructureStorage(data) {
  expect(data, 'сервер возвращает объект')
    .that.is.an('object')
    .to.have.keys([
      'idstorage',
      'codestorage',
      'namestorage',
      'amount',
    ]);
  expect(uuidValidate(data.idstorage), 'свойство idstorage должно быть uuid').to.be.equal(true);
  expect(data.amount, 'свойство amount должно быть числом').that.is.an('number');
}

function _checkStructureImages(data) {
  expect(data, 'сервер возвращает объект')
    .that.is.an('object')
    .to.have.keys([
      'parent',
      'name',
      'file',
      'url',
    ]);
  expect(data.parent, 'свойство parent должно быть числом').that.is.an('number');
  expect(uuidValidate(data.name), 'свойство idstorage должно быть name').to.be.equal(true);
}

function _checkStructurePricePosition(data) {
  expect(data, 'сервер возвращает объект')
    .that.is.an('object')
    .to.have.keys([
      'id',
      'code',
      'article',
      'price',
      'grouptitle',
      'storage',
      'title',
      'uri',
    ]);
  expect(data.id, 'свойство id должно быть числом').that.is.an('number');
  expect(data.price, 'свойство price должно быть числом').that.is.an('number');
  expect(data.storage, 'свойство storage должно быть массивом').that.is.an('array');
}

function _checkStructurePriceStorage(data) {
  expect(data, 'сервер возвращает объект')
    .that.is.an('object')
    .to.have.keys([
      'namestorage',
      'amount',
    ]);
  expect(data.amount, 'свойство amount должно быть числом').that.is.an('number');
}

function _checkErrorMessage(data) {
  expect(data, 'сервер возвращает описание ошибки')
    .that.is.an('object')
    .to.have.property('error');
}
