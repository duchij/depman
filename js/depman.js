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
	var t = new js_comunication();
	t.addRawRequest("index.php","depman/js_getSchema",depMan,[{},"setSchema"]);
	t.sendData();

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
				obj["departament"] = dep;
				
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
	var patients = [];
	
	var parents = [];
	
	for (var i=0; i<iLn; i++)
	{
		if (inputs[i].name.indexOf("room") != -1 && inputs[i].value != ""){
			
			var patObj = {};
			
			var pt = inputs[i].name.split("_");
			
			patObj["room"] = pt[1];
			patObj["bed"] = pt[2];
			patObj["name"] = inputs[i].value;
			patObj["date"] = actualDate;
			patObj["status"] = "patient";
			
			patients.push(patObj);
		}
		
		
		
	}
		
		
		
		
		
	/*	if (input.type == "text"){
			
			
			
			
			if (input.name.indexOf("room") != -1){
				
				var patObj = {};
				
				var pt = input.name.split("_");
				
				patObj["room"] = pt[1];
				patObj["bed"] = pt[2];
				patObj["name"] = input.value;
				
				
				patients.push(patObj);
			}
			
		}
		
		
	});*/
	
	
	console.log(patients);
	
	
}



function removeRoomFnc(id)
{
	console.log(id);
}

function removeRowJs(id)
{
	$("#room_"+id).remove();
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
	
}



$(document).ready(function(){
	
	depman_init();
	
});