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

// --- class / interfaces ----------------------------------
var Bit = {
    "mask":                 Bit_mask,                   // Bit.mask(width:UINT8):UINT32
    "pick":                 Bit_pick,                   // Bit.pick(u32:UINT32, width:UINT8, pos:UINT8 = 31):UINT32
    "popcnt":               Bit_popcnt,                 // Bit.popcnt(u32:UINT32):UINT8
    "nlz":                  Bit_nlz,                    // Bit.nlz(u32:UINT32):UINT8
    "ntz":                  Bit_ntz,                    // Bit.ntz(u32:UINT32):UINT8
    "toBinaryFormatString": Bit_toBinaryFormatString,   // Bit.toBinaryFormatString(u32:UINT32|Uint32Array|NumberArray, options:Object = {}):BinaryFormatString
    "toIEEE754FloatFormat": Bit_toIEEE754FloatFormat,   // Bit.toIEEE754FloatFormat(num:Number):UINT32
    "toIEEE754DoubleFormat":Bit_toIEEE754DoubleFormat,  // Bit.toIEEE754DoubleFormat(num:Number):Uint32Array
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

function Bit_pick(u32,   // @arg UINT32 - bits
                  width, // @arg UINT8 - 1-32
                  pos) { // @arg UINT8 = 31 - position. 31-0
                         // @ret UINT32
                         // @desc pick up ${width} bits from bit position ${pos}
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(u32,   "UINT32"),     Bit_pick, "u32");
        $valid($type(width, "UINT8"),      Bit_pick, "width");
        $valid($type(pos,   "UINT8|omit"), Bit_pick, "pos");
        $valid(width >= 1  && width <= 32, Bit_pick, "width");
        if (pos) {
            $valid(pos <= 31 && pos >= 0,  Bit_pick, "pos");
        }
    }
//}@dev

    pos   = pos === undefined ? 31 : pos;
    width = (width > pos + 1) ? pos + 1 : width; // width too big -> reduce width

    var shift = pos + 1 - width;

    return ((u32 >>> shift) & Bit_mask(width)) >>> 0;
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
    var f64format = Bit_toIEEE754DoubleFormat(u32 === 0 ? 0.5 : u32);
    var exp = (f64format[0] >>> 20) & 0x007ff; // 11 bits
    var bias = 1023;

//  console.log(u32.toString(16), Bit_toBinaryFormatString(f64format, { comma: true }),
//              exp,              Bit_toBinaryFormatString(exp, { comma: true, width: 16 }));
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

function Bit_toIEEE754DoubleFormat(num) { // @arg Number
                                          // @ret Uint32Array(2)
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
    var sharedBuffer = new ArrayBuffer(8);
    var byteView     = new Uint8Array(sharedBuffer);
    var doubleView   = new Float64Array(sharedBuffer);

    doubleView[0] = num;

    if (BIG_ENDIAN) {
        return new Uint32Array([(byteView[0] << 24 | byteView[1]  << 16 |
                                 byteView[2] <<  8 | byteView[3]) >>> 0,
                                (byteView[4] << 24 | byteView[5]  << 16 |
                                 byteView[6] <<  8 | byteView[7]) >>> 0]);
    }
    return new Uint32Array([(byteView[7] << 24 | byteView[6]  << 16 |
                             byteView[5] <<  8 | byteView[4]) >>> 0,
                            (byteView[3] << 24 | byteView[2]  << 16 |
                             byteView[1] <<  8 | byteView[0]) >>> 0]);
}

function Bit_toBinaryFormatString(u32,       // @arg UINT32|Uint32Array|NumberArray
                                  options) { // @arg Object - { comma, joint, width }
                                             // @options.comma Boolean = false
                                             // @options.joint String = " "
                                             // @options.width UINT8 = 32 - 1-32
                                             // @ret BinaryFormatString
    // to binary format string
    //
    // Bit_toBinaryFormatString(4, { comma: true })
    //  -> "0000,0000,0000,0000,0000,0000,0000,0100"

    options = options || {};

    var comma = options["comma"] || false;
    var joint = options["joint"] || " ";
    var width = options["width"] || 32;
    var buffer = [];
    var filler = "00000000000000000000000000000000";
    var u32Array = typeof u32 === "number" ? new Uint32Array([u32])
                 : Array.isArray(u32)      ? new Uint32Array(u32)
                                           : u32;

    for (var i = 0, iz = u32Array.length; i < iz; ++i) {
        var bin = (filler + u32Array[i].toString(2)).slice(-width);

        buffer.push(comma ? bin.replace(/(\d)(?=(\d\d\d\d)+(?!\d))/g, "$1,")
                          : bin);
    }
    return buffer.join(joint);
}

return Bit; // return entity

});

