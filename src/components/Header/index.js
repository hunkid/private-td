import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Icon, Button} from 'antd'
import './header.css'
class Header  extends Component {
  static defaultProps = {
    number: 2,
    styleClassName: 'sty',
    pos: [0, 0],
    isAnimationNeed: false
  }
  componentWillMount () {
  }
  componentWillUnmount () {
  }
  render () {
    //注意：在大屏上应该会改span
    return (
      <header className="header">
        <Row className="header-hd">
          <Col span={1} />
          <Col span={2}><Icon type="bars" className="header-icon" /></Col>
          <Col span={2}><Icon type="message" className="header-icon" /></Col>
          <Col span={2}><Icon type="flag" className="header-icon" /></Col>
          <Col span={7}></Col>
          <Col span={2}><Icon type="search" className="header-icon" /></Col>
          <Col span={2}><Icon type="user" className="header-icon" /></Col>
          <Col span={5} className="clearfix"><Button className="header-btn">Sign Out</Button></Col>
          <Col span={1} />
        </Row>
        <Row className="header-ft"/>
      </header>
    )    
  }
}
Header.propTypes = {
  pieceSize: PropTypes.number,
  number: PropTypes.number,
  styleClassName: PropTypes.string,
  pos: PropTypes.arrayOf(PropTypes.number).isRequired,
  isAnimationNeed: PropTypes.bool
}

export default Header
