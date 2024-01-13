import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import ParticlesBg from 'particles-bg';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    const clarifaiFace = JSON.parse(data).outputs[0].data.regions[0].region_info.bounding_box;
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height, 
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    } 
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtomSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    fetch("http://localhost:3000/imageurl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        this.displayFaceBox(this.calculateFaceLocation(result))
        if (result) {
          fetch("http://localhost:3000/image", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((result) => result.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
        }
      })
      .catch((error) => console.log("error", error))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    }
    else if (route === 'home')
    {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
      <ParticlesBg color="#FFFFFF" num={100} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtomSubmit}
            />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
          : (
              route === 'signin' || route === 'signout'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;