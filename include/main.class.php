<?php
/**
 * @author bduchaj
 *
 */
class main {


    var $mail;

    /**
     * @var log $log logovacie funkcie
     */
    var $log;

    /**
     * @var smarty $smarty work with smarty template engine
     */
    var $smarty;

    /**
     * @var $commJs  Function with ascynv callbacks
     */
    var $commJs;

    /**
     * @var db the SQLlite object....
     */
    var $db;

    var $url;

    var $runClassStr="";

    function __construct($className=""){




        $this->log = new log();

        $this->db = new db();

        $this->smarty = new Smarty();

       // $this->mail = new PHPMailer();

        $this->smarty->template_dir = APP_DIR."templates/";
        $this->smarty->compile_dir  = APP_DIR."templates_c/";
        $this->smarty->config_dir   = APP_DIR."../smarty/configs/";
        $this->smarty->cache_dir    = APP_DIR."cache/";

       // $this->smarty->assign("orthancUrl",O_URL);

        $this->url = O_URL;

        $this->smarty->assign("webUrl",WEB_URL);

        $this->smarty->assign("router",ROUTER);



        $this->commJs = new commJs();
        if ($className!="")
        {
            $this->runClassStr = $className;
        }
        
        $this->loadSessionData();
        
		

    }
    /**
     * Modifies return parameters
     *
     * @param boolean $status
     * @param mixed $result
     * @return array($status,$result);
     */
    public function resultStatus($status,$result){
        return array("status"=>$status,"result"=>$result);
    }
    
    
    protected function loadSessionData($data=array())
    {
    	$_SESSION["dep_id"] = 1;
    	$_SESSION["clinic_id"] = 1;
    }
    

    public function resultData($resultStatus){
        return $resultStatus["result"];
    }

    public function loadObject($name){
        /*if (isset($GLOBALS[$name])){
            $class = &$GLOBALS[$name];
            */
      //  }else{
            if (file_exists(INCLUDE_DIR.$name.".class.php")){

               $classTmp = require_once INCLUDE_DIR.$name.'.class.php';

               $class = new $classTmp();
            }else{
                return NULL;
            }
//        }

       // $this->runClassStr = $class;
        return $class;
    }

    /**
     *
     * Funkcia zavola triedu a instancuje dla formularu ktory ju zavolal a odovzda jej webovsky request.
     *
     * @param array $data REQUEST data
     *
     * @todo toto treba obohatit a furu veci :)
     */
    public function run($data)
    {

       // var_dump($data);
       // exit;

        if (isset($data["a"])&& $data["a"]=="async"){
            $this->runAsync($data);

            return true;
        }

        if (isset($data["c"])) {

            $classStr = $data["c"];

            if (file_exists(INCLUDE_DIR.$classStr.".class.php"))
            {
                //$this->runClassStr = $classStr;

                if( $classStr=="main"){
                    if (!method_exists($this, $data["m"])){
                        echo "No main method exiting";
                        exit;
                    }
                    $this->$data["m"]($data);
                    return;
                }


                if (isset($GLOBALS[$classStr])){
                     $class = $GLOBALS[$classStr];
                }else{
                    require_once INCLUDE_DIR.$classStr.'.class.php';
                    $class = new $classStr();
                }
                if (isset($data["m"])){
                    $method = $data["m"];
                    if (method_exists($class, $method)){

                        unset($data["c"]);
                        unset($data["m"]);

                        $class->$method($data);
                    }else{
                        $this->smarty->assign("gError","Method {$method} in class {$classStr} Not Exists !!!!");
                        $this->smarty->display("main.tpl");
                        exit;
                    }
                }
            }
            else
            {
                echo "no such class exiting";
                exit;
            }
        }
        else  //fallback trieda
        {
           $this->smarty->display("main.tpl");
        }
    }

    function runAsync($data){

        //var_dump($data);
        $this->commJs->getRespond($data["data"],"rjson");
    }

    function showErrorMsg($error){
        $this->smarty->assign("error",$error);
        $this->smarty->display("main.tpl");
        exit;
    }

    function tplOutError($templateFile,$error)
    {

        $errorMsg="<div class='error box large'>{$error}</div>";
        $this->smarty->assign("errorMsg",$errorMsg);
        $this->smarty->assign("className",$this->runClassStr.".js");
        
        if (!empty($templateFile)){
            $this->smarty->assign("body",$templateFile);
        }
        
        $this->smarty->display("main.tpl");
    }

    function tplOutput($templateFile)
    {
        //var_dump($this);
        $this->smarty->assign("className",$this->runClassStr.".js");
        $this->smarty->assign("body",$templateFile);
        $this->smarty->display("main.tpl");
    }

    function login($data)
    {
       //var_dump($data);
       $name = trim($data["name"]);
       $password = sha1(SALT.trim($data["password"]));

       if (!preg_match("/^[a-z0-9_]+$/",$name))
       {
           $this->tplOutError("", "Incorect login name");
          // exit;
          return;
       }
       $sql = $this->db->buildSql("
               SELECT [name],[passwd],[users_id] FROM [ep_accounts] WHERE [name]={name|s}", array("name"=>$name));
       $row = $this->db->row($sql);

       if ($row===FALSE){
           $this->tplOutError("", "No such user....");
           return;
       }

       if ($row["passwd"]==NULL){
           $_SESSION["cpAcc"] = $name;
           $this->tplOutput("accounts/passwd.tpl");
           return;
       }

       if ($row["passwd"] != $password){
          $this->tplOutError("","Incorrect password.....");
          return;
       }
       setcookie("session.espesoffice",session_id());

       $this->startSession($name);

    }

    public function logout($data)
    {
        session_unset();
        session_destroy();
        setcookie("session.espesoffice","");
        $this->smarty->display("main.tpl");
    }

    public function startSession($name)
    {
        $sql = $this->db->buildSql("
               SELECT [name],[passwd],[users_id],[type]
                    FROM [ep_accounts]
               WHERE [name]={name|s}", array("name"=>$name));
        $row = $this->db->row($sql);

        $_SESSION["account"] = $row["name"];
        $_SESSION["users_id"] = $row["users_id"];
        $_SESSION["account_type"] = $row["type"];

        $this->smarty->display("main.tpl");

    }


    function sendMailMsg($data)
	{

		$this->mail->isSMTP();                                      // Set mailer to use SMTP
		$this->mail->Host = MAIL_SERV;  	// Specify main and backup server
		$this->mail->Port = MAIL_PORT;
		$this->mail->SMTPAuth = true;                               // Enable SMTP authentication
		$this->mail->Username = MAIL_ACC;                            // SMTP username
		$this->mail->Password = MAIL_PSS;                           // SMTP password
		$this->mail->SMTPSecure = 'ssl';                            // Enable encryption, 'ssl' also accepted

		$this->mail->From = MAIL_ACC;
		$this->mail->FromName = "ESPES web";
		//$this->mail->addAddress('josh@example.net', 'Josh Adams');  // Add a recipient
		$this->mail->addAddress($data['email']);               // Name is optional
		//$this->mail->addReplyTo($_SESSION['abstrakter']['mail_acc'], $_SESSION['abstrakter']['mail_from_name']);
		//$this->mail->addCC($_SESSION['abstrakter']['mail_acc']);
		//	$this->mail->addBCC('bcc@example.com');

		$this->mail->WordWrap = 50;                                 // Set word wrap to 50 characters
		//	$this->mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
		//	$this->mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
		$this->mail->isHTML(true);                                  // Set email format to HTML

		$this->mail->Subject = $data["subject"];
		$this->mail->Body    = $data["message"];
		$this->mail->CharSet ="UTF-8";

		$result = array("status"=>TRUE,"message"=>'');

		if (!$this->mail->send())
		{
			//$this->smarty->assign('error',$this->mail->ErrorInfo);
			//$this->smarty->display('error.tpl');
			$result['message'] = $this->mail->ErrorInfo;
			$result['status'] = FALSE;
		}

		return $result;
	}



	function sendMail2($data)
	{
	    if (is_array($data["email"])){
	        $to = join(",", $data["email"]);
	    }else{

	        $to = $data["email"];
	    }
	    //$to .=",niekto druhy";
	    $subject = $data["subject"];

	    // To send HTML mail, the Content-type header must be set
	    $headers  = 'MIME-Version: 1.0' . "\r\n";
	    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

	    // Additional headers
	    $headers .= 'To: '.$data["email"] . "\r\n";
	    $headers .= 'From: EspesWeb <espesweb@1and1.es>' . "\r\n";
	    if (isset($data["email_cc"])){
	        $headers .= 'Cc: '.$data["email_cc"] . "\r\n";
	    }
	    if (isset($data["email_bcc"])){
	        $headers .= 'Bcc: '.$data["email_bcc"] . "\r\n";
	    }

	    $res = mail($to,$subject,$data["message"],$headers);

	    return $res;
	}

	function createMessage($text,$type)
	{
	   $result = "";
       switch ($type){
           case "success":
               $result = sprintf("<div class='success box'>%s</div>",$text);
               break;
           case "error":
               $result = sprintf("<div class='error box'>%s</div>",$text);
               break;
           default:
               $result = sprintf("<div class='box'>%s</div>",$text);
               break;
       }

	   return $result;
	}

	function download($fileName)
	{
	    //ob_start();
	    header("Content-Description: File Transfer");
		header("Content-Type: application/vnd.ms-excel; charset=UTF-8");
		$tmpFl = basename($fileName);
		header("Content-Disposition: attachment; filename={$tmpFl}");
		//ob_clean();
		flush();
		readfile($fileName);
	}
}

?>