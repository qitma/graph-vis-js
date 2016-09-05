<?php
//$xml = simplexml_load_file('pentaho.ktr');

class parseXML
{
    private $xml,$edge,$node,$dir;

    function  __construct($directory)
    {
        $this->xml = new SimpleXMLElement($directory,null,true);
        $this->dir = substr($directory,strrpos($directory,".")+1);
        //var_dump($this->dir);
    }

    /*function getEdge()
    {
        $xmlElement = $this->xml;
        $i = 1;
        foreach($xmlElement->order->hop as $hop):
            //versi cytoscape js
           // $edges[] = array("data"=>array('id'=>$i,'source'=>(string)$hop->from,'target'=>(string)$hop->to));

           //versi vis js
            $edges[] = array('id'=>$i,'from'=>(string)$hop->from,'to'=>(string)$hop->to,'enabled'=>(string)$hop->enabled);
            $i++;
        endforeach;
        return $edges;//json_encode($target);
    } */

    /*function getNode()
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
                                    'label'=>(string)$step->name
                            );
            $i++;
        endforeach;
        return $nodes;//json_encode($nodes);
    } */

    function getInfo()
    {
        if(strcmp(strtoupper($this->dir),"KTR")==0){
             $xmlElement = $this->xml->info;
        }else
             $xmlElement = $this->xml;
        $xmlInfo = array('name'=>(string)$xmlElement->name,
                         'description'=>(string)$xmlElement->description,
                         'directory'=>(string)$xmlElement->directory
                        );
        return $xmlInfo;
    }

    private function xml2array ( $xmlObject, $out = array () )
    {
        foreach ( (array) $xmlObject as $index => $node )
            if($node!= null && (string)$node!="")
                $out[$index] = ( is_object ( $node ) ) ? $this->xml2array ( $node ) : $node;

        return $out;
    }

    function getNode()
    {
        $xmlElement = $this->xml;
        $parent = (strcmp(strtoupper($this->dir),"KJB")==0) ? "entries/entry" : "step";
        $arr = array();

        $xmlParent = $xmlElement->xpath($parent);
        foreach($xmlParent as $node)
        {
            $arr[] = $this->xml2array($node);
        }

        //print_r($arr);
        return $arr;
    }

    function getEdge()
    {
        $xmlElement = $this->xml;
        $parent = (strcmp(strtoupper($this->dir),"KJB")==0) ? "hops/hop" : "order/hop";
        $arr = array();

        $xmlParent = $xmlElement->xpath($parent);
        foreach($xmlParent as $node)
        {
            $arr[] = $this->xml2array($node);
        }

        //print_r($arr);
        return $arr;
    }

     private function getFileName($fileName)
	{
		$fn = explode("/",$fileName);
		return $fn[1];
	}
}


//print_r($xml);
?>