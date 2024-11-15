const connection = require('../dbconnect');


const [pair] = process.argv.slice(2);

const calculate = (prices, period = 7, pair, lastprice) => {
    try {

    let gains = [];
    let losses = [];
    // console.log(prices[prices.length - 1])
    
    for (let i = 1; i < prices.length; i++) {
      let change = prices[i] - prices[i - 1];
      if (change >= 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(-change);
      }
    }

  // calculating avg / period 
    let avgGain = gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    let rs = avgGain / avgLoss;
    let rsi = 100 - (100 / (1 + rs));

  // smoothing of data
    for (let i = period; i < prices.length; i++) {
      let change = prices[i] - prices[i - 1];
      let gain = 0;
      let loss = 0;
      if (change >= 0) {
        gain = change;
      } else {
        loss = -change;
      }
      avgGain = ((avgGain * (period - 1)) + gain) / period;
      avgLoss = ((avgLoss * (period - 1)) + loss) / period;
  
      rs = avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
    }
      
      let ma = prices.slice(-200).reduce((x,y) => x + y, 0) / 200;
    // Emit an event from the child process
        const eventData = {
            eventName: 'customEvent',
            payload: { pair: pair,   rsi:rsi,  lastprice: lastprice, ma: ma}
        };
        
        // Send the event data to the parent process
        process.send(eventData);
    
    // console.log({pair:pair, rsi:rsi.toFixed(2)})
} catch (error) {
      
      const eventData = {
        error: 'error',
        payload: { pair: pair}
    };
    
  process.send(eventData);
  console.log(error)    
}
  };


const calculatersi = async () => {
    try {
        var query = `SELECT * FROM ${pair}_data ORDER BY id DESC LIMIT 500;`

        connection.query(query, (err,result) => {
            if(err) { 
              console.log(err)
              const eventData = {
                error: 'error',
                payload: { pair: pair}
            };
            
            process.send(eventData);
            }
            else{
                const prices = result.map(candle => parseFloat(candle.close_price));
                const timestamp = result.map(timestamp => (timestamp.update_time));
                
           
                // calculate(prices.reverse(), 14,pair);
                calculate(prices.reverse(), 7,pair, prices[prices.length - 1]);
           
            }
        })

    } catch (error) {
      console.log(err)
        const eventData = {
          error: 'error',
          payload: { pair: pair}
      };
    
        process.send(eventData);
        // console.log(error)
    }
}


// setTimeout(() => {
//   if(pair == "tomousdt"){
//     console.log('time out for ' , pair);
//     const eventData = {
//       error: 'error',
//       payload: { pair: pair}
//   }
//   process.send(eventData);
// };
// }, 50000);

process.on('message', (message) => {
  if (message === 'exit') {
    process.exit(); // Terminate the child process
  }
});


setInterval(calculatersi, 1000)