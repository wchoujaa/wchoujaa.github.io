var labelType, useGradients, nativeTextSupport, animate, rgraphic;

(function() {
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

function init() {
    var graph = new $jit.ForceDirected({

        injectInto: 'infovis',
        levelDistance: 28,
        transition: $jit.Trans.Quart.easeInOut,
          iter:30,
        Navigation: {
            enable: true,
            panning: true,
            zooming: 100
        },

        Node: {
            overridable: true,
            color: '#bb0000'
        },

        Edge: {
            overridable: true,
            color: '#222',
            lineWidth: .5
        },

        onCreateLabel: function(domElement, node) {
            style = node.id == root.id ? " style='font-size:14px;font-weight:bold'" : "";
            domElement.innerHTML = '<p' + style + ' href="http://fr.wikipedia.org/wiki/' + node.name + '">' + node.name + '</a>';
        },

        onPlaceLabel: function(domElement, node) {
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
        }
    });


  return graph;
}
