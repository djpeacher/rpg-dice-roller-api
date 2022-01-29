const path = require('path');
const helmet = require('helmet');
const express = require('express');
const compression = require('compression');
const { DiceRoll } = require('@dice-roller/rpg-dice-roller');

const app = express();
app.use(helmet());
app.use(compression());
app.set('json spaces', 2);

app.get('/api/roll/:roll', (req, res) => {
  countapi.hit('rpg-dice-roller-api', 'rolls-test');
  const verbose = req.query.verbose || req.query.v;
  const roll = new DiceRoll(req.params.roll);
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
});

app.get('/api/stats', (req, res) => {
  countapi.info('rpg-dice-roller-api', 'rolls-test').then((result) => {
    res.send({ rolls: result.value });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('*', (req, res) => {
  res.redirect('/');
});

