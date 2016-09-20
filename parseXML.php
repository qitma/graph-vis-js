<?php
//$xml = simplexml_load_file('pentaho.ktr');

class parseXML
{
    private $xml,$edge,$node,$dir;

    function  __construct($directory)
    {
        $this->xml = new SimpleXMLElement($directory,null,true);
        $this->ekstension = substr($directory,strrpos($directory,".")+1);
        //var_dump($this->dir);
    }

    function getEkstension()
    {
        return $this->ekstension;
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
        if(strcmp(strtoupper($this->ekstension),"KTR")==0){
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
        $parent = (strcmp(strtoupper($this->ekstension),"KJB")==0) ? "entries/entry" : "step";
        $arr = array();

        $xmlParent = $xmlElement->xpath($parent);
        foreach($xmlParent as $node)
        {
            $arr[] = $this->xml2array($node);
        }
        
        $connection = $this->getConnection($arr);

        for($i = 0;$i<sizeof($arr);$i++)
        {
            //if(strcmp(strtoupper($arr[$i]['type']),"SQL")==0)
            if($arr[$i]['connection']!= null && $arr[$i]['connection']!='')
            {
                $arr[$i]['connection'] = $this->getDetailConnection($arr[$i]['connection'],$connection);
            }
        }
        return $arr;
    }

    function getEdge()
    {
        $xmlElement = $this->xml;
        $parent = (strcmp(strtoupper($this->ekstension),"KJB")==0) ? "hops/hop" : "order/hop";
        $arr = array();

        $xmlParent = $xmlElement->xpath($parent);
        foreach($xmlParent as $node)
        {
            $arr[] = $this->xml2array($node);
        }

        //print_r($arr);
        return $arr;
    }

    function getSlaveServer()
    {
        $xmlElement = $this->xml;
        $arr = array();
        foreach($xmlElement->slaveservers->slaveserver as $slave)
        {
            $arr[] = $this->xml2array($slave);
        }

        return $arr;

    }

    private function getFileName($fileName)
	{
		$fn = explode("/",$fileName);
		return $fn[1];
	}

    

    function getConnection($node)
    {
        $xmlElement = $this->xml;
        $connectionUsed = $this->getConnectionNameUsed($node);
        $arr = array();
        $i = 0;
        foreach($xmlElement->connection as $connection)
        {
            if(in_array($connection->name,$connectionUsed))
            {
                $arr[$i] = $this->xml2array($connection);
                $arr[$i]['password'] = "**********";
                $i++;
            }
        }
		

        return $arr;
    }

    private function getDetailConnection($connectionName,$listOfConnection)
    {
        foreach($listOfConnection as $conn)
        {
            if(strcmp(strtoupper($conn['name']),strtoupper($connectionName))==0)
                return $conn;
        }
    }

    private function getConnectionNameUsed($node)
    {
        $arr = array();
        foreach($node as $data)
        {
            //if(strcmp(strtoupper($data['type']),"SQL")==0)
            if($data['connection']!=null && $data['connection']!="")
            {
                $arr[] = $data['connection'];
            }
        }
        return $arr;
    }
}


//print_r($xml);
?>