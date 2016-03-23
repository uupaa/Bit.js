// Bit test

require("../../lib/WebModule.js");

WebModule.verify  = true;
WebModule.verbose = true;
WebModule.publish = true;

require("../../node_modules/uupaa.expgolomb.js/lib/ExpGolomb.js");
require("../wmtools.js");
require("../../lib/Bit.js");
require("../../lib/BitView.js");
require("../../release/Bit.n.min.js");
require("../testcase.js");

