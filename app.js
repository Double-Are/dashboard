//IMPORTANT - run test data in config.json to prevent the decrease of your rate limit 
//set testing to true until you want to run live tweets
//actual testing json output is in ./assests/test/ -lists -mentions -timeline -trends

var fs 		= require('fs'); //file system
var http	= require('http'); //um
var express	= require('express'); //node framework
var socket	= require('socket.io'); //socket.io (real-time junk)
var yql 	= require('yql'); //yahoo query language
var mtwitter = require('mtwitter'); //twitter api

//your twitter application information goes in this file
var config 	= JSON.parse(fs.readFileSync('./config.json')); 

//port & host if local machine
var port = 8000;
var host = "127.0.0.1";

//create server
var app = express();
var server = http.createServer(app);
server.listen(process.env.VCAP_APP_PORT || port); //needed to run on appfog.com and localhost

//socket io listen on port
var io = socket.listen(server);

//twitter credentials - I could have made the shorter...I didn't
var twit = new mtwitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

//allow access to these sub directories directly
app.use(express.static(__dirname + '/assets/svg'));
app.use(express.static(__dirname + '/assets/css'));
app.use(express.static(__dirname + '/assets/js'));
app.use(express.static(__dirname + '/assets/test'));
app.use(express.static(__dirname + '/assets/img'));
app.use(express.static(__dirname + '/dist/css'));

//on root run dashboard.html
app.get('/', function (req, res) {
	var content = fs.readFileSync('dashboard.html'),
		content = content.toString('utf8');
		res.setHeader("Content-Type", "text/html");
		res.send(content);
});

//on /controller run controller.html
app.get('/controller', function (req, res) {
  	var content = fs.readFileSync('controller.html'),
		content = content.toString('utf8');
		res.setHeader("Content-Type", "text/html");
		res.send(content);
});

//on /splash run controller.html
app.get('/intro', function (req, res) {
  	var content = fs.readFileSync('index.html'),
		content = content.toString('utf8');
		res.setHeader("Content-Type", "text/html");
		res.send(content);
});


// assuming io is the Socket.IO server object (if appfog.com still does not support socket.io at time of reading this)
io.configure(function() { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

//pass content
io.sockets.on('connection', function (socket){

	//the weather
	function weather(){

		//yahoo query language weather (location = 'your zip')
		new yql.exec("select * from weather.forecast where location =" + config.weather_zip, function (response){

			//the verge news results
			var weather = response;

			//send stories to dashboard
			socket.emit('theWeather', { forecast: weather});
		});
	}

	//the Verge - blog rss feeds go here
	function theVerge(){
		
		//yql blog rss feed goes here (check console log for correct JSON/Object output - varies if not the verge)
		new yql.exec("select * from xml where url = 'http://www.theverge.com/rss/index.xml'", function (response){

			//the verge news results
			var stories = response.query.results.feed.entry;

			//send stories to dashboard
			socket.emit('theVerge', { verge: stories});
		});
	}

	function theCrew(){

		//test - execute function on start (no live data/saves limited requests during testing)
		if(config.testing == true){ 

			var testTimeline = JSON.parse(fs.readFileSync('./assets/test/timeline.json'));
			
			//test-Dev
			socket.emit('sendHomeTimeline', { tweets: testTimeline });

		 }
		else{

			// Get a user's timeline
			twit.get('statuses/home_timeline', {screen_name: '@' + config.screen_name, count: '100'}, function (err, data) {
			  console.log(data);
			  socket.emit('sendHomeTimeline', { tweets: data });
			});

		}

	}
	
	//twitter- your timeline
	function timeline(){

		//test - execute function on start (no live data/saves limited requests during testing)
		if(config.testing == true){ 

			var testTimeline = JSON.parse(fs.readFileSync('./assets/test/timeline.json'));
			
			//test-Dev
			socket.emit('sendHomeTimeline', { tweets: testTimeline });

		 }
		else{

			// Get a user's timeline
			twit.get('statuses/home_timeline', {screen_name: '@' + config.screen_name, count: '100'}, function (err, data) {
			  console.log(data);
			  socket.emit('sendHomeTimeline', { tweets: data });
			});

		}
	}

	//twitter - your mentions
	function mentions(){

		//test - execute function on start (no live data/saves limited requests during testing)
		if(config.testing == true){ 

			var testMentions = JSON.parse(fs.readFileSync('./assets/test/mentions.json'));
			
			//test-Dev
			socket.emit('sendMentions', { mentions: testMentions });

		 }
		else{

			// Get a user's mentions
			twit.get('/statuses/mentions_timeline', {key: 'value'}, function logResponse(error, data, response) {
			  //console.log('Error? ', error);
			  console.log(data);
			  //console.log('Raw HTTP response: ', response);
			  socket.emit('sendMentions', { mentions: data });
			});
		}
	}

	//twitter - a list of your choice
	function lists(your_list_name, num_tweets){

		//test - execute function on start (no live data/saves limited requests during testing)
		if(config.testing == true){ 

			var testList = JSON.parse(fs.readFileSync('./assets/test/listsDev.json'));
			
			//test-Dev
			socket.emit('sendTweetsListDev', { tweets: testList });

			var testList = JSON.parse(fs.readFileSync('./assets/test/listsCrew.json'));
			
			//test-Dev
			socket.emit('sendTweetsListCrew', { tweets: testList });

		 }
		else{

			//Get one of your lists (or build one on twitter for tailored posts)
			twit.get('lists/statuses', {slug: your_list_name, owner_screen_name: config.screen_name, include_entities: 'true', count: num_tweets}, function (error, data) {
			  	console.log(data);
			  	socket.emit('sendTweetsList' + your_list_name, { tweets: data });
			});
		}
	}

	//twitter - current trends in the world
	function trends(){

		//test - execute function on start (no live data/saves limited requests during testing)
		if(config.testing == true){ 

			var testTrends = JSON.parse(fs.readFileSync('./assets/test/trends.json'));
			
			//test-Dev
			socket.emit('sendTrends', { setTrend: testTrends });

		 }
		else{

			//Get trends (change id in respect with location given on twitter for location)
			twit.get('trends/place', {id: '1'}, function (err, data){
				//console.log(err, data);
				socket.emit('sendTrends', { setTrend: data });
			});

		}
	}
	
	//twitter - search for tweets
	function searchTweets(newSearch){

		//Search for a phrase
		twit.get('search/tweets', {q: newSearch, count: '100', locale: 'en', include_entities: 'true'}, function(err, item) {
		  //console.log(err, item);
		  socket.emit('sendTweets', { tweets: item});
		});

	}

	//twitter - search for photos on twitter
	function searchPhotos(newSearch){

		//Search for photos
		twit.get('search/tweets', {q: newSearch + ' filter:images', count: '100', locale: 'en', include_entities: 'true'}, function(err, item) {
		  //console.log(err, item);
		  socket.emit('sendPhotos', { tweets: item});
		});

	}

	//twitter - how many request you have left in 15 min intervals
	function rateLimit(){

		//Get rate limit
		twit.get('application/rate_limit_status', {resources: 'lists,trends,search,statuses,help'}, function(err, item) {
		  //console.log(err, item);
		  socket.emit('Limit', { rate: item});
		});

	}

	//Scrobbler to let you know what tweet you are on - displays on /controller
	function scrobbler(){

		socket.on('scrobbler', function (data){
			var current = data.scrobbler.current;
			var all = data.scrobbler.all;
			
			//console.log(current + '/' + all);

			io.of('/controller').emit('scrobbler', {content : data});
		});
	}

	//once your list has cycled through request new list content
	function reiterate(){

		socket.on('callList', function (data){
			var reVamp = data.listRevamp;

			console.log(reVamp);

			if(reVamp == '1'){
				timeline();
			}

		});
	}

	//once your list has cycled through request new list(Crew) content
	function reiterateCrew(){

		socket.on('callListCrew', function(data){
			var reVampCrew = data.listRevamp;

			if(reVampCrew == '1'){
				lists(your_list_name = "Crew", num_tweets = "100");
			}
		});
	}

	//execute function on start
	weather();

	//created by building lists on twitter
	lists(your_list_name = "Dev", num_tweets = "10"); //get dev list
	lists(your_list_name = "Crew", num_tweets = "100"); //get friends or your most read twitter users 

	mentions();
	trends();
	timeline();

	rateLimit();

	reiterate();
	reiterateCrew();
	scrobbler();
	
	//test function for rss feed parsing with yahoo query language
	//theVerge();

	//execute at intervals
	setInterval(function(){ lists(your_list_name = "Dev", num_tweets = "10"); }, 600000); 	//10 mins
	setInterval(mentions, 900000); 	//15 mins
	setInterval(trends, 3600000); 	//1 hour

	setInterval(weather, 3600000); 	//1 hour
	setInterval(theVerge, 3600000); //1 hour


	io.of('/controller').on('connection', function (controller) {

		//search
	  	controller.on('fullControl', function (data){

	  		var newSearch = data.newStream; 

	  		//search function execute - Twitter
	  		searchTweets(newSearch);

	  	});

	  	//search Photo
	  	controller.on('fullControlPhoto', function (data){

  			var newSearch = data.newStream; 

  			//searchPhotos function execute - Twitter
			searchPhotos(newSearch);

	  	});

	  	//open second view
	  	controller.on('expand', function (data){

	  		//open close boolean
	  		var expand = data.openView;

	  		//debug
	  		console.log(expand);

	  		socket.emit('expand', { openView: expand });
	  	});

	  	//pause Feed
	  	controller.on('pauseChannel', function (data){

	  		//open close boolean
	  		var pause = data.pauseChannel;

	  		//debug
	  		console.log(pause);

	  		socket.emit('pauseChannel', { pauseChannel: pause });
	  	});
		
		//next Tweet on Channel
	  	controller.on('nextChannel', function (data){

	  		//open close boolean
	  		var next = data.nextChannel;

	  		//debug
	  		console.log(next);

	  		socket.emit('nextChannel', { nextChannel: next });
	  	});

	  	//previous Tweet on Channel
	  	controller.on('previousChannel', function (data){

	  		//open close boolean
	  		var previous = data.previousChannel;

	  		//debug
	  		console.log(previous);

	  		socket.emit('previousChannel', { previousChannel: previous });
	  	});

	});

});





