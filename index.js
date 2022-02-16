const path = require('path');
const helmet = require('helmet');
const express = require('express');
const countapi = require('countapi-js');
const compression = require('compression');
const { DiceRoll } = require('@dice-roller/rpg-dice-roller');

const app = express();
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(express.static('public'));
app.set('json spaces', 2);

const COUNTAPI = {
  NAMESPACE: process.env.COUNTAPI_NAMESPACE || 'rpg-dice-roller-api',
  ROLL_KEY: process.env.COUNTAPI_ROLL_KEY || 'rolls',
  INDEX_KEY: process.env.COUNTAPI_INDEX_KEY || 'index-visits',
};

app.get('/api/roll/:notation', (req, res) => {
  countapi.hit(COUNTAPI.NAMESPACE, COUNTAPI.ROLL_KEY).catch((e) => console.error(e));
  const verbose = req.query.v !== undefined;
  try {
    const roll = new DiceRoll(req.params.notation);
    res.json(
      verbose
        ? roll
        : {
            averageTotal: roll.averageTotal,
            maxTotal: roll.maxTotal,
            minTotal: roll.minTotal,
            output: roll.output,
            total: roll.total,
          }
    );
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Invalid Notation' });
  }
});

app.get('/api/stats', (req, res) => {
  countapi
    .info(COUNTAPI.NAMESPACE, COUNTAPI.ROLL_KEY)
    .then((result) => {
      res.send({ rolls: result.value });
    })
    .catch((e) => {
      console.error(e);
      res.status(503).json({ error: 'Service Unavailable' });
    });
});

app.get('/', (req, res) => {
  countapi
    .hit(COUNTAPI.NAMESPACE, COUNTAPI.INDEX_KEY)
    .catch((e) => console.error(e));
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);
