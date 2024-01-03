import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import ParticlesBg from 'particles-bg'

class App extends Component {
    constructor() {
      super();
      this.state = {
        input: '',
      }
    }

    onInputChange = (event) => {
      console.log(event.target.value);
    }

  render() {
    return (
      <div className="App">
      <ParticlesBg color="#FFFFFF" num={100} type="cobweb" bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange}/>
        {/*<FaceRecognition />}*/}
      </div>
    );
  }
}

export default App;
