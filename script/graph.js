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

var link;
var node;
var color;
var simulation;
var width = screen.width;
var height = screen.height;
var g;

var rootDictionary = {
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

var root;

function init() {

    var svg = d3.select("svg");
    width = +svg.attr("width");
    height = +svg.attr("height");

    color = d3.scaleOrdinal(d3.schemeCategory10);

    var graph = {
        "nodes": [],
        "links": []
    };

    root = rootDictionary["en"];

    graph.nodes.push(root);

    simulation = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().distance(75).strength(0.08))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alphaTarget(1)
        .on("tick", ticked);

    g = svg.append("g").call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    link = g.append("g").attr("stroke", "#000").attr("class", "links").attr("stroke-width", 1.5).selectAll(".link");
    node = g.append("g").attr("stroke", "#fff").attr("class", "nodes").attr("stroke-width", 1.5).selectAll(".node");

    svg.call(d3.zoom()
        .extent([
            [0, 0],
            [width, height]
        ])
        .scaleExtent([0.1, 8])
        .on("zoom", zoomed));

    restart(graph);
    //test();
    return graph;
}


var padding = 12;
var borderRadius = 6;
var strokeWidth = 4;
var strokeColor = "rgba(0, 0, 0, 0.82)"

function restart(graph) {

    node = node.data(graph.nodes, function (d) {
        return d.id;
    });

    node.exit().each(function () {
        d3.select(this).remove();
    });

    var nodeEnter = node.enter().append("g").attr("class", "nodes").attr("id", (d) =>
        "name" + d.id
    );

    nodeEnter
        .on('mouseover', mouseOverHandler)
        .on('mouseout', mouseOutHandler)
        .on("click", clicked)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    nodeEnter.append("text")
        .text(function (d) {
            return d.name;
        }).each(function (d) {
            d["bbox"] = this.getBBox()
            d3.select(this).attr("transform", "translate(" + -d["bbox"].width / 2 + "," + 0 + ")")
        });

    nodeEnter.insert("rect", ":first-child")
        .attr("class", "rect")
        .attr("width", function (d) {
            return d.bbox.width + padding;
        })
        .attr("height", function (d) {
            return d.bbox.height + padding;
        })
        .attr("x", function (d) {
            return d.bbox.x - (d.bbox.width + padding) / 2;
        })
        .attr("y", function (d) {
            return d.bbox.y - padding / 2;
        })
        .attr("rx", borderRadius)
        .attr("stroke-width", strokeWidth)
        .attr("stroke", strokeColor)
        .attr("fill", function (d) {
            return color(d.group);
        })

    node = nodeEnter.merge(node);
    // Apply the general update pattern to the links.


    link = link.data(graph.links, function (d) { return d.source.id + "-" + d.target.id; });

    link.exit().remove();

    link = link.enter().append("line").merge(link);

    // Update and start the simulation.
    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    simulation.alpha(2);
    simulation.restart();

}



function ticked() {

    node
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    link
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });
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

function clicked() {
    deselect();
    d3.select(this).selectAll('.nodes > rect').attr("stroke-width", strokeWidth + 2).attr("stroke", "black")
    d3.event.stopPropagation();

}

function mouseOutHandler() {
    d3.select(this).selectAll('.nodes > rect').attr("stroke-width", strokeWidth)
}

function mouseOverHandler() {
    d3.select(this).selectAll('.nodes > rect').attr("stroke-width", strokeWidth + 2);
}

function dblclick(d) {
    var value = d3.select(this).classed("fixed")
    d3.select(this).classed("fixed", !value);

    d3.event.stopPropagation();
}


function mouseTest() {

}

function test() {
    var a = {
        id: "a",
        name: "a"
    },
        b = {
            id: "b",
            name: "b"

        },
        c = {
            id: "c",
            name: "c"

        },
        nodes = [a, b, c],
        links = [];
    d3.timeout(function () {
        links.push({
            source: a,
            target: b
        }); // Add a-b.
        links.push({
            source: b,
            target: c
        }); // Add b-c.
        links.push({
            source: c,
            target: a
        }); // Add c-a.
        restart({
            "nodes": nodes,
            "links": links
        });
    }, 1000);

    d3.interval(function () {
        nodes.pop(); // Remove c.
        links.pop(); // Remove c-a.
        links.pop(); // Remove b-c.
        restart({
            "nodes": nodes,
            "links": links
        });
    }, 2000, d3.now());

    d3.interval(function () {
        nodes.push(c); // Re-add c.
        links.push({
            source: b,
            target: c
        }); // Re-add b-c.
        links.push({
            source: c,
            target: a
        }); // Re-add c-a.
        restart({
            "nodes": nodes,
            "links": links
        });
    }, 2000, d3.now() + 1000);


}