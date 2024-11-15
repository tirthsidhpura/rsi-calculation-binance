module.exports = {
  apps: [
    {
      name: 'pre_start_script',
      script: 'script.js',
      exec_mode: 'fork',
      autorestart: false,
      wait_ready: true,
      listen_timeout: 5000,
      max_restarts: 0,
      instances: 1,
      cron_restart: '', // To prevent automatic restart of this process
    },
    {
      name: 'main_process',
      script: 'rsicalculation.js',
      // Rest of your configuration for the main process goes here
      instances: 1,
      autorestart: true,
      max_restarts: 100, // Adjust the number of restarts as per your requirements
      cron_restart: '', // Disable automatic restarts for now
      watch: false, // Disable watching file changes
      ignore_watch: ['node_modules'], // Ignore changes in specified directories
      exec_mode: 'fork',
      wait_ready: true,
      listen_timeout: 5000,
      merge_logs: true,
    },
  ],
};
