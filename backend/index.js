const express = require('express');
const app = express();
const path = require('path');

bodyParser = require('body-parser');
var cors = require('cors')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use(express.static(path.join(__dirname, 'public')));


const db = require('./config/database');
app.use('/api', require('./config/apis'));

app.get('/', (req, res) => {
    res.status(200)
        .send("Hai You are Connected")
});

const port = process.env.PORT || 3000;


app.listen(port, () =>
    console.log(`-------------- listening on port ${port}!`))