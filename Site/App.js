var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();
const bodyParser = require('body-parser');
var formidable = require('formidable');
const credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

//Set up Handlebar view Engine
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine','handlebars');

//public
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())



app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.get('/about', function(req,res){
	res.render('about', { 
		fortn: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

app.get('/tours/hood-river', function(req,res){
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req,res){
	res.render('tours/request-group-rate');
});

app.get('/headers', function(req,res){
	res.set('Content-type','text/plain');
	var s = '';
	for(var name in req.headers) s+= name + ':' + req.headers[name] + '\n';
	res.send(s);
});

app.disable('x-powered-by');

app.get('/no-layout', function(req,res){
	res.render('no-layout',{layout: null});
})
app.get('/custom-layout', function(req,res){
	res.render('custom-layout',{layout: 'custom1'});
});
app.get('/newsletter', function(req, res){
 // we will learn about CSRF later...for now, we just
 // provide a dummy value
 res.render('newsletter', { csrf: 'CSRF token goes here' });
});
app.post('/process', function(req, res){
 if(req.xhr || req.accepts('json,html')==='json'){
 // if there were an error, we would send { error: 'error description' }
 res.send({ success: true });
 } else {
 // if there were an error, we would redirect to an error page
 res.redirect(303, '/thank-you');
 }
});

//file upload

app.get('/contest/vacation-photo',function(req,res){
 var now = new Date();
 res.render('contest/vacation-photo',{
 year: now.getFullYear(),month: now.getMonth()
 });
});
app.post('/contest/vacation-photo/:year/:month', function(req, res){
 var form = new formidable.IncomingForm();
 form.parse(req, function(err, fields, files){
 if(err) return res.redirect(303, '/error');
 console.log('received fields:');
 console.log(fields);
 console.log('received files:');
 console.log(files);
 res.redirect(303, '/thank-you');
 });
});




function getWeatherData(){
 return {
 locations: [
 {
 name: 'Portland',
 forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
 iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
 weather: 'Overcast',
 temp: '54.1 F (12.3 C)',
 },
 {
 name: 'Bend',
 forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
 iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
 weather: 'Partly Cloudy',
 temp: '55.0 F (12.8 C)',
 },
 {
 name: 'Manzanita',
 forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
 iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
 weather: 'Light Rain',
 temp: '55.0 F (12.8 C)',
 },
 ],
 };
}

app.use(function(req, res, next){
 if(!res.locals.partials) res.locals.partials = {};
 res.locals.partials.weather = getWeatherData();
 //console.log(res.locals.partials.weather);
 next();
});

app.get('/',function(req, res){
	res.render('home');
})

//custom 404 page
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.render('404');
})

//custom 500 page
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('express Started on http localhost:' + app.get('port') + 'press CTRL C to terminate');
});