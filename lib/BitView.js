(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("BitView", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
var Bit = global["WebModule"]["Bit"];

// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function BitView(source,   // @arg TypedArray
                 cursor) { // @arg UINT32 = 0
    this._view = { source: source, cursor: cursor || 0 };
}

BitView["prototype"] = Object.create(BitView, {
    "constructor":  { "value": BitView          }, // new BitView(source:TypedArray, cursor:UINT32 = 0):BitView
    "subview":      { "value": BitView_subview  }, // BitView#subview(begin:UINT32 = 0, end:UINT32 = source.length):BitView
    "r1":           { "value": BitView_r1       }, // BitView#r1():UINT32
    "r2":           { "value": BitView_r2       }, // BitView#r2():UINT32
    "r3":           { "value": BitView_r3       }, // BitView#r3():UINT32
    "r4":           { "value": BitView_r4       }, // BitView#r4():UINT32
    "r1s":          { "value": BitView_r1s      }, // BitView#r1s(bitPattern):Uint32Array
    "r2s":          { "value": BitView_r2s      }, // BitView#r2s(bitPattern):Uint32Array
    "r3s":          { "value": BitView_r3s      }, // BitView#r3s(bitPattern):Uint32Array
    "r4s":          { "value": BitView_r4s      }, // BitView#r4s(bitPattern):Uint32Array
    "length": {
        "get": function()  { return this._view.source.length; },
    },
    "source": {
        "get": function()  { return this._view.source; },
    },
    "cursor": {
        "get": function()  { return this._view.cursor; },
        "set": function(v) { this._view.cursor = v;    },
    },
});

// --- implements ------------------------------------------
function BitView_subview(begin, // @arg UINT32 = 0
                         end) { // @arg UTIN32 = source.length
                                // @ret BitView
    begin = begin === undefined ? 0 : begin;
    end   = end   === undefined ? this._view.source.length : end;
    return new BitView( this._view.source.subarray(begin, end) );
}

function BitView_r1() { // @ret UINT32
    return this._view.source[this._view.cursor++] >>> 0;
}

function BitView_r2() { // @ret UINT16
    var view = this._view;
    return ((view.source[view.cursor++]  <<  8) |
             view.source[view.cursor++]) >>> 0;
}

function BitView_r3() { // @ret UINT32
    var view = this._view;
    return ((view.source[view.cursor++]  << 16) |
            (view.source[view.cursor++]  <<  8) |
             view.source[view.cursor++]) >>> 0;
}

function BitView_r4() { // @ret UINT32
    var view = this._view;
    return ((view.source[view.cursor++]  << 24) |
            (view.source[view.cursor++]  << 16) |
            (view.source[view.cursor++]  <<  8) |
             view.source[view.cursor++]) >>> 0;
}

function BitView_r1s(bitPattern) { // @arg UINT8Array|Uint8Array
                                   // @ret Uint32Array
    return Bit["split1"](this["r1"](), bitPattern);
}

function BitView_r2s(bitPattern) { // @arg UINT8Array|Uint8Array
                                   // @ret Uint32Array
    return Bit["split2"](this["r2"](), bitPattern);
}

function BitView_r3s(bitPattern) { // @arg UINT8Array|Uint8Array
                                   // @ret Uint32Array
    return Bit["split3"](this["r3"](), bitPattern);
}

function BitView_r4s(bitPattern) { // @arg UINT8Array|Uint8Array
                                   // @ret Uint32Array
    return Bit["split4"](this["r4"](), bitPattern);
}

return BitView; // return entity

});

