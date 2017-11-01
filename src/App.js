import React, {Component} from 'react'
import Header from './components/Header'
import BoxList from './containers/BoxList'
// import Map from './components/Map'
import Map from './containers/ContentShow'

import './App.css'
import axios from 'axios'

import {BASEURL} from './constants/Config'
import {store} from './store'
import {addBox} from './actions'
class App extends Component {
  constructor(props) {
    super(props)
    this._handleBoxes = this._handleBoxes.bind(this)
  }
  componentWillMount() {
    axios.get(`${BASEURL}/bbox/box`)
      .then((res) => {
        this._handleBoxes(res.data)
      })
  }
  _handleBoxes(boxes) {
    if (!boxes || !boxes.length) {
      return
    }
    store.dispatch(addBox(boxes[0].id, boxes[0].name, boxes[0].description, true, boxes[0].token))
    for (let i = 1; i < boxes.length; i++) {
      store.dispatch(addBox(boxes[i].id, boxes[i].name, boxes[i].description, false, boxes[i].token))
    }
  }
  render() {
    return ( 
      <div className = "App" >
        <Header />
        <BoxList />
        <Map />
      </div>
    )
  }
}

export default App