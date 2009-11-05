// simple wrapper for testing throws
exports.throws = function( testcase, expected, message ) {
  if ( message == undefined ) {
    message = expected;
    expected = undefined;
  }
  try {
    testcase();
    asserts.ok( 0, message );
    asserts.diag( "No error thrown" );
  }
  catch ( e ) {
    if ( expected === undefined || expected == e.toString() ) {
      asserts.ok( 1, message );
    }
    else {
      asserts.ok( 0, message );
      asserts.diag( "   Got: " + e.toString() );
      asserts.diag( "Wanted: " + expected );
    }
  }
}
