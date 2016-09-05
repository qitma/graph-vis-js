$(function(){ // on dom ready

function getRadianAngle(degreeValue) {
    return degreeValue * Math.PI / 180;
} 

function getDataGraph()
{
    $.ajax({
        type:'post',
        url:'http://localhost/test/handleRequest.php',
        success:function(data,status){
           //$('#ck').html(data);
            var datas = JSON.parse(data);
            var nodes1 = datas.node;
            var edges1 = datas.edge;
           // console.log(nodes1[0].data.id);
           // console.log(nodes1.data[0].id);
            //console.log(nodes1);
           // $('#ck').html(data);
            var cy = cytoscape({
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true,

            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'content': 'data(id)'
                })
                .selector('edge')
                .css({
                    'target-arrow-shape': 'triangle',
                    'width': 4,
                    'line-color': '#ddd',
                    'target-arrow-color': 'red',
                    'curve-style': 'bezier'
                })
                ,
            
            elements: {
                //nodes,edges
                nodes:nodes1,
                edges:edges1
               /* nodes: [
                    { data: { id: 'a', sql:'123' } },
                    { data: { id: 'b', sql:'456' } },
                    { data: { id: 'c', sql:'789' } },
                    { data: { id: 'd', sql:'323' } },
                    { data: { id: 'e', sql:'220' } }
                ], 
                
                edges: [
                    { data: { id: 'ae', weight: 1, source: 'a', target: 'e' } },
                    { data: { id: 'ab', weight: 3, source: 'a', target: 'b' } },
                    { data: { id: 'be', weight: 4, source: 'b', target: 'e' } },
                    { data: { id: 'bc', weight: 5, source: 'b', target: 'c' } },
                    { data: { id: 'ce', weight: 6, source: 'c', target: 'e' } },
                    { data: { id: 'cd', weight: 2, source: 'c', target: 'd' } },
                    { data: { id: 'de', weight: 7, source: 'd', target: 'e' } }
                ]*/ 
                },
            
           
            });
            var options =
            {
                name:'breadthfirst',
                directed: true,
                roots: "[id='"+ nodes1[0].data.id +"']",
                padding: 10,
                edgelength:100
            }
            cy.layout(options);

            cy.on('tap','node',function(evt){
                var node = evt.cyTarget;
                console.log(evt);
                console.log('tapped:'+ node.id() +" "+ node.data('sql'));
            })
        }
    })
}

getDataGraph();

  
//var bfs = cy.elements().bfs('#a', function(){}, true);


}); // on dom ready