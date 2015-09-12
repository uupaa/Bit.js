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
        testBit_pick,
        testBit_popcnt,
        testBit_nlz,
        testBit_ntz,
        testBit_toBinaryFormatString,
        testBit_toIEEE754FloatFormat,
        testBit_toIEEE754DoubleFormat,
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
function testBit_pick(test, pass, miss) {
    var result = {
        1: Bit.pick(0x00001234,  4,  3) === 0x4,
        2: Bit.pick(0x00001234,  4,  7) === 0x3,
        3: Bit.pick(0x00001234,  4, 11) === 0x2,
        4: Bit.pick(0x00001234,  4, 15) === 0x1,
        5: Bit.pick(0xfedc1234,  4, 19) === 0xc,
        6: Bit.pick(0xfedc1234,  4, 23) === 0xd,
        7: Bit.pick(0xfedc1234,  4, 27) === 0xe,
        8: Bit.pick(0xfedc1234,  4, 31) === 0xf,
        9: Bit.pick(0xfedc1234,  4    ) === 0xf,
       10: Bit.pick(0x00001234, 32, 31) === 0x00001234,
       11: Bit.pick(0x00001234, 32)     === 0x00001234,
       12: Bit.pick(0x00001235,  1,  0) === 0x1,
       13: Bit.pick(0x00001235,  1,  1) === 0x0,
       14: Bit.pick(0x80000000,  1, 31) === 0x1,
       15: Bit.pick(0x80000000,  1)     === 0x1,
       // --- wrong use ---
       16: Bit.pick(0xfedc1234, 32, 30) === 0x7edc1234, // width too big
       17: Bit.pick(0xfedc1234, 32, 29) === 0x3edc1234, // width too big
       18: Bit.pick(0xfedc1234, 32, 16) === 0x00001234, // width too big
       19: Bit.pick(0xfedc1234, 32, 16) === 0x00001234, // width too big
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

function testBit_toBinaryFormatString(test, pass, miss) {
    var result = {
        1: Bit.toBinaryFormatString(0x00000000, { comma: true }) === "0000,0000,0000,0000,0000,0000,0000,0000",
        2: Bit.toBinaryFormatString(0x00001000, { comma: true }) === "0000,0000,0000,0000,0001,0000,0000,0000",
        3: Bit.toBinaryFormatString(0x10001000, { comma: true }) === "0001,0000,0000,0000,0001,0000,0000,0000",
        4: Bit.toBinaryFormatString(0xffff0000, { comma: true }) === "1111,1111,1111,1111,0000,0000,0000,0000",
        5: Bit.toBinaryFormatString(0xffffffff, { comma: true }) === "1111,1111,1111,1111,1111,1111,1111,1111",
        6: Bit.toBinaryFormatString(0xffffffff)                  === "11111111111111111111111111111111",
        7: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 1 })  === "1",
        8: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 2 })  === "11",
        9: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 4 })  === "1111",
       10: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 8 })  === "1111,1111",
       11: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 11 }) ===  "111,1111,1111",
       12: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 16 }) === "1111,1111,1111,1111",
       13: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 24 }) === "1111,1111,1111,1111,1111,1111",
       14: Bit.toBinaryFormatString(0xffffffff, { comma: true, width: 32 }) === "1111,1111,1111,1111,1111,1111,1111,1111",
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_toIEEE754FloatFormat(test, pass, miss) {
    var result = {
        1: Bit.toBinaryFormatString(Bit.toIEEE754FloatFormat(0.15625),  { comma: true }) === "0011,1110,0010,0000,0000,0000,0000,0000",
        2: Bit.toBinaryFormatString(Bit.toIEEE754FloatFormat(-118.625), { comma: true }) === "1100,0010,1110,1101,0100,0000,0000,0000",
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_toIEEE754DoubleFormat(test, pass, miss) {
    var result = {
        1: Bit.toBinaryFormatString(Bit.toIEEE754DoubleFormat(0.15625),  { comma: true }) === "0011,1111,1100,0100,0000,0000,0000,0000 0000,0000,0000,0000,0000,0000,0000,0000",
        2: Bit.toBinaryFormatString(Bit.toIEEE754DoubleFormat(-118.625), { comma: true }) === "1100,0000,0101,1101,1010,1000,0000,0000 0000,0000,0000,0000,0000,0000,0000,0000",
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

return test.run();

})(GLOBAL);

