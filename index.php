
<?php require "parseXML.php";
    //  $xml = new parseXML();
    //  $node = $xml->getNode();
    //  $edge = $xml->getEdge();
?>
<!DOCTYPE html>
<html>
<head>
    <link href="css/vis.min.css" rel="stylesheet" />
    <link href="css/style.css" rel="stylesheet" />
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link href="fa/css/font-awesome.min.css" rel="stylesheet" />
    <meta charset=utf-8 />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
    <title>test</title>
    <script src="js/jquery-3.1.0.min.js"></script>
    <script src="js/jquery-tmpl.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <!--<script src="js/cytoscape.js"></script>
    <script src="js/code.js"></script> -->
    <script>
    document.write('<script src="js/vis.min.js?dev='+Math.floor(Math.random()* 100)+'"\><\/script>');
    </script>
    <script src="js/vis.code.js"></script>
     <style type="text/css">
        #mynetwork {
            height: 500px;
            border: 1px solid lightgray;
        }
    </style>

</head>
<body>
    <div class="container space-container">
        <div class="space-pad">
        <form action = "#" method = "POST" enctype = "multipart/form-data" id="upload">
            <label class="btn btn-default btn-file">
            <i class="fa fa-cloud"></i> Browse <input type="file" style="display: none;" name="xml" id="xmlfile">
            </label>
            <label class="btn btn-primary btn-file">
                <i class="fa fa-upload"></i> Upload <input type="submit" style="display: none;" name="submit">
            </label>
        </form>
        </div>
       
        <!-- edit tab -->
    <script id="tabTemp" type="text/x-jquery-tmpl"> 
        <div class='tab-pane' id='tab${index}'>
            <div class="input-group space-pad">
                <span class="input-group-addon" id="basic-addon1">File Job Name</span>
                <input type="text" class="form-control" placeholder="Job Name" aria-describedby="basic-addon1" id="xml_name${index}">
            </div>
            <div class="input-group space-pad">
                <span class="input-group-addon" id="basic-addon1">Job Directory</span>
                <input type="text" class="form-control" placeholder="File Job Name" aria-describedby="basic-addon1" id="xml_dir${index}">
            </div>
            <div class="input-group space-pad">
                <span class="input-group-addon" id="basic-addon1">Job Description</span>
                <input type="text" class="form-control" placeholder="File Job Name" aria-describedby="basic-addon1" id="xml_desc${index}">
            </div>
            <div class="space-pad graph">
                <label class col="">Graph</label>
                <a href="#" class="btn btn-primary fit-graph" style="float:right">Fit graph</a>
            </div>
            <div id="mynetwork${index}" style="clear:both;margin-top:20px;" class="network"></div>
            <div class="space-pad dvDetailGraph">
                <button class="btn-default btn-primary btn detailGraph" style="text-align:right">Detail Graph</button> &nbsp;
                <label class="fileName"></label>
            </div>
            <div id="detail${index}"></div>
        </div>
    </script>
    <script id="navTemp" type="text/x-jquery-tmpl"> 
        <li class="li-tab-toggle">
            <a href="#tab${index}" class="tab-toggle" data-toggle="tab">
                ${fileName}
                <span class="close" type="button" title="Remove this page" style="margin-left:7px">×</span>
            </a>
        </li>
    </script>
    <ul class="nav nav-tabs" id="tabs">
        <li class="li-tab-toggle active">
            <a class="tab-toggle " href="#tab1" id="toggle1" data-toggle="tab" alt="name file"></a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="tab1">
            <div class="input-group space-pad">
                <span class="input-group-addon" id="basic-addon1">File Job Name</span>
                <input type="text" class="form-control" placeholder="Job Name" aria-describedby="basic-addon1" id="xml_name1">
            </div>
            <div class="input-group space-pad">
                <span class="input-group-addon" id="basic-addon1">Job Directory</span>
                <input type="text" class="form-control" placeholder="File Job Name" aria-describedby="basic-addon1" id="xml_dir1">
            </div>
            <div class="input-group space-pad">
                <span class="input-group-addon" id="basic-addon1">Job Description</span>
                <input type="text" class="form-control" placeholder="File Job Name" aria-describedby="basic-addon1" id="xml_desc1">
            </div>
            <div class="space-pad">
                <label class col="">Graph</label>
                <a href="#" class="btn btn-primary" id="fit-graph1" style="float:right">Fit graph</a>
                <div id="mynetwork" style="clear:both;margin-top:20px;"></div>
            </div>
            <div class="space-pad" id="dvDetailGraph1">
                <button class="btn-default btn-primary btn" id="detailGraph1" style="text-align:right">Detail Graph</button> &nbsp;
                <label id="fileName1"></label>
            </div>
            <div id="detail"></div>
        </div>
    </div>
   </div>
</body>
</html>