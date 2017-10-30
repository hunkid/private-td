import React, {Component} from 'react'
import PropTypes from 'prop-types'

import 'echarts/lib/chart/line'
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
var echarts = require('echarts/lib/echarts')

class Chart extends Component {
  static defaultProps = {
    data: [{temperature: '', time: ''}]
  }
  constructor (props) {
    super(props)
    this._initChart = this._initChart.bind(this)
    this._loadData = this._loadData.bind(this)
    this._drawChart = this._drawChart.bind(this)
    this.temperatureArr = []
    this.timeArr = []
    this.chart
  }
  componentDidMount () {
    this._initChart()
    this._loadData()
  }
  componentDidUpdate () {
    console.log('aaa')
    console.log(this.props.data)
    this._loadData()
  }
  _loadData () {
    if (this.props.data instanceof Array) { 
      this.temperatureArr = []
      this.timeArr = []
      this.props.data.forEach( (da) => {
        // this.temperatureArr.push([da.time, da.temperature]) //二维数组
        this.temperatureArr.push(da.temperature)
        this.timeArr.push(da.time)
      })
    }
    console.log(this.timeArr)
    this._drawChart()
  }
  _initChart () {
    this.chart = echarts.init(document.getElementById('ct-container'))
  }
  _drawChart () {
    let opt = {
      chart: {
        type: 'line' //指定图表的类型，默认是折线图（line）
      },
      title: {
        text: '温度-时刻表' // 指定图表标题
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              textStyle: {
                  color: '#222'
              }
          }
        },
      },
      grid: [{
        show: true,
        left: 50,
        right: 50
      }],
      xAxis: {
        name: '时刻',
        data: this.timeArr // todo，另设默认值
      },
      yAxis: {
        name: '摄氏度',
        splitLine: {
            show: false
        }
      },
      toolbox: {
        left: 'center',
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
      plotOptions: {
        series: {
          allowPointSelect: true
        }
      },
      series: [{
        name: '当前温度值', // 数据列名
        type: 'line',
        data: this.temperatureArr, // 数据
        markLine: {
          silent: true,
        }
      }]
    }
    console.log('这里')
    console.log(this.timeArr)
    console.log(this.temperatureArr)
    
    this.chart.setOption(opt)
    // console.log(this.temperatureArr)
    // console.log(this.timeArr)
    // this.chart.setOption(opt)
  }

  render () {
    return (
      <div id="ct-container" style={{'minWidth': "800px", 'height':"400px"}}></div>
    )
  }
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object)
}
export default Chart
