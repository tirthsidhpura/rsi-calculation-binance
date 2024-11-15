const emitter = require('../eventemitter/commonemmiter');
const { pairfail } = require('../handler/closepairandstart');
const pairemitter = emitter.commonEmitter;
const calculationprocess = require('../process/calculationprocess');
const { fork } = require('child_process');


const startcalculation = (pair) => {
    try {
        const child = fork('./calculation/rsicalculation.js', [pair]);
        
        calculationprocess.push({pair:pair, childprocess: child});
        child.on('message', (message) => {
    // Check if the message represents an event
            // console.log(message)
            if (message.eventName) {
            // Handle the event here
            let data = JSON.stringify([message.payload])
            pairemitter.emit('sharedrsi' , data)
            //   console.log(message.eventName, message.payload);
            }
            else if(message.error) {
                console.log("error in calculating rsi")
                const currentTime = new Date();
                const currentHour = currentTime.getHours();
                const currentMinute = currentTime.getMinutes();

                if (!(currentHour === 9 && currentMinute >= 54) && !(currentHour === 10 && currentMinute === 4)) {
                    let data = message.payload
                    console.log(data.pair)
                    pairfail(data.pair)
                }
            }
        });
 
    } catch (error) {
        console.log(error);
    }
}


// Function to kill all child processes
// function killChildProcesses() {
//     calculationprocess.forEach((child) => {
//       child.childprocess.send('exit');
//     });
//   }

pairemitter.on('startcalculation', (pair) => {
    console.log(`${pair}'s rsi calculation will start now in 10 seconds`);
    setTimeout(() => {
        startcalculation(pair)
    }, 10000);
})



