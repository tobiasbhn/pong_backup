<!DOCTYPE html>
<html>
	<head>
		<meta name="robots" content="noindex">
		<?php
		include '../required/pageReferrer.php';
		if (receiveReferrer($_GET['rKey']) != true) {
			echo ("<meta http-equiv='refresh' content='0; URL=https://pong.tobiasbohn.com'/>");
		}?>

		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1.0'>
		<meta name='theme-color' content='#000000' />

		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />

		<title>Hello Pong! - Tobias Bohn</title>
		<link rel="shortcut icon" href="../../media/tobias-bohn-pong-icon.gif" type="image/gif"/>
		<link rel="icon" href="../../media/tobias-bohn-pong-icon.gif" type="image/gif" />

		<link rel="stylesheet" href="style.css" type="text/css"/>
		<link href='https://fonts.googleapis.com/css?family=Roboto:100' rel='stylesheet'>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<script type="text/javascript" src="script.js"></script>

		<?php
		if ($_GET['newgame'] == "true") {
			echo ("<script type='text/javascript'>newGame(event);</script>");
		}?>
	</head>
	<body onload="load()">
		<div id="start-container">
			<h1 class="text" id="start-heading-1">Wilkommen zu Pong</h1><br>
			<h2 class="text" id="start-heading-2">von Tobias Bohn</h2><br>
			<div class="input-container" id="input-container-1">
				<p class="text button" onclick="newGame(event)">Create new Game!</p>
				<p class="text button" onclick="setInputContainer(2)">Join existing Game!</p>
			</div>
			<form class="input-container" id="input-container-2" onsubmit="newPlayer(event)">
				<label for="player-name" class="text label" id="player-name-label">Bitte gebe einen Anzeigenamen ein:</label><br>
				<input type="text" class="text left" id="player-name" name="name" required maxlength="12"><br>
				<label for="game-id" class="text label" id="game-id-label">Bitte gebe die Spiele-ID ein:</label></br>
                                <input type="number" class="text left" id="game-id" name="id" required autocomplete="off"><br>
				<label for="game-key" class="text label" id="game-key-label">Bitte gebe den Spiel-Key ein:</label><br>
				<input type="text" class="text left" id="game-key" name="key" required autocomplete="off"><br>
				<p class="text button" id="join-game-back" onclick="setInputContainer(1)">Back!</p>
				<input type="submit" class="text button" id="join-game-submit" name="submit" value="Join Game!">
			</form>
			<p class="text" id="error"></p>
		</div>
	</body>
</html>
