#!/usr/bin/env flusspferd
// -*- mode:javascript; -*- vim:filetype=javascript:enc=utf-8:

const fs = require('fs-base'),
      sys = require('system'),
      io = require('io'),
      installer = require('juice/installer');

// Available as a function so we can run it as part of the install script
exports.makeScript = function () {

var path = installer.dirName(module.id);

io.File.create( path + '../bin/juice', 0777);
var fh = fs.rawOpen( path + '../bin/juice', 'w');

fh.write(<><![CDATA[#!/usr/bin/env flusspferd
// -*- mode:javascript; -*- vim:filetype=javascript:
// Autogenerated - do not edit

var io = require( "io" ),
    system = require( "system" ),
    fs = require( "fs-base" );

var JuiceCLI = {
  init : function ( name ) {
    // if name wasn't provided, exit
    if ( name === undefined ) throw "Usage: juice init my-new-project";

    if ( ! name.match( /^[-a-z0-9_]+$/i ) ) throw "Project name must consist of letters, numbers, hyphens and underscores";

    // if directory already exists, exit
    if ( fs.exists( name ) ) throw "Directory " + name + " already exists";

    // fs-base doesn't have this yet.
    function makeTree(dir) {
      return fs.canonical(dir)
        .split('/')
        .reduce(function(accum, dir) {
          accum += '/' + dir;
          if (!fs.exists(accum)) fs.makeDirectory(accum);
          return accum
        });
    }

    var dir = fs.canonical(makeTree(name));
    // create the directory structure
    var tree = [
      dir + "/db",
      dir + "/lib",
      dir + "/script",
      dir + "/static/scripts",
      dir + "/static/styles",
      dir + "/templates"
    ].map(makeTree);

]]></> + "");

var files = [
  'lib/app.js', 
  'templates/index.tt', 
  'static/styles/app.css', 
  'script/server',
  'script/console'
];

for (let [,f] in Iterator(files)) {
  if (f.match("^script/")) {
    // since our fs-base doesn't yet support permissions, we need to use io.File to
    // make it executable first
    fh.write('    io.File.create( dir + "' + f + '", 0777 );\n\n');

  }

  fh.write('\n    // ' + f + '\n'+ 
           '    fs.rawOpen( dir + "' + f + '", "w").print(<><![CDATA[' +
            fs.rawOpen(path + f, 'r')
              .read()
              .replace(/skeleton/g, ']]></> + name + <><![CDATA[') +
            ']]></> + "");\n'
          );
}

fh.print(<><![CDATA[
    print("Created Juice app", '"' + name + '"', "in", dir);
  } // end of init
}

var args = system.args.slice( 1 );
var action = args.shift();

if ( action in JuiceCLI )
  JuiceCLI[ action ].apply( undefined, args );
else
  throw "Valid actions: init";
]]></> + "");

}

if (require.main === module)
  exports.makeScript();
