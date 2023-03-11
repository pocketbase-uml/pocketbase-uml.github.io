#!/usr/bin/env node

import figlet from 'figlet';
import http from 'node:http';
import handler from 'serve-handler';

console.log(figlet.textSync('PocketBaseUML', { font: 'Big' }));

let port;
try {
  port = Number.parseInt(process.argv[2], 10);
  if (Number.isNaN(port)) throw new Error();
} catch (error) {
  console.log('Usage: pocketbase-uml <port>\n');
  process.exit(1);
}

http
  .createServer((request, response) => {
    return handler(request, response, { public: 'app', etag: true });
  })
  .listen(port, () => {
    console.log(`Running at http://localhost:${port}, press Ctrl+C to stop...`);
  });
