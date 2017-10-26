import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import iconUrl from '../../assets/img/bus.png'

var BMap = window.BMap
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS

class Map extends Component {
  constructor(props) {
    super(props)
    this._addLine = this._addLine.bind(this)
    this._addMarker = this._addMarker.bind(this)
    this._initMap = this._initMap.bind(this)
  }
  componentDidMount() {
    var map = this._initMap(new BMap.Point(116.404, 39.915), 17)
    var bounds = map.getBounds()
    var lngSpan = bounds.getNorthEast().lng - bounds.getSouthWest().lng //经度跨域
    var latSpan = bounds.getNorthEast().lat - bounds.getSouthWest().lat
    var pts = [new BMap.Point(86.204, 39.915), new BMap.Point(116.404, 39.915)]
    // for (var i = 0; i < 2; i++) {
    //   let point = new BMap.Point(
    //     bounds.getSouthWest().lng + lngSpan * (Math.random() * 0.7 + 0.15),
    //     bounds.getSouthWest().lat + latSpan * (Math.random() * 0.7 + 0.15)
    //   )
    //   pts.push(point)
    //   this._addMarker(point, map, iconUrl)
    // }
    // this._addLine(pts, map, '#8b95b8')
    this._addMarker(pts[0], map, iconUrl)
    this._addMarker(pts[1], map, iconUrl)
    this._searchRoute(pts[0], pts[1], map, '#111')
  }
  /**
   *
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
    map.setCurrentCity("北京") // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    map.addControl(new BMap.NavigationControl())
    map.addControl(new BMap.ScaleControl()) // 添加比例尺控件
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
      onSearchComplete: function (res) {
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
          map.setViewport(arrPois)
        }
      }
    })
    drv.search('北京', '上海')
  }
  render() {
    return ( 
      <div id = "bdMap"
        style = {{width: '500px', height: '500px'}}>
      </div>
    )
  }
}

export default Map