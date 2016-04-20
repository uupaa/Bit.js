// Bit test

require("../../lib/WebModule.js");

WebModule.VERIFY  = true;
WebModule.VERBOSE = true;
WebModule.PUBLISH = true;

require("../../node_modules/uupaa.expgolomb.js/lib/ExpGolomb.js");
require("../wmtools.js");
require("../../lib/Bit.js");
require("../../lib/BitView.js");
require("../../release/Bit.n.min.js");
require("../testcase.js");

