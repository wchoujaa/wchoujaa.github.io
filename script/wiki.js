var rgraphic;
var maxLink = 5;
$(document).ready(function() {
    rgraphic = init();

    $('#topic').submit(function() {
        var names = $('#test').val().split(',');
        for (i = 0; i < names.length; i++) {
          process(names[i], maxLink).then(function(val) {
            var nameList = val;
            for (var j = 0; j < nameList.length; j++) {
              loadArticle(nameList[j].normal);
            }
          });
        }
        return false;
    });


    $(window).resize(function() {
        $('#opening').css('width', $(window).width()).css('height', $(window).height() - 195);
        $('#infovis').css('left', (($(window).width() - screen.width) / 2));
    });

    $(window).resize();
    $('#infovis').css('width', screen.width).css('height', screen.height);
    $('#infovis').css('top', ((($(window).height() - screen.height) / 2)));

    rgraphic.loadJSON(root);
    rgraphic.canvas.resize(screen.width, screen.height);
    rgraphic.compute('end');
    rgraphic.graph.eachNode(function(n) {
        var pos = n.getPos();
        pos.setc(-200, -200);
    });

    rgraphic.fx.animate({
        modes: ['polar'],
        duration: 2500
    });
});

function loadArticle(title, previousMetadata) {
    $.getJSON(
        "http://en.wikipedia.org/w/api.php?callback=?", {
            titles: title,
            action: "query",
            prop: "revisions",
            rvprop: "content",
            format: "json"
        },
        function(data) {
            extractField(data, previousMetadata)
        }
    );
}

function extractField(data, previousMetadata) {
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
    $('#listing>span').fadeOut(fade, function() {
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

function displayNode(text, metadata) {
    var graph = rgraphic.graph;
    var atExistingNode = (graph.getNode(metadata.id) != null);

    addToScroll(3000, metadata.name + (atExistingNode ? " (&middot;)" : ""));

    if (!atExistingNode) {
        graph.addNode(metadata);
        graph.addAdjacence(graph.getNode(metadata.id), graph.getNode(root.id));
    }

    if (metadata.previous != null) {
        graph.removeAdjacence(metadata.previous.id, root.id);
        graph.addAdjacence(graph.getNode(metadata.id), graph.getNode(metadata.previous.id));
    }

    rgraphic.compute('end');
    graph.eachNode(function(n) {
        position = n.getPos('end');
        position.theta = (Math.PI * 2) - ((position.theta - (Math.PI / 16)) / 1.875);
    });
    rgraphic.fx.animate({
        modes: ['polar'],
        duration: 1250
    });

    return atExistingNode;
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
