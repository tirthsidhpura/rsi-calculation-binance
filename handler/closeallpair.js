var cron = require('node-cron');
const calculationprocess = require('../process/calculationprocess');
const websocketprocess = require('../process/websocketprocess');
const connection = require('../dbconnect');

function stopcalculation() {
    for (let i = calculationprocess.length - 1; i >= 0; i--) {
        const child = calculationprocess[i];
        child.childprocess.send('exit');
        calculationprocess.splice(i, 1);
        console.log(calculationprocess)
    }
    
}


function stopws() {

    for (let i = websocketprocess.length - 1; i >= 0; i--) {
        const child = websocketprocess[i];
        child.childprocess.send('exit');
        websocketprocess.splice(i, 1);
    }
    
}


const truncatealldb = () => {
    try {
        const showTablesQuery = "SHOW TABLES";

        connection.query(showTablesQuery, (err, results) => {
          if (err) {
            console.error('Error fetching table names:', err);
          }
      
          // Array to store table names
          const tableNames = results.map((result) => Object.values(result)[0]);
      
          // Drop each table
          tableNames.forEach((tableName) => {
            const dropTableQuery = `DROP TABLE ${tableName}`;
      
            connection.query(dropTableQuery, (err) => {
              if (err) {
                console.error(`Error dropping table ${tableName}:`, err);
                return;
              }

              console.log(`Table ${tableName} dropped.`);
            });
          });
        });
    } catch (error) {
        console.log(error);
    }
}

const closeallpair = async () => {
    try {
        console.log("CRON JOB FOR DELETING ALL STARTED");
        await stopcalculation();
        await stopws();
        await truncatealldb();
    } catch (error) {
        console.log(error);
    }
}


// setTimeout(() => {
//     closeallpair(); 
// }, 1000000);

// closeallpair();



cron.schedule('55 9 * * *', closeallpair);