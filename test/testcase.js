var ModuleTestBit = (function(global) {

var test = new Test(["Bit"], { // Add the ModuleName to be tested here (if necessary).
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
    });

if (IN_BROWSER || IN_NW || IN_EL || IN_WORKER || IN_NODE) {
    test.add([
        testBit_n,
        testBit_n_verify_error,
        testBit_cnl,
        testBit_cnr,
        testBit_split,
        testBit_reverse,
        testBit_popcnt,
        testBit_nlz,
        testBit_ntz,
        testBit_dump,
        testBit_IEEE754,
        testBit_BitView_bytes,
        testBit_BitView_nu_bitCursor7,
        testBit_BitView_nu_bitCursor6,
        testBit_BitView_nu_bitCursor5,
        testBit_BitView_nu_1_to_32,
        testBit_BitView_u,
        testBit_BitView_ug,
        testBit_BitView_sg,
        testBit_BitView_sg_zero,
        testBit_BitView_EOS,
    ]);
}

// --- test cases ------------------------------------------
function testBit_n(test, pass, miss) {
    var result = {
        1: Bit.n(0x000000ff, 0b00000000000000000000000011111100) === 0x3f,
        2: Bit.n(0x000000ff, 0b00000000000000000000000011000000) === 0x03,
        3: Bit.n(0x0000ffff, 0b00000000000000000111111000000000) === 0x3f,
        4: Bit.n(0x0000ffff, 0b00000000000000001100000000000000) === 0x03,
        5: Bit.n(0xffffffff, 0b01111110000000000000000000000000) === 0x3f,
        6: Bit.n(0xffffffff, 0b11000000000000000000000000000000) === 0x03,
    };
    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_n_verify_error(test, pass, miss) {
    try {
        Bit.n(0x000000ff, 0b101); // -> validation error --> throw
        test.done(miss());
    } catch (o_o) {
        test.done(pass());
    }
}

function testBit_cnl(test, pass, miss) {
    var result = {
        1: Bit.cnl(0b001) === 1,
        2: Bit.cnl(0b010) === 1,
        3: Bit.cnl(0b011) === 2,
        4: Bit.cnl(0b100) === 1,
       10: Bit.cnl(0b11000000) === 2,
       11: Bit.cnl(0b0111111110000000) === 8,
       12: Bit.cnl(0b0000000000000000) === 0,
       13: Bit.cnl(0b01111111111111111111111111111111) === 31,
       14: Bit.cnl(0b11000000000000000000000000000000) === 2,
       15: Bit.cnl(0x0) === 0,
       16: Bit.cnl(0x1) === 1,
       17: Bit.cnl(0x2) === 1,
       18: Bit.cnl(0x3) === 2,
       19: Bit.cnl(0x7fffffff) === 31,
       20: Bit.cnl(0xffffffff) === 32,
       30: Bit.cnl(0b11101111) === 3,
       //            ~~~
       31: Bit.cnl(0b11100000) === 3,
       //            ~~~
    };
    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_cnr(test, pass, miss) {
    var result = {
        1: Bit.cnr(0b001) === 1,
        2: Bit.cnr(0b010) === 1,
        3: Bit.cnr(0b011) === 2,
        4: Bit.cnr(0b100) === 1,
       10: Bit.cnr(0b11000000) === 2,
       11: Bit.cnr(0b0111111110000000) === 8,
       12: Bit.cnr(0b0000000000000000) === 0,
       13: Bit.cnr(0b01111111111111111111111111111111) === 31,
       14: Bit.cnr(0b11000000000000000000000000000000) === 2,
       15: Bit.cnr(0x0) === 0,
       16: Bit.cnr(0x1) === 1,
       17: Bit.cnr(0x2) === 1,
       18: Bit.cnr(0x3) === 2,
       19: Bit.cnr(0x7fffffff) === 31,
       20: Bit.cnr(0xffffffff) === 32,
       30: Bit.cnr(0b11101111) === 4,
       //                ~~~~
       31: Bit.cnr(0b11100000) === 3,
       //            ~~~
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
        1: Bit.split32(0xaaaa5555, BIT_PATTERN.BIT32).join()  === [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0, 0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1].join(),
        3: Bit.split32(0xabcdef01, BIT_PATTERN.NIBBLE).join() === [10,11,12,13,14,15,0,1].join(),
        4: Bit.split32(0xabcdef01, BIT_PATTERN.BYTE).join()   === [0xab, 0xcd, 0xef, 0x01].join(),
        5: Bit.split32(0xabcdef01, BIT_PATTERN.WORD).join()   === [0xabcd, 0xef01].join(),
        6: Bit.split32(0x00001234, [16,4,4,4,4]).join()       === [0x0000, 0x1, 0x2, 0x3, 0x4].join(),
        7: Bit.split32(0xfedc1234, [4,4,4,4,16]).join()       === [0xf, 0xe, 0xd, 0xc, 0x1234].join(),
        8: Bit.split32(0xfedc1234, [24,8]).join()             === [0xfedc12, 0x34].join(),
        9: Bit.split32(0xfedc1234, [32]).join()               === [0xfedc1234].join(),
       10: Bit.split32(0xfedc1234, [0,16]).join()             === [0,0xfedc].join(),
       11: Bit.split32(0xfedc1234, [0,16,16]).join()          === [0,0xfedc,0x1234].join(),
       12: Bit.split32(0xfedc1234, [0,16,16,0]).join()        === [0,0xfedc,0x1234,0].join(),
       13: Bit.split32(0xfedc1234, [4]).join()                === [0xf].join(),
       20: Bit.split32(0x12345678, [4,28]).join()             === [0x1, 0x2345678].join(),
       21: Bit.split32(0x12345678, [4,32]).join()             === [0x1, 0x2345678].join(),
       22: Bit.split32(0x12345678, [4,32,0]).join()           === [0x1, 0x2345678,0].join(),
      // 24 bit
      101: Bit.split24(0xffaa5555, BIT_PATTERN.BIT24).join()    === [1,0,1,0,1,0,1,0, 0,1,0,1,0,1,0,1, 0,1,0,1,0,1,0,1].join(),
      103: Bit.split24(0xffcdef01, [4, 4, 4, 4, 4, 4]).join()   === [12,13,14,15,0,1].join(),
      104: Bit.split24(0xffcdef01, [8, 8, 8]).join()            === [0xcd, 0xef, 0x01].join(),
      105: Bit.split24(0xffcdef01, [8, 16]).join()              === [0xcd, 0xef01].join(),
      106: Bit.split24(0xff001234, [8,4,4,4,4]).join()          === [0x00, 0x1, 0x2, 0x3, 0x4].join(),
      107: Bit.split24(0xffdc1234, [4,4,16]).join()             === [0xd, 0xc, 0x1234].join(),
      108: Bit.split24(0xffdc1234, [16,8]).join()               === [0xdc12, 0x34].join(),
      109: Bit.split24(0xffdc1234, [24]).join()                 === [0xdc1234].join(),
      110: Bit.split24(0xffdc1234, [0,16]).join()               === [0,0xdc12].join(),
      111: Bit.split24(0xffdc1234, [0,16,16]).join()            === [0,0xdc12,0x34].join(),
      112: Bit.split24(0xffdc1234, [0,8,16,0]).join()           === [0,0xdc,0x1234,0].join(),
      113: Bit.split24(0xffdc1234, [4]).join()                  === [0xd].join(),
      120: Bit.split24(0xff345678, [4,20]).join()               === [0x3, 0x45678].join(),
      121: Bit.split24(0xff345678, [4,32]).join()               === [0x3, 0x45678].join(),
      122: Bit.split24(0xff345678, [4,32,0]).join()             === [0x3, 0x45678,0].join(),
      // 16 bit
      201: Bit.split16(0xffff5555, BIT_PATTERN.BIT16).join()    === [0,1,0,1,0,1,0,1, 0,1,0,1,0,1,0,1].join(),
      203: Bit.split16(0xffffef01, [4, 4, 4, 4]).join()         === [14,15,0,1].join(),
      204: Bit.split16(0xffffef01, [8, 8]).join()               === [0xef, 0x01].join(),
      205: Bit.split16(0xffffef01, [16]).join()                 === [0xef01].join(),
      206: Bit.split16(0xffff1234, [4,4,4,4]).join()            === [0x1, 0x2, 0x3, 0x4].join(),
      207: Bit.split16(0xffff1234, [4,4,8]).join()              === [0x1, 0x2, 0x34].join(),
      208: Bit.split16(0xffff1234, [16,8]).join()               === [0x1234, 0x0].join(),
      209: Bit.split16(0xffff1234, [24]).join()                 === [0x1234].join(),
      210: Bit.split16(0xffff1234, [0,16]).join()               === [0,0x1234].join(),
      211: Bit.split16(0xffff1234, [0,16,16]).join()            === [0,0x1234,0].join(),
      212: Bit.split16(0xffff1234, [0,8,8,0]).join()            === [0,0x12,0x34,0].join(),
      213: Bit.split16(0xffff1234, [4]).join()                  === [0x1].join(),
      220: Bit.split16(0xffff5678, [4,20]).join()               === [0x5, 0x678].join(),
      221: Bit.split16(0xffff5678, [4,32]).join()               === [0x5, 0x678].join(),
      222: Bit.split16(0xffff5678, [4,32,0]).join()             === [0x5, 0x678,0].join(),
      // 8 bit
      301: Bit.split8(0xffffff55, BIT_PATTERN.BIT8).join()     === [0,1,0,1,0,1,0,1].join(),
      303: Bit.split8(0xffffff01, [4, 4, 4, 4]).join()         === [0x0,0x1,0,0].join(),
      304: Bit.split8(0xffffff01, [8, 8]).join()               === [0x01, 0].join(),
      305: Bit.split8(0xffffff01, [16]).join()                 === [0x01].join(),
      306: Bit.split8(0xffffff34, [4,4,4,4]).join()            === [0x3, 0x4, 0, 0].join(),
      307: Bit.split8(0xffffff34, [4,4,8]).join()              === [0x3, 0x4, 0].join(),
      308: Bit.split8(0xffffff34, [16,8]).join()               === [0x34, 0].join(),
      309: Bit.split8(0xffffff34, [24]).join()                 === [0x34].join(),
      310: Bit.split8(0xffffff34, [0,16]).join()               === [0,0x34].join(),
      311: Bit.split8(0xffffff34, [0,16,16]).join()            === [0,0x34,0].join(),
      312: Bit.split8(0xffffff34, [0,8,8,0]).join()            === [0,0x34,0,0].join(),
      313: Bit.split8(0xffffff34, [4]).join()                  === [0x3].join(),
      320: Bit.split8(0xffffff78, [4,20]).join()               === [0x7, 0x8].join(),
      321: Bit.split8(0xffffff78, [4,32]).join()               === [0x7, 0x8].join(),
      322: Bit.split8(0xffffff78, [4,32,0]).join()             === [0x7, 0x8,0].join(),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_reverse(test, pass, miss) {
    var result = {
        1: Bit.reverse8(0b00001110) === 0b01110000, // 0b00001110 -> 0b01110000
        2: Bit.reverse8(0b00000010) === 0b01000000, // 0b00000010 -> 0b01000000
        3: Bit.reverse16(0b0000000011100000) === 0b0000011100000000, // 0b0000000011100000 -> 0b0000011100000000
        4: Bit.reverse16(0b0000000000100000) === 0b0000010000000000, // 0b0000000000100000 -> 0b0000010000000000
        5: Bit.reverse16(0b0001000000100001) === 0b1000010000001000, // 0x1021 -> 0x8408
        6: Bit.reverse16(0b0001000000100001) === 0b1000010000001000, // 0x1021 -> 0x8408
        7: Bit.reverse32(0b11100000000000000000000000001111) === 0b11110000000000000000000000000111,
        8: Bit.reverse32(0b00010001000100010001000100010001) === 0b10001000100010001000100010001000,
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

function testBit_BitView_bytes(test, pass, miss) {
    var source = new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    var cursor = 0;
    var bv = new BitView(source, cursor);

    var r1 = bv.u(8);
    var r2 = bv.u(16);
    var r3 = bv.u(24);
    var r4 = bv.u(32);
    var cursor = bv.cursor; // 10

    bv.cursor = 0; // reset cursor

    var result = {
        r1: r1 === 0x00,
        r2: r2 === 0x0102,
        r3: r3 === 0x030405,
        r4: r4 === 0x06070809,
        cursor: cursor === 10,
    };
    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_u(test, pass, miss) {
    var bv = new BitView(new Uint8Array([0x11,     0x77,     0xCC,     0x00]));
                                     // `00010001``01110111``11001100``00000000`
    var u1 = bv.u(1); // `0`               ~
    var u2 = bv.u(2); // `00`               ~~
    var u3 = bv.u(3); // `100`                ~~~
    var u4 = bv.u(4); // `01``01`                ~~  ~~
    var u5 = bv.u(5); // `11011`                       ~~~~~
    var u6 = bv.u(6); // `1``11001`                         ~  ~~~~~
    var u7 = bv.u(7); // `100``0000`                                ~~~  ~~~~
    var u8 = bv.u(8); // `0000``0000(undefined)`

    bv.cursor = 0;
    bv.bitCursor = 7;

    var u16 = bv.u(16);

    bv.cursor = 0;
    bv.bitCursor = 7;

    var u24 = bv.u(24);

    bv.cursor = 0;
    bv.bitCursor = 7;

    var u32 = bv.u(32);

    var result = {
        u1: u1 === parseInt("0", 2),
        u2: u2 === parseInt("00", 2),
        u3: u3 === parseInt("100", 2),
        u4: u4 === parseInt("0101", 2),
        u5: u5 === parseInt("11011", 2),
        u6: u6 === parseInt("111001", 2),
        u7: u7 === parseInt("1000000", 2),
        u8: u8 === parseInt("00000000", 2),
        u16: u16 === parseInt("0001000101110111", 2),
        u24: u24 === parseInt("000100010111011111001100", 2),
        u32: u32 === parseInt("00010001011101111100110000000000", 2),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_nu_bitCursor7(test, pass, miss) {
    var bv = new BitView(new Uint8Array([    0x91,    0x77,    0xCC,    0x07]));
                                         // `10010001 01110111 11001100 00000111`
    var nu1  = bv.nu(1);  // `1`             ~
    var nu2  = bv.nu(2);  // `10`            ~~
    var nu3  = bv.nu(3);  // `100`           ~~~
    var nu4  = bv.nu(4);  // `1001`          ~~~~
    var nu5  = bv.nu(5);  // `10010`         ~~~~~
    var nu6  = bv.nu(6);  // `100100`        ~~~~~~
    var nu7  = bv.nu(7);  // `1001000`       ~~~~~~~
    var nu8  = bv.nu(8);  // `10010001`      ~~~~~~~~
    var nu9  = bv.nu(9);  // `100100010`     ~~~~~~~~ ~
    var nu15 = bv.nu(15); // `100100010111011`
    var nu16 = bv.nu(16); // `1001000101110111`
    var nu23 = bv.nu(23); // `10010001011101111100110`

    var result = {
        nu1:  nu1  === parseInt("1", 2),
        nu2:  nu2  === parseInt("10", 2),
        nu3:  nu3  === parseInt("100", 2),
        nu4:  nu4  === parseInt("1001", 2),
        nu5:  nu5  === parseInt("10010", 2),
        nu6:  nu6  === parseInt("100100", 2),
        nu7:  nu7  === parseInt("1001000", 2),
        nu8:  nu8  === parseInt("10010001", 2),
        nu9:  nu9  === parseInt("100100010", 2),
        nu15: nu15 === parseInt("100100010111011", 2),
        nu16: nu16 === parseInt("1001000101110111", 2),
        nu23: nu23 === parseInt("10010001011101111100110", 2),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_nu_bitCursor6(test, pass, miss) {
    var bv = new BitView(new Uint8Array([    0x91,    0x77,    0xCC,    0x07]));
                                         // `10010001 01110111 11001100 00000111`
                                         // 145       119      204      7
    bv.bitCursor = 6;

    var nu1  = bv.nu(1);  // `0`            ~~
    var nu2  = bv.nu(2);  // `00`           ~~~ 
    var nu3  = bv.nu(3);  // `001`          ~~~~ 
    var nu4  = bv.nu(4);  // `0010`         ~~~~~ 
    var nu5  = bv.nu(5);  // `00100`        ~~~~~~ 
    var nu6  = bv.nu(6);  // `001000`       ~~~~~~~ 
    var nu7  = bv.nu(7);  // `0010001`      ~~~~~~~~ 
    var nu8  = bv.nu(8);  // `00100010`     ~~~~~~~~ ~ 
    var nu9  = bv.nu(9);  // `001000101`
    var nu15 = bv.nu(15); // `001000101110111`
    var nu16 = bv.nu(16); // `0010001011101111`
    var nu23 = bv.nu(23); // `00100010111011111001100`

    var result = {
        nu1:  nu1  === parseInt("0", 2),
        nu2:  nu2  === parseInt("00", 2),
        nu3:  nu3  === parseInt("001", 2),
        nu4:  nu4  === parseInt("0010", 2),
        nu5:  nu5  === parseInt("00100", 2),
        nu6:  nu6  === parseInt("001000", 2),
        nu7:  nu7  === parseInt("0010001", 2),
        nu8:  nu8  === parseInt("00100010", 2),
        nu9:  nu9  === parseInt("001000101", 2),
        nu15: nu15 === parseInt("001000101110111", 2),
        nu16: nu16 === parseInt("0010001011101111", 2),
        nu23: nu23 === parseInt("00100010111011111001100", 2),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_nu_bitCursor5(test, pass, miss) {
    var bv = new BitView(new Uint8Array([    0x91,    0x77,    0xCC,    0x07]));
                                         // `10010001 01110111 11001100 00000111`
                                         // 145       119      204      7
    bv.bitCursor = 5;

    var nu1  = bv.nu(1);  // `0`
    var nu2  = bv.nu(2);  // `01`
    var nu3  = bv.nu(3);  // `010`
    var nu4  = bv.nu(4);  // `0100`
    var nu5  = bv.nu(5);  // `01000`
    var nu6  = bv.nu(6);  // `010001`
    var nu7  = bv.nu(7);  // `0100010`
    var nu8  = bv.nu(8);  // `01000101`
    var nu9  = bv.nu(9);  // `010001011`
    var nu15 = bv.nu(15); // `010001011101111`
    var nu16 = bv.nu(16); // `0100010111011111`
    var nu23 = bv.nu(23); // `01000101110111110011000`

    var result = {
        nu1:  nu1  === parseInt("0", 2),
        nu2:  nu2  === parseInt("01", 2),
        nu3:  nu3  === parseInt("010", 2),
        nu4:  nu4  === parseInt("0100", 2),
        nu5:  nu5  === parseInt("01000", 2),
        nu6:  nu6  === parseInt("010001", 2),
        nu7:  nu7  === parseInt("0100010", 2),
        nu8:  nu8  === parseInt("01000101", 2),
        nu9:  nu9  === parseInt("010001011", 2),
        nu15: nu15 === parseInt("010001011101111", 2),
        nu16: nu16 === parseInt("0100010111011111", 2),
        nu23: nu23 === parseInt("01000101110111110011000", 2),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_nu_1_to_32(test, pass, miss) {
    var bv = new BitView(new Uint8Array([0xcc, 0x77, 0xdd, 0xcc]));

    var result = {
         1: bv.nu(1)  === parseInt("1", 2),
         2: bv.nu(2)  === parseInt("11", 2),
         3: bv.nu(3)  === parseInt("110", 2),
         4: bv.nu(4)  === parseInt("1100", 2),
         5: bv.nu(5)  === parseInt("11001", 2),
         6: bv.nu(6)  === parseInt("110011", 2),
         7: bv.nu(7)  === parseInt("1100110", 2),
         8: bv.nu(8)  === parseInt("11001100", 2),
         9: bv.nu(9)  === parseInt("11001100" + "0", 2),
        10: bv.nu(10) === parseInt("11001100" + "01", 2),
        11: bv.nu(11) === parseInt("11001100" + "011", 2),
        12: bv.nu(12) === parseInt("11001100" + "0111", 2),
        13: bv.nu(13) === parseInt("11001100" + "01110", 2),
        14: bv.nu(14) === parseInt("11001100" + "011101", 2),
        15: bv.nu(15) === parseInt("11001100" + "0111011", 2),
        16: bv.nu(16) === parseInt("11001100" + "01110111", 2),
        23: bv.nu(23) === parseInt("11001100" + "01110111" + "1101110", 2),
        24: bv.nu(24) === parseInt("11001100" + "01110111" + "11011101", 2),
        31: bv.nu(31) === parseInt("11001100" + "01110111" + "11011101" + "1100110", 2),
        32: bv.nu(32) === parseInt("11001100" + "01110111" + "11011101" + "11001100", 2),
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_ug(test, pass, miss) {
    var source = [131072, 65536, 32768, 16384, 1024];
    var bits = ExpGolomb.encode(source[0]) +
               ExpGolomb.encode(source[1]) +
               ExpGolomb.encode(source[2]) +
               ExpGolomb.encode(source[3]) +
               ExpGolomb.encode(source[4]) + "00000000000000000000000000000000";
    var bytes = [];
    for (var i = 0, iz = ((bits.length / 8) | 0) * 8; i < iz; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }

    var bv = new BitView(new Uint8Array(bytes));
    var ug1 = bv.ug();
    var ug2 = bv.ug();
    var ug3 = bv.ug();
    var ug4 = bv.ug();
    var ug5 = bv.ug();

    var result = {
        ug1: ug1 === source[0],
        ug2: ug2 === source[1],
        ug3: ug3 === source[2],
        ug4: ug4 === source[3],
        ug5: ug5 === source[4],
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_sg(test, pass, miss) {
    var source = [-131072, -65536, -32768, -16384, -1024];
    var signed = true;
    var bits = ExpGolomb.encode(source[0], signed) +
               ExpGolomb.encode(source[1], signed) +
               ExpGolomb.encode(source[2], signed) +
               ExpGolomb.encode(source[3], signed) +
               ExpGolomb.encode(source[4], signed) + "00000000000000000000000000000000";
    var bytes = [];
    for (var i = 0, iz = ((bits.length / 8) | 0) * 8; i < iz; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }

    var bv = new BitView(new Uint8Array(bytes));
    var sg1 = bv.sg();
    var sg2 = bv.sg();
    var sg3 = bv.sg();
    var sg4 = bv.sg();
    var sg5 = bv.sg();

    var result = {
        sg1: sg1 === source[0],
        sg2: sg2 === source[1],
        sg3: sg3 === source[2],
        sg4: sg4 === source[3],
        sg5: sg5 === source[4],
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_sg_zero(test, pass, miss) {
    var source = [0, -0];
    var signed = true;
    var bits = ExpGolomb.encode(source[0], signed) +
               ExpGolomb.encode(source[1], signed) + "00000000000000000000000000000000";
    var bytes = [];
    for (var i = 0, iz = ((bits.length / 8) | 0) * 8; i < iz; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }

    var bv = new BitView(new Uint8Array(bytes));
    var sg1 = bv.sg();
    var sg2 = bv.sg();

    var result = {
        sg1: sg1 === source[0],
        sg2: sg2 === source[1],
    };

    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testBit_BitView_EOS(test, pass, miss) {
    var bv = new BitView(new Uint8Array([0,1]));

    bv.u(8);
    var a = bv.EOS; // -> false
    bv.u(8);
    var b = bv.EOS; // -> true
    bv.u(8);
    var c = bv.EOS; // -> true

    var result = {
        a: a === false,
        b: b === true,
        c: c === true,
    };
    if ( /false/.test(JSON.stringify(result)) ) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

return test.run();

})(GLOBAL);

