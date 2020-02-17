const data_link = "https://raw.githubusercontent.com/wchoujaa/game-dev-map/master/readme.md";
                    
var data;

var tree;
var treeLayout;
d3.select(window).on("load", async function () {
    await d3.text(data_link).then(function (text) {
        data = hierarchy_from(text);
    });
    //console.log(tree, data);
    normalDendogram(data)
});

function normalDendogram(data) {
    var width = window.screen.width
    var height = window.screen.height
    var svg = d3.select("#dendo")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "scale(0.7) translate( " + width / 3 + "," + height / 7 + ")")


    var root = d3.hierarchy(data, function (d) {
        return d.children;
    });

    console.log(root);


    var cluster = d3.cluster()
        .size([height, width * 0.7]);  // 100 is the margin I will have on the right side

    // Give the data to this cluster layout:


    cluster(root);

    // Add the links between nodes:
    svg.selectAll('path')
        .data(root.descendants().slice(1))
        .enter()
        .append('path')
        .attr("d", function (d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 50) + "," + d.x
                + " " + (d.parent.y + 150) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.y + "," + d.parent.x;
        })
        .style("fill", 'none')
        .attr("stroke", '#ccc')



        .append("circle")
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .style("stroke-width", 2)

    g = svg.selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")"
        })

    g.append("circle")
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .style("stroke-width", 2);

    g.append("text").attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 17px Arial")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .attr("transform", function (d) {
            return "translate(17,0)"
        })
        .text(function (d) {
            return d.data.name;
        });


}

function radialDendogram(data) {
    var width = window.screen.width
    var height = window.screen.height
    var radius = width / 5 // radius of the dendrogram
    var svg = d3.select("#dendo")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var cluster = d3.cluster()
        .size([360, radius]);

    // Give the data to this cluster layout:
    var root = d3.hierarchy(data, function (d) {
        return d.children;
    });
    cluster(root);

    // Features of the links between nodes:
    var linksGenerator = d3.linkRadial()
        .angle(function (d) { return d.x / 180 * Math.PI; })
        .radius(function (d) { return d.y; });

    // Add the links between nodes:
    svg.selectAll('path')
        .data(root.links())
        .enter()
        .append('path')
        .attr("d", linksGenerator)
        .style("fill", 'none')
        .attr("stroke", '#ccc')


    // Add a circle for each node.
    g = svg.selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        });

    g.append("circle")
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .style("stroke-width", 2);

    g.append("text").attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 12px Arial")
        .attr("dy", ".35em")
        .attr("text-anchor", (d) => d.x < 180 ? "start" : "end")
        .attr("transform", (d) => d.x < 180 ? "translate(17)" : "rotate(180)translate(-17)"
        )
        .text(function (d) {
            console.log(d.data.name);

            return d.data.name;
        });



}

function treeLayout(data) {
    var root = d3.hierarchy(data)
    treeLayout = d3.tree();
    treeLayout.size([400, 200]);
    console.log(data);

    treeLayout(root);
    console.log(root);

    d3.select('svg g.nodes')
        .selectAll('circle.node')
        .data(root.descendants())
        .enter()
        .append('circle')
        .classed('node', true)
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr('r', 4);

    // Links
    d3.select('svg g.links')
        .selectAll('line.link')
        .data(root.links())
        .enter()
        .append('line')
        .classed('link', true)
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });
}


function recurseOn(current) {
    var children = current.children;

    if (children.length == 0) {
        current.children = null;
    } else {
        children.forEach(child => {
            recurseOn(child);
        });
    }

}

function hierarchy_from(text) {
    var text_array = text.split("\n");
    var text_array_filtered = text_array.filter((elem) => elem != "" && elem != " ");

    var curr; // nodes
    var lvl;    // increment
    var stack = [];
    var root = { name: "Game Developpement", children: [], lvl: 0 };
    stack.push(root);

    for (let i = 0; i < text_array_filtered.length; i++) {
        const line = text_array_filtered[i];
        lvl = (line.match(/#/g) || []).length;
        if (lvl == 1) continue;

        curr = { name: line.split('#').join(''), children: [], lvl: lvl }
        parent = stack[stack.length - 1];
        //console.log(stack);

        while (lvl <= parent.lvl) {
            stack.pop();
            parent = stack[stack.length - 1];
        }

        parent.children.push(curr);
        stack.push(curr);
    }

    recurseOn(root);

    return root;
    //console.log(root);
    //console.log(text_array_filtered);
}

function graph(root, {
    label = d => d.data.id,
    highlight = () => false,
    marginLeft = 40
} = {}) {
    root = d3.tree()(root);
    console.log(root);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
    });

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, x1 - x0 + dx * 2])
        .style("overflow", "visible");

    const g = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("transform", `translate(${marginLeft},${dx - x0})`);

    const link = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("stroke", d => highlight(d.source) && highlight(d.target) ? "red" : null)
        .attr("stroke-opacity", d => highlight(d.source) && highlight(d.target) ? 1 : null)
        .attr("d", treeLink);

    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
        .attr("r", 2.5);

    node.append("text")
        .attr("fill", d => highlight(d) ? "red" : null)
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(label)
        .clone(true).lower()
        .attr("stroke", "white");
}