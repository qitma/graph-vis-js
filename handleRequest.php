<?php require "parseKTR.php";
      require "parseKJB.php";
      require "parseXML.php";
//echo $_POST['fileName'];
 if(isset($_POST['fileName']))
    {
        $file_name = $_POST['fileName'];
        $xml = new parseXML("file/".$file_name);
        $node = $xml->getNode();
        $edge = $xml->getEdge();
        $info = $xml->getInfo();
        $slaveServer = $xml->getSlaveServer();
        $connection = $xml->getConnection($node);

        echo json_encode(array('node'=>$node,
                                'edge'=>$edge,
                                'info'=>$info,
                                'ekstension'=>$xml->getEkstension(),
                                'connection'=>$connection,
                                'slaveServer'=>$slaveServer));
        //error_log("masuk sini cek");
    }
  elseif(isset($_FILES['xml'])){
      $errors= array();
      $file_name = $_FILES['xml']['name'];
      $file_size = $_FILES['xml']['size'];
      $file_tmp = $_FILES['xml']['tmp_name'];
      $file_type = $_FILES['xml']['type'];
      $file_ext=strtolower(end(explode('.',$_FILES['xml']['name'])));
      
      $expensions= array("ktr","xml","kjb");
      
      if(in_array($file_ext,$expensions)=== false){
         $errors[]="extension not allowed, please choose a KTR , KJB  file or XML.";
      }
      
      if($file_size > 2097152) {
         $errors[]='File size must be excately 2 MB';
      }
      
      if(empty($errors)==true) {
         move_uploaded_file($file_tmp,"file/".$file_name);
          $xml = new parseXML("file/".$file_name);
          $node = $xml->getNode();
          $edge = $xml->getEdge();
          $info = $xml->getInfo();
          $connection = $xml->getConnection($node);
          $slaveServer = $xml->getSlaveServer();

         echo json_encode(array('node'=>$node,
                                'edge'=>$edge,
                                'info'=>$info,
                                'ekstension'=>$file_ext,
                                'slaveServer'=>$slaveServer,
                                'connection'=>$connection));
      }else{
         print_r($errors);
      }

   }else{
       echo "mamam";
   }

  

?>