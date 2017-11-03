import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Box from '../../components/Box'
import {changeActiveBox, addHistory} from '../../actions'
import {store} from '../../store'
import {BASEURL} from '../../constants/Config'
import axios from 'axios'

class BoxContainer extends Component {
  constructor (props) {
    super(props)
    this._handleClick = this._handleClick.bind(this)
    this._returnChoseBoxToken = this._returnChoseBoxToken.bind(this)
    this._getBoxHistory = this._getBoxHistory.bind(this)
  }
  componentWillMount () {
    if (this.props.id === 1) {
      this._handleClick(1)
    }
  }
  // 处理点击
  _handleClick (id) {
    store.dispatch(changeActiveBox(id))
    let token = this._returnChoseBoxToken(store.getState())
    this._getBoxHistory(token, id)
    return false
  }
  _returnChoseBoxToken (state) {
    if (state && state.box) {
      for (var i = 0; i <state.box.length; i++) {
        if (state.box[i]['isActive']) {
          return state.box[i]['token']
        }
      }
    }
    return void 0
  }
  // TODO 增加错误提示
  _getBoxHistory (token, id) {
    axios.get(`${BASEURL}/bbox/history?token=${token}&deliver=1&nonce=123321111&page=0&size=0`)
      .then((res) => {
        let data = res.data.history
        let total = res.data.total
        let deliverCargos = null, command
        if (res.data.command === 'load' || res.data.command === 'unload') {
          command = res.data.command
          deliverCargos = res.data.deliverCargos
        }
        store.dispatch(addHistory(id, data, total, command, deliverCargos))
      })
  }
  render () {
    return (
      <Box {...this.props} onClick={this._handleClick}/>
    )
  }
}

BoxContainer.propTypes = {
  func: PropTypes.string,
  id: PropTypes.number,
  isActive: PropTypes.bool
}

export default BoxContainer
