require("dotenv").config();

const { MongoClient } = require("mongodb");
const { connect } = require("../Routes/router");

const uri = process.env.DB_CONSTRING;

const client = new MongoClient(uri);

module.exports = modifyMany = async () => {
  try {
    await client.connect().then(async () => {
      console.log("connected");
      const db = client.db("gallery-cluster");
      const collectionExc = db.collection("excursions");
      const collectionExh = db.collection("exhibitions");
      const collectionNews = db.collection("news");

      await collectionExc
        .updateMany({}, { $set: { approvalStatus: 0 } }, { upsert: false })
        .then(() => console.log("Updated Good!"))
        .catch((e) => console.log(e));
      await collectionExh
        .updateMany({}, { $set: { approvalStatus: 0 } }, { upsert: false })
        .then(() => console.log("Updated Good!"))
        .catch((e) => console.log(e));
      await collectionNews
        .updateMany({}, { $set: { approvalStatus: 0 } }, { upsert: false })
        .then(() => console.log("Updated Good!"))
        .catch((e) => console.log(e));
    });
  } catch (error) {
    console.log("bad error");
    console.log(error);
  } finally { 
    await client.close().then(() => console.log("client closed"));
  }
};
