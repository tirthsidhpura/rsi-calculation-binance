# RSI Calculation in Node.js

This repository provides a Node.js application that calculates the **Relative Strength Index (RSI)** and other technical indicators like Moving Average (MA) for cryptocurrency pairs. The application uses WebSockets to stream live RSI and MA data.

## Database Setup

First, you need to create a MySQL database and table for storing RSI calculations.

### SQL

```sql
CREATE DATABASE IF NOT EXISTS rsicalculatondb;

USE rsicalculatondb;

```

Make sure to update your MySQL connection settings in the code if necessary.

## Installation

Clone this repository and navigate into the project directory:

```bash
git clone <your-repo-url>
cd <your-project-directory>
```

Install the necessary dependencies:

```bash
npm install
```

## Usage

To start the RSI calculation service, run the following command:

```bash
node rsicalculation.js
```

The script will automatically start calculating the RSI for the pairs listed in `fetchpair/fetchpair.js`.

### Fetch Pairs

You can define the pairs for RSI calculation in the file:

```
fetchpair/fetchpair.js
```

Update the file with the pairs you want to monitor.

## WebSocket API

You can listen to live updates for RSI and Moving Average (MA) using WebSocket.

### WebSocket URL

```txt
ws://localhost:3000
```

### Available Data Streams

- **RSI**: Provides live RSI values for the configured pairs.
- **MA**: Provides live Moving Average values.

You can connect to the WebSocket server and subscribe to the data streams as needed.

## Example WebSocket Client

Here’s an example of how you can connect to the WebSocket server using a simple WebSocket client:

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Connected to WebSocket server.');
    // Example subscription for a pair
    ws.send(JSON.stringify({ type: 'subscribe', pair: 'BTC/USDT', indicator: 'RSI' }));
});

ws.on('message', (data) => {
    console.log('Received:', JSON.parse(data));
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server.');
});
```

## Technologies Used

- **Node.js**: For server-side scripting and handling WebSocket connections.
- **MySQL**: For storing calculated RSI values.
- **WebSocket**: For real-time data streaming.
- **JavaScript**: For scripting and technical indicator calculations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries, feel free to reach out:

- **Email**: sidhpuratirth5126@gmail.com
- **Website**: [Your Website](https://yourwebsite.com)