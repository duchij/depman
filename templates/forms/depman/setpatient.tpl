{$structTab|var_dump}
<div class="row padded">
<input type="hidden" id="setStructure" value="1">
<h2>Nastavenie pacientov pre datum {$smarty.now|date_format:'%Y-%m-%d'}</h2>

<input type="hidden" id="actualDate" value="{$smarty.now|date_format:'%Y-%m-%d'}">
<div id="departament">
		{foreach from=$beds item=bed key=k}
		<div class="row">
			<div class="one third"><h3>Izba cislo: {$bed.room}</h3>
			{if $bed.vip == "a"}
				<span class="red">Nadštandard</span>
			{/if}
			</div>
				
			<div class="two third">
				{section name=inb start=0 loop=$bed.beds step=1}
					<p>Pacient: 
					<input type="text" class="inline" style="width:250px;" name="room_{$bed.room}_{$smarty.section.inb.index}" id="room_{$bed.room}_{$smarty.section.inb.index}" ><br>
					Hz: <span class="asphalt" id="hstart_room_{$bed.room}_{$smarty.section.inb.index}">
							<input type="text" style="width:100px;" class="inline" id="hstart_{$bed.room}_{$smarty.section.inb.index}" onblur="setHospitStartDate(hstart_{$bed.room}_{$smarty.section.inb.index});">
							<button onclick="saveStartHospit(room_{$bed.room}_{$smarty.section.inb.index});" id="" class="green button">Prijem</button>
						</span>	
					
								
					Hk: <span id="hend_room_{$bed.room}_{$smarty.section.inb.index}"></span><br>	
					
					Rodic: <input type="text"  class="inline" style="width:250px;" name="parent_{$bed.room}_{$smarty.section.inb.index}" id="parent_{$bed.room}_{$smarty.section.inb.index}" >
					
					</p>
				{/section}	
			</div>
			<hr>
		</div>
		{/foreach}	
		<button id="saveDepartamentStatus" class="button green">Uloz rozloezenie</button>
</div>		

</div>