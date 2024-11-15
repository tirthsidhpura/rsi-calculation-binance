const emitter = require('../eventemitter/commonemmiter');
const axios = require('axios');
const connection = require('../dbconnect');
const pairemitter = emitter.commonEmitter;

const fetchdata = async (pair) => {
    try {
        let data = await axios.get(`https://fapi.binance.com/fapi/v1/klines?interval=1m&symbol=${pair}&limit=500`)
        
        let pairdata  = data.data;
        pairdata.splice(-1);
        // console.log(pairdata.length);

        const promisedatainserted = pairdata.map(async pairdata => {
            let query = `INSERT INTO ${pair}_data (close_price, high_value, low_value, volume_value, status, timestamp) VALUES (${pairdata[4]},${pairdata[2]}, ${pairdata[3]}, ${pairdata[5]}, 2, ${pairdata[0]})`

             connection.query(query, async (err,result) => {
                if(err) { console.log(err) }
                else{
                    // pairemitter.emit('tablecreated', pair)
                    // console.log(`${pair}'s data inserted in db`)
                }
            })
        })


        await Promise.all(promisedatainserted).then(() => {
            console.log('all data inserted')
            pairemitter.emit('datainserted', pair);
        }).catch((err) => console.log(err))

    } catch (error) {
        console.log(error)
    }
}


pairemitter.on('tablecreated', (pair) => {
    console.log(pair)
    fetchdata(pair)
})