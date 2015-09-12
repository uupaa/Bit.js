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

Bit.mask(0x1234, 4, 4) === 0x3; // -> true
Bit.popcnt(0x6) === 2;          // -> true
Bit.nlz(0x6) === 29;            // -> true
Bit.ntz(0x6) ===  1;            // -> true

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

