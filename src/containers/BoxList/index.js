import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Box from '../../components/Box'
// import {connect}

class BoxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      boxes: []
    }
    this._handleClick = this._handleClick.bind(this)
  }
  componentWillMount () {
    // 查询所有box
  }
  _handleClick (e) {
    console.log(e)
    return false
  }
  render () {
    return (
      <div className="box-list">
        <Box isActive={true} onClick={this._handleClick} />
        <Box onClick={this._handleClick} id="#2"/>
      </div>
    )
  }
}

export default BoxList
