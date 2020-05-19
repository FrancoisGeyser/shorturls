const express = require('express');
const app = express();
var db = require('diskdb');
db = db.connect('./data', ['urls']);
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');
const baseUrl = 'fg-shorturls.herokuapp.com'//'surls.host'
app.set('subdomain offset',1)

app.get('/api/surls/getall', (req, res) => {
    res.send(db.urls.find())
})

app.get('/api/surls/getone', (req, res) => {
    res.send(req.query)
}) 

app.get('/api/surls/manual', (req, res) => {
    const surl = req.query.shorturl
    const url = req.query.url
    db.urls.save({ surl: surl, url: url })
    const target = db.urls.find({ surl: surl })
    res.send(`https://${target[0].surl}.${baseUrl}`)
})

app.get('/api/surls/new', (req, res) => {
    const surl = shortid.generate().toLowerCase()
    const url = req.query.url
    db.urls.save({ surl: surl, url: url })
    const target = db.urls.find({ surl: surl })
    res.send(`https://${target[0].surl}.${baseUrl}`)
})

app.get('/', (req, res) => {
    const Url =  db.urls.find({ surl: req.subdomains[0] })
	if (Url.length == 0){res.send('You missed something')}
    const TargetUrl = 'http://' + Url[0].url
      res.redirect(TargetUrl);
});


const port = process.env.port || 8000;
app.listen(port);
