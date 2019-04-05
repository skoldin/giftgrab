const { MongoClient } = require('mongodb');

module.exports = function() {
  const url = process.env.MONGOLAB_URI;
  const dbName = 'giftgrab';

  async function getDb() {
    const client = await MongoClient.connect(url);

    return client.db(dbName);
  }

  async function getCol(col) {
    const db = await getDb();

    return db.collection(col);
  }

  return {
    getDb,
    getCol
  };
};
