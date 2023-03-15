#!/usr/bin/env node

const http = require('node:http');
const { join } = require('node:path');
const figlet = require('figlet');
const handler = require('serve-handler');

console.log(figlet.textSync('PocketBaseUML', { font: 'Big' }));

let port = 9000;
if (process.argv.length > 2) {
  try {
    port = Number.parseInt(process.argv[2], 10);
    if (Number.isNaN(port)) throw new Error();
  } catch (error) {
    console.log('Usage: pocketbase-uml [port]\n');
    process.exit(1);
  }
}

http
  .createServer((request, response) => {
    return handler(request, response, {
      public: join(__dirname, 'app'),
      etag: true
    });
  })
  .listen(port, () => {
    console.log(`Running at http://localhost:${port}, press Ctrl+C to stop...`);
  });
