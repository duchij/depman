<?php 

class depman extends main{
	
	function __construct()
	{
		parent::__construct("depman");
	}
	
	public function beds($data=array())
	{
		$sql = "SELECT * FROM [rooms] WHERE [departament]='MSV'";
		$sql = $this->db->buildSql($sql,$data);
		$res = $this->db->table($sql);
		
		if ($res["status"] === false){
			
			$this->tplOutError("", $res["result"]);
			return false;
			
		}
		
		$this->smarty->assign("rooms",$res["table"]);
		
		$this->tplOutput("depman/beds.tpl");
	}
	
	public function setPatients()
	{
		$sql = "SELECT * FROM [rooms] WHERE [departament]='MSV'";
		$sql = $this->db->buildSql($sql);
		
		$res = $this->db->table($sql);

		if (!$res["status"]){
			$this->tplOutError("", $res["result"]);
			return false;
		}
		
		$this->smarty->assign("beds",$res["table"]);
		
		//$res = $this->db->gt
		
		
		
		
		$this->tplOutput("depman/setpatient.tpl");
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
		$sql = "SELECT * FROM [rooms] WHERE [departament]='MSV'";
		
		$sql = $this->db->buildSql($sql,$data);
		$res = $this->db->table($sql);
			
		return array("status"=>true,"result"=>$res["table"]);
	}
	
	
	public function js_saveRoomsSettings($data)
	{
		$res = $this->db->insert_rows("rooms", $data, "REPLACE");	
		return $res;
		
	}
	
	public function saveSettings($data)
	{
		var_dump($data);
	}
	
	
}

return "depman";
?>