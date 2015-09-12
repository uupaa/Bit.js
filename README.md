# Bit.js [![Build Status](https://travis-ci.org/uupaa/Bit.js.svg)](https://travis-ci.org/uupaa/Bit.js)

[![npm](https://nodei.co/npm/uupaa.bit.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.bit.js/)

Bit operation

- Please refer to [Spec](https://github.com/uupaa/Bit.js/wiki/) and [API Spec](https://github.com/uupaa/Bit.js/wiki/Bit) links.
- The Bit.js is made of [WebModule](https://github.com/uupaa/WebModule).

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/Bit.js"></script>
<script>

// bit shift and mask operation
Bit.mask(0x1234, 4, 4)  // -> 0x3

// population count (counting 1 bits)
Bit.popcnt(0x6)         // -> 2

// Number of Leading Zero
Bit.nlz(0x6)            // -> 29

// Number of Training Zero
Bit.ntz(0x6)            // -> 1

Bit.toBinaryFormatString(0x10001000, { comma: true })
// -> "0001,0000,0000,0000,0001,0000,0000,0000"

Bit.toBinaryFormatString(Bit.toIEEE754FloatFormat(0.15625),  { comma: true })
// -> "0011,1110,0010,0000,0000,0000,0000,0000"

Bit.toBinaryFormatString(Bit.toIEEE754DoubleFormat(0.15625), { comma: true })
// -> "0011,1111,1100,0100,0000,0000,0000,0000 0000,0000,0000,0000,0000,0000,0000,0000"

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

