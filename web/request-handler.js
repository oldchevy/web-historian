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
    } else if (req.url === '/styles.css') {
      httpHelpers.serveAssets(res, archive.paths.siteAssets + req.url);
    } else {
      archive.isUrlArchived(req.url, function(boolean) {

        console.log('Archive Boolean:', boolean);

        if (boolean) {
          httpHelpers.serveAssets(res, archive.paths.archivedSites + req.url);
        } else {

          archive.isUrlInList(req.url, function(bool) {
            console.log('List Boolean', bool);
            if (bool) {
              httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html');
            } else {
              res.writeHead(404);
              res.end('404 sari gurl');            
            }
          });
        }
      });      
    }
  }

  if (req.method === 'POST') {
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      var url = body.split('=')[1];
      //workers.fetchHTML(url);

      archive.isUrlInList(url, function(bool) {
        console.log('Current URL: ', url, '\nCurrent Bool: ', bool);
        if (!bool) {
          //If it's not in the list, add it to the list
          archive.addUrlToList(url, function() {
            console.log('wasnt in list yet, now redirect');
            res.writeHead(302, {location: url});
            res.end();
          });

        } else {
          console.log('Already in list, redirect');
          res.writeHead(302, {location: url});
          res.end();
        }


      });
    });

  }
  //res.end(archive.paths.list);
};