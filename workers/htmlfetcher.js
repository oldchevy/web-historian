// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

exports.fetchHTML = function(url) {

  //Grab all the websites that are in the list but haven't been archived yet
  archive.readListOfUrls(function(array) {
    array.forEach(function(oneUrl) {
      archive.isUrlArchived(oneUrl, function(bool) {
        if (!bool) {
          var options = {
            hostname: oneUrl,
          };
          var success = function(response) {
            var body = [];
            response.on('data', function(chunk) {
              body.push(chunk);
            });
            response.on('end', function() {
              body = Buffer.concat(body).toString();
              console.log('weve ended streaming: ', body);
            });
            fs.writeFile(archive.paths.archivedSites + '/' + oneUrl, body, function() {
              console.log('Write was a success');
            });

          };

          http.request(options, success).end();

          //Definitely know this is where we get the new HTML
          //Perform GET request???
        }
      });
    });
  });
    //Once you have that list, submit a GET request for the HTML of each one

    //Upon finishing, save that HTML to the archives/sites/ folder

};