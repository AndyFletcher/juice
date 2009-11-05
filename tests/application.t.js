const DOC_ROOT = module.uri.replace(/^.*?:\/\/(.*?)lib\/app\.js$/, "$1") || "./";

let test = require('test'),
    asserts = test.asserts,
    Application = require('juice/application').Application;

asserts.throws = require( 'tests/helpers' ).throws;

if (!this.exports) this.exports = {};

exports.test_Config = function() {
  var app = new Application;
  app.setup( DOC_ROOT );
  asserts.same( app.config( "tests/test_conf/test_conf.json" ).test, "ok", "Test config should return 'ok'" );
  asserts.same( app.config( "tests/test_conf/test_conf.json" ).not_there, undefined, "Non-existant config should return undefined" );
  asserts.throws( function() { app.config( "tests/test_conf/not_there.json" ) }, "Loading non-existant conf file should fail" );
}

if (require.main == module)
  test.runner(exports);
