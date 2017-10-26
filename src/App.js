import React, { Component } from 'react'
import Header from './components/Header'
import BoxList from './containers/BoxList'
import Map from './components/Map'
import './App.css'
import {Button} from 'antd'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <BoxList />
        <Map />
        <Button type="primary">Button</Button>
      </div>
    )
  }
}

export default App
