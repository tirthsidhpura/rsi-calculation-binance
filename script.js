const { exec } = require('child_process');

// Function to kill all Node.js processes except the current one
function killAllNodeProcesses() {
  // Get the process ID of the current Node.js process
  const currentProcessId = process.pid;
  console.log({ currentProcessId });
  // Find all Node.js processes except the current one
  exec('pgrep node', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error occurred: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Command execution failed: ${stderr}`);
      return;
    }

    // Split the output into lines and process each line
    const processList = stdout.split('\n');
    processList.forEach((processId) => {
      if (processId) {
        // Skip killing the current process
        if (parseInt(processId, 10) !== currentProcessId) {
          exec(`kill ${processId}`, (killError, killStdout, killStderr) => {
            if (killError) {
              console.error(`Error occurred while killing process ${processId}: ${killError.message}`);
            } else {
              console.log(`Process ${processId} terminated.`);
            }
          });
        }
      }
    });
  });
}

// Execute the system command to get the list of running Node.js processes
exec('pgrep -l node', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Command execution error: ${stderr}`);
    return;
  }

  // Split the output into lines and process each line
  const processList = stdout.split('\n');
  const nodeProcesses = processList.filter((process) => process.includes('node'));

  if (nodeProcesses.length > 1) {
    console.log('Killing all processes except the current one.');
    killAllNodeProcesses();
  } else {
    console.log('No running instances found.');
  }
});
