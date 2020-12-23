import $ from "jquery"
export default {
  OPITION: {
    open_busbar_breaker_merge: true,
    render_combine: true,
    open_combine_beautify: true,
    open_outside_feeder_render: false
  },

  SUBSTAION_TYPE: 8,
  FEDDER_TYPE: 0,
  BUSBAR_TYPE: 2,
  BREAKER_TYPE: 5,
  DISCONNECTOR_TYPE: 4,
  DEFAULT_SUBSTAION_ICON: {
    "url": ["./icon/substation.svg"],
    "class": "substation",
    "height": "",
    "width": ""
  }, //变电站图标
  DEFAULT_FEEDER_ICON: {
    "url": ["./icon/breaker_close.svg", "./icon/breaker_open.svg"],
    "class": "feeder",
    "height": "",
    "width": ""
  }, // 线路图标
  DEFAULT_BREAKER_ICON: {
    "url": ["./icon/breaker_close.svg", "./icon/breaker_open.svg"],
    "class": "breaker",
    "height": "",
    "width": ""
  }, // 刀闸图标
  DEFAULT_DISCONNECTOR_ICON: {
    "url": ["./icon/disconnector_close.svg", "./icon/disconnector_open.svg"],
    "class": "disconnector",
    "height": "",
    "width": ""
  }, //断路器图标

  container: "",

  H_INTERVAL_SIZE: 500, //图元纵向间隔尺寸
  W_INTERVAL_SIZE: 500, //图元横向间隔尺寸
  TEXT_INTERVAL_SIZE: 10, //图元与图元文字的间隔尺寸
  START_LEFT_POSITION: 50, //图元在容器中的起止x位置

  BUSBAR_AFTER_ICON_SIZE: 200, //母线后子图元纵向间隔尺寸
  BUSBAR_FREE_SIZE: 30, //母线上下空余尺寸
  BUSBAR_WIDTH: 8, //母线默认宽度


  COMBINE_INNER_W_SIZE: 40, //环网内图元横向间隔
  COMBINE_OFFSIZE: 40,
  COMBINE_CONTAINER: [],
  COMBINE_WIDTH_HEIGHT_SCALE: 1, //环网长宽比，开始环网美化时，此参数生效
  k: 0,

  CURRENT_FEEDER_ID: 0,

  init: function (dom, data, opition) {
    this.OPITION = opition
    $(dom).css("position", "relative")
    this.container = dom
    // data = data.result.topo
    var hNodeSize = data.vertical //纵向节点数
    var wNodeSize = data.transverse //横向节点数
    this.initContainer(wNodeSize, hNodeSize)
    this.CURRENT_FEEDER_ID = data.topology.feederId
    this.startDraw(data.topology, 0, 0, this.k)
    //渲染环网
    if (this.OPITION.render_combine) {
      this.markCombindEnd()
    }

  },


  //初始化画布容器
  initContainer: function (wNodeSize, hNodeSize) {
    this.drawIcon(0, 0, this.DEFAULT_SUBSTAION_ICON)
    this.drawIcon(0, 0, this.DEFAULT_FEEDER_ICON)
    this.drawIcon(0, 0, this.DEFAULT_BREAKER_ICON)
    this.drawIcon(0, 0, this.DEFAULT_DISCONNECTOR_ICON)
    this.DEFAULT_SUBSTAION_ICON.height = $("." + this.DEFAULT_SUBSTAION_ICON.class)[0].getBoundingClientRect().height
    this.DEFAULT_SUBSTAION_ICON.width = $("." + this.DEFAULT_SUBSTAION_ICON.class)[0].getBoundingClientRect().width
    this.DEFAULT_FEEDER_ICON.height = $("." + this.DEFAULT_FEEDER_ICON.class)[0].getBoundingClientRect().height
    this.DEFAULT_FEEDER_ICON.width = $("." + this.DEFAULT_FEEDER_ICON.class)[0].getBoundingClientRect().width
    this.DEFAULT_BREAKER_ICON.height = $("." + this.DEFAULT_BREAKER_ICON.class)[0].getBoundingClientRect().height
    this.DEFAULT_BREAKER_ICON.width = $("." + this.DEFAULT_BREAKER_ICON.class)[0].getBoundingClientRect().width
    this.DEFAULT_DISCONNECTOR_ICON.height = $("." + this.DEFAULT_DISCONNECTOR_ICON.class)[0].getBoundingClientRect().height
    this.DEFAULT_DISCONNECTOR_ICON.width = $("." + this.DEFAULT_DISCONNECTOR_ICON.class)[0].getBoundingClientRect().width
    this.container.css("width", this.W_INTERVAL_SIZE * (wNodeSize - 1) + wNodeSize * this.DEFAULT_SUBSTAION_ICON.width + 800)
    this.container.css("height", this.H_INTERVAL_SIZE * (hNodeSize - 1) + hNodeSize * this.DEFAULT_SUBSTAION_ICON.height + 800)
    $(this.container).find(".topo_p").remove()
    //缩放至可视区域
    // $(document.body).css("-webkit-transform", "scale(" + ($(window).width()/$(this.container).width()) + ")");
  },

  //绘制图元   容器、x坐标、y坐标、图标
  drawIcon: function (left, top, icon, name, flag, point) {
    var urls = ""
    if (point !== undefined && point !== null) {
      if (point === 1) {
        urls = icon.url[0]
      } else if (point === 0) {
        urls = icon.url[1]
      }
    } else {
      urls = icon.url[0]
    }
    var a = "<div class=\"topo_p " + icon.class + "\" style = \"top:" + top + ";left:" + left + "\"><img src=\"" + urls + "\" /></div>"
    this.container.append(a)
    if (name) {
      if (name.indexOf("开关") > 0)
        name = name.substring(0, name.indexOf("开关"))
      if (name.indexOf("闸刀") > 0)
        name = name.substring(0, name.indexOf("闸刀"))
      var b = "<p  class=\"topo_p\" style = \"top:" + (top + $(a).height() + 10 + icon.height) + ";left:" + left + ";font-size:0.5vh;\">" + name + "</p>"
      this.container.append(b)
      if (flag !== 1)
        $(this.container).children().last().css("width", $(this.container).children().last().prev()[0].getBoundingClientRect().width + 20)
    }
  },



  //绘制图形
  startDraw: function (d, nodeX, nodeY, trueEndY, flag) {
    if (!nodeX || !nodeY) {
      nodeY = this.container.height() / 2 - this.DEFAULT_SUBSTAION_ICON.height / 2
      nodeX = this.START_LEFT_POSITION
    }
    //绘制图元
    var qW = 0
    var qH = 0
    if (d.type === this.SUBSTAION_TYPE) {
      this.drawIcon(nodeX, nodeY, this.DEFAULT_SUBSTAION_ICON, d.name, flag, d.point)
      qW = this.DEFAULT_SUBSTAION_ICON.width
      qH = this.DEFAULT_SUBSTAION_ICON.height
    } else if (d.type === this.BREAKER_TYPE) {
      this.drawIcon(nodeX, nodeY, this.DEFAULT_BREAKER_ICON, d.name, flag, d.point)
      qW = this.DEFAULT_BREAKER_ICON.width
      qH = this.DEFAULT_BREAKER_ICON.height
    } else if (d.type === this.FEDDER_TYPE) {
      this.drawIcon(nodeX, nodeY, this.DEFAULT_FEEDER_ICON, d.name, flag, d.point)
      qW = this.DEFAULT_FEEDER_ICON.width
      qH = this.DEFAULT_FEEDER_ICON.height
    } else if (d.type === this.DISCONNECTOR_TYPE) {
      this.drawIcon(nodeX, nodeY, this.DEFAULT_DISCONNECTOR_ICON, d.name, flag, d.point)
      qW = this.DEFAULT_DISCONNECTOR_ICON.width
      qH = this.DEFAULT_DISCONNECTOR_ICON.height
    } else if (d.type === this.BUSBAR_TYPE) {
      qH = this.getNodHeight(d.type, d.children)
      qW = this.BUSBAR_WIDTH
      this.drawBusbar(qW, qH, nodeX, nodeY)
    }
    //渲染环网
    if (this.OPITION.render_combine) {
      this.renderCombine(d, nodeX, nodeY, d.childNode)
    }
    //绘制连接线
    this.drawCable(qW, qH, nodeX, nodeY, d, d.children, trueEndY)

  },

  //绘制母线
  drawBusbar: function (width, height, nodeX, nodeY) {
    var a = "<div class=\"topo_p busbar\" style = \"top:" + nodeY + ";left:" + nodeX + ";width:" + width + ";height:" + height + "\"></div>"
    this.container.append(a)
  },

  //计算连接线起止点
  drawCable: function (qW, qH, nodeX, nodeY, currentNode, childNode, k) {
    var w_size = 0
    var startY = nodeY + qH / 2
    var startX = nodeX + qW
    if (childNode) {
      if (this.OPITION.render_combine) {
        if (currentNode.combinedId !== undefined && currentNode.combinedId !== 0 && childNode[0].combinedId === currentNode.combinedId) {
          w_size = this.COMBINE_INNER_W_SIZE
        } else {
          w_size = this.W_INTERVAL_SIZE
        }
      } else {
        w_size = this.W_INTERVAL_SIZE
      }

      var cHeight = this.getNodHeight(currentNode.type, currentNode.children)
      var cWidth = this.getNodeWidth(currentNode.type)
      //这边对子节点做一个等分排布切割，然后子节点的所有子节点的横向深度，计算子节点需要的高度

      if (childNode.length === 1) {
        var endX = startX + w_size
        var endY = startY
        var totolCount = 0 //当前节点的所有叶子节点数
        var preHeight = 0
        for (var i = 0; i < childNode.length; i++) {
          this.getLeafCountTree(childNode[i])
          totolCount += childNode[i].colspan

        }
        if (this.OPITION.open_busbar_breaker_merge) {
          if (k !== 0 && k !== undefined) {
            this.doSpecialDrawLine(startX, startY, startX + w_size, k, childNode[0].feederId)
            startY = k
            endY = startY - (totolCount * this.H_INTERVAL_SIZE / 2) + (childNode[0].colspan * this.H_INTERVAL_SIZE / 2) + preHeight
            endX = startX + w_size * 2
            this.doDrawLine(startX - this.counter * 40 + w_size, startY, endX, endY, childNode[0].feederId)
            var nHeight = this.getNodHeight(childNode[0].type, childNode[0].children)
            k = 0
            this.startDraw(childNode[0], endX, endY - nHeight / 2, k)
            totolCount = 0
            preHeight += childNode[0].colspan * this.H_INTERVAL_SIZE

          } else {
            this.doDrawLine(startX, startY, endX, endY, childNode[0].feederId)
            var nHeight = this.getNodHeight(childNode[0].type, childNode[0].children)
            this.startDraw(childNode[0], endX, endY - nHeight / 2, k)
            totolCount = 0
            preHeight += childNode[0].colspan * this.H_INTERVAL_SIZE
          }
        } else {
          this.doDrawLine(startX, startY, endX, endY, childNode[0].feederId)
          var nHeight = this.getNodHeight(childNode[0].type, childNode[0].children)
          this.startDraw(childNode[0], endX, endY - nHeight / 2, k)
          totolCount = 0
          preHeight += childNode[0].colspan * this.H_INTERVAL_SIZE
        }


      } else {
        var endX = startX + w_size
        var totolCount = 0 //当前节点的所有叶子节点数
        for (var i = 0; i < childNode.length; i++) {
          this.getLeafCountTree(childNode[i])
          totolCount += childNode[i].colspan

        }
        var preHeight = 0
        for (var i = 0; i < childNode.length; i++) {
          var trueEndY = 0
          endY = startY - ((totolCount - 1) * this.H_INTERVAL_SIZE / 2) + ((childNode[i].colspan - 1) * this.H_INTERVAL_SIZE / 2) + preHeight
          if (this.OPITION.open_busbar_breaker_merge) {
            //当当前图元是母线是，后面部分的连接线需要特殊处理
            if (currentNode.type === this.BUSBAR_TYPE) {
              var p = startY

              trueEndY = endY
              endY = p - qH / 2 + this.BUSBAR_FREE_SIZE + i * this.BUSBAR_AFTER_ICON_SIZE
              p = endY
              this.doDrawLine(startX, p, endX, endY, childNode[i].feederId)
              var q = endX
              q = q - w_size / 2
              //绘制下个图元
              var nHeight = this.getNodHeight(childNode[i].type, childNode[0].children)
              var xNode = q + w_size / 2
              var yNode = endY - nHeight / 2
              this.startDraw(childNode[i], xNode, yNode, trueEndY, 1)
              preHeight += childNode[i].colspan * this.H_INTERVAL_SIZE
            } else {
              if (k !== 0 && k !== undefined) {
                if (i === 0) {
                  this.doSpecialDrawLine(startX, startY, startX + w_size, k, childNode[i].feederId)
                }
                startY = k
                endY = startY - (totolCount * w_size / 2) + (childNode[i].colspan * w_size / 2) + preHeight
                endX = startX + this.W_INTERVAL_SIZE * 2
                this.doDrawLine(startX - this.counter * 40 + w_size, startY, endX, endY, childNode[i].feedId)
              } else {
                this.doDrawLine(startX, startY, endX, endY, childNode[i].feederId)
              }
              //绘制下个图元
              var nHeight = this.getNodHeight(childNode[i].type, childNode[0].children)
              var xNode = endX
              var yNode = endY - nHeight / 2
              this.startDraw(childNode[i], xNode, yNode, trueEndY)
              preHeight += childNode[i].colspan * this.H_INTERVAL_SIZE
            }
          } else {
            this.doDrawLine(startX, startY, endX, endY, childNode[i].feederId)
            //绘制下个图元
            var nHeight = this.getNodHeight(childNode[i].type, childNode[0].children)
            var xNode = endX
            var yNode = endY - nHeight / 2
            this.startDraw(childNode[i], xNode, yNode, trueEndY)
            preHeight += childNode[i].colspan * this.H_INTERVAL_SIZE
          }

        }
        totolCount = 0
      }
    }

  },

  //计算图元宽度
  getNodeWidth: function (type) {
    if (type === this.SUBSTAION_TYPE) {
      return this.DEFAULT_SUBSTAION_ICON.width
    } else if (type === this.BREAKER_TYPE) {
      return this.DEFAULT_BREAKER_ICON.width
    } else if (type === this.FEDDER_TYPE) {
      return this.DEFAULT_FEEDER_ICON.width
    } else if (type === this.DISCONNECTOR_TYPE) {
      return this.DEFAULT_DISCONNECTOR_ICON.width
    } else if (type === this.BUSBAR_TYPE) {
      return this.BUSBAR_WIDTH
    }
  },
  //计算图元高度  childCount为子节点个数，当 当前节点是母线时，需要根据子节点个数动态生成母线的高度
  getNodHeight: function (type, childNode) {
    if (type === this.SUBSTAION_TYPE) {
      return this.DEFAULT_SUBSTAION_ICON.height
    } else if (type === this.BREAKER_TYPE) {
      return this.DEFAULT_SUBSTAION_ICON.height
    } else if (type === this.FEDDER_TYPE) {
      return this.DEFAULT_SUBSTAION_ICON.height
    } else if (type === this.DISCONNECTOR_TYPE) {
      return this.DEFAULT_SUBSTAION_ICON.height
    } else if (type === this.BUSBAR_TYPE) {
      if (childNode)
        return (childNode.length - 1) * this.BUSBAR_AFTER_ICON_SIZE + this.BUSBAR_FREE_SIZE * 2
      else
        return this.BUSBAR_FREE_SIZE * 2
    }
  },
  //绘制连接线
  doDrawLine: function (startX, startY, endX, endY, feedId) {
    var g = ""
    if (this.OPITION.open_outside_feeder_render) {
      if (feedId !== this.CURRENT_FEEDER_ID)
        g = "topo_outside_feeder"
    }
    if (startY < endY) {
      var a = "<div class=\"toBottomDiv topo_p " + g + "\" style=\"height:" + (endY - startY) + ";width:" + ((endX - startX) / 2) + ";top:" + startY + ";left:" + startX + "\"></div>"
      var b = "<div class=\"lineDiv topo_p " + g + "\" style=\"width:" + ((endX - startX) / 2) + ";top:" + endY + ";left:" + (endX - (endX - startX) / 2) + "\"></div>"
      this.container.append(a).append(b)

    } else if (startY === endY) {
      var a = "<div class=\"lineDiv topo_p " + g + "\" style=\"width:" + ((endX - startX)) + ";top:" + startY + ";left:" + startX + "\"></div>"
      this.container.append(a)

    } else if (startY > endY) {
      var a = "<div class=\"toTopDiv topo_p " + g + "\" style=\"height:" + (startY - endY) + ";width:" + ((endX - startX) / 2) + ";top:" + endY + ";left:" + startX + "\"></div>"
      var b = "<div class=\"lineDiv topo_p " + g + "\" style=\"width:" + ((endX - startX) / 2) + ";top:" + endY + ";left:" + (endX - (endX - startX) / 2) + "\"></div>"
      this.container.append(a).append(b)
    }

  },
  counter: 0,
  doSpecialDrawLine: function (startX, startY, endX, endY, feedId) {
    var g = ""
    if (this.OPITION.open_outside_feeder_render) {
      if (feedId !== this.CURRENT_FEEDER_ID)
        g = "topo_outside_feeder"
    }
    this.counter++
    if (startY < endY) {
      var a = "<div class=\"toBottomDiv topo_p " + g + "\" style=\"height:" + (endY - startY) + ";width:" + (this.W_INTERVAL_SIZE - this.counter * 40) + ";top:" + startY + ";left:" + startX + "\"></div>"
      this.container.append(a)

    } else if (startY === endY) {
      var a = "<div class=\"lineDiv topo_p " + g + "\" style=\"width:" + (this.W_INTERVAL_SIZE - this.counter * 40) + ";top:" + startY + ";left:" + startX + "\"></div>"
      this.container.append(a)

    } else if (startY > endY) {
      var a = "<div class=\"toTopDiv topo_p " + g + "\" style=\"height:" + (startY - endY) + ";width:" + (this.W_INTERVAL_SIZE - this.counter * 40) + ";top:" + endY + ";left:" + startX + "\"></div>"
      this.container.append(a)
    }

  },
  //获取节点的所有叶子节点数
  getLeafCountTree: function (json) {
    if (json.children === null || json.children.length === 0) {
      json.colspan = 1
      return 1
    } else {
      var leafCount = 0
      for (var i = 0; i < json.children.length; i++) {
        leafCount = leafCount + this.getLeafCountTree(json.children[i])
      }
      json.colspan = leafCount
      return leafCount
    }
  },
  /****************************渲染环网部分********************************** */
  renderCombine: function (node, nodeX, nodeY, chidlNode) {
    if (node.combinedId !== undefined && node.combinedId !== null && node.combinedId !== 0 && node.combinedName.indexOf("分支箱") < 0) {
      var o = []
      var combineInfo = {}
      combineInfo.startX = nodeX - this.COMBINE_OFFSIZE
      combineInfo.startY = nodeY - this.COMBINE_OFFSIZE
      combineInfo.endX = this.getNodeWidth(node.type) + this.COMBINE_OFFSIZE * 2 + combineInfo.startX
      combineInfo.endY = this.getNodHeight(node.type, chidlNode) + this.COMBINE_OFFSIZE * 2 + combineInfo.startY
      combineInfo.combineId = node.combinedId
      combineInfo.combineName = node.combinedName
      combineInfo.name = node.name
      o.push(combineInfo)
      if (this.COMBINE_CONTAINER.length === 0) {
        this.COMBINE_CONTAINER.push(o)
      } else {
        var f = 0
        for (let i = 0; i < this.COMBINE_CONTAINER.length; i++) {
          for (let j = 0; j < this.COMBINE_CONTAINER[i].length; j++)
            if (this.COMBINE_CONTAINER[i][j].combineId === combineInfo.combineId) {
              this.COMBINE_CONTAINER[i].push(combineInfo)
              f = 1
              break
            }
        }
        if (f === 0) {
          this.COMBINE_CONTAINER.push(o)
        }
      }

    }
  },


  markCombindEnd: function () {
    var startX = 0
    var startY = 0
    var endX = 0
    var endY = 0
    var id = 0
    var name = ""
    if (this.COMBINE_CONTAINER.length !== 0) {
      for (let i = 0; i < this.COMBINE_CONTAINER.length; i++) {
        for (let j = 0; j < this.COMBINE_CONTAINER[i].length; j++) {
          if (j === 0) {
            name = this.COMBINE_CONTAINER[i][j].combineName
          }
          if (startX === 0) {
            startX = this.COMBINE_CONTAINER[i][j].startX
          } else {
            startX = startX >= this.COMBINE_CONTAINER[i][j].startX ? this.COMBINE_CONTAINER[i][j].startX : startX
          }
          if (startY === 0) {
            startY = this.COMBINE_CONTAINER[i][j].startY
          } else {
            startY = startY >= this.COMBINE_CONTAINER[i][j].startY ? this.COMBINE_CONTAINER[i][j].startY : startY
          }
          if (endX === 0) {
            endX = this.COMBINE_CONTAINER[i][j].endX
          } else {
            endX = endX >= this.COMBINE_CONTAINER[i][j].endX ? endX : this.COMBINE_CONTAINER[i][j].endX
          }
          if (endY === 0) {
            endY = this.COMBINE_CONTAINER[i][j].endY
          } else {
            endY = endY >= this.COMBINE_CONTAINER[i][j].endY ? endY : this.COMBINE_CONTAINER[i][j].endY
          }
        }
        this.drawCombine(startX, startY, endX, endY, name)
        startX = 0
        startY = 0
        endX = 0
        endY = 0
      }

    }
  },
  drawCombine: function (startX, startY, endX, endY, name) {
    if (this.OPITION.open_combine_beautify) {
      var width = endX - startX
      var height = endY - startY
      if (width > height) {
        startY = startY + height / 2 - width / 2 * this.COMBINE_WIDTH_HEIGHT_SCALE
        endY = endY - height / 2 + width / 2 * this.COMBINE_WIDTH_HEIGHT_SCALE
      } else {
        startX = startX + width / 2 - height / 2 * this.COMBINE_WIDTH_HEIGHT_SCALE
        endX = endX - width / 2 + height / 2 * this.COMBINE_WIDTH_HEIGHT_SCALE
      }

    }
    var a = "<div class=\"topo_p combine\" style=\"border:solid;height:" + (endY - startY) + ";width:" + (endX - startX) + ";top:" + startY + ";left:" + startX + "\"></div>"
    var b = "<p class=\"topo_p\" style=\"top:" + (startY - 100) + ";left:" + startX + "\">" + name + "</p>"
    this.container.append(a).append(b)
  }

}