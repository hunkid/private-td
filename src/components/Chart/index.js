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
    this._loadData()
  }
  _loadData () {
    if (this.props.data instanceof Array) {      
      this.temperatureArr = []
      this.timeArr = []
      this.props.data.forEach( (da) => {
        this.temperatureArr.push([da.time, da.temperature]) //二维数组
        // this.timeArr.push(da.time)
      })
    }
    this._drawChart()
  }
  _initChart () {
    this.chart = echarts.init(document.getElementById('ct-container'))
    // var myChart = echarts.init(document.getElementById('ct-container'));
    // 绘制图表
  }
  _drawChart () {
    let opt = {
      chart: {
        type: 'line'                          //指定图表的类型，默认是折线图（line）
      },
      title: {
        text: '温度-时刻表' // 指定图表标题
        // textStyle
      },
      xAxis: {
        type: 'time', //
        splitLine: {
          lineStyle: {
              type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value', //
        splitLine: {
          lineStyle: {
              type: 'dashed'
          }
        }
      },
      plotOptions: {
        series: {
            allowPointSelect: true
        }
      },
      series: [{
        name: '当日温度曲线', // 数据列名
        type: 'line',
        data: this.temperatureArr                // 数据
      }]
    }
    // this.chart.setOption({
    //   title: { text: 'ECharts 入门示例' },
    //   tooltip: {},
    //   xAxis: {
    //       data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    //   },
    //   yAxis: {},
    //   series: [{
    //       name: '销量',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20]
    //   }]
    // });
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
