
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
       <!-- <div class="space-pad" id="dvKTRsql">
            <label>SQL</label>
            <div id="KTRsql" class="box-gray"></div>
        </div>
        <div class="space-pad" id="dvKTRConnection">
            <label>Connection</label>
            <div id="KTRconnection" class="box-gray"></div>
        </div> -->
        <!--<div class="input-group space-pad" id="dvKJBType">
            <span class="input-group-addon" id="basic-addon1">Type</span>
            <input type="text" class="form-control" placeholder="Type" aria-describedby="basic-addon1" id="KJBtype">
        </div>
        <div class="input-group space-pad" id="dvKJBFileName">
            <span class="input-group-addon" id="basic-addon1">File Name</span>
            <input type="text" class="form-control" placeholder="File Name" aria-describedby="basic-addon1" id="KJBFileName">
        </div>
        <div class="input-group space-pad" id="dvKJBJobName">
            <span class="input-group-addon" id="basic-addon1">Job Name</span>
            <input type="text" class="form-control" placeholder="Job Name" aria-describedby="basic-addon1" id="KJBJobName">
        </div>
        <div class="input-group space-pad" id="dvKJBDirectory">
            <span class="input-group-addon" id="basic-addon1">Directory</span>
            <input type="text" class="form-control" placeholder="Directory" aria-describedby="basic-addon1" id="KJBDirectory">
        </div>
        -->
        <div id="detail">
        
        <div class="modal fade" id="myModal2">
            <div class="modal-dialog" style="width:70%;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="false">×</button>
                            <h4 class="modal-title"></h4>
                    </div>
                    <div class="container"></div>
                    <div class="modal-body">
                        <div id="dataInfo1"></div>
                        <div id="mynetwork1" style="height:500px;width:100%"></div>
                        <div class="space-pad">
                        <a href="#" class="btn btn-primary" id="fit-graph2">Fit graph</a>
                        </div>
                        <div id="dataDetail2"></div>
                    </div>
                    <div class="modal-footer">	
                        <a href="#" data-dismiss="modal" class="btn">Close</a>
                    </div>
                </div>
            </div>
        </div>
<!-- end modal -->
   </div>
</body>
</html>