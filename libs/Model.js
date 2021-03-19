const MongoClient = require('mongodb').MongoClient;

class Model {

  dbURL = "mongodb://localhost:27017/software1";
  dbName = "software1";
  dbRefrance;
  collectionName;

  connect(callback) {
    MongoClient.connect(this.dbURL, (err, db) => {
      if (err) throw err;
      this.dbRefrance = db.db(this.dbName);
      callback();
    })
  }

  insert(insertedObj, callBack = () => { }) {
    this.connect(() => {
      this.dbRefrance.collection(this.collectionName).insert(insertedObj, (insertErr, data) => {
        if (insertErr) throw insertErr;
        let status = 0;
        callBack(status);
      });
    })
  }

  getOne(where = {}, callBack = () => { }) {
    this.connect(() => {
      this.dbRefrance.collection(this.collectionName).findOne(where, (findErr, data) => {
        if (findErr) throw findErr;
        callBack(data);
      })
    })
  }

  getAll(where = {}, order = {}, callBack = () => { }) {
    this.connect(() => {
      this.dbRefrance.collection(this.collectionName).find(where).sort(order).toArray((findErr, data) => {
        if (findErr) throw findErr;
        callBack(data);
      })
    })
  }

  update(where = {}, newvalues = {}, callBack = () => { }) {
    this.connect(() => {
      this.dbRefrance.collection(this.collectionName).updateOne(where, { $set: newvalues }, (updateErr, status) => {
        if (updateErr) throw updateErr;
        callBack(status);
      })
    })
  }
}

module.exports = Model