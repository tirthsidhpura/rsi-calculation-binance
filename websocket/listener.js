const websocketprocess = require('../process/websocketprocess')
const emitter = require('../eventemitter/commonemmiter');
const pairemitter = emitter.commonEmitter;
const connection = require('../dbconnect');
const { fork } = require('child_process');
const { pairfail } = require('../handler/closepairandstart');
// require('')
const fetchdata = (pair) => {
    try {
        let query = `INSERT INTO ${pair}_data (close_price, high_value, low_value, volume_value, status) VALUES (0,0, 0, 0, 1)`
        connection.query(query, (err,result) => {
            if(err) {/* console.log(err) */}
            else{
                const child = fork('./websocket/websocket.js', [pair]);

                websocketprocess.push({pair:pair, childprocess: child})

                pairemitter.emit('startcalculation',pair);

                child.on('message', (message) => {
                    if(message.error) {
                        console.log("error in websocket")

                        const currentTime = new Date();
                        const currentHour = currentTime.getHours();
                        const currentMinute = currentTime.getMinutes();
        
                        if (!(currentHour === 9 && currentMinute >= 54) && !(currentHour === 10 && currentMinute === 4)) {
                            let data = message.payload
                            pairfail(data.pair)
                        }
                    }
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}





pairemitter.on('datainserted', (pair) => {
    console.log(`${pair}'s websocket will start now`)
    fetchdata(pair)
})