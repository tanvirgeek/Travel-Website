var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();

//Set up Handlebar view Engine
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine','handlebars');

//public
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.get('/',function(req, res){
	res.render('home');
})

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.get('/about', function(req,res){
	res.render('about', { fortn: fortune.getFortune()});
});

//custom 404 page
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.render('404');
})

//custom 500 page
app.use(function(err,req,response,next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('express Started on http localhost:' + app.get('port') + 'press CTRL C to terminate');
});