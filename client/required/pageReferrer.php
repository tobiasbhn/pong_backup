<?php
	if(isset($_POST['fromScript']) && !empty($_POST['fromScript'])) {
		echo (sendReferrer());
		return;
	}

	function sendReferrer() {
		$servername = "localhost";
		$username = "pong";
		$password = "Vr!g40e73W";
		$dbname = "pong_tobiasbohn_com";

		$conn = new mysqli($servername, $username, $password, $dbname);
		if ($conn->connect_error) {return 'conerror';}

		$key = uniqid();
		$sql = "INSERT INTO page_referrers VALUES ('$key');";
		if (!$conn->query($sql)) {
			$conn->close();
			return 'sqlerror';}
		$conn->close();
		return $key;
	}

	function receiveReferrer($key) {
		if (!isset($key) || trim($key) === '') {
			return false; }

		if ($key == 'root') {
			return true; }

		$servername = "localhost";
		$username = "pong";
		$password = "Vr!g40e73W";
		$dbname = "pong_tobiasbohn_com";

		$conn = new mysqli($servername, $username, $password, $dbname);
		if ($conn->connect_error) {return false; }

		$sql = "SELECT * FROM page_referrers WHERE referrer_key = '$key'";
		$result = $conn->query($sql);
		if (!$result) {
			$conn->close();
			return false; }

		$result = mysqli_fetch_row($result)[0];
		if (!isset($result) || trim($result) === '') {
			$conn->close();
			return false; }

		$sql = "DELETE FROM page_referrers WHERE referrer_key = '$key';";
		if (!$conn->query($sql)) {
			$conn->close();
			return false; }

		$conn->close();
		return true;
	}
?>
