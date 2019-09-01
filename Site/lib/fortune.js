var fortunes = [
"conquer your fears",
"have enough sex",
"do not fear what you do not know",
"whenever possible keep it simple",
"forgive and mind your own business"
];

exports.getFortune = function(){
	var idx = Math.floor(Math.random()*fortunes.length);
	return fortunes[idx];
};
