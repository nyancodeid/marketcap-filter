<?php
// Website url to open
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$url = "http://strymex.com/coins?symbols=[]";

// If there is something, read and return
$buffer = file_get_contents($url);
// $buffer = preg_replace("/<script(.*?)>(.*?)<\/script>/m", "", $buffer); 
// $buffer = preg_replace("/<img[^>]+\>/i", "", $buffer); 
// $buffer = preg_replace("/<meta[^>]+\>/i", "", $buffer); 
// $buffer = preg_replace("/<a[^>]+\>/i", "", $buffer); 
// $buffer = preg_replace("/<link[^>]+\>/i", "", $buffer); 
// $buffer = trim(preg_replace('/\s+/', ' ', $buffer));
// $buffer = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $buffer); 
// $buffer = preg_replace('/<head\b[^>]*>(.*?)<\/head>/is', "", $buffer); 

print_r($buffer);


?>