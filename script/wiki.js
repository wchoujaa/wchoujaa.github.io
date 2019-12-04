var maxLink = 5;
var graph;
$(document).ready(function () {
    graph = init();

    $("#submit").click(onSubmit);
    $('#title').submit(onSubmit);


    $(window).resize(function () {
        $('#opening').css('width', $(window).width()).css('height', $(window).height() - 195);
        $('#infovis').css('left', (($(window).width() - screen.width) / 2));
    });

    $(window).resize();
    $('#infovis').css('width', screen.width).css('height', screen.height);
    $('#infovis').css('top', ((($(window).height() - screen.height) / 2)));

   $('#branch').change(function () {
      maxLink = $('#branch').val();
   });

});

function onSubmit(e) {
    e.preventDefault();

    var names = $('#test').val().split(',');
    if (names == "") return false;
    for (i = 0; i < names.length; i++) {
        loadArticle(names[i]);
        process(names[i], maxLink).then(function (val) {
            console.log(val);
            
            var nameList = val;
            for (var j = 0; j < nameList.length; j++) {
                loadArticle(nameList[j].page);
            }
        });
    }
    return false;
}

function displayNode(text, metadata) {
    var nodes = graph.nodes.slice();
    var links = graph.links.slice();
    //console.log(nodes);


    var atExistingNode = (d3.select('#name' + metadata.id).size() > 0);

    addToScroll(3000, metadata.name + (atExistingNode ? " (&middot;)" : ""));

    if (!atExistingNode) {

        nodes.push(metadata);

        links.push({
            "source": metadata,
            "target": root
        })
    }

    if (metadata.previous != null) {

        links = links.filter(link => !(link.source.id == metadata.previous.id && link.target.id == root.id));
        links = links.filter(link => !(link.target.id == metadata.previous.id && link.source.id == root.id));

        if (atExistingNode) {
            var previous = metadata.previous;
            metadata = d3.select('#name' + metadata.id).data()[0];
            metadata.previous = previous;
        }

        links.push({
            "source": metadata,
            "target": metadata.previous
        })
    }

    graph = {
        "nodes": nodes,
        "links": links
    }

    restart(graph);

    return atExistingNode;
}

function loadArticle(title, previousMetadata) {

    $.getJSON(
        "https://en.wikipedia.org/w/api.php?callback=?", {
        titles: title,
        action: "query",
        prop: "revisions",
        rvprop: "content",
        format: "json"
    },
        function (data) {
            extractField(data, previousMetadata)
        }
    );
}

function extractField(data, previousMetadata) {

    if (!data.query) return;
    var page = data.query.pages;
    for (i in page) {
        var title = page[i].title;
        var pageid = page[i].pageid;
        if (page[i].revisions == null) {
            addToScroll(10000, page[i].title + " (Non trouv&eacute;)");
            break;
        }
        var text = page[i].revisions[0]["*"];
        entry(text, {
            id: pageid,
            name: title,
            previous: previousMetadata
        });
        break;
    }
}

function addToScroll(fade, name) {
    var spanner = $('<span class="scroll">' + name + '<br/></span>')
    $('#listing').append(spanner);
    $('#listing>span').fadeOut(fade, function () {
        $(this).remove();
    });
}

function entry(text, metadata) {

    if (displayNode(text, metadata)) {
        return;
    }

    var cleared = false;
    while (!cleared) {
        if (isNoteStart(text)) {
            text = clearLine(text);
        } else if (isDataBlock(text, "{")) {
            text = clearDataBlock(text, "{", "}");
        } else if (isDataBlock(text, "[")) {
            text = clearDataBlock(text, "[", "]");
        } else if (isInfoBox(text)) {
            text = clearInfoBox(text);
        } else if (isNoInclude(text)) {
            text = clearNoInclude(text);
        } else if (isXmlComment(text)) {
            text = clearXmlComment(text);
        } else {
            cleared = true;
        }
    }

    loadArticle(extractFirstLink(text, metadata), metadata);
}


function mapping(position) {
    return position;
}



function extractFirstLink(data, metadata) {
    var i;
    var found = false;

    while (!found) {
        if (isNoteStart(data) || isFileReference(data)) {
            data = clearLine(data);
        } else if (isDefinitionStart(data)) {
            data = clearDefinition(data);
        } else if (isReferenceStart(data)) {
            data = clearReference(data);
        } else if (isRedirect(data)) {
            return getRedirect(data);
        } else if (isDataBlock(data, "[")) {
            return getTerm(data, metadata);
        } else {
            data = data.slice(1);
        }
    }
}

function getTerm(data, previousMetadata) {
    var regex = /\[\[([^:\]]+?)\]\]/g;
    var match;

    while (match = regex.exec(data)) {
        term = match[1];
        var index = term.indexOf("|");
        term = (index == -1) ? term : term.slice(0, index);
        index = term.indexOf("#");
        term = (index == -1) ? term : term.slice(0, index);

        if (!formsLoop(term, previousMetadata)) {
            return term;
        }
    }
}

function isRedirect(data) {
    return data.indexOf("#REDIRECT") != -1;
}

function getRedirect(data) {
    var regex = /\[\[([^:\]]+?)\]\]/g;
    var match = regex.exec(data);

    return match[1];
}

function formsLoop(term, previousMetadata) {
    var metadata = previousMetadata;

    while (metadata != null) {
        if (term.toLowerCase() == metadata.name.toLowerCase()) {
            return true;
        }
        metadata = metadata.previous;
    }

    return false;
}

function isDataBlock(data, startChar) {
    return data.charAt(0) == startChar && data.charAt(1) == startChar;
}

function isDefinitionStart(data) {
    return data.charAt(0) == "(";
}

function isInfoBox(data) {
    return data.indexOf("{|") == 0;
}

function clearInfoBox(data) {
    var index = data.indexOf("|}");
    var size = "|}".length;
    return $.trim(data.slice(index + size));
}

function isNoInclude(data) {
    return data.indexOf("<noinclude>") == 0;
}

function clearNoInclude(data) {
    var index = data.indexOf("</noinclude>");
    var size = "</noinclude>".length;
    return $.trim(data.slice(index + size));
}

function isXmlComment(data) {
    return data.indexOf("<!--") == 0;
}

function clearXmlComment(data) {
    var index = data.indexOf("-->");
    var size = "-->".length;
    return $.trim(data.slice(index + size));
}

function isReferenceStart(data) {
    return (data.indexOf("<ref ") == 0) || (data.indexOf("<ref>") == 0);
}

function clearReference(data) {
    var index = data.indexOf("</ref>");
    var size = "</ref>".length;
    return $.trim(data.slice(index + size));
}

function isNoteStart(data) {
    return data.charAt(0) == ":";
}

function clearLine(data) {
    var index = data.indexOf('\n');
    return $.trim(data.slice(index));
}

function isFileReference(data) {
    return data.indexOf("[[File:") == 0 || data.indexOf("[[Image:") == 0;
}

function clearDefinition(data) {
    var j, count = 1;
    for (j = 1; j < data.length; j++) {
        if (data.charAt(j) == "(") {
            count++
        }
        if (data.charAt(j) == ")") {
            count--;
        }

        if (count == 0) {
            data = $.trim(data.slice(j + 1));
            return data;
        }
    }
}

function clearDataBlock(data, startChar, endChar) {
    var j, count = 2;
    for (j = 2; j < data.length; j++) {
        if (data.charAt(j) == startChar) {
            count++
        }
        if (data.charAt(j) == endChar) {
            count--;
        }

        if (count == 0) {
            data = $.trim(data.slice(j + 1));
            return data;
        }
    }
}