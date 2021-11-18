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

//3
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Unicorns')
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: '$gender', //_id indica il campo su cui fare i gruppi, non esattamente l'ID
            totale: { $sum: 1 },
          },
        },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 3', data);
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

//4
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Unicorns')
      .aggregate([
        {
          $group: {
            _id: { gender: '$gender' }, //_id indica il campo su cui fare i gruppi, non esattamente l'ID
            mediaVampiri: { $avg: '$vampires' },
          },
        },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 4', data);
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

//5
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Unicorns')
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: { gender: '$gender', hair: '$hair' }, //_id indica il campo su cui fare i gruppi, non esattamente l'ID
            nEsemplari: { $sum: 1 },
          },
        },
        { $sort: { nEsemplari: -1, _id: -1 } },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 5', data);
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

//6
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Unicorns')
      .aggregate([
        { $match: { gender: { $exists: true } } },
        {
          $group: {
            _id: {}, //_id indica il campo su cui fare i gruppi, non esattamente l'ID
            media: { $avg: '$vampires' },
          },
        },
        { $project: { _id: 0, media: 1 } },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 6', data);
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

//7
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Quizzes')
      .aggregate([
        {
          $project: {
            quizAvg: { $avg: '$quizzes' },
            labAvg: { $avg: '$labs' },
            examAvg: { $avg: ['$midterm', '$final'] },
          },
        },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 7', data);
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

//7b
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Quizzes')
      .aggregate([
        {
          $project: {
            quizAvg: { $avg: '$quizzes' },
            labAvg: { $avg: '$labs' },
            examAvg: { $avg: ['$midterm', '$final'] },
          },
        },
        {
          $group: {
            _id: {},
            mediaQuiz: { $avg: '$quizAvg' },
            mediaLab: { $avg: '$labAvg' },
            mediaExam: { $avg: '$examAvg' },
          },
        },
        {
          $project: {
            mediaQuiz: { $round: ['$mediaQuiz', 2] },
            mediaLab: { $round: ['$mediaLab', 2] },
            mediaExam: { $round: ['$mediaExam', 2] },
          },
        },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 7b', data);
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

//8
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let regex = new RegExp('F', 'i'); //non è case sensitive quindi maiuscola o minuscola non cambia
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Students')
      .aggregate([
        { $match: { genere: { $regex: regex } } },
        { $project: { nome: 1, mediaVoti: { $avg: '$voti' } } },
        { $sort: { mediaVoti: -1 } },
        { $skip: 1 },
        { $limit: 1 },
      ])
      .toArray()
      .then((data) => {
        console.log('Query 8', data);
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

//9
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Orders')
      .aggregate([
        { $project: { status: 1, nDettagli:1 } },
        { $unwind:"$nDettagli"},
        { $group:{_id:"$status",sommaDettagli:{$sum:"$nDettagli"}}}

      ])
      .toArray()
      .then((data) => {
        console.log('Query 9', data);
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

//10
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //amount se usata a destra dei : si mette $ se invece li uso come chiave non ci vuole
    db.collection('Students')
      .find({
        $expr:{$gte:[{$year:"$nato"},2000]}
      }
      )
      .toArray()
      .then((data) => {
        console.log('Query 10', data);
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