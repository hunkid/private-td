import React, {Component} from 'react'
import PropTypes from 'prop-types'
// import Box from '../../components/Box'
import Box from '../Box'
import './boxList.css'

import {connect} from 'react-redux'

class BoxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      boxes: []
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
