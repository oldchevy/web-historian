var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var workers = require('../workers/htmlfetcher.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {

  //Async readFile only executes callback arg when reading has finished
  //Callback passed to readListOfUrls is then invoked on entire array of results
  fs.readFile(this.paths.list, 'utf8', function(err, data) {
    
    if (err) {
      console.log('Error on readListOfUrls: ', err);
    }

    var results = data.split('\n');
    callback(results.filter(function(entry) { return entry !== ''; }));

  });


};

exports.isUrlInList = function(string, callback) {
  
  //A less abstracted example of what is happening 

  // fs.readFile(this.paths.list, 'utf8', function(err, data) {
  //   var results = data.split('\n');
  //   bool = _.contains(results, string);
  //   callback(bool);
  // });

  //Here, the array arg is the results array from above

  var string = string[0] === '/' ? string.replace('/', '') : string;


  this.readListOfUrls(function(array) {
    callback(_.contains(array, string));
  });


};

exports.addUrlToList = function(urlString, callback) {

  this.readListOfUrls(function(array) {

    // fs.writeFile overwrites the file. Do this to maintain existing urls
    array.push(urlString);
    var resultString = array.filter(function(entry) {
      return entry !== '';
    }).join('\n'); 

    fs.writeFile(this.paths.list, resultString, function(err) {
      if (err) {
        console.log(err);
      }
      callback(); // possible utility: tell worker to check site.txt?
    });

  }.bind(this)); // We were losing our this binding inside of our callback

};

exports.isUrlArchived = function(websiteString, callback) {

  console.log(websiteString);

  var slash = websiteString[0] === '/' ? '' : '/';

  fs.readFile(this.paths.archivedSites + slash + websiteString, function(err, data) {

    if (err && err.code !== 'ENOENT') {
      console.log('Error on isURLArchived: ', err, websiteString);
    }

    if (data) {
      callback(true);
    } else {
      callback(false);
    }

  });

};

exports.downloadUrls = function(siteArray) {

  console.log(siteArray);
  siteArray.forEach(function(siteUrl) {
    workers.fetchHTML(siteUrl);    
  });


};
