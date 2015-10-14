(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Bit", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
var BIG_ENDIAN    = !new Uint8Array(new Uint16Array([1]).buffer)[0];
var SHARED_BUFFER = new ArrayBuffer(8);
var BYTE_VIEW     = new Uint8Array(SHARED_BUFFER);
var FLOAT32_VIEW  = new Float32Array(SHARED_BUFFER); // Single-precision
var FLOAT64_VIEW  = new Float64Array(SHARED_BUFFER); // Double-precision
var BYTE_ORDER32  = BIG_ENDIAN ? [0, 1, 2, 3] : [3, 2, 1, 0];
var BYTE_ORDER64  = BIG_ENDIAN ? [0, 1, 2, 3, 4, 5, 6, 7]
                               : [7, 6, 5, 4, 3, 2, 1, 0];

// --- class / interfaces ----------------------------------
var Bit = {
    "mask":         Bit_mask,       // Bit.mask(width:UINT8):UINT32
    "split1":       Bit_split1,     // Bit.split1(u32:UINT32, pattern:UINT8Array|Uint8Array):UINT32Array
    "split2":       Bit_split2,     // Bit.split2(u32:UINT32, pattern:UINT8Array|Uint8Array):UINT32Array
    "split3":       Bit_split3,     // Bit.split3(u32:UINT32, pattern:UINT8Array|Uint8Array):UINT32Array
    "split4":       Bit_split4,     // Bit.split4(u32:UINT32, pattern:UINT8Array|Uint8Array):UINT32Array
    "popcnt":       Bit_popcnt,     // Bit.popcnt(u32:UINT32):UINT8
    "nlz":          Bit_nlz,        // Bit.nlz(u32:UINT32):UINT8
    "ntz":          Bit_ntz,        // Bit.ntz(u32:UINT32):UINT8
    "dump":         Bit_dump,       // Bit.dump(u32:UINT32 = 0, pattern:UINT8Array|Uint8Array, radix:UINT8 = 2):String
    "IEEE754":      Bit_IEEE754,    // Bit.IEEE754(num:Number, doublePrecision:Boolean = false):Uint32Array
    "repository":   "https://github.com/uupaa/Bit.js"
};

// --- implements ------------------------------------------
function Bit_mask(width) { // @arg UINT8 - 0-32
                           // @ret UINT32
                           // @desc make mask bits
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(width, "UINT8"),     Bit_mask, "width");
        $valid(width >= 0 && width <= 32, Bit_mask, "width");
    }
//}@dev

    return width >= 32 ? 0xffffffff
         : width <=  0 ? 0
         : ((1 << width) - 1) >>> 0;
}

function Bit_split1(u32,       // @arg UINT32 - bits
                    pattern) { // @arg UINT8Array|Uint8Array - [width, ...]
                               // @ret UINT32Array - [UINT32, ...]
    return _split(u32 & 0x000000ff, pattern, 8);
}

function Bit_split2(u32,       // @arg UINT32 - bits
                    pattern) { // @arg UINT8Array|Uint8Array = null - [width, ...]
                               // @ret UINT32Array - [UINT32, ...]
    return _split(u32 & 0x0000ffff, pattern, 16);
}

function Bit_split3(u32,       // @arg UINT32 - bits
                    pattern) { // @arg UINT8Array|Uint8Array = null - [width, ...]
                               // @ret UINT32Array - [UINT32, ...]
    return _split(u32 & 0x00ffffff, pattern, 24);
}

function Bit_split4(u32,       // @arg UINT32 - bits
                    pattern) { // @arg UINT8Array|Uint8Array = null - [width, ...]
                               // @ret UINT32Array - [UINT32, ...]
    return _split((u32 & 0xffffffff) >>> 0, pattern, 32);
}

function _split(u32,          // @arg UINT32
                pattern,      // @arg UINT8Array|Uint8Array
                maxBitLength, // @arg UINT8
                bitLength) {  // @arg Array|null
                              // @ret Array
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(u32,     "UINT32"), _split, "u32");
        $valid($type(pattern, "UINT8Array|Uint8Array"), _split, "pattern");
    }
//}@dev

    var i = 0, iz = pattern.length, remainBits = maxBitLength;
    var result = new Array(iz);

    for (; i < iz; ++i) {
        var w = pattern[i];
        var v = 0;

        if (remainBits > 0) {
            if (w > 0) {
                if (w > remainBits) {
                    w = remainBits;
                }
                var vv = u32 >>> (remainBits - w);
                var ww = w >= maxBitLength ? 0xffffffff : (1 << w) - 1;

                v = (vv & ww) >>> 0;
                remainBits -= w;
            }
        }
        result[i] = v;

        if (bitLength) {
            bitLength[i] = w;
        }
    }
    return result;
}

function Bit_dump(u32,     // @arg UINT32 = 0
                  pattern, // @arg UINT8Array|Uint8Array
                  radix) { // @arg UINT8 = 2
                           // @ret String - "11000,101,...", "11000(1f),101(5),..."
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(u32,     "UINT32"),                Bit_dump, "u32");
        $valid($type(pattern, "UINT8Array|Uint8Array"), Bit_dump, "pattern");
        $valid($type(radix,   "UINT8|omit"),            Bit_dump, "radix");
    }
//}@dev

    radix = radix || 2;

    var bitLength = [];
    var filler = "00000000000000000000000000000000";
    var r = _split(u32, pattern, 32, bitLength);
    var result = [];

    for (var i = 0, iz = r.length; i < iz; ++i) {
        var w = bitLength[i] ? bitLength[i] : 1;
        var v = filler + r[i].toString(2);

        if (radix === 2) {
            result.push( v.slice(-w) );
        } else {
            result.push( v.slice(-w) + ("(" + r[i].toString(radix) + ")") );
        }
    }
    return result.join(", ");
}

function Bit_popcnt(u32) { // @arg UINT32 - value
                           // @ret UINT8 - 0-32
                           // @desc population count (counting 1 bits), SSE4.2 POPCNT function
                           // @see http://www.nminoru.jp/~nminoru/programming/bitcount.html
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(u32, "UINT32"), Bit_popcnt, "u32");
    }
//}@dev

    u32 =  (u32 & 0x55555555) + (u32 >>  1 & 0x55555555);
    u32 =  (u32 & 0x33333333) + (u32 >>  2 & 0x33333333);
    u32 =  (u32 & 0x0f0f0f0f) + (u32 >>  4 & 0x0f0f0f0f);
    u32 =  (u32 & 0x00ff00ff) + (u32 >>  8 & 0x00ff00ff);
    return (u32 & 0x0000ffff) + (u32 >> 16 & 0x0000ffff);
}

function Bit_nlz(u32) { // @arg UINT32 - value
                        // @ret UINT8 - 0-31
                        // @desc Number of Leading Zero
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(u32, "UINT32"), Bit_nlz, "u32");
    }
//}@dev

    //  >>x         nlz = 2
    //  00101000
    //      x<<<    ntz = 3
    //
    var f64 = Bit_IEEE754(u32 === 0 ? 0.5 : u32, true); // Double-precision
    var exp = (f64[0] >>> 20) & 0x007ff; // 11 bits
    var bias = 1023;

    return (bias + 31) - exp;
}

function Bit_ntz(u32) { // @arg UINT32 - value
                        // @ret UINT8 - 0-31
                        // @desc Number of Training Zero
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(u32, "UINT32"), Bit_ntz, "u32");
    }
//}@dev

    //  >>x         nlz = 2
    //  00101000
    //      x<<<    ntz = 3

    return Bit_popcnt( ((~u32) & (u32 - 1)) >>> 0 );
}

function Bit_IEEE754(num,               // @arg Number
                     doublePrecision) { // @arg Boolean = false - Double-precision
                                        // @ret Uint32Array - [high, low]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(num,             "Number"),       Bit_IEEE754, "num");
        $valid($type(doublePrecision, "Boolean|omit"), Bit_IEEE754, "doublePrecision");
    }
//}@dev

    var order = null, high = 0, low  = 0;

    if (doublePrecision) {
        // to IEEE754 Double-precision floating-point format.
        //
        // sign exponent  fraction
        //  +-++--------++-----------------------+
        //  |0||0......0||0.....................0|
        //  +-++--------++-----------------------+
        //   1     11               52 bits
        //   -  --------  -----------------------
        //   63 62    52  51                    0
        //
        order = BYTE_ORDER64;
        FLOAT64_VIEW[0] = num;
        high = BYTE_VIEW[order[0]] << 24 | BYTE_VIEW[order[1]] << 16 |
               BYTE_VIEW[order[2]] <<  8 | BYTE_VIEW[order[3]];
        low  = BYTE_VIEW[order[4]] << 24 | BYTE_VIEW[order[5]] << 16 |
               BYTE_VIEW[order[6]] <<  8 | BYTE_VIEW[order[7]];
    } else {
        // to IEEE754 Single-precision floating-point format.
        //
        // sign exponent  fraction
        //  +-++--------++-----------------------+
        //  |0||00000000||00000000000000000000000|
        //  +-++--------++-----------------------+
        //   1      8               23 bits
        //   -  --------  -----------------------
        //   31 30    23  22                    0
        //
        order = BYTE_ORDER32;
        FLOAT32_VIEW[0] = num;
        high = BYTE_VIEW[order[0]] << 24 | BYTE_VIEW[order[1]] << 16 |
               BYTE_VIEW[order[2]] <<  8 | BYTE_VIEW[order[3]];
    }
    return new Uint32Array([high >>> 0, low >>> 0]);
}

return Bit; // return entity

});

