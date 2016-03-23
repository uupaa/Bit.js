// Bit test

onmessage = function(event) {
    self.unitTest = event.data; // { message, setting: { secondary, baseDir } }

    if (!self.console) { // polyfill WebWorkerConsole
        self.console = function() {};
        self.console.dir = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
        self.console.table = function() {};
    }

    importScripts("../../lib/WebModule.js");

    WebModule.verify  = true;
    WebModule.verbose = true;
    WebModule.publish = true;

    importScripts("../../node_modules/uupaa.expgolomb.js/lib/ExpGolomb.js");
    importScripts("../wmtools.js");
    importScripts("../../lib/Bit.js");
    importScripts("../../lib/BitView.js");
    importScripts("../../release/Bit.w.min.js");
    importScripts("../testcase.js");

    self.postMessage(self.unitTest);
};

