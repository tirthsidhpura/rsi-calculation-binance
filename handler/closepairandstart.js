const calculationprocess = require('../process/calculationprocess');
const websocketprocess = require('../process/websocketprocess');
const emitter = require('../eventemitter/commonemmiter')
const pairemitter =  emitter.commonEmitter;
const connection = require('../dbconnect');

function stopcalculation(pair) {
    calculationprocess.forEach((child, index) => {
      if (child.pair.includes(pair)) {
        child.childprocess.send('exit');
        // console.log({index})
        // console.log(calculationprocess)
        calculationprocess.splice(index, 1);
        // console.log(calculationprocess)
      }
    });
}

function stopws(pair, index) {
    websocketprocess.forEach((child) => {
      if (child.pair.includes(pair)) {
        child.childprocess.send('exit');
        websocketprocess.splice(index, 1);
      }
    });
}

const deletetable = (pair) => {
    try {

        const deleteTableQuery = `DROP TABLE IF EXISTS ${pair}_data;`

        connection.query(deleteTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Table deleted successfully!');
        return true
        });
    } catch (error) {
        console.log(error)
    }
}


const startpairagain = (pair) => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS ${pair}_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          close_price TEXT,
          high_value TEXT,
          low_value TEXT,
          volume_value TEXT,
          restart TEXT,
          status VARCHAR(20),
          timestamp TEXT,
          update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );`;

        connection.query(query, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            pairemitter.emit('tablecreated', pair);
            
          }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.pairfail = async (pair) => {
    try {
        console.log('pair failed', pair)
        await stopcalculation(pair);
        await stopws(pair);
        await deletetable(pair); 
        await startpairagain(pair);
    } catch (error) {
        console.log(error);
    }
} 