var root = {
  id: 2403,
  name: "Philosophie"
};

function d3Init() {
  console.log("ok");

  var clusterLayout = d3.cluster()
    .size([400, 200])

  var d3root = d3.hierarchy(root)

  clusterLayout(d3root)

  // Nodes
  d3.select('svg g.nodes')
    .selectAll('circle.node')
    .data(d3root.descendants())
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', function (d) {
      return d.x;
    })
    .attr('cy', function (d) {
      return d.y;
    })
    .attr('r', 4);

  // Links
  d3.select('svg g.links')
    .selectAll('line.link')
    .data(d3root.links())
    .enter()
    .append('line')
    .classed('link', true)
    .attr('x1', function (d) {
      return d.source.x;
    })
    .attr('y1', function (d) {
      return d.source.y;
    })
    .attr('x2', function (d) {
      return d.target.x;
    })
    .attr('y2', function (d) {
      return d.target.y;
    }).filter(function (d) {
      return d.number !== undefined;
    });

  d3.select('svg g.nodes')
    .selectAll('text.node')
    .data(d3root.descendants())
    .enter()
    .append('text')
    .attr('dx', function (d) {
      return d.x;
    })
    .attr('dy', function (d) {
      return d.y;
    })
    .text(function (d) {
      return d.children === undefined ? d.data.name : '';
    })

  return d3root;
}