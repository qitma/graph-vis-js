<?php
//$xml = simplexml_load_file('pentaho.ktr');

class parseKJB
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
        foreach($xmlElement->hops->hop as $hop):
            $edges[] = array('id'=>$i,'from'=>(string)$hop->from,'to'=>(string)$hop->to,'enabled'=>(string)$hop->enabled,'evaluation'=>(string)$hop->evaluation);
            $i++;
        endforeach;
        return $edges;
    }

    function getNode()
    {
        $xmlElement = $this->xml;
        $i = 1;
        foreach($xmlElement->entries->entry as $entry):
            $nodes[] = array('id'=>(string)$entry->name,
                                    'name'=>(string)$entry->name,
                                    'filename'=>(string)$this->getFileName($entry->filename),
                                    'directory'=>(string)$entry->directory,
                                    'jobname'=>(string)$entry->jobname,
                                    'type'=>(string)$entry->type,
                                    'label'=>(string)$entry->name,
                                    'x'=>(int)$entry->xloc,
                                    'y'=>(int)$entry->yloc
                            );
            $i++;
        endforeach;
        return $nodes;
    }

    function getInfo()
    {
        $xmlElement = $this->xml;
      /*  foreach($xmlElement->info as $info):
            $xmlInfo = array('name'=>(string)$info->name,
                                'description'=>(string)$info->description,
                                'directory'=>(string)$info->directory
                            );
        endforeach; */
        $xmlInfo = array ('name'=>(string)$xmlElement->name,
                            'description'=>(string)$xmlElement->description,
                            'job_version'=>(string)$xmlElement->job_version,
                            'job_status'=>(string)$xmlElement->job_status,
                            'directory'=>(string)$xmlElement->directory,
                            'created_user'=>(string)$xmlElement->created_user,
                            'created_date'=>(string)$xmlElement->crated_date
                        );

        return $xmlInfo;
    }

    private function getFileName($fileName)
	{
		$fn = explode("/",$fileName);
		return $fn[1];
	}

    private function trimName($label)
    {
        $trim = explode("_",$label);
        return $trim[0];
    }


}


//print_r($xml);
?>