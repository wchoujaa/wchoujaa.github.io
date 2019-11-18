var root = {
  id: 2403,
  name: "Philosophie"
};

var treeData = [{
  "name": "Top Level",
  "parent": "null",
  "children": [{
      "name": "Level 2: A",
      "parent": "Top Level",
      "children": [{
          "name": "Son of A",
          "parent": "Level 2: A"
        },
        {
          "name": "Daughter of A",
          "parent": "Level 2: A"
        }
      ]
    },
    {
      "name": "Level 2: B",
      "parent": "Top Level"
    }
  ]
}];


var d3root;

function d3Init() {

  // set the dimensions and margins of the graph
  var width = 460
  var height = 460
  var radius = width / 2 // radius of the dendrogram

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

  // read json data

    // Create the cluster layout:
    var cluster = d3.cluster()
      .size([360, radius - 60]); // 360 means whole circle. radius - 60 means 60 px of margin around dendrogram

    // Give the data to this cluster layout:
    var root = d3.hierarchy(treeData);
    cluster(root);

    // Features of the links between nodes:
    var linksGenerator = d3.linkRadial()
      .angle(function (d) {
        return d.x / 180 * Math.PI;
      })
      .radius(function (d) {
        return d.y;
      });

    // Add the links between nodes:
    svg.selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr("d", linksGenerator)
      .style("fill", 'none')
      .attr("stroke", '#ccc')


    // Add a circle for each node.
    svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
      })
      .append("circle")
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .attr("stroke", "black")
      .style("stroke-width", 2)

  
  return d3root;
}