import React, { Component }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEllipsisH, faUpload } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import bulma from 'bulma';

const input = {
  display: 'none'
}

const inputStyle = {
  border: '1px solid #ccc',
  display: 'inlineBlock',
  padding: '1px 4em',
  marginRight: '1em',
  cursor: 'pointer'
}

const form = {
  position: 'relative',
  display: 'inlineFlex',
  alignItems: 'center'
}

const fileListed = {
  display: 'inline-flex',
  alignItems: 'center'
}

class Upload extends Component {
  constructor( props ) {
    super( props );
      this.state = {
        selectedFile: null,
        uploadedFile: null,
      };

     this.onChangeHandler = this.onChangeHandler.bind( this );
     this.updateUploadedList = this.updateUploadedList.bind( this );
     this.componentDidMount = this.componentDidMount.bind( this );
  }

  componentDidMount() {
    this.updateUploadedList();
  }

  updateUploadedList = () => {
    axios.get( '/upload', { errorHandle: false } )
    .then( res => {
      this.setState( { uploadedFile: res.data } )
    } )
    .catch( error => {
      console.log( `${ error }` );
    } )
  }

  onChangeHandler = event => {
    this.setState( {
      selectedFile: event.target.files[0]
    } );
  }

  onClickHandler = () => {
      if ( this.state.selectedFile ) {
      const uploadedFile = new FormData();
      uploadedFile.append( 'file', this.state.selectedFile );
      axios.post( '/upload', uploadedFile, {
        headers: {
          'Content-Type': 'multipart/form-uploadedFile',
        }
      } )
      .then( res => {
        console.log( res.statusText )
        this.updateUploadedList();
      } )
      .catch( error => {
        console.log( `${ error }` );
        } );
    } else {
      alert( 'Choose at least one file' )
    }
    this.form.reset();
  }

  downloadFile = ( title ) => {
		let url = window.location.href;
    console.log( url );
    let a = document.createElement( 'a' );
    a.href = url;
    a.download = `${ title }`;
    a.click();
	}

  render(  ) {
   return (
    <div style = { { margin: '10em' } }>
      <p>To upload click <FontAwesomeIcon icon={ faEllipsisH } /> , choose at least one file and click on <FontAwesomeIcon icon = { faUpload } /> to upload</p><br />
      <form ref = { uploadForm => this.form = uploadForm } style = { form }>
        <label style = { inputStyle }>
          <input type='file' name='file' onChange = { this.onChangeHandler } style = { input } />
          <FontAwesomeIcon icon = { faEllipsisH } />
        </label>
        <label style = { inputStyle }>
          <FontAwesomeIcon icon = { faUpload } onClick = { this.onClickHandler } />
        </label>
      </form><br />
      <h1 className = 'title is-4'>Uploaded files</h1>
      <div style = { { display: 'flex', flexDirection: 'column' } }>
        { this.state.uploadedFile ? this.state.uploadedFile.map( ( title, key ) => (
          <div key={ key } style = { fileListed }>
            <FontAwesomeIcon icon = { faDownload } style = { { cursor: 'pointer', marginRight: '1em'} } onClick = { () => this.downloadFile( title ) }/>
            <p style = { { marginRight: '1em' } }>{ `${ title }` }</p>
          </div>
        )) : 'No files presented' }
      </div>
    </div>
   );
 }
}

export default Upload;
