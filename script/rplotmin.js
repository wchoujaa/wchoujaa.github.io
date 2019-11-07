/*
Copyright (c) 2011 Sencha Inc. - Author: Nicolas Garcia Belmonte (http://philogb.github.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */

(function() {
    window.$jit = function(a) {
        var a = a || window,
            b;
        for (b in $jit) $jit[b].$extend && (a[b] = $jit[b])
    };
    $jit.version = "2.0.1";
    var f = function(a) {
        return document.getElementById(a)
    };
    f.empty = function() {};
    f.extend = function(a, b) {
        for (var c in b || {}) a[c] = b[c];
        return a
    };
    f.lambda = function(a) {
        return typeof a == "function" ? a : function() {
            return a
        }
    };
    f.time = Date.now || function() {
        return +new Date
    };
    f.splat = function(a) {
        var b = f.type(a);
        return b ? b != "array" ? [a] : a : []
    };
    f.type = function(a) {
        var b = f.type.s.call(a).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
        if (b != "object") return b;
        if (a && a.$$family) return a.$$family;
        return a && a.nodeName && a.nodeType == 1 ? "element" : b
    };
    f.type.s = Object.prototype.toString;
    f.each = function(a, b) {
        if (f.type(a) == "object")
            for (var c in a) b(a[c], c);
        else {
            c = 0;
            for (var d = a.length; c < d; c++) b(a[c], c)
        }
    };
    f.indexOf = function(a, b) {
        if (Array.indexOf) return a.indexOf(b);
        for (var c = 0, d = a.length; c < d; c++)
            if (a[c] === b) return c;
        return -1
    };
    f.map = function(a, b) {
        var c = [];
        f.each(a, function(a, e) {
            c.push(b(a, e))
        });
        return c
    };
    f.reduce = function(a, b, c) {
        var d = a.length;
        if (d == 0) return c;
        for (var e = arguments.length == 3 ? c : a[--d]; d--;) e = b(e, a[d]);
        return e
    };
    f.merge = function() {
        for (var a = {}, b = 0, c = arguments.length; b < c; b++) {
            var d = arguments[b];
            if (f.type(d) == "object")
                for (var e in d) {
                    var g = d[e],
                        h = a[e];
                    a[e] = h && f.type(g) == "object" && f.type(h) == "object" ? f.merge(h, g) : f.unlink(g)
                }
        }
        return a
    };
    f.unlink = function(a) {
        var b;
        switch (f.type(a)) {
            case "object":
                b = {};
                for (var c in a) b[c] = f.unlink(a[c]);
                break;
            case "array":
                b = [];
                c = 0;
                for (var d = a.length; c < d; c++) b[c] = f.unlink(a[c]);
                break;
            default:
                return a
        }
        return b
    };
    f.zip = function() {
        if (arguments.length === 0) return [];
        for (var a = 0, b = [], c = arguments.length, d = arguments[0].length; a < d; a++) {
            for (var e = 0, g = []; e < c; e++) g.push(arguments[e][a]);
            b.push(g)
        }
        return b
    };
    f.rgbToHex = function(a, b) {
        if (a.length < 3) return null;
        if (a.length == 4 && a[3] == 0 && !b) return "transparent";
        for (var c = [], d = 0; d < 3; d++) {
            var e = (a[d] - 0).toString(16);
            c.push(e.length == 1 ? "0" + e : e)
        }
        return b ? c : "#" + c.join("")
    };
    f.hexToRgb = function(a) {
        if (a.length != 7) {
            a = a.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
            a.shift();
            if (a.length !=
                3) return null;
            for (var b = [], c = 0; c < 3; c++) {
                var d = a[c];
                d.length == 1 && (d += d);
                b.push(parseInt(d, 16))
            }
            return b
        } else return a = parseInt(a.slice(1), 16), [a >> 16, a >> 8 & 255, a & 255]
    };
    f.destroy = function(a) {
        f.clean(a);
        a.parentNode && a.parentNode.removeChild(a);
        a.clearAttributes && a.clearAttributes()
    };
    f.clean = function(a) {
        for (var a = a.childNodes, b = 0, c = a.length; b < c; b++) f.destroy(a[b])
    };
    f.addEvent = function(a, b, c) {
        a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c)
    };
    f.addEvents = function(a, b) {
        for (var c in b) f.addEvent(a,
            c, b[c])
    };
    f.hasClass = function(a, b) {
        return (" " + a.className + " ").indexOf(" " + b + " ") > -1
    };
    f.addClass = function(a, b) {
        if (!f.hasClass(a, b)) a.className = a.className + " " + b
    };
    f.removeClass = function(a, b) {
        a.className = a.className.replace(RegExp("(^|\\s)" + b + "(?:\\s|$)"), "$1")
    };
    f.getPos = function(a) {
        var b = function(a) {
                for (var b = {
                        x: 0,
                        y: 0
                    }; a && !/^(?:body|html)$/i.test(a.tagName);) b.x += a.offsetLeft, b.y += a.offsetTop, a = a.offsetParent;
                return b
            }(a),
            a = function(a) {
                for (var b = {
                        x: 0,
                        y: 0
                    }; a && !/^(?:body|html)$/i.test(a.tagName);) b.x +=
                    a.scrollLeft, b.y += a.scrollTop, a = a.parentNode;
                return b
            }(a);
        return {
            x: b.x - a.x,
            y: b.y - a.y
        }
    };
    f.event = {
        get: function(a, b) {
            return a || (b || window).event
        },
        getWheel: function(a) {
            return a.wheelDelta ? a.wheelDelta / 120 : -(a.detail || 0) / 3
        },
        isRightClick: function(a) {
            return a.which == 3 || a.button == 2
        },
        getPos: function(a, b) {
            var b = b || window,
                a = a || b.event,
                c = b.document,
                c = c.documentElement || c.body;
            a.touches && a.touches.length && (a = a.touches[0]);
            return {
                x: a.pageX || a.clientX + c.scrollLeft,
                y: a.pageY || a.clientY + c.scrollTop
            }
        },
        stop: function(a) {
            a.stopPropagation &&
                a.stopPropagation();
            a.cancelBubble = !0;
            a.preventDefault ? a.preventDefault() : a.returnValue = !1
        }
    };
    $jit.util = $jit.id = f;
    var i = function(a) {
        var a = a || {},
            b = function() {
                for (var a in this) typeof this[a] != "function" && (this[a] = f.unlink(this[a]));
                this.constructor = b;
                if (i.prototyping) return this;
                a = this.initialize ? this.initialize.apply(this, arguments) : this;
                this.$$family = "class";
                return a
            },
            c;
        for (c in i.Mutators) a[c] && (a = i.Mutators[c](a, a[c]), delete a[c]);
        f.extend(b, this);
        b.constructor = i;
        b.prototype = a;
        return b
    };
    i.Mutators = {
        Implements: function(a, b) {
            f.each(f.splat(b), function(b) {
                i.prototyping = b;
                var b = typeof b == "function" ? new b : b,
                    d;
                for (d in b) d in a || (a[d] = b[d]);
                delete i.prototyping
            });
            return a
        }
    };
    f.extend(i, {
        inherit: function(a, b) {
            for (var c in b) {
                var d = b[c],
                    e = a[c],
                    g = f.type(d);
                e && g == "function" ? d != e && i.override(a, c, d) : a[c] = g == "object" ? f.merge(e, d) : d
            }
            return a
        },
        override: function(a, b, c) {
            var d = i.prototyping;
            d && a[b] != d[b] && (d = null);
            a[b] = function() {
                var e = this.parent;
                this.parent = d ? d[b] : a[b];
                var g = c.apply(this, arguments);
                this.parent =
                    e;
                return g
            }
        }
    });
    i.prototype.implement = function() {
        var a = this.prototype;
        f.each(Array.prototype.slice.call(arguments || []), function(b) {
            i.inherit(a, b)
        });
        return this
    };
    $jit.Class = i;
    $jit.json = {
        prune: function(a, b) {
            this.each(a, function(a, d) {
                if (d == b && a.children) delete a.children, a.children = []
            })
        },
        getParent: function(a, b) {
            if (a.id == b) return !1;
            var c = a.children;
            if (c && c.length > 0)
                for (var d = 0; d < c.length; d++)
                    if (c[d].id == b) return a;
                    else {
                        var e = this.getParent(c[d], b);
                        if (e) return e
                    }
            return !1
        },
        getSubtree: function(a, b) {
            if (a.id ==
                b) return a;
            for (var c = 0, d = a.children; d && c < d.length; c++) {
                var e = this.getSubtree(d[c], b);
                if (e != null) return e
            }
            return null
        },
        eachLevel: function(a, b, c, d) {
            if (b <= c && (d(a, b), a.children))
                for (var e = 0, a = a.children; e < a.length; e++) this.eachLevel(a[e], b + 1, c, d)
        },
        each: function(a, b) {
            this.eachLevel(a, 0, Number.MAX_VALUE, b)
        }
    };
    $jit.Trans = {
        $extend: !0,
        linear: function(a) {
            return a
        }
    };
    var v = $jit.Trans;
    (function() {
        var a = function(a, c) {
            c = f.splat(c);
            return f.extend(a, {
                easeIn: function(d) {
                    return a(d, c)
                },
                easeOut: function(d) {
                    return 1 -
                        a(1 - d, c)
                },
                easeInOut: function(d) {
                    return d <= 0.5 ? a(2 * d, c) / 2 : (2 - a(2 * (1 - d), c)) / 2
                }
            })
        };
        f.each({
            Pow: function(a, c) {
                return Math.pow(a, c[0] || 6)
            },
            Expo: function(a) {
                return Math.pow(2, 8 * (a - 1))
            },
            Circ: function(a) {
                return 1 - Math.sin(Math.acos(a))
            },
            Sine: function(a) {
                return 1 - Math.sin((1 - a) * Math.PI / 2)
            },
            Back: function(a, c) {
                c = c[0] || 1.618;
                return Math.pow(a, 2) * ((c + 1) * a - c)
            },
            Bounce: function(a) {
                for (var c, d = 0, e = 1;; d += e, e /= 2)
                    if (a >= (7 - 4 * d) / 11) {
                        c = e * e - Math.pow((11 - 6 * d - 11 * a) / 4, 2);
                        break
                    }
                return c
            },
            Elastic: function(a, c) {
                return Math.pow(2,
                    10 * --a) * Math.cos(20 * a * Math.PI * (c[0] || 1) / 3)
            }
        }, function(b, c) {
            v[c] = a(b)
        });
        f.each(["Quad", "Cubic", "Quart", "Quint"], function(b, c) {
            v[b] = a(function(a) {
                return Math.pow(a, [c + 2])
            })
        })
    })();
    var B = new i({
            initialize: function(a) {
                this.setOptions(a)
            },
            setOptions: function(a) {
                this.opt = f.merge({
                    duration: 2500,
                    fps: 40,
                    transition: v.Quart.easeInOut,
                    compute: f.empty,
                    complete: f.empty,
                    link: "ignore"
                }, a || {});
                return this
            },
            step: function() {
                var a = f.time(),
                    b = this.opt;
                a < this.time + b.duration ? (a = b.transition((a - this.time) / b.duration), b.compute(a)) :
                    (this.timer = clearInterval(this.timer), b.compute(1), b.complete())
            },
            start: function() {
                if (!this.check()) return this;
                this.time = 0;
                this.startTimer();
                return this
            },
            startTimer: function() {
                var a = this,
                    b = this.opt.fps;
                if (this.timer) return !1;
                this.time = f.time() - this.time;
                this.timer = setInterval(function() {
                    a.step()
                }, Math.round(1E3 / b));
                return !0
            },
            pause: function() {
                this.stopTimer();
                return this
            },
            resume: function() {
                this.startTimer();
                return this
            },
            stopTimer: function() {
                if (!this.timer) return !1;
                this.time = f.time() - this.time;
                this.timer =
                    clearInterval(this.timer);
                return !0
            },
            check: function() {
                if (!this.timer) return !0;
                if (this.opt.link == "cancel") return this.stopTimer(), !0;
                return !1
            }
        }),
        o = function() {
            for (var a = arguments, b = 0, c = a.length, d = {}; b < c; b++) {
                var e = o[a[b]];
                e.$extend ? f.extend(d, e) : d[a[b]] = e
            }
            return d
        };
    o.Canvas = {
        $extend: !0,
        injectInto: "id",
        type: "2D",
        width: !1,
        height: !1,
        useCanvas: !1,
        withLabels: !0,
        background: !1,
        Scene: {
            Lighting: {
                enable: !1,
                ambient: [1, 1, 1],
                directional: {
                    direction: {
                        x: -100,
                        y: -100,
                        z: -100
                    },
                    color: [0.5, 0.3, 0.1]
                }
            }
        }
    };
    o.Node = {
        $extend: !1,
        overridable: !1,
        type: "circle",
        color: "#ccb",
        alpha: 1,
        dim: 3,
        height: 20,
        width: 90,
        autoHeight: !1,
        autoWidth: !1,
        lineWidth: 1,
        transform: !0,
        align: "center",
        angularWidth: 1,
        span: 1,
        CanvasStyles: {}
    };
    o.Edge = {
        $extend: !1,
        overridable: !1,
        type: "line",
        color: "#ccb",
        lineWidth: 1,
        dim: 15,
        alpha: 1,
        epsilon: 7,
        CanvasStyles: {}
    };
    o.Fx = {
        $extend: !0,
        fps: 40,
        duration: 2500,
        transition: $jit.Trans.Quart.easeInOut,
        clearCanvas: !0
    };
    o.Label = {
        $extend: !1,
        overridable: !1,
        type: "HTML",
        style: " ",
        size: 10,
        family: "sans-serif",
        textAlign: "center",
        textBaseline: "alphabetic",
        color: "#fff"
    };
    o.Tips = {
        $extend: !1,
        enable: !1,
        type: "auto",
        offsetX: 20,
        offsetY: 20,
        force: !1,
        onShow: f.empty,
        onHide: f.empty
    };
    o.NodeStyles = {
        $extend: !1,
        enable: !1,
        type: "auto",
        stylesHover: !1,
        stylesClick: !1
    };
    o.Events = {
        $extend: !1,
        enable: !1,
        enableForEdges: !1,
        type: "auto",
        onClick: f.empty,
        onRightClick: f.empty,
        onMouseMove: f.empty,
        onMouseEnter: f.empty,
        onMouseLeave: f.empty,
        onDragStart: f.empty,
        onDragMove: f.empty,
        onDragCancel: f.empty,
        onDragEnd: f.empty,
        onTouchStart: f.empty,
        onTouchMove: f.empty,
        onTouchEnd: f.empty,
        onMouseWheel: f.empty
    };
    o.Navigation = {
        $extend: !1,
        enable: !1,
        type: "auto",
        panning: !1,
        zooming: !1
    };
    o.Controller = {
        $extend: !0,
        onBeforeCompute: f.empty,
        onAfterCompute: f.empty,
        onCreateLabel: f.empty,
        onPlaceLabel: f.empty,
        onComplete: f.empty,
        onBeforePlotLine: f.empty,
        onAfterPlotLine: f.empty,
        onBeforePlotNode: f.empty,
        onAfterPlotNode: f.empty,
        request: !1
    };
    var r = {
            initialize: function(a, b) {
                this.viz = b;
                this.canvas = b.canvas;
                this.config = b.config[a];
                this.nodeTypes = b.fx.nodeTypes;
                var c = this.config.type;
                this.labelContainer = (this.dom = c == "auto" ? b.config.Label.type !=
                    "Native" : c != "Native") && b.labels.getLabelContainer();
                this.isEnabled() && this.initializePost()
            },
            initializePost: f.empty,
            setAsProperty: f.lambda(!1),
            isEnabled: function() {
                return this.config.enable
            },
            isLabel: function(a, b, c) {
                var a = f.event.get(a, b),
                    b = this.labelContainer,
                    d = a.target || a.srcElement,
                    a = a.relatedTarget;
                return c ? a && a == this.viz.canvas.getCtx().canvas && !!d && this.isDescendantOf(d, b) : this.isDescendantOf(d, b)
            },
            isDescendantOf: function(a, b) {
                for (; a && a.parentNode;) {
                    if (a.parentNode == b) return a;
                    a = a.parentNode
                }
                return !1
            }
        },
        y = {
            onMouseUp: f.empty,
            onMouseDown: f.empty,
            onMouseMove: f.empty,
            onMouseOver: f.empty,
            onMouseOut: f.empty,
            onMouseWheel: f.empty,
            onTouchStart: f.empty,
            onTouchMove: f.empty,
            onTouchEnd: f.empty,
            onTouchCancel: f.empty
        },
        E = new i({
            initialize: function(a) {
                this.viz = a;
                this.canvas = a.canvas;
                this.edge = this.node = !1;
                this.registeredObjects = [];
                this.attachEvents()
            },
            attachEvents: function() {
                var a = this.canvas.getElement(),
                    b = this;
                a.oncontextmenu = f.lambda(!1);
                f.addEvents(a, {
                    mouseup: function(a, c) {
                        var g = f.event.get(a, c);
                        b.handleEvent("MouseUp",
                            a, c, b.makeEventObject(a, c), f.event.isRightClick(g))
                    },
                    mousedown: function(a, c) {
                        var g = f.event.get(a, c);
                        b.handleEvent("MouseDown", a, c, b.makeEventObject(a, c), f.event.isRightClick(g))
                    },
                    mousemove: function(a, c) {
                        b.handleEvent("MouseMove", a, c, b.makeEventObject(a, c))
                    },
                    mouseover: function(a, c) {
                        b.handleEvent("MouseOver", a, c, b.makeEventObject(a, c))
                    },
                    mouseout: function(a, c) {
                        b.handleEvent("MouseOut", a, c, b.makeEventObject(a, c))
                    },
                    touchstart: function(a, c) {
                        b.handleEvent("TouchStart", a, c, b.makeEventObject(a, c))
                    },
                    touchmove: function(a,
                        c) {
                        b.handleEvent("TouchMove", a, c, b.makeEventObject(a, c))
                    },
                    touchend: function(a, c) {
                        b.handleEvent("TouchEnd", a, c, b.makeEventObject(a, c))
                    }
                });
                var c = function(a, c) {
                    var g = f.event.get(a, c),
                        g = f.event.getWheel(g);
                    b.handleEvent("MouseWheel", a, c, g)
                };
                !document.getBoxObjectFor && window.mozInnerScreenX == null ? f.addEvent(a, "mousewheel", c) : a.addEventListener("DOMMouseScroll", c, !1)
            },
            register: function(a) {
                this.registeredObjects.push(a)
            },
            handleEvent: function() {
                for (var a = Array.prototype.slice.call(arguments), b = a.shift(),
                        c = 0, d = this.registeredObjects, e = d.length; c < e; c++) d[c]["on" + b].apply(d[c], a)
            },
            makeEventObject: function(a, b) {
                var c = this,
                    d = this.viz.graph,
                    e = this.viz.fx,
                    g = e.nodeTypes,
                    h = e.edgeTypes;
                return {
                    pos: !1,
                    node: !1,
                    edge: !1,
                    contains: !1,
                    getNodeCalled: !1,
                    getEdgeCalled: !1,
                    getPos: function() {
                        var d = c.viz.canvas,
                            e = d.getSize(),
                            g = d.getPos(),
                            h = d.translateOffsetX,
                            n = d.translateOffsetY,
                            i = d.scaleOffsetX,
                            d = d.scaleOffsetY,
                            u = f.event.getPos(a, b);
                        return this.pos = {
                            x: (u.x - g.x - e.width / 2 - h) * 1 / i,
                            y: (u.y - g.y - e.height / 2 - n) * 1 / d
                        }
                    },
                    getNode: function() {
                        if (this.getNodeCalled) return this.node;
                        this.getNodeCalled = !0;
                        for (var a in d.nodes) {
                            var b = d.nodes[a],
                                h = b && g[b.getData("type")];
                            if (h = h && h.contains && h.contains.call(e, b, this.getPos())) return this.contains = h, c.node = this.node = b
                        }
                        return c.node = this.node = !1
                    },
                    getEdge: function() {
                        if (this.getEdgeCalled) return this.edge;
                        this.getEdgeCalled = !0;
                        var a = {},
                            b;
                        for (b in d.edges) {
                            var g = d.edges[b];
                            a[b] = !0;
                            for (var f in g)
                                if (!(f in a)) {
                                    var n = g[f],
                                        i = n && h[n.getData("type")];
                                    if (i = i && i.contains && i.contains.call(e, n, this.getPos())) return this.contains = i, c.edge = this.edge =
                                        n
                                }
                        }
                        return c.edge = this.edge = !1
                    },
                    getContains: function() {
                        if (this.getNodeCalled) return this.contains;
                        this.getNode();
                        return this.contains
                    }
                }
            }
        }),
        w = {
            initializeExtras: function() {
                var a = new E(this),
                    b = this;
                f.each(["NodeStyles", "Tips", "Navigation", "Events"], function(c) {
                    var d = new w.Classes[c](c, b);
                    d.isEnabled() && a.register(d);
                    d.setAsProperty() && (b[c.toLowerCase()] = d)
                })
            },
            Classes: {}
        };
    w.Classes.Events = new i({
        Implements: [r, y],
        initializePost: function() {
            this.fx = this.viz.fx;
            this.ntypes = this.viz.fx.nodeTypes;
            this.etypes =
                this.viz.fx.edgeTypes;
            this.moved = this.touchMoved = this.touched = this.pressed = this.hovered = !1
        },
        setAsProperty: f.lambda(!0),
        onMouseUp: function(a, b, c, d) {
            a = f.event.get(a, b);
            if (!this.moved)
                if (d) this.config.onRightClick(this.hovered, c, a);
                else this.config.onClick(this.pressed, c, a);
            if (this.pressed) {
                if (this.moved) this.config.onDragEnd(this.pressed, c, a);
                else this.config.onDragCancel(this.pressed, c, a);
                this.pressed = this.moved = !1
            }
        },
        onMouseOut: function(a, b, c) {
            var d = f.event.get(a, b),
                e;
            if (this.dom && (e = this.isLabel(a,
                    b, !0))) this.config.onMouseLeave(this.viz.graph.getNode(e.id), c, d), this.hovered = !1;
            else {
                a = d.relatedTarget;
                for (b = this.canvas.getElement(); a && a.parentNode;) {
                    if (b == a.parentNode) return;
                    a = a.parentNode
                }
                if (this.hovered) this.config.onMouseLeave(this.hovered, c, d), this.hovered = !1
            }
        },
        onMouseOver: function(a, b, c) {
            var d = f.event.get(a, b),
                e;
            if (this.dom && (e = this.isLabel(a, b, !0))) this.hovered = this.viz.graph.getNode(e.id), this.config.onMouseEnter(this.hovered, c, d)
        },
        onMouseMove: function(a, b, c) {
            a = f.event.get(a, b);
            if (this.pressed) this.moved = !0, this.config.onDragMove(this.pressed, c, a);
            else if (this.dom) this.config.onMouseMove(this.hovered, c, a);
            else {
                if (this.hovered) {
                    var b = this.hovered,
                        d = b.nodeFrom ? this.etypes[b.getData("type")] : this.ntypes[b.getData("type")];
                    if (d && d.contains && d.contains.call(this.fx, b, c.getPos())) {
                        this.config.onMouseMove(b, c, a);
                        return
                    } else this.config.onMouseLeave(b, c, a), this.hovered = !1
                }
                if (this.hovered = c.getNode() || this.config.enableForEdges && c.getEdge()) this.config.onMouseEnter(this.hovered, c, a);
                else this.config.onMouseMove(!1,
                    c, a)
            }
        },
        onMouseWheel: function(a, b, c) {
            this.config.onMouseWheel(c, f.event.get(a, b))
        },
        onMouseDown: function(a, b, c) {
            var d = f.event.get(a, b);
            if (this.dom) {
                if (a = this.isLabel(a, b)) this.pressed = this.viz.graph.getNode(a.id)
            } else this.pressed = c.getNode() || this.config.enableForEdges && c.getEdge();
            this.pressed && this.config.onDragStart(this.pressed, c, d)
        },
        onTouchStart: function(a, b, c) {
            var d = f.event.get(a, b),
                e;
            (this.touched = this.dom && (e = this.isLabel(a, b)) ? this.viz.graph.getNode(e.id) : c.getNode() || this.config.enableForEdges &&
                c.getEdge()) && this.config.onTouchStart(this.touched, c, d)
        },
        onTouchMove: function(a, b, c) {
            a = f.event.get(a, b);
            if (this.touched) this.touchMoved = !0, this.config.onTouchMove(this.touched, c, a)
        },
        onTouchEnd: function(a, b, c) {
            a = f.event.get(a, b);
            if (this.touched) {
                if (this.touchMoved) this.config.onTouchEnd(this.touched, c, a);
                else this.config.onTouchCancel(this.touched, c, a);
                this.touched = this.touchMoved = !1
            }
        }
    });
    w.Classes.Tips = new i({
        Implements: [r, y],
        initializePost: function() {
            if (document.body) {
                var a = f("_tooltip") || document.createElement("div");
                a.id = "_tooltip";
                a.className = "tip";
                f.extend(a.style, {
                    position: "absolute",
                    display: "none",
                    zIndex: 13E3
                });
                document.body.appendChild(a);
                this.tip = a;
                this.node = !1
            }
        },
        setAsProperty: f.lambda(!0),
        onMouseOut: function(a, b) {
            f.event.get(a, b);
            if (this.dom && this.isLabel(a, b, !0)) this.hide(!0);
            else {
                for (var c = a.relatedTarget, d = this.canvas.getElement(); c && c.parentNode;) {
                    if (d == c.parentNode) return;
                    c = c.parentNode
                }
                this.hide(!1)
            }
        },
        onMouseOver: function(a, b) {
            var c;
            if (this.dom && (c = this.isLabel(a, b, !1))) this.node = this.viz.graph.getNode(c.id),
                this.config.onShow(this.tip, this.node, c)
        },
        onMouseMove: function(a, b, c) {
            this.dom && this.isLabel(a, b) && this.setTooltipPosition(f.event.getPos(a, b));
            if (!this.dom) {
                var d = c.getNode();
                if (d) {
                    if (this.config.force || !this.node || this.node.id != d.id) this.node = d, this.config.onShow(this.tip, d, c.getContains());
                    this.setTooltipPosition(f.event.getPos(a, b))
                } else this.hide(!0)
            }
        },
        setTooltipPosition: function(a) {
            var b = this.tip,
                c = b.style,
                d = this.config;
            c.display = "";
            var e = {
                    height: document.body.clientHeight,
                    width: document.body.clientWidth
                },
                b = {
                    width: b.offsetWidth,
                    height: b.offsetHeight
                },
                g = d.offsetX,
                d = d.offsetY;
            c.top = (a.y + d + b.height > e.height ? a.y - b.height - d : a.y + d) + "px";
            c.left = (a.x + b.width + g > e.width ? a.x - b.width - g : a.x + g) + "px"
        },
        hide: function(a) {
            this.tip.style.display = "none";
            a && this.config.onHide()
        }
    });
    w.Classes.NodeStyles = new i({
        Implements: [r, y],
        initializePost: function() {
            this.fx = this.viz.fx;
            this.types = this.viz.fx.nodeTypes;
            this.nStyles = this.config;
            this.nodeStylesOnHover = this.nStyles.stylesHover;
            this.nodeStylesOnClick = this.nStyles.stylesClick;
            this.hoveredNode = !1;
            this.fx.nodeFxAnimation = new B;
            this.move = this.down = !1
        },
        onMouseOut: function(a, b) {
            this.down = this.move = !1;
            if (this.hoveredNode) {
                this.dom && this.isLabel(a, b, !0) && this.toggleStylesOnHover(this.hoveredNode, !1);
                for (var c = a.relatedTarget, d = this.canvas.getElement(); c && c.parentNode;) {
                    if (d == c.parentNode) return;
                    c = c.parentNode
                }
                this.toggleStylesOnHover(this.hoveredNode, !1);
                this.hoveredNode = !1
            }
        },
        onMouseOver: function(a, b) {
            var c;
            if (this.dom && (c = this.isLabel(a, b, !0)))
                if (c = this.viz.graph.getNode(c.id), !c.selected) this.hoveredNode = c, this.toggleStylesOnHover(this.hoveredNode, !0)
        },
        onMouseDown: function(a, b, c, d) {
            if (!d) {
                var e;
                if (this.dom && (e = this.isLabel(a, b))) this.down = this.viz.graph.getNode(e.id);
                else if (!this.dom) this.down = c.getNode();
                this.move = !1
            }
        },
        onMouseUp: function(a, b, c, d) {
            if (!d) {
                if (!this.move) this.onClick(c.getNode());
                this.down = this.move = !1
            }
        },
        getRestoredStyles: function(a, b) {
            var c = {},
                d = this["nodeStylesOn" + b],
                e;
            for (e in d) c[e] = a.styles["$" + e];
            return c
        },
        toggleStylesOnHover: function(a, b) {
            this.nodeStylesOnHover &&
                this.toggleStylesOn("Hover", a, b)
        },
        toggleStylesOnClick: function(a, b) {
            this.nodeStylesOnClick && this.toggleStylesOn("Click", a, b)
        },
        toggleStylesOn: function(a, b, c) {
            var d = this.viz;
            if (c) {
                if (!b.styles) b.styles = f.merge(b.data, {});
                for (var e in this["nodeStylesOn" + a]) c = "$" + e, c in b.styles || (b.styles[c] = b.getData(e));
                d.fx.nodeFx(f.extend({
                    elements: {
                        id: b.id,
                        properties: this["nodeStylesOn" + a]
                    },
                    transition: v.Quart.easeOut,
                    duration: 300,
                    fps: 40
                }, this.config))
            } else a = this.getRestoredStyles(b, a), d.fx.nodeFx(f.extend({
                elements: {
                    id: b.id,
                    properties: a
                },
                transition: v.Quart.easeOut,
                duration: 300,
                fps: 40
            }, this.config))
        },
        onClick: function(a) {
            if (a) {
                var b = this.nodeStylesOnClick;
                if (b) a.selected ? (this.toggleStylesOnClick(a, !1), delete a.selected) : (this.viz.graph.eachNode(function(a) {
                    if (a.selected) {
                        for (var d in b) a.setData(d, a.styles["$" + d], "end");
                        delete a.selected
                    }
                }), this.toggleStylesOnClick(a, !0), a.selected = !0, delete a.hovered, this.hoveredNode = !1)
            }
        },
        onMouseMove: function(a, b, c) {
            if (this.down) this.move = !0;
            if (!this.dom || !this.isLabel(a, b)) {
                var d =
                    this.nodeStylesOnHover;
                if (d && !this.dom) {
                    if (this.hoveredNode && (a = this.types[this.hoveredNode.getData("type")]) && a.contains && a.contains.call(this.fx, this.hoveredNode, c.getPos())) return;
                    c = c.getNode();
                    if ((this.hoveredNode || c) && !c.hovered)
                        if (c && !c.selected) this.fx.nodeFxAnimation.stopTimer(), this.viz.graph.eachNode(function(a) {
                            if (a.hovered && !a.selected) {
                                for (var b in d) a.setData(b, a.styles["$" + b], "end");
                                delete a.hovered
                            }
                        }), c.hovered = !0, this.hoveredNode = c, this.toggleStylesOnHover(c, !0);
                        else if (this.hoveredNode &&
                        !this.hoveredNode.selected) this.fx.nodeFxAnimation.stopTimer(), this.toggleStylesOnHover(this.hoveredNode, !1), delete this.hoveredNode.hovered, this.hoveredNode = !1
                }
            }
        }
    });
    w.Classes.Navigation = new i({
        Implements: [r, y],
        initializePost: function() {
            this.pressed = this.pos = !1
        },
        onMouseWheel: function(a, b, c) {
            this.config.zooming && (f.event.stop(f.event.get(a, b)), a = 1 + c * (this.config.zooming / 1E3), this.canvas.scale(a, a))
        },
        onMouseDown: function(a, b, c) {
            if (this.config.panning && !(this.config.panning == "avoid nodes" && (this.dom ?
                    this.isLabel(a, b) : c.getNode()))) {
                this.pressed = !0;
                this.pos = c.getPos();
                var a = this.canvas,
                    b = a.translateOffsetX,
                    c = a.translateOffsetY,
                    d = a.scaleOffsetY;
                this.pos.x *= a.scaleOffsetX;
                this.pos.x += b;
                this.pos.y *= d;
                this.pos.y += c
            }
        },
        onMouseMove: function(a, b, c) {
            if (this.config.panning && this.pressed && !(this.config.panning == "avoid nodes" && (this.dom ? this.isLabel(a, b) : c.getNode()))) {
                var a = this.pos,
                    c = c.getPos(),
                    d = this.canvas,
                    e = d.translateOffsetX,
                    g = d.translateOffsetY,
                    b = d.scaleOffsetX,
                    d = d.scaleOffsetY;
                c.x *= b;
                c.y *= d;
                c.x +=
                    e;
                c.y += g;
                e = c.x - a.x;
                a = c.y - a.y;
                this.pos = c;
                this.canvas.translate(e * 1 / b, a * 1 / d)
            }
        },
        onMouseUp: function() {
            if (this.config.panning) this.pressed = !1
        }
    });
    var s;
    (function() {
        function a(a, b) {
            var g = document.createElement(a),
                h;
            for (h in b) typeof b[h] == "object" ? f.extend(g[h], b[h]) : g[h] = b[h];
            a == "canvas" && !c && G_vmlCanvasManager && (g = G_vmlCanvasManager.initElement(document.body.appendChild(g)));
            return g
        }
        var b = typeof HTMLCanvasElement,
            c = b == "object" || b == "function";
        $jit.Canvas = s = new i({
            canvases: [],
            pos: !1,
            element: !1,
            labelContainer: !1,
            translateOffsetX: 0,
            translateOffsetY: 0,
            scaleOffsetX: 1,
            scaleOffsetY: 1,
            initialize: function(b, c) {
                this.viz = b;
                this.opt = this.config = c;
                var g = f.type(c.injectInto) == "string" ? c.injectInto : c.injectInto.id,
                    h = c.type,
                    l = g + "-label",
                    j = f(g),
                    t = c.width || j.offsetWidth,
                    C = c.height || j.offsetHeight;
                this.id = g;
                var n = {
                    injectInto: g,
                    width: t,
                    height: C
                };
                this.element = a("div", {
                    id: g + "-canvaswidget",
                    style: {
                        position: "relative",
                        width: t + "px",
                        height: C + "px"
                    }
                });
                this.labelContainer = this.createLabelContainer(c.Label.type, l, n);
                this.canvases.push(new s.Base[h]({
                    config: f.extend({
                            idSuffix: "-canvas"
                        },
                        n),
                    plot: function() {
                        b.fx.plot()
                    },
                    resize: function() {
                        b.refresh()
                    }
                }));
                if (g = c.background) n = new s.Background[g.type](b, f.extend(g, n)), this.canvases.push(new s.Base[h](n));
                for (h = this.canvases.length; h--;) this.element.appendChild(this.canvases[h].canvas), h > 0 && this.canvases[h].plot();
                this.element.appendChild(this.labelContainer);
                j.appendChild(this.element);
                var i = null,
                    u = this;
                f.addEvent(window, "scroll", function() {
                    clearTimeout(i);
                    i = setTimeout(function() {
                        u.getPos(!0)
                    }, 500)
                })
            },
            getCtx: function(a) {
                return this.canvases[a ||
                    0].getCtx()
            },
            getConfig: function() {
                return this.opt
            },
            getElement: function() {
                return this.element
            },
            getSize: function(a) {
                return this.canvases[a || 0].getSize()
            },
            resize: function(a, b) {
                this.getPos(!0);
                this.translateOffsetX = this.translateOffsetY = 0;
                this.scaleOffsetX = this.scaleOffsetY = 1;
                for (var c = 0, h = this.canvases.length; c < h; c++) this.canvases[c].resize(a, b);
                c = this.element.style;
                c.width = a + "px";
                c.height = b + "px";
                if (this.labelContainer) this.labelContainer.style.width = a + "px"
            },
            translate: function(a, b, c) {
                this.translateOffsetX +=
                    a * this.scaleOffsetX;
                this.translateOffsetY += b * this.scaleOffsetY;
                for (var h = 0, f = this.canvases.length; h < f; h++) this.canvases[h].translate(a, b, c)
            },
            scale: function(a, b) {
                var c = this.scaleOffsetX * a,
                    h = this.scaleOffsetY * b,
                    f = this.translateOffsetX * (a - 1) / c,
                    j = this.translateOffsetY * (b - 1) / h;
                this.scaleOffsetX = c;
                this.scaleOffsetY = h;
                c = 0;
                for (h = this.canvases.length; c < h; c++) this.canvases[c].scale(a, b, !0);
                this.translate(f, j, !1)
            },
            getPos: function(a) {
                if (a || !this.pos) return this.pos = f.getPos(this.getElement());
                return this.pos
            },
            clear: function(a) {
                this.canvases[a || 0].clear()
            },
            path: function(a, b) {
                var c = this.canvases[0].getCtx();
                c.beginPath();
                b(c);
                c[a]();
                c.closePath()
            },
            createLabelContainer: function(b, c, g) {
                if (b == "HTML" || b == "Native") return a("div", {
                    id: c,
                    style: {
                        overflow: "visible",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: g.width + "px",
                        height: 0
                    }
                });
                else if (b == "SVG") {
                    b = document.createElementNS("http://www.w3.org/2000/svg", "svg:svg");
                    b.setAttribute("width", g.width);
                    b.setAttribute("height", g.height);
                    var h = b.style;
                    h.position = "absolute";
                    h.left =
                        h.top = "0px";
                    h = document.createElementNS("http://www.w3.org/2000/svg", "svg:g");
                    h.setAttribute("width", g.width);
                    h.setAttribute("height", g.height);
                    h.setAttribute("x", 0);
                    h.setAttribute("y", 0);
                    h.setAttribute("id", c);
                    b.appendChild(h);
                    return b
                }
            }
        });
        s.Base = {};
        s.Base["2D"] = new i({
            translateOffsetX: 0,
            translateOffsetY: 0,
            scaleOffsetX: 1,
            scaleOffsetY: 1,
            initialize: function(a) {
                this.viz = a;
                this.opt = a.config;
                this.size = !1;
                this.createCanvas();
                this.translateToCenter()
            },
            createCanvas: function() {
                var b = this.opt,
                    c = b.width,
                    g = b.height;
                this.canvas = a("canvas", {
                    id: b.injectInto + b.idSuffix,
                    width: c,
                    height: g,
                    style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: c + "px",
                        height: g + "px"
                    }
                })
            },
            getCtx: function() {
                if (!this.ctx) return this.ctx = this.canvas.getContext("2d");
                return this.ctx
            },
            getSize: function() {
                if (this.size) return this.size;
                var a = this.canvas;
                return this.size = {
                    width: a.width,
                    height: a.height
                }
            },
            translateToCenter: function(a) {
                var b = this.getSize(),
                    c = a ? b.width - a.width - this.translateOffsetX * 2 : b.width;
                height = a ? b.height - a.height - this.translateOffsetY *
                    2 : b.height;
                b = this.getCtx();
                a && b.scale(1 / this.scaleOffsetX, 1 / this.scaleOffsetY);
                b.translate(c / 2, height / 2)
            },
            resize: function(a, b) {
                var g = this.getSize(),
                    h = this.canvas,
                    f = h.style;
                this.size = !1;
                h.width = a;
                h.height = b;
                f.width = a + "px";
                f.height = b + "px";
                c ? this.translateToCenter() : this.translateToCenter(g);
                this.translateOffsetX = this.translateOffsetY = 0;
                this.scaleOffsetX = this.scaleOffsetY = 1;
                this.clear();
                this.viz.resize(a, b, this)
            },
            translate: function(a, b, c) {
                var h = this.scaleOffsetY;
                this.translateOffsetX += a * this.scaleOffsetX;
                this.translateOffsetY += b * h;
                this.getCtx().translate(a, b);
                !c && this.plot()
            },
            scale: function(a, b, c) {
                this.scaleOffsetX *= a;
                this.scaleOffsetY *= b;
                this.getCtx().scale(a, b);
                !c && this.plot()
            },
            clear: function() {
                var a = this.getSize(),
                    b = this.translateOffsetX,
                    c = this.translateOffsetY,
                    h = this.scaleOffsetX,
                    f = this.scaleOffsetY;
                this.getCtx().clearRect((-a.width / 2 - b) * 1 / h, (-a.height / 2 - c) * 1 / f, a.width * 1 / h, a.height * 1 / f)
            },
            plot: function() {
                this.clear();
                this.viz.plot(this)
            }
        });
        s.Background = {};
        s.Background.Circles = new i({
            initialize: function(a,
                b) {
                this.viz = a;
                this.config = f.merge({
                    idSuffix: "-bkcanvas",
                    levelDistance: 100,
                    numberOfCircles: 6,
                    CanvasStyles: {},
                    offset: 0
                }, b)
            },
            resize: function(a, b, c) {
                this.plot(c)
            },
            plot: function(a) {
                var a = a.getCtx(),
                    b = this.config,
                    c = b.CanvasStyles,
                    h;
                for (h in c) a[h] = c[h];
                h = b.numberOfCircles;
                b = b.levelDistance;
                for (c = 1; c <= h; c++) a.beginPath(), a.arc(0, 0, b * c, 0, 2 * Math.PI, !1), a.stroke(), a.closePath()
            }
        })
    })();
    var q = function(a, b) {
        this.theta = a || 0;
        this.rho = b || 0
    };
    $jit.Polar = q;
    q.prototype = {
        getc: function(a) {
            return this.toComplex(a)
        },
        getp: function() {
            return this
        },
        set: function(a) {
            a = a.getp();
            this.theta = a.theta;
            this.rho = a.rho
        },
        setc: function(a, b) {
            this.rho = Math.sqrt(a * a + b * b);
            this.theta = Math.atan2(b, a);
            this.theta < 0 && (this.theta += Math.PI * 2)
        },
        setp: function(a, b) {
            this.theta = a;
            this.rho = b
        },
        clone: function() {
            return new q(this.theta, this.rho)
        },
        toComplex: function(a) {
            var b = Math.cos(this.theta) * this.rho,
                c = Math.sin(this.theta) * this.rho;
            if (a) return {
                x: b,
                y: c
            };
            return new m(b, c)
        },
        add: function(a) {
            return new q(this.theta + a.theta, this.rho + a.rho)
        },
        scale: function(a) {
            return new q(this.theta,
                this.rho * a)
        },
        equals: function(a) {
            return this.theta == a.theta && this.rho == a.rho
        },
        $add: function(a) {
            this.theta += a.theta;
            this.rho += a.rho;
            return this
        },
        $madd: function(a) {
            this.theta = (this.theta + a.theta) % (Math.PI * 2);
            this.rho += a.rho;
            return this
        },
        $scale: function(a) {
            this.rho *= a;
            return this
        },
        isZero: function() {
            var a = Math.abs;
            return a(this.theta) < 1.0E-4 && a(this.rho) < 1.0E-4
        },
        interpolate: function(a, b) {
            var c = Math.PI,
                d = c * 2,
                e = function(a) {
                    return a < 0 ? a % d + d : a % d
                },
                g = this.theta,
                h = a.theta,
                f = Math.abs(g - h);
            return {
                theta: f == c ? g >
                    h ? e(h + (g - d - h) * b) : e(h - d + (g - h) * b) : f >= c ? g > h ? e(h + (g - d - h) * b) : e(h - d + (g - (h - d)) * b) : e(h + (g - h) * b),
                rho: (this.rho - a.rho) * b + a.rho
            }
        }
    };
    q.KER = new q(0, 0);
    var m = function(a, b) {
        this.x = a || 0;
        this.y = b || 0
    };
    $jit.Complex = m;
    m.prototype = {
        getc: function() {
            return this
        },
        getp: function(a) {
            return this.toPolar(a)
        },
        set: function(a) {
            a = a.getc(!0);
            this.x = a.x;
            this.y = a.y
        },
        setc: function(a, b) {
            this.x = a;
            this.y = b
        },
        setp: function(a, b) {
            this.x = Math.cos(a) * b;
            this.y = Math.sin(a) * b
        },
        clone: function() {
            return new m(this.x, this.y)
        },
        toPolar: function(a) {
            var b =
                this.norm(),
                c = Math.atan2(this.y, this.x);
            c < 0 && (c += Math.PI * 2);
            if (a) return {
                theta: c,
                rho: b
            };
            return new q(c, b)
        },
        norm: function() {
            return Math.sqrt(this.squaredNorm())
        },
        squaredNorm: function() {
            return this.x * this.x + this.y * this.y
        },
        add: function(a) {
            return new m(this.x + a.x, this.y + a.y)
        },
        prod: function(a) {
            return new m(this.x * a.x - this.y * a.y, this.y * a.x + this.x * a.y)
        },
        conjugate: function() {
            return new m(this.x, -this.y)
        },
        scale: function(a) {
            return new m(this.x * a, this.y * a)
        },
        equals: function(a) {
            return this.x == a.x && this.y == a.y
        },
        $add: function(a) {
            this.x += a.x;
            this.y += a.y;
            return this
        },
        $prod: function(a) {
            var b = this.x,
                c = this.y;
            this.x = b * a.x - c * a.y;
            this.y = c * a.x + b * a.y;
            return this
        },
        $conjugate: function() {
            this.y = -this.y;
            return this
        },
        $scale: function(a) {
            this.x *= a;
            this.y *= a;
            return this
        },
        $div: function(a) {
            var b = this.x,
                c = this.y,
                d = a.squaredNorm();
            this.x = b * a.x + c * a.y;
            this.y = c * a.x - b * a.y;
            return this.$scale(1 / d)
        },
        isZero: function() {
            var a = Math.abs;
            return a(this.x) < 1.0E-4 && a(this.y) < 1.0E-4
        }
    };
    m.KER = new m(0, 0);
    $jit.Graph = new i({
        initialize: function(a,
            b, c, d) {
            var e = {
                klass: m,
                Node: {}
            };
            this.Node = b;
            this.Edge = c;
            this.Label = d;
            this.opt = f.merge(e, a || {});
            this.nodes = {};
            this.edges = {};
            var g = this;
            this.nodeList = {};
            for (var h in z) g.nodeList[h] = function(a) {
                return function() {
                    var b = Array.prototype.slice.call(arguments);
                    g.eachNode(function(c) {
                        c[a].apply(c, b)
                    })
                }
            }(h)
        },
        getNode: function(a) {
            if (this.hasNode(a)) return this.nodes[a];
            return !1
        },
        get: function(a) {
            return this.getNode(a)
        },
        getByName: function(a) {
            for (var b in this.nodes) {
                var c = this.nodes[b];
                if (c.name == a) return c
            }
            return !1
        },
        getAdjacence: function(a, b) {
            if (a in this.edges) return this.edges[a][b];
            return !1
        },
        addNode: function(a) {
            if (!this.nodes[a.id]) {
                var b = this.edges[a.id] = {};
                this.nodes[a.id] = new k.Node(f.extend({
                    id: a.id,
                    name: a.name,
                    data: f.merge(a.data || {}, {}),
                    adjacencies: b
                }, this.opt.Node), this.opt.klass, this.Node, this.Edge, this.Label)
            }
            return this.nodes[a.id]
        },
        addAdjacence: function(a, b, c) {
            this.hasNode(a.id) || this.addNode(a);
            this.hasNode(b.id) || this.addNode(b);
            a = this.nodes[a.id];
            b = this.nodes[b.id];
            if (!a.adjacentTo(b)) {
                var d =
                    this.edges[a.id] = this.edges[a.id] || {},
                    e = this.edges[b.id] = this.edges[b.id] || {};
                d[b.id] = e[a.id] = new k.Adjacence(a, b, c, this.Edge, this.Label);
                return d[b.id]
            }
            return this.edges[a.id][b.id]
        },
        removeNode: function(a) {
            if (this.hasNode(a)) {
                delete this.nodes[a];
                var b = this.edges[a],
                    c;
                for (c in b) delete this.edges[c][a];
                delete this.edges[a]
            }
        },
        removeAdjacence: function(a, b) {
            delete this.edges[a][b];
            delete this.edges[b][a]
        },
        hasNode: function(a) {
            return a in this.nodes
        },
        empty: function() {
            this.nodes = {};
            this.edges = {}
        }
    });
    var k =
        $jit.Graph,
        z;
    (function() {
        var a = function(a, b, c, h, f) {
                var j, c = c || "current";
                if (c == "current") j = this.data;
                else if (c == "start") j = this.startData;
                else if (c == "end") j = this.endData;
                a = "$" + (a ? a + "-" : "") + b;
                if (h) return j[a];
                if (!this.Config.overridable) return f[b] || 0;
                return a in j ? j[a] : a in this.data ? this.data[a] : f[b] || 0
            },
            b = function(a, b, c, h) {
                var h = h || "current",
                    f;
                if (h == "current") f = this.data;
                else if (h == "start") f = this.startData;
                else if (h == "end") f = this.endData;
                f["$" + (a ? a + "-" : "") + b] = c
            },
            c = function(a, b) {
                var a = "$" + (a ? a + "-" :
                        ""),
                    c = this;
                f.each(b, function(b) {
                    b = a + b;
                    delete c.data[b];
                    delete c.endData[b];
                    delete c.startData[b]
                })
            };
        z = {
            getData: function(b, c, g) {
                return a.call(this, "", b, c, g, this.Config)
            },
            setData: function(a, c, g) {
                b.call(this, "", a, c, g)
            },
            setDataset: function(a, b) {
                var a = f.splat(a),
                    c;
                for (c in b)
                    for (var h = 0, l = f.splat(b[c]), j = a.length; h < j; h++) this.setData(c, l[h], a[h])
            },
            removeData: function() {
                c.call(this, "", Array.prototype.slice.call(arguments))
            },
            getCanvasStyle: function(b, c, g) {
                return a.call(this, "canvas", b, c, g, this.Config.CanvasStyles)
            },
            setCanvasStyle: function(a, c, g) {
                b.call(this, "canvas", a, c, g)
            },
            setCanvasStyles: function(a, b) {
                var a = f.splat(a),
                    c;
                for (c in b)
                    for (var h = 0, l = f.splat(b[c]), j = a.length; h < j; h++) this.setCanvasStyle(c, l[h], a[h])
            },
            removeCanvasStyle: function() {
                c.call(this, "canvas", Array.prototype.slice.call(arguments))
            },
            getLabelData: function(b, c, g) {
                return a.call(this, "label", b, c, g, this.Label)
            },
            setLabelData: function(a, c, g) {
                b.call(this, "label", a, c, g)
            },
            setLabelDataset: function(a, b) {
                var a = f.splat(a),
                    c;
                for (c in b)
                    for (var h = 0, l = f.splat(b[c]),
                            j = a.length; h < j; h++) this.setLabelData(c, l[h], a[h])
            },
            removeLabelData: function() {
                c.call(this, "label", Array.prototype.slice.call(arguments))
            }
        }
    })();
    k.Node = new i({
        initialize: function(a, b, c, d, e) {
            b = {
                id: "",
                name: "",
                data: {},
                startData: {},
                endData: {},
                adjacencies: {},
                selected: !1,
                drawn: !1,
                exist: !1,
                angleSpan: {
                    begin: 0,
                    end: 0
                },
                pos: new b,
                startPos: new b,
                endPos: new b
            };
            f.extend(this, f.extend(b, a));
            this.Config = this.Node = c;
            this.Edge = d;
            this.Label = e
        },
        adjacentTo: function(a) {
            return a.id in this.adjacencies
        },
        getAdjacency: function(a) {
            return this.adjacencies[a]
        },
        getPos: function(a) {
            a = a || "current";
            if (a == "current") return this.pos;
            else if (a == "end") return this.endPos;
            else if (a == "start") return this.startPos
        },
        setPos: function(a, b) {
            var b = b || "current",
                c;
            if (b == "current") c = this.pos;
            else if (b == "end") c = this.endPos;
            else if (b == "start") c = this.startPos;
            c.set(a)
        }
    });
    k.Node.implement(z);
    k.Adjacence = new i({
        initialize: function(a, b, c, d, e) {
            this.nodeFrom = a;
            this.nodeTo = b;
            this.data = c || {};
            this.startData = {};
            this.endData = {};
            this.Config = this.Edge = d;
            this.Label = e
        }
    });
    k.Adjacence.implement(z);
    k.Util = {
        filter: function(a) {
            if (!a || f.type(a) != "string") return function() {
                return !0
            };
            var b = a.split(" ");
            return function(a) {
                for (var d = 0; d < b.length; d++)
                    if (a[b[d]]) return !1;
                return !0
            }
        },
        getNode: function(a, b) {
            return a.nodes[b]
        },
        eachNode: function(a, b, c) {
            var c = this.filter(c),
                d;
            for (d in a.nodes) c(a.nodes[d]) && b(a.nodes[d])
        },
        each: function(a, b, c) {
            this.eachNode(a, b, c)
        },
        eachAdjacency: function(a, b, c) {
            var d = a.adjacencies,
                c = this.filter(c),
                e;
            for (e in d) {
                var g = d[e];
                if (c(g)) {
                    if (g.nodeFrom != a) {
                        var h = g.nodeFrom;
                        g.nodeFrom =
                            g.nodeTo;
                        g.nodeTo = h
                    }
                    b(g, e)
                }
            }
        },
        computeLevels: function(a, b, c, d) {
            var c = c || 0,
                e = this.filter(d);
            this.eachNode(a, function(a) {
                a._flag = !1;
                a._depth = -1
            }, d);
            a = a.getNode(b);
            a._depth = c;
            for (var g = [a]; g.length != 0;) {
                var h = g.pop();
                h._flag = !0;
                this.eachAdjacency(h, function(a) {
                    a = a.nodeTo;
                    if (a._flag == !1 && e(a)) {
                        if (a._depth < 0) a._depth = h._depth + 1 + c;
                        g.unshift(a)
                    }
                }, d)
            }
        },
        eachBFS: function(a, b, c, d) {
            var e = this.filter(d);
            this.clean(a);
            for (var g = [a.getNode(b)]; g.length != 0;) a = g.pop(), a._flag = !0, c(a, a._depth), this.eachAdjacency(a,
                function(a) {
                    a = a.nodeTo;
                    if (a._flag == !1 && e(a)) a._flag = !0, g.unshift(a)
                }, d)
        },
        eachLevel: function(a, b, c, d, e) {
            var g = a._depth,
                h = this.filter(e),
                f = this,
                c = c === !1 ? Number.MAX_VALUE - g : c;
            (function t(a, b, c) {
                var e = a._depth;
                e >= b && e <= c && h(a) && d(a, e);
                e < c && f.eachAdjacency(a, function(a) {
                    a = a.nodeTo;
                    a._depth > e && t(a, b, c)
                })
            })(a, b + g, c + g)
        },
        eachSubgraph: function(a, b, c) {
            this.eachLevel(a, 0, !1, b, c)
        },
        eachSubnode: function(a, b, c) {
            this.eachLevel(a, 1, 1, b, c)
        },
        anySubnode: function(a, b, c) {
            var d = !1,
                b = b || f.lambda(!0),
                e = f.type(b) == "string" ?
                function(a) {
                    return a[b]
                } : b;
            this.eachSubnode(a, function(a) {
                e(a) && (d = !0)
            }, c);
            return d
        },
        getSubnodes: function(a, b, c) {
            var d = [],
                b = b || 0,
                e;
            f.type(b) == "array" ? (e = b[0], b = b[1]) : (e = b, b = Number.MAX_VALUE - a._depth);
            this.eachLevel(a, e, b, function(a) {
                d.push(a)
            }, c);
            return d
        },
        getParents: function(a) {
            var b = [];
            this.eachAdjacency(a, function(c) {
                c = c.nodeTo;
                c._depth < a._depth && b.push(c)
            });
            return b
        },
        isDescendantOf: function(a, b) {
            if (a.id == b) return !0;
            for (var c = this.getParents(a), d = !1, e = 0; !d && e < c.length; e++) d = d || this.isDescendantOf(c[e],
                b);
            return d
        },
        clean: function(a) {
            this.eachNode(a, function(a) {
                a._flag = !1
            })
        },
        getClosestNodeToOrigin: function(a, b, c) {
            return this.getClosestNodeToPos(a, q.KER, b, c)
        },
        getClosestNodeToPos: function(a, b, c, d) {
            var e = null,
                c = c || "current",
                b = b && b.getc(!0) || m.KER,
                g = function(a, b) {
                    var c = a.x - b.x,
                        d = a.y - b.y;
                    return c * c + d * d
                };
            this.eachNode(a, function(a) {
                e = e == null || g(a.getPos(c).getc(!0), b) < g(e.getPos(c).getc(!0), b) ? a : e
            }, d);
            return e
        }
    };
    f.each(["get", "getNode", "each", "eachNode", "computeLevels", "eachBFS", "clean", "getClosestNodeToPos",
        "getClosestNodeToOrigin"
    ], function(a) {
        k.prototype[a] = function() {
            return k.Util[a].apply(k.Util, [this].concat(Array.prototype.slice.call(arguments)))
        }
    });
    f.each(["eachAdjacency", "eachLevel", "eachSubgraph", "eachSubnode", "anySubnode", "getSubnodes", "getParents", "isDescendantOf"], function(a) {
        k.Node.prototype[a] = function() {
            return k.Util[a].apply(k.Util, [this].concat(Array.prototype.slice.call(arguments)))
        }
    });
    k.Op = {
        options: {
            type: "nothing",
            duration: 2E3,
            hideLabels: !0,
            fps: 30
        },
        initialize: function(a) {
            this.viz =
                a
        },
        removeNode: function(a, b) {
            var c = this.viz,
                d = f.merge(this.options, c.controller, b),
                e = f.splat(a),
                g, h, l;
            switch (d.type) {
                case "nothing":
                    for (g = 0; g < e.length; g++) c.graph.removeNode(e[g]);
                    break;
                case "replot":
                    this.removeNode(e, {
                        type: "nothing"
                    });
                    c.labels.clearLabels();
                    c.refresh(!0);
                    break;
                case "fade:seq":
                case "fade":
                    h = this;
                    for (g = 0; g < e.length; g++) l = c.graph.getNode(e[g]), l.setData("alpha", 0, "end");
                    c.fx.animate(f.merge(d, {
                        modes: ["node-property:alpha"],
                        onComplete: function() {
                            h.removeNode(e, {
                                type: "nothing"
                            });
                            c.labels.clearLabels();
                            c.reposition();
                            c.fx.animate(f.merge(d, {
                                modes: ["linear"]
                            }))
                        }
                    }));
                    break;
                case "fade:con":
                    h = this;
                    for (g = 0; g < e.length; g++) l = c.graph.getNode(e[g]), l.setData("alpha", 0, "end"), l.ignore = !0;
                    c.reposition();
                    c.fx.animate(f.merge(d, {
                        modes: ["node-property:alpha", "linear"],
                        onComplete: function() {
                            h.removeNode(e, {
                                type: "nothing"
                            });
                            d.onComplete && d.onComplete()
                        }
                    }));
                    break;
                case "iter":
                    h = this;
                    c.fx.sequence({
                        condition: function() {
                            return e.length != 0
                        },
                        step: function() {
                            h.removeNode(e.shift(), {
                                type: "nothing"
                            });
                            c.labels.clearLabels()
                        },
                        onComplete: function() {
                            d.onComplete && d.onComplete()
                        },
                        duration: Math.ceil(d.duration / e.length)
                    });
                    break;
                default:
                    this.doError()
            }
        },
        removeEdge: function(a, b) {
            var c = this.viz,
                d = f.merge(this.options, c.controller, b),
                e = f.type(a[0]) == "string" ? [a] : a,
                g, h, l;
            switch (d.type) {
                case "nothing":
                    for (g = 0; g < e.length; g++) c.graph.removeAdjacence(e[g][0], e[g][1]);
                    break;
                case "replot":
                    this.removeEdge(e, {
                        type: "nothing"
                    });
                    c.refresh(!0);
                    break;
                case "fade:seq":
                case "fade":
                    h = this;
                    for (g = 0; g < e.length; g++)(l = c.graph.getAdjacence(e[g][0],
                        e[g][1])) && l.setData("alpha", 0, "end");
                    c.fx.animate(f.merge(d, {
                        modes: ["edge-property:alpha"],
                        onComplete: function() {
                            h.removeEdge(e, {
                                type: "nothing"
                            });
                            c.reposition();
                            c.fx.animate(f.merge(d, {
                                modes: ["linear"]
                            }))
                        }
                    }));
                    break;
                case "fade:con":
                    h = this;
                    for (g = 0; g < e.length; g++)
                        if (l = c.graph.getAdjacence(e[g][0], e[g][1])) l.setData("alpha", 0, "end"), l.ignore = !0;
                    c.reposition();
                    c.fx.animate(f.merge(d, {
                        modes: ["edge-property:alpha", "linear"],
                        onComplete: function() {
                            h.removeEdge(e, {
                                type: "nothing"
                            });
                            d.onComplete && d.onComplete()
                        }
                    }));
                    break;
                case "iter":
                    h = this;
                    c.fx.sequence({
                        condition: function() {
                            return e.length != 0
                        },
                        step: function() {
                            h.removeEdge(e.shift(), {
                                type: "nothing"
                            });
                            c.labels.clearLabels()
                        },
                        onComplete: function() {
                            d.onComplete()
                        },
                        duration: Math.ceil(d.duration / e.length)
                    });
                    break;
                default:
                    this.doError()
            }
        },
        sum: function(a, b) {
            var c = this.viz,
                d = f.merge(this.options, c.controller, b),
                e = c.root,
                g;
            c.root = b.id || c.root;
            switch (d.type) {
                case "nothing":
                    g = c.construct(a);
                    g.eachNode(function(a) {
                        a.eachAdjacency(function(a) {
                            c.graph.addAdjacence(a.nodeFrom,
                                a.nodeTo, a.data)
                        })
                    });
                    break;
                case "replot":
                    c.refresh(!0);
                    this.sum(a, {
                        type: "nothing"
                    });
                    c.refresh(!0);
                    break;
                case "fade:seq":
                case "fade":
                case "fade:con":
                    that = this;
                    g = c.construct(a);
                    var h = !this.preprocessSum(g) ? ["node-property:alpha"] : ["node-property:alpha", "edge-property:alpha"];
                    c.reposition();
                    d.type != "fade:con" ? c.fx.animate(f.merge(d, {
                        modes: ["linear"],
                        onComplete: function() {
                            c.fx.animate(f.merge(d, {
                                modes: h,
                                onComplete: function() {
                                    d.onComplete()
                                }
                            }))
                        }
                    })) : (c.graph.eachNode(function(a) {
                        a.id != e && a.pos.isZero() &&
                            (a.pos.set(a.endPos), a.startPos.set(a.endPos))
                    }), c.fx.animate(f.merge(d, {
                        modes: ["linear"].concat(h)
                    })));
                    break;
                default:
                    this.doError()
            }
        },
        morph: function(a, b, c) {
            var c = c || {},
                d = this.viz,
                e = f.merge(this.options, d.controller, b),
                g = d.root,
                h;
            d.root = b.id || d.root;
            switch (e.type) {
                case "nothing":
                    h = d.construct(a);
                    h.eachNode(function(a) {
                        var b = d.graph.hasNode(a.id);
                        a.eachAdjacency(function(a) {
                            var b = !!d.graph.getAdjacence(a.nodeFrom.id, a.nodeTo.id);
                            d.graph.addAdjacence(a.nodeFrom, a.nodeTo, a.data);
                            if (b) {
                                var b = d.graph.getAdjacence(a.nodeFrom.id,
                                        a.nodeTo.id),
                                    c;
                                for (c in a.data || {}) b.data[c] = a.data[c]
                            }
                        });
                        if (b) {
                            var b = d.graph.getNode(a.id),
                                c;
                            for (c in a.data || {}) b.data[c] = a.data[c]
                        }
                    });
                    d.graph.eachNode(function(a) {
                        a.eachAdjacency(function(a) {
                            h.getAdjacence(a.nodeFrom.id, a.nodeTo.id) || d.graph.removeAdjacence(a.nodeFrom.id, a.nodeTo.id)
                        });
                        h.hasNode(a.id) || d.graph.removeNode(a.id)
                    });
                    break;
                case "replot":
                    d.labels.clearLabels(!0);
                    this.morph(a, {
                        type: "nothing"
                    });
                    d.refresh(!0);
                    d.refresh(!0);
                    break;
                case "fade:seq":
                case "fade":
                case "fade:con":
                    that = this;
                    h = d.construct(a);
                    var l = "node-property" in c && f.map(f.splat(c["node-property"]), function(a) {
                        return "$" + a
                    });
                    d.graph.eachNode(function(a) {
                        var b = h.getNode(a.id);
                        if (b) {
                            var b = b.data,
                                c;
                            for (c in b) l && f.indexOf(l, c) > -1 ? a.endData[c] = b[c] : a.data[c] = b[c]
                        } else a.setData("alpha", 1), a.setData("alpha", 1, "start"), a.setData("alpha", 0, "end"), a.ignore = !0
                    });
                    d.graph.eachNode(function(a) {
                        a.ignore || a.eachAdjacency(function(a) {
                            if (!a.nodeFrom.ignore && !a.nodeTo.ignore) {
                                var b = h.getNode(a.nodeFrom.id),
                                    a = h.getNode(a.nodeTo.id);
                                b.adjacentTo(a) ||
                                    (a = d.graph.getAdjacence(b.id, a.id), j = !0, a.setData("alpha", 1), a.setData("alpha", 1, "start"), a.setData("alpha", 0, "end"))
                            }
                        })
                    });
                    var j = this.preprocessSum(h),
                        a = !j ? ["node-property:alpha"] : ["node-property:alpha", "edge-property:alpha"];
                    a[0] += "node-property" in c ? ":" + f.splat(c["node-property"]).join(":") : "";
                    a[1] = (a[1] || "edge-property:alpha") + ("edge-property" in c ? ":" + f.splat(c["edge-property"]).join(":") : "");
                    "label-property" in c && a.push("label-property:" + f.splat(c["label-property"]).join(":"));
                    d.reposition ? d.reposition() :
                        d.compute("end");
                    d.graph.eachNode(function(a) {
                        a.id != g && a.pos.getp().equals(q.KER) && (a.pos.set(a.endPos), a.startPos.set(a.endPos))
                    });
                    d.fx.animate(f.merge(e, {
                        modes: [c.position || "polar"].concat(a),
                        onComplete: function() {
                            d.graph.eachNode(function(a) {
                                a.ignore && d.graph.removeNode(a.id)
                            });
                            d.graph.eachNode(function(a) {
                                a.eachAdjacency(function(a) {
                                    a.ignore && d.graph.removeAdjacence(a.nodeFrom.id, a.nodeTo.id)
                                })
                            });
                            e.onComplete()
                        }
                    }))
            }
        },
        contract: function(a, b) {
            var c = this.viz;
            if (!a.collapsed && a.anySubnode(f.lambda(!0))) b =
                f.merge(this.options, c.config, b || {}, {
                    modes: ["node-property:alpha:span", "linear"]
                }), a.collapsed = !0,
                function e(a) {
                    a.eachSubnode(function(a) {
                        a.ignore = !0;
                        a.setData("alpha", 0, b.type == "animate" ? "end" : "current");
                        e(a)
                    })
                }(a), b.type == "animate" ? (c.compute("end"), c.rotated && c.rotate(c.rotated, "none", {
                    property: "end"
                }), function g(b) {
                    b.eachSubnode(function(b) {
                        b.setPos(a.getPos("end"), "end");
                        g(b)
                    })
                }(a), c.fx.animate(b)) : b.type == "replot" && c.refresh()
        },
        expand: function(a, b) {
            if ("collapsed" in a) {
                var c = this.viz,
                    b = f.merge(this.options,
                        c.config, b || {}, {
                            modes: ["node-property:alpha:span", "linear"]
                        });
                delete a.collapsed;
                (function e(a) {
                    a.eachSubnode(function(a) {
                        delete a.ignore;
                        a.setData("alpha", 1, b.type == "animate" ? "end" : "current");
                        e(a)
                    })
                })(a);
                b.type == "animate" ? (c.compute("end"), c.rotated && c.rotate(c.rotated, "none", {
                    property: "end"
                }), c.fx.animate(b)) : b.type == "replot" && c.refresh()
            }
        },
        preprocessSum: function(a) {
            var b = this.viz;
            a.eachNode(function(a) {
                b.graph.hasNode(a.id) || (b.graph.addNode(a), a = b.graph.getNode(a.id), a.setData("alpha", 0), a.setData("alpha",
                    0, "start"), a.setData("alpha", 1, "end"))
            });
            var c = !1;
            a.eachNode(function(a) {
                a.eachAdjacency(function(a) {
                    var d = b.graph.getNode(a.nodeFrom.id),
                        h = b.graph.getNode(a.nodeTo.id);
                    d.adjacentTo(h) || (a = b.graph.addAdjacence(d, h, a.data), d.startAlpha == d.endAlpha && h.startAlpha == h.endAlpha && (c = !0, a.setData("alpha", 0), a.setData("alpha", 0, "start"), a.setData("alpha", 1, "end")))
                })
            });
            return c
        }
    };
    var A = {
            none: {
                render: f.empty,
                contains: f.lambda(!1)
            },
            circle: {
                render: function(a, b, c, d) {
                    d = d.getCtx();
                    d.beginPath();
                    d.arc(b.x, b.y, c,
                        0, Math.PI * 2, !0);
                    d.closePath();
                    d[a]()
                },
                contains: function(a, b, c) {
                    var d = a.x - b.x,
                        a = a.y - b.y;
                    return d * d + a * a <= c * c
                }
            },
            ellipse: {
                render: function(a, b, c, d, e) {
                    var e = e.getCtx(),
                        g = 1,
                        h = 1,
                        f = 1,
                        j = 1,
                        t = 0;
                    c > d ? (t = c / 2, h = d / c, j = c / d) : (t = d / 2, g = c / d, f = d / c);
                    e.save();
                    e.scale(g, h);
                    e.beginPath();
                    e.arc(b.x * f, b.y * j, t, 0, Math.PI * 2, !0);
                    e.closePath();
                    e[a]();
                    e.restore()
                },
                contains: function(a, b, c, d) {
                    var e = 0,
                        g = 1,
                        h = 1,
                        f = 0,
                        j = 0,
                        e = 0;
                    c > d ? (e = c / 2, h = d / c) : (e = d / 2, g = c / d);
                    f = (a.x - b.x) * (1 / g);
                    j = (a.y - b.y) * (1 / h);
                    return f * f + j * j <= e * e
                }
            },
            square: {
                render: function(a,
                    b, c, d) {
                    d.getCtx()[a + "Rect"](b.x - c, b.y - c, 2 * c, 2 * c)
                },
                contains: function(a, b, c) {
                    return Math.abs(b.x - a.x) <= c && Math.abs(b.y - a.y) <= c
                }
            },
            rectangle: {
                render: function(a, b, c, d, e) {
                    e.getCtx()[a + "Rect"](b.x - c / 2, b.y - d / 2, c, d)
                },
                contains: function(a, b, c, d) {
                    return Math.abs(b.x - a.x) <= c / 2 && Math.abs(b.y - a.y) <= d / 2
                }
            },
            triangle: {
                render: function(a, b, c, d) {
                    var d = d.getCtx(),
                        e = b.x,
                        g = b.y - c,
                        f = e - c,
                        b = b.y + c,
                        c = e + c;
                    d.beginPath();
                    d.moveTo(e, g);
                    d.lineTo(f, b);
                    d.lineTo(c, b);
                    d.closePath();
                    d[a]()
                },
                contains: function(a, b, c) {
                    return A.circle.contains(a,
                        b, c)
                }
            },
            star: {
                render: function(a, b, c, d) {
                    var d = d.getCtx(),
                        e = Math.PI / 5;
                    d.save();
                    d.translate(b.x, b.y);
                    d.beginPath();
                    d.moveTo(c, 0);
                    for (b = 0; b < 9; b++) d.rotate(e), b % 2 == 0 ? d.lineTo(c / 0.525731 * 0.200811, 0) : d.lineTo(c, 0);
                    d.closePath();
                    d[a]();
                    d.restore()
                },
                contains: function(a, b, c) {
                    return A.circle.contains(a, b, c)
                }
            }
        },
        D = {
            line: {
                render: function(a, b, c) {
                    c = c.getCtx();
                    c.beginPath();
                    c.moveTo(a.x, a.y);
                    c.lineTo(b.x, b.y);
                    c.stroke()
                },
                contains: function(a, b, c, d) {
                    var e = Math.min,
                        g = Math.max,
                        f = e(a.x, b.x),
                        l = g(a.x, b.x),
                        e = e(a.y, b.y),
                        g =
                        g(a.y, b.y);
                    if (c.x >= f && c.x <= l && c.y >= e && c.y <= g) {
                        if (Math.abs(b.x - a.x) <= d) return !0;
                        return Math.abs((b.y - a.y) / (b.x - a.x) * (c.x - a.x) + a.y - c.y) <= d
                    }
                    return !1
                }
            },
            arrow: {
                render: function(a, b, c, d, e) {
                    e = e.getCtx();
                    d && (d = a, a = b, b = d);
                    d = new m(b.x - a.x, b.y - a.y);
                    d.$scale(c / d.norm());
                    var c = new m(b.x - d.x, b.y - d.y),
                        g = new m(-d.y / 2, d.x / 2),
                        d = c.add(g),
                        c = c.$add(g.$scale(-1));
                    e.beginPath();
                    e.moveTo(a.x, a.y);
                    e.lineTo(b.x, b.y);
                    e.stroke();
                    e.beginPath();
                    e.moveTo(d.x, d.y);
                    e.lineTo(c.x, c.y);
                    e.lineTo(b.x, b.y);
                    e.closePath();
                    e.fill()
                },
                contains: function(a,
                    b, c, d) {
                    return D.line.contains(a, b, c, d)
                }
            },
            hyperline: {
                render: function(a, b, c, d) {
                    function e(a, b) {
                        return a < b ? a + Math.PI > b ? !1 : !0 : b + Math.PI > a ? !0 : !1
                    }
                    var d = d.getCtx(),
                        g = function(a, b) {
                            var c = a.x * b.y - a.y * b.x,
                                d = a.squaredNorm(),
                                e = b.squaredNorm();
                            if (c == 0) return {
                                x: 0,
                                y: 0,
                                ratio: -1
                            };
                            var g = (a.y * e - b.y * d + a.y - b.y) / c,
                                c = (b.x * d - a.x * e + b.x - a.x) / c,
                                d = (g * g + c * c) / 4 - 1;
                            if (d < 0) return {
                                x: 0,
                                y: 0,
                                ratio: -1
                            };
                            d = Math.sqrt(d);
                            return {
                                x: -g / 2,
                                y: -c / 2,
                                ratio: d > 1E3 ? -1 : d,
                                a: g,
                                b: c
                            }
                        }(a, b);
                    g.a > 1E3 || g.b > 1E3 || g.ratio < 0 ? (d.beginPath(), d.moveTo(a.x * c, a.y * c),
                        d.lineTo(b.x * c, b.y * c)) : (b = Math.atan2(b.y - g.y, b.x - g.x), a = Math.atan2(a.y - g.y, a.x - g.x), e = e(b, a), d.beginPath(), d.arc(g.x * c, g.y * c, g.ratio * c, b, a, e));
                    d.stroke()
                },
                contains: f.lambda(!1)
            }
        };
    k.Plot = {
        initialize: function(a, b) {
            this.viz = a;
            this.config = a.config;
            this.node = a.config.Node;
            this.edge = a.config.Edge;
            this.animation = new B;
            this.nodeTypes = new b.Plot.NodeTypes;
            this.edgeTypes = new b.Plot.EdgeTypes;
            this.labels = a.labels
        },
        nodeHelper: A,
        edgeHelper: D,
        Interpolator: {
            map: {
                border: "color",
                color: "color",
                width: "number",
                height: "number",
                dim: "number",
                alpha: "number",
                lineWidth: "number",
                angularWidth: "number",
                span: "number",
                valueArray: "array-number",
                dimArray: "array-number"
            },
            canvas: {
                globalAlpha: "number",
                fillStyle: "color",
                strokeStyle: "color",
                lineWidth: "number",
                shadowBlur: "number",
                shadowColor: "color",
                shadowOffsetX: "number",
                shadowOffsetY: "number",
                miterLimit: "number"
            },
            label: {
                size: "number",
                color: "color"
            },
            compute: function(a, b, c) {
                return a + (b - a) * c
            },
            moebius: function(a, b, c, d) {
                b = d.scale(-c);
                if (b.norm() < 1) {
                    var c = b.x,
                        d = b.y,
                        e = a.startPos.getc().moebiusTransformation(b);
                    a.pos.setc(e.x, e.y);
                    b.x = c;
                    b.y = d
                }
            },
            linear: function(a, b, c) {
                var b = a.startPos.getc(!0),
                    d = a.endPos.getc(!0);
                a.pos.setc(this.compute(b.x, d.x, c), this.compute(b.y, d.y, c))
            },
            polar: function(a, b, c) {
                b = a.startPos.getp(!0);
                c = a.endPos.getp().interpolate(b, c);
                a.pos.setp(c.theta, c.rho)
            },
            number: function(a, b, c, d, e) {
                var g = a[d](b, "start"),
                    d = a[d](b, "end");
                a[e](b, this.compute(g, d, c))
            },
            color: function(a, b, c, d, e) {
                var g = f.hexToRgb(a[d](b, "start")),
                    d = f.hexToRgb(a[d](b, "end")),
                    h = this.compute,
                    c = f.rgbToHex([parseInt(h(g[0], d[0],
                        c)), parseInt(h(g[1], d[1], c)), parseInt(h(g[2], d[2], c))]);
                a[e](b, c)
            },
            "array-number": function(a, b, c, d, e) {
                for (var g = a[d](b, "start"), d = a[d](b, "end"), f = [], l = 0, j = g.length; l < j; l++) {
                    var t = g[l],
                        i = d[l];
                    if (t.length) {
                        for (var n = 0, k = t.length, u = []; n < k; n++) u.push(this.compute(t[n], i[n], c));
                        f.push(u)
                    } else f.push(this.compute(t, i, c))
                }
                a[e](b, f)
            },
            node: function(a, b, c, d, e, g) {
                d = this[d];
                if (b)
                    for (var f = b.length, l = 0; l < f; l++) {
                        var j = b[l];
                        this[d[j]](a, j, c, e, g)
                    } else
                        for (j in d) this[d[j]](a, j, c, e, g)
            },
            edge: function(a, b, c, d, e, g) {
                var a =
                    a.adjacencies,
                    f;
                for (f in a) this.node(a[f], b, c, d, e, g)
            },
            "node-property": function(a, b, c) {
                this.node(a, b, c, "map", "getData", "setData")
            },
            "edge-property": function(a, b, c) {
                this.edge(a, b, c, "map", "getData", "setData")
            },
            "label-property": function(a, b, c) {
                this.node(a, b, c, "label", "getLabelData", "setLabelData")
            },
            "node-style": function(a, b, c) {
                this.node(a, b, c, "canvas", "getCanvasStyle", "setCanvasStyle")
            },
            "edge-style": function(a, b, c) {
                this.edge(a, b, c, "canvas", "getCanvasStyle", "setCanvasStyle")
            }
        },
        sequence: function(a) {
            var b =
                this,
                a = f.merge({
                    condition: f.lambda(!1),
                    step: f.empty,
                    onComplete: f.empty,
                    duration: 200
                }, a || {}),
                c = setInterval(function() {
                    a.condition() ? a.step() : (clearInterval(c), a.onComplete());
                    b.viz.refresh(!0)
                }, a.duration)
        },
        prepare: function(a) {
            var b = this.viz.graph,
                c = {
                    "node-property": {
                        getter: "getData",
                        setter: "setData"
                    },
                    "edge-property": {
                        getter: "getData",
                        setter: "setData"
                    },
                    "node-style": {
                        getter: "getCanvasStyle",
                        setter: "setCanvasStyle"
                    },
                    "edge-style": {
                        getter: "getCanvasStyle",
                        setter: "setCanvasStyle"
                    }
                },
                d = {};
            if (f.type(a) == "array")
                for (var e =
                        0, g = a.length; e < g; e++) {
                    var h = a[e].split(":");
                    d[h.shift()] = h
                } else
                    for (e in a) e == "position" ? d[a.position] = [] : d[e] = f.splat(a[e]);
            b.eachNode(function(a) {
                a.startPos.set(a.pos);
                f.each(["node-property", "node-style"], function(b) {
                    if (b in d)
                        for (var e = d[b], g = 0, f = e.length; g < f; g++) a[c[b].setter](e[g], a[c[b].getter](e[g]), "start")
                });
                f.each(["edge-property", "edge-style"], function(b) {
                    if (b in d) {
                        var e = d[b];
                        a.eachAdjacency(function(a) {
                            for (var d = 0, g = e.length; d < g; d++) a[c[b].setter](e[d], a[c[b].getter](e[d]), "start")
                        })
                    }
                })
            });
            return d
        },
        animate: function(a, b) {
            var a = f.merge(this.viz.config, a || {}),
                c = this,
                d = this.viz.graph,
                e = this.Interpolator,
                g = a.type === "nodefx" ? this.nodeFxAnimation : this.animation,
                h = this.prepare(a.modes);
            a.hideLabels && this.labels.hideLabels(!0);
            g.setOptions(f.extend(a, {
                $animating: !1,
                compute: function(g) {
                    d.eachNode(function(a) {
                        for (var c in h) e[c](a, h[c], g, b)
                    });
                    c.plot(a, this.$animating, g);
                    this.$animating = !0
                },
                complete: function() {
                    a.hideLabels && c.labels.hideLabels(!1);
                    c.plot(a);
                    a.onComplete()
                }
            })).start()
        },
        nodeFx: function(a) {
            var b =
                this.viz,
                c = b.graph,
                d = this.nodeFxAnimation,
                e = f.merge(this.viz.config, {
                    elements: {
                        id: !1,
                        properties: {}
                    },
                    reposition: !1
                }),
                a = f.merge(e, a || {}, {
                    onBeforeCompute: f.empty,
                    onAfterCompute: f.empty
                });
            d.stopTimer();
            var g = a.elements.properties;
            a.elements.id ? (d = f.splat(a.elements.id), f.each(d, function(a) {
                if (a = c.getNode(a))
                    for (var b in g) a.setData(b, g[b], "end")
            })) : c.eachNode(function(a) {
                for (var b in g) a.setData(b, g[b], "end")
            });
            var d = [],
                h;
            for (h in g) d.push(h);
            h = ["node-property:" + d.join(":")];
            a.reposition && (h.push("linear"),
                b.compute("end"));
            this.animate(f.merge(a, {
                modes: h,
                type: "nodefx"
            }))
        },
        plot: function(a, b) {
            var c = this.viz,
                d = c.graph,
                e = c.canvas,
                c = c.root,
                g = this;
            e.getCtx();
            a = a || this.viz.controller;
            a.clearCanvas && e.clear();
            if (c = d.getNode(c)) {
                var f = !!c.visited;
                d.eachNode(function(c) {
                    var d = c.getData("alpha");
                    c.eachAdjacency(function(d) {
                        var j = d.nodeTo;
                        !!j.visited === f && c.drawn && j.drawn && (!b && a.onBeforePlotLine(d), g.plotLine(d, e, b), !b && a.onAfterPlotLine(d))
                    });
                    c.drawn && (!b && a.onBeforePlotNode(c), g.plotNode(c, e, b), !b && a.onAfterPlotNode(c));
                    !g.labelsHidden && a.withLabels && (c.drawn && d >= 0.95 ? g.labels.plotLabel(e, c, a) : g.labels.hideLabel(c, !1));
                    c.visited = !f
                })
            }
        },
        plotTree: function(a, b, c) {
            var d = this,
                e = this.viz.canvas;
            e.getCtx();
            var g = a.getData("alpha");
            a.eachSubnode(function(g) {
                if (b.plotSubtree(a, g) && g.exist && g.drawn) {
                    var f = a.getAdjacency(g.id);
                    !c && b.onBeforePlotLine(f);
                    d.plotLine(f, e, c);
                    !c && b.onAfterPlotLine(f);
                    d.plotTree(g, b, c)
                }
            });
            a.drawn ? (!c && b.onBeforePlotNode(a), this.plotNode(a, e, c), !c && b.onAfterPlotNode(a), !b.hideLabels && b.withLabels &&
                g >= 0.95 ? this.labels.plotLabel(e, a, b) : this.labels.hideLabel(a, !1)) : this.labels.hideLabel(a, !0)
        },
        plotNode: function(a, b, c) {
            var d = a.getData("type"),
                e = this.node.CanvasStyles;
            if (d != "none") {
                var g = a.getData("lineWidth"),
                    f = a.getData("color"),
                    l = a.getData("alpha"),
                    j = b.getCtx();
                j.save();
                j.lineWidth = g;
                j.fillStyle = j.strokeStyle = f;
                j.globalAlpha = l;
                for (var i in e) j[i] = a.getCanvasStyle(i);
                this.nodeTypes[d].render.call(this, a, b, c);
                j.restore()
            }
        },
        plotLine: function(a, b, c) {
            var d = a.getData("type"),
                e = this.edge.CanvasStyles;
            if (d != "none") {
                var g = a.getData("lineWidth"),
                    f = a.getData("color"),
                    l = b.getCtx(),
                    j = a.nodeFrom,
                    i = a.nodeTo;
                l.save();
                l.lineWidth = g;
                l.fillStyle = l.strokeStyle = f;
                l.globalAlpha = Math.min(j.getData("alpha"), i.getData("alpha"), a.getData("alpha"));
                for (var k in e) l[k] = a.getCanvasStyle(k);
                this.edgeTypes[d].render.call(this, a, b, c);
                l.restore()
            }
        }
    };
    k.Plot3D = f.merge(k.Plot, {
        Interpolator: {
            linear: function(a, b, c) {
                var b = a.startPos.getc(!0),
                    d = a.endPos.getc(!0);
                a.pos.setc(this.compute(b.x, d.x, c), this.compute(b.y, d.y, c), this.compute(b.z,
                    d.z, c))
            }
        },
        plotNode: function(a, b) {
            a.getData("type") != "none" && this.plotElement(a, b, {
                getAlpha: function() {
                    return a.getData("alpha")
                }
            })
        },
        plotLine: function(a, b) {
            a.getData("type") != "none" && this.plotElement(a, b, {
                getAlpha: function() {
                    return Math.min(a.nodeFrom.getData("alpha"), a.nodeTo.getData("alpha"), a.getData("alpha"))
                }
            })
        },
        plotElement: function(a, b, c) {
            var d = b.getCtx(),
                e = new Matrix4,
                g = b.config.Scene.Lighting,
                h = b.canvases[0],
                b = h.program,
                h = h.camera;
            if (!a.geometry) a.geometry = new(O3D[a.getData("type")]);
            a.geometry.update(a);
            if (!a.webGLVertexBuffer) {
                for (var l = [], j = [], i = [], k = 0, n = a.geometry, m = 0, u = n.vertices, n = n.faces, q = n.length; m < q; m++) {
                    var p = n[m],
                        o = u[p.a],
                        s = u[p.b],
                        r = u[p.c],
                        x = p.d ? u[p.d] : !1,
                        p = p.normal;
                    l.push(o.x, o.y, o.z);
                    l.push(s.x, s.y, s.z);
                    l.push(r.x, r.y, r.z);
                    x && l.push(x.x, x.y, x.z);
                    i.push(p.x, p.y, p.z);
                    i.push(p.x, p.y, p.z);
                    i.push(p.x, p.y, p.z);
                    x && i.push(p.x, p.y, p.z);
                    j.push(k, k + 1, k + 2);
                    x ? (j.push(k, k + 2, k + 3), k += 4) : k += 3
                }
                a.webGLVertexBuffer = d.createBuffer();
                d.bindBuffer(d.ARRAY_BUFFER, a.webGLVertexBuffer);
                d.bufferData(d.ARRAY_BUFFER,
                    new Float32Array(l), d.STATIC_DRAW);
                a.webGLFaceBuffer = d.createBuffer();
                d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, a.webGLFaceBuffer);
                d.bufferData(d.ELEMENT_ARRAY_BUFFER, new Uint16Array(j), d.STATIC_DRAW);
                a.webGLFaceCount = j.length;
                a.webGLNormalBuffer = d.createBuffer();
                d.bindBuffer(d.ARRAY_BUFFER, a.webGLNormalBuffer);
                d.bufferData(d.ARRAY_BUFFER, new Float32Array(i), d.STATIC_DRAW)
            }
            e.multiply(h.matrix, a.geometry.matrix);
            d.uniformMatrix4fv(b.viewMatrix, !1, e.flatten());
            d.uniformMatrix4fv(b.projectionMatrix, !1, h.projectionMatrix.flatten());
            e = Matrix4.makeInvert(e);
            e.$transpose();
            d.uniformMatrix4fv(b.normalMatrix, !1, e.flatten());
            e = f.hexToRgb(a.getData("color"));
            e.push(c.getAlpha());
            d.uniform4f(b.color, e[0] / 255, e[1] / 255, e[2] / 255, e[3]);
            d.uniform1i(b.enableLighting, g.enable);
            if (g.enable) {
                if (g.ambient) c = g.ambient, d.uniform3f(b.ambientColor, c[0], c[1], c[2]);
                if (g.directional) g = g.directional, e = g.color, g = g.direction, g = (new Vector3(g.x, g.y, g.z)).normalize().$scale(-1), d.uniform3f(b.lightingDirection, g.x, g.y, g.z), d.uniform3f(b.directionalColor,
                    e[0], e[1], e[2])
            }
            d.bindBuffer(d.ARRAY_BUFFER, a.webGLVertexBuffer);
            d.vertexAttribPointer(b.position, 3, d.FLOAT, !1, 0, 0);
            d.bindBuffer(d.ARRAY_BUFFER, a.webGLNormalBuffer);
            d.vertexAttribPointer(b.normal, 3, d.FLOAT, !1, 0, 0);
            d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, a.webGLFaceBuffer);
            d.drawElements(d.TRIANGLES, a.webGLFaceCount, d.UNSIGNED_SHORT, 0)
        }
    });
    k.Label = {};
    k.Label.Native = new i({
        initialize: function(a) {
            this.viz = a
        },
        plotLabel: function(a, b, c) {
            var d = a.getCtx();
            b.pos.getc(!0);
            d.font = b.getLabelData("style") + " " + b.getLabelData("size") +
                "px " + b.getLabelData("family");
            d.textAlign = b.getLabelData("textAlign");
            d.fillStyle = d.strokeStyle = b.getLabelData("color");
            d.textBaseline = b.getLabelData("textBaseline");
            this.renderLabel(a, b, c)
        },
        renderLabel: function(a, b) {
            var c = a.getCtx(),
                d = b.pos.getc(!0);
            c.fillText(b.name, d.x, d.y + b.getData("height") / 2)
        },
        hideLabel: f.empty,
        hideLabels: f.empty
    });
    k.Label.DOM = new i({
        labelsHidden: !1,
        labelContainer: !1,
        labels: {},
        getLabelContainer: function() {
            return this.labelContainer ? this.labelContainer : this.labelContainer = document.getElementById(this.viz.config.labelContainer)
        },
        getLabel: function(a) {
            return a in this.labels && this.labels[a] != null ? this.labels[a] : this.labels[a] = document.getElementById(a)
        },
        hideLabels: function(a) {
            this.getLabelContainer().style.display = a ? "none" : "";
            this.labelsHidden = a
        },
        clearLabels: function(a) {
            for (var b in this.labels)
                if (a || !this.viz.graph.hasNode(b)) this.disposeLabel(b), delete this.labels[b]
        },
        disposeLabel: function(a) {
            (a = this.getLabel(a)) && a.parentNode && a.parentNode.removeChild(a)
        },
        hideLabel: function(a, b) {
            var a = f.splat(a),
                c = b ? "" : "none",
                d = this;
            f.each(a,
                function(a) {
                    if (a = d.getLabel(a.id)) a.style.display = c
                })
        },
        fitsInCanvas: function(a, b) {
            var c = b.getSize();
            if (a.x >= c.width || a.x < 0 || a.y >= c.height || a.y < 0) return !1;
            return !0
        }
    });
    k.Label.HTML = new i({
        Implements: k.Label.DOM,
        plotLabel: function(a, b, c) {
            var a = b.id,
                d = this.getLabel(a);
            if (!d && !(d = document.getElementById(a))) {
                var d = document.createElement("div"),
                    e = this.getLabelContainer();
                d.id = a;
                d.className = "node";
                d.style.position = "absolute";
                c.onCreateLabel(d, b);
                e.appendChild(d);
                this.labels[b.id] = d
            }
            this.placeLabel(d, b, c)
        }
    });
    k.Label.SVG = new i({
        Implements: k.Label.DOM,
        plotLabel: function(a, b, c) {
            var a = b.id,
                d = this.getLabel(a);
            if (!d && !(d = document.getElementById(a))) {
                var d = document.createElementNS("http://www.w3.org/2000/svg", "svg:text"),
                    e = document.createElementNS("http://www.w3.org/2000/svg", "svg:tspan");
                d.appendChild(e);
                e = this.getLabelContainer();
                d.setAttribute("id", a);
                d.setAttribute("class", "node");
                e.appendChild(d);
                c.onCreateLabel(d, b);
                this.labels[b.id] = d
            }
            this.placeLabel(d, b, c)
        }
    });
    var r = $jit.Layouts = {},
        F = {
            label: null,
            compute: function(a,
                b, c) {
                this.initializeLabel(c);
                var d = this.label,
                    e = d.style;
                a.eachNode(function(a) {
                    var b = a.getData("autoWidth"),
                        c = a.getData("autoHeight");
                    if (b || c) {
                        delete a.data.$width;
                        delete a.data.$height;
                        delete a.data.$dim;
                        var j = a.getData("width"),
                            i = a.getData("height");
                        e.width = b ? "auto" : j + "px";
                        e.height = c ? "auto" : i + "px";
                        d.innerHTML = a.name;
                        b = d.offsetWidth;
                        c = d.offsetHeight;
                        j = a.getData("type");
                        f.indexOf(["circle", "square", "triangle", "star"], j) === -1 ? (a.setData("width", b), a.setData("height", c)) : (b = b > c ? b : c, a.setData("width",
                            b), a.setData("height", b), a.setData("dim", b))
                    }
                })
            },
            initializeLabel: function(a) {
                if (!this.label) this.label = document.createElement("div"), document.body.appendChild(this.label);
                this.setLabelStyles(a)
            },
            setLabelStyles: function() {
                f.extend(this.label.style, {
                    visibility: "hidden",
                    position: "absolute",
                    width: "auto",
                    height: "auto"
                });
                this.label.className = "jit-autoadjust-label"
            }
        };
    r.Radial = new i({
        compute: function(a) {
            a = f.splat(a || ["current", "start", "end"]);
            F.compute(this.graph, a, this.config);
            this.graph.computeLevels(this.root,
                0, "ignore");
            var b = this.createLevelDistanceFunc();
            this.computeAngularWidths(a);
            this.computePositions(a, b)
        },
        computePositions: function(a, b) {
            for (var c = this.graph, d = c.getNode(this.root), e = this.parent, g = 0, f = a.length; g < f; g++) {
                var i = a[g];
                d.setPos(new q(0, 0), i);
                d.setData("span", Math.PI * 2, i)
            }
            d.angleSpan = {
                begin: 0,
                end: 2 * Math.PI
            };
            c.eachBFS(this.root, function(c) {
                var d = c.angleSpan.end - c.angleSpan.begin,
                    g = c.angleSpan.begin,
                    f = b(c),
                    h = 0,
                    i = [],
                    l = {};
                c.eachSubnode(function(b) {
                    h += b._treeAngularWidth;
                    for (var c = 0, d = a.length; c <
                        d; c++) {
                        var e = a[c],
                            g = b.getData("dim", e);
                        l[e] = e in l ? g > l[e] ? g : l[e] : g
                    }
                    i.push(b)
                }, "ignore");
                e && e.id == c.id && i.length > 0 && i[0].dist && i.sort(function(a, b) {
                    return (a.dist >= b.dist) - (a.dist <= b.dist)
                });
                for (var c = 0, k = i.length; c < k; c++) {
                    var m = i[c];
                    if (!m._flag) {
                        for (var o = m._treeAngularWidth / h * d, s = g + o / 2, r = 0, w = a.length; r < w; r++) {
                            var v = a[r];
                            m.setPos(new q(s, f), v);
                            m.setData("span", o, v);
                            m.setData("dim-quotient", m.getData("dim", v) / l[v], v)
                        }
                        m.angleSpan = {
                            begin: g,
                            end: g + o
                        };
                        g += o
                    }
                }
            }, "ignore")
        },
        setAngularWidthForNodes: function(a) {
            this.graph.eachBFS(this.root,
                function(b, c) {
                    var d = b.getData("angularWidth", a[0]) || 5;
                    b._angularWidth = d / c
                }, "ignore")
        },
        setSubtreesAngularWidth: function() {
            var a = this;
            this.graph.eachNode(function(b) {
                a.setSubtreeAngularWidth(b)
            }, "ignore")
        },
        setSubtreeAngularWidth: function(a) {
            var b = this,
                c = a._angularWidth,
                d = 0;
            a.eachSubnode(function(a) {
                b.setSubtreeAngularWidth(a);
                d += a._treeAngularWidth
            }, "ignore");
            a._treeAngularWidth = Math.max(c, d)
        },
        computeAngularWidths: function(a) {
            this.setAngularWidthForNodes(a);
            this.setSubtreesAngularWidth()
        }
    });
    $jit.RGraph =
        new i({
            Implements: [{
                construct: function(a) {
                    var b = f.type(a) == "array",
                        c = new k(this.graphOptions, this.config.Node, this.config.Edge, this.config.Label);
                    b ? function(a, b) {
                        for (var c = function(c) {
                                for (var g = 0, f = b.length; g < f; g++)
                                    if (b[g].id == c) return b[g];
                                return a.addNode({
                                    id: c,
                                    name: c
                                })
                            }, h = 0, i = b.length; h < i; h++) {
                            a.addNode(b[h]);
                            var j = b[h].adjacencies;
                            if (j)
                                for (var k = 0, m = j.length; k < m; k++) {
                                    var n = j[k],
                                        o = {};
                                    if (typeof j[k] != "string") o = f.merge(n.data, {}), n = n.nodeTo;
                                    a.addAdjacence(b[h], c(n), o)
                                }
                        }
                    }(c, a) : function(a, b) {
                        a.addNode(b);
                        if (b.children)
                            for (var c = 0, f = b.children; c < f.length; c++) a.addAdjacence(b, f[c]), arguments.callee(a, f[c])
                    }(c, a);
                    return c
                },
                loadJSON: function(a, b) {
                    this.json = a;
                    this.labels && this.labels.clearLabels && this.labels.clearLabels(!0);
                    this.graph = this.construct(a);
                    this.root = f.type(a) != "array" ? a.id : a[b ? b : 0].id
                },
                toJSON: function(a) {
                    if ((a || "tree") == "tree") var b = {},
                        b = function e(a) {
                            var b = {};
                            b.id = a.id;
                            b.name = a.name;
                            b.data = a.data;
                            var c = [];
                            a.eachSubnode(function(a) {
                                c.push(e(a))
                            });
                            b.children = c;
                            return b
                        }(this.graph.getNode(this.root));
                    else {
                        var b = [],
                            c = !!this.graph.getNode(this.root).visited;
                        this.graph.eachNode(function(a) {
                            var g = {};
                            g.id = a.id;
                            g.name = a.name;
                            g.data = a.data;
                            var f = [];
                            a.eachAdjacency(function(a) {
                                var b = a.nodeTo;
                                if (!!b.visited === c) {
                                    var e = {};
                                    e.nodeTo = b.id;
                                    e.data = a.data;
                                    f.push(e)
                                }
                            });
                            g.adjacencies = f;
                            b.push(g);
                            a.visited = !c
                        })
                    }
                    return b
                }
            }, w, r.Radial],
            initialize: function(a) {
                var b = $jit.RGraph,
                    a = this.controller = this.config = f.merge(o("Canvas", "Node", "Edge", "Fx", "Controller", "Tips", "NodeStyles", "Events", "Navigation", "Label"), {
                        interpolation: "linear",
                        levelDistance: 100
                    }, a);
                if (a.useCanvas) this.canvas = a.useCanvas, this.config.labelContainer = this.canvas.id + "-label";
                else {
                    if (a.background) a.background = f.merge({
                        type: "Circles"
                    }, a.background);
                    this.canvas = new s(this, a);
                    this.config.labelContainer = (typeof a.injectInto == "string" ? a.injectInto : a.injectInto.id) + "-label"
                }
                this.graphOptions = {
                    klass: q,
                    Node: {
                        selected: !1,
                        exist: !0,
                        drawn: !0
                    }
                };
                this.graph = new k(this.graphOptions, this.config.Node, this.config.Edge);
                this.labels = new b.Label[a.Label.type](this);
                this.fx = new b.Plot(this,
                    b);
                this.op = new b.Op(this);
                this.root = this.json = null;
                this.parent = this.busy = !1;
                this.initializeExtras()
            },
            createLevelDistanceFunc: function() {
                var a = this.config.levelDistance;
                return function(b) {
                    return (b._depth + 1) * a
                }
            },
            refresh: function() {
                this.compute();
                this.plot()
            },
            reposition: function() {
                this.compute("end")
            },
            plot: function() {
                this.fx.plot()
            },
            getNodeAndParentAngle: function(a) {
                var b = !1,
                    c = this.graph.getNode(a),
                    a = c.getParents();
                if (a = a.length > 0 ? a[0] : !1) b = a.pos.getc(), c = c.pos.getc(), b = b.add(c.scale(-1)), b = Math.atan2(b.y,
                    b.x), b < 0 && (b += 2 * Math.PI);
                return {
                    parent: a,
                    theta: b
                }
            },
            tagChildren: function(a, b) {
                if (a.angleSpan) {
                    var c = [];
                    a.eachAdjacency(function(a) {
                        c.push(a.nodeTo)
                    }, "ignore");
                    for (var d = c.length, e = 0; e < d && b != c[e].id; e++);
                    for (var e = (e + 1) % d, g = 0; b != c[e].id; e = (e + 1) % d) c[e].dist = g++
                }
            },
            onClick: function(a, b) {
                if (this.root != a && !this.busy) {
                    this.busy = !0;
                    this.root = a;
                    var c = this;
                    this.controller.onBeforeCompute(this.graph.getNode(a));
                    var d = this.getNodeAndParentAngle(a);
                    this.tagChildren(d.parent, a);
                    this.parent = d.parent;
                    this.compute("end");
                    var e = d.theta - d.parent.endPos.theta;
                    this.graph.eachNode(function(a) {
                        a.endPos.set(a.endPos.getp().add(new q(e, 0)))
                    });
                    d = this.config.interpolation;
                    b = f.merge({
                        onComplete: f.empty
                    }, b || {});
                    this.fx.animate(f.merge({
                        hideLabels: !0,
                        modes: [d]
                    }, b, {
                        onComplete: function() {
                            c.busy = !1;
                            b.onComplete()
                        }
                    }))
                }
            }
        });
    $jit.RGraph.$extend = !0;
    (function(a) {
        a.Op = new i({
            Implements: k.Op
        });
        a.Plot = new i({
            Implements: k.Plot
        });
        a.Label = {};
        a.Label.Native = new i({
            Implements: k.Label.Native
        });
        a.Label.SVG = new i({
            Implements: k.Label.SVG,
            initialize: function(a) {
                this.viz =
                    a
            },
            placeLabel: function(a, c, d) {
                var e = c.pos.getc(!0),
                    g = this.viz.canvas,
                    f = g.translateOffsetX,
                    i = g.translateOffsetY,
                    j = g.scaleOffsetX,
                    k = g.scaleOffsetY,
                    g = g.getSize(),
                    e = {
                        x: Math.round(e.x * j + f + g.width / 2),
                        y: Math.round(e.y * k + i + g.height / 2)
                    };
                a.setAttribute("x", e.x);
                a.setAttribute("y", e.y);
                d.onPlaceLabel(a, c)
            }
        });
        a.Label.HTML = new i({
            Implements: k.Label.HTML,
            initialize: function(a) {
                this.viz = a
            },
            placeLabel: function(a, c, d) {
                var e = c.pos.getc(!0),
                    f = this.viz.canvas,
                    h = f.translateOffsetX,
                    i = f.translateOffsetY,
                    j = f.scaleOffsetX,
                    k = f.scaleOffsetY,
                    m = f.getSize(),
                    e = {
                        x: Math.round(e.x * j + h + m.width / 2),
                        y: Math.round(e.y * k + i + m.height / 2)
                    },
                    h = a.style;
                h.left = e.x + "px";
                h.top = e.y + "px";
                h.display = this.fitsInCanvas(e, f) ? "" : "none";
                d.onPlaceLabel(a, c)
            }
        });
        a.Plot.NodeTypes = new i({
            none: {
                render: f.empty,
                contains: f.lambda(!1)
            },
            circle: {
                render: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    this.nodeHelper.circle.render("fill", d, e, c)
                },
                contains: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    return this.nodeHelper.circle.contains(d, c, e)
                }
            },
            ellipse: {
                render: function(a,
                    c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("width"),
                        f = a.getData("height");
                    this.nodeHelper.ellipse.render("fill", d, e, f, c)
                },
                contains: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("width"),
                        f = a.getData("height");
                    return this.nodeHelper.ellipse.contains(d, c, e, f)
                }
            },
            square: {
                render: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    this.nodeHelper.square.render("fill", d, e, c)
                },
                contains: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    return this.nodeHelper.square.contains(d, c, e)
                }
            },
            rectangle: {
                render: function(a,
                    c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("width"),
                        f = a.getData("height");
                    this.nodeHelper.rectangle.render("fill", d, e, f, c)
                },
                contains: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("width"),
                        f = a.getData("height");
                    return this.nodeHelper.rectangle.contains(d, c, e, f)
                }
            },
            triangle: {
                render: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    this.nodeHelper.triangle.render("fill", d, e, c)
                },
                contains: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    return this.nodeHelper.triangle.contains(d, c, e)
                }
            },
            star: {
                render: function(a,
                    c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    this.nodeHelper.star.render("fill", d, e, c)
                },
                contains: function(a, c) {
                    var d = a.pos.getc(!0),
                        e = a.getData("dim");
                    return this.nodeHelper.star.contains(d, c, e)
                }
            }
        });
        a.Plot.EdgeTypes = new i({
            none: f.empty,
            line: {
                render: function(a, c) {
                    var d = a.nodeFrom.pos.getc(!0),
                        e = a.nodeTo.pos.getc(!0);
                    this.edgeHelper.line.render(d, e, c)
                },
                contains: function(a, c) {
                    var d = a.nodeFrom.pos.getc(!0),
                        e = a.nodeTo.pos.getc(!0);
                    return this.edgeHelper.line.contains(d, e, c, this.edge.epsilon)
                }
            },
            arrow: {
                render: function(a,
                    c) {
                    var d = a.nodeFrom.pos.getc(!0),
                        e = a.nodeTo.pos.getc(!0),
                        f = a.getData("dim"),
                        h = a.data.$direction;
                    this.edgeHelper.arrow.render(d, e, f, h && h.length > 1 && h[0] != a.nodeFrom.id, c)
                },
                contains: function(a, c) {
                    var d = a.nodeFrom.pos.getc(!0),
                        e = a.nodeTo.pos.getc(!0);
                    return this.edgeHelper.arrow.contains(d, e, c, this.edge.epsilon)
                }
            }
        })
    })($jit.RGraph)
})();