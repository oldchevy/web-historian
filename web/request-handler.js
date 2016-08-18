var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('Request details -- \n Method: ', req.method, ', url: ', req.url);
  console.log(archive.isUrlInList('example1.com'));
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, archive.headers);
      var index = fs.readFileSync('./web/public/index.html');
      res.end(index);
    }
    if (req.url === '/styles.css') {
      res.writeHead(200, archive.headers);
      var index = fs.readFileSync('./web/public/styles.css');
      res.end(index);
    }

  }
  //res.end(archive.paths.list);
};