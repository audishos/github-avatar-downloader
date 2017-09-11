const request = require('request');
const fs = require('fs');

const GITHUB_USER = 'audishos';
const GITHUB_TOKEN = '4bb1bbc514fce6c9ade965f65d5b0ade3ebf1b13';

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;
  console.log(requestURL);

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});