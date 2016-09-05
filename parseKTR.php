<?php
//$xml = simplexml_load_file('pentaho.ktr');

class parseKTR
{
    private $xml,$edge,$node;

    function  __construct($directory)
    {
        $this->xml = new SimpleXMLElement($directory,null,true);
    }

    function getEdge()
    {
        $xmlElement = $this->xml;
        $i = 1;
        foreach($xmlElement->order->hop as $hop):
            //versi cytoscape js
           // $edges[] = array("data"=>array('id'=>$i,'source'=>(string)$hop->from,'target'=>(string)$hop->to));

           //versi vis js
            $edges[] = array('id'=>$i,'from'=>(string)$hop->from,'to'=>(string)$hop->to,'enabled'=>(string)$hop->enabled,(string)'evaluation'=>$hop->evaluation);
            $i++;
        endforeach;
        return $edges;//json_encode($target);
    }

   function getNode()
    {
        $xmlElement = $this->xml;
        $i = 1;
        foreach($xmlElement->step as $step):
            // versi cytoscape js 
           // $nodes[] = array("data"=>array('id'=>(string)$step->name,'name'=>(string)$step->name,'sql'=>(string)$step->sql,'connection'=>(string)$step->connection));
           //versi vis js
            $nodes[] = array('id'=>(string)$step->name,
                                    'name'=>(string)$step->name,
                                    'sql'=>(string)$step->sql,
                                    'connection'=>(string)$step->connection,
                                    'label'=>(string)$step->name,
                                    'x'=>(int)$step->GUI->xloc,
                                    'y'=>(int)$step->GUI->yloc
                            );
            $i++;
        endforeach;
        return $nodes;//json_encode($nodes);
    }

    function getInfo()
    {
        $xmlElement = $this->xml;
        foreach($xmlElement->info as $info):
            $xmlInfo = array('name'=>(string)$info->name,
                                'description'=>(string)$info->description,
                                'directory'=>(string)$info->directory
                            );
        endforeach;
        return $xmlInfo;
    }
}


//print_r($xml);
?>