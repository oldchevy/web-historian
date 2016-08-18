var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var workers = require('../workers/htmlfetcher.js');
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
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      var url = body.split('=')[1];
      workers.fetchHTML(url);

      archive.isUrlInList(url, function(bool) {
        console.log('Current URL: ', url, '\nCurrent Bool: ', bool);
        if (!bool) {
          //If it's not in the list, add it to the list
          archive.addUrlToList(url, function() {
            res.writeHead(302);
            res.end();
          });
        } else {
          //Don't add it to the list
          httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html');
        }
        //Check to see if it's in the archive
          //if yes, serve it up
          //if no, redirect to loading page
      });
    });

  }
  //res.end(archive.paths.list);
};