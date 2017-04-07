{literal}


<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/jquery-ui.min.js" type="text/javascript"></script>


<script src="js/main.js" type="text/javascript"></script>
<!-- <script type="text/javascript" src="{$GLOBALS.APP_URL}/gdw/js/libs/jquery-1.10.2.min.js"></script> -->
<script type="text/javascript" src="gdw/js/groundwork.all.js"></script>
<!-- <script type="text/javascript" src="{$GLOBALS.APP_URL}/js/jquery-ui.js"></script> -->

<!-- <script type="text/javascript" src="{$GLOBALS.APP_URL}/js/myfnc.js"></script> -->
<script src="js/comm_class.js" type="text/javascript"></script>
<!-- <script src="js/pss.js" type="text/javascript"></script> -->
<script src="tinymce/tinymce.min.js" type="text/javascript"></script>
<!--  <script src="js/jquery.datetimepicker.full.js" type="text/javascript"></script>-->
<script src="js/flatr/flatpickr.js" type="text/javascript"></script>
<script src="js/flatr/plugins/confirmDate/confirmDate.js" type="text/javascript"></script>
<script src="js/contextm/jquery.ui.position.js" type="text/javascript"></script>
<script src="js/contextm/jquery.contextMenu.js" type="text/javascript"></script>

<script>
	tinymce.init({ 
					selector:'textarea',
					menubar:false,
					toolbar:'bold italic | align left align right align justify'
				});

	mainInit({
				class:{/literal}'{$className}' {literal}
		});
	

</script>



{/literal}