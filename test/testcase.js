var ModuleTestBits = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("Bit", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        // generic test
        testBit_mask,
        testBit_split,
        testBit_popcnt,
        testBit_nlz,
        testBit_ntz,
        testBit_bin,
        testBit_dump,
        testBit_IEEE754,
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        // browser and node-webkit test
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testBit_mask(test, pass, miss) {
    var result = {
        1: Bit.mask(0)  === 0x0000,
        2: Bit.mask(1)  === 0x0001,
        3: Bit.mask(2)  === 0x0003,
        4: Bit.mask(3)  === 0x0007,
        5: Bit.mask(4)  === 0x000f,
        6: Bit.mask(5)  === 0x001f,
        7: Bit.mask(6)  === 0x003f,
        8: Bit.mask(7)  === 0x007f,
        9: Bit.mask(8)  === 0x00ff,
       10: Bit.mask(9)  === 0x01ff,
       11: Bit.mask(10) === 0x03ff,
       12: Bit.mask(11) === 0x07ff,
       13: Bit.mask(12) === 0x0fff,
       14: Bit.mask(13) === 0x1fff,
       15: Bit.mask(14) === 0x3fff,
       16: Bit.mask(15) === 0x7fff,
       17: Bit.mask(16) === 0xffff,
       18: Bit.mask(31) === 0x7fffffff,
       19: Bit.mask(32) === 0xffffffff,
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_split(test, pass, miss) {
    var BIT_PATTERN = {
        "BIT":    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        "NIBBLE": [4, 4, 4, 4, 4, 4, 4, 4],
        "BYTE":   [8, 8, 8, 8],
        "WORD":   [16, 16],
    };
    function _join(u32array) {
        if (u32array.join) { // ES6 TypedArray.prototype.join()
            return u32array.join();
        }
        return [].slice.call(u32array).join(); // ES5 polyfill
    }

    var result = {
        // 32 bit
        1: _join(Bit.split(0xaaaa5555, BIT_PATTERN.BIT))    === [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
                                                                 0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1].join(),
        2: _join(Bit.split(0xaaaa5555))                     === [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
                                                                 0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1].join(),
        3: _join(Bit.split(0xabcdef01, BIT_PATTERN.NIBBLE)) === [10,11,12,13,14,15,0,1].join(),
        4: _join(Bit.split(0xabcdef01, BIT_PATTERN.BYTE))   === [0xab, 0xcd, 0xef, 0x01].join(),
        5: _join(Bit.split(0xabcdef01, BIT_PATTERN.WORD))   === [0xabcd, 0xef01].join(),
        6: _join(Bit.split(0x00001234, [16,4,4,4,4]))       === [0x0000, 0x1, 0x2, 0x3, 0x4].join(),
        7: _join(Bit.split(0xfedc1234, [4,4,4,4,16]))       === [0xf, 0xe, 0xd, 0xc, 0x1234].join(),
        8: _join(Bit.split(0xfedc1234, [24,8]))             === [0xfedc12, 0x34].join(),
        9: _join(Bit.split(0xfedc1234, [32]))               === [0xfedc1234].join(),
       10: _join(Bit.split(0xfedc1234, [0,16]))             === [0,0x1234].join(),
        // --- wrong use ---
       20: _join(Bit.split(0xfedc1234, [0]))                === [0].join(),
       21: _join(Bit.split(0xfedc1234, [-1]))               === [0].join(),
       22: _join(Bit.split(0xfedc1234, [33]))               === [0xfedc1234].join(),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_popcnt(test, pass, miss) {

    var result = {
        1: Bit.popcnt(0x0) === 0, // 0b0000
        2: Bit.popcnt(0x1) === 1, // 0b0001
        3: Bit.popcnt(0x2) === 1, // 0b0010
        4: Bit.popcnt(0x3) === 2, // 0b0011
        5: Bit.popcnt(0x4) === 1, // 0b0100
        6: Bit.popcnt(0x5) === 2, // 0b0101
        7: Bit.popcnt(0x6) === 2, // 0b0110
        8: Bit.popcnt(0xffffffff) === 32,
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_nlz(test, pass, miss) {

    var result = {                      //   fedcba9876543210fedcba9876543210
        1: Bit.nlz(0x0) === 32,         // 0b00000000000000000000000000000000
        2: Bit.nlz(0x1) === 31,         // 0b00000000000000000000000000000001
        3: Bit.nlz(0x2) === 30,         // 0b00000000000000000000000000000010
        4: Bit.nlz(0x3) === 30,         // 0b00000000000000000000000000000011
        5: Bit.nlz(0x4) === 29,         // 0b00000000000000000000000000000100
        6: Bit.nlz(0x5) === 29,         // 0b00000000000000000000000000000101
        7: Bit.nlz(0x6) === 29,         // 0b00000000000000000000000000000110
        8: Bit.nlz(0x00000fff) === 20,  // 0b00000000000000000000111111111111
        9: Bit.nlz(0x0000ffff) === 16,  // 0b00000000000000001111111111111111
       10: Bit.nlz(0x000fffff) === 12,  // 0b00000000000011111111111111111111
       11: Bit.nlz(0x00ffffff) ===  8,  // 0b00000000111111111111111111111111
       12: Bit.nlz(0x01ffffff) ===  7,  // 0b00000001111111111111111111111111
       13: Bit.nlz(0x03ffffff) ===  6,  // 0b00000011111111111111111111111111
       14: Bit.nlz(0x07ffffff) ===  5,  // 0b00000111111111111111111111111111
       15: Bit.nlz(0x0fffffff) ===  4,  // 0b00001111111111111111111111111111
       16: Bit.nlz(0x1fffffff) ===  3,  // 0b00011111111111111111111111111111
       17: Bit.nlz(0x3fffffff) ===  2,  // 0b00111111111111111111111111111111
       18: Bit.nlz(0x7fffffff) ===  1,  // 0b01111111111111111111111111111111
       19: Bit.nlz(0xffffffff) ===  0,  // 0b11111111111111111111111111111111
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_ntz(test, pass, miss) {

    var result = {                      //   fedcba9876543210fedcba9876543210
        1: Bit.ntz(0x0) === 32,         // 0b00000000000000000000000000000000
        2: Bit.ntz(0x1) ===  0,         // 0b00000000000000000000000000000001
        3: Bit.ntz(0x2) ===  1,         // 0b00000000000000000000000000000010
        4: Bit.ntz(0x3) ===  0,         // 0b00000000000000000000000000000011
        5: Bit.ntz(0x4) ===  2,         // 0b00000000000000000000000000000100
        6: Bit.ntz(0x5) ===  0,         // 0b00000000000000000000000000000101
        7: Bit.ntz(0x6) ===  1,         // 0b00000000000000000000000000000110
        8: Bit.ntz(0x00000fff) ===  0,  // 0b00000000000000000000111111111111
        9: Bit.ntz(0x0000ffff) ===  0,  // 0b00000000000000001111111111111111
       10: Bit.ntz(0x000fffff) ===  0,  // 0b00000000000011111111111111111111
       11: Bit.ntz(0x00ffffff) ===  0,  // 0b00000000111111111111111111111111
       12: Bit.ntz(0x01ffffff) ===  0,  // 0b00000001111111111111111111111111
       13: Bit.ntz(0x03ffffff) ===  0,  // 0b00000011111111111111111111111111
       14: Bit.ntz(0x07ffffff) ===  0,  // 0b00000111111111111111111111111111
       15: Bit.ntz(0x0fffffff) ===  0,  // 0b00001111111111111111111111111111
       16: Bit.ntz(0x1fffffff) ===  0,  // 0b00011111111111111111111111111111
       17: Bit.ntz(0x3fffffff) ===  0,  // 0b00111111111111111111111111111111
       18: Bit.ntz(0x7fffffff) ===  0,  // 0b01111111111111111111111111111111
       19: Bit.ntz(0xffffffff) ===  0,  // 0b11111111111111111111111111111111
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_bin(test, pass, miss) {
    var result = {
      101: Bit.bin(0x00000000, [4,4,4,4,4,4,4,4]) === "0000,0000,0000,0000,0000,0000,0000,0000",
      102: Bit.bin(0x12345678, [4,4,4,4,4,4,4,4]) === "0001,0010,0011,0100,0101,0110,0111,1000",
      103: Bit.bin(0x12345678, [16,12,4])         === "0001001000110100,010101100111,1000",
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_dump(test, pass, miss) {
    var result = {
      111: Bit.dump(0x00000000, [4,4,4,4,4,4,4,4]) === "0000(0),0000(0),0000(0),0000(0),0000(0),0000(0),0000(0),0000(0)",
      112: Bit.dump(0x12345678, [4,4,4,4,4,4,4,4]) === "0001(1),0010(2),0011(3),0100(4),0101(5),0110(6),0111(7),1000(8)",
      113: Bit.dump(0x12345678, [16,12,4])         === "0001001000110100(1234),010101100111(567),1000(8)",
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_IEEE754(test, pass, miss) {
    var a = Bit.IEEE754(0.15625,  false);   // Single-precision, Uint32Array
    var b = Bit.IEEE754(-118.625, false);   // Single-precision, Uint32Array
    var c = Bit.IEEE754(0.15625,  true);    // Double-precision, Uint32Array
    var d = Bit.IEEE754(-118.625, true);    // Double-precision, Uint32Array

    var result = {
        1: Bit.dump(a[0], [1, 8, 23]) === "0(0),01111100(7c),01000000000000000000000(200000)",
        2: Bit.dump(b[0], [1, 8, 23]) === "1(1),10000101(85),11011010100000000000000(6d4000)",
        3: Bit.dump(c[0], [1,11,20])  === "0(0),01111111100(3fc),01000000000000000000(40000)",
        4: Bit.dump(c[1], [32])       === "00000000000000000000000000000000(0)",
        5: Bit.dump(d[0], [1,11,20])  === "1(1),10000000101(405),11011010100000000000(da800)",
        6: Bit.dump(d[1], [32])       === "00000000000000000000000000000000(0)",
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

return test.run();

})(GLOBAL);

