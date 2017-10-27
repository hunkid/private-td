import React, {Component} from 'react'
import PropTypes from 'prop-types'
// import Box from '../../components/Box'
import Box from '../Box'
// import axios from 'axios'

// import {BASEURL} from '../../constants/Config'
import {connect} from 'react-redux'

class BoxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      boxes: []
    }
    // this._handleClick = this._handleClick.bind(this)
  }
  componentWillMount () {
    // 查询所有box
  }
  componentDidMount () {
    // axios.get(`${BASEURL}/bbox/box`)
    //   .then(function (res) {
    //     console.log(res)
    //   })
  }
  _handleBoxes (data) {
    if (data) {

    }
  }
  render () {
    let {boxes} = this.props
    if (boxes) {
      return (
        <div className="box-list">
          { boxes.map((box) => 
            <Box id={box.id} func={box.description} isActive={box.isActive} key={box.id}/>) }
        </div>
      )
    } else {
      return null
    }
  }
}
BoxList.propTypes = {
  boxes: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = (state) => {
  return {
    boxes: state.box
  }
}

export default connect(
  mapStateToProps
)(BoxList)
