import * as mongodb from 'mongodb';

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017';
const DB_NAME = '5B';

//PROMISE
//1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Orders')
      .aggregate([
        { $match: { status: 'A' } },
        { $group: { _id: '$cust_id', totale: { $sum: '$amount' } } },
        { $sort: { totale: -1 } },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 1', data);
      })
      .catch((err) => {
        console.log('Errore esecuzione query: ' + err.message);
      })
      .finally(() => {
        client.close();
      });
  } else {
    console.log('Errore connessione al db: ' + err.message);
  }
});

//2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Orders')
      .aggregate([
        {
          $group: {
            _id: '$cust_id',
            avgAmount: { $avg: '$amount' },
            avgTotal: { $avg: { $multiply: ['$qta', '$amount'] } },
          },
        },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 2', data);
      })
      .catch((err) => {
        console.log('Errore esecuzione query: ' + err.message);
      })
      .finally(() => {
        client.close();
      });
  } else {
    console.log('Errore connessione al db: ' + err.message);
  }
});
