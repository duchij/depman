var dep = {
		room_110:[{id:"hash",meno:"meno",wt:[]},{id:"hash",meno:"meno2",wt:[]},{id:"hash",meno:"meno3",wt:[]}],
		room_111:[{id:"hash",meno:"meno",wt:[]},{id:"hash",meno:"meno2",wt:[]},{id:"hash",meno:"meno3",wt:[]}]
	}

var labExamsArr = [
             {type:"KO",label:"Krvny obraz"},
             {type:"VP",label:"Vnutorne prostredie"},
             {type:"HKV",label:"Hemokoagulacne"},
             {type:"MOC",label:"Moc chem+sed"},
             {type:"K+C",label:"Moc kultivacne + citlivost"},
             {type:"IMUNO",label:"Imunologicke"},
             {type:"OM",label:"Onko Markery"},

             ];


var docExamsArr = [
                   {type:"ped",label:"Pediatricke vysetrenie"},
                   {type:"neur",label:"Neurologicke vysetrenie"},
                   {type:"gyn",label:"Gynekologicke vysetrenie"},
                   {type:"hema",label:"Hematologicke vysetrenie"},
                   {type:"onko",label:"Onkologicke vysetrenie"},
                   {type:"orto",label:"Ortpopedicke vys"},
                   {type:"reum",label:"Reumatologicke vys"},
                   {type:"imuno",label:"Imunologicke vysetrenie"},
                   {type:"derma",label:"Kozne vysetrenie"},

                   ];

var patientStatus = [
                     {type:"home",label:"Prepustenie"},
                     {type:"move",label:"Preklad na "},
                     {type:"new",label:"Prijem"},
                     ];

function init()
{
	
	
	/*window.addEventListener('load', function(e) {

	      window.applicationCache.addEventListener('updateready', function(e) {
	        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
	          // Browser downloaded a new app cache.
	          // Swap it in and reload the page to get the new hotness.
	          window.applicationCache.swapCache();
	          if (confirm('A new version of this site is available. Load it?')) {
	            window.location.reload();
	          }
	        } else {
	          // Manifest didn't changed. Nothing new to server.
	        }
	      }, false);

	    }, false);*/
	
if (window.navigator.onLine){
		
		console.log("online");
	
	}else{
		
		console.log("offline");
	}
	
	if (typeof(Storage) === undefined) {
		console.log("zle je");
	}
	
	sessionStorage.setItem("pokus",{tra:"tra"});
	
	$("#result").html(sessionStorage.pokus);	
	
	
	window.addEventListener("offline",function(e) {
		
		console.log("event offline");
		
		
	});
	
	
	window.addEventListener("online",function(e) {
		
		console.log("event online");
		
		
	});
	
	
	for (var room in dep){
		
		var roomData = $("<div/>").addClass("room");
		roomData.html(room);
		
		var patients = dep[room];
		var patLn = patients.length;
		
		for (var i=0; i < patLn; i++){
			
			var patData = $("<div/>").addClass("bed");
			patData.html(patients[i].meno);
			
			roomData.append(patData);
			
			
			var labExam = "<select>";
			
			var labExamLn = labExamsArr.length;
			for (var j=0; j<labExamLn; j++)
			{
				labExam +="<option value='"+labExamsArr[j].type+"'>"+labExamsArr[j].label+"</option>";
			}
			
			labExam +="</select>";

			console.log(labExam);
			
			var labExamStyle = $("<div/>").addClass("labExam").attr("id","id_"+i);
			
			$("#id_"+i).on("change",function(e){
				
				console.log($(e.target).find("option:selected").val());
				
			});
			
			
			labExamStyle.html(labExam);
			
			
			
			roomData.append(labExamStyle);
			
		}
		
		$("#departament").append(roomData);
		
	}
	
}


$(document).ready(function(){
	
	init();
	
	
	/*$("select").on('change',function(e){
		
		console.log(e);
		
	});*/
	
	
});