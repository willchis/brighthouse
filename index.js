const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
var bodyParser = require('body-parser');

const express = require('express');
const http = require('http')
const path = require('path');

const app = express();
const server = http.Server(app);
let history = [];

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.post('/submit-form', (req, res) => {
  console.log(req.body);
  const url = req.body.url;
  if (url) {
    launchChromeAndRunLighthouse(url, opts).then(results => {
      console.log(results.categories);
      let scores = {
        "performance": results.categories.performance.score,
        "seo": results.categories.seo.score,
        "pwa": results.categories.pwa.score,
        "accessibility": results.categories.accessibility.score
      };
      res.json(scores);  
    });
  } else {
    res.end();
  }
  
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