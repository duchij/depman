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
		
		$yest = $dtObj->modify("-3 day");
		$dtStr = $dtObj->format("Y-m-d 00:00:00");
		
		$now = new DateTime();
		
		$dtEnd = $now->format("Y-m-d 23:59:59");
		
		
		$sql = "SELECT * FROM [structure]
				WHERE [hospit_end] IS NULL
				AND [date] BETWEEN {dateStr|s} AND {dateEnd|s}
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
	
	public function saveSettings($data)
	{
		var_dump($data);
	}
	
	
}

return "depman";
?>