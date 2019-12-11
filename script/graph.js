// a ameliorer : link max size = 50
// auto fetch mlinks for each node display mlinks for each node

var labelType, useGradients, nativeTextSupport, animate, rgraphic;
var link;
var node;
var mLink;
var color;
var simulation;
var width = screen.width;
var height = screen.height;
var g;
var gScale;
var padding = 12;
var borderRadius = 6;
var strokeWidth = 4;
var strokeColor = "rgba(0, 0, 0, 0.82)"
var hoverselectedpadding = 22;
var selected;
var zoom;
var slider;
var svg;
var dezoomed;
var linkStrength = 0.08;
var gravity = 0.001;
var dragXStart = 0;
var dragYStart = 0;
var startX = 0;
var startY = 0;
var scale = 1;
var fontSize = "";
var fontSizeZoomed = "42px";
var zoomTrshld = 0.6;
var zoomTrshld2x = 0.3;

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




function init() {

    svg = d3.select("svg");
    width = +svg.attr("width");
    height = +svg.attr("height");
    startX = width / 2;
    startY = height / 2;
}


function initGraph() {

    color = d3.scaleOrdinal(d3.schemeCategory10);

    simulation = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().distance(75).strength(linkStrength))
        .force('x', d3.forceX().strength(gravity))
        .force('y', d3.forceY().strength(gravity))
        .alphaTarget(1)
        .on("tick", ticked);

    svg.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    gScale = svg.append("g").attr("id", "graph");
    g = gScale.append("g").attr("transform", "translate(" + startX + "," + startY + ")");

    mLink = g.append("g").attr("class", "mlinks").selectAll(".mlink");
    link = g.append("g").attr("class", "links").selectAll(".link");
    node = g.append("g").attr("class", "nodes").selectAll(".node");

    svg.call(d3.zoom()
        .extent([
            [0, 0],
            [width, height]
        ])
        .scaleExtent([0.1, 1])
        .on("zoom", zoomed));

    zoom = d3.zoom()
        .scaleExtent([0.1, 1])
        .on("zoom", zoomed);

    slider = d3.select("body").append("p").append("input")
        .datum({})
        .attr("type", "range")
        .attr("min", zoom.scaleExtent()[0])
        .attr("max", zoom.scaleExtent()[1])
        .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
        .attr("value", 1)
        .on("input", slided);

    restart(graph);
    //test();
    return graph;
}



function restart(graph) {

    mLink = mLink.data(graph.mLinks, function (d) {
        return d.source.id + "-" + d.target.id;
    });

    mLink.exit().remove();

    mLink = mLink.enter().append("line").merge(mLink);

    node = node.data(graph.nodes, function (d) {
        return d.id;
    });

    node.exit().each(function () {
        d3.select(this).remove();
    });

    var nodeEnter = node.enter().append("g")
        .attr("class", "nodes")
        .attr("id", (d) =>
            "name" + d.id
        ).attr("name", (d) => d.name);

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
        })
        .attr('x', 12)
        .attr('y', 3).attr("font-size", fontSize);

    nodeEnter.append("circle")
        .attr("r", 5)
        .attr("fill", function (d) {
            return color(d.group);
        })

    node = nodeEnter.merge(node);

    // Apply the general update pattern to the links.

    link = link.data(graph.links, function (d) {
        return d.source.id + "-" + d.target.id;
    });

    link.exit().remove();

    link = link.enter().append("line").merge(link);

    // Update and start the simulation.
    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    simulation.alpha(2);
    simulation.restart();

    zoomGraph();
}

function zoomGraph() {

    if (scale < zoomTrshld2x) {
        node.selectAll("text")
            .transition(500).attr("class", (d) => (adjacency(d) == 0 || adjacency(d) >= 2 || d.id == root.id) ? "dezoom2x" : "hide");
    } else if (scale < zoomTrshld) {
        node.selectAll("text")
            .transition(500).attr("class", (d) => (adjacency(d) == 0 || adjacency(d) >= 2 || d.id == root.id) ? "dezoom" : "hide");
    } else {
        node.selectAll("text")
            .transition(500).attr("class", "");
    }
}

function ticked() {

    mLink
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


function dragstarted(d) {

    d3.select(this).raise();
    svg.attr("cursor", "grabbing");
    if (d3.select(this).node().nodeName == "svg") {
        dragXStart = d3.event.x;
        dragYStart = d3.event.y;
    }
}

function dragged(d) {

    if (d3.select(this).node().nodeName == "svg") {
        var x = startX - (dragXStart - d3.event.x) / scale;
        var y = startY - (dragYStart - d3.event.y) / scale;
        g.attr("transform", "translate(" + x + "," + y + ") ")

    } else {
        d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
    }
}

function dragended() {
    g.attr("cursor", "grab");
    if (d3.select(this).node().nodeName == "svg") {
        startX -= (dragXStart - d3.event.x) / scale;
        startY -= (dragYStart - d3.event.y) / scale;
    }
}

function zoomed() {

    var value = d3.event.transform.k;
    gScale.attr("transform", d3.event.transform);
    slider.property("value", value);

    zoomValue(value);

}

function slided(d) {
    var value = d3.select(this).property("value");
    var transform = gScale.attr("transform");

    gScale.attr("transform", "scale(" + value + ")");

    zoomValue(value);
}

function zoomValue(value) {
    scale = value;
    zoomGraph();

}

function clicked() {

    d3.select(this).selectAll('.nodes > rect').attr("stroke-width", strokeWidth + 2).attr("stroke", "black");
    var metadata = d3.select(this).data()[0];
    metadata.selected = !metadata.selected;
    selected = metadata.selected;
    // open link

    d3.event.stopPropagation();

}

function mouseOutHandler() {


    var metadata = d3.select(this).data()[0];
    node.selectAll("circle").attr("class", "");
}

function mouseOverHandler() {
    var metadata = d3.select(this).data()[0];
    var mLinks = graph.mLinks.filter(link => link.source.id == metadata.id);

    console.log(mLinks);

    node.selectAll("circle").attr("class", (d) => (mLinks.filter(link => link.target.id == d.id || link.id == link.source.id).length > 0) ? "show" : "");

}

function getLinks(metadata) {
    var mlinks = [];

    for (let i = 0; i < metadata.links.length; i++) {
        const metadataLink = metadata.links[i];
        var atExistingNode = isNodeExist(metadataLink);
        if (atExistingNode) {

            mlinks.push({
                "source": metadata,
                "target": metadataLink
            })
        }
    }
    return mlinks;
}

function adjacency(metadata) {
    var count = 0;
    if (!metadata.id) return count;

    graph.links.forEach(link => {
        if (link.source.id == metadata.id) {
            count++;
        }
    });
    return count;
}

function isNodeExist(metadata) {
    return (d3.select('#name' + metadata.id).size() > 0);
}

function isNodeExistByName(pageName) {
    return (d3.select('[name=' + '"' + pageName + '"' + ']').size() > 0);
}

function addLink(metadataSrc, metadataDst) {
    var contain = graph.links.filter(link => link.source.id == metadataSrc.id && link.target.id == metadataDst.id);

    if (contain.length == 0) {
        graph.links.push({
            metadataSrc,
            metadataDst
        });
    }

    restart(graph);

}

function addMlink(metadataSrc, metadataDst) {
    var contain = graph.mLinks.filter(mlink => mlink.source.id == metadataSrc.id && mlink.target.id == metadataDst.id);

    if (contain.length == 0) {
        graph.mLinks.push({
            metadataSrc,
            metadataDst
        });
    }

    restart(graph);

}

function metadataByName(pageName) {
    return d3.select('[name=' + '"' + pageName + '"' + "]").data()[0];
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