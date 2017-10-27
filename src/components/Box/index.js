import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './box.css'
class Box extends Component {
  static defaultProps = { // TODELETE
    id: 1,
    departMent: '有关部门',
    func: '隐藏隐藏隐藏字符隐藏隐藏隐藏字符隐藏隐藏隐藏字符隐藏隐藏隐藏字符隐藏隐藏隐藏字符隐藏隐藏隐藏字符',
    isActive: false,
    onClick: null,
  }
  constructor (props) {
    super(props)
    this._handleClick = this._handleClick.bind(this)
  }
  _handleClick () {
    this.props.onClick && this.props.onClick(this.props.id)
  }
  render () {
    let {id, departMent, func, isActive} = this.props
    let active = isActive ? 'active' : ''
    return (
      <div className={`box-pn clearfix noselect ${active}`} onClick={this._handleClick}>
        <h4 className="box-tl">{`#${id} 冷链箱`}</h4>
        <div className="box-dscrp">
          <ul>
            <li>部门：<span className="decrp">{departMent}</span></li>
            <li>功能：<span className="decrp noselect">{func}</span></li>
          </ul>
        </div>
      </div>
    )
  }
}
Box.propTypes = {
  id: PropTypes.number.isRequired,
  departMent: PropTypes.string,
  func: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func
}

export default Box
