/************** BOOT *****************/

//appfog
//var socket = io.connect('http://appfog_name.aws.af.cm');

//ip address (using ifconfig) to run from mobile device 
//var socket = io.connect('http://192.168.X.X:8000');

//localhost
var socket = io.connect('http://127.0.0.1:8000');


/************** OPEN EXPAND *****************/
socket.on('expand', openViewTwo);
/************** NEWS STORIES ***************/
socket.on('theWeather', weather);
/************** NEWS STORIES ***************/
socket.on('theVerge', theVerge);
/************** GET TWEETS *****************/
socket.on('sendTweets', searchTweets);
/************** GET PHOTOS *****************/
socket.on('sendPhotos', photosTweets);
/************** GET TWEETS *****************/
socket.on('sendTweetsListDev', homeTweets);
/************** GET TWEETS *****************/
socket.on('sendTweetsListCrew', secondaryTweets);
/************** GET TIMELINE *****************/
socket.on('sendHomeTimeline', listTweets);
/************** GET MENTIONS *****************/
socket.on('sendMentions', mentionTweets);
/************** GET TRENDS *****************/
socket.on('sendTrends', trendsTweets);
/************** GET RATE *****************/
socket.on('Limit', rateLimit);

//opening animation
intro();

//personal info
personal();

//set time
getTime();
runTime();

//hard reload page after an hour
hardReload();

//close (loaded webpage)
closeLink()

//instantiate storify
var storify = new Array(),
	listHold = new Array(),
	searchResults;

//start cycle through Channel list
var start = {

	cycle: function(storify, count, overwrite){

		console.log("count" + count);

		searchResults = setInterval(function(){

			/*use input type=number value to retain number 
			value and increment without reseting value number*/
			var counting = input.value++;

			if(overwrite == "list"){
				//execute overwrite
				displayList.executeOverlap(storify, counting);
			}
			else{
				//execute overwrite
				displaySearch.executeOverlap(storify, counting);
			}

			//send information to scrobbler
			executeScrobbler(count, counting); //root
			start.scrobbler(count, counting); //controller

			console.log(counting);

			//if end of string stop interval searchResults
			if(counting == count-1){ 

				input.value = 1;

				displaySearch.removeContent();
				displayList.removeContent();

				socket.emit('callList', { listRevamp : '1' });
			
			}

		}, 10000);

	},
	pause: function(){
		//pause channel tweets
		clearInterval(searchResults);
	},
	nextTweet: function(storify, count, overwrite){
		//increment++ to next tweet in channel
		var counting = input.value++;

		if(counting == 0 || counting == count-1){
			input.value = 1;
		}

		console.log('counting: ' + counting);
		console.log('count: ' + (count-1));

		if(overwrite == "list"){
			//execute overwrite
			displayList.executeOverlap(storify, counting);
		}
		else{
			//execute overwrite
			displaySearch.executeOverlap(storify, counting);
		}

		//send information to scrobbler
		executeScrobbler(count, counting); //root
		start.scrobbler(count, counting); //controller
	},
	previousTweet: function(storify, count, overwrite){
		//increment-- to previous tweet in channel
		var counting = input.value--;

		if(counting == 0 || counting == (count-1)){
			input.value = 1;
		}

		console.log('counting: ' + counting);
		console.log('count: ' + (count-1));

		if(overwrite == "list"){
			//execute overwrite
			displayList.executeOverlap(storify, counting);
		}
		else{
			//execute overwrite
			displaySearch.executeOverlap(storify, counting);
		}

		//send information to scrobbler
		executeScrobbler(count, counting); //root
		start.scrobbler(count, counting); //controller
	},
	scrobbler: function(count, counting){

		//build storage scrobbler information
		var buildScrobbler = {
			all: count,
			current: input.value
		}

		//debug
		console.log(buildScrobbler);

		socket.emit('scrobbler', { scrobbler : buildScrobbler });
	}

}

//display list design
var displayList = {
	
	executeOverlap: function(storify, i){

		var text = replaceURLWithHTMLLinks(storify[i].text);


		//if backgroundImg exists
		if(storify[i].hasOwnProperty("backgroundImg")){

			if(storify[i].backgroundImg != null){//if backgroundImg is not null display as background
				$('#twitter').css('background-image', 'url(' + storify[i].backgroundImg + ')');
			}
			else{//if backgroundImg is null then display solid color
				$('#twitter').css('background', '#2c3e50');
			}
		}
		else{//display solid color if backgroundImg does not exist
			$('#twitter').css('background', '#2c3e50');
		}

		$('#twitterTopText > #displayTweets').html(text);
		$('#displayTwitterPic').html("<img class='twitterPic' src='" + storify[i].picture + "'>");
		$('#displayTwitterName').html(storify[i].username);
		$('#displayTwitterDescription').html(storify[i].description);
	},
	removeContent: function(sendTweets){
		//clear main channel box
		$('#twitterTopText').html('');
		$('#twitterTopText').html(sendTweets);

		//clear sub info channel box
		$('#twitterTopText > #displayTweetsSearch').html('LOADING TWEETS...');
		$('#displayTwitterPicSearch').html('');
		$('#displayTwitterNameSearch').html('');
		$('#displayTwitterDescriptionSearch').html('');

		//stop previous interval
		clearInterval(searchResults);

		//clear previous information in array
		storify = [];

		//restarts counter
		input.value = 0;
	}

};

//display list design
var displaySearch = {
	
	executeOverlap: function(storify, i){

		var text = replaceURLWithHTMLLinks(storify[i].text);

		//if backgroundImg exists
		if(storify[i].hasOwnProperty("backgroundImg")){

			if(storify[i].backgroundImg != null){//if backgroundImg is not null display as background
				$('#twitter').css('background-image', 'url(' + storify[i].backgroundImg + ')');
			}
			else{//if backgroundImg is null then display solid color
				$('#twitter').css('background', '#2c3e50');
			}
		}
		else{//display solid color if backgroundImg does not exist
			$('#twitter').css('background', '#2c3e50');
		}


		$('#twitterTopText > #displayTweetsSearch').html(text);
		$('#displayTwitterPicSearch').html("<img class='twitterPic' src='" + storify[i].picture + "'>");
		$('#displayTwitterNameSearch').html(storify[i].username);
		$('#displayTwitterDescriptionSearch').html(storify[i].description);
	}, 
	searchCleanUp: function(search){
			search = search.replace('+filter%3Aimages', '');
			search = search.replace('+%40', '@');
			search = search.replace('+', ' ');

			return search;
	},
	removeContent: function(sendTweets){
		//clear main channel box
		$('#twitterTopText').html('');
		$('#twitterTopText').html(sendTweets);

		//clear sub info channel box
		$('#twitterTopText > #displayTweetsSearch').html('LOADING TWEETS...');
		$('#displayTwitterPicSearch').html('');
		$('#displayTwitterNameSearch').html('');
		$('#displayTwitterDescriptionSearch').html('');

		//stop previous interval
		clearInterval(searchResults);

		//clear previous information in array
		storify = [];
	}

};

controlsSocket = {

	pause: function(storify, count, overwrite){

		/************** PAUSE CHANNEL FEED *****************/
		socket.on('pauseChannel', function (data){

			var pause = data.pauseChannel;

			if(pause == 1){ start.pause(); } //if 1 pause feed
			else if(pause == 0){ start.cycle(storify, count, overwrite); } //if 0 resume feed

		});

	},
	next: function(storify, count, overwrite){

		/************** NEXT TWEET ON CHANNEL *****************/
		socket.on('nextChannel', function (data){

			start.pause();	
			var next = data.nextChannel;

			console.log(next);

			if(next == 1){
				start.nextTweet(storify, count, overwrite);
				next = '0';
			}
		});

	},
	previous: function(storify, count, overwrite){

		/************** NEXT TWEET ON CHANNEL *****************/
		socket.on('previousChannel', function (data){

			start.pause();	
			var previous = data.previousChannel;

			console.log(previous);

			if(previous == 1){
				start.previousTweet(storify, count, overwrite);
				previous = 0;
			}
		});

	}

};

var lists_Mentions = {

	clear: function(element){

		//remove all previous content and replace on heartbeat
		$(element).html('');

		//clear previous information in array if stories
		if(element == "#stories"){
			listHold = [];
		}

	},
	parseData: function(data, element){

		var i = 0;
		$.each(data, function (key, index){

			var text = replaceURLWithHTMLLinks(index.text);

			var user = index.user.screen_name,
				name = index.user.name,
				text = text,
				created = index.created_at,
				picture = index.user.profile_image_url.replace('_normal', ''),
				source = index.source;

			listHold[i] = {
				user: user,
				name: name,
				text: text,
				created: created,
				picture: picture,
				source: source
			}

			i++;
		});

		var j = 0;
		$(element).prepend("<li class='nextTweet'><div class='timelinePic'><img class='timeline_MentionsPic' src='" + listHold[j].picture + "'></div><div class='timelineTweets'><b>@" + listHold[j].user + "</b> " + listHold[j].name + "<br>" +  listHold[j].text + "</div></li>");
			
		var j = 1,
			count = listHold.length;

			console.log(count);

		var feed = setInterval(function(){
			$(element).hide().prepend("<li class='nextTweet'><div class='timelinePic'><img class='timeline_MentionsPic' src='" + listHold[j].picture + "'></div><div class='timelineTweets'><b>@" + listHold[j].user + "</b> " + listHold[j].name + "<br>" +  listHold[j].text + "</div></li>").fadeIn("slow");
			
			console.log(j);
			if(j == (count-1)){ //j skips 0 so subtract 1 from count
				clearInterval(feed);
				socket.emit('callListCrew', { listRevamp : '1' });
			}

			j++;
		}, 20000);
	},
	parseDataTimeline: function(data, element){

		var i = 0;
		$.each(data, function (key, index){

			var text = replaceURLWithHTMLLinks(index.text);

			var user = index.user.screen_name,
				name = index.user.name,
				text = text,
				created = index.created_at,
				picture = index.user.profile_image_url.replace('_normal', ''),
				source = index.source;

				$(element).prepend("<li class='nextTweet'><div class='timelinePic'><img class='timeline_MentionsPic' src='" + picture + "'></div><div class='timelineTweets'><b>@" + user + "</b> " + name + "<br>" +  text + "<br>" + created + " " + source + "</div></li>");
			

		});
	}

};

/************** WEATHER *****************/
var yqlWeather = {

	init: function(code){

		//tornado
		if(['0'].indexOf(code) != -1){//horror
			return predict = 1;
		}
		//showers
		else if(['1', '2', '11', '12', '40', '45', '47'].indexOf(code) != -1){
			return predict = 2;
		}
		//rain
		else if(['5', '6', '8', '9', '10', '35'].indexOf(code) != -1){
			return predict = 3;
		}
		//snow
		else if(['7', '13', '14', '15', '16', '41', '43', '42', '46'].indexOf(code) != - 1){
			return predict = 4;
		}
		//thunderstorms
		else if(['3', '4', '37', '38', '39'].indexOf(code) != -1){
			return predict = 5;
		}
		//misc
		else if(['17', '18', '19', '20', '21', '22', '23', '24', '25', '36'].indexOf(code) != -1){
			return predict = 6;
		}
		//cloudy
		else if(['26', '27', '28', '29', '30', '44'].indexOf(code) != -1){
			return predict = 7;
		}
		//night
		else if(['31', '33'].indexOf(code) != -1){
			return predict = 8;
		}
		//day
		else if(['32', '34'].indexOf(code) != -1){
			return predict = 9;
		}
		//nothing
		else{
			return predict = 10;
		}

	},
	condition: function(conditionCode, conditionTemp){

		var idTop = '#lineForecast > li:first > .top';
		var idBottom = '#lineForecast > li:first > .bottom';

		//get type of weather
		var code = yqlWeather.init(conditionCode);

		//pull forecast icons
		$(idTop).html(yqlWeather.forecasts(conditionCode, idTop));

		//temperature
		$(idBottom).html(conditionTemp);

		//shorthand-ish
		var quote = yqlWeather.quote;

		//determines picture
		switch(predict){

			case 1:
				$('#other').html(quote.tornado);
			break;

			case 2:
				$('#other').html(quote.showers);
			break;

			case 3:
				$('#other').html(quote.rain);
			break;

			case 4:
				$('#other').html(quote.snow);
			break;
			
			case 5:
				$('#other').html(quote.thunderstorms);
			break;

			case 6:
				$('#other').html(quote.misc);
			break;

			case 7:
				$('#other').html(quote.cloudy);
			break;
			
			case 8:
				$('#other').html(quote.night);
			break;
			
			case 9:
				$('#other').html(quote.day);
			break;
			
			case 10:
				$('#other').html(quote.none);
			break;

		}


	},
	forecasts: function(code, id, num){

		if(id.length == 0){
			var num = num + 1;
			var id = '#lineForecast > li:nth-child(' + num + ') > .top';

			//shorthand-ish small icons
			var iconsRaw = yqlWeather.iconsRaw;
		}
		else{
			//shorthand-ish large icons
			var iconsRaw = yqlWeather.iconsRaw;
		}

		//get type of weather
		var predict = yqlWeather.init(code);

		//determines picture
		switch(predict){

			case 1:
				$(id).css('background-image', 'url(' + iconsRaw.tornado + ')');
			break;

			case 2:
				$(id).css('background-image', 'url(' + iconsRaw.showers + ')');
			break;

			case 3:
				$(id).css('background-image', 'url(' + iconsRaw.rain + ')');
			break;

			case 4:
				$(id).css('background-image', 'url(' + iconsRaw.snow + ')');
			break;
			
			case 5:
				$(id).css('background-image', 'url(' + iconsRaw.thunderstorms + ')');
			break;

			case 6:
				$(id).css('background-image', 'url(' + iconsRaw.misc + ')');
			break;

			case 7:
				$(id).css('background-image', 'url(' + iconsRaw.cloudy + ')');
			break;
			
			case 8:
				$(id).css('background-image', 'url(' + iconsRaw.night + ')');
			break;
			
			case 9:
				$(id).css('background-image', 'url(' + iconsRaw.day + ')');
			break;
			
			case 10:
				$(id).css('background-image', 'url(' + iconsRaw.none + ')');
			break;

		}

	},
	low: function(low, num){
		var num = num + 1;
		$('#lineForecast > li:nth-child(' + num + ') > .bottom').append(' / ' + low);
	},
	high: function(high, num){
		var num = num + 1;
		$('#lineForecast > li:nth-child(' + num + ') > .bottom').html(high);
	},
	units: function(unitTemperature){

		$('#temp').append(unitTemperature);

	},
	icons: {

		tornado: "<img class='weatherIconsSize' src='./Tornado.svg'>",
		
		showers: "<img class='weatherIconsSize' src='./Cloud-Drizzle.svg'>",

		rain: "<img class='weatherIconsSize' src='./Cloud-Drizzle-Alt.svg'>",

		snow: "<img class='weatherIconsSize' src='./Cloud-Snow.svg'>",

		thunderstorms: "<img class='weatherIconsSize' src='./Cloud-Lightning.svg'>",

		misc: "<img class='weatherIconsSize' src='./Cloud-Fog-Sun-Alt.svg'>",

		cloudy: "<img class='weatherIconsSize' src='./Cloud-Sun.svg'>",
		
		night: "<img class='weatherIconsSize' src='./Moon.svg'>",

		day: "<img class='weatherIconsSize' src='./Sun.svg'>",

		none: "<img class='weatherIconsSize' src='./Cloud-Refresh.svg'>"

	},
	iconsSmall: {

		tornado: "<img class='weatherIconsSize' src='./Tornado.svg'>",
		
		showers: "<img class='weatherIconsSize' src='./Cloud-Drizzle.svg'>",

		rain: "<img class='weatherIconsSize' src='./Cloud-Drizzle-Alt.svg'>",

		snow: "<img class='weatherIconsSize' src='./Cloud-Snow.svg'>",

		thunderstorms: "<img class='weatherIconsSize' src='./Cloud-Lightning.svg'>",

		misc: "<img class='weatherIconsSize' src='./Cloud-Fog-Sun-Alt.svg'>",

		cloudy: "<img class='weatherIconsSize' src='./Cloud-Sun.svg'>",
		
		night: "<img class='weatherIconsSize' src='./Moon.svg'>",

		day: "<img class='weatherIconsSize' src='./Sun.svg'>",

		none: "<img class='weatherIconsSize' src='./Cloud-Refresh.svg'>"

	},
	iconsRaw: {

		tornado: "./Tornado.svg",
		
		showers: "./Cloud-Drizzle.svg",

		rain: "./Cloud-Drizzle-Alt.svg",

		snow: "./Cloud-Snow.svg",

		thunderstorms: "./Cloud-Lightning.svg",

		misc: "./Cloud-Fog-Sun-Alt.svg",

		cloudy: "./Cloud-Sun.svg",
		
		night: "./Moon.svg",

		day: "./Sun.svg",

		none: "./Cloud-Refresh.svg"

	},
	quote: {

		main: "Don't knock the <i>WEATHER<i>. If it didn't change once in a while, nine out of ten people couldn't start a conversation. - Kim Hubbard",

		tornado: "There is a safe spot within every <i>TORNADO</i>. My job is to find it. - David Copperfield",

		showers: "I wanted to make love in the rain, but owing to unfavorable weather conditions, I took to the <i>SHOWER</i> as a suitable substitute. - Jarod Kintz",

		rain: "From where we stand the <i>RAIN</i> seems random. If we could stand somewhere else, we would see the order in it. - Tony Hillerman",

		snow: "A lot of people like <i>SNOW</i>. I find it to be an unnecessary freezing of water. - Carl Reiner",

		thunderstorms: "The storm starts, when the drops start dropping. When the drops stop dropping then the <i>STORM</i> starts stopping. - Dr. Seuss",

		misc: "The true adventurer goes forth aimless and uncalculating to meet and greet <i>UNKNOWN</i> fate. - O. Henry",

		cloudy: "They call this war a <i>CLOUD</i> over the land. - Charles Frazier",

		night: "Those who dream by day are cognizant of many things that escape those who dream only at <i>NIGHT</i>. - Edgar Allan Poe ",

		day: "Just for the record, the weather today is calm and <i>SUNNY</i>, but the air is full of bull - Chuck Palahniuk",

		none: 'Dull'

	}

}		

function hardReload(){
	setTimeout("location.reload(true);", 3600000);
}

/************** DATE *****************/
function getTime(){

	//date
	var nameDay = new Array('Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat');

	var nameMonth = new Array('Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept.', 'Oct.', 'Nov.', 'Dec.');

	var date    = new Date();

	var hour    = date.getHours();
	var min     = date.getMinutes();
	var sec 	= date.getSeconds();

	var dayOfWeek = date.getDay();
	var month   = date.getMonth();
	var num  = date.getDate();

	//appended 0 to min if less than 10
	if(min < 10){
	  var min = "0" + min;
	}

	if(hour > 12){
	  var hour = hour - 12;
	}

	$('#time').html("<div id='clock'>" + hour + ":" + min + "</div><div id='date'>" + nameDay[dayOfWeek] + "<br>" + nameMonth[month] + " " + num + "</div>");

}

function runTime(){

	//execute for real clock
	setInterval(function(){
		getTime();
	}, 1000);

}


//global function
function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|http|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
}

/************** PERSONAL CONTENT *****************/
function personal(){

	var name 	= 'Double_Are',
		picture = 'https://si0.twimg.com/profile_images/2487248078/trxzkukzr9o7a30tr7za_normal.jpeg';

	//remove _normal to get full size picture
	var picture = picture.replace('_normal', '');

	$('#profilePic').css('background-image', 'url(' + picture + ')');
	$('#mainName').html(name);
}

/*callback function*/
function weather(data){

	//variable
	var o = data.forecast;

	//debug
	console.log(o.query.results);

	//condition
	var conditionCode = o.query.results.channel.item.condition.code;
	var conditionTemp = o.query.results.channel.item.condition.temp;

	console.log(conditionCode + ' ' + conditionTemp);

	//unit
	var unitTemperature = o.query.results.channel.units.temperature;

	//execute condtions
	var condition = yqlWeather.condition(conditionCode, conditionTemp);

	//execute units
	yqlWeather.units(unitTemperature);

	//cycle through each(5) day and get code for the weather 
	var i = 0;
	$.each(o.query.results.channel.item.forecast, function(key, index){
		
		//set increment on loop start for all 5 forcasts
		i++;

		//get high temperature
		yqlWeather.high(index.high, i);

		//get low temperature
		yqlWeather.low(index.low, i);

		//get icon
		yqlWeather.forecasts(index.code, id = "", i);

	});


}

/************** theVerge *****************/
function theVerge(data){

	console.log(data);

	var storeVerge = new Array();

	var i = 0;
	$.each(data.verge, function(key, index){
		var published 	= index.published;
		var title 		= index.title; 
		var author 		= index.author.name;
		var link		= index.link.href;

		var stories = '<li class="newsStroies"><div class="newsTitle">' + title + '</div><div class="newsPublish">' + published + ' - <i>' + author + '</i> <br><a href=' + link + ' target="_blank">[Read More]</a></div></li>';

		storeVerge[i] = stories;

		if(i == 4){
			return false;
		}

		i++;
	});

	var combinedStories = storeVerge.join('');

	$('#stories').html(combinedStories);

}

/************** sendTweets *****************/
function searchTweets(data){

	//debug
	console.log(data);

	var searchResults,
		search 		= data.tweets.search_metadata.query, //search metadata query result
		overwrite		= "search",
		sendTweets 	= "<div id='displayTitleSearch' class='span12 revSpan1Alt'>CHANNEL</div><div id='displayTweetsSearch' class='span12 revSpan2Alt'>LOADING TWEETS...</div><div id='displayUserSearch' class='span12 revSpan1'><div id='displayTwitterPicSearch' class='span3 revSpan4 center'></div><div id='displayTwitterNameSearch' class='span9 revSpan2'></div><div id='displayTwitterDescriptionSearch' class='span9 revSpan2'></div></div>";

	//clear old/all content
	displaySearch.removeContent(sendTweets);

	//create search value
	var searchTerm = displaySearch.searchCleanUp(search);

	//parse through search results

	//set Channel Name
	$('#twitterTopText > #displayTitleSearch').html("CHANNEL " + searchTerm);

	console.log(data);

	//build an object for every search result result
		var i = 0;
		$.each(data.tweets.statuses, function(key, index){

				console.log(index);

				var media = "media" in index.entities;
				console.log('media: ' + media);

				if("media" in index.entities){

					console.log(index.entities);

					storify[i] = {
						text: index.text,
						backgroundImg: index.entities.media[0].media_url,
						frame: "<img src='" + index.entities.media[0].media_url + "' style='height: 100%; width: auto;'>",
						picture: index.user.profile_image_url,
						username: index.user.screen_name,
						description: index.user.description
					}

				}
				else{

					storify[i] = {
						text: index.text,
						backgroundImg: index.user.profile_background_image_url,
						frame: null,
						picture: index.user.profile_image_url,
						username: index.user.screen_name,
						description: index.user.description
					}
				}

			i++;

		});

		//debug
		console.log(storify);					

		//count how many elements in array
		var count = storify.length;

		//execute once before interval execute
		displaySearch.executeOverlap(storify, i = 0);

		//display each search result every 6 seconds
		start.cycle(storify, count, overwrite);

		//controller functions
		controlsSocket.pause(storify, count, overwrite);
		controlsSocket.next(storify, count, overwrite);
		controlsSocket.previous(storify, count, overwrite);
}




/************** sentPhotos **************/
function photosTweets(data){

	//debug
	console.log(data);

	var searchResults,
		search 		= data.tweets.search_metadata.query, //search metadata query result
		overwrite		= "search",
		sendTweets 	= "<div id='displayTitleSearch' class='span12 revSpan1Alt'>CHANNEL</div><div id='displayTweetsSearch' class='span12 revSpan2Alt'>LOADING TWEETS...</div><div id='displayUserSearch' class='span12 revSpan1'><div id='displayTwitterPicSearch' class='span3 revSpan4 center'></div><div id='displayTwitterNameSearch' class='span9 revSpan2'></div><div id='displayTwitterDescriptionSearch' class='span9 revSpan2'></div></div>";

	//clear old/all content
	displaySearch.removeContent(sendTweets);

	//create search value
	var searchTerm = displaySearch.searchCleanUp(search);

	//parse through search results
	//set Channel Name
	$('#twitterTopText > #displayTitleSearch').html("CHANNEL " + searchTerm);

	console.log(data);

	//build an object for every search result result
		var i = 0,
			j = 0;
		$.each(data.tweets.statuses, function(key, index){

				console.log(index);

				var media = "media" in index.entities;
				console.log('media: ' + media);

				if("media" in index.entities){

					console.log(index.entities);

					storify[j] = {
						text: index.text,
						backgroundImg: index.entities.media[0].media_url,
						frame: "<img src='" + index.entities.media[0].media_url + "' style='height: 100%; width: auto;'>",
						picture: index.user.profile_image_url,
						username: index.user.screen_name,
						description: index.user.description
					}

					j++;
				}

			i++;

		});

		//debug
		console.log(storify);					

		//count how many elements in array
		var count = storify.length;

		//inital execute the first tweet before intervals start
		displaySearch.executeOverlap(storify, i = 0);

		//display each search result every 6 seconds
		start.cycle(storify, count, overwrite);

		//controller functions
		controlsSocket.pause(storify, count, overwrite);
		controlsSocket.next(storify, count, overwrite);
		controlsSocket.previous(storify, count, overwrite);

}



/************** sentTweetsList **************/
function listTweets(data){


	//inner function global variables
	var list 			= data.tweets, //main object
		overwrite		= "list",
		sendTweetsList 	= "<div id='displayTitle' class='span12 revSpan1Alt'>CHANNEL</div><div id='displayTweets' class='span12 revSpan2Alt'>LOADING TWEETS...</div><div id='displayUser' class='span12 revSpan1'><div id='displayTwitterPic' class='span3 revSpan4 center'></div><div id='displayTwitterName' class='span9 revSpan2'></div><div id='displayTwitterDescription' class='span9 revSpan2'></div></div>";



	$('#twitterTopText').html(sendTweetsList);

	//set Channel Name
	$('#twitterTopText > #displayTitle').html("CHANNEL Timeline");

	//build an object for every search result result
	var i = 0;
	$.each(list, function(key, index){

		console.log(index);

				var media = "media" in index.entities;
				console.log('media: ' + media);

				if("media" in index.entities){

					console.log(index.entities);

					storify[i] = {
						text: index.text,
						backgroundImg: index.entities.media[0].media_url,
						frame: "<img src='" + index.entities.media[0].media_url + "' style='height: 100%; width: auto;'>",
						picture: index.user.profile_image_url,
						username: index.user.screen_name,
						description: index.user.description
					}

				}
				else{

					storify[i] = {
						text: index.text,
						backgroundImg: index.user.profile_background_image_url,
						frame: null,
						picture: index.user.profile_image_url,
						username: index.user.screen_name,
						description: index.user.description
					}
				}

		i++;

	});

	//count how many elements in array
	var count = storify.length;

	//debug
	console.log(storify);

	//inital execute the first tweet before intervals start
	displayList.executeOverlap(storify, i = 0);

	//display each search result every 6 seconds
	start.cycle(storify, count, overwrite);
		
	//controller functions
	controlsSocket.pause(storify, count, overwrite);
	controlsSocket.next(storify, count, overwrite);
	controlsSocket.previous(storify, count, overwrite);

	//root functions
	executePause(storify, count, overwrite);
	executeNext(storify, count, overwrite);
	executePrevious(storify, count, overwrite);

}


/************** openExpand *****************/
function openViewTwo(data){

	var expand = data.openView;

	console.log(expand);

	if(expand == '1'){
			//remove old classes
			$('#profilePic').removeClass('profilePicBendingBack');
			$('#weather').removeClass('weatherBendingBack');
			$('#tweets').removeClass('tweetsBendingBack');
			$('#news').removeClass('newsBendingBack');
			$('#end').removeClass('endBendingBack');

			//add classes
			$('#profilePic').addClass('profilePicBending');
			$('#weather').addClass('weatherBending');
			$('#tweets').addClass('tweetsBending');
			$('#news').addClass('newsBending');
			$('#end').addClass('endBending');

			pushForward();

			creation = false;
		}
		else if(expand == 0 || creation == false){
			//remove old classes
			$('#profilePic').removeClass('profilePicBending');
			$('#weather').removeClass('weatherBending');
			$('#tweets').removeClass('tweetsBending');
			$('#news').removeClass('newsBending');
			$('#end').removeClass('endBending');

			//add classes
			$('#profilePic').addClass('profilePicBendingBack');
			$('#weather').addClass('weatherBendingBack');
			$('#tweets').addClass('tweetsBendingBack');
			$('#news').addClass('newsBendingBack');
			$('#end').addClass('endBendingBack');

			pushBack();

			creation = true;
		}

		function pushForward(){
			$('.container').fadeOut(500);
		}

		function pushBack(){
			$('.container').fadeIn();
		}

}

function intro(){
		
		$('.footer').slideDown();	

		//close animation - openViewTwo(data)
		var data = {
			openView: '0'
		}

		var delay = new Array('1000', '616', '666', '716', '3000');
		var noDelay = new Array('0', '0', '0', '0', '0');

		setTimeout(function(){
			$('#experience').fadeOut('slow');
		}, delay[1]);

		/*setTimeout(function(){
			$('#freezeList').addClass('viewTwoBendingBack');
		}, delay[1]);

		setTimeout(function(){
			$('#freezeMention').addClass('viewTwoBendingBack');
		}, delay[2]);

		setTimeout(function(){
			$('#freezeTrend').addClass('viewTwoBendingBack');
			$('.continer').fadeIn();
		}, delay[3]);*/

		setTimeout(function(){
			$('#freezeList, #freezeMention, #freezeTrend').fadeIn();
		}, delay[0]);

		setTimeout(function(){
			$('.continer').fadeIn();
		}, delay[3]);

		setTimeout(function(){
			openViewTwo(data);
		}, delay[4]);
}

//Compress last two functions
function homeTweets(data){

	//consolidate information into one object/variable
	var data 	= data.tweets,
		element = "#timeline";

	lists_Mentions.clear(element);	

	//debug
	console.log(data);
		
	lists_Mentions.parseDataTimeline(data, element);

}

//Compress last two functions
function secondaryTweets(data){

	//consolidate information into one object/variable
	var data 	= data.tweets,
		element = "#stories";

	lists_Mentions.clear(element);	

	//debug
	console.log(data);
		
	lists_Mentions.parseData(data, element);

}

function mentionTweets(data){

	//consolidate information into one object/variable
	var data 	= data.mentions,
		element = "#mentions";

	//remove previous data
	lists_Mentions.clear(element);	

	//debug
	console.log(data);
		
	lists_Mentions.parseDataTimeline(data, element);

}

function trendsTweets(data){

	var data = data.setTrend,
		trends = data[0].trends;


	$('#trends').html('');

	//debug
	console.log(trends);

	var i = 0;
	$.each(trends, function (key, index){

		console.log(index.name);

		var name = index.name;

		$('#trends').append(name + "<br>");
	
		i++;

	});
}

/************** rateLimit *****************/
function rateLimit(data){

	var limit = data.rate;

	console.log(limit);

}

function closeLink(){
	$('#closeBox').click(function(){
		$('#loadWebpage').css('z-index', '1');
	});
}

/************** control Executions *****************/

executeViewTwo();

function executeScrobbler(count, counting){

	var count = (count-1);

	var percent = (counting/count)*100;

	$('#all').html(count);
	$('#current').html(counting);
	$('#circle').css('left', percent + "%");

}

function executeViewTwo(){

	var open = 1;

	//expand to second view
	$('#expand').click(function(){

		if(open == 1){

			var data = {
				openView: '1'
			}

			$('#expand > .title').html('Collapse');

			openViewTwo(data);
			open = '0';
		}
		else{

			var data = {
				openView: '0'
			}

			$('#expand > .title').html('Expand');

			openViewTwo(data);

			open = '1';
		}

	});

}

//pause channel

function executePause(storify, count, overwrite){

	var stop = '1';

	$('#pause').click(function(){

		if(stop == '1'){

			$('#pause').html("<img src='PlayPlay.svg'>");

			start.pause(); //if 1 pause feed
			stop = '0';
		}
		else{

			$('#pause').html("<img src='PlayPause.svg'>");

			start.cycle(storify, count, overwrite);
			stop = '1';
		}

	});

}

function executeNext(storify, count, overwrite){

	//next tweet on channel
	$('#next').click(function(){

		var next = '1';

		$('#pause').html("<img src='PlayPlay.svg'>");
		
		start.pause();

		if(next == 1){
			start.nextTweet(storify, count, overwrite);
			next = '0';
		}

	});

}

function executePrevious(storify, count, overwrite){

	//previous tweet on channel
	$('#previous').click(function(){

		var previous = '1';

		$('#pause').html("<img src='PlayPlay.svg'>");

		start.pause();

		if(previous == 1){
			start.previousTweet(storify, count, overwrite);
			previous = 0;
		}

	});

}
