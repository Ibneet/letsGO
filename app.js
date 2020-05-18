const express = require("express");
const bodyParser = require("body-parser");

const journeysRoutes = require('./routes/journeys-routes');

const app = express();

app.use('/api/journeys',journeysRoutes);

app.listen(5000)