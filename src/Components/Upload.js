import React, { Component }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEllipsisH, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import bulma from 'bulma';
import Modal from 'react-modal';
import './Upload.css'

const fileListed = {
  display: 'inline-flex',
  alignItems: 'center'
}

const form = {
  position: 'relative',
  display: 'inlineFlex',
  alignItems: 'center'
}

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

const modalText = {
  position: 'relative',
  display: 'block',
  height: '100%',
  top: 0, right: 0, bottom: 0, left: 0,
  margin: '0 auto'
}

class Upload extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      selectedFile: null,
      uploadedFile: null,
      showModal: false
    };
    this.onChangeHandler = this.onChangeHandler.bind( this );
    this.updateUploadedList = this.updateUploadedList.bind( this );
    this.componentDidMount = this.componentDidMount.bind( this );
    // this.handleOpenModal = this.handleOpenModal.bind( this );
    this.handleCloseModal = this.handleCloseModal.bind( this );
  }

  // handleOpenModal = () =>  {
  //   this.setState({ showModal: true });
  // }

  handleCloseModal = () =>  {
    this.setState({ showModal: false });
  }

  componentDidMount = () => {
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
      selectedFile: event.target.files
    } );
  }

  onClickHandler = () => {
    if ( this.state.selectedFile ) {
      const uploadedFile = new FormData();
      for (let i = 0; i < this.state.selectedFile.length; i++) {
        uploadedFile.append( 'file', this.state.selectedFile[i] );
      }
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
      // alert( 'Choose at least one file' )
      this.setState({ showModal: true });
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
          <input type='file' name='file' multiple onChange = { this.onChangeHandler } style = { input } />
          <FontAwesomeIcon icon = { faEllipsisH } />
        </label>
        <label style = { inputStyle }>
          <FontAwesomeIcon icon = { faUpload } onClick = { this.onClickHandler } />
          <Modal
            isOpen = { this.state.showModal }
            contentLabel = 'onRequestClose'
            onRequestClose = { this.handleCloseModal }
            className = 'Modal'
          >
            <FontAwesomeIcon icon = { faTimes } onClick = { this.handleCloseModal }  style = {{cursor: 'pointer', margin: '10px'}}/>
            <h3 style = { modalText }>No files attached</h3>
          </Modal>
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
