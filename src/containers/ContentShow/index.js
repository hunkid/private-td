import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import moment from 'moment'
import './mapContainer.css'
import 'moment/locale/zh-cn'
import {formDate} from '../../util'
import {connect} from 'react-redux'
import Map from '../../components/Map'
import Chart from '../../components/Chart'

moment.locale('zh-cn')

class MapContainer extends Component {
  static defaultProps = {
    history: {},
    activeBox: {}
  }
  constructor(props) {
    super(props)
    this._handleDtChange = this._handleDtChange.bind(this)
    this.state = {
      currentDay: ''
    }
  }
  componentWillMount() {
    this.setState({
      currentDay: formDate(Date.now())
    })
  }
  _handleDtChange(dates, dateStrings) {
    this.setState({
      currentDay: dateStrings
    })
  }
  //todo 需要一开始就有history(默认)
  render () {
    let dateNow = formDate(Date.now())
    let activeId = this.props.activeBox.id
    let currentDay = this.state.currentDay
    let data = this.props.history[activeId] ? 
      this.props.history[activeId][currentDay] :
      null
    // console.log(data)
    return (
      <div className="content-container">
        <div className="map-container">
          <DatePicker defaultValue={moment(dateNow)} format='YYYY-MM-DD' size="large"
            allowClear={false} placeholder="按日期查询"
            className="dt-picker" onChange={this._handleDtChange} onOk={this._handleDtChange}/>
          <Map coordinate={ data } className="clearfix"/>
        </div>
        <Chart data={ data }/>
      </div>
    )
  }
}

MapContainer.propTypes = {
  history: PropTypes.object,
  activeBox: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    history: state.history,
    activeBox: state.activeBox
  }
}
export default connect(mapStateToProps)(MapContainer)
