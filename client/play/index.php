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

		<title>Play Pong! - Tobias Bohn</title>
		<link rel="shortcut icon" href="../media/tobias-bohn-pong-icon.gif" type="image/gif"/>
		<link rel="icon" href="../media/tobias-bohn-pong-icon.gif" type="image/gif" />

		<link rel="stylesheet" href="style.css" type="text/css"/>
		<link href='https://fonts.googleapis.com/css?family=Roboto:100' rel='stylesheet'>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<script type="text/javascript" src="script.js"></script>
	</head>
	<body onload="load()">
		<div class="stop-url-bar-rezizing" id="load">
			<h1 id="loadText">LOAD</h1>
		</div>

		<div class="stop-url-bar-rezizing" id="play">
			<div id="play-a" class="play-boxes"></div>
			<div id="play-b" class="play-boxes">
				<p id="play-percent">50</p>
			</div>
			<div id="play-c" class="play-boxes"></div>
                </div>

		<div class="stop-url-bar-rezizing" id="queue">
			<p id="queueText">You are in Queue<br><span id="queue-number">0</span></p>
                </div>
	</body>
</html>
