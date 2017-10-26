import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Box from '../../components/Box'

class BoxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this._handleClick = this._handleClick.bind(this)
  }
  _handleClick (e) {
    console.log('hel')
    this.setState({
      isActive: true
    })
    return false
  }
  render () {
    return (
      <Box isActive={this.state.isActive} onClick={this._handleClick}/>
    )
  }
}

export default BoxList
