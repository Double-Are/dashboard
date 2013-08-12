Dashboard - project
=================

A real-time dashboard of your favorite tweets, timeline, lists and mentions and relevant topics. 

http://doubleare.aws.af.cm/intro 
Video (changes have been made since that version)



What you need and need to know or at the least have an understanding of:
  
	node.js, socket.io, javascript, html, css...but you might be able to get by regardless


Step One
================================================================


Create a twitter developer account and app if you haven't already. -> dev.twitter.com (google: create twitter app)

Once you have created a developer account get the: 

	"consumer_key"
	"consumer_secret"
  "access_token_key"
  "access_token_secret"

and insert them in the config.json file

Step Two
================================================================

Open your terminal if using a Mac or Linux - find the folder location
	ls and cd are your friend
	once found and in the folder type in node app.js
	in your web browser run 127.0.0.1:8000

	To use your controller use 127.0.0.1:8000/controller
	If you want to use your controller wirelessly type in ifconfig in your ternminal, get the ip address example 
		http://192.168.X.X:8000
	and type that into your mobile web browser
	
	The same address you typed in your mobile web browser needs to be the address at the top of ./js/controller.js example 
		var socket = io.connect('http://192.168.X.X:8000');

If you want to run it online, for anywhere pleasure, I would highly suggest appfog.com

Step Three
================================================================

Your twitter timeline, mentions and trends will automatically be generated (you can comment out the functions "names" in app.js to remove)

Create a List on Twitter called Dev - Add whoever you are interested in to your dev list for 
Create a List on Twitter called Crew - Add the people you are most interested in/ most check twitter users in this list (friends, news, blogs, whatever)

If you don't know where the lists are located, head to your profile on your twitter page and it'll be in the top left corner or search twitter for add/remove lists

Lastly
================================================================

For those of you who have never used node.js I'd suggest looking up the documentation and node app.js has to be running to run the application

Also, I would suggest setting the config.json's "testing:" to true keep from using up all your requests. You get 15 per 15 mins. The system is set up to use them conservatively. YOU DO NOT NEED TO REFRESH [unless something breaks]. New information will be pulled after every cycle. If you aren't getting new information after refreshing constantly, you've probably used all your tokens. Check your console. Debug information is there. 

If e.length is undefined just switch testing: back to true if you are creating your own widgets or testing. This is meant to be run on an external monitor at all times. I feel like it's purpose is wasted if it is just a tab on your browser or just a tablet app. 

Enjoy - Any questions @double_are
