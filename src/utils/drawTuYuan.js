import * as d3 from "d3"
import { generateTuYuanID } from "./SVGUtils.js"
function drawUserType (cID, type) {
  var cd = document.getElementById(cID)
  var cdX = cd.getBBox().x
  var cdY = cd.getBBox().y
  var cdW = cd.getBBox().width
  var cdH = cd.getBBox().height
  if (cdW > cdH) {
    cdY -= (cdW - cdH) / 2.0
    cdH = cdW
  } else {
    cdX -= (cdH - cdW) / 2.0
    cdW = cdH
  }
  var kuang = drawTuyuan("Rect_Layer", "NewEnergy_20190326171012004", cdX, cdY, cdW, cdH)
  var diameter = cdW / 5.0 * 2
  var layerName = "ZhongYaoUser_Layer", userId = "UserCustom_20190702154100003"
  if (type === 1) {
    layerName = "ZhongYaoUser_Layer"
    userId = "UserCustom_20190702154100003"
  } else if (type === 2) {
    layerName = "MinGanUser_Layer"
    userId = "UserCustom_20190702154100004"
  } else if (type === 3) {
    return
    // layerName = "ShuangDianYuanUser_Layer"
    // userId = "UserCustom_20190702154100005"
  }
  var tuyuan = drawTuyuan(layerName, userId,
    cdX + cdW - diameter / 2.0, cdY - diameter / 2.0,
    diameter, diameter)
  return [tuyuan, kuang]
}
// 双电源用户
function drawShuangDianYuanUserType (cID, type) {
  var cd = document.getElementById(cID)
  var cdX = cd.getBBox().x
  var cdY = cd.getBBox().y
  var cdW = cd.getBBox().width + 8 * window.zoomTiger.getZoom()
  var cdH = cd.getBBox().height + 8 * window.zoomTiger.getZoom()
  if (cdW > cdH) {
    cdY -= (cdW - cdH) / 2.0
    cdH = cdW
  } else {
    cdX -= (cdH - cdW) / 2.0
    cdW = cdH
  }
  cdX -= 4 * window.zoomTiger.getZoom()
  cdY -= 4 * window.zoomTiger.getZoom()
  var kuang = drawTuyuan("Rect_Layer", "NewEnergy_20190326171012004", cdX, cdY, cdW, cdH)
  var diameter = cdW / 5.0 * 2
  var layerName = "", userId = ""
  if (type === 3) {
    layerName = "ShuangDianYuanUser_Layer"
    userId = "UserCustom_20190702154100005"
  }
  var tuyuan = drawTuyuan(layerName, userId,
    cdX, cdY,
    cdW, cdH)
  return [tuyuan, kuang]
}
// 设备缺陷
function drawDeviceDefect (cID) {
  var cd = document.getElementById(cID)
  var cdX = cd.getBBox().x
  var cdY = cd.getBBox().y
  var cdW = cd.getBBox().width
  var cdH = cd.getBBox().height
  if (cdW > cdH) {
    cdY -= (cdW - cdH) / 2.0
    cdH = cdW
  } else {
    cdX -= (cdH - cdW) / 2.0
    cdW = cdH
  }
  var kuang = drawTuyuan("Rect_Layer", "NewEnergy_20190326171012004", cdX, cdY, cdW, cdH)
  var diameter = cdW / 5.0 * 2
  var tuyuan = drawTuyuan("DeviceDefect_Layer", "UserCustom_20190702154100002",
    cdX + cdW - diameter / 2.0, cdY + cdH - diameter / 2.0,
    diameter, diameter)
  return [tuyuan, kuang]
}
// 非正常运行方式
function drawFeiYunFang (cID) {
  var cd = document.getElementById(cID)
  var cdX = cd.getBBox().x
  var cdY = cd.getBBox().y
  var cdW = cd.getBBox().width
  var cdH = cd.getBBox().height
  if (cdW > cdH) {
    cdY -= (cdW - cdH) / 2.0
    cdH = cdW
  } else {
    cdX -= (cdH - cdW) / 2.0
    cdW = cdH
  }
  var kuang = drawTuyuan("Rect_Layer", "NewEnergy_20190326171012004", cdX, cdY, cdW, cdH)
  var diameter = cdW / 5.0 * 2
  var tuyuan = drawTuyuan("FeiYunFang_Layer", "UserCustom_20190702154100001",
    cdX + cdW - diameter / 2.0, cdY + cdH - diameter / 2.0,
    diameter, diameter)
  return [tuyuan, kuang]
}
function drawTuyuan (layerName, tuyuanID, x, y, width, height) {
  var layer = d3.select("#" + layerName)
  if (layer.empty()) {
    layer = d3.select(".svg-pan-zoom_viewport").append("g").attr("id", layerName)
  }
  var gID = generateTuYuanID()
  var g = layer.append("g").attr("id", gID)
  g.append("use")
    .attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("xlink:href", "#" + tuyuanID)
  return g
}
export {
  drawUserType,
  drawShuangDianYuanUserType,
  drawFeiYunFang,
  drawDeviceDefect,
  drawTuyuan
}
