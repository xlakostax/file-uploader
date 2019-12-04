const express = require( 'express' );
const multer = require( 'multer' );
const cors = require( 'cors' );
const fs = require( 'fs' );
// const crypto = require('crypto');
const mime = require('mime');

const port = 3001;

const app = express();

app.use( cors() );

let storageCongfig = multer.diskStorage( {
  destination:  ( req, file, callback ) => {
    callback( null, './public' )
  },
  filename:  ( req, file, callback ) => {
    // callback( null, Date.now() + ' - ' + file.originalname )
    // callback( null, Date.now() )
    // crypto.pseudoRandomBytes(16, function ( err, raw ) {
    //   callback ( null, raw.toString( 'hex' ) + Date.now() + '.' + mime.getExtension( file.mimetype ) );
    // });
    callback( null, Date.now() + '.' + mime.getExtension( file.mimetype ) )

  }
} );

app.get( '/upload', ( req, res ) => {
  const filesFolder = './public';
  fs.readdir( filesFolder, ( err, files ) => {
    if ( err ) throw err;
    res.send( files );
  } );
} );

const upload = multer( { storage: storageCongfig } ).array( 'file' )

app.post( '/upload', ( req, res ) => {
  upload( req, res, err => {
    if ( err instanceof multer.MulterError ) return res.status( 500 ).json( err );
    if ( err ) return res.status( 500 ).json( err );
    return res.status( 200 ).send( req.file );
  } )
} );

app.listen( port, () => {
    console.log( `Server running on port ${ port }` );
} );
