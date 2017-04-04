{*$structTab|var_dump*}
<div class="row padded">
<input type="hidden" id="setStructure" value="1">
<h2>Nastavenie pacientov pre dátum {$smarty.now|date_format:'%Y-%m-%d'}</h2>

<input type="hidden" id="actualDate" value="{$smarty.now|date_format:'%Y-%m-%d'}">
<div id="departament">
		{foreach from=$beds item=bed key=k}
		<div class="row box">
			<div class="one third"><h3>Izba číslo: <div class="success box inline" style="width:100px;">{$bed.room}</div></h3>
			{if $bed.vip == "a"}
				<div class="warning box" style="width:100px;"><span class="red">Nadštandard</span></div>
			{/if}
			</div>
				
			<div class="two third">
				{section name=inb start=0 loop=$bed.beds step=1}
				<div class="info box">
					<h3 class="black">Posteľ {$smarty.section.inb.index+1}</h3>
					<p>Pacient:
					<input type="hidden" id="patientBedId_{$bed.room}_{$smarty.section.inb.index}" value="">
					<input type="text" class="inline" style="width:250px;" name="room_{$bed.room}_{$smarty.section.inb.index}" id="room_{$bed.room}_{$smarty.section.inb.index}" >
					Rodič: 
					<input type="hidden" id="parentBedId_{$bed.room}_{$smarty.section.inb.index}" value="">
					<input type="text"  class="inline" style="width:250px;" name="parent_{$bed.room}_{$smarty.section.inb.index}" id="parent_{$bed.room}_{$smarty.section.inb.index}" >
					<p>Začiatok hospitalizácie: <input class="flatpickr inline" type="text" style="width:150px;" id="hstart_{$bed.room}_{$smarty.section.inb.index}">
						&nbsp; <strong><span id="hstart_label_{$bed.room}_{$smarty.section.inb.index}" class="asphalt bold medium" class="inline"></span></strong>
						
						<button id="btnhstart_{$bed.room}_{$smarty.section.inb.index}" class="green button">Príjem</button>
						</p>
					
						<div id="hospit_end_{$bed.room}_{$smarty.section.inb.index}" style="display:none;" class="inline">			
						Koniec hospitalizácie: <input type="text" class="flatpickr inline" style="width:150px;" id="hend_{$bed.room}_{$smarty.section.inb.index}">
						<button id="btn_hend_{$bed.room}_{$smarty.section.inb.index}" class="red button">Demitus</button>
						</div>
					</p>
				</div>
				{/section}	
			</div>
			<hr>
		</div>
		{/foreach}	
</div>		
</div>