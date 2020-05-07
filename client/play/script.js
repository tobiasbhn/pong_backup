var socket;
var oldPercent = 50;
var name;
var gameId;
var closed = false;

function load() {
	socket = io('https://pong.tobiasbohn.com:3000', {secure: true});
	socketHandler();
}

function socketHandler() {
	//CONNECT
	socket.on('connect', function() {
		introduce();
	});
	//DISCONNECT
	socket.on('disconnect', function() {
		if (!closed){
			backToLandingpage('1');
		}
	});

	//UPDATE
	socket.on('update', function(msg) {
		if (msg[0] == 'play') {
			//Set as player
			document.getElementById("load").style.display = "none"; //hide loading display
			document.getElementById("queue").style.display = "none"; //hide queue display
                        document.getElementById("play").style.display = "initial"; //show game-inputs
                        document.getElementById("play").scrollTop = document.getElementById("play-a").offsetHeight / 2; //places the scroll bars in the middle
			document.getElementById("play-percent").innerHTML = "50";
                        document.getElementById("play").addEventListener("scroll", inputUpdate); //add event listener on scrolling
			inputUpdate(true);
		} else if (msg[0] == 'queue') {
			//queued
                        document.getElementById("load").style.display = "none"; //hide loading display
			document.getElementById("play").style.display = "none"; //hide play display
                        document.getElementById("queue").style.display = "initial"; //show queued screen
                        document.getElementById("queue-number").innerHTML = msg[1];
		} else if (msg[0] == 'closed') {
			closed = true;
			backToLandingpage('2');
		}
	});
}

function introduce() {
	name = gup('name', window.location.href);
	gameId = gup('id', window.location.href);
	console.log(window.location.href + "; " + gup('name', window.location.href) + "; " + gup('id', window.location.href));
	socket.emit('introduce', [
		'play',
		name,
		gameId,
		gup('key', window.location.href),
	],(data) => {
		backToLandingpage(data);
	});
}

//updat the Inputs
function inputUpdate(forceUpdate) {
	var scrollPos = document.getElementById("play").scrollTop;
	var height = document.getElementById("play-a").offsetHeight;
	var percent = parseInt(100 * scrollPos / height);
	if (percent != oldPercent || forceUpdate == true) {
		document.getElementById("play-percent").innerHTML = percent;
		oldPercent = percent;
		//send to server
		socket.emit('inputUpdate', [gameId, name, percent]);
	}
}

function backToLandingpage(errorNum) {
	$.ajax({ url: '../required/pageReferrer.php',
		data: {fromScript: 'true'},
		type: 'post',
		success: function(output) {
			window.location.href = '/client/landingpage/index.php?err=' + errorNum + '&rKey=' + output;
		}
	});
}

//function to get the URL Parameter
function gup( name, url ) {
        if (!url) url = location.href;
        decodeURIComponent(url);
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : decodeURIComponent(results[1]);
}

