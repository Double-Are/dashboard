/************** BOOT *****************/
//appfog
//var controller = io.connect('http://appfog_name.aws.af.cm/controller');

//ip address (using ifconfig) to run controller from mobile device 
//var controller = io.connect('http://192.168.X.X:8000/controller'); 

//localhost
var controller = io.connect('http://127.0.0.1:8000/controller'); 


controller.on('scrobbler', function(data){

	console.log(data);

	var count = (data.content.scrobbler.all); //total number of tweets loaded
	var current = data.content.scrobbler.current; //current tweet on

	var count = (parseInt(count)-1); //subtract value to match scrobbler on root page
	var current = (current-1); //subtract a value to match scrobbler on root page

	var percent = (current/count)*100;

	$('#all').html(count);
	$('#current').html(current);
	$('#circle').css('left', percent + "%");

});

//I really have to fix this code - so sucky T__T (Thrown together)
controller.on('connect', function(){

	var open = '1',
		stop = '1';

	$('#button').click(function(){

		setTimeout(function(){ $('#response').fadeOut(); }, 1500);

		var words = $('#newTopic').val();

		if(words.length != 0){

			$('#response').html('Search');
    		$('#response').fadeIn();

			controller.emit('fullControl', {newStream: words});

			//remove textarea content
			$('#newTopic').val('');
		}
		else{

			$('#response').html('No Search Result');
    		$('#response').fadeIn();

			return null;
		}

	});

	$('#photo').click(function(){

		setTimeout(function(){ $('#response').fadeOut(); }, 1500);

		var words = $('#newTopic').val();

		if(words.length != 0){

			$('#response').html('Search Photos');
    		$('#response').fadeIn();

			controller.emit('fullControlPhoto', {newStream: words});

			//remove textarea content
			$('#newTopic').val('');
		}
		else{

			$('#response').html('No Search Result');
    		$('#response').fadeIn();

			return null;
		}

	});

	//expand to second view
	$('#expand').click(function(){
		
		setTimeout(function(){ $('#response').fadeOut(); }, 1500);

		if(open == '1'){


    		$('#response').html('Expand');
    		$('#response').fadeIn();

			$('#expand > .title').html('Collapse');
			controller.emit('expand', {openView: open});
			open = '0';
		}
		else{

			$('#response').html('Collapse');
			$('#response').fadeIn();

			$('#expand > .title').html('Expand');
			controller.emit('expand', {openView: open});
			open = '1';
		}

	});

	//pause channel
	$('#pause').click(function(){

		setTimeout(function(){ $('#response').fadeOut(); }, 1500);

		if(stop == '1'){

    		$('#response').html('Pause Feed');
    		$('#response').fadeIn();

			$('#pause').html("<img src='PlayPlay.svg'>");
			controller.emit('pauseChannel', {pauseChannel: stop});
			stop = '0';
		}
		else{

			$('#response').html('Starting Feed');
    		$('#response').fadeIn();

			$('#pause').html("<img src='PlayPause.svg'>");
			controller.emit('pauseChannel', {pauseChannel: stop});
			stop = '1';
		}

	});

	//next tweet on channel
	$('#next').click(function(){

		var next = '1';
		console.log(next);

		$('#pause').html("<img src='PlayPlay.svg'>");
		controller.emit('nextChannel', {nextChannel: next});
		stop = '0';
	});

	//previous tweet on channel
	$('#previous').click(function(){

		var previous = '1';
		console.log(previous);

		$('#pause').html("<img src='PlayPlay.svg'>");
		controller.emit('previousChannel', {previousChannel: previous});
		stop = '0'
	});


});