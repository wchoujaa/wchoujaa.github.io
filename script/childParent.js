var navcontainer;
var data;
function initChildParent() {
    navcontainer = d3.select("#listvis-container > nav");
    var element = document.querySelector('#listvis-container')

    // And pass it to panzoom
    panzoom(element, {
        beforeWheel: function (e) {
            // allow wheel-zoom only if altKey is down. Otherwise - ignore
            var shouldIgnore = !e.altKey;
            return shouldIgnore;
        }
    });
     restartChildParent();
}


function displayList(element, parent) {
    var currentUl;
    if (element.show) {
        var current = parent.append("li");
        var a = current.append("a").text(element.name);
        if(dictionary[element.name]){
            var span = current.append("span").text(dictionary[element.name]);
            a.on("mouseover", span.attr("class", "active"));
            a.on("mouseout", span.attr("class", ""))
        }
        currentUl = current.append("ul");
    } else {
        currentUl = parent;
    }

    if (element.children) {
        element.children.forEach(child => {

            displayList(child, currentUl);
        });
    }
}

function restartChildParent() {

    data = toHierarchy();
    navcontainer.select("ul").remove();
    var parent = navcontainer.append("ul").attr("class", "list");

    displayList(data, parent);
}