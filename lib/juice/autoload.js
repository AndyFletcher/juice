// Basic autoloader for models/controllers etc

var fs = require( "filesystem-base" );

var autoload = exports;

function clean_filename( directory, filename ) {
	var name = filename.replace( directory, '' );
    var dot_index = name.indexOf( "." );
    name = name.substr( 0, dot_index );
    return name;
}

function model_require( directory, name ) {
	return require( "file://" + directory + name + ".js" );
}

function controller_require( directory, name ) {
	return require( "file://" + directory + name + ".js" )[ name ];
}

autoload.load = function( app, directory, require_fn ) {
	// convert to use doc_root
	var dir_path = "lib/" + directory;
	// fs.isFile + fs.isDirectory
	var dir_contents = fs.list( dir_path );
    
	var loaded = {};
    
    for each ( filename in dir_contents ) {
    	var name = clean_filename( dir_path, filename );
		loaded[ name ] = require_fn( app.docRoot + dir_path, name );
    }
    
    return loaded;
}

autoload.models = function( app ) {
	var models = this.load( app, "models/", model_require );
    
    for each ( var model in models ) {
    	if ( "meta" in model ) {
        	if ( model.meta == "db" ) {
            	Object.defineProperties(
    			    model,
    			    {
    			      db: { getter: function() { return app.db } },
    			      app: { getter: function() { return app } }
    			    }
    			);
            }
        }
    }
    
    return models;
}

autoload.controllers = function( app ) {
	return this.load( app, "controllers/", controller_require );
}

