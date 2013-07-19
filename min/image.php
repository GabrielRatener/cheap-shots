<?php
	error_reporting(0);

	$gallery = $_GET['gallery'];
	$width = $_GET['width'];
	$height = $_GET['height'];
	$image = $_GET['image'];

	$json = json_decode(file_get_contents("galleries.json"));

	// gets complete image URI as $path variable
	$folder = $json->galleries[$gallery];
	if (is_object($folder)) $folder = $folder->folder; 
	if ($folder[count($folder) - 1] != "/") $folder .= "/";
	$path = $folder.$image;

	list($w, $h, $type) = getimagesize($path);
	if(!$width && !$height){
		header("content-type: ".image_type_to_mime_type($type));
		echo file_get_contents($path);
	}else{
		$cw = $w;
		$ch = $h;
		$sw = $sh = 0;

		$ratio = 1.0 * $w / $h;
		
		if($type == 1) $in = imagecreatefromgif($path);
		if($type == 2) $in = imagecreatefromjpeg($path);
		if($type == 3) $in = imagecreatefrompng($path);
		$out = imagecreatetruecolor($width, $height);

		if(!$width) $width = $height * $ratio;
		else if(!$height) $height = $width / $ratio;
		else{
			$outratio = 1.0 * $width / $height;

			if($ratio < $outratio){

				$cw = $w;
				$ch = min($h, round($w / $outratio));
				$sw = 0;
				$sh = floor(($h - $ch) / 2);
			}else if($outratio < $ratio){

				$cw = min($w, round($h * $outratio));
				$ch = $h;
				$sw = floor(($w - $cw) / 2);
				$sh = 0;
			}
		}

		imagecopyresampled($out, $in, 0, 0, $sw, $sh, $width, $height, $cw, $ch);
		header("content-type: ".image_type_to_mime_type($type));

		if($type == 1) imagegif($out);
		else if($type == 2) imagejpeg($out);
		else if($type == 3) imagepng($out);
		else imagejpeg($out);
	}

?>