# Bit.js [![Build Status](https://travis-ci.org/uupaa/Bit.js.svg)](https://travis-ci.org/uupaa/Bit.js)

[![npm](https://nodei.co/npm/uupaa.bit.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.bit.js/)

Bit.js is a JavaScript library that supports the analysis of binary data. It aggregates the low-level bit manipulation functions.

- Please refer to [Spec](https://github.com/uupaa/Bit.js/wiki/) and [API Spec](https://github.com/uupaa/Bit.js/wiki/Bit) links.
- The Bit.js is made of [WebModule](https://github.com/uupaa/WebModule).

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/Bit.js"></script>
<script>

// make bit mask
Bit.mask(2)     // -> 0x03
Bit.mask(4)     // -> 0x0f

// bit split by bit-pattern
Bit.split(0xffff1234, [16,4,4,4,4])  // -> [0xffff,0x1,0x2,0x3,0x4]

// population count (counting 1 bits)
Bit.popcnt(0x6) // -> 2

// Number of Leading Zero
Bit.nlz(0x6)    // -> 29

// Number of Training Zero
Bit.ntz(0x6)    // -> 1

// binary dump
Bit.bin(0x12345678, [4,4,8,4,4,8])
// -> "0001, 0010, 00110100, 0101, 0110, 01111000"

// binary(hex) dump
Bit.dump(0x12345678, [4,4,8,4,4,8]);
// -> "0001(1), 0010(2), 00110100(34), 0101(5), 0110(6), 01111000(78)"

// dump IEEE754 internal format
var doublePrecision = true;
var u32array = Bit.IEEE754(0.15625, doublePrecision);
Bit.bin(u32array[0], [1,11,20]) + Bit.bin(u32array[1], [32])
// -> "0, 01111111100, 0100000000000000000000000000000000000000000000000000"

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/Bit.js");

...
```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/Bit.js");

...
```

