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

		<title>Host Pong! - Tobias Bohn</title>
		<link rel="shortcut icon" href="../../media/tobias-bohn-pong-icon.gif" type="image/gif"/>
		<link rel="icon" href="../../media/tobias-bohn-pong-icon.gif" type="image/gif" />

		<link rel="stylesheet" href="style.css" type="text/css"/>
		<link href='https://fonts.googleapis.com/css?family=Roboto:100' rel='stylesheet'>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<script type="text/javascript" src="script.js"></script>
		<script type="text/javascript" src="game.js"></script>
	</head>
	<body onload="load()">
		<div class="stop-url-bar-rezizing" id="load">
			<h1 id="loadText">LOAD</h1>
		</div>
		<div class="stop-url-bar-rezizing" id="game">
			<canvas id="canvas">Your Browser does not support the Canvas-Element.</canvas>
		</div>
	</body>
</html>
