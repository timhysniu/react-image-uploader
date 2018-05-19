import React, { Component } from 'react';
import './App.css';
import ImageUploadMulti from './components/ImageUploadMulti';

class App extends Component {
  render() {
    return (
      <ImageUploadMulti name="images" 
          uploadLink="/upload"
          removeLink="/upload"
      />
    );
  }
}

export default App;
