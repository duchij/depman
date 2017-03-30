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

function setPatientsStructure(status,result)
{
	
	console.log([status,result]);
	
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
		$("#hstart_"+posId).html(result[i].hospit_start);
		
		if (result[i].hospit_end !== null){
			
			$("#hend_"+posId).html(result[i].hospit_start);
		
		}else{
			
			var btnId = "hend_btn_"+posId;
			
			var button = "<input type='text' id='hend_btn_"+posId+"' onblur='setEndDateHospitalisation("+btnId+");' style='width:150px;' class='inline'>" +
						 "<button onclick='endPatientHospit("+posId+");' class='red button'>Prepustit</button>";
			
			$("#hend_"+posId).html(button);
			
		}
		
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



function depman_init()
{
	

	
	
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
	
	if ($("#setStructure").val() == "1"){
		loadDepStructure();
	}
	
}



$(document).ready(function(){
	
	depman_init();
	
});