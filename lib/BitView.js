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
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function BitView(source,      // @arg Uint8Array
                 cursor,      // @arg UINT32 = 0
                 bitCursor) { // @arg UINT8 = 0 - 7(MSB) - 0(LSB)
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source,    "Uint8Array"),  BitView, "source");
        $valid($type(cursor,    "UINT32|omit"), BitView, "cursor");
        $valid($type(bitCursor, "UINT8|omit"),  BitView, "bitCursor");
    }
//}@dev

    this._view = {
        source:    source,
        cursor:    cursor || 0,
        bitCursor: bitCursor === undefined ? 7 : bitCursor
    };
}

BitView["prototype"] = Object.create(BitView, {
    "constructor":  { "value": BitView }, // new BitView(source:Uint8Array, cursor:UINT32 = 0):BitView
    // --- read bits ---
    "u1":           { "get": function()  { return _bit1(this._view);        } }, // BitView#u1:UINT8
    "u2":           { "get": function()  { return _bit2(this._view);        } }, // BitView#u2:UINT8
    "u3":           { "get": function()  { return _bit3(this._view);        } }, // BitView#u3:UINT8
    "u4":           { "get": function()  { return _bit4(this._view);        } }, // BitView#u4:UINT8
    "u5":           { "get": function()  { return _bit5(this._view);        } }, // BitView#u5:UINT8
    "u6":           { "get": function()  { return _bit6(this._view);        } }, // BitView#u6:UINT8
    "u7":           { "get": function()  { return _bit7(this._view);        } }, // BitView#u7:UINT8
    "u8":           { "get": function()  { return _bit8(this._view);        } }, // BitView#u8:UINT8
    "u16":          { "get": function()  { return _bit16(this._view);       } }, // BitView#u16:UINT16
    "u24":          { "get": function()  { return _bit24(this._view);       } }, // BitView#u24:UINT24
    "u32":          { "get": function()  { return _bit32(this._view);       } }, // BitView#u32:UINT32
    // --- read Exp-Golomb bits ---
    "ug":           { "get": function()  { return _bitGolomb(this._view);   } }, // BitView#ug:UINT32
    "sg":           { "get": function()  { return _bitGolombS(this._view);  } }, // BitView#sg:INT32
    // --- accessor ---
    "length":       { "get": function()  { return this._view.source.length; } }, // BitView#length:UINT32
    "source":       { "get": function()  { return this._view.source;        } }, // BitView#source:Uint8Array
    "cursor":       { "get": function()  { return this._view.cursor;        },   // BitView#cursor:UINT32
                      "set": function(v) { this._view.cursor = v;           } },
    "bitCursor":    { "get": function()  { return this._view.bitCursor;     },   // BitView#bitCursor:UINT8
                      "set": function(v) { this._view.bitCursor = v;        } },
});

// --- implements ------------------------------------------
function _bit1(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - a bit value
    var a = view.source[view.cursor] || 0;
    var bitValue = (a >> view.bitCursor) & 0x1;

    if (--view.bitCursor < 0) {
        // <-- current byte -><-- next byte ---->
        // +-----------------++-----------------+
        // | 7 6 5 4 3 2 1 0 || 7 6 5 4 3 2 1 0 |
        // +-----------------++-----------------+
        //                 v    ^
        //                 +----+                 bitCursor
        view.bitCursor += 8; // set next bit cursor
        view.cursor++;       // inclement byte cursor
    }
    return bitValue;
}

function _bit2(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - 2 bit values
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var bitValue = (((a << 8) | b) >> (view.bitCursor + 7)) & 0x3;

    view.bitCursor -= 2;
    if (view.bitCursor < 0) {
        view.bitCursor += 8;
        view.cursor++;
    }
    return bitValue;
}

function _bit3(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - 3 bit values
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var bitValue = (((a << 8) | b) >> (view.bitCursor + 6)) & 0x7;

    view.bitCursor -= 3;
    if (view.bitCursor < 0) {
        view.bitCursor += 8;
        view.cursor++;
    }
    return bitValue;
}

function _bit4(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - 4 bit values
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var bitValue = (((a << 8) | b) >> (view.bitCursor + 5)) & 0xF;

    view.bitCursor -= 4;
    if (view.bitCursor < 0) {
        view.bitCursor += 8;
        view.cursor++;
    }
    return bitValue;
}

function _bit5(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - 5 bit values
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var bitValue = (((a << 8) | b) >> (view.bitCursor + 4)) & 0x1F;

    view.bitCursor -= 5;
    if (view.bitCursor < 0) {
        view.bitCursor += 8;
        view.cursor++;
    }
    return bitValue;
}

function _bit6(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - 6 bit values
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var bitValue = (((a << 8) | b) >> (view.bitCursor + 3)) & 0x3F;

    view.bitCursor -= 6;
    if (view.bitCursor < 0) {
        view.bitCursor += 8;
        view.cursor++;
    }
    return bitValue;
}

function _bit7(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - 7 bit values
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var bitValue = (((a << 8) | b) >> (view.bitCursor + 2)) & 0x7F;

    view.bitCursor -= 7;
    if (view.bitCursor < 0) {
        view.bitCursor += 8;
        view.cursor++;
    }
    return bitValue;
}

function _bit8(view) { // @arg Object - { source, cursor, bitCursor }
                       // @ret UINT8 - 8 bit values
    var result = view.source[view.cursor++] || 0;

    if (view.bitCursor === 7) {
        return result >>> 0;
    }
    var next = view.source[view.cursor] || 0;

    return ((result << 8 | next) >> (view.bitCursor + 1)) & 0xFF;
}

function _bit16(view) { // @arg Object - { source, cursor, bitCursor }
                        // @ret UINT16 - 16 bit values
    var a = view.source[view.cursor++] || 0;
    var b = view.source[view.cursor++] || 0;
    var result = (a << 8) | b;

    if (view.bitCursor === 7) {
        return result >>> 0;
    }
    var next = view.source[view.cursor] || 0;

    return ((result << 8 | next) >> (view.bitCursor + 1)) & 0xFFFF;
}

function _bit24(view) { // @arg Object - { source, cursor, bitCursor }
                        // @ret UINT24 - 24 bit values
    var a = view.source[view.cursor++] || 0;
    var b = view.source[view.cursor++] || 0;
    var c = view.source[view.cursor++] || 0;
    var result = (a << 16) | (b << 8) | c;

    if (view.bitCursor === 7) {
        return result >>> 0;
    }
    var next = view.source[view.cursor] || 0;

    return ((result << 8 | next) >>> (view.bitCursor + 1)) & 0xFFFFFF;
}

function _bit32(view) { // @arg Object - { source, cursor, bitCursor }
                        // @ret UINT32 - 32 bit values
    if (view.bitCursor === 7) {
        var a = view.source[view.cursor++] || 0;
        var b = view.source[view.cursor++] || 0;
        var c = view.source[view.cursor++] || 0;
        var d = view.source[view.cursor++] || 0;

        return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
    }
    return (_bit16(view) << 16 | _bit16(view)) >>> 0;
}

function _bitGolomb(view) { // @arg Object - { source, cursor, bitCursor }
                            // @ret UINT32 - unsigned value
    // ExpGolomb.decode("1")     -> 0
    // ExpGolomb.decode("010")   -> 1
    // ExpGolomb.decode("00100") -> 3
    // ExpGolomb.decode("00111") -> 6

    var bitValue = _bit1(view);

    if (bitValue === 1) {
        return 0;
    }

    var zeroLength = 0;

    while (_bit1(view) === 0) {
        zeroLength++;
    }

    var binaryString = ["1"];

    for (var i = 0, iz = zeroLength + 1; i < iz; ++i) {
        binaryString.push( _bit1(view) ? "1" : "0" );
    }
    return parseInt(binaryString.join(""), 2) - 1;
}

function _bitGolombS(view) { // @arg Object - { source, cursor, bitCursor }
                             // @ret INT32 - signed value
    // | Bits          | unsigned | signed |
    // |---------------|----------|--------|
    // |             1 |        0 |      0 |
    // |           010 |        1 |      1 |
    // |           011 |        2 |     -1 |
    // |         00100 |        3 |      2 |
    // |         00101 |        4 |     -2 |
    // |         00110 |        5 |      3 |
    // |         00111 |        6 |     -3 |
    // |       0001000 |        7 |      4 |
    // |       0001001 |        8 |     -4 |
    // |       0001010 |        9 |      5 |
    // |       0001011 |       10 |     -5 |
    // |       0001100 |       11 |      6 |
    var result = _bitGolomb(view);
    var hasSignedBit = (result & 1) === 0;

    if (hasSignedBit) {
        result = -(result / 2);
    } else {
        result = (result + 1) / 2;
    }
    return result;
}

return BitView; // return entity

});

