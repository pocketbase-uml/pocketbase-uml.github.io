#!/usr/bin/env node

const http = require('node:http');
const { join } = require('node:path');
const { program, Option } = require('commander');
const figlet = require('figlet');
const handler = require('serve-handler');
const { version, description } = require('./package.json');

const name = 'PocketBaseUML';

const { port } = program
  .name(name)
  .version(version)
  .description(description)
  .addOption(new Option('-p, --port <port>', 'port to listen on').default(9000).argParser(parseInt))
  .parse()
  .opts();

if (isNaN(port) || port < 1 || port > 65535) {
  console.error('Port must be a valid number between 1 and 65535.');
  process.exit(1);
}

console.log(figlet.textSync(name, { font: 'Big' }));

http
  .createServer((request, response) =>
    handler(request, response, {
      public: join(__dirname, 'app'),
      etag: true,
      directoryListing: false
    })
  )
  .listen(port, () => {
    console.log(
      `${name} v${version} listening at http://localhost:${port}, press Ctrl+C to stop...`
    );
  });
