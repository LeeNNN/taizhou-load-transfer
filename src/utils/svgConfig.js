/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-escape */
import * as d3 from "d3"
import svgPanZoom from "svg-pan-zoom"

import {
  defsRect,
  defsFengDian,
  defsGuangDian,
  defsShengWuDian,
  defsFeiYunfang,
  defsDeviceDefect,
  defsZhongYaoUser,
  defsMinGanUser,
  defsShuangDianYuanUser
} from "./defsTuYuan.js"

// 当前操作状态
const SVG_NORMAL = 0//正常状态
const SVG_SELECT_POWER = 1//选电源中
const SVG_CUT_LINE = 2//剪线中

const normalColor = "#ff808e"//"#c8808e"

//柱上断路器、断路器 
// :['LoadBreakSwitch_30700000_4040010@1','LoadBreakSwitch_30700000_4040010@1']
// const kBreakerStatues = {
//   on: ["Breaker_11100000_2040010@1", "Breaker_30500000_4030010@1", "Breaker_30500000_4100010@1"],
//   off: ["Breaker_11100000_2040011@0", "Breaker_30500000_4030011@0", "Breaker_30500000_4100011@0"]
// }
const kBreakerStatues = {
  on: ["Breaker_PMS25_30500000_4100010@1", "Breaker_11100000_2040010@1", "Breaker_30500000_4030010@1", "Breaker_30500000_4100010@1", "Breaker_PMS25_11100000_2040010@1", "Breaker_PMS25_30500000_4030010@1"],
  off: ["Breaker_PMS25_30500000_4100011@0", "Breaker_11100000_2040011@0", "Breaker_30500000_4030011@0", "Breaker_30500000_4100011@0", "Breaker_PMS25_11100000_2040011@0", "Breaker_PMS25_30500000_4030011@0"]
}
// 三工位隔离开关、 三工位开关、"CompositeSwitch_30500099_84030071@0"这种未知
// const kCompositeSwitchStatues = {
//   on: ["CompositeSwitch_30600007_4070013@1", "CompositeSwitch_30700002_4070010@1", "CompositeSwitch_30500099_84030070@1"],
//   off: ["CompositeSwitch_30600007_4070014@0", "CompositeSwitch_30700002_4070011@0", "CompositeSwitch_30500099_84030071@0"],
//   earth: ["CompositeSwitch_30600007_4070015@4", "CompositeSwitch_30700002_4070012@4"]
// }
const kCompositeSwitchStatues = {
  on: ["CompositeSwitch_PMS25_30600007_4070013@1", "CompositeSwitch_PMS25_30700002_4070010@1", "CompositeSwitch_PMS25_30500099_84030070@1", "CompositeSwitch_30600007_4070013@1", "CompositeSwitch_30700002_4070010@1", "CompositeSwitch_30500099_84030070@1"],
  off: ["CompositeSwitch_PMS25_30600007_4070014@0", "CompositeSwitch_PMS25_30700002_4070011@0", "CompositeSwitch_PMS25_30500099_84030071@0", "CompositeSwitch_30600007_4070014@0", "CompositeSwitch_30700002_4070011@0", "CompositeSwitch_30500099_84030071@0"]
}
// 柱上负荷开关
// const kLoadBreakSwitchStatues = {
//   on: ["LoadBreakSwitch_30700000_4040010@1", "LoadBreakSwitch_11200000_2050010@1"],
//   off: ["LoadBreakSwitch_30700000_4040011@0", "LoadBreakSwitch_11200000_2050011@0"]
// }
const kLoadBreakSwitchStatues = {
  on: ["LoadBreakSwitch_PMS25_30700000_4040010@1", "LoadBreakSwitch_PMS25_11200000_2050010@1", "LoadBreakSwitch_30700000_4040010@1", "LoadBreakSwitch_11200000_2050010@1"],
  off: ["LoadBreakSwitch_PMS25_30700000_4040011@0", "LoadBreakSwitch_PMS25_11200000_2050011@0", "LoadBreakSwitch_30700000_4040011@0", "LoadBreakSwitch_11200000_2050011@0"]
}
// 熔断器
// const kFuseStatues = {
//   on: ["Fuse_11500000_2090010@1"],
//   off: ["Fuse_11500000_2090011@0"]
// }
const kFuseStatues = {
  on: ["Fuse_PMS25_11500000_2090010@1", "Fuse_PMS25_11500000_2090010@1", "Fuse_11500000_2090010@1", "Fuse_11500000_2090010@1"],
  off: ["Fuse_PMS25_11500000_2090011@0", "Fuse_PMS25_11500000_2090011@0", "Fuse_11500000_2090011@0", "Fuse_11500000_2090011@0"]
}
// 熔断式隔离开关
// const kDisconnectorStatues = {
//   on: ["Disconnector_11300000_4050020@1", "Disconnector_11300000_2060010@1"],
//   off: ["Disconnector_11300000_4050021@0", "Disconnector_11300000_2060011@0"]
// }
const kDisconnectorStatues = {
  on: ["Disconnector_PMS25_11300000_4050020@1", "Disconnector_PMS25_11300000_2060010@1", "Disconnector_11300000_4050020@1", "Disconnector_11300000_2060010@1"],
  off: ["Disconnector_PMS25_11300000_4050021@0", "Disconnector_PMS25_11300000_2060011@0", "Disconnector_11300000_4050021@0", "Disconnector_11300000_2060011@0"]
}

var svgConfig = {
  configs: {
    types: {
      junction: {
        type: "junction",
        devices: []
      }, // 电缆分接头    1
      energyconsumer: {
        type: "energyconsumer",
        devices: []
      }, // 负荷         2
      connline: {
        type: "connline",
        devices: []
      }, //连接线，所有可开放容量的点，都体现在连接线上 3
      breaker: {
        type: "breaker",
        devices: []
      }, //断路器        4
      disconnector: {
        type: "disconnector",
        devices: []
      },// 刀闸          5
      loadbreakswitch: {
        type: "loadbreakswitch",
        devices: []
      },//三分位开关      6
      compositeswitch: {
        type: "compositeswitch",
        devices: []
      }, //负荷开关       7
      powertransformer: {
        type: "powertransformer",
        devices: []
      }, //变压器         8
      substation: {
        type: "substation",
        devices: []
      }, //变电站         9
      busbarsection: {
        type: "busbarsection",
        devices: []
      }, //母线           10
      aclinesegment: {
        type: "aclinesegment",
        devices: []
      }, //交流线段        11
      polecode: {
        type: "polecode",
        devices: []
      }, //支线           12
      fuse: {
        type: "fuse",
        devices: []
      } //跌落式熔断器     13
    },
    devices: {},
  },
  // svg的状态
  svg_statue: SVG_NORMAL,
  defaultPower: null,
  power_devices: [],//电源设备 {id, default, select}
  // 用户选择的电源
  select_powers: [],
  // 用户剪掉的线
  cut_lines: [],
  //每个电源供电模型 select_powers的元素为key，供电路径为：value
  power_run_paths: {},
  // 剪线受影响的供电路径
  off_device_run_paths: {},
  // 页面初始未供电的设备
  lone_device: {},
  time: null,//定时器
  totalTime: 0,//总时长
  // 以可接入点的ID为key，value--->(connectDevice：可接入设备，type：能源类型，direction：放置的方向，newEnergyDevicesId：svg图上的ID，yaoCeId：遥测点的ID)
  accessNewEnergyDevices: {},//可接入新能源的设备 
  clickCurrentEnergyDevice: {},//点击的新能源设备
  feiYunFangDevices: {},//非正常运行方式的设备
  deviceDefect: {},// 设备缺陷的设备表
  userType: {},//用户类型：敏感用户、重要用户、双电源用户

  // 构建configs模型
  init: function () {
    svgConfig.clean()
    var svgDocument = document.getElementById("svg")
    getChildNodes(svgDocument, procGetObject)
    buildConnect()
    // defaultPower();
  },
  // // 清空configs模型
  clean: function () {
    svgConfig.configs.types.junction.devices = []
    svgConfig.configs.types.energyconsumer.devices = []
    svgConfig.configs.types.connline.devices = []
    svgConfig.configs.types.breaker.devices = []
    svgConfig.configs.types.disconnector.devices = []

    svgConfig.configs.types.loadbreakswitch.devices = []
    svgConfig.configs.types.compositeswitch.devices = []
    svgConfig.configs.types.powertransformer.devices = []
    svgConfig.configs.types.substation.devices = []
    svgConfig.configs.types.busbarsection.devices = []

    svgConfig.configs.types.aclinesegment.devices = []
    svgConfig.configs.types.polecode.devices = []
    svgConfig.configs.types.fuse.devices = []
    svgConfig.configs.devices = []

    svgConfig.svg_statue = SVG_NORMAL
    svgConfig.select_powers = []
    svgConfig.power_run_paths = {}
    svgConfig.off_device_run_paths = {}
    svgConfig.cut_lines = []
    svgConfig.lone_device = {} // 孤岛
    svgConfig.accessNewEnergyDevices = {}
    svgConfig.clickCurrentEnergyDevice = {}
    svgConfig.feiYunFangDevices = {}
    svgConfig.deviceDefect = {}
    svgConfig.userType = {}
    svgConfig.clearTime()
  },
  clearTime: function () {
    if (svgConfig.time) {
      svgConfig.totalTime = 0
      window.clearInterval(svgConfig.time)
      svgConfig.time = null
    }
  }
}
/** 
  以下代码构建configs模型
*/
function get_firstchild (node) {
  var x = node.firstChild
  while (x && x.nodeType != 1) {
    x = x.nextSibling
  }
  return x
}
function getChildNodes (parent, procfunc) {
  var child = get_firstchild(parent)
  if (child != null) {
    if (!procfunc(child, parent)) {
      getChildNodes(child, procfunc)
    }
    while (child.nextElementSibling != null) {
      child = child.nextElementSibling
      if (!procfunc(child, parent)) {
        getChildNodes(child, procfunc)
      }
    }
  }
}
// 需要继续详细扫描返回0，否则返回-1
function procGetObject (child) {
  // 图层与图元都是g，非g可以不向下处理
  if (child.nodeName != "g") {
    return -1
  }
  if (child.id === "Text_Layer") {
    return -1
  }

  var classList = child.classList
  // svg-pan-zoom_viewport顶层g
  if (classList.length != 0 && classList[0] === "svg-pan-zoom_viewport") {
    return 0
  }

  // 图层自身不必处理
  if (child.id.indexOf("_Layer") != -1) {
    return 0
  }

  procDevice(child)
  return -1
}
function procDevice (device) {
  var dev = { connect: [] }

  var meta = device.getElementsByTagName("metadata")
  if (!meta) {
    return
  }
  var psr = meta[0].getElementsByTagName("cge:psr_ref")
  if (!psr) {
    return
  }
  var layers = meta[0].getElementsByTagName("cge:layer_ref")
  if ((!layers) || layers.length == 0) {
    return
  }
  //var layer = layers[0].getAttribute('ObjectName');
  var layer = layers[0].getAttribute("objectname")
  layer = layer.substr(0, layer.indexOf("_Layer")).toLowerCase()

  psr = psr[0]
  dev.psrType = psr.getAttribute("psrtype")
  dev.global = psr.getAttribute("globeid")
  dev.objectname = psr.getAttribute("objectname") || ""
  dev.id = device.id
  dev.g = device
  dev.type = svgConfig.configs.types[layer]

  if (dev.type) {
    //console.log("layer is: " + layer);
    svgConfig.configs.types[layer].devices.push(dev)
    svgConfig.configs.devices[device.id] = dev
  }
}
//根据configs对象，构建设备之间的连接关系 
function buildConnect () {
  var devices = svgConfig.configs.devices
  for (var key in devices) {
    if (devices.hasOwnProperty(key)) {
      var element = devices[key]
      var g = element.g
      var meta = g.getElementsByTagName("metadata")
      if (!meta) {
        continue
      }
      var links = meta[0].getElementsByTagName("cge:glink_ref")
      for (var i = 0; i < links.length; i++) {
        var obj = links[i].getAttribute("objectid")
        if (devices[obj]) {
          element.connect.push(devices[obj])
        } else {
          // console.warn(obj + '找不到对应的设备');
        }
      }
    }
  }
}

function setPowersDevices (powersDevices) {
  var pds = powersDevices.filter(function (elem) {
    if (!svgConfig.configs.devices[elem.id]) return false
    return true
  })
  // pds = pds.concat(findOpenConn());
  // console.log("pds: ", pds)
  svgConfig.power_devices = pds.map(function (elem) {
    if (elem.hasOwnProperty("isPower")) {
      elem.default = elem.isPower
    } else {
      elem.default = false
    }
    return elem
  })
  defaultPower()
}
// 设置默认电源
function defaultPower () {
  for (var i = 0; i < svgConfig.power_devices.length; i++) {
    var deviceId = svgConfig.power_devices[i].id
    var tuyuan = document.getElementById(deviceId)
    d3.select(tuyuan).select("rect").remove()
    // 绑定点击事件
    d3.select(svgConfig.configs.devices[deviceId].g).on("click", null)
  }

  svgConfig.select_powers = svgConfig.power_devices.filter(function (element) {
    return element.default
  }).map(function (element) {
    return element["id"]
  })
  // powerDeviceColor(svgConfig.select_powers)
  findAllPowersRunPaths(svgConfig.select_powers, svgConfig.power_run_paths, true)
}
// 
function updateSelectPower (powerId, remove) {
  var tuyuan = document.getElementById(powerId)
  if (remove) {
    svgConfig.select_powers.splice(svgConfig.select_powers.indexOf(powerId), 1)
    d3.select(tuyuan).select("rect").attr("stroke-dasharray", "0.8px")
  } else {
    svgConfig.select_powers.push(powerId)
    d3.select(tuyuan).select("rect").attr("stroke-dasharray", "0px")
  }
  topology()
}
// 电源设备染色
function powerDeviceColor (powerDevices) {
  for (var i = 0; i < powerDevices.length; i++) {
    var deviceId = powerDevices[i].hasOwnProperty("id") ? powerDevices[i].id : powerDevices[i]
    if (svgConfig.select_powers != powerDevices
      && svgConfig.select_powers.indexOf(deviceId) > -1) continue
    var tuyuan = document.getElementById(deviceId)
    var width = tuyuan.getBBox().width
    var x = tuyuan.getBBox().x, y = tuyuan.getBBox().y
    if (tuyuan.getBBox().width > tuyuan.getBBox().height) {
      width = tuyuan.getBBox().width
      y -= (tuyuan.getBBox().width - tuyuan.getBBox().height) / 2.0
    } else {
      width = tuyuan.getBBox().height
      x += (tuyuan.getBBox().width - tuyuan.getBBox().height) / 2.0
    }
    d3.select(tuyuan).append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", width)
      // .attr("opacity", .1)
      .attr("fill", "rgba(0,0,0,0.01)")
      .attr("stroke-width", "0.5px")
      .attr("stroke-dasharray", svgConfig.select_powers.indexOf(deviceId) > -1 ? "0px" : "0.8px")
      .attr("stroke", "orange")
  }
}
//设置联络开关的颜色
function setConnectBreakerColor () {
  let powerDevices = svgConfig.power_devices
  let color = "#00f"
  for (var i = 0; i < powerDevices.length; i++) {
    var deviceId = powerDevices[i].hasOwnProperty("id") ? powerDevices[i].id : powerDevices[i]
    var tuyuan = document.getElementById(deviceId)
    var polys = d3.select(tuyuan).selectAll("polyline")
    var uses = d3.select(tuyuan).selectAll("use")
    if (polys.size() > 0) polys.style("stroke", color)
    if (uses.size() > 0) {
      uses.style("fill", color)
      uses.style("stroke", color)
    }
  }
}
function startSelectPower (callback) {
  stopAllControl()
  if (svgConfig.svg_statue == SVG_SELECT_POWER) return
  powerDeviceColor(svgConfig.power_devices)
  for (var i = 0; i < svgConfig.power_devices.length; i++) {
    var deviceId = svgConfig.power_devices[i].id
    // 绑定点击事件
    d3.select(svgConfig.configs.devices[deviceId].g).on("click", function () {
      var powerId = d3.select(this).attr("id")
      callback(powerId, svgConfig.select_powers.indexOf(powerId) > -1, svgConfig.configs.devices[powerId].objectname)
    })
  }
  svgConfig.svg_statue = SVG_SELECT_POWER

}
function stopSelectPower () {
  if (svgConfig.svg_statue != SVG_SELECT_POWER) return
  svgConfig.svg_statue = SVG_NORMAL
  // CompositeSwitch_Layer(false, null);
  // Breaker_Layer(false, null);
  // ACLineSegment_Layer(false, null);

  for (var i = 0; i < svgConfig.power_devices.length; i++) {
    var deviceId = svgConfig.power_devices[i].id
    var tuyuan = document.getElementById(deviceId)
    if (!(svgConfig.select_powers.indexOf(deviceId) > -1)) {
      d3.select(tuyuan).select("rect").remove()
    }
    // 绑定点击事件
    d3.select(svgConfig.configs.devices[deviceId].g).on("click", null)
  }
}
/** 
* 剪线管理
*/
// 剪线回调 第一个参数是设备的ID，第二个参数是不是剪线设备，第三个参数是设备的状态是分(false)是合(true)
function outUpdateCutLine (deviceId, statue) {
  console.log("剪线回调")
  var tuyuan = document.getElementById(deviceId)
  var device = svgConfig.configs.devices[deviceId]
  if (device.type.type == "compositeswitch") {// 负荷开关
    console.log("剪线回调 负荷开关")
    var compositeSwitch_statue = d3.select(tuyuan).select("use").attr("xlink:href").substr(1)
    if (statue) {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kCompositeSwitchStatues.off[kCompositeSwitchStatues.on.indexOf(compositeSwitch_statue)])
    } else {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kCompositeSwitchStatues.on[kCompositeSwitchStatues.off.indexOf(compositeSwitch_statue)])
    }
  } else if (device.type.type == "loadbreakswitch") {
    console.log("剪线回调 loadbreakswitch")
    var loadbreakswitch_statue = d3.select(tuyuan).select("use").attr("xlink:href").substr(1)
    if (statue) {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kLoadBreakSwitchStatues.off[kLoadBreakSwitchStatues.on.indexOf(loadbreakswitch_statue)])
    } else {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kLoadBreakSwitchStatues.on[kLoadBreakSwitchStatues.off.indexOf(loadbreakswitch_statue)])
    }
  } else if (device.type.type == "fuse") {
    console.log("剪线回调 fuse")
    var fuse_statue = d3.select(tuyuan).select("use").attr("xlink:href").substr(1)
    if (statue) {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kFuseStatues.off[kFuseStatues.on.indexOf(fuse_statue)])
    } else {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kFuseStatues.on[kFuseStatues.off.indexOf(fuse_statue)])
    }
  } else if (device.type.type == "disconnector") {
    console.log("剪线回调 disconnector")
    var disconnector_statue = d3.select(tuyuan).select("use").attr("xlink:href").substr(1)
    if (statue) {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kDisconnectorStatues.off[kDisconnectorStatues.on.indexOf(disconnector_statue)])
    } else {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kDisconnectorStatues.on[kDisconnectorStatues.off.indexOf(disconnector_statue)])
    }
  } else if (device.type.type == "breaker") {//开关
    console.log("剪线回调 开关")
    var breaker_statue = d3.select(tuyuan).select("use").attr("xlink:href").substr(1)
    console.log("breaker_statue", breaker_statue)
    console.log(tuyuan)
    if (statue) {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kBreakerStatues.off[kBreakerStatues.on.indexOf(breaker_statue)]) //alert("点击了确定");   
    } else {
      d3.select(tuyuan).select("use").attr("xlink:href", "#" + kBreakerStatues.on[kBreakerStatues.off.indexOf(breaker_statue)])
    }
  } else if (device.type.type == "aclinesegment" || device.type.type == "connline") {// 线路
    console.log("剪线回调 线路")
    if (!statue) {
      d3.select(tuyuan).select("polyline").attr("userdata", "") //alert("点击了确定");
      // d3.select(tuyuan).select("polyline").style("stroke", "#fff"); 
    } else {
      d3.select(tuyuan).select("polyline").attr("userdata", "off") //alert("点击了确定");
      // d3.select(tuyuan).select("polyline").style("stroke", "#aaa"); 
    }
  }
  updateCutLine(deviceId)
  topology()
}
// 更新剪线设备集合
function updateCutLine (deviceId) {
  if (svgConfig.cut_lines.indexOf(deviceId) > -1) {
    svgConfig.cut_lines.splice(svgConfig.cut_lines.indexOf(deviceId), 1)
  } else {
    svgConfig.cut_lines.push(deviceId)
  }
}
// 提示哪些线可以剪掉
function cutLineReminder () {
  svgConfig.clearTime()
  svgConfig.time = window.setInterval(function () {
    var colors = [normalColor, "#eee"]
    svgConfig.totalTime++
    if (svgConfig.totalTime <= 10) {
      for (var key in svgConfig.configs.devices) {
        if (svgConfig.configs.devices.hasOwnProperty(key)
          && !svgConfig.lone_device.hasOwnProperty(key)) {
          // 首先判断是不是剪过的设备（#fff）
          if (svgConfig.cut_lines.indexOf(key) > -1) {
            colors = ["#fff", "#eee"]
          }
          // 判断是不是受影响的设备 （#999）
          var offPowerRunPaths = svgConfig.off_device_run_paths
          for (var offPowerId in offPowerRunPaths) {
            if (offPowerRunPaths.hasOwnProperty(offPowerId)
              && offPowerRunPaths[offPowerId].hasOwnProperty(key)) {
              colors = ["#999", "#eee"]
              break
            }
          }
          var device = svgConfig.configs.devices[key]
          var polys = d3.select(device.g).selectAll("polyline")
          if (polys.size() > 0) polys.style("stroke", colors[svgConfig.totalTime % 2])
          var uses = d3.select(device.g).selectAll("use")
          if (uses.size() > 0) {
            uses.style("fill", colors[svgConfig.totalTime % 2])
            uses.style("stroke", colors[svgConfig.totalTime % 2])
          }
        }
      }
    } else {
      svgConfig.clearTime()
      topology()
    }
  }, 500)
}
function startCutLine (callback) {
  stopAllControl()
  svgConfig.svg_statue = SVG_CUT_LINE
  cutLineReminder()
  for (var key in svgConfig.configs.devices) {
    if (svgConfig.configs.devices.hasOwnProperty(key)
      && !svgConfig.lone_device.hasOwnProperty(key)) {
      d3.select(svgConfig.configs.devices[key].g).on("click", function () {
        console.log("点击")
        var deviceId = d3.select(this).attr("id")
        var device = svgConfig.configs.devices[deviceId]
        var statue = true
        if (device.type.type == "compositeswitch") {// 负荷开关
          console.log("负荷开关")
          var compositeSwitch_statue = d3.select(this).select("use").attr("xlink:href").substr(1)
          if (kCompositeSwitchStatues.off.indexOf(compositeSwitch_statue) > -1) {
            statue = false
          }
        } else if (device.type.type == "loadbreakswitch") {//开关
          console.log("开关")
          var loadbreakswitch_statue = d3.select(this).select("use").attr("xlink:href").substr(1)
          if (kLoadBreakSwitchStatues.off.indexOf(loadbreakswitch_statue) > -1) {
            statue = false
          }
        } else if (device.type.type == "fuse") {
          var fuse_statue = d3.select(this).select("use").attr("xlink:href").substr(1)
          if (kFuseStatues.off.indexOf(fuse_statue) > -1) {
            statue = false
          }
        } else if (device.type.type == "disconnector") {
          var disconnector_statue = d3.select(this).select("use").attr("xlink:href").substr(1)
          if (kDisconnectorStatues.off.indexOf(disconnector_statue) > -1) {
            statue = false
          }
        } else if (device.type.type == "breaker") {
          var breaker_statue = d3.select(this).select("use").attr("xlink:href").substr(1)
          if (kBreakerStatues.off.indexOf(breaker_statue) > -1) {
            statue = false
          }
        } else if (device.type.type == "aclinesegment") {// 线路
          var lineSegment_statue = d3.select(this).select("polyline").attr("userdata")
          if (lineSegment_statue == "off") {
            statue = false
          }
        } else if (device.type.type == "connline") { //
          var lineSegment_statue = d3.select(this).select("polyline").attr("userdata")
          if (lineSegment_statue == "off") {
            statue = false
          }
        }

        // 剪线回调 第一个参数是设备的ID，第二个参数是不是剪线设备，第三个参数是设备的状态:分/合
        callback(deviceId, svgConfig.cut_lines.indexOf(deviceId) > -1, statue, device.objectname, device.type.type)
      })
    }
  }
}
function stopCutLine () {
  svgConfig.svg_statue = SVG_NORMAL
  svgConfig.clearTime()
  for (var key in svgConfig.configs.devices) {
    if (svgConfig.configs.devices.hasOwnProperty(key)
      && !svgConfig.lone_device.hasOwnProperty(key)) {
      d3.select(svgConfig.configs.devices[key].g).on("click", null)
    }
  }
  topology()
}
// 
function stopAllControl () {
  if (svgConfig.svg_statue == SVG_SELECT_POWER) {
    stopSelectPower()
  } else if (svgConfig.svg_statue == SVG_CUT_LINE) {
    stopCutLine()
  }
}
/** 
* 拓扑
*/
function topology () {
  // 先恢复初始状态
  for (var deviceId in svgConfig.configs.devices) {
    if (svgConfig.configs.devices.hasOwnProperty(deviceId)) {
      var tuyuan = d3.select(svgConfig.configs.devices[deviceId].g)
      var color = "#fff"
      var polys = tuyuan.selectAll("polyline")
      var uses = tuyuan.selectAll("use")
      var polygons = tuyuan.selectAll("polygon") //选不到不应该有
      if (polys.size() > 0) polys.style("stroke", color)
      if (uses.size() > 0) {
        uses.style("fill", color)
        uses.style("stroke", color)
      }
      if (polygons.size() > 0) {
        polygons.style("stroke", color)
      }
    }
  }

  var powers = svgConfig.select_powers
  if (powers.length > 0) {
    var powerRunPaths = {}
    findAllPowersRunPaths(powers, powerRunPaths)
    ///利用svgConfig.power_run_paths 和 powerRunPaths可以求出剪线受影响的用户（断电用户和供电用户）
    svgConfig.power_run_paths = powerRunPaths
    updateRunPathsInColor()
  } else {
    // console.log("查看拓扑时没有找到供电电源")
    svgConfig.power_run_paths = {}
    initLoneDevice(false)
  }

  //剪线受影响的供电路径（断电用户）
  var offDeviceRunPaths = {}
  var OFFDevices = getAllOFFDevices()
  for (var i = 0; i < svgConfig.cut_lines.length; i++) {
    var offDeviceId = svgConfig.cut_lines[i]
    // console.log("offDeviceId:", offDeviceId, i)
    var device = svgConfig.configs.devices[offDeviceId]
    for (var j = 0; j < device.connect.length; j++) {
      var linkDeviceId = device.connect[j].id
      // 找到不供电的一端且不是剪线状态
      if (!verifyDeviceAtPowerRunPaths(linkDeviceId)
        && OFFDevices.indexOf(linkDeviceId) < 0) {
        if (!offDeviceRunPaths[offDeviceId]) {
          offDeviceRunPaths[offDeviceId] = {}
          offDeviceRunPaths[offDeviceId][offDeviceId] = svgConfig.configs.devices[offDeviceId]
        }
        offDeviceRunPaths[offDeviceId][linkDeviceId] = svgConfig.configs.devices[linkDeviceId]
        // console.log("linkDeviceId:", svgConfig.configs.devices[linkDeviceId], linkDeviceId)
        findRunPathFromDevice(offDeviceRunPaths, offDeviceId, svgConfig.configs.devices[linkDeviceId], OFFDevices)
      }
    }
  }
  svgConfig.off_device_run_paths = offDeviceRunPaths
  // console.log("svgConfig.off_device_run_paths:", svgConfig.off_device_run_paths)
  updateRunPathsInColor()
  setConnectBreakerColor()

}
// 验证设备是否在供电
function verifyDeviceAtPowerRunPaths (deviceId) {
  var powerRunPaths = svgConfig.power_run_paths
  for (var powerId in powerRunPaths) {
    if (powerRunPaths.hasOwnProperty(powerId)
      && powerRunPaths[powerId][deviceId]) {
      return true
    }
  }
  return false
}

// 查找所有电源的供电路径
function findAllPowersRunPaths (powers, powerRunPaths, putInPowerDevices) {
  var OFFDevices = getAllOFFDevices()
  for (var i = 0, len = powers.length; i < len; i++) {
    var powerId = powers[i]
    if (!powerRunPaths.hasOwnProperty(powerId)) {
      powerRunPaths[powerId] = {}
    }
    findRunPathFromDevice(powerRunPaths, powerId, svgConfig.configs.devices[powerId], OFFDevices, putInPowerDevices)
  }
}
// 单个设备的连接关系
function findRunPathFromDevice (powerRunPaths, powerId, lastDevice, OFFDevices, putInPowerDevices) {
  if (lastDevice && lastDevice.connect.length > 0) {
    for (var j = lastDevice.connect.length - 1; j >= 0; j--) {
      var device = lastDevice.connect[j]
      var run = powerRunPaths[powerId]
      if (run.hasOwnProperty(device.id)) {
        continue
      }
      if (OFFDevices.indexOf(device.id) > -1) {
        // 可以设为电源的设备
        // if (putInPowerDevices) {
        //     if (device.type.type == 'breaker'
        //         || device.type.type == 'compositeswitch'
        //         || device.type.type == 'loadbreakswitch') {
        //         svgConfig.power_devices.push(device);
        //     }
        // }
        continue
      }
      run[device.id] = device
      findRunPathFromDevice(powerRunPaths, powerId, device, OFFDevices, putInPowerDevices)
    }
  }
}

// 所有处于断路状态下的设备
function getAllOFFDevices () {
  var OFFDevices = []
  d3.select("#svg").select("g#CompositeSwitch_Layer").selectAll("g").each(function (d, i, v) {
    if (d3.select(v[i]).select("use").size() > 0) {
      var compositeSwitch_statue = shiftFirstChar(d3.select(v[i]).select("use").attr("xlink:href"))
      if (kCompositeSwitchStatues.off.indexOf(compositeSwitch_statue) > -1)
        OFFDevices.push(d3.select(v[i]).attr("id"))
    }
  })
  d3.select("#svg").select("g#LoadBreakSwitch_Layer").selectAll("g").each(function (d, i, v) {
    if (d3.select(v[i]).select("use").size() > 0) {
      var loadbreakswitch_statue = shiftFirstChar(d3.select(v[i]).select("use").attr("xlink:href"))
      if (kLoadBreakSwitchStatues.off.indexOf(loadbreakswitch_statue) > -1)
        OFFDevices.push(d3.select(v[i]).attr("id"))
    }
  })
  d3.select("#svg").select("g#Fuse_Layer").selectAll("g").each(function (d, i, v) {
    if (d3.select(v[i]).select("use").size() > 0) {
      var fuse_statue = shiftFirstChar(d3.select(v[i]).select("use").attr("xlink:href"))
      if (kFuseStatues.off.indexOf(fuse_statue) > -1)
        OFFDevices.push(d3.select(v[i]).attr("id"))
    }
  })
  d3.select("#svg").select("g#Disconnector_Layer").selectAll("g").each(function (d, i, v) {
    if (d3.select(v[i]).select("use").size() > 0) {
      var disconnector_statue = shiftFirstChar(d3.select(v[i]).select("use").attr("xlink:href"))
      if (kDisconnectorStatues.off.indexOf(disconnector_statue) > -1)
        OFFDevices.push(d3.select(v[i]).attr("id"))
    }
  })
  d3.select("#svg").select("g#Breaker_Layer").selectAll("g").each(function (d, i, v) {
    if (d3.select(v[i]).select("use").size() > 0) {
      var breaker_statue = shiftFirstChar(d3.select(v[i]).select("use").attr("xlink:href"))
      if (kBreakerStatues.off.indexOf(breaker_statue) > -1)
        OFFDevices.push(d3.select(v[i]).attr("id"))
    };
  })
  d3.select("#svg").select("g#ACLineSegment_Layer").selectAll("g").each(function (d, i, v) {
    if (d3.select(v[i]).select("polyline").attr("userdata") == "off") {
      OFFDevices.push(d3.select(v[i]).attr("id"))
    };
  })
  d3.select("#svg").select("g#ConnLine_Layer").selectAll("g").each(function (d, i, v) {
    if (d3.select(v[i]).select("polyline").attr("userdata") == "off") {
      OFFDevices.push(d3.select(v[i]).attr("id"))
    };
  })
  return OFFDevices
}

// 
function updateRunPathsInColor () {
  var powerRunPaths = svgConfig.power_run_paths
  for (var powerId in powerRunPaths) {
    if (powerRunPaths.hasOwnProperty(powerId)) {
      for (var deviceId in powerRunPaths[powerId]) {
        if (powerRunPaths[powerId].hasOwnProperty(deviceId)) {
          var tuyuan = d3.select(powerRunPaths[powerId][deviceId].g)
          var color = normalColor
          var polys = tuyuan.selectAll("polyline")
          var uses = tuyuan.selectAll("use")
          var polygons = tuyuan.selectAll("polygon") //选不到不应该有
          if (polys.size() > 0) polys.style("stroke", color)
          if (uses.size() > 0) {
            uses.style("fill", color)
            uses.style("stroke", color)
          }
          if (polygons.size() > 0) {
            polygons.style("stroke", color)
          }
        }
      }
    }
  }
  // 受影响的用户
  var offPowerRunPaths = svgConfig.off_device_run_paths
  for (var offPowerId in offPowerRunPaths) {
    if (offPowerRunPaths.hasOwnProperty(offPowerId)) {
      for (var offDeviceId in offPowerRunPaths[offPowerId]) {
        if (offPowerRunPaths[offPowerId].hasOwnProperty(offDeviceId)) {
          var tuyuan = d3.select(offPowerRunPaths[offPowerId][offDeviceId].g)
          var color = "#999"
          var polys = tuyuan.selectAll("polyline")
          var uses = tuyuan.selectAll("use")
          var polygons = tuyuan.selectAll("polygon") //选不到不应该有
          if (polys.size() > 0) polys.style("stroke", color)
          if (uses.size() > 0) {
            uses.style("fill", color)
            uses.style("stroke", color)
          }
          if (polygons.size() > 0) {
            polygons.style("stroke", color)
          }
        }
      }
    }
  }

  // 用户剪掉的线的颜色 剪掉的线没有电源端的线路颜色（黄色）
  for (var i = svgConfig.cut_lines.length - 1; i >= 0; i--) {
    var offDeviceId = svgConfig.cut_lines[i]
    var tuyuan = d3.select(svgConfig.configs.devices[offDeviceId].g)
    var color = "#0f0"
    var polys = tuyuan.selectAll("polyline")
    var uses = tuyuan.selectAll("use")
    var polygons = tuyuan.selectAll("polygon") //选不到不应该有
    if (polys.size() > 0) polys.style("stroke", color)
    if (uses.size() > 0) {
      uses.style("fill", color)
      uses.style("stroke", color)
    }
    if (polygons.size() > 0) {
      polygons.style("stroke", color)
    }
  }

}
// 验证孤岛(任何电源点都不能给他供电叫做孤岛)
function initLoneDevice (topo) {
  if (topo) {
    topology()
  }

  var powerRunPaths = {}
  for (var i = 0; i < svgConfig.power_devices.length; i++) {
    var powerId = svgConfig.power_devices[i].id
    if (!powerRunPaths.hasOwnProperty(powerId)) {
      powerRunPaths[powerId] = {}
    }
    findRunPathFromDevice(powerRunPaths, powerId, svgConfig.configs.devices[powerId], [])
  }
  for (var deviceId in svgConfig.configs.devices) {
    if (svgConfig.configs.devices.hasOwnProperty(deviceId)) {
      var exist = false
      for (var powerId in powerRunPaths) {
        if (powerRunPaths.hasOwnProperty(powerId)
          && powerRunPaths[powerId][deviceId]) {
          exist = true
          break
        }
      }
      if (!exist) {
        svgConfig.lone_device[deviceId] = svgConfig.configs.devices[deviceId]
      }
    }
  }

  // 非可供电的设备
  var non_electricDevices = []
  d3.select("#svg").select("g#Substation_Layer").selectAll("g").each(function (d, i, v) {
    if (!(non_electricDevices.indexOf(d3.select(v[i]).attr("id")) > -1))
      non_electricDevices.push(d3.select(v[i]).attr("id"))
  })
  for (var deviceId in svgConfig.lone_device) {
    if (svgConfig.lone_device.hasOwnProperty(deviceId)
      && !(non_electricDevices.indexOf(deviceId) > -1)) {
      var tuyuan = d3.select(svgConfig.lone_device[deviceId].g)
      var color = "#fff"
      var polys = tuyuan.selectAll("polyline")
      var uses = tuyuan.selectAll("use")
      var polygons = tuyuan.selectAll("polygon") //选不到不应该有
      if (polys.size() > 0) polys.style("stroke", color)
      if (uses.size() > 0) {
        uses.style("fill", color)
        uses.style("stroke", color)
      }
      if (polygons.size() > 0) {
        polygons.style("stroke", color)
      }
    }
  }

}

// 重置功能
function resetConfigStatue () {
  // svg的状态
  svgConfig.svg_statue = SVG_NORMAL
  svgConfig.select_powers = []
  defaultPower()
  svgConfig.power_run_paths = {}
  svgConfig.off_device_run_paths = {}
  // cut_lines
  for (var i = svgConfig.cut_lines.length - 1; i >= 0; i--) {
    var offDeviceId = svgConfig.cut_lines[i]
    var device = svgConfig.configs.devices[offDeviceId]
    switch (device.type.type) {
      case "breaker":
        var breaker_statue = d3.select(device.g).select("use").attr("xlink:href").substr(1)
        if (kBreakerStatues.on.indexOf(breaker_statue) > -1) {
          d3.select(device.g).select("use").attr("xlink:href", "#" + kBreakerStatues.off[kBreakerStatues.on.indexOf(breaker_statue)]) //alert("点击了确定");   
          updateCutLine(d3.select(device.g).attr("id"))
        } else if (kBreakerStatues.off.indexOf(breaker_statue) > -1) {
          d3.select(device.g).select("use").attr("xlink:href", "#" + kBreakerStatues.on[kBreakerStatues.off.indexOf(breaker_statue)]) //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else {
          // console.log(arguments.callee.toString(), "breaker_statue:状态未知，把状态加到kBreakerStatues里面", compositeSwitch_statue)
        }
        break
      case "compositeswitch":
        var compositeSwitch_statue = d3.select(device.g).select("use").attr("xlink:href").substr(1)
        if (kCompositeSwitchStatues.on.indexOf(compositeSwitch_statue) > -1) {//合 
          d3.select(device.g).select("use").attr("xlink:href", "#" + kCompositeSwitchStatues.off[kCompositeSwitchStatues.on.indexOf(compositeSwitch_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else if (kCompositeSwitchStatues.off.indexOf(compositeSwitch_statue) > -1) {//分
          d3.select(device.g).select("use").attr("xlink:href", "#" + kCompositeSwitchStatues.on[kCompositeSwitchStatues.off.indexOf(compositeSwitch_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else if (kCompositeSwitchStatues.earth.find(compositeSwitch_statue)) {//地
          // console.log(arguments.callee.toString(), "当前状态是接地的，程序未处理")
        } else {//未知
          // console.log(arguments.callee.toString(), "compositeSwitch_statue:状态未知，把状态加到kCompositeSwitchStatues里面", compositeSwitch_statue)
        }
        break
      case "loadbreakswitch":
        var loadbreakswitch_statue = d3.select(device.g).select("use").attr("xlink:href").substr(1)
        if (kLoadBreakSwitchStatues.on.indexOf(loadbreakswitch_statue) > -1) {//合 
          d3.select(device.g).select("use").attr("xlink:href", "#" + kLoadBreakSwitchStatues.off[kLoadBreakSwitchStatues.on.indexOf(loadbreakswitch_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else if (kLoadBreakSwitchStatues.off.indexOf(loadbreakswitch_statue) > -1) {//分
          d3.select(device.g).select("use").attr("xlink:href", "#" + kLoadBreakSwitchStatues.on[kLoadBreakSwitchStatues.off.indexOf(loadbreakswitch_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else {//未知
          // console.log(arguments.callee.toString(), "loadbreakswitch_statue:状态未知，把状态加到kLoadBreakSwitchStatues里面", kLoadBreakSwitchStatues)
        }
        break
      case "fuse":
        var fuse_statue = d3.select(device.g).select("use").attr("xlink:href").substr(1)
        if (kFuseStatues.on.indexOf(fuse_statue) > -1) {//合 
          d3.select(device.g).select("use").attr("xlink:href", "#" + kFuseStatues.off[kFuseStatues.on.indexOf(fuse_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else if (kFuseStatues.off.indexOf(fuse_statue) > -1) {//分
          d3.select(device.g).select("use").attr("xlink:href", "#" + kFuseStatues.on[kFuseStatues.off.indexOf(fuse_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else {//未知
          // console.log(arguments.callee.toString(), "fuse_statue:状态未知，把状态加到kFuseStatues里面", fuse_statue)
        }
        break
      case "disconnector":
        var disconnector_statue = d3.select(device.g).select("use").attr("xlink:href").substr(1)
        if (kDisconnectorStatues.on.indexOf(disconnector_statue) > -1) {//合 
          d3.select(device.g).select("use").attr("xlink:href", "#" + kDisconnectorStatues.off[kDisconnectorStatues.on.indexOf(disconnector_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else if (kDisconnectorStatues.off.indexOf(disconnector_statue) > -1) {//分
          d3.select(device.g).select("use").attr("xlink:href", "#" + kDisconnectorStatues.on[kDisconnectorStatues.off.indexOf(disconnector_statue)])
          //alert("点击了确定"); 
          updateCutLine(d3.select(device.g).attr("id"))
        } else {//未知
          // console.log(arguments.callee.toString(), "disconnector_statue:状态未知，把状态加到kDisconnectorStatues里面", disconnector_statue)
        }
        break
      case "aclinesegment":
      case "connline":
        var lineSegment_statue = d3.select(device.g).select("polyline").attr("userdata")
        if (lineSegment_statue != "off") {
          d3.select(device.g).select("polyline").attr("userdata", "off") //alert("点击了确定");
          d3.select(device.g).select("polyline").style("stroke", "#fff")
          updateCutLine(d3.select(device.g).attr("id"))
        } else {
          d3.select(device.g).select("polyline").attr("userdata", "") //alert("点击了确定");
          d3.select(device.g).select("polyline").style("stroke", "#fff")
          updateCutLine(d3.select(device.g).attr("id"))
        }
        break
      default:
        break
    }
  }
  svgConfig.cut_lines = []
  topology()
}
// 提示校验未通过受影响的用户
function reminderUsers (userIDs) {
  svgConfig.clearTime()
  svgConfig.time = window.setInterval(function () {
    var colors = ["#f00", "#eee"]
    svgConfig.totalTime++
    if (svgConfig.totalTime <= 10) {
      for (var key1 in userIDs) {
        var key = userIDs[key1]
        if (svgConfig.configs.devices.hasOwnProperty(key)) {
          var device = svgConfig.configs.devices[key]
          var polys = d3.select(device.g).selectAll("polyline")
          var polygons = d3.select(device.g).selectAll("polygon")
          if (polys.size() > 0) polys.style("stroke", colors[svgConfig.totalTime % 2])
          var uses = d3.select(device.g).selectAll("use")
          if (uses.size() > 0) {
            uses.style("fill", colors[svgConfig.totalTime % 2])
            uses.style("stroke", colors[svgConfig.totalTime % 2])
          }
          if (polygons.size()) {
            polygons.style("stroke", colors[svgConfig.totalTime % 2])
          }
        }
      }
    } else {
      svgConfig.clearTime()
      topology()
    }
  }, 500)
}

// 设置新能源场站
function setNewEnergyPoints (newEnergyDevices, selectYaoCeCallBack) {

  // (newEnergyDevices&&newEnergyDevices[0])这个写法是因为后台给的数据结构是[null]。。。。。。
  var existEnergyDevices = (newEnergyDevices && newEnergyDevices[0]) ? (newEnergyDevices.map((elem) => {
    return elem.CONNECT_ID
  })) : []
  var devices = svgConfig.configs.types.connline.devices
  devices = devices.concat(svgConfig.configs.types.aclinesegment.devices)

  var emptyLines = {}
  for (var i = devices.length - 1; i >= 0; i--) {
    var device = devices[i]
    if (device.connect && device.connect.length == 1) {
      // emptyLines.push(device);
      emptyLines[device.id] = { "conect": device }
      d3.select(device.g).select("polyline").style("stroke", "#f00")
      if (existEnergyDevices.indexOf(device.id) > 0) {
        return
      }

      var cDevice1 = document.querySelector("#" + device.id);
      (function (cDeviceElement, cDevice) {
        cDeviceElement.ondragenter = function (e) {
          // console.log('1');
          e.preventDefault()
        }
        cDeviceElement.ondragover = function (e) {
          // console.log('2');
          e.preventDefault()
          // 设置鼠标手势
          // e.dataTransfer.dropEffect = 'link'; 
        }
        cDeviceElement.ondragleave = function () {
          // console.log('3');
        }
        cDeviceElement.ondrop = function (e) {
          // console.log('4');
          e.preventDefault()
          e.stopPropagation()  // 兼容firefox
          var id = e.dataTransfer.getData("id")
          drawNewEnergyTuyuan(id, cDevice, cDeviceElement, selectYaoCeCallBack)

          var obj = svgConfig.accessNewEnergyDevices[cDevice.id]
          // 弹出页面让用户选择遥测点
          selectYaoCeCallBack(obj)
        }
      })(cDevice1, device)
    }
  }
  svgConfig.accessNewEnergyDevices = emptyLines
  // 设置已经有的新能源场站
  for (var i = newEnergyDevices.length - 1; i >= 0; i--) {
    var device = newEnergyDevices[i]
    drawNewEnergyTuyuan(
      device.TYPE,
      svgConfig.configs.devices[device.CONNECT_ID],
      document.querySelector("#" + device.CONNECT_ID),
      selectYaoCeCallBack
    )
  }
}
function drawNewEnergyTuyuan (selectType, cDevice, cDeviceElement, selectYaoCeCallBack) {
  // 判断是上下左右的位置
  var cd = document.getElementById(cDevice.connect[0].id)
  // var _this = document.getElementById(cDevice.id);
  var cdX = cd.getBBox().x
  var cdY = cd.getBBox().y
  var x = cDeviceElement.getBBox().x
  var y = cDeviceElement.getBBox().y
  var W = cDeviceElement.getBBox().width
  var H = cDeviceElement.getBBox().height
  var RX, RY, RW = 20, RH = 20
  var direction = "", type = ""
  // 线路的方向
  if (H > W) {//纵向的
    if (y < cdY) {//放上边
      RX = x - RW / 2.0 + W / 2.0
      RY = y - RH
      direction = "up"
    } else {//下边
      RX = x - RW / 2.0 + W / 2.0
      RY = y + H
      direction = "down"
    }
  } else {//横向的
    if (x < cdX) {//放左边
      RX = x - RW
      RY = y - RH / 2.0 + H / 2.0
      direction = "left"
    } else {//右边
      RX = x + W
      RY = y - RH / 2.0 + H / 2.0
      direction = "right"
    }
  }
  var layer = d3.select("#NewEnergy_Layer")
  if (layer.empty()) {
    layer = d3.select(".svg-pan-zoom_viewport").append("g").attr("id", "NewEnergy_Layer")
  }
  var tuyuanID = ""
  if (selectType == "fengdian") { tuyuanID = "#NewEnergy_20190326171012001"; type = "fengdian" }
  else if (selectType == "guangfu") { tuyuanID = "#NewEnergy_20190326171012002"; type = "guangfu" }
  else if (selectType == "shengwu") { tuyuanID = "#NewEnergy_20190326171012003"; type = "shengwu" }
  var gID = "PD_" + new Date().Format("yyyyMMddHHmmss")
  var g = layer.append("g").attr("id", gID)
  g.append("use")
    .attr("x", RX).attr("y", RY).attr("width", RW).attr("height", RH).attr("xlink:href", tuyuanID)

  var obj = svgConfig.accessNewEnergyDevices[cDevice.id]
  obj["type"] = type//类型
  obj["direction"] = direction//方向
  obj["newEnergyDevicesId"] = gID//svg上的新能源设备ID
  // obj.yaoCeId = gID;//遥测点的ID
  d3.select("#" + obj.newEnergyDevicesId).on("click", () => {
    selectYaoCeCallBack(obj)
  })
}

function findAllAccessNewEnergy (selectYaoCeCallBack) {
  var energyConsumer = d3.select("#app").select("svg").select("g#EnergyConsumer_Layer")
  var polys = energyConsumer.selectAll("g").selectAll("polyline")
  var uses = energyConsumer.selectAll("g").selectAll("use")
  let color = normalColor
  if (polys.size() > 0) polys.style("stroke", color)
  if (uses.size() > 0) {
    uses.style("fill", color)
    uses.style("stroke", color)
  }
  // 支持可拖拽
  // energyConsumer.selectAll("g").on("click", callback);
  energyConsumer.selectAll("g").each(function () {
    var cId = d3.select(this).attr("id")
    var connectDevice = document.querySelector("#" + cId);
    (function (connectDevice) {
      connectDevice.ondragenter = function (e) {
        // console.log('1');
        e.preventDefault()
      }
      connectDevice.ondragover = function (e) {
        // console.log('2');
        e.preventDefault()
        // 设置鼠标手势
        // e.dataTransfer.dropEffect = 'link'; 
      }
      connectDevice.ondragleave = function () {
        // console.log('3');
      }
      connectDevice.ondrop = function (e) {
        // console.log('4');
        e.preventDefault()
        e.stopPropagation()  // 兼容firefox
        var connectID = connectDevice.getAttribute("id")
        if (svgConfig.accessNewEnergyDevices.hasOwnProperty(connectID)) return
        // eslint-disable-next-line no-unused-expressions
        svgConfig.accessNewEnergyDevices
        let energyType = e.dataTransfer.getData("energyType")
        let type = 9
        if (energyType === "fengdian") type = 12
        else if (energyType === "guangfu") type = 15
        drawNewEnergy(connectID, type, selectYaoCeCallBack)
      }
    })(connectDevice)
  })
}
// energyType:能源类型， cID：连接点ID
function drawNewEnergy (cID, energyType, selectYaoCeCallBack) {//lineID
  var cd = document.getElementById(cID)
  var cdX = cd.getBBox().x
  var cdY = cd.getBBox().y
  var cdW = cd.getBBox().width
  var cdH = cd.getBBox().height
  if (cdW > cdH) {
    cdH = cdW
    cdY -= (cdW - cdH) / 2.0
  } else {
    cdW = cdH
    cdX -= (cdH - cdW) / 2.0
  }
  let energyIconId = "NewEnergy_20190326171012002"
  if (energyType === "15") {//光伏
    energyIconId = "NewEnergy_20190326171012002"
  } else if (energyType == "12") {//风电
    energyIconId = "NewEnergy_20190326171012001"
  } else if (energyType == "9") {//生物
    energyIconId = "NewEnergy_20190326171012003"
  }

  var kuangGID = drawTuyuan("NewEnergy_Layer",
    "NewEnergy_20190326171012004",
    cdX, cdY, cdW, cdH)
  var diameter = cdW / 5.0 * 3
  var g = drawTuyuan("NewEnergy_Layer",
    energyIconId,
    cdX + cdW - diameter / 2.0, cdY - diameter / 2.0,
    diameter, diameter)
  svgConfig.accessNewEnergyDevices[cID] = { "connectId": cID }
  var obj = svgConfig.accessNewEnergyDevices[cID]
  obj["type"] = energyType//新能源类型
  obj["newEnergyDevicesId"] = g.attr("id")//svg上的新能源设备ID
  obj["kuang"] = kuangGID.attr("id")//svg上的新能源设备ID
  g.on("click", () => {
    svgConfig.clickCurrentEnergyDevice = obj
    selectYaoCeCallBack(obj)
  })

}
function unbindNewEnergy () {
  // svgConfig.clickCurrentEnergyDevice =  obj;
  d3.select("#" + svgConfig.clickCurrentEnergyDevice.kuang).remove()
  d3.select("#" + svgConfig.clickCurrentEnergyDevice.newEnergyDevicesId).remove()
  delete svgConfig.accessNewEnergyDevices[svgConfig.clickCurrentEnergyDevice.cID]
}
// 绘制图形
function drawTuyuan (layerName, tuyuanID, x, y, width, height) {
  var layer = d3.select("#" + layerName)
  if (layer.empty()) {
    layer = d3.select(".svg-pan-zoom_viewport").append("g").attr("id", layerName)
  }
  var gID = "PD_" + new Date().Format("yyyyMMddHHmmss") + random32()
  var g = layer.append("g").attr("id", gID)
  g.append("use")
    .attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("xlink:href", "#" + tuyuanID)
  return g
}

function random32 () {
  var str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  var random = ""
  for (var i = 10; i > 0; i--) {
    var index = Math.round(Math.random() * 62)
    random += str[index]
  }
  return random
}
function shiftFirstChar (str) {
  if (str.substr(0, 1) == "#")
    return str.substr(1, str.length - 1)
  return str
}
// 增大点击区域
function expendClickArea (xml) {
  var symbols = d3.select(xml.documentElement).select("defs").selectAll("symbol")
  symbols.each(function () {
    var box = this.getAttribute("viewBox")
    if (!box) return
    var boxs = box.split(" ")
    d3.select(this).append("rect").attr("stroke", "rgba(0,0,0,0)")
      .attr("fill", "rgba(0,0,0)")
      .attr("fill-opacity", "0")
      .attr("width", boxs[2])
      .attr("height", boxs[3])
      .attr("transform", `translate(${ boxs[2] / 2.0 }, ${ boxs[2] / 4.0 })`)
  })
}
/** 
* 加载svg
*/
function loadSvg (superNode, lineNodeData, responseResult, callback) {
  var svgUrl = lineNodeData.svgUrl
  var svgUrl1 = svgUrl.replace(/\%/g, "%25").replace(/\#/g, "%23").replace(/\&/g, "%26")//.replace(/\./, '%2E');
  // svgUrl1 = 'http://192.168.2.105:8082/tdgl/小伊变/10kV千斤线单线图%2Esln.svg'
  // svgUrl1 = "http://localhost:8080/lib/file.svg"

  d3.xml(svgUrl1).mimeType("image/svg+xml").get(function (error, xml) {
    d3.select("#svg").remove()
    if (xml) {
      // 增大点击区域
      expendClickArea(xml)
      var XMLS = new XMLSerializer()
      var inp_xmls = XMLS.serializeToString(xml)
      d3.select("#svgapp").html(inp_xmls)
      // document.getElementById(superNode.replace('#', '')).appendChild(xml.documentElement);
      var svg = d3.select(superNode).select("svg").attr("id", "svg")
      window.zoomTiger = svgPanZoom("#svg", {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        maxZoom: 100
      }).disableDblClickZoom()

      // svg.attr("height", '700px');
      svg.attr("width", "100%")
      svg.attr("height", "100%")
      svg.select("g#BackGround_Layer").select("rect").style("fill", "none")
      // svg.select("g#BackGround_Layer").select("rect").style("fill", "black")
      svg.selectAll("use").style("stroke-width", ".3")
      svg.selectAll("use").style("stroke", "#fff")
      svg.selectAll("use").style("fill", "#fff")
      svg.selectAll("polyline").style("stroke-width", ".3")
      svg.selectAll("polyline").style("stroke", "#fff")
      svg.selectAll("polygon").style("stroke-width", ".3")
      svg.selectAll("polygon").style("stroke", "#fff")
      svg.select("g#Text_Layer").selectAll("text").style("fill", "#fff")
      svg.selectAll("a").each(function () {
        this.removeAttribute("xlink:href")
      })
      svgConfig.init()
      setPowersDevices(responseResult)
      initLoneDevice(true)

      defsRect()
      defsFeiYunfang()
      defsDeviceDefect()
      defsZhongYaoUser()
      defsShuangDianYuanUser()
      defsMinGanUser()
    }
    callback(error)
  })
}

function loadSvgInNewEnergy (superNode, lineNodeData, callback, selectYaoCeCallBack) {
  var svgUrl = lineNodeData.svgUrl
  var svgUrl1 = svgUrl.replace(/\%/g, "%25").replace(/\#/g, "%23").replace(/\&/g, "%26")
  //.replace(/\./, '%2E');
  // d3.xhr(svgUrl1, "image/svg+xml", function(xml) {
  d3.xml(svgUrl1).mimeType("image/svg+xml").get(function (error, xml) {
    d3.select("#svg").remove()
    if (xml) {
      // 增大点击区域
      expendClickArea(xml)
      var XMLS = new XMLSerializer()
      var inp_xmls = XMLS.serializeToString(xml)
      d3.select(superNode).html(inp_xmls)
      // d3.select(superNode).append(xml.response);
      // document.getElementById(superNode.replace('#', '')).appendChild(xml.documentElement);
      // $(superNode).append(xml.response);
      var svg = d3.select(superNode).select("svg").attr("id", "svg")
      window.zoomTiger = svgPanZoom("#svg", {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        maxZoom: 100
      }).disableDblClickZoom()

      // svg.attr("height", '700px');
      svg.attr("width", "100%")
      svg.attr("height", "100%")
      svg.select("g#BackGround_Layer").select("rect").style("fill", "#fff")
      svg.selectAll("use").style("stroke-width", ".3")
      svg.selectAll("use").style("stroke", "#fff")
      svg.selectAll("use").style("fill", "#fff")
      svg.selectAll("polyline").style("stroke-width", ".3")
      svg.selectAll("polyline").style("stroke", "#fff")
      svg.selectAll("polygon").style("stroke-width", ".3")
      svg.selectAll("polygon").style("stroke", "#fff")
      svg.select("g#Text_Layer").selectAll("text").style("fill", "#444")
      svg.selectAll("a").each(function () {
        this.removeAttribute("xlink:href")
      })
      svgConfig.init()

      // 定义新能源场站图元
      defsFengDian()
      defsGuangDian()
      defsShengWuDian()
      defsRect()
      // 查找所有可接入用户设备
      findAllAccessNewEnergy(selectYaoCeCallBack)
    }
    callback()
  })
}

function loadSvg1 (svgUrl, superNode, callback) {
  d3.xml(svgUrl).mimeType("image/svg+xml").get(function (error, xml) {

    if (error) {
      callback(error)
      return
    }
    d3.select("#svg").remove()
    if (xml) {
      // 增大点击区域
      expendClickArea(xml)
      var XMLS = new XMLSerializer()
      var inp_xmls = XMLS.serializeToString(xml)
      d3.select("#svgapp").html(inp_xmls)
      // document.getElementById(superNode.replace('#', '')).appendChild(xml.documentElement);
      var svg = d3.select(superNode).select("svg").attr("id", "svg")
      window.zoomTiger = svgPanZoom("#svg", {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        maxZoom: 100
      }).disableDblClickZoom()

      // svg.attr("height", '700px');
      svg.attr("width", "100%")
      svg.attr("height", "100%")
      svg.select("g#BackGround_Layer").select("rect").style("fill", "#fff")
      svg.selectAll("use").style("stroke-width", ".3")
      svg.selectAll("use").style("stroke", "#fff")
      svg.selectAll("use").style("fill", "#fff")
      svg.selectAll("polyline").style("stroke-width", ".3")
      svg.selectAll("polyline").style("stroke", "#fff")
      svg.selectAll("polygon").style("stroke-width", ".3")
      svg.selectAll("polygon").style("stroke", "#fff")
      svg.select("g#Text_Layer").selectAll("text").style("fill", "#444")
      svg.selectAll("a").each(function () {
        this.removeAttribute("xlink:href")
      })
      svgConfig.init()
      initLoneDevice(false)
      callback()

      defsRect()
      defsFeiYunfang()
      defsDeviceDefect()
      defsZhongYaoUser()
      defsShuangDianYuanUser()
      defsMinGanUser()
    }
  })

  // var s = Snap(superNode);
  // Snap.load(svgUrl, function(content) { 
  //     console.log('content', content);
  //     // originData.svgData = content;
  //     // svg拼接到父节点中
  //     s.append(content);

  //     var svg = d3.select(superNode).select("svg").attr("id", "svg");
  //     console.log(d3.select(superNode), svg);
  //     window.zoomTiger = svgPanZoom("#svg", {
  //             zoomEnabled: true,
  //             controlIconsEnabled: false,
  //             fit: true,
  //             center: true,
  //             maxZoom: 100
  //     }).disableDblClickZoom();

  //     svg.attr("height", '700px');
  //     svg.attr("width", '100%');
  //     svg.select('g#BackGround_Layer').select('rect').style("fill","#fff");
  //     svg.selectAll("use").style("stroke-width", ".3");
  //     svg.selectAll("use").style("stroke", "#fff");
  //     svg.selectAll("use").style("fill", "#fff");
  //     svg.selectAll('polyline').style("stroke-width", ".3");
  //     svg.selectAll('polyline').style( "stroke", "#fff");
  //     svg.selectAll('polygon').style("stroke-width", ".3");
  //     svg.selectAll('polygon').style( "stroke", "#fff");
  //     svg.select('g#Text_Layer').selectAll('text').style("fill", "#444");

  //     svgConfig.init();
  //     initLoneDevice(true);

  //     // simulation.init();
  // },  document.getElementById("#svg"));

}
export {
  svgConfig,
  loadSvg,
  loadSvg1,
  loadSvgInNewEnergy,
  topology,
  setPowersDevices,
  updateSelectPower,
  startSelectPower,
  stopSelectPower,
  outUpdateCutLine,
  cutLineReminder,
  reminderUsers,
  startCutLine,
  stopCutLine,
  resetConfigStatue,
  stopAllControl,
  setNewEnergyPoints,
  drawNewEnergy,
  unbindNewEnergy
}
