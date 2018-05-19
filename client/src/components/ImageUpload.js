import React from 'react'
import PropTypes from 'prop-types'
import './css/ImageUpload.css';
import { isEmpty, getFileType, uploadFile, removeFile } from './utils/ImageUploadUtils'

export default class ImageUpload extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    onUploadSuccess: PropTypes.func,
    onRemoveSuccess: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string,
    accept: PropTypes.string,
    defaultImage: PropTypes.string,
    customElements: PropTypes.func,
    uploadLink: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    src: '',
    id: 'file',
    name: 'assets',
    accept: 'image/*',
    defaultImage: '',
    loadingImage: '/img/loading.gif',
    onRemove: () => {},
    onUploadSuccess: () => {},
    uploadLink: '',
    removeLink: '',
    className: 'group-upload'
  };

  state = {
    files: []
  };

  handleUploadFile = files => {
    const { name, uploadLink, id, onUploadSuccess } = this.props;
    let self = this;
    uploadFile(uploadLink, files, id, name, onUploadSuccess)
      .then(function(resp) {
        self.setState({ uploadedFilename: resp.newFilename });
      })
  };

  handleUploadImage = () => {
    const { onChange, onStart, uploadLink } = this.props
    const input = this.thisInputimage
    const files = input.files
    if (files && files.length > 0) {
      const setPromise = []
      for (const key in files) {
        const file = files[key]
        if (file.type || file.type === '') {
          setPromise.push(
            new Promise((resolve, reject) => {
              try {
                const reader = new FileReader() // eslint-disable-line
                reader.readAsDataURL(file)
                reader.onload = e => {
                  const base64 = e.target.result
                  if (getFileType(file.type) === 'image') {
                    const img = new Image() // eslint-disable-line
                    img.src = base64
                    img.onload = function() {
                      resolve({
                        file,
                        size: file.size, // (file.size * 0.000001),
                        event: e,
                        type: file.type,
                        name: file.name,
                        width: this.width,
                        height: this.height,
                        base64
                      })
                    }
                  } else {
                    resolve({
                      file,
                      size: file.size,
                      event: e,
                      type: file.type,
                      name: file.name,
                      base64
                    })
                  }
                }
              } catch (error) {
                reject(error)
              }
            })
          )
        }
      }

      if (onStart) onStart();
      this.setState({inProgress: true});
      Promise.all(setPromise)
        .then(values => {
          const files = values[0]
          this.setState({
            isUpload: true,
            inProgress: false,
            files
          })
          if (!isEmpty(uploadLink)) {
            this.handleUploadFile(files)
          }
          if (onChange) onChange(files)
        })
        .catch(error => {
          console.error(error)
        })
    }
  };

  clearImage = data => {
    const { onRemove } = this.props;
    const { files } = this.state;
    if (isEmpty(data)) {
      removeFile(this.props.removeLink, this.state.uploadedFilename);
      onRemove(this.props.id);
      const file = this.thisInputimage;
      file.value = '';
      this.setState(() => {
        return {
          files: []
        };
      })
    } else {
      const filterFiles = files[0] ? files.filter((value) => value.name !== data.name) : [];
      removeFile(this.props.removeLink, this.state.uploadedFilename);
      onRemove(this.props.id);
      this.setState(() => {
        return {
          files: filterFiles
        };
      })
    }
  };

  isUpload = () => {
    const { files } = this.state;
    return !isEmpty(files);
  };

  defaultIcon = () => {
    if(this.state.inProgress) {
      return this.iconLoading();
    }
    else {
      return (
        <div className='box-icon'>
          <i className='icon' />
        </div>
      );
    }
  };

  iconLoading = () => {
    if(this.state.inProgress) {
      return(
        <div className="loading">
          <img  src={this.props.loadingImage} width="120" alt='' />
        </div>
      );
    }
  };

  iconUpload = () => {
    const { defaultImage } = this.props;
    const { files } = this.state;
    if (this.isUpload()) {
      switch (getFileType(files.type)) {
        case 'image': {
          return (
            <div className='box-icon'>
              <img src={files.base64} alt='' />
            </div>
          );
        }
        default:
          return this.defaultIcon();
      }
    } else if (!isEmpty(defaultImage)) {
      return (
        <div className='box-icon'>
          <img src={defaultImage} alt='' />
        </div>
      );
    }
    return this.defaultIcon();
  };

  renderCustomElements = inputFile => {
    const { customElements, defaultImage, className } = this.props;
    const { files } = this.state;
    const options = {
      clearImage: this.clearImage,
      defaultImage,
      className
    };
    return customElements(inputFile, files, options);
  };

  /*eslint-disable no-script-url*/
  render() {
    const { name, accept, customElements, className } = this.props

    const inputFile = (
      <input
        type='file'
        ref={input => (this.thisInputimage = input)}
        className='input-file'
        name={name}
        multiple={false}
        accept={accept}
        onChange={() => this.handleUploadImage()}
      />
    );

    if (customElements) return this.renderCustomElements(inputFile);

    return (
      <div className={className}>
        {inputFile}
        {this.iconUpload()}
        {this.isUpload() && (
          <a href='Javascript:;' onClick={() => this.clearImage()} className='button-remove'>
            <i className='icon-remove' />
          </a>
        )}
      </div>
    );
  };
}
