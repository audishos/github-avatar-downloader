const request = require('request');
const fs = require('fs');

const GITHUB_USER = 'audishos';
const GITHUB_TOKEN = '4bb1bbc514fce6c9ade965f65d5b0ade3ebf1b13';

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const options = { // github reuires that a User-Agent is passed so we must use the options object
    url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  }

  request(options, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    cb(null, JSON.parse(body)); // parse body and return it to the callback function
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  result.forEach(function(element) {
    downloadImageByURL(element['avatar_url'], `./avatars/${element['login']}.jpg`);
  });
});

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .on('response', function(response) {
    console.log("Status code:", response && response.statusCode);
    console.log("Content type:" + response.headers['content-type']);
  })
  .pipe(fs.createWriteStream(filePath));

}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")