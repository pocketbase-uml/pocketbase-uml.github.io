#!/usr/bin/env node

const http = require('node:http');
const { join } = require('node:path');
const { program } = require('commander');
const figlet = require('figlet');
const handler = require('serve-handler');
const { version } = require('./package.json');

program.version(version).option('-p, --port <port>', 'port to run on', '9000');
program.parse();
const options = program.opts();

const { port } = options;

console.log(figlet.textSync('PocketBaseUML', { font: 'Big' }));

http
  .createServer((request, response) => {
    return handler(request, response, {
      public: join(__dirname, 'app'),
      etag: true
    });
  })
  .listen(port, () => {
    console.log(
      `PocketBaseUML v${version} listening at http://localhost:${port}, press Ctrl+C to stop...`
    );
  });
