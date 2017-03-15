<!DOCTYPE html>

<html>
<head>
	<meta charset="utf-8">
	{include file="css.tpl"}
</head>
<body>
<div id="dialogWindow"></div>
<div id="content">
	<div class="row">
		<div class="two third">
<!-- 			<img src="images/memreg/logo.png" align="left">--><h1 class="double-gap-top">Tabula MSV</h1> 
		</div>
		<div class="one third grey">
			<div id="login_form">
			{if $smarty.session.account_type}
				Logged in: <strong>{$smarty.session.account}</strong>
				<a href="index.php?c=main&m=logout" class="button red" target="_self">LogOut</a>
				{else}
				<form action="index.php?c=main&m=login" method="POST">
				<p class="small">Name: <input type="text" name="name" style="width:100px;display:inline;">
				Password: <input type="password" name="password" style="width:100px;display:inline;">
				<input type="submit" value="login" class="blue button">
				</p>
				</form>
			{/if}
			</div>
			<p class="small">{$smarty.now|date_format:"%D, %A"}</p>
		</div>
	</div>
	
	<div class="row">
		<hr>
	</div>
	
	<div class="row">
		<div class="one fifth">
<!-- 			<nav class="nav vertical nocollappse warning box"> -->
<!-- 				<li><a href="index.php" target="_self">Home</a></li> -->
<!-- 				<li><a href="http://espes.eu" target="_blank">Back to espes.eu</a> -->
<!-- 			</nav> -->
		
			<!-- <nav class="nav vertical nocollappse">
				<h2 class="blue"> Main menu</h2>
				<ul>
					<li><a href="index.php?c=poll&m=create" target="_self">Create Poll</a></li>
					<li><a href="index.php?c=discus&m=create" target="_self">Create discussion</a></li>
				</ul>	
			</nav> -->
			
			{*if $smarty.session.account_type=="admin"*}
			<nav class="nav vertical nocollappse warning box">
				<h2 class="green">Miestnosti</h2>
				<ul>
					<li class="green"><a href="index.php?c=depman&m=beds" target="_self">Nastavenie oddelenia</a></li>
					<li class="green"><a href="index.php?c=depman&m=setPatients" target="_self">Ulozenie pacientov</a></li>
					
				</ul>
			</nav>
			{*/if*}
		</div>
		<div class="three fifth">
			{$errorMsg}
			
			
			
			{if $body}
				{include file="forms/$body"}
				{else}
				{include file="body.tpl"}
			{/if}
			
			
		</div>	
		
		<div class="one fifth">
			
		</div>
		
	</div>
	<div class="row">
		<div class="box yellow">
			<p class="small">
				<center>Design by &copy;Boris Duchaj.....</center>
			</p>
		</div>
	</div>
</div>
{include file="scripts.tpl"}
</body>
</html>
