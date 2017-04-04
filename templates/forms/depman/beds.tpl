{*$deps|@var_dump*}
<input type="hidden" id="setBeds" value="1">
<div class="row">
Oddelenie:

	<select id="departament"  onchange="loadDepSchema();">
		{foreach from=$deps key=k item=dep}
			<option value="{$dep.dep_id}">{$dep.dep_label}</option>
		{/foreach}
	
		
	</select>
	<table id="roomsBeds"> 
		<thead>
			<tr>
				<td><strong>Miestnosť</strong><br><i>(Číslo)</i></td>
				<td><strong>Počet postelí</strong><br><i>(Číslo)</i></td>
				<td><strong>Nadštandard</strong><br><i>(Číslo a alebo n)</i></td>
				<td><button id="addRoom" class="blue circle">+</button>
			</tr>
		</thead>
		
		{foreach from=$rooms key=k item=room}
			<tr id="room_{$room.room}">
				<td><input type="number" name="room" value="{$room.room}"></td>
				<td><input type="number" name="beds" value="{$room.beds}"></td>
				<td><input type="text" name="vip" value="{$room.vip}"></td>
				
				<td><button id="deleteRoomBtn_{$room.room}" name="{$room.room}" class="button red">-</button></td>
			</tr>
		{/foreach} 
		
	</table>
	<button id="saveSettings">Ulozit nastavenie</button>
<!-- </div> -->