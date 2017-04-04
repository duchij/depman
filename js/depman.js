var depMan = this;

function addRoomWithBeds()
{
	var table = $("#roomsBeds");
	var row = table.find('tr').length-1;
	
	var row = 	"<tr id='room_"+row+"'><td><input type='number' id='room' name='room'></td>" +
				"<td><input type='number' id='beds' name='beds'></td>" +
				"<td><input type='text' id='vip_"+row+"' name='vip' pattern='\a|n\' ></td>"+
				"<td><a href='javascript:removeRowJs("+row+");' class='red medium button'>-</a></td></tr>";
	
	$("#roomsBeds").append(row);

}

function setHospitStartDate(id)
{
	$(id).datetimepicker({dateFormat:"Y-m-d H:i",format:"Y-m-d H:i"});

}



function checkVip(id)
{
	
	var vipIn = $("#vip_"+id).val();
	
	if (vipIn != "A" || vipIn != "N"){
		alert("A alebo N !!!!");
	}
	
	vipIn.val("N");
	
}

 
function loadDepSchema()
{
	/*var data = {
			dep_id:Number($("#departament").val())
	} */
	
	
	var t = new js_comunication();
	t.addRawRequest("index.php","depman/js_getSchema",depMan,[{},"setSchema"]);
	t.sendData();

}

function setSchema(status,result){
	
}


function saveDepSettings()
{
	
	var table  = $("#roomsBeds");
	
	var row = table.find('tr').length-1;
	
	var dep  = $("#departament").val();
	
	var check = true;
	
	var pattern = /\ba\b|\bn\b/;
	
	if (row > 0){
		
		var data = [];
		
		table.find("tr").each(function (row,r){
			
			if (row > 0){
				var obj = {};
				$(this).find("td").each(function(col,c){
					
					var child =  c.childNodes[0];	
					
					 if (child.type == "number")
					 {
						 var num =  Number(child.value);
						 
						 if (isNaN(num) || num == 0){
							 
							 check = false;
							 
							 return false;
						 }

						 obj[child.name] = num;
					 }
				
					 if (child.type == "text")
					 {
						
						 
						 if (child.name == "vip"){
							 
							if (pattern.test(child.value) == false){
								

								check = false;
								
								return false;
							} 		
							 
						 }
						 
						 obj[child.name] = child.value;
						 
						 
					 }
					 if (check == false){
						 return false;
					 }
				});
				obj["dep_id"] = dep;
				
				data.push(obj);
			}
			
			
		});
		
		
		if(check == true){
			var t = new js_comunication();
		
			t.addRawRequest("index.php","depman/js_saveRoomsSettings",depMan,[data,"afterSaveRoomSettings"]);
			t.sendData();
		
		}else{
			pushWindow({caption:"Error",content:"Zle hodnoty, skontrolujte si vlozene data"});
		}
		
		
		
	}
	else{
		pushWindow({caption:"Warning",content:"Ziadne postele na ulozenie...."});
	}
	
	
}

function afterSaveRoomSettings(status,result)
{
	if (status)
	{
	
	
	}else{
		pushWindow({caption:"Error",content:result});
	}
}


function deleteRoomFnc(id)
{
	var st = confirm("Naozaj zmazať? Toto je nevratné !!!");
	
	var room = Number(id.attr("name"));
	
	
	if (st){
		
		var t = new js_comunication();
		t.addRawRequest("index.php","depman/js_deleteRoom",depMan,[{room:room},"afterDeleteRoom",room]);
		t.sendData();
		
	}
	
}

function afterDeleteRoom(status,result,id)
{
	if (status){
		
		$("#room_"+id).remove();
		
	}else{
		
		pushWindow({caption:"test",content:result});
		
	}
}


function saveDepStructureFnc()
{
	var structure = $("#departament");
	
	var inputs = structure.find("input");
	
	var iLn = inputs.length;
	
	var actualDate = $("#actualDate").val();
	var saveData = [];
	
	
	for (var i=0; i<iLn; i++)
	{
		if (inputs[i].name.indexOf("room") != -1 && inputs[i].value != ""){
			
			var patObj = {};
			
			var pt = inputs[i].name.split("_");
			
			patObj["room"] = Number(pt[1]);
			patObj["bed"] = Number(pt[2])+1;
			patObj["name"] = inputs[i].value;
			patObj["date"] = actualDate;
			patObj["status"] = "patient";
			
			saveData.push(patObj);
		}
		
		if (inputs[i].name.indexOf("parent") !=-1 && inputs[i].value != ""){
			
			var parObj = {};
			
			var pt = inputs[i].name.split("_");
			
			parObj["room"] = Number(pt[1]);
			parObj["bed"] = Number(pt[2])+1;
			parObj["name"] = inputs[i].value;
			parObj["date"] = actualDate;
			parObj["status"] = "parent";
			
			saveData.push(parObj);
			
		}
	}
	
	
	var t= new js_comunication();
	
	t.addRawRequest("index.php","depman/js_saveCurrentDepStatus",depMan,[saveData,"afterDepStatusSaved"]);
	t.sendData();
}

function afterDepStatusSaved(status,result)
{
	if (!status){
		pushWindow({caption:"Error",content:result});
	}
}

function loadDepStructure()
{
	var t=new js_comunication();
	t.addRawRequest("index.php","depman/js_setPatients",depMan,[{},"setPatientsStructure"]);
	t.sendData();
}


function savePatientHospitStart(id)
{
	var btn = id.context.id;
	
	var tmp = btn.split("_");
	
	var patientName = $("#room_"+tmp[1]+"_"+tmp[2]).val().trim();
	var parentName = $("#parent_"+tmp[1]+"_"+tmp[2]).val().trim();
	
	
	if (patientName.length == 0){
		
		pushWindow({caption:"Error",content:"Nie je meno pacienta"});
		return false;
		
	}
	
	var hospit_start = $("#hstart_"+tmp[1]+"_"+tmp[2]).val().trim();
	
	if (hospit_start.length == 0){
		
		pushWindow({caption:"Error",content:"Nie je začiatok hospitalizácie"});
		return false;
		
	}
	
	
	
	
	var data = {
			room:Number(tmp[1]),
			bed:Number(tmp[2]),
			patientName:patientName,
			parentName:parentName,
			hospit_start:hospit_start,
			
			
	};
	
	
	var t = new js_comunication();
	t.addRawRequest("index.php","depman/js_savePatientHospitStart",depMan,[data,"afterSavePatientHospitStart",tmp]);
	t.sendData();
	
}


function afterSavePatientHospitStart(status,result,arg)
{
	
	
	if (!status){
		
		
		pushWindow({caption:"Error",content:result});
		return false;
		
	}
	
	var roomBed = arg[1]+"_"+arg[2];
	
	$("#room_"+roomBed).attr("readonly","readonly");
	$("#parent_"+roomBed).attr("readonly","readonly");
	var hospit_start = $("#hstart_"+roomBed).val();
	
	$("#hstart_"+roomBed).css("display","none");
	$("#hend_"+roomBed).val("");
	$("#hstart_label_"+roomBed).html(hospit_start);
	
	$("#btnhstart_"+roomBed).css('display',"none");
	
	$("#hospit_end_"+roomBed).css("display","inline");
	
	$("#hospit_end_"+roomBed).val("");
	
	

}




function setPatientsStructure(status,result)
{
	
	
	if (!status){
		
		pushWindow({caption:"Error",content:result});
		return false;
		
	}
	
	var strLn = result.length;
	
	for (var i=0; i<strLn; i++){
		
		var posId = "";
		
		switch (result[i].status)
		{
		
			case "patient":
				posId="room_"+result[i].room+"_"+result[i].bed;
				break;
			case "parent":
				posId="parent_"+result[i].room+"_"+result[i].bed;
				break;
		}
		
		$("#"+posId).val(result[i].name);
		$("#"+posId).attr("readonly","readonly");
		
		var roomBed = result[i].room+"_"+result[i].bed;
		
		$("#hstart_"+roomBed).css("display","none");
		$("#hstart_label_"+roomBed).html(result[i].hospit_start)
		$("#hospit_end_"+roomBed).css("display","inline");
		$("#btnhstart_"+roomBed).css("display","none");
		
		
		if (result[i].status === "patient"){
			$("#patientBedId_"+roomBed).val(result[i].id);
		}
		
		if (result[i].status === "parent"){
			$("#parentBedId_"+roomBed).val(result[i].id);
		}
		
	}
	
}

function loadMorningStructure()
{
	var t=new js_comunication();
	t.addRawRequest("index.php","depman/js_setMorningPlan",depMan,[{},"setMorningPlan"]);
	t.sendData();
	
}

function setMorningPlan(status,result)
{
	console.log(result);
	
	if (!status){
		
		pushWindow({caption:"Error",content:result});
		return false;
	}
	
	
	var stLn = result.length;
	
	for (var i=0; i<stLn; i++){
		
		var roomBed = result[i].room+"_"+result[i].bed;
		
		console.log(result[i].name);
		
		
		 $("#room_"+roomBed).html(result[i].name);
		 
		 $("#hstart_label_"+roomBed).html(result[i].hospit_start);
		 
		 $("#patientBedId_"+roomBed).val(result[i].bed_id);
		
	}
	
	
	
	
}




function setEndDateHospitalisation(id)
{
	
	$(id).datetimepicker(
			{
				//inline:true,
				format:'Y-m-d H:i:00',
				step:60
				
			});
	
	$(id).datetimepicker("show");
	


}


function removeRoomFnc(id)
{
	console.log(id);
}

function removeRowJs(id)
{
	$("#room_"+id).remove();
}


function changeDepBeds(){
	//console.log("la");
	
	
}


function savePatientHospitEnd(id)
{
	var btn = id.context.id;
	
	var tmp = btn.split("_");
	
	console.log(tmp);
	
	var patientBedId = $("#patientBedId_"+tmp[2]+"_"+tmp[3]).val();
	var parentBedId = $("#parentBedId_"+tmp[2]+"_"+tmp[3]).val();
	
	
	
	var hospit_end = $("#hend_"+tmp[2]+"_"+tmp[3]).val().trim();
	
	if (hospit_end.length == 0){
		
		pushWindow({caption:"Error",content:"Nie je koniec hospitalizácie"});
		return false;
		
	}
	
	var data = {
			room:Number(tmp[2]),
			bed:Number(tmp[3]),
			patientBedId:patientBedId,
			parentBedId:parentBedId,
			hospit_end:hospit_end,
			
			
	};
	
	console.log(data);
	
	//return;
	
	var t = new js_comunication();
	t.addRawRequest("index.php","depman/js_savePatientHospitEnd",depMan,[data,"afterSavePatientHospitEnd",tmp]);
	t.sendData();
}

function afterSavePatientHospitEnd(status,result,arg)
{
	if (!status){
		pushWindow({caption:"Error",content:result});
		return false;
	}
	
	var roomBed = arg[2]+"_"+arg[3];
	
	$("#hstart_"+roomBed).css("display","inline");
	$("#hstart_"+roomBed).val("");
	$("#hstart_label_"+roomBed).html("")
	$("#hospit_end_"+roomBed).css("display","none");
	$("#btnhstart_"+roomBed).css("display","inline");
	
	$("#room_"+roomBed).val("");
	$("#room_"+roomBed)[0].readOnly = false;
	$("#parent_"+roomBed).val("");
	$("#parent_"+roomBed)[0].readOnly = false;
	
	$("#patientBedId_"+roomBed).val("");
	
	$("#parentBedId_"+roomBed).val("");
	
	
	console.log(arg);
	
}

function showPlanAction(id)
{
	var element = id.context.id;
	
	var type = $("#"+element).val();
	
	var t= new js_comunication();
	t.addRawRequest("index.php","depman/js_getWorkTypes",depMan,[{type:type},"setWorkType",element]);
	t.sendData();
	
}

function setWorkType(status,result,element)
{
	
	var tmp = element.split("_");
	
	var roomBed = tmp[1]+"_"+tmp[2];
	
	if (!status){
		pushWindow({caption:"Error",content:result});
		return false;
	}
	
	var tpLn = result.length;
	
	var html = "<select style='width:150px;' class='inline' id='work_type_sel_"+roomBed+"'>";
	for (var i=0; i< tpLn; i++){
		
		html +="<option value='"+result[i].work_type_idf+"'>"+result[i].work_type_label+"</option>";
	}

	html +="</select><input id='work_type_note_"+roomBed+"' style='width:100px;' type='text' class='inline'><button id='addActionToPlan_"+roomBed+"' class='green button inline'>+</button>";
	
	$("#work_type_"+roomBed).html(html);
	
	$("#addActionToPlan_"+roomBed).on("click",function(e){
		
		addActionToPlanFnc(roomBed);
		
	});
	

}

function addActionToPlanFnc(roomBed)
{
	var workType = $("#work_type_sel_"+roomBed).val();
	var workNote = $("#work_type_note_"+roomBed).val();
	
	//console.log([workType,workNote]);
	var struct_id = $("#patientBedId_"+roomBed).val();
	
	
	
	var data = {
			work_type_idf:workType,
			work_type_note:workNote,
			struct_id:struct_id
	};
	
	//console.log(data);
	
	
	
	var t = new js_comunication();
	t.addRawRequest("index.php","depman/js_savePatientAction",depMan,[data,"afterSavePatientAction",roomBed]);
	t.sendData();
	
	
	
}

function afterSavePatientAction(status,result)
{
	console.log([status,result]);
}



function depman_init()
{
	

	//$.datetimepicker.setLocale("sk");
	$(".flatpickr").flatpickr({
		
						enableTime:true,
						plugins: [new confirmDatePlugin({})],
						confirmText:"OK",
						showAlways:true,
						dateFormat:"Y-m-d H:i",
						time_24hr:true,
						
						onOpen:function(selectedDates, dateStr, instance){
							
							instance.setDate(new Date());
						}
						
						//defaultDate:new Date()
						
		
					});	
	
	if ($("#setBeds").val() == "1"){
		
		$("#addRoom").on("click",function(e){
			addRoomWithBeds();
		});
		
		
		$("#saveSettings").on("click",function(e){
			saveDepSettings();
		});
		
		
		$("[id*=deleteRoomBtn_]").on("click",function(e){
			deleteRoomFnc($(this));
		});
		
		$("#saveDepartamentStatus").on("click",function(e){
			
			saveDepStructureFnc();
			
		});
		
		
	}
	
	
	
	if ($("#setStructure").val() == "1"){
		
		loadDepStructure();
		
		$("[id^=btnhstart]").on("click",function(){
			
			savePatientHospitStart($(this));
			
		});
		
		
		$("[id^=btn_hend]").on("click",function(){
			
			savePatientHospitEnd($(this));
			
		});
		
		
	}
	
	if ($("#setMorningStructure").val() == "1"){
		
		loadMorningStructure();
		
		$("[id^=addActionRoomBed_]").on("change",function(e){
			
			showPlanAction($(this));
			
		});
		
		
		
	}
	
}



$(document).ready(function(){
	
	depman_init();
	
});