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
var BIG_ENDIAN = !new Uint8Array(new Uint16Array([1]).buffer)[0];
var BIT_PATTERN_32 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// --- class / interfaces ----------------------------------
var Bit = {
    "mask":                 Bit_mask,           // Bit.mask(width:UINT8):UINT32
    "split":                Bit_split,          // Bit.split(u32:UINT32, pattern:UINT8Array = null):UINT32Array
    "toBin":                Bit_toBin,          // Bit.toBin(u32:UINT32 = 0, pattern:UINT8Array = null):String
    "toBinHex":             Bit_toBinHex,       // Bit.toBinHex(u32:UINT32 = 0, pattern:UINT8Array = null):String
    "toString":             Bit_toString,       // Bit.toString(u32:UINT32 = 0, pattern:UINT8Array = null, toBinary:Boolean = false):String
    "toIEEE754":            Bit_toIEEE754,      // Bit.toIEEE754(num:Number, toFloat:Boolean = false):Uint32Array
    "popcnt":               Bit_popcnt,         // Bit.popcnt(u32:UINT32):UINT8
    "nlz":                  Bit_nlz,            // Bit.nlz(u32:UINT32):UINT8
    "ntz":                  Bit_ntz,            // Bit.ntz(u32:UINT32):UINT8
    "repository":           "https://github.com/uupaa/Bit.js"
};

// --- implements ------------------------------------------
function Bit_mask(width) { // @arg UINT8 - 0-32
                           // @ret UINT32
                           // @desc make mask bits
    return width >= 32 ? 0xffffffff
         : width <=  0 ? 0
         : ((1 << width) - 1) >>> 0;
}

function Bit_split(u32,       // @arg UINT32 - bits
                   pattern) { // @arg UINT8Array = null - [width, ...]
                              // @ret UINT32Array - [UINT32, ...]
    return _split(u32, pattern || BIT_PATTERN_32);
}

function _split(u32, pattern, widths) {
    var remainBits = 32;
    var i = pattern.length;
    var result = new Array(i);

    while (--i >= 0 && remainBits > 0) {
        var w = pattern[i];
        var v = 0;
        if (w > 0) {
            v = (u32 & (w >= 32 ? 0xffffffff : (1 << w) - 1)) >>> 0;
            u32 = u32 >>> w;
            remainBits -= w;
        }
        result[i] = v;

        if (widths) {
            widths[i] = w;
        }
    }
    return result;
}

function Bit_toBin(u32,       // @arg UINT32 = 0
                   pattern) { // @arg UINT8Array = null
                              // @ret String - "11000,101,..."
    return Bit_toString(u32, pattern);
}

function Bit_toBinHex(u32,       // @arg UINT32 = 0
                      pattern) { // @arg UINT8Array = null
                                 // @ret String - "11000(1f),101(5),..."
    return Bit_toString(u32, pattern, true);
}

function Bit_toString(u32,     // @arg UINT32 = 0
                      pattern, // @arg UINT8Array = null
                      hex) {   // @arg Boolean = false
                               // @ret String - "11000(1f),101(5),..."
    var widths = [];
    var filler = "00000000000000000000000000000000";
    var r = _split(u32, pattern || BIT_PATTERN_32, widths);
    var result = [];
    var i = r.length;

    for (var i = 0, iz = r.length; i < iz; ++i) {
        if (hex) {
            result.push( ((filler + r[i].toString(2)).slice(-widths[i])) +
                         ("(" + r[i].toString(16) + ")") );
        } else {
            result.push( (filler + r[i].toString(2)).slice(-widths[i]) );
        }
    }
    return result.join(",");
}

function Bit_popcnt(u32) { // @arg UINT32 - value
                           // @ret UINT8 - 0-32
                           // @desc population count (counting 1 bits), SSE4.2 POPCNT function
                           // @see http://www.nminoru.jp/~nminoru/programming/bitcount.html
    u32 =  (u32 & 0x55555555) + (u32 >>  1 & 0x55555555);
    u32 =  (u32 & 0x33333333) + (u32 >>  2 & 0x33333333);
    u32 =  (u32 & 0x0f0f0f0f) + (u32 >>  4 & 0x0f0f0f0f);
    u32 =  (u32 & 0x00ff00ff) + (u32 >>  8 & 0x00ff00ff);
    return (u32 & 0x0000ffff) + (u32 >> 16 & 0x0000ffff);
}

function Bit_nlz(u32) { // @arg UINT32 - value
                        // @ret UINT8 - 0-31
                        // @desc Number of Leading Zero
    //  >>x         nlz = 2
    //  00101000
    //      x<<<    ntz = 3
    //
    var f64format = Bit_toIEEE754(u32 === 0 ? 0.5 : u32);
    var exp = (f64format[0] >>> 20) & 0x007ff; // 11 bits
    var bias = 1023;

    return (bias + 31) - exp;
}

function Bit_ntz(u32) { // @arg UINT32 - value
                        // @ret UINT8 - 0-31
                        // @desc Number of Training Zero
    //  >>x         nlz = 2
    //  00101000
    //      x<<<    ntz = 3

    return Bit_popcnt( (~u32) & (u32-1) );
}

function Bit_toIEEE754FloatFormat(num) { // @arg Number
                                         // @ret UINT32
    var sharedBuffer = new ArrayBuffer(4);
    var byteView     = new Uint8Array(sharedBuffer);
    var floatView    = new Float32Array(sharedBuffer);

    floatView[0] = num;

    if (BIG_ENDIAN) {
        return (byteView[0] << 24 | byteView[1]  << 16 |
                byteView[2] <<  8 | byteView[3]) >>> 0;
    }
    return (byteView[3] << 24 | byteView[2]  << 16 |
            byteView[1] <<  8 | byteView[0]) >>> 0;
}

function Bit_toIEEE754(num,       // @arg Number
                       toFloat) { // @arg Boolean = false
                                  // @ret Uint32Array(2)
    toFloat = toFloat || false;

    var sharedBuffer = new ArrayBuffer(8);
    var byteView     = new Uint8Array(sharedBuffer);
    var binView      = toFloat ? new Float32Array(sharedBuffer)  // Single-precision
                               : new Float64Array(sharedBuffer); // Double-precision
    binView[0] = num;

    if (toFloat) {
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
        var i = BIG_ENDIAN ? [0, 1, 2, 3] : [3, 2, 1, 0];

        return (byteView[i[0]] << 24 | byteView[i[1]]  << 16 |
                byteView[i[2]] <<  8 | byteView[i[3]]) >>> 0;
    }

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
    var i = BIG_ENDIAN ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

    return new Uint32Array([(byteView[i[0]] << 24 | byteView[i[1]]  << 16 |
                             byteView[i[2]] <<  8 | byteView[i[3]]) >>> 0,
                            (byteView[i[4]] << 24 | byteView[i[5]]  << 16 |
                             byteView[i[6]] <<  8 | byteView[i[7]]) >>> 0]);
}

return Bit; // return entity

});

