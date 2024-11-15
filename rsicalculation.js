require('dotenv').config();
const rsiid = process.pid;
console.log({rsiid})
require('./script');
require('./fetchpair/fetchpair');
require('./fetchdata/fetchdata');
require('./websocket/listener');
require('./calculation/calculationlistener');
require('./handler/closeallpair');
const WebSocket = require('ws');

const emitter = require('./eventemitter/commonemmiter');
const pairemitter = emitter.commonEmitter;


// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

// Event handler for new client connections
wss.on('connection', (ws) => {
  // console.log('A client connected');

  // Handle WebSocket messages
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  // Register an event listener for the event emitter
  // const eventListener = (data) => {
  //   console.log('came here')
  // };
  
  pairemitter.on('sharedrsi',(data) => {
    ws.send(data)
  })

  // Remove the event listener when the WebSocket connection is closed
  ws.on('close', () => {
    console.log('A client disconnected');
    // pairemitter.off('sharersi', eventListener);
  });
});


console.log('WebSocket server is running on port 8080');