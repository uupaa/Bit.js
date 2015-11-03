var ModuleTestBit = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("Bit", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    }).add([
        testBit_mask,
        testBit_split,
        testBit_popcnt,
        testBit_nlz,
        testBit_ntz,
        testBit_dump,
        testBit_IEEE754,
        testBit_BitView,
    ]);

if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        // Browser, NW.js and Electron test
    ]);
} else if (IN_WORKER) {
    test.add([
        // WebWorkers test
    ]);
} else if (IN_NODE) {
    test.add([
        // Node.js test
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
        "BIT8":   [1, 1, 1, 1, 1, 1, 1, 1],
        "BIT16":  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        "BIT24":  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 1, 1, 1, 1, 1, 1, 1],
        "BIT32":  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        "NIBBLE": [4, 4, 4, 4, 4, 4, 4, 4],
        "BYTE":   [8, 8, 8, 8],
        "WORD":   [16, 16],
    };

    var result = {
        // 32 bit
        1: Bit.split4(0xaaaa5555, BIT_PATTERN.BIT32).join()  === [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0, 0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1].join(),
        3: Bit.split4(0xabcdef01, BIT_PATTERN.NIBBLE).join() === [10,11,12,13,14,15,0,1].join(),
        4: Bit.split4(0xabcdef01, BIT_PATTERN.BYTE).join()   === [0xab, 0xcd, 0xef, 0x01].join(),
        5: Bit.split4(0xabcdef01, BIT_PATTERN.WORD).join()   === [0xabcd, 0xef01].join(),
        6: Bit.split4(0x00001234, [16,4,4,4,4]).join()       === [0x0000, 0x1, 0x2, 0x3, 0x4].join(),
        7: Bit.split4(0xfedc1234, [4,4,4,4,16]).join()       === [0xf, 0xe, 0xd, 0xc, 0x1234].join(),
        8: Bit.split4(0xfedc1234, [24,8]).join()             === [0xfedc12, 0x34].join(),
        9: Bit.split4(0xfedc1234, [32]).join()               === [0xfedc1234].join(),
       10: Bit.split4(0xfedc1234, [0,16]).join()             === [0,0xfedc].join(),
       11: Bit.split4(0xfedc1234, [0,16,16]).join()          === [0,0xfedc,0x1234].join(),
       12: Bit.split4(0xfedc1234, [0,16,16,0]).join()        === [0,0xfedc,0x1234,0].join(),
       13: Bit.split4(0xfedc1234, [4]).join()                === [0xf].join(),
       20: Bit.split4(0x12345678, [4,28]).join()             === [0x1, 0x2345678].join(),
       21: Bit.split4(0x12345678, [4,32]).join()             === [0x1, 0x2345678].join(),
       22: Bit.split4(0x12345678, [4,32,0]).join()           === [0x1, 0x2345678,0].join(),
      // 24 bit
      101: Bit.split3(0xffaa5555, BIT_PATTERN.BIT24).join()    === [1,0,1,0,1,0,1,0, 0,1,0,1,0,1,0,1, 0,1,0,1,0,1,0,1].join(),
      103: Bit.split3(0xffcdef01, [4, 4, 4, 4, 4, 4]).join()   === [12,13,14,15,0,1].join(),
      104: Bit.split3(0xffcdef01, [8, 8, 8]).join()            === [0xcd, 0xef, 0x01].join(),
      105: Bit.split3(0xffcdef01, [8, 16]).join()              === [0xcd, 0xef01].join(),
      106: Bit.split3(0xff001234, [8,4,4,4,4]).join()          === [0x00, 0x1, 0x2, 0x3, 0x4].join(),
      107: Bit.split3(0xffdc1234, [4,4,16]).join()             === [0xd, 0xc, 0x1234].join(),
      108: Bit.split3(0xffdc1234, [16,8]).join()               === [0xdc12, 0x34].join(),
      109: Bit.split3(0xffdc1234, [24]).join()                 === [0xdc1234].join(),
      110: Bit.split3(0xffdc1234, [0,16]).join()               === [0,0xdc12].join(),
      111: Bit.split3(0xffdc1234, [0,16,16]).join()            === [0,0xdc12,0x34].join(),
      112: Bit.split3(0xffdc1234, [0,8,16,0]).join()           === [0,0xdc,0x1234,0].join(),
      113: Bit.split3(0xffdc1234, [4]).join()                  === [0xd].join(),
      120: Bit.split3(0xff345678, [4,20]).join()               === [0x3, 0x45678].join(),
      121: Bit.split3(0xff345678, [4,32]).join()               === [0x3, 0x45678].join(),
      122: Bit.split3(0xff345678, [4,32,0]).join()             === [0x3, 0x45678,0].join(),
      // 16 bit
      201: Bit.split2(0xffff5555, BIT_PATTERN.BIT16).join()    === [0,1,0,1,0,1,0,1, 0,1,0,1,0,1,0,1].join(),
      203: Bit.split2(0xffffef01, [4, 4, 4, 4]).join()         === [14,15,0,1].join(),
      204: Bit.split2(0xffffef01, [8, 8]).join()               === [0xef, 0x01].join(),
      205: Bit.split2(0xffffef01, [16]).join()                 === [0xef01].join(),
      206: Bit.split2(0xffff1234, [4,4,4,4]).join()            === [0x1, 0x2, 0x3, 0x4].join(),
      207: Bit.split2(0xffff1234, [4,4,8]).join()              === [0x1, 0x2, 0x34].join(),
      208: Bit.split2(0xffff1234, [16,8]).join()               === [0x1234, 0x0].join(),
      209: Bit.split2(0xffff1234, [24]).join()                 === [0x1234].join(),
      210: Bit.split2(0xffff1234, [0,16]).join()               === [0,0x1234].join(),
      211: Bit.split2(0xffff1234, [0,16,16]).join()            === [0,0x1234,0].join(),
      212: Bit.split2(0xffff1234, [0,8,8,0]).join()            === [0,0x12,0x34,0].join(),
      213: Bit.split2(0xffff1234, [4]).join()                  === [0x1].join(),
      220: Bit.split2(0xffff5678, [4,20]).join()               === [0x5, 0x678].join(),
      221: Bit.split2(0xffff5678, [4,32]).join()               === [0x5, 0x678].join(),
      222: Bit.split2(0xffff5678, [4,32,0]).join()             === [0x5, 0x678,0].join(),
      // 8 bit
      301: Bit.split1(0xffffff55, BIT_PATTERN.BIT8).join()     === [0,1,0,1,0,1,0,1].join(),
      303: Bit.split1(0xffffff01, [4, 4, 4, 4]).join()         === [0x0,0x1,0,0].join(),
      304: Bit.split1(0xffffff01, [8, 8]).join()               === [0x01, 0].join(),
      305: Bit.split1(0xffffff01, [16]).join()                 === [0x01].join(),
      306: Bit.split1(0xffffff34, [4,4,4,4]).join()            === [0x3, 0x4, 0, 0].join(),
      307: Bit.split1(0xffffff34, [4,4,8]).join()              === [0x3, 0x4, 0].join(),
      308: Bit.split1(0xffffff34, [16,8]).join()               === [0x34, 0].join(),
      309: Bit.split1(0xffffff34, [24]).join()                 === [0x34].join(),
      310: Bit.split1(0xffffff34, [0,16]).join()               === [0,0x34].join(),
      311: Bit.split1(0xffffff34, [0,16,16]).join()            === [0,0x34,0].join(),
      312: Bit.split1(0xffffff34, [0,8,8,0]).join()            === [0,0x34,0,0].join(),
      313: Bit.split1(0xffffff34, [4]).join()                  === [0x3].join(),
      320: Bit.split1(0xffffff78, [4,20]).join()               === [0x7, 0x8].join(),
      321: Bit.split1(0xffffff78, [4,32]).join()               === [0x7, 0x8].join(),
      322: Bit.split1(0xffffff78, [4,32,0]).join()             === [0x7, 0x8,0].join(),
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

function testBit_dump(test, pass, miss) {
    var result = {
      101: Bit.dump(0x00000000, [4,4,4,4,4,4,4,4])       === "0000, 0000, 0000, 0000, 0000, 0000, 0000, 0000",
      102: Bit.dump(0x12345678, [4,4,4,4,4,4,4,4])       === "0001, 0010, 0011, 0100, 0101, 0110, 0111, 1000",
      103: Bit.dump(0x12345678, [16,12,4])               === "0001001000110100, 010101100111, 1000",

        // verbose
     1111: Bit.dump(0x00000000, [4,4,4,4,4,4,4,4], true) === "00000000000000000000000000000000(0x00000000), 0000(0,0x0), 0000(0,0x0), 0000(0,0x0), 0000(0,0x0), 0000(0,0x0), 0000(0,0x0), 0000(0,0x0), 0000(0,0x0)",
     1112: Bit.dump(0x12345678, [4,4,4,4,4,4,4,4], true) === "00010010001101000101011001111000(0x12345678), 0001(1,0x1), 0010(2,0x2), 0011(3,0x3), 0100(4,0x4), 0101(5,0x5), 0110(6,0x6), 0111(7,0x7), 1000(8,0x8)",
     1113: Bit.dump(0x12345678, [16,12,4], true)         === "00010010001101000101011001111000(0x12345678), 0001001000110100(4660,0x1234), 010101100111(1383,0x567), 1000(8,0x8)",
     1114: Bit.dump(0x12345678, [0,16,12,4,0], true)     === "00010010001101000101011001111000(0x12345678), 0(0,0x0), 0001001000110100(4660,0x1234), 010101100111(1383,0x567), 1000(8,0x8), 0(0,0x0)",
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
        1: Bit.dump(a[0], [1, 8, 23]) === "0, 01111100, 01000000000000000000000",
        2: Bit.dump(b[0], [1, 8, 23]) === "1, 10000101, 11011010100000000000000",
        3: Bit.dump(c[0], [1, 11,20]) === "0, 01111111100, 01000000000000000000",
        4: Bit.dump(c[1], [32])       === "00000000000000000000000000000000",
        5: Bit.dump(d[0], [1,11,20])  === "1, 10000000101, 11011010100000000000",
        6: Bit.dump(d[1], [32])       === "00000000000000000000000000000000",
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView(test, pass, miss) {
    var source = new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    var cursor = 0;
    var view = new BitView(source, cursor);

    var subview1 = view.subview(3);     // [    3,4,5,6,7,8,9,10,11,12,13,14,15]
    var subview2 = view.subview(1, 14); // [1,2,3,4,5,6,7,8,9,10,11,12,13]

    var r1 = view.r1();
    var r2 = view.r2();
    var r3 = view.r3();
    var r4 = view.r4();
    var cursor = view.cursor; // 10

    view.cursor = 0; // reset cursor

    var rs1 = view.rs1([4,4]);      // [0, 0]
    var rs2 = view.rs2([4,4,4,4]);  // [0, 1, 0, 2]
    var rs3 = view.rs3([8,8,8]);    // [3, 4, 5]
    var rs4 = view.rs4([16,16]);    // [0x0607, 0x0809]

    var result = {
        "subview1.length": subview1.length === 13,
        "subview1.source": [].slice.call(subview1.source).join() === [3,4,5,6,7,8,9,10,11,12,13,14,15].join(),
        "subview2.length": subview1.length === 13,
        "subview2.source": [].slice.call(subview2.source).join() === [1,2,3,4,5,6,7,8,9,10,11,12,13].join(),
        r1: r1 === 0x00,
        r2: r2 === 0x0102,
        r3: r3 === 0x030405,
        r4: r4 === 0x06070809,
        cursor: cursor === 10,
        rs1: rs1.join() === [0, 0].join(),
        rs2: rs2.join() === [0, 1, 0, 2].join(),
        rs3: rs3.join() === [3, 4, 5].join(),
        rs4: rs4.join() === [0x0607, 0x0809].join(),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

return test.run();

})(GLOBAL);

