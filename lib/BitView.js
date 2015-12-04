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
    // --- read next unsigned N bits ---
    "nu":           { "value": function(b) { return _nextBitN(this._view, b); } }, // BitView#nu(bits:UINT8):UINT32
    // --- read next unsigned bits ---
    "nu1":          { "get":   function()  { return _nextBit1(this._view);    } }, // BitView#nu1:UINT8
    "nu2":          { "get":   function()  { return _nextBit2(this._view);    } }, // BitView#nu2:UINT8
    "nu3":          { "get":   function()  { return _nextBit3(this._view);    } }, // BitView#nu3:UINT8
    "nu4":          { "get":   function()  { return _nextBit4(this._view);    } }, // BitView#nu4:UINT8
    "nu5":          { "get":   function()  { return _nextBit5(this._view);    } }, // BitView#nu5:UINT8
    "nu6":          { "get":   function()  { return _nextBit6(this._view);    } }, // BitView#nu6:UINT8
    "nu7":          { "get":   function()  { return _nextBit7(this._view);    } }, // BitView#nu7:UINT8
    "nu8":          { "get":   function()  { return _nextBit8(this._view);    } }, // BitView#nu8:UINT8
    "nu16":         { "get":   function()  { return _nextBit16(this._view);   } }, // BitView#nu16:UINT16
    "nu24":         { "get":   function()  { return _nextBit24(this._view);   } }, // BitView#nu24:UINT24
    "nu32":         { "get":   function()  { return _nextBit32(this._view);   } }, // BitView#nu32:UINT32
    // --- read unsigned N bits ---
    "u":            { "value": function(b) { return _bitN(this._view, b);     } }, // BitView#u(bits:UINT8):UINT32
    // --- read unsigned bits ---
    "u1":           { "get":   function()  { return _bit1(this._view);        } }, // BitView#u1:UINT8
    "u2":           { "get":   function()  { return _bit2(this._view);        } }, // BitView#u2:UINT8
    "u3":           { "get":   function()  { return _bit3(this._view);        } }, // BitView#u3:UINT8
    "u4":           { "get":   function()  { return _bit4(this._view);        } }, // BitView#u4:UINT8
    "u5":           { "get":   function()  { return _bit5(this._view);        } }, // BitView#u5:UINT8
    "u6":           { "get":   function()  { return _bit6(this._view);        } }, // BitView#u6:UINT8
    "u7":           { "get":   function()  { return _bit7(this._view);        } }, // BitView#u7:UINT8
    "u8":           { "get":   function()  { return _bit8(this._view);        } }, // BitView#u8:UINT8
    "u16":          { "get":   function()  { return _bit16(this._view);       } }, // BitView#u16:UINT16
    "u24":          { "get":   function()  { return _bit24(this._view);       } }, // BitView#u24:UINT24
    "u32":          { "get":   function()  { return _bit32(this._view);       } }, // BitView#u32:UINT32
    // --- read unsigned/signed Exp-Golomb bits ---
    "ug":           { "get":   function()  { return _bitGolomb(this._view);   } }, // BitView#ug:UINT32
    "sg":           { "get":   function()  { return _bitGolombS(this._view);  } }, // BitView#sg:INT32
    // --- accessor ---
    "length":       { "get":   function()  { return this._view.source.length; } }, // BitView#length:UINT32
    "source":       { "get":   function()  { return this._view.source;        } }, // BitView#source:Uint8Array
    "cursor":       { "get":   function()  { return this._view.cursor;        },   // BitView#cursor:UINT32
                      "set":   function(v) { this._view.cursor = v;           } },
    "bitCursor":    { "get":   function()  { return this._view.bitCursor;     },   // BitView#bitCursor:UINT8
                      "set":   function(v) { this._view.bitCursor = v;        } },
});

// --- implements ------------------------------------------
function _nextBitN(view,   // @arg Object - { source, cursor, bitCursor }
                   bits) { // @arg UINT8 - read next bits(1 - 23)
                           // @ret UINT8 - N bit(s) value
    if (bits >= 24) { throw new TypeError("NOT_FUNCTION"); }

    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var value = (a << 8) | b;

    if (bits >= 8) {
        value = ((value << 8) | (view.source[view.cursor + 2] || 0)) >>> 0;
    }
    if (bits >= 16) {
        value = ((value << 8) | (view.source[view.cursor + 3] || 0)) >>> 0;
    }
    var bitShift = view.bitCursor + 9 - (bits & 0x7); // 1 - 7
    var bitMask  = ((1 << bits) >>> 0) - 1; // 0x1 - 0x7FFFFFFF
    return (value >>> bitShift) & bitMask;
}

function _nextBit1(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - a bit value
    var a = view.source[view.cursor] || 0;

    return (a >> view.bitCursor) & 0x1;
}

function _nextBit2(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - 2 bits value
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;

    return (((a << 8) | b) >> (view.bitCursor + 7)) & 0x3;
}

function _nextBit3(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - 3 bits value
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;

    return (((a << 8) | b) >> (view.bitCursor + 6)) & 0x7;
}

function _nextBit4(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - 4 bits value
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;

    return (((a << 8) | b) >> (view.bitCursor + 5)) & 0xF;
}

function _nextBit5(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - 4 bits value
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;

    return (((a << 8) | b) >> (view.bitCursor + 4)) & 0x1F;
}

function _nextBit6(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - 4 bits value
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;

    return (((a << 8) | b) >> (view.bitCursor + 3)) & 0x3F;
}

function _nextBit7(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - 4 bits value
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;

    return (((a << 8) | b) >> (view.bitCursor + 2)) & 0x7F;
}

function _nextBit8(view) { // @arg Object - { source, cursor, bitCursor }
                           // @ret UINT8 - 8 bits value
    if (view.bitCursor === 7) {
        return (view.source[view.cursor] || 0) >>> 0;
    }
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;

    return (((a << 8) | b) >> (view.bitCursor + 1)) & 0xFF;
}

function _nextBit16(view) { // @arg Object - { source, cursor, bitCursor }
                            // @ret UINT16 - 16 bits value
    if (view.bitCursor === 7) {
        return (((view.source[view.cursor    ] || 0)  <<  8) |
                 (view.source[view.cursor + 1] || 0)) >>> 0;
    }
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var c = view.source[view.cursor + 2] || 0;

    return (((a << 16) | (b << 8) | c) >> (view.bitCursor + 1)) & 0xFFFF;
}

function _nextBit24(view) { // @arg Object - { source, cursor, bitCursor }
                            // @ret UINT24 - 24 bits value
    if (view.bitCursor === 7) {
        return (((view.source[view.cursor    ] || 0)  << 16) |
                ((view.source[view.cursor + 1] || 0)  <<  8) |
                 (view.source[view.cursor + 2] || 0)) >>> 0;
    }
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var c = view.source[view.cursor + 2] || 0;
    var d = view.source[view.cursor + 3] || 0;

    return (((a << 24) | (b << 16) | (c << 8) | d) >> (view.bitCursor + 1)) & 0xFFFFFF;
}

function _nextBit32(view) { // @arg Object - { source, cursor, bitCursor }
                            // @ret UINT32 - 32 bits value
    if (view.bitCursor === 7) {
        return (((view.source[view.cursor    ] || 0)  << 24) |
                ((view.source[view.cursor + 1] || 0)  << 16) |
                ((view.source[view.cursor + 2] || 0)  <<  8) |
                 (view.source[view.cursor + 3] || 0)) >>> 0;
    }
    var a = view.source[view.cursor    ] || 0;
    var b = view.source[view.cursor + 1] || 0;
    var c = view.source[view.cursor + 2] || 0;
    var d = view.source[view.cursor + 3] || 0;
    var high = (((a << 8) | b) >> (view.bitCursor + 1)) & 0xFFFF;
    var low  = (((c << 8) | d) >> (view.bitCursor + 1)) & 0xFFFF;

    return (high << 16 | low) >>> 0;
}

function _bitN(view,   // @arg Object - { source, cursor, bitCursor }
               bits) { // @arg UINT8 - read bits(1 - 23)
                       // @ret UINT8 - N bit(s) value
    var value = _nextBitN(view, bits);

    view.bitCursor -= bits;
    while (view.bitCursor < 0) {
        view.bitCursor += 8;
        view.cursor++;
    }
    return value;
}

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
                       // @ret UINT8 - 2 bits value
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
                       // @ret UINT8 - 3 bits value
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
                       // @ret UINT8 - 4 bits value
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
                       // @ret UINT8 - 5 bits value
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
                       // @ret UINT8 - 6 bits value
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
                       // @ret UINT8 - 7 bits value
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
                       // @ret UINT8 - 8 bits value
    var a = view.source[view.cursor++] || 0;
    var b = view.source[view.cursor  ] || 0;

    if (view.bitCursor === 7) {
        return a >>> 0;
    }
    return ((a << 8 | b) >> (view.bitCursor + 1)) & 0xFF;
}

function _bit16(view) { // @arg Object - { source, cursor, bitCursor }
                        // @ret UINT16 - 16 bits value
    var a = view.source[view.cursor++] || 0;
    var b = view.source[view.cursor++] || 0;
    var c = view.source[view.cursor  ] || 0;

    if (view.bitCursor === 7) {
        return ((a << 8) | b) >>> 0;
    }
    return (((a << 16) | (b << 8) | c) >> (view.bitCursor + 1)) & 0xFFFF;
}

function _bit24(view) { // @arg Object - { source, cursor, bitCursor }
                        // @ret UINT24 - 24 bits value
    var a = view.source[view.cursor++] || 0;
    var b = view.source[view.cursor++] || 0;
    var c = view.source[view.cursor++] || 0;
    var d = view.source[view.cursor  ] || 0;

    if (view.bitCursor === 7) {
        return ((a << 16) | (b << 8) | c) >>> 0;
    }
    return (((a << 24) | (b << 16) | (c << 8) | d) >>> (view.bitCursor + 1)) & 0xFFFFFF;
}

function _bit32(view) { // @arg Object - { source, cursor, bitCursor }
                        // @ret UINT32 - 32 bits value
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

