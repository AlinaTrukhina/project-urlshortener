require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const urlparser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

/*
You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
Waiting: When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
Waiting: If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }
*/
let urls = [];

app.post('/api/shorturl', (req, res, next) => {

  const origUrl = req.body.url;
  console.log(dns.lookup(urlparser.parse(origUrl).hostname, (error, address) => {
    if (!address) {
      res.json({error: "Invalid URL"});
    } else {
      const shortUrl = urls.length.toString();
      urls.push({origUrl: origUrl})

      res.json({
        original_url: origUrl,
        short_url: shortUrl
      });
    }
  }));
})

app.get('/api/shorturl/:id', (req, res) => {
  console.log(req.params);
  const oldUrlObj = urls[req.params.id];
  const oldUrl = oldUrlObj.origUrl;
  
  res.redirect(oldUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
