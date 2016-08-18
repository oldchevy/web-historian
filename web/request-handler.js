var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('Request details -- \n Method: ', req.method, ', url: ', req.url);
  // console.log(archive.isUrlInList('example1.com'));
  if (req.method === 'GET') {
    if (req.url === '/') {
      httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html');
    }
    if (req.url === '/styles.css') {
      httpHelpers.serveAssets(res, archive.paths.siteAssets + req.url);
    }

    archive.isUrlArchived(req.url, function(boolean) {

      if (boolean) {
        httpHelpers.serveAssets(res, archive.paths.archivedSites + req.url);
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  }

  if (req.method === 'POST') {

  }
  //res.end(archive.paths.list);
};