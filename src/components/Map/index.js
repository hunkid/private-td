import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import iconUrl from '../../assets/img/bus.png'
import {GPS} from '../../util/transPos'

var BMap = window.BMap
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS
// const BMAP_ANCHOR_TOP_LEFT = window.BMAP_ANCHOR_TOP_LEFT
const BMAP_ANCHOR_TOP_RIGHT = window.BMAP_ANCHOR_TOP_RIGHT
const BMAP_ANCHOR_BOTTOM_RIGHT = window.BMAP_ANCHOR_BOTTOM_RIGHT

class Map extends Component {
  constructor(props) {
    super(props)
    this._addLine = this._addLine.bind(this)
    this._addMarker = this._addMarker.bind(this)
    this._initMap = this._initMap.bind(this)
    this._drawIcons = this._drawIcons.bind(this)
    this._isInvalid = this._isInvalid.bind(this)
    this._drawRoute = this._drawRoute.bind(this)
    this.map = null
    this.currentCor = {
      lng: 0,
      lat: 0
    }
    this.corArr = []
  }
  /**
   * Point(lng: Number, lat: Number)
   */
  componentDidMount() {
    this.map = this._initMap(new BMap.Point(118.78, 32.04), 14)
  }
  // props改变，重新绘制
  componentDidUpdate() {
    this.map.clearOverlays()
    this._drawIcons()
  }
  /**
   * 根据props.coordinate画图标
   */
  _drawIcons () {
    let pt
    if (!this.props.coordinate) {
      return
    } 
    this.corArr = [] //置空
    for (let i = 0; i < this.props.coordinate.length; i++) {
      let coordinate = this.props.coordinate[i]
      if(this._isInvalid(coordinate) || 
          (this.currentCor.lat === coordinate.latitude && 
           this.currentCor.lng === coordinate.longitude)
        ) {
        continue
      }
      this.currentCor.lat = coordinate.latitude
      this.currentCor.lng = coordinate.longitude
      console.log(coordinate.latitude, coordinate.longitude)
      let tmp = GPS.gcj_encrypt(coordinate.latitude, coordinate.longitude)
      console.log('tmp:')
      console.log(tmp)
      let tmp2 = GPS.bd_encrypt(tmp.lat, tmp.lon)
      coordinate.longitude = tmp2.lon
      coordinate.latitude = tmp2.lat
      console.log(coordinate)
      pt = new BMap.Point(+coordinate.longitude, +coordinate.latitude)
      this._addMarker(pt, this.map, iconUrl)
      this.corArr.push(pt)
    }
    if (this.corArr.length > 0) {
      this._drawRoute()
    }
  }
  /**
   * 根据坐标绘制路线，同时设定地图中心、缩放等
   */
  _drawRoute () {
    // if (this.corArr && this.corArr.length > 1) {
    //   let corArr = this.corArr.slice()
    //   corArr.splice(1, corArr.length - 2)
    //   this._searchRoute(this.corArr[0], this.corArr[corArr.length - 1], corArr, this.map, '#111')
    // }
    for (let i = 1; i < this.corArr.length; i++) {
      this._searchRoute(this.corArr[i - 1], this.corArr[i], this.map, '#111')
    }
  }
  /**
   * 坐标如果是0,0，暂定为无效
   * @param {Object} coordinate 
   */
  _isInvalid (coordinate) {
    if ((+coordinate.latitude - 0) < Number.EPSILON &&
        (+coordinate.longitude - 0) < Number.EPSILON) {
      return true
    }
  }
  /**
   * 画两点间直线
   * @param {Array<Point>} points 地图点数组
   * @param {Map} map
   * @param {String} strokeColor RGB256
   */
  _addLine(points, map, strokeColor) {
    map.addOverlay(new BMap.Polyline(points, {
      strokeColor
    }))
    map.setViewport(points)
  }
  /**
   * 在指定坐标上绘制icon
   * @param {Point} point
   * @param {Map} map
   * @param {String} iconUrl
   */
  _addMarker(point, map, iconUrl) {
    let icon = new BMap.Icon(`${iconUrl}`, new BMap.Size(30, 30), {
      imageSize: BMap.Size(31, 31)
    })
    var marker = new BMap.Marker(point, {
      icon: icon
    })
    map.addOverlay(marker)
  }
  /**
   * 初始化地图
   * @param {Point} centerPoint 地图中心点
   * @param {Number} zoom 放大倍数
   * @return {Map}
   */
  _initMap(centerPoint, zoom) {
    var map = new BMap.Map('bdMap') // 创建Map实例
    map.centerAndZoom(centerPoint, zoom) // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.setCurrentCity("南京") // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    let navCtl = new BMap.NavigationControl()
    navCtl.setAnchor(BMAP_ANCHOR_TOP_RIGHT)
    let scaleCtl = new BMap.ScaleControl()
    scaleCtl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT)
    map.addControl(scaleCtl) // 添加比例尺控件
    map.addControl(navCtl)
    // map.addControl(new BMap.OverviewMapControl()) // 缩略地图控件
    return map
  }
  /**
   * 根据起始坐标，绘制路线
   * @param {Point} start 
   * @param {Point} end 
   * @param {Map} map 
   * @param {String} strokeColor RGB
   */
  _searchRoute(start, end, map, strokeColor) {
    var drv = new BMap.DrivingRoute(map, {
      onSearchComplete: (res) => {
        if (drv.getStatus() === BMAP_STATUS_SUCCESS) {
          var plan = res.getPlan(0)
          var arrPois = []
          for (var j = 0; j < plan.getNumRoutes(); j++) {
            var route = plan.getRoute(j)
            arrPois = arrPois.concat(route.getPath())
          }
          map.addOverlay(new BMap.Polyline(arrPois, {
            strokeColor
          }))
          let view = this.map.getViewport(this.corArr)
          this.map.setCenter(view.center)
          this.map.setZoom(view.zoom)
        }
      }
    })
    drv.search(start, end)
  }
  render() {
    return (
      <div id = "bdMap"
        style = {{width: '100%', height: '100%', position: 'relative'}}>
      </div>
    )
  }
}
Map.propTypes = {
  coordinate: PropTypes.array
}

export default Map