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
                 bitCursor) { // @arg UINT8 = 7 - 7 = MSB, 0 = LSB
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
    "constructor":  { "value": BitView          }, // new BitView(source:Uint8Array, cursor:UINT32 = 0, bitCursor:UINT8 = 7):BitView
    "u":            { "value": Bit_u            }, // BitView#u(bits:UINT8):UINT32
    "nu":           { "value": Bit_nu           }, // BitView#nu(bits:UINT8):UINT32
    "ug":           { "value": Bit_ug           }, // BitView#ug():UINT32
    "sg":           { "value": Bit_sg           }, // BitView#sg():INT32
    "byteAlign":    { "value": Bit_byteAlign    }, // BitView#byteAlign():void
    "byteAligned":  { "get":   Bit_byteAligned  }, // BitView#byteAligned:Boolean
    "EOS":          { "get":   Bit_EOS          }, // BitView#EOS:Boolean
    "length":       { "get":   function()  { return this._view.source.length; } }, // BitView#length:UINT32
    "source":       { "get":   function()  { return this._view.source;        } }, // BitView#source:Uint8Array
    "cursor":       { "get":   function()  { return this._view.cursor;        },   // BitView#cursor:UINT32
                      "set":   function(v) { this._view.cursor = v;           } },
    "bitCursor":    { "get":   function()  { return this._view.bitCursor;     },   // BitView#bitCursor:UINT8
                      "set":   function(v) { this._view.bitCursor = v;        } },
});

// --- implements ------------------------------------------
function Bit_u(bits) { // @arg UINT8 - read bit(s), 1 - 32
                       // @ret UINT32
    var result = this["nu"](bits);

    this._view.bitCursor -= bits;
    while (this._view.bitCursor < 0) {
        this._view.bitCursor += 8;
        this._view.cursor++;
    }
    return result;
}

function Bit_nu(bits) { // @arg UINT8 - read bit(s), 1 - 32
                        // @ret UINT32
    var result = 0;
    var source = this._view.source;
    var cursor = this._view.cursor;
    var bitShift = bits;
    var bitCursor = this._view.bitCursor;
    var combineNextByte = !this["byteAligned"];

    for (var byteOffset = 0; (bitShift -= 8) >= -8; ++byteOffset) {
        var b = source[cursor + byteOffset] || 0;

        if (combineNextByte) {
            var c = source[cursor + byteOffset + 1] || 0;

            b = (((b << 8) | c) >> (bitCursor + 1)) & 0xFF;
        }
        result |= bitShift < 0 ? b >> -bitShift
                               : b <<  bitShift;
    }
    return result >>> 0;
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

function Bit_ug() { // @ret UINT32 - unsigned value
    // ExpGolomb.decode("1")     -> 0
    // ExpGolomb.decode("010")   -> 1
    // ExpGolomb.decode("00100") -> 3
    // ExpGolomb.decode("00111") -> 6

    var bitValue = _bit1(this._view);

    if (bitValue === 1) {
        return 0;
    }

    var zeroLength = 0;

    while (!this["EOS"] && _bit1(this._view) === 0) {
        zeroLength++;
    }
    if (this["EOS"]) {
        return 0;
    }

    var binaryString = ["1"];

    for (var i = 0, iz = zeroLength + 1; !this["EOS"] && i < iz; ++i) {
        binaryString.push( _bit1(this._view) ? "1" : "0" );
    }
    return parseInt(binaryString.join(""), 2) - 1;
}

function Bit_sg() { // @ret INT32 - signed value
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
    var result = this["ug"]();

    if (result === 0) {
        return 0;
    }

    var hasSignedBit = (result & 1) === 0;

    if (hasSignedBit) {
        result = -(result / 2);
    } else {
        result = (result + 1) / 2;
    }
    return result;
}

function Bit_byteAlign() {
    if (this._view.bitCursor !== 7) {
        this._view.bitCursor = 7;
        this._view.cursor += 1;
    }
}

function Bit_byteAligned() { // @arg Boolean
    return this._view.bitCursor === 7;
}

function Bit_EOS() { // @ret Boolean - true is End Of Source
    return this._view.cursor >= this._view.source.length;
}

return BitView; // return entity

});

