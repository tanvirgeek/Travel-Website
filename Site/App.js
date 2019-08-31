var express = require('express');
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

var fortunes = [
	"conquer your fears, or they will conquer you",
	"rivers need springs",
	"do not fear what you don't know",
	"you will have a pleasen surprise",
	"whenever possible keep it simple"
];

app.get('/about', function(req,res){
	var random = Math.random();
	var fortunevalue = random*fortunes.length;
	console.log(random + '//' + fortunevalue + '//' + Math.floor(fortunevalue ));
	var randomFortune = fortunes[Math.floor(fortunevalue)];
	res.render('about', {fortn: randomFortune });
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