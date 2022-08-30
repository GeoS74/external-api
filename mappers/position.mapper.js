module.exports = (position) => ({
  id: position.id,
  code: position.code,
  article: position.article,
  price: Number.parseFloat(position.price),
  external_id: position.external_id,
  grouptitle: position.grouptitle,
  storage: _correctJSON(position.storage),

  title: position.pagetitle,
  uri: `/${position.uri}`,
  uri_override: position.uri_override,
  groupid: position.groupid,
  content: position.content,
  searchable: position.searchable,
  published: position.published,
  deleted: position.deleted,
});

function _correctJSON(str) {
  if (!str) return [];
  return JSON.parse(str).map((e) => {
    e.amount = Number.parseInt(e.amount, 10);
    return e;
  });
}
