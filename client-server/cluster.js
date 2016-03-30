'use strict';
let cluster = require('cluster');
const numOfCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  console.log(`Master cluster setting up ${numOfCPUs} workers`);
  for (let i = 0; i < numOfCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  let startServer = require('./server.js');
  startServer();
}
