const express = require('express');
const morgan = require('morgan');
const path = require('path');

const data = require('./sampleData.json')

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

app.get('/data', (req, res) => {
  res.send(data)
})

app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, console.log(`App is listening on port `))