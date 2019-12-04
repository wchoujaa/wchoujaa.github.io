var labelType, useGradients, nativeTextSupport, animate, rgraphic;

(function () {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport &&
            (typeof document.createElement('canvas').getContext('2d').fillText == 'function');

    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();
var root = {
    id: 2403,
    name: "Philosophie"
};

var link;
var node;
var color;
var simulation;
var width = screen.width;
var height = screen.height;
var g;

var root = {
    'en': {
        id: 13692155,
        name: "Philosophy"
    },
    'de': {
        id: 490244,
        name: "Philosophie"
    },
    'fr': {
        id: 2403,
        name: "Philosophie"
    },
    'ja': {
        id: 110,
        name: "&#21746;&#23398;"
    },
    'it': {
        id: 1876512,
        name: "Filosofia"
    },
    'es': {
        id: 689592,
        name: "Filosof&iacute;a"
    },
    'ru': {
        id: 904,
        name: "&#1060;&#1080;&#1083;&#1086;&#1089;&#1086;&#1092;&#1080;&#1103;"
    }
}

function init() {

    var svg = d3.select("svg");
    width = +svg.attr("width");
    height = +svg.attr("height");

    color = d3.scaleOrdinal(d3.schemeCategory10);

    var graph = { "nodes": [], "links": [] };

    graph.nodes.push(root["en"]);

    simulation = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(graph.links).distance(200))
        .force("center", d3.forceCenter(width / 2, height / 2))

        .alphaTarget(1)
        .on("tick", ticked);

    g = svg.append("g").call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
    node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));

    restart(graph);
    return graph;
}


function restart(graph) {
    var nodes = graph.nodes;
    var links = graph.links;
    // Apply the general update pattern to the nodes.
    node = node.data(nodes, function (d) { return d.id; });
    node.exit().remove();
    node = node.enter().append("circle").attr('id', function (d) { return 'name' + d.id; }).attr("fill", function (d) { return color(d.id); }).attr("r", 8).merge(node);

    // Apply the general update pattern to the links.
    link = link.data(links, function (d) { return d.source + "-" + d.target; });
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}


function dragstarted() {
    d3.select(this).raise();
    g.attr("cursor", "grabbing");
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended() {
    g.attr("cursor", "grab");
}

function zoomed() {
    g.attr("transform", d3.event.transform);
}



function ticked() {
    node.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })

    link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
}
