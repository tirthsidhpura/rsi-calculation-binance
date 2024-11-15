const [pair] = process.argv.slice(2);
const connection = require('../dbconnect');

const WebSocket = require('ws');
console.log({pair});

function connectToBinanceWebSocket() {
  // Connect to Binance's WebSocket API for the BTC/USDT trading pair
  const socket = new WebSocket(`wss://fstream.binance.com:443/ws/${pair}@kline_1m`);

  // Handle messages received from the WebSocket
  socket.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.e === 'kline') {
      const candle = message.k;
      var query = `UPDATE ${pair}_data SET close_price = ${candle.c}, high_value =  ${candle.h}, low_value = ${candle.l}, volume_value = ${candle.v}, timestamp = ${candle.t} WHERE status = 1; `
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
            
        }
    })
    //   console.log(`[${new Date(candle.t).toLocaleTimeString()}] Open: ${candle.o}, High: ${candle.h}, Low: ${candle.l}, Close: ${candle.c}`);
      if(candle.x == true) {
        var query = `UPDATE ${pair}_data SET close_price = ${candle.c}, high_value =  ${candle.h}, low_value = ${candle.l}, volume_value = ${candle.v}, timestamp = ${candle.t}, status = 2 WHERE status = 1; `
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
            let query = `INSERT INTO ${pair}_data (close_price, high_value, low_value, volume_value, status, timestamp) VALUES (${candle.c},${candle.h}, ${candle.l}, ${candle.v},1,${candle.t})`
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
                    
                }
            })
          }
      })
        //   console.log(`[${new Date(candle.t).toLocaleTimeString()}] Open: ${candle.o}, High: ${candle.h}, Low: ${candle.l}, Close: ${candle.c}`);
        
      }
    }
  });

  // Send a message to subscribe to the WebSocket's candlestick data
  socket.on('open', () => {
    socket.send(JSON.stringify({
      method: 'SUBSCRIBE',
      params: [`${pair}@kline_1h`],
      id: 1,
    }));
  });

  // Handle errors and reconnect the WebSocket after a delay
  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
    const eventData = {
      error: 'error',
      payload: { pair: pair}
  };
    process.send(eventData);
  });
}


process.on('message', (message) => {
  if (message === 'exit') {
    process.exit(); // Terminate the child process
  }
});

// Call the function to connect to the WebSocket
connectToBinanceWebSocket();