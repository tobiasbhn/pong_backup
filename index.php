<!DOCTYPE html>
<html>
	<head>
		<meta charset='utf-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1.0'>
		<meta name='theme-color' content='#000000' />
		<meta name='author' content='Tobias Bohn'/>
		<meta name='description' content='Host the traditional Pong Game online and Play together with Friends. Made by Tobias Bohn.'/>
		<meta name='keywords' content='HTML, CSS, JS, JavaScript, PHP, socket, io, socket.io, digital, ocean, pong, online, game, tobias, bohn, tobias.bhn, @tobias.bhn, tobiasbohn, tobiasbohn.com, play'/>

		<title>Pong - Tobias Bohn</title>
		<link rel="shortcut icon" href="media/tobias-bohn-pong-icon.gif" type="image/gif"/>
		<link rel="icon" href="media/tobias-bohn-pong-icon.gif" type="image/gif" />
		<link rel="stylesheet" href="client/style.css" type="text/css"/>
	</head>
	<body>
		<!-- Host the traditional Pong Game online and Play together with Friends. -->
		<!-- Autor: Tobias Bohn -->
		<!-- Visit me on Instagram: @tobias.bhn -->
		<!-- Visit me on Web: tobiasbohn.com -->
		<!-- Contacte me via Mail: info@tobiasbohn.com -->
		<!-- For detailed Informaion or Questions about the Code or Implementation, feel free to send me an Email to the Mail-Adress above. -->

		<?php
			include 'client/required/pageReferrer.php';
			$key = sendReferrer();
			$newgame = ($_GET['newgame'] == "true" ? "&newgame=true" : "");
		?>
		<script>
			if (!inIframe()) {
				window.onload = function() {
					document.getElementById("notice").style.display = 'none';
					frame = document.createElement("IFRAME");
					frame.id = "frame";

					newgame = sessionStorage.getItem("newgame") == "true" ? "&newgame=true" : "";
					sessionStorage.removeItem("newgame");
					frame.src = "/client/landingpage/index.php?rKey=<?php echo $key; ?>" + newgame;
					document.body.appendChild(frame);
					frame.style.display = 'initial';
				}
			}

			function inIframe() {
				try {
					return window.self !== window.top;
				} catch (e) {
					return true;
				}
			}
		</script>

		<p id="notice">Notice: Please allow Scripts on this page.<br><br>
			Pleas visit <a href="https://pong.tobiasbohn.com">pong.tobiasbohn.com</a> to use.<br>
			If you want to embed the game to your Website, please send an Email to info@tobiasbohn.com to ask for permission.<br><br><br>
			Tobias Bohn<br>
			Mail: info@tobiasbohn.com<br>
			Web: <a href="http://tobiasbohn.com" target="_blank">tobiasbohn.com</a><br>
			Instagram: <a href="https://www.instagram.com/tobias.bhn/" target="_blank">@tobias.bhn</a></p>
		<noscript><iframe id="frame" src="/delete/delete.php?rKey=<?php echo $key; ?>">Your Webbrowser does not support iframes.</iframe></noscript>
	</body>
</html>
