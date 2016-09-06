$(function () {
	var network = null;
	var idElement = 1; // id untuk setiap attribute ID agar unik
	//hideForm();
	var stack = new Array();

	function getDataGraph(formData,container,flag) {
		$.ajax({
			processData: false,
			contentType: false,
			type: 'post',
			url: 'http://localhost/graph-etl/handleRequest.php',
			data: formData,
			success: function (datas, status) {
				scrollToDownBottomOfPage();
				//console.log(datas);
				var data = JSON.parse(datas);
				console.log(data);
				//console.log(data.edge);
				console.log(data.node);
				for (var key in data.node) {
					if (!data.node.hasOwnProperty(key)) continue;
					data.node[key]['label'] = data.node[key]['name'];
					data.node[key]['id'] = data.node[key]['name'];
					if (data.ekstension.localeCompare("kjb") == 0) {
						if (data.node[key].hasOwnProperty('filename')) {
							var fileName = data.node[key]['filename'].split("/");
							data.node[key]['filename_'] = fileName[1];
						}
						data.node[key]['x'] = data.node[key].xloc;
						data.node[key]['y'] = data.node[key].yloc;
					} else {
						data.node[key]['x'] = data.node[key]['GUI'].xloc;
						data.node[key]['y'] = data.node[key]['GUI'].yloc;
					}
				}
				var ekstensionKTR = false;//default
				var info;
				if (data.ekstension.localeCompare("ktr") == 0) {
					ekstensionKTR = true;
					//showForm(ekstensionKTR);
				} else {
					ekstensionKTR = false;
					//showForm(ekstensionKTR);
				}
				getXMlInfo(data.info, idElement);
				var dataGraph = drawGraph(data, container);
				network.on("selectNode", function (params) {
					var ids = params.nodes;
					var clickedNodes = dataGraph.nodes.get(ids);

					var status = checkGraphIsExist(clickedNodes[0].filename)
					$('#fileName'+idElement).text(clickedNodes[0].filename_);
					showFormDetailGraph(status,idElement, clickedNodes[0], function () {
						//scrollToDownBottomOfPage();
					});

					/*$('#KJBtype').val(clickedNodes[0].type);
					$('#KJBFileName').val(clickedNodes[0].filename_);
					$('#KJBDirectory').val(clickedNodes[0].directory);
					$('#KJBJobName').val(clickedNodes[0].jobname);
					$('#fileName').text(clickedNodes[0].filename_); */
					/*if (status)
						scrollToDown("dvKJBDirectory");
					else
						scrollToDown("mynetwork"); */
				
					})
		network.on("deselectNode", function (params) {
			removeDetail(stack);
		})
	}, // end success
	error: function () {
		alert("gagal");
	}
		});
	}

	function getDetailGraph(fileName, container, flag) {

		$('.modal-title').text(fileName);
		$.ajax({
			// processData: false,
			// contentType: json,
			dataType: 'json',
			type: 'post',
			url: 'http://localhost/graph-etl/handleRequest.php',
			data: {
				'fileName': fileName
			},
			success: function (data, status) {
				idElement+=1; // increment for different uniqued identity for every ID attribute
				showModal(idElement);
				//var data = JSON.parse(datas);
				for (var key in data.node) {
					if (!data.node.hasOwnProperty(key)) continue;
					data.node[key]['label'] = data.node[key]['name'];
					data.node[key]['id'] = data.node[key]['name'];
					if (data.ekstension.localeCompare("kjb") == 0) {
						if (data.node[key].hasOwnProperty('filename')) {
							var fileName = data.node[key]['filename'].split("/");
							data.node[key]['filename_'] = fileName[1];
						}
						console.log("masuk kjb");
						data.node[key]['x'] = data.node[key].xloc;
						data.node[key]['y'] = data.node[key].yloc;
					} else {
						console.log("masuk else");
						data.node[key]['x'] = data.node[key]['GUI'].xloc;
						data.node[key]['y'] = data.node[key]['GUI'].yloc;
					}
				}
				var ekstensionKTR = false;//default
				var info;
				if (data.ekstension.localeCompare("ktr") == 0) {
					ekstensionKTR = true;
					//showForm(ekstensionKTR);
				} else {
					ekstensionKTR = false;
					//showForm(ekstensionKTR);
				}
				var count = 0; // initial count for fit graph;
				console.log(data);
				getXMlInfo(data.info, idElement);
				var dataGraph = drawGraph(data, container);
				network.on("selectNode", function (params) {
					var ids = params.nodes;
					var clickedNodes = dataGraph.nodes.get(ids);

					var status = checkGraphIsExist(clickedNodes[0].filename)
					$('#fileName'+idElement).text(clickedNodes[0].filename_)
					console.log($('#fileName').text());
					showFormDetailGraph(status, clickedNodes[0], function () {
						//scrollToDownBottomOfPage();
					});
				})
				network.on("deselectNode", function (params) {
					removeDetail(stack);
				})
				//this function be used for make detail graph fit to canvas,because at initialize detail graph ,this graph has zoomed
				network.on("afterDrawing", function (ex) {
					if (count == 0)
						fitGraph();

					count = 1;
				})
			}, // end success
			error: function () {
				alert("File " + fileName + " tidak ada");
				network = new vis.Network(container);
				network.destroy();
			}
		});

	}

$('#upload').submit(function (e) {
	/*this function be used for prevent any distraction from another function
	* like function called another php file.
	*/
	e.preventDefault();
	var formData = new FormData(this);
	var container = document.getElementById('mynetwork');
	var flag=false;
	$('[id^=dataDetail]').remove();
	getDataGraph(formData,container,flag);

});

$("#myModal"+idElement).on("hidden.bs.modal", function () {
  console.log("close modal");
  decrementIdElement(idElement);
  console.log(idElement);
});

$('#detailGraph'+idElement).click(function (e) {
	e.preventDefault();
	var container = document.getElementById('mynetwork'+idElement);
	var flag=true;
	console.log(idElement);
	getDetailGraph($('#fileName'+idElement).text(),container,flag);
	
})

function decrementIdElement(id){
	id -= 1;
}

function validateEdge(edge) {
	var enabledColor = 'green';
	var disabledColor = 'gray';
	var disableEvaluation = 'red';
	for (var key in edge) {
		if (!edge.hasOwnProperty(key)) continue;
		var obj = edge[key];
		//obj['color'] = obj['enabled'].toUpperCase() == 'Y' ? enabledColor : disabledColor;
		if (obj['enabled'].toUpperCase() == 'Y') {
			obj['color'] = enabledColor;
			//console.log(obj['enabled']);
			//console.log(obj['evaluation']);
			if (obj.hasOwnProperty('evaluation')) {
				if (obj['evaluation'].toUpperCase() == 'N') {
					obj['color'] = disableEvaluation;
				}
			}
		} else {
			obj['color'] = disabledColor;
		}
	}

	return obj;
}

function drawGraph(data, container) {

	data.node = makeTitleNode(data.node);
	validateEdge(data.edge);
	var nodes = new vis.DataSet(data.node);
	var edges = new vis.DataSet(data.edge);

	// create a network


	// provide the data in the vis format
	var buildGraph = {
		nodes: nodes,
		edges: edges
	};

	// initialize your network!
	network = new vis.Network(container, buildGraph, getOption());

	return buildGraph
}

function getXMlInfo(data, count) {
	$('#xml_name' + count).val(data.name);
	$('#xml_desc' + count).val(data.description);
	$('#xml_dir' + count).val(data.directory);
}

function showForm(status) {
	$('#dvKTRsql').toggle(status); //form untuk info KTR,default
	$('#dvKTRConnection').toggle(status); //form untuk info KTR,default
}

function showModal(count) {
	$('#myModal' + count).modal({
		show: true
	});
}

function showFormDetailGraph(status,id, data, callback) {
	/*$('#dvKJBName').toggle(status) // form untuk KJB
	$('#dvKJBType').toggle(status); // form untuk KJB
	$('#dvKJBFileName').toggle(status); // form untuk KJB
	$('#dvKJBJobName').toggle(status); // form untuk KJB
	$('#dvKJBDirectory').toggle(status); // form untuk KJB */
	$('#dvDetailGraph'+id).toggle(status); // form untuk KJB 
	addDataDetail(data, id,"detail");
	callback();
}
/*
function hideForm() {
	$('#dvKTRsql').hide(); //form untuk info KTR,default
	$('#dvKTRConnection').hide(); //form untuk info KTR,default
	$('#dvKJBName').hide() // form untuk KJB
	$('#dvKJBType').hide(); // form untuk KJB
	$('#dvKJBFileName').hide(); // form untuk KJB
	$('#dvKJBJobName').hide(); // form untuk KJB
	$('#dvKJBDirectory').hide(); // form untuk KJB
	$('#dvDetailGraph').hide();
} */

//check data graph is exist or not in one node ,this function be called everytime u need to show detailGraph
function checkGraphIsExist(data) {
	if (data != null && data != "")
		return true;

	return false;
}

//make animate scroll to specific ID
function scrollToDownById(id) {
	$('html, body').animate({
		scrollTop: $("#" + id).offset().top
	}, 2000);
}

function scrollToDownBottomOfPage() {
	$('html, body').animate({
		scrollTop: $(document).height() - $(window).height()
	}, 1000);
}

$("#fit-graph").click(function (e) {
	fitGraph();
})

$("#fit-graph1").click(function (e) {
	fitGraph();
})

//set graph to fit with canvas
function fitGraph() {
	if (network != null)
		network.fit();
}

//make tooltip for node
function makeTitleNode(data) {
	for (var key in data) {
		data[key]['title'] = data[key]['name'];
	}

	return data;
}


//give optional configuration for instansiai vis network object
function getOption() {
	var options = {
		height: '100%',
		width: '100%',
		edges: {
			arrows: 'to',
			physics: false,
			smooth: {
				enabled: false,
			}

		},
		physics: {
			enabled: true,
			stabilization: {
				enabled: true,
			},
			repulsion: {
				nodeDistance: 400,
			}
		},
		nodes: {
			fixed: {
				x: false,
				y: false,
			},
			shape: 'box',
			font: {
				size: 10,

			}
		},
	};
	return options;
}

/*function addDataInfo(count) {
	if ($('#xml_name' + count).length == 0) {
		$('#dataInfo' + count).append(
			"<div class='input-group space-pad'>" +
			"<span class='input-group-addon' id='basic-addon1'>File Job Name</span>" +
			"<input type='text' class='form-control' placeholder='Job Name' aria-describedby='basic-addon1' id='xml_name" + count + "'>" +
			"</div>" +
			"<div class='input-group space-pad'>" +
			"<span class='input-group-addon' id='basic-addon1'>Job Directory</span>" +
			"<input type='text' class='form-control' placeholder='File Job Name' aria-describedby='basic-addon1' id='xml_dir" + count + "'>" +
			"</div>" +
			"<div class='input-group space-pad'>" +
			"<span class='input-group-addon' id='basic-addon1'>Job Description</span>" +
			"<input type='text' class='form-control' placeholder='File Job Name' aria-describedby='basic-addon1' id='xml_desc" + count + "'>" +
			"</div>"
		);
	}
} */

/*function addDataDetail(count) {
	if ($("#dvKJBType" + count).length == 0) {
		$('#dataDetail' + count).append(
			"<div class='input-group space-pad' id='dvKJBType" + count + "'>" +
			"<span class='input-group-addon' id='basic-addon1'>Type</span>" +
			"<input type='text' class='form-control' placeholder='Type' aria-describedby='basic-addon1' id='KJBtype" + count + "'>" +
			"</div>" +
			"<div class='input-group space-pad' id='dvKJBFileName" + count + "'>" +
			"<span class='input-group-addon' id='basic-addon1'>File Name</span>" +
			"<input type='text' class='form-control' placeholder='File Name' aria-describedby='basic-addon1' id='KJBFileName" + count + "'>" +
			"</div>" +
			"<div class='input-group space-pad' id='dvKJBJobName" + count + "'>" +
			"<span class='input-group-addon' id='basic-addon1'>Job Name</span>" +
			"<input type='text' class='form-control' placeholder='Job Name' aria-describedby='basic-addon1' id='KJBJobName" + count + "'>" +
			"</div>" +
			"<div class='input-group space-pad' id='dvKJBDirectory" + count + "'>" +
			"<span class='input-group-addon' id='basic-addon1'>Directory</span>" +
			"<input type='text' class='form-control' placeholder='Directory' aria-describedby='basic-addon1' id='KJBDirectory" + count + "'>" +
			"</div>"
		);
	}
} */

function addDataDetail(data, count,idName) {
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			if (key == "label") break;
			if (isObject(data[key])) {
				$("#"+idName).append("<div id='"+key+count+"' class='space-detail box-gray'></div>");
				if (key.length > 2)
					$("#"+key+count).append("<label>"+key+"</label>");
				addDataDetail(data[key], 1,key+count);
			} else {
				//var id = key + count;
				stack.push("dataDetail"+count);
				if ($("#dvName" + count).length == 0) {
					$('#'+idName).append(
						"<div id='dataDetail" + count + "'>" +
						"<div class='space-pad' id='" + key + count + "'>" +
						"<label>" + key + "</label>" +
						"<div id='" + key + count + "' class='box-gray'>" + data[key] + "</div>" +
						"</div></div>"
					);
				}
			}
		}//end if own property
	}//end foreach
}

function removeDetail(stacks) {
	for (var key in stacks) {
		console.log( stacks[key]);
		$("#" + stacks[key]).empty();
		$("#" + stacks[key]).remove();
		stacks[key] = null;
	}
}

function isObject(obj) {
  		return obj === Object(obj);
}



});