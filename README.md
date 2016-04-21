# Bit.js [![Build Status](https://travis-ci.org/uupaa/Bit.js.svg)](https://travis-ci.org/uupaa/Bit.js)

[![npm](https://nodei.co/npm/uupaa.bit.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.bit.js/)

Bit.js is a JavaScript library that supports the analysis of binary data. It aggregates the low-level bit manipulation functions.


This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/Bit.js/wiki/)
- [API Spec](https://github.com/uupaa/Bit.js/wiki/Bit)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/Bit.js"></script>
<script src="<module-dir>/lib/BitView.js"></script>
<script>

// get contiguous n bits (bit shift and mask).
Bit.n(0x000000ff, 0b00000000000000000000000011111100) // -> 0x3f,
Bit.n(0x000000ff, 0b00000000000000000000000011000000) // -> 0x03,

// bit split by bit-pattern
Bit.split32(0xffff1234, [16,4,4,4,4])  // -> [0xffff, 0x1, 0x2, 0x3, 0x4]
                                       //         16    4    4    4    4 bits

Bit.split24(0xff1234, [16,4,4]) // -> [0xff, 0x1, 0x2, 0x3, 0x4]
Bit.split16(0x1234,   [8,8])    // -> [0x12, 0x34]
Bit.split8(0xfe,      [2,2,4])  // -> [0x3, 0x3, 0xe]

// With ES6 Destructuring Assignment
var [a, b, c] = Bit.split32(0x00001234, [16, 8, 8]);
// -> a = 0x12, b = 0x3, c = 0x4

// population count (counting 1 bits)
Bit.popcnt(0x6) // -> 2

// count the number of contiguous 1 bits from Left-side or Right-side
Bit.cnl(0b11001110) // -> 2
Bit.cnr(0b11001110) // -> 3

// Number(Count) of Leading Zero
Bit.nlz(0x6)    // -> 29
Bit.clz(0x6)    // -> 29 (this function is an alias of Bit.nlz)

// Number(Count) of Training Zero
Bit.ntz(0x6)    // -> 1
Bit.ctz(0x6)    // -> 1 (this function is an alias of Bit.ntz)

// binary dump
Bit.dump(0x12345678, [4,4,8,4,4,8]);
// -> "0001, 0010, 00110100, 0101, 0110, 01111000"

// verbose dump
Bit.dump(0x12345678, bitPattern, true);
// -> "00010010001101000101011001111000(0x12345678), 0001(1,0x1), 0010(2,0x2), 00110100(52,0x34), 0101(5,0x5), 0110(6,0x6), 01111000(120,0x78)"

// get IEEE754 expression
var doublePrecision = true;
var u32array = Bit.IEEE754(0.15625, doublePrecision);
Bit.dump(u32array[0], [1,11,20]) + Bit.dump(u32array[1], [32])
// -> "0, 01111111100, 0100000000000000000000000000000000000000000000000000"


// BitView
var bitView = new BitView(new Uint8Array([0, 1, 2, 3, 0xFF, 0xFE, 0xFD, 0xFC]));

                    // read 32 bit
bitView.u32         // -> 0x00010203

                    // read 24 bit
bitView.u24         // -> 0xFFFEFD

                    // read 1 bit
bitView.u1          // -> 0x1  `11111100` (0xFC)
                    //          ~

                    // read 2 bit
bitView.u2          // -> 0x3  `11111100` (0xFC)
                    //           ~~

                    // read 5 bit
bitView.u5          // -> 0x1C `11111100` (0xFC)
                    //             ~~~~~

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/Bit.js");
importScripts("<module-dir>lib/BitView.js");

...
```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/Bit.js");
require("<module-dir>lib/BitView.js");

...
```

