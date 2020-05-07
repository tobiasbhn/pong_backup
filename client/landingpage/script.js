function load() {
	checkErrors();
	$('#player-name').keyup(function(){
		console.log($(this).val());
		var string = $(this).val();
		if (string.match(/(noname|no name|noplayer|no player|player|name)/)) {
			//disable button
			console.log("WAIT WHAT");
			$('#join-game-submit').prop("disabled",true);
			$("#error").show();
			document.getElementById('error').innerHTML = "Please use another Name.";
		} else {
			//enable button
			console.log("ok.");
			$('#join-game-submit').prop("disabled",false);
			$('#error').innerHTML = "";
			$("#error").hide();
		}
	});
}

function setInputContainer(number) {
	$("#error").hide();
	$(".input-container").hide();
	$("#input-container-" + number).show();
}

function newGame(event) {
	if (event != undefined) {
		event.preventDefault();
	};

	str = Math.random().toString(36).substring(2, 7);
	gameKey = str.replace(/i|l|o|0/gi, "x");
	gameId = Math.floor(Math.random()*90000) + 10000;

	$.ajax({ url: '../required/pageReferrer.php',
		data: {fromScript: 'true'},
		type: 'post',
		success: function(output) {
			window.location.href = "/client/host/index.php?rKey=" + output + "&key=" + gameKey + "&id=" + gameId;
		}
	});
}

function newPlayer(event) {
	event.preventDefault();

	if ($('#player-name').val() == ''){
		$('#player-name').val('noname');
	};
	$.ajax({ url: '../required/pageReferrer.php',
		data: {fromScript: 'true'},
		type: 'post',
		success: function(output) {
			window.location.href = "/client/play/index.php?rKey=" + output + "&" + $('#input-container-2').serialize();
		}
	});
}

function checkErrors() {
	var error = gup('err', window.location.href)
	if (error != null) {
		switch(error) {
			case '1': document.getElementById('error').innerHTML = "Server closed the connection."; break;
			case '2': document.getElementById('error').innerHTML = "The Host closed the game. Connect to another game or host your own game."; break;
			case '3': document.getElementById('error').innerHTML = "The Game-Key is wrong."; break;
			case '4': document.getElementById('error').innerHTML = "There is no Game available with the ID."; break;
			case '5': document.getElementById('error').innerHTML = "No connection to Server possible."; break;
			default: document.getElementById('error').innerHTML = "Unknown Error:" + error; break;
		}
	}
}

//function to get the URL Parameter
function gup( name, url ) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : results[1];
}
