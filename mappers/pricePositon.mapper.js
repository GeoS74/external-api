module.exports = (position) => ({
  id: position.id,
  code: position.code,
  article: position.article,
  price: Number.parseFloat(position.price),
  grouptitle: position.grouptitle,
  storage: _correctJSON(position.storage),
  title: position.pagetitle,
  uri: `/${position.uri}`,
});

function _correctJSON(str) {
  if (!str) return [];
  return JSON.parse(str).map((e) => ({
    namestorage: e.namestorage,
    amount: Number.parseInt(e.amount, 10),
  }));
}
