var cron = require('node-cron');
const axios = require('axios');
const connection = require('../dbconnect');
const emitter = require('../eventemitter/commonemmiter')
const pairemitter =  emitter.commonEmitter;

const fetchpair = async () => {
    try {

        // let pair = await axios.get(process.env.fetchingpairurl);
        // console.log(pair.data);

        // let allpair = pair.data;
        
        //  let allpair = ['TOMOUSDT', 'BTCUSDT', 'IMXUSDT', 'AMBUSDT', 'HIGHUSDT', 'MASKUSDT', 'IOTAUSDT', 'OMGUSDT' , 'FILUSDT', 'XEMUSDT', 'ARPAUSDT', 'FETUSDT'];
        let allpair = ['TOMOUSDT', 'BTCUSDT', 'IMXUSDT', 'ETHUSDT'];

        console.log("all pair length " , allpair.length)

        // const createtables = allpair.map(async pair => {
            
            
        // let query = `CREATE TABLE IF NOT EXISTS ${pair}_data (
        //   id INT AUTO_INCREMENT PRIMARY KEY,
        //   close_price TEXT,
        //   high_value TEXT,
        //   low_value TEXT,
        //   volume_value INT,
        //   status VARCHAR(20)
        // );`;

        //         connection.query(query, async (err,result) => {
        //             if(err) {console.log(err)}
        //             else{
        //                 console.log(result)
        //                 pairemitter.emit('tablecreated', pair)
        //                 // console.log(`${pair}'s db created successfully`);
        //             }
        //         })
        // })
        
        
        const createTables = async (pair, i)   => {
          
          setTimeout(() => {
            let query = `CREATE TABLE IF NOT EXISTS ${pair}_data (
              id INT AUTO_INCREMENT PRIMARY KEY,
              close_price TEXT,
              high_value TEXT,
              low_value TEXT,
              volume_value TEXT,
              status VARCHAR(20),
              timestamp TEXT,
              update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
            );`;

            try {
               connection.query(query, (err,result) => {
                if(err) {
                  console.log(err)
                }
                else {
                  console.log("This pair db is created", pair);
                  pairemitter.emit('tablecreated', pair);
                }
              });
            } catch (err) {
              console.log(err);
            }
          }, i * 20000);
          
        };
          for (let i = 0; i < allpair.length; i++) {
            let pair = allpair[i].toLowerCase();
            createTables(pair, i);
          }
    } catch (error) {
        console.log(error)
    }
}


fetchpair();
// setTimeout(() => {
//   fetchpair();
// }, 10000);


cron.schedule('5 10 * * *', fetchpair);