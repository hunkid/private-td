import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import iconUrl from '../../assets/img/bus.png'
import { message } from 'antd'
import loadIcon from '../../assets/icon/load.png'
import unloadIcon from '../../assets/icon/unload.png'
import closeIcon from '../../assets/icon/close.png'
import openIcon from '../../assets/icon/open.png'
import transportIcon from '../../assets/icon/transport.png'
import powerOn from '../../assets/icon/powerOn.png'
import * as iconTypes from '../../constants/Icon'
import {isCoordInvalid} from '../../util'

let chooseIcon = {
  [iconTypes.CLOSE]: {
    src: closeIcon,
    text: '冰箱关盖子'
  },
  [iconTypes.OPEN]: {
    src: openIcon,
    text: '冰箱开盖子'
  },
  [iconTypes.LOAD]: {
    src: loadIcon,
    text: '放入血包'
  },
  [iconTypes.UNLOAD]: {
    src: unloadIcon,
    text: '取出血包'
  },
  [iconTypes.TRANSPORT]: {
    src: transportIcon,
    text: '运输中'
  },
  [iconTypes.POWERON]: {
    src: powerOn,
    text: '冰箱开机'
  }
}
var BMap = window.BMap
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS
// const BMAP_ANCHOR_TOP_LEFT = window.BMAP_ANCHOR_TOP_LEFT
const BMAP_ANCHOR_TOP_RIGHT = window.BMAP_ANCHOR_TOP_RIGHT
const BMAP_ANCHOR_BOTTOM_RIGHT = window.BMAP_ANCHOR_BOTTOM_RIGHT
const BMap_Symbol_SHAPE_POINT = window.BMap_Symbol_SHAPE_POINT

// 显示路线方案标识区别
const FLAG_LINE = 1
const FLAG_ROUTE = 2

/**
 * 异步处理
 * @param {*} ct 
 * @param {*} corArrPiece 
 * @param {*} invalidCount 
 */
async function transPos(ct, corArrPiece) {
  return new Promise(function (resolve, reject){
    ct.translate(corArrPiece, 1, 5, (res) => {
      resolve(res)
    })
  })
}
/**
 * 
 * @param {Object} ct 百度转换器 
 * @param {Array} corArr 总数据，所有信息都在里（温度、step等） 
 * @param {Number} invalidCount 不合规数据 
 * @param {Array}
 * @param {Array}
 * @param {Array}
 * @param {Function} cbFunc 之后执行数据 
 */
async function transPosAndDraw(ct, corArr, cmdArr, temperArr, stepArr, timeArr, cbFunc) {
  let turn = 0
  let count = 0
  let currentCor = {}
  let invalidCount = 0
  let pt, corArrPiece = []
  // console.log(corArr)
  for (let i = 0; i < corArr.length; i++) {
    let coordinate = corArr[i]
    if(isCoordInvalid(coordinate) ||
        (currentCor.lat === coordinate.latitude && 
         currentCor.lng === coordinate.longitude)
      ) {
        invalidCount++
        continue
    }
    pt = new BMap.Point(+coordinate.longitude, +coordinate.latitude)
    count++
    corArrPiece.push(pt)
    cmdArr.push(coordinate.command)
    temperArr.push(coordinate.temperature)
    stepArr.push(coordinate.step)
    timeArr.push(coordinate.time)
    if (count === 10 || i === corArr.length - 1) {
      // 进行纠偏
      let res = await transPos(ct, corArrPiece)
      cbFunc(res, FLAG_LINE, invalidCount, turn)
      turn++
      count = 0
      corArrPiece = []
    }
    currentCor.lat = coordinate.latitude
    currentCor.lng = coordinate.longitude
  }
}

class Map extends Component {
  constructor(props) {
    super(props)
    this._addLine = this._addLine.bind(this)
    this._addMarker = this._addMarker.bind(this)
    this._initMap = this._initMap.bind(this)
    this._drawIcons = this._drawIcons.bind(this)
    this._isInvalid = this._isInvalid.bind(this)
    this._drawRoute = this._drawRoute.bind(this)
    this._accuRouteCB = this._accuRouteCB.bind(this)
    this._setMap = this._setMap.bind(this)
    this._addInsideMarker = this._addInsideMarker.bind(this)
    this._handleMarkerPos = this._handleMarkerPos.bind(this)
    this.cmdArr = []
    this.temperArr = []
    this.stepArr = []
    this.timeArr = []
    this.turn = 0
    this.map = null
    this.m2s = {}
    this.currentCor = {
      lng: 0,
      lat: 0
    }
    this.coordinate = []
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
  _drawIcons() {
    let ct = new BMap.Convertor()
    if (!this.props.coordinate) {
      return
    }
    this.corArr = [] //置空
    this.cmdArr = []
    this.temperArr = []
    // this.olderCor = []
    this.timeArr = []
    this.turn = 0
    // console.log(this.props.coordinate)
    transPosAndDraw(ct, this.props.coordinate, this.cmdArr, this.temperArr, this.stepArr, this.timeArr, this._accuRouteCB)
  }
  /**
   * 纠偏后的回调
   * @param {Object} res
   * @param {Bool} flag 采取画图方式： FLAG_LINE:画直线，FLAG_ROUTE:画路线 
   * @param {Number} invalidCount this.props.coordinate无效数据数目
   * @param {Number} turn 圈数
   */
  _accuRouteCB (res, flag, invalidCount, turn = 0) {
    // console.log(this.temperArr)
    // console.log(this.cmdArr)
    // console.log(res)
    res.points.forEach((pt, i) => {
      // console.log(10 * turn + i)
      let index = 10 * turn + i
      let cmd = this.cmdArr[index]
      let temp = this.temperArr[index]
      // console.log(`温度：${temp}`)
      let step = this.stepArr[index]
      let time = this.timeArr[index]
      if (cmd !== iconTypes.TRANSPORT) {
        // console.log(cmd)
        let iconUrl = chooseIcon[cmd].src
        this._addMarker(pt, this.map, iconUrl, temp, step, time)
      } else {
        this._addInsideMarker(pt, temp, step, time)
      }
      this.corArr.push(pt)
    })
    // console.log(this.corArr)
    // console.log(this.props.coordinate)
    if (this.corArr.length > 0 && this.corArr.length === this.props.coordinate.length - invalidCount) {
      switch (flag) {
        case FLAG_LINE:
          this._addLine(this.corArr, this.map, '#111')
          this._setMap()
          break
        case FLAG_ROUTE:
          this._drawRoute()
          break
        default:
          break
      }
      // console.log(this.cmdArr)
    }
  }
  /**
   * 根据坐标绘制路线，同时设定地图中心、缩放等
   */
  _drawRoute () {
    let corArr = this.corArr.slice()
    corArr = corArr.slice(1, corArr.length - 1)
    this._searchRoute(this.corArr[0], this.corArr[this.corArr.length - 1], corArr, this.map, '#111')
    
    // 单个搜索
    // for (let i = 1; i < this.corArr.length; i++) {
    //   this._searchRoute(this.corArr[i - 1], this.corArr[i], this.map, '#111')
    // }
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
    // console.log(points)
    // console.log(this.stepArr)
    // console.log(this.olderCor)
    map.addOverlay(new BMap.Polyline(points, {
      strokeColor
    }))
  }
  _addInsideMarker(point, temp, step, time) {
    var marker = new BMap.Marker(new BMap.Point(point.lng, point.lat), {
      // 指定Marker的icon属性为Symbol
      icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
        scale: 1,//图标缩放大小
        // fillColor: '#0d5f85',//填充颜色
        fillColor: '#2d98dd',//填充颜色
        fillOpacity: 0.8//填充透明度
      })
    })
    marker.temp = temp
    marker.step = step
    marker.time = time
    marker.addEventListener('click', this._handleMarkerPos)
    this.map.addOverlay(marker)
  }
  /**
   * 在指定坐标上绘制自定义icon
   * @param {Point} point
   * @param {Map} map
   * @param {String} iconUrl
   */
  _addMarker(point, map, iconUrl, temp, step, time) {
    let icon = new BMap.Icon(`${iconUrl}`, new BMap.Size(30, 30), {
      imageSize: BMap.Size(30, 30)
    })
    var marker = new BMap.Marker(point, {
      icon: icon
    })
    marker.setOffset(new BMap.Size(0, -15))
    marker.temp = temp
    marker.step = step
    marker.time = time
    marker.addEventListener('click', this._handleMarkerPos)
    map.addOverlay(marker)
  }
  _handleMarkerPos (e) {
    console.log(e)
    console.log(e.target.step)
    console.log(e.target.temp)
    message.info(`运输id:${e.target.step}，温度：${e.target.temp}，时间：${e.target.time}`)
    // console.log(e.target)
		// alert("marker的位置是" + p.getPosition().lng + "," + p.getPosition().lat)
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
   * @param {Array<Point>} 
   * @param {Map} map 
   * @param {String} strokeColor RGB
   */
  _searchRoute(start, end, pass, map, strokeColor) {
    console.log('a')
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
          this._setMap()
        }
      }
    })
    drv.search(start, end, {waypoints: pass})
    console.log('asdasd')
    
  }
  /**
   * 根据点数，设置地图zoom、中心点
   */
  _setMap () {
    let view = this.map.getViewport(this.corArr)
    this.map.setCenter(view.center)
    this.map.setZoom(view.zoom)
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
