// 电流的折线图
import React, {useEffect, useRef} from "react" 
import echarts from "echarts/lib/echarts"
import "echarts/lib/chart/line"

const clOptions = {
  tooltip: {
    trigger: "axis",
    formatter: function(params) {
      console.log(params)
      if (params instanceof Array) {
        const [{marker, axisValue, value}] = params
        return `${marker} ${axisValue}<br/>区间最大电流: ${value}A`
      } else if (params instanceof Object) {
        return `${params.marker} ${params.name}<br/>区间最大电流: ${params.value}A`
      }
      return ""
    }
  },
  xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: "white"
        }
      },
      name: "日期"
  },
  yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "white"
        }
      },
      splitLine: {
        show: false
      },
      name: "最大电流(A)"
  },
  series: [{
      data: [],
      type: "line",
      itemStyle: {
        color: "white"
      }
  }]
}
let clEchart = null

const CurrentLine = (props) => {
  const refCharts = useRef()
  const { data } = props
  useEffect(() => {
    if (clEchart) clEchart.clear()
    clOptions.series[0].data = data.map(el => el.maxCur)
    clOptions.xAxis.data = data.map(el => el.date)
    if (!clEchart) clEchart = echarts.init(refCharts.current)
    clEchart.clear()
    clEchart.setOption({ ...clOptions }, true)
    console.log("refCharts.current",clEchart, clOptions, data)
    clEchart.resize()
    window.addEventListener("resize", clEchart.resize)

    return () => {
      // 返回函数相当于 componentWillUnmount
      window.removeEventListener("resize", clEchart.resize)
      clEchart.clear()
      clEchart = null
    }
  }, [data])
  return (
    <div className="echarts" ref={refCharts} style={{ width: "100%", height: "400px" }} />
  )
}

export default CurrentLine