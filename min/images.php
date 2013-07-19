<?php
	/*
	//////////////////////////
	// Currently not in use //
	//////////////////////////

	function gloBify($string){
		$new = "";

		$end = count($string);
		for ($i=0; $i < $end; $i++) { 
			$l = strtolower($string[$i]);
			$u = strtoupper($string[$i]);

			if($l != $u) $new .= "[".$l.$u."]";
			else $new .= $string[$i];
		}

		return $new;
	}
	*/

	error_reporting(0);
	
	$ALL = "*.{[jJ][pP][gG],[pP][nN][gG],[gG][iI][fF]}";

	function getFiles($inc, $d){	// must be called only after working directory reset.
		global $ALL;

		if(is_string($inc)){
			$in = glob($inc)
		}else if(is_array($inc)){
			$in = array();
			foreach ($inc as $v) {
				$glock = glob($v);
				$in = array_merge($in, $glock);
			}
		}else{
			if($d) $in = glob($ALL);
			else $in = array();
		}

		return array_unique($in);
	}

	$json = json_decode(file_get_contents("galleries.json"));
	$node = $galleries["galleries"][$_GET['gallery']];
	$gallery = $json->galleries[$_GET['gallery']];

	if(gettype($gallery) == "string"){
		$folder = ($gallery[count($gallery) - 1] == "/") ? $gallery : $gallery."/";
		chdir($folder);

		$files = glob($ALL);
	}else{
		$folder = $gallery->folder;
		$folder = ($folder[strlen($folder) - 1] == "/") ? $folder : $folder."/";
		chdir($folder);

		$ya = getFiles($gallery->include, true);
		$na = getFiles($gallery->exclude, false);

		$files = array_diff($ya, $na);
	}

	header("content-type","application/json");

	echo json_encode([
		'status' => boolean count($files),
		'name'	 => string $_GET['gallery'],
		'folder' => string $folder,
		'files' => array $files
	]);