$(function () {
	var network = null;
	var idElement = 1; // id untuk setiap attribute ID agar unikS
	var maxTabs = 4, index = 1;
	var state = true;
	hideForm();
	var stack = new Array();
	var stackF = new Array();

	if($('#toggle1').text()=="")
		$('#toggle1').text("Nama File");
	
	/* $('.nav-tabs a').on('show.bs.tab', function(){
        alert('The new tab is about to be shown.');
    });
   $('.nav-tabs a').on('shown.bs.tab', function(){
        alert('The new tab is now fully shown.');
    }); */

	function getDataGraph(formData, container, flag) {
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
				var idLocal = 1;
				//console.log(data);
				//console.log(data.edge);
				//console.log(data.node);
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
				getXMlInfo(data.info, idLocal);
				var dataGraph = drawGraph(data, container);
				network.on("selectNode", function (params) {
					var ids = params.nodes;
					var clickedNodes = dataGraph.nodes.get(ids);

					var status = checkGraphIsExist(clickedNodes[0].filename)
					$('#fileName1').text(clickedNodes[0].filename_);
					//stackF.push('fileName'+idLocal);
					console.log("id local : "+idLocal);
					console.log("ids node:"+ids);
					showFormDetailGraph(status, idLocal, clickedNodes[0], function () {
						//scrollToDownBottomOfPage();
					});

				})
				network.on("deselectNode", function (params) {
					removeDetail(stack);
					//emptyDetail(stackF);
					hideForm();
				})
			}, // end success
			error: function () {
				alert("gagal");
			}
		});
	}

	function getDetailGraph(fileName, container, flag,index) {

		$('.modal-title').text(fileName);
		$('#tab'+index).find('.dvDetailGraph').hide();
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
				//showModal(idElement);
				//var data = JSON.parse(datas);
				var uniqueID = fileName.split('.');
				var idLocal = index;
				for (var key in data.node) {
					if (!data.node.hasOwnProperty(key)) continue;
					data.node[key]['label'] = data.node[key]['name'];
					data.node[key]['id'] = data.node[key]['name'];
					if (data.ekstension.localeCompare("kjb") == 0) {
						if (data.node[key].hasOwnProperty('filename')) {
							var fileName1 = data.node[key]['filename'].split("/");
							data.node[key]['filename_'] = fileName1[1];
						}
						data.node[key]['x'] = data.node[key].xloc;
						data.node[key]['y'] = data.node[key].yloc;
					} else {
						//console.log("masuk else");
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
				getXMlInfoTabActive(data.info, uniqueID);
				var dataGraph = drawGraph(data, container);
				$('.li-tab-toggle:last a').tab('show'); // show last tab
				network.on("selectNode", function (params) {
					var ids = params.nodes;
					var clickedNodes = dataGraph.nodes.get(ids);
					var status = checkGraphIsExist(clickedNodes[0].filename);
					$('.tab-pane.active > .dvDetailGraph > .fileName').text(clickedNodes[0].filename_)
					showFormDetailGraphActiveTab(status, uniqueID[0],clickedNodes[0], function () {
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
				state = true;
			}, // end success
			error: function () {
				alert("File " + fileName + " tidak ada");
				network = new vis.Network(container);
				network.destroy();
				state = false;
				//$('#tabs li:last').remove(); // menghilangkan tab
				//$('#tab'+index).remove(); // menghilangkan content dari tab
				console.log('#tab'+idElement);
			}
		});

	}

	$('#upload').submit(function (e) {
		/*this function e.pereventDefault be used for prevent any distraction from another function
		* like function called another php file.
		*/
		e.preventDefault();
		var formData = new FormData(this);
		var container = document.getElementById('mynetwork');
		var flag = false;
		$('[id^=dataDetail]').remove();
		getDataGraph(formData, container, flag);

	});

	$("#myModal" + idElement).on("hidden.bs.modal", function () {
		console.log("close modal");
		decrementIdElement(idElement);
		console.log(idElement);
	});

	$('#detailGraph1').click(function (e) {
		e.preventDefault();
		//idElement += 1;
		var filename = $('#fileName1').text();
		var uniqID = filename.split('.');
		console.log(filename);
		addTab(uniqID[0],filename,getDetailGraph); // filename pada parameter pertama dijadikan unique ID untuk postfix
	})

	$(document).on('click',".tab-pane.active > .dvDetailGraph > .detailGraph", function(e) {
		e.preventDefault();
		console.log("wololo");
		//idElement += 1;
		var filename = $(this).siblings('.fileName').text();
		var uniqID = filename.split('.');
		console.log("filename : "+filename+" uniq : "+uniqID[0]);
		addTab(uniqID[0],filename,getDetailGraph); // filename pada parameter pertama dijadikan unique ID untuk postfix
	})

	$("#fit-graph").click(function (e) {
		fitGraph();
	})

	$("#fit-graph1").click(function (e) {
		fitGraph();
	})

	function decrementIdElement(id) {
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
		console.log("drawgraph"+idElement);
		console.log(container);
		return buildGraph
	}

	function getXMlInfo(data, count) {
		$('#toggle'+count).text(data.name);
		$('#xml_name' + count).val(data.name);
		$('#xml_desc' + count).val(data.description);
		$('#xml_dir' + count).val(data.directory);
	}

	function getXMlInfoTabActive(data, id) {
		$('#xml_name' + id).val(data.name);
		$('#xml_desc' + id).val(data.description);
		$('#xml_dir' + id).val(data.directory);
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

	function showFormDetailGraph(status, id, data, callback) {
		$('#dvDetailGraph1').toggle(status);
		var flag = 1; // flag input ID
		addDataDetail(data, id, "detail",flag);
		callback();
	}

	function showFormDetailGraphActiveTab(status, id, data, callback) {
		$('.tab-pane.active > .dvDetailGraph').toggle(status);
		console.log("status nya: "+status);
		console.log("id di show FormDetailGraphActiveTab:"+id);
		var flag = 1; //flag input class
		console.log("detail"+id);
		addDataDetail(data, id, "detail"+id,flag);
		callback();
	}
	
	function hideForm() {
		$('#dvDetailGraph1').hide();
	}

	function hideForm2(){
		$('.dvDetailGraph').hide();
	} 

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


	/* parameter : addDataDetail
	* data : object berisi data detail
	* count : postfix untuk unique ID untuk setiap element
	* idName : berupa ID (attribute html) yang ingin disisipkan element
	* flag : berupa tanda untuk menentukan selector berupa class atau ID 1 = ID ; 0 = class
	*/
	function addDataDetail(data, count, selector,flag) {
		console.log("selector :"+selector+" flag:"+flag);
		var newSelector;
		if(flag == 1)
			newSelector  = "#"+selector;
		else if(flag == 0)
			newSelector = selector;
		
		console.log("new selector : "+newSelector);
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				if (key == "label") break;
				stack.push(key + count);
				if (isObject(data[key])) {
					$(newSelector).append(
						"<div><div id='collapse-" + key + count + "'class='space-detail btn  btn-default' type='button'" +
						"data-toggle='collapse' data-target='#" + key + count + "'>" +
						"<span data-toggle='tooltip' title='klik for detail'>" +
						"<label>" + key + " &nbsp;</label>" +
						"<i class='fa fa-caret-right'></i>" +
						"</span></div></div>" +
						"<div id='" + key + count + "' class='box-gray collapse'></div>"
					);
					//	if (key.length > 2)
					//		$("#collapse"+key+count).append("<label>"+key+"</label>");
					addDataDetail(data[key], count, key + count,1); // flag 1 karena akan di append pada ID
				} else {
					//var id = key + count;
					if ($("#dvName" + count).length == 0) {
						console.log("masuk sini");
						$(newSelector).append(
							"<div class='space-pad' id='" + key + count + "'>" +
							"<label>" + key + "</label>" +
							"<div id='" + key + count + "' class='box-gray'>" + data[key] + "</div>" +
							"</div>"
						);
					}
				}
			}//end if own property
		}//end foreach
	}

	/* fungsi untuk meremove element yg bersi data */
	function removeDetail(stacks) {
		for (var key in stacks) {
			$("#" + stacks[key]).remove();
			$("#collapse-" + stacks[key]).remove();
			stacks[key] = null;
		}
	}

	function emptyDetail(stackFs)
	{
		for (var key in stackFs) {
			$("#" + stackFs[key]).empty();
			stackFs[key] = null;
		}
	}

	function isObject(obj) {
		return obj === Object(obj);
	}

/* start function for tab */
	function addTab(index,filename,callback) {
		var flag = true; // belum guna
		var filename2 = filename.split(".");
		//index++;
		var name = "tab" + index;
		if ($('#' + name).length == 0) {
			$.tmpl(navTemp, { "index": index, fileName: filename }).insertAfter('.li-tab-toggle:last');
			$.tmpl(tabTemp, { "index": index, fileName: filename2[0] }).appendTo('.tab-content');
			var container = document.getElementById('mynetwork'+index);
			updateTabs();
			callback(filename,container,flag,index);
		} else {
			console.log("gagal");
		}
	};

	$('#tabs').on('click', '.close', function () {
		var tabID = $(this).parents('a').attr('href');
		var tabs = $('.li-tab-toggle').length,
			nav = $('.li-tab-toggle.active');

		//nav.parent('#tabs').find('#drop li:first').insertBefore('#tabs .dropdown');

		var check = nav.children('a');
		$(this).parents('li').remove();
		$(tabID).remove();
		if (check.is('[href="' + tabID + '"]') == true) {
			$('#tabs a:first').tab('show');
			//alert("test sini");
			//$('a', nav.is('li:last') ? nav.prev() : nav.next()).tab('show');
		} else {
			$('a', nav).tab('show');
		}
		

		updateTabs();
	});

	$('#max-tabs').change(function () {
		maxTabs = parseInt($(this).val());
		setMaxTabs();
	});

	function checkId(stack) {
		for (var key in stack) {
			if (stack[key] == null)
				return false;
		}
		return true;
	}

	function setMaxTabs() {
		var idx = 0;
		$('#drop').contents().appendTo('#tabs');
		$('#tabs li.dropdown').remove();
		$('.li-tab-toggle').each(function () {
			idx++;
			if (idx > maxTabs) {
				$('#drop').length || $('#tabs').append($.tmpl(dropTemp)).find('#drop').append($(this).prev());
				//$(dropTemplate).appendTo('#tabs').find('#drop').append($(this).prev());
				$('#drop').append(this).parent().find('.badge').text(idx - maxTabs + 1);
			}
		});
		$('#drop li.active').length === 0 || $('#tabs li.dropdown').addClass('active');
	}

	function updateTabs() {
		for (var i = 0; i < $('.li-tab-toggle').length; i++) {
			$('.tab-toggle:eq(' + i + ') .dev-nr, .tab-pane:eq(' + i + ') .dev-nr').text(i + 1);
		}
		$('#tabs .badge').text($('#drop li').length);
	}


});