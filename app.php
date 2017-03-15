<?php

header("Access-Control-Allow-Origin: *");
session_start();
DEFINE("APP_DIR",__DIR__.DIRECTORY_SEPARATOR);

// try {
    $settings = yaml_parse_file(APP_DIR."/settings/main.yaml");
// }catch (Exception $e)
// {
//     $settings = parse_ini_file("APP_DIR./settings/main.ini");
// }
DEFINE("SQL_DB", $settings["storage_url"]);
DEFINE("O_URL",$settings["o_url"]); //Main DICOM/ORTHANC Server
// DEFINE("O_C_URL",$settings["client_server"]); //Client DICOM/ORTHANC
DEFINE("WEB_URL",$settings["web_url"]);
DEFINE("ROUTER",$settings["o_router"]);
DEFINE("INCLUDE_DIR",__DIR__.DIRECTORY_SEPARATOR."include".DIRECTORY_SEPARATOR);
DEFINE("IM_DIR",$settings["imagemagick_dir"]);
DEFINE("PUBLIC_DIR",__DIR__.DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR);
DEFINE("SALT",$settings["salt"]);

DEFINE("MAIL_SERV",$settings["mail_server"]);
DEFINE("MAIL_ACC",$settings["mail_acc"]);
DEFINE("MAIL_PSS",$settings["mail_pss"]);
DEFINE("MAIL_SMTP",$settings["mail_smtp"]);
DEFINE("MAIL_PORT",$settings["mail_smtp_out"]);
DEFINE("SEND_MAIL",intval($settings["send_mail"]));


//require_once INCLUDE_DIR.'orthanc.class.php';
require_once INCLUDE_DIR.'log.class.php';
require_once APP_DIR.'../smarty/Smarty.class.php';
require_once INCLUDE_DIR."commJs.class.php";
require_once INCLUDE_DIR."db.class.php";
require_once INCLUDE_DIR.'main.class.php';
//require_once APP_DIR."phpmailer/class.phpmailer.php";
// require_once INCLUDE_DIR.'orthanc.class.php';

?>