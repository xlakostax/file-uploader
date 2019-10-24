const express = require( 'express' );
const multer = require( 'multer' );
const cors = require( 'cors' );
const fs = require( 'fs' );
const port = 7000;

const app = express();

app.use( express.static( 'public' ) )
app.use( cors() );

let storage = multer.diskStorage( {
  destination:  ( req, file, callback ) => {
    callback( null, './public/uploads' )
  },
  filename:  ( req, file, cb ) => {
    callback( null, Date.now() + '-' + file.originalname )
  }
} );

app.get( '/upload', ( req, res ) => {
  const filesFolder = './public/uploads/';
  fs.readdir( filesFolder, ( err, files ) => {
      if ( err ) throw err;
      res.send( files );
  } );
} );

const upload = multer( { storage: storage } ).array( 'file' )
app.post( '/upload', ( req, res ) => {
  upload( req, res,  ( err ) => {
    if ( err instanceof multer.MulterError ) {
        return res.status( 500 ).json( err )
    } else if ( err ) return res.status( 500 ).json( err )
    return res.status( 200 ).send( req.file )
  } )
} );

app.listen( port, () => {
    console.log( `Server running on port ${ port }` );
} );
