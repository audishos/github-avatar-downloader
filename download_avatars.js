const request = require('request');
const fs = require('fs');

const GITHUB_USER = 'audishos';
const GITHUB_TOKEN = '4bb1bbc514fce6c9ade965f65d5b0ade3ebf1b13';

console.log('Welcome to the GitHub Avatar Downloader!');

const REPOOWNER = process.argv[2];
const REPONAME = process.argv[3];

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

if (REPOOWNER && REPONAME && REPOOWNER !== '' && REPONAME !== '') {
  getRepoContributors(REPOOWNER, REPONAME, function(err, result) {
    result.forEach(function(element) {
      downloadImageByURL(element['avatar_url'], `./avatars/${element['login']}.jpg`);
    });
  });
}
else {
  console.log("Please enter a repository owner and a repository name");
  console.log("Usage:");
  console.log("\tnode download_avatars.js nodejs node");
}