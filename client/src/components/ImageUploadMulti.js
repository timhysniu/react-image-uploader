import React, { Component } from 'react';
import PropTypes from 'prop-types'
import UploadImage from './ImageUpload'

export default class ImageUploadMulti extends Component {
    static propTypes = {
        onStart: PropTypes.func,
        onChange: PropTypes.func,
        onRemove: PropTypes.func,
        onUploadSuccess: PropTypes.func,
        onRemoveSuccess: PropTypes.func,
        uploadLink: PropTypes.string.isRequired,
        removeLink: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            uploaders: []
        };
    }

    addNewUploader() {
        let uploaders = this.state.uploaders;
        let key = 'file-' + Math.random().toString(36).substr(2, 8);
        let newUploader = {id: key, uploaded: false};
        
        uploaders.push(newUploader);
        this.setState({ uploaders });
    }

    componentWillMount() {
        this.addNewUploader();
    }

    onRemove = (uploaderId) => {
        let newUploadersArr = this.state.uploaders.filter((obj) => obj.id !== uploaderId)
        this.setState({uploaders: newUploadersArr});
    }

    onUpload = (resp) => {
        let {id, newFilename} = resp;
        let uploader = this.state.uploaders.find((obj) => { return obj.id === id});
        if(uploader) {
            uploader.uploaded = true;
            uploader.filename = newFilename;
            this.addNewUploader();
        }
    }

    onStart = () => {
        console.log('starting upload');
        // do something here
    }

    render() {
        let uploaders = this.state.uploaders;
        return(
            <div>
                {uploaders.map((obj, index) =>{
                    return <UploadImage key={obj.id} id={obj.id}
                        onStart={this.onStart}
                        onChange={this.onChange} 
                        onUploadSuccess={this.onUpload}
                        onRemove={this.onRemove}
                        {...this.props} />;
                })}
            </div>    
        );
    }
}
