<!DOCTYPE html>
<html>
	<head>
		<meta name='author' content='Tobias Bohn'/>
		<meta name='description' content='Page to delete unused Referrer Keys. Main Page: https://pong.tobiasbohn.com'/>
		<meta name='keywords' content='HTML, CSS, JS, JavaScript, PHP, socket, io, socket.io, digital, ocean, pong, online, game, tobias, bohn, tobias.bhn, @tobias.bhn, tobiasbohn, tobiasbohn.com, play'/>

		<title>Delete Referrer Key</title>
		<link rel="shortcut icon" href="media/tobias-bohn-pong-icon.gif" type="image/gif"/>
		<link rel="icon" href="media/tobias-bohn-pong-icon.gif" type="image/gif" />
		<?php
			include '../client/required/pageReferrer.php';
			if (receiveReferrer($_GET['rKey']) == true) {
				echo ("<!-- Deleted Key. -->");
			}
			else {
				echo ("<!-- Deleted Key. (not) -->");
			}
		?>
	</head>
</html>

