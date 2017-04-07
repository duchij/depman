<?php 

class depman extends main{
	
	function __construct()
	{
		parent::__construct("depman");
		
		//var_dump($_SESSION);
	}
	
	public function beds($data=array())
	{
		if (!array_key_exists("dep_id", $data)){
			
			$data["dep_id"] = $_SESSION["dep_id"];
			
		}
		
		$sql = "SELECT * FROM [rooms] WHERE [dep_id]={dep_id|i}";
		$sql = $this->db->buildSql($sql,$data);
		$res = $this->db->table($sql);
		
		if ($res["status"] === false){
			
			$this->tplOutError("", $res["result"]);
			return false;
			
		}
		
		$sql = "SELECT * FROM [deps] AS [t_dep]  
					INNER JOIN [clinics] AS [t_clinic] ON [t_clinic.clinic_id] = [t_dep.clinic_id]
				WHERE [t_clinic.clinic_id]=1;
				";
		$sql = $this->db->buildSql($sql);
		
		$deps = $this->db->table($sql);
		
		if ($deps["status"] === false){
			
			$this->tplOutError("", $deps["result"]);
			return false;
		}
		
		
		
		$this->smarty->assign("rooms",$res["table"]);
		$this->smarty->assign("deps",$deps["table"]);
		$this->tplOutput("depman/beds.tpl");
	}
	
	public function setPatients()
	{
		
		$dat = array("dep_id"=>$_SESSION["dep_id"]);
		
		$sql = "SELECT * FROM [rooms] WHERE [dep_id]={dep_id|i}";
		$sql = $this->db->buildSql($sql,$dat);
		
		$res = $this->db->table($sql);

		if (!$res["status"]){
			$this->tplOutError("depman/setpatient.tpl", $res["result"]);
			return false;
		}
		
		
		
		$this->smarty->assign("beds",$res["table"]);
		
		$this->tplOutput("depman/setpatient.tpl");
	}
	
	public function js_setPatients($data)
	{
		$dtObj = new DateTime();
		
		$yest = $dtObj->modify("-1 day");
		$dtStr = $dtObj->format("Y-m-d 00:00:00");
		
		$now = new DateTime();
		
		$dtEnd = $now->format("Y-m-d 23:59:59");
		
		
		$sql = "SELECT * FROM [structure]
				WHERE [hospit_end] IS NULL
				-- AND [hospit_start] BETWEEN {dateStr|s} AND {dateEnd|s}
				AND [dep_id] = {dep_id|i}
				";
		
		$structArr = array(
				"dep_id"=>$_SESSION["dep_id"],
				"dateStr"=>$dtStr,
				"dateEnd"=>$dtEnd,
		);
		
		$sql = $this->db->buildSql($sql,$structArr);
		
		$this->log->logData($sql,false);
		
		$structTab = $this->db->table($sql);
		
		if ($structTab["status"] === FALSE){
		
			return $this->resultStatus(false, $structTab["result"]);
		
		}
		
		return $this->resultStatus(true, $structTab["table"]);
		
	}
	
	
	public function js_deleteRoom($data)
	{
		$sql = "DELETE FROM [rooms] WHERE [room]={room|i}";
		$sql = $this->db->buildSql($sql,$data);
		
		$res = $this->db->execute($sql);
		
		return $res;
	}
	
	public function js_getSchema($data)
	{
		
		if (!array_key_exists("dep_id", $data)){
			
			$data["dep_id"]=$_SESSION["dep_id"];
			
		}
		
		$sql = "SELECT * FROM [rooms] WHERE [dep_id]={dep_id|i}";
		
		$sql = $this->db->buildSql($sql,$data);
		$res = $this->db->table($sql);
			
		return array("status"=>true,"result"=>$res["table"]);
	}
	
	
	public function js_saveRoomsSettings($data)
	{
		$res = $this->db->insert_rows("rooms", $data, "REPLACE");	
		return $res;
		
	}
	
	public function js_savePatientHospitStart($data)
	{
		
		$result = array();
		$this->log->logData($data);		
		if (empty($data["patientName"]) === FALSE) {
			$saveData = array(
					"room"=>intval($data["room"]),
					"name"=>$data["patientName"],
					"status"=>"patient",
					"hospit_start"=>$data["hospit_start"],
					"bed"=>intval($data["bed"]),
					"dep_id"=>$_SESSION["dep_id"]
			);
			
			$res = $this->db->insert_row("structure", $saveData,true,"IGNORE");
			
			if ($res["status"] === FALSE){
				
				return $this->resultStatus($res["status"], $res["result"]);
			}
			
			$result["patientBedId"] = $res["lastId"];
			
		}
		else{
			return $this->resultStatus(false, "Nie je meno pacienta");
		}
		
		
		if (!empty($data["parentName"])) {
			$saveData = array(
					"room"=>intval($data["room"]),
					"name"=>$data["parentName"],
					"status"=>"parent",
					"hospit_start"=>$data["hospit_start"],
					"bed"=>intval($data["bed"]),
					"dep_id"=>$_SESSION["dep_id"]
			);
				
			$res = $this->db->insert_row("structure", $saveData,true,"IGNORE");
				
			if ($res["status"] === FALSE){
			
				return $this->resultStatus($res["status"], $res["result"]);
			}
				
			$result["parentBedId"] = $res["lastId"];
		}
		
		return $this->resultStatus(true, $result);
		
		
	}
	
	public function js_savePatientHospitEnd($data)
	{
		if (!empty($data["patientBedId"])){
			
			$sql = "UPDATE [structure] SET [hospit_end]={hospit_end|s} WHERE [id]={patientBedId|i}";
			
			$sql = $this->db->buildSql($sql,$data);
			
			$res = $this->db->execute($sql);
			
			if ($res["status"] === FALSE){
				
				return $this->resultStatus(false, $res["result"]);
				
			}
		}
		
		if (!empty($data["parentBedId"])){
			
			$sql = "UPDATE [structure] SET [hospit_end]={hospit_end|s} WHERE [id]={parentBedId|i}";
			$sql = $this->db->buildSql($sql,$data);
				
			$res = $this->db->execute($sql);
			
			if ($res["status"] === FALSE){
			
				return $this->resultStatus(false, $res["result"]);
			
			}
			
		}
		
		return $this->resultStatus(true, "OK");
	}
	
	
	public function js_saveCurrentDepStatus($data)
	{
		if (count($data) == 0) {
			
			return $this->resultStatus(false, "No patients parents given...");
		}
		
		
		foreach($data as &$row){
			
			if (!array_key_exists('dep_id',$row)){
				$row["dep_id"]=$_SESSION["dep_id"];
			}
			
		}
		
		$res = $this->db->insert_rows("structure",$data);
		
		
		return $this->resultStatus($res["status"], $res["result"]);
	}
	
	
	public function serverSetMorningPlan($data)
	{
		$dat = array("dep_id"=>$_SESSION["dep_id"]);
		
		$sql = "SELECT * FROM [rooms] WHERE [dep_id]={dep_id|i}";
		$sql = $this->db->buildSql($sql,$dat);
		
		$res = $this->db->table($sql);
		
		if (!$res["status"]){
			$this->tplOutError("depman/setpatient.tpl", $res["result"]);
			return false;
		}
		
		$this->smarty->assign("beds",$res["table"]);
		
		$this->tplOutput("depman/setmorningplan.tpl");

	}
	
	
	public function js_setMorningPlan($data)
	{
		$dtObj = new DateTime();
		
		$yest = $dtObj->modify("-1 day");
		$dtStr = $dtObj->format("Y-m-d 00:00:00");
		
		$now = new DateTime();
		
		$dtEnd = $now->format("Y-m-d 23:59:59");
		
		
		$sql = "SELECT 
					[t_struct.name] AS [name], [t_struct.bed] AS [bed], [t_struct.room] AS [room], [t_struct.hospit_start] AS [hospit_start],
					[t_struct.dep_id] AS [dep_id], [t_struct.id] AS [bed_id],
				
					GROUP_CONCAT([t_plan.work_type_idf], '|') AS [work_type_idf], GROUP_CONCAT([t_plan.work_type_note],'|') AS [work_type_note],
					GROUP_CONCAT([t_plan.id], '|') AS [work_plan_id], GROUP_CONCAT([t_plan.status],'|') AS [plan_status],
				
					[t_types.work_type] AS [work_type]
				
				FROM [structure] AS [t_struct]
				
				INNER JOIN [work_plan] AS [t_plan] ON [t_struct.id] = [t_plan.struct_id]
				INNER JOIN [work_types] AS [t_types] ON [t_plan.work_type_idf] = [t_types.work_type_idf]
				
					WHERE [t_struct.hospit_end] IS NULL
					-- AND [t_struct.hospit_start] BETWEEN {dateStr|s} AND {dateEnd|s}
					AND [t_struct.dep_id] = {dep_id|i}
					AND [t_struct.status] = 'patient'
					-- AND [t_plan.plan_date] = (SELECT DATE('now'))
				GROUP BY [t_types.work_type_idf]
				ORDER BY [t_types.work_type]
				";
		
		
		$structArr = array(
				"dep_id"=>$_SESSION["dep_id"],
				"dateStr"=>$dtStr,
				"dateEnd"=>$dtEnd,
		);
		
		$sql = $this->db->buildSql($sql,$structArr);
		$this->log->logData($sql);
		
		
		//$this->log->logData($sql,false);
		
		$structTab = $this->db->table($sql);
		
		if ($structTab["status"] === FALSE){
		
			return $this->resultStatus(false, $structTab["result"]);
		
		}
		
		$table = $structTab["table"];
		
		$result = array();
		
		foreach ($table as $row){
			
			if (!isset($result[$row["room"]])){
				
				$result[$row["room"]] = array();
			
			}
			
			if (!isset($result[$row["room"]][$row["bed"]])){
				
				$result[$row["room"]][$row["bed"]] = array(
						
					"name"	=>$row["name"],
					"bed"	=>$row["bed"],
					"room"	=>$row["room"],
					"bed_id"=>$row["bed_id"],
					"hospit_start"=>$row["hospit_start"],
					"plan"	=>array(),
						
				);
			}
			
			
			$work_type_idfs = explode("|",$row["work_type_idf"]);
			$work_type_notes = explode("|",$row["work_type_note"]);
			$work_plan_ids = explode("|",$row["work_plan_id"]);
			$work_plan_sts = explode("|",$row["plan_status"]);
			
			$wtLn = count($work_type_idfs);
			
			if (!isset($result[$row["room"]][$row["bed"]]["plan"][$row["work_type"]])){
				
				$result[$row["room"]][$row["bed"]]["plan"][$row["work_type"]] = array();
				
			}
			
			for ($r=0; $r<$wtLn; $r++){
			
				$result[$row["room"]][$row["bed"]]["plan"][$row["work_type"]][] = array(
							
																						"work_type_idf" => $work_type_idfs[$r],
																						"work_type_note" => $work_type_notes[$r],
																						"work_plan_id" => $work_plan_ids[$r],
																						"work_plan_status" => $work_plan_sts[$r]
						);
			
			}
		}
		
		return $this->resultStatus(true, $result);
	}
	
	public function js_getWorkTypes($data)
	{
		$sql = "SELECT * 
					FROM [work_types] 
				WHERE [work_type] = {type|s}
				AND [dep_id] = {dep_id|i}
				
				";
		
		$data["dep_id"] = $_SESSION["dep_id"];
		
		$sql = $this->db->buildSql($sql,$data);
		
		$res = $this->db->table($sql);
		
		if (!$res["status"]){
			return $this->resultStatus(false, $res["result"]);
		}
		
		return $this->resultStatus(true, $res["table"]);
	}
	
	
	public function js_savePatientAction($data)
	{
		
		if (empty($data["work_type_note"])){
			
			unset($data["work_type_note"]);
		}
		$res = $this->db->insert_row("work_plan", $data,true);
		
		$res["result"]["data"]=$data;
		
		
		return $this->resultStatus($res["status"], $res);
	}
	
	
	public function js_updatePlanStatus($data)
	{
		
		$sql = "";
		
		switch ($data["action"]){
			
			case "cancel":
				$sql = "UPDATE [work_plan] SET [status]='canceled' WHERE [id]={planId|i}";
				break;
			case "done":
				$sql = "UPDATE [work_plan] SET [status]='done' WHERE [id]={planId|i}";
				break;
			
		}
		
		
		$sql = $this->db->buildSql($sql,$data);
		$res = $this->db->execute($sql);
		
		return $this->resultStatus($res["status"], $res["result"]);
		
	}
	
	
	
	
	public function saveSettings($data)
	{
		var_dump($data);
		
		
		
		
	}
	
	
}

return "depman";
?>