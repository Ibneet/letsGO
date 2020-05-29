const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const journeysRoutes = require('./routes/journeys-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/journeys', journeysRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find the specified route', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occurred"});
});

mongoose
    .connect('mongodb+srv://Ibneet:waheguru@letsgo-j6hql.mongodb.net/Journeys?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
