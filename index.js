const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const express = require('express');
const http = require('http')
const path = require('path');

const app = express();
const server = http.Server(app);
let history = [];

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.post('/submit-form', (req, res) => {
  const url = req.body.url;
  launchChromeAndRunLighthouse('https://example.com', opts).then(results => {
    res.json(results);  
  });
  
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log('listening on: ' + port.toString());
});

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.lhr)
    });
  });
}

const opts = {
  chromeFlags: ['--show-paint-rects']
};