export default {
  4: {
    name: "刀闸",
    width: 20,
    height: 5,
    svgName (state) {
      if (state === 0) {
        return "#nt_duanluqi_fen"
      } else {
        return "#nt_duanluqi_he"
      }
    }
  },
  5: {
    name: "开关",
    width: 20,
    height: 5,
    svgName (state) {
      if (state === 0) {
        return "#nt_fuhekaiguan_fen"
      } else {
        return "#nt_fuhekaiguan_he"
      }
    }
  },
  6: {
    name: "联络开关",
    width: 20,
    height: 5,
    svgName (state) {
      if (state === 0) {
        return "#nt_duanluqi_fen"
      } else {
        return "#nt_duanluqi_he"
      }
    }
  },
  0: {
    name: "变电站",
    width: 10,
    height: 10,
    svgName () {
      return "#nt_biandianzhan"
    }
  },
  2: {
    name: "母线",
    width: 2,
    height: 30,
    svgName () {
      return "#nt_muxian"
    }
  }
}
