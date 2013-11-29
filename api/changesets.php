<?php
/**
 * @file
 * Helper file that communicates with the changesets endpoint.
 *
 * I couldn't figure out how to communicate with the API directly via Angular,
 * so Angular will send a request to this file instead.
 *
 * TODO: This should be removed once Angular is able to communicate with the API
 * directly.
 */

// Require the settings file.
require 'settings.php';

// Configure cURL for the communication.
$ch = curl_init("https://$account_domain.beanstalkapp.com/api/changesets.json?per_page=30");
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
curl_setopt($ch, CURLOPT_USERPWD, $username . ':' . $password);

// Execute cURL and print the result directly.
curl_exec($ch);
?>
