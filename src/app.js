const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Load the path library
const path = require('path');

// Load the express library
const express = require('express');
const hbs = require('hbs');

// Create an express application
const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Serve up public folder
app.use(express.static(publicDirectoryPath));


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ash Duckett'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ash Duckett'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Ash Duckett'
    });
});


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        });
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                });
            }
            
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    });
        
    // res.send({
    //     forecast: 'It is snowing',
    //     location: 'Philidelphia',
    //     address: req.query.address
    // });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }
    
    console.log(req.query)
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ash Duckett',
        errorMessage: 'Help article not found.'
    });
});


// Match anything that's not been matched so far
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ash Duckett',
        errorMessage: 'Page not found.'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});