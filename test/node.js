// Bits test

require("../lib/WebModule.js");

// publish to global
WebModule.publish = true;


require("./wmtools.js");
require("../lib/bit.js");
require("../release/bit.n.min.js");
require("./testcase.js");

