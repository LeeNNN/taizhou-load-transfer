import * as d3 from "d3"
// 定义图元
function defsFengDian () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'NewEnergy_20190326171012001')
    .attr('viewBox', '0 0 450 450');
  symbol.append('circle').attr('cx', '224.3').attr('cy', '226.3').attr('r', '220').attr('fill', 'none').attr('stroke', '#000000').attr('stroke-miterlimit', '10').attr('stroke-width', '10');
  symbol.append('circle').attr('cx', '226.2').attr('cy', '193.1').attr('r', '19.9');
  symbol.append('path').attr('d', "M226.2,165.5c1.1,0,2.2,0.1,3.4,0.2c3.8-6.8,6.5-22.6,6.5-40.9c0-24.6-4.8-44.6-10.8-44.6c-5.9,0-10.8,19.9-10.8,44.6c0,18.5,2.7,34.4,6.6,41.2C222.7,165.6,224.4,165.5,226.2,165.5z");
  symbol.append('path').attr('d', "M203.2,208.3c-0.6-1-1-2-1.5-2.9c-7.8,0.1-22.8,5.7-38.6,14.8c-21.3,12.3-36.2,26.5-33.2,31.7c3,5.2,22.7-0.6,44-12.9 c16.1-9.3,28.4-19.6,32.3-26.3C205.1,211.2,204.1,209.8,203.2,208.3z");
  symbol.append('path').attr('d', "M249.2,208.3c0.6-1,1-2,1.5-2.9c7.8,0.1,22.8,5.7,38.6,14.8c21.3,12.3,36.2,26.5,33.2,31.7s-22.7-0.6-44-12.9 c-16.1-9.3-28.4-19.6-32.3-26.3C247.3,211.2,248.3,209.8,249.2,208.3z");
  symbol.append('path').attr('d', "M235.2,373h-16.6c-3.3,0-6-4.3-6-9.6l7.7-132.6c0-5.2,2.7-9.5,6-9.5h2.1c3.3,0,6,4.3,6,9.5l6.8,132.6 C241.2,368.7,238.5,373,235.2,373z");
}
function defsGuangDian () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'NewEnergy_20190326171012002').attr('viewBox', '0 0 450 450');
  symbol.append('circle').attr('cx', '224.3').attr('cy', '226.3').attr('r', '220')
    .attr('fill', "#FFFFFF").attr('stroke', '#000').attr('stroke-width', '30').attr('stroke-miterlimit', '10');
  symbol.append('polygon')
    .attr('points', '387,327.8 379,328 325,233.4 330.1,230.3')
    .attr('stroke', '#000').attr('stroke-width', '8').attr('stroke-miterlimit', '10');
  symbol.append('polygon')
    .attr('points', '358,328 350,328 297.9,238.3 303.1,235.3')
    .attr('stroke', '#000').attr('stroke-width', '8').attr('stroke-miterlimit', '10');
  symbol.append('ellipse').attr('cx', '167.5').attr('cy', '181.5').attr('rx', '44.3').attr('ry', '44.3');
  symbol.append('path').attr('d', "M305.9,326.3l-220.4-1.2c-7,0-11.7-6.1-10.5-13.5l18.7-112.5c1.2-7.5, 7.9-13.5,14.9-13.4l220.4,1.2 c7,0,11.7,6.1,10.5,13.5l-18.7,112.5C319.6,320.3,312.9,326.3,305.9,326.3z")
    .attr('fill', "#FFFFFF").attr('opacity', "0.99").attr('stroke', "#000000").attr('stroke-width', "6").attr('stroke-miterlimit', "10").attr('enable-background', 'new');
  symbol.append('line').attr('x1', "84.7").attr('y1', "256").attr('x2', "329.9").attr('y2', "256")
    .attr('fill', "none").attr('stroke', "#000000").attr('stroke-width', "3").attr('stroke-miterlimit', "10");
  symbol.append('line').attr('x1', "144.1").attr('y1', "185.6").attr('x2', "119").attr('y2', "326.3")
    .attr('fill', "none").attr('stroke', "#000000").attr('stroke-width', "3").attr('stroke-miterlimit', "10");
  symbol.append('line').attr('x1', "192.1").attr('y1', "185.6").attr('x2', "166.9").attr('y2', "326.3")
    .attr('fill', "none").attr('stroke', "#000000").attr('stroke-width', "3").attr('stroke-miterlimit', "10");
  symbol.append('line').attr('x1', "240").attr('y1', "185.6").attr('x2', "214.9").attr('y2', "326.3")
    .attr('fill', "none").attr('stroke', "#000000").attr('stroke-width', "3").attr('stroke-miterlimit', "10");
  symbol.append('line').attr('x1', "287.9").attr('y1', "185.6").attr('x2', "262.8").attr('y2', "326.3")
    .attr('fill', "none").attr('stroke', "#000000").attr('stroke-width', "3").attr('stroke-miterlimit', "10");

  symbol.append('path').attr('d', "M167.6,130.5L167.6,130.5c-1.5,0-2.7-1.2-2.7-2.7v-19.9c0-1.5,1.2-2.7,2.7-2.7l0, 0c1.5,0,2.7,1.2,2.7,2.7v19.9 C170.3,129.3,169.1,130.5,167.6,130.5z");
  symbol.append('path').attr('d', "M130.4,143.1L130.4,143.1c-1.3,0.8-3,0.3-3.7-1l-9.9-17.2c-0.8-1.3-0.3-3, 1-3.7l0,0c1.3-0.8,3-0.3,3.7,1l9.9,17.2 C132.2,140.7,131.7,142.4,130.4,143.1z");
  symbol.append('path').attr('d', "M211.5,143.1L211.5,143.1c1.3,0.8,3,0.3,3.7-1l10-17.2c0.8-1.3,0.3-3-1-3.7l0, 0c-1.3-0.8-3-0.3-3.7,1l-10,17.2 C209.7,140.7,210.2,142.4,211.5,143.1z");
  symbol.append('path').attr('d', "M91.1,164.9L91.1,164.9c0-1.5,1.2-2.7,2.7-2.7h19.9c1.5,0,2.7,1.2,2.7,2.7l0, 0c0,1.5-1.2,2.7-2.7,2.7H93.8 C92.4,167.6,91.1,166.4,91.1,164.9z");
  symbol.append('path').attr('d', "M213.7,165.1L213.7,165.1c0-1.5,1.2-2.7,2.7-2.7h19.9c1.5,0,2.7,1.2,2.7,2.7l0, 0c0,1.5-1.2,2.7-2.7,2.7h-19.9 C214.9,167.8,213.7,166.6,213.7,165.1z");
}
function defsShengWuDian () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'NewEnergy_20190326171012003')
    .attr('viewBox', '0 0 450 450');
  symbol.append('circle').attr('cx', '224.3').attr('cy', '226.3').attr('r', '220').attr('fill', 'none').attr('stroke', '#000000').attr('stroke-miterlimit', '10').attr('stroke-width', '30');
  symbol.append('path').attr('d', "M224.8,67.1c-65.2,0-117.8,51.3-117.8,113.7c0,33.3,15.2,64.5,40.9,85.9c5.5,4.2,8.3,11.1,8.3,18v9.7 c0,12.5,10.4,22.9,22.2,22.9h92.2c12.5,0,22.2-10.4,22.2-22.9v-9.7c0-6.9,2.8-13.2,8.3-18c25.6-21.5,40.9-52.7,40.9-85.9 C342.7,118.4,290,67.1,224.8,67.1z M292.8,255.6c-8.3,6.9-13.2,17.3-13.2,28.4v9.7c0,4.9-4.2,9-8.3,9h-92.9c-4.9,0-8.3-4.2-8.3-9 V284c0-11.1-4.9-21.5-13.2-28.4c-22.9-18.7-36-45.7-36-74.9c0-54.8,46.4-99.8,104-99.8s104,45.1,104,99.8 C328.8,209.8,315.6,236.9,292.8,255.6z M273.4,330.4h-97c-4.2,0-6.9,2.8-6.9,6.9s2.8,6.9,6.9,6.9h97c4.2,0,6.9-2.8,6.9-6.9 S277.5,330.4,273.4,330.4z M259.5,358.2h-69.3c-4.2,0-6.9,2.8-6.9,6.9s2.8,6.9,6.9,6.9h69.3c4.2,0,6.9-2.8,6.9-6.9 S263.7,358.2,259.5,358.2L259.5,358.2z M245.6,385.9H204c-4.2,0-6.9,2.8-6.9,6.9s2.8,6.9,6.9,6.9h41.6c4.2,0,6.9-2.8,6.9-6.9 S249.8,385.9,245.6,385.9z");
  symbol.append('path').attr('d', "M249.1,233.4c-0.1,0-8.9-0.3-13.6-2.2c-3.2-1.3-4.7-5-3.3-8.2c1.3-3.2,5-4.7,8.2-3.3c1.5,0.6,7.1,1.2,8.8,1.3c5.9,0,11.4-1.4,16.4-4.2c6.5-3.6,12.2-9.5,16.9-17.7c5.5-9.6,9.7-22.1,12.5-37.2h-4.2c-21.8,0-37,0.2-48.4,3 c-6.4,1.5-11.3,3.8-15,7c-3.9,3.3-6.5,7.6-8.1,13.3c-1.1,4-1.4,11.1,0.6,17.6c0.6,2,1.4,3.8,2.7,5.7c1.9,2.9,1,6.8-1.9,8.6 c-2.9,1.9-6.8,1-8.6-1.9c-1.9-2.9-3.2-5.8-4.1-8.8c-3-9.5-2.2-19.2-0.7-24.6c2.2-8,6.3-14.6,12-19.5c5.2-4.4,11.8-7.6,20.1-9.6 c12.7-3.1,28.6-3.4,51.3-3.4h5.6c3.1,0,6.1,1.2,8.3,3.4l0.4,0.4c2,2.4,2.9,5.7,2.5,8.9v0.2c-3,17.4-7.8,31.8-14.3,43 c-5.9,10.2-13.2,17.7-21.7,22.4C264.7,231.5,257.2,233.4,249.1,233.4L249.1,233.4z");
  symbol.append('path').attr('d', "M216.3,248.3h-0.4c-3.4-0.2-6.1-3.2-5.8-6.6c1.3-19.9,10.5-30.5,17.3-38.2l0.7-0.8c4-4.9,15.4-13.3,21.3-16.3 c5.2-2.7,9.4-4.3,15.8-4.8c3.5-0.3,6.4,2.3,6.7,5.8c0.3,3.4-2.3,6.4-5.8,6.7c-3.9,0.3-6.4,1.1-11,3.4c-5,2.6-14.9,10-17.7,13.3 l-0.7,0.8c-6.2,7.1-13.2,15.2-14.2,30.9C222.3,245.7,219.5,248.3,216.3,248.3L216.3,248.3z");
  symbol.append('path').attr('d', "M199.6,248.2c-3.9,2.2-7.9,3.3-12.2,3.2c-5.3,0-10.8-1.6-16.3-4.8c-6.1-3.6-12.2-9.2-18.3-16.6l-0.1-0.1 c-1-1.4-1.5-3.2-1.2-4.9l0.1-0.3c0.5-1.6,1.6-3,3-3.8l2.7-1.5c10.8-6.1,18.5-10.2,25.3-12.1c4.5-1.3,8.5-1.5,12.1-0.8 c4,0.8,7.7,2.8,10.9,6.1c2.2,2.2,5.1,6.6,6.3,11.9c0.4,1.7,0.5,3.4,0.4,5.3s-1.7,3.3-3.6,3.2c-1.9-0.1-3.3-1.7-3.2-3.6 c0.1-1.3,0-2.3-0.2-3.4c-0.8-3.6-2.8-6.9-4.4-8.5c-2.3-2.3-4.7-3.6-7.4-4.2c-2.6-0.5-5.6-0.3-9,0.7c-6.2,1.7-13.5,5.7-23.8,11.6 l-2,1.1c5.4,6.4,10.7,11.3,15.9,14.4c4.4,2.6,8.7,3.9,12.8,3.9c3.1,0,6.1-0.8,8.9-2.4c0.8-0.5,3.3-2.3,3.8-3 c1.1-1.5,3.3-1.8,4.8-0.6c1.5,1.1,1.8,3.3,0.6,4.8C203.8,245.7,199.7,248.2,199.6,248.2L199.6,248.2z");
  symbol.append('path').attr('d', "M219.2,246.5c-1.5,0.9-3.6,0.4-4.5-1.1c-4.7-7.2-10.2-9.2-15-10.9l-0.5-0.2c-2.2-0.8-8.9-1.7-12-1.6 c-2.8,0.1-4.2,0.4-6.1,1.3c-1.7,0.8-3.8,0.1-4.6-1.6s-0.1-3.8,1.6-4.6c3.2-1.5,5.6-1.8,8.8-2c3.6-0.2,11.3,0.8,14.5,2l0.5,0.2 c5.3,1.8,12.5,4.4,18.5,13.5c1.1,1.5,0.6,3.7-1,4.7L219.2,246.5L219.2,246.5z");
}

function defsRect () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'NewEnergy_20190326171012004')
    .attr('viewBox', '0 0 600 600');
  symbol.append('rect').attr('x', '0').attr('y', '0').attr('height', '600').attr('width', '600').attr('fill', 'none').attr('stroke', '#f00').attr('stroke-miterlimit', '10').attr('stroke-width', '20');
}
function defsFeiYunfang () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'UserCustom_20190702154100001')
    .attr('viewBox', '0 0 600 600');
  symbol.append('circle').attr('cx', '300').attr('cy', '300').attr('r', '300').attr('fill', '#9b0000');
  symbol.append('path').attr('d', 'M277,320s-11.825-38.366-20-79c-8.8-43.751-15.764-77.149-14-90s12.062-46.918,58-47c43.318-.057,57.408,34.955,57,47-0.316,8.549-4.935,44.406-13,87-7.934,41.9-19,82-19,82s-5.539,17-25,17C283.8,337,277,320,277,320Z').attr('fill', '#fff').attr('fill-rule', 'evenodd');
  symbol.append('circle').attr('cx', '300').attr('cy', '429').attr('r', '50').attr('fill', '#fff');
}
function defsDeviceDefect () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'UserCustom_20190702154100002')
    .attr('viewBox', '0 0 600 600');
  symbol.append('circle').attr('cx', '300').attr('cy', '300').attr('r', '300').attr('fill', 'rgba(0,0,0,0.01)').attr('stroke', '#000').attr('stroke-width', '10px');
  symbol.append('path').attr('d', 'M485,458h-0.727c-8.484-14.669-29.392-50.768-49.8-86H485a4,4,0,0,1,4,4v78A4,4,0,0,1,485,458Zm0-115H417.667c-15.87-27.388-28.88-49.835-31.6-54.517a12.709,12.709,0,0,0-22.138,0c-2.052,3.469-15.336,26.322-31.7,54.517H103a4,4,0,0,1-4-4V261a4,4,0,0,1,4-4H485a4,4,0,0,1,4,4v78A4,4,0,0,1,485,343ZM166,290a10,10,0,1,0,10,10A10,10,0,0,0,166,290Zm319-62H103a4,4,0,0,1-4-4V146a4,4,0,0,1,4-4H485a4,4,0,0,1,4,4v78A4,4,0,0,1,485,228ZM166,175a10,10,0,1,0,10,10A10,10,0,0,0,166,175ZM103,372H315.414c-20.231,34.9-41,70.775-49.742,86H103a4,4,0,0,1-4-4V376A4,4,0,0,1,103,372Zm63,53a10,10,0,1,0-10-10A10,10,0,0,0,166,425Z').attr('fill-rule', 'evenodd');
  symbol.append('path').attr('d', 'M289.633,484H461.118c7.973,0,13.905-8.244,9.24-16.391-3.734-6.53-79.122-137.02-85.57-148.157a10.649,10.649,0,0,0-18.576,0c-4.729,8.017-80.5,139.005-85.766,148.491C276.585,474.893,280.85,484,289.633,484Z').attr('fill', '#9b0000').attr('fill-rule', 'evenodd');
  symbol.append('path').attr('d', 'M368.408,421.688s-3.59-11.49-6.072-23.659c-2.672-13.1-4.786-23.105-4.251-26.953s3.662-14.051,17.609-14.076c13.152-.017,17.43,10.468,17.306,14.076-0.1,2.56-1.5,13.3-3.947,26.055-2.409,12.548-5.768,24.557-5.768,24.557a7.923,7.923,0,0,1-7.591,5.091C370.473,426.779,368.408,421.688,368.408,421.688Z').attr('fill', '#fff').attr('fill-rule', 'evenodd');
  symbol.append('circle').attr('cx', '375.39').attr('cy', '449.015').attr('r', '15.172').attr('fill', '#fff');
}
function defsZhongYaoUser () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'UserCustom_20190702154100003')
    .attr('viewBox', '0 0 600 600');
  symbol.append('circle').attr('cx', '300').attr('cy', '300').attr('r', '300').attr('fill', 'rgba(0,0,0,0.01)').attr('stroke', '#000').attr('stroke-width', '10px');
  symbol.append('path').attr('d', 'M436,345l-20,42-49,19,33,28-10,43,51-14,37,22-2-48,36-39-53-12Z').attr('fill', '#c47149').attr('fill-rule', 'evenodd');
  symbol.append('path').attr('d', 'M426,349l-25,43-49,10,33,37-4,48,45-19,43,20-2-51,30-34-47-12Z').attr('fill', '#f29b76').attr('fill-rule', 'evenodd');
  symbol.append('circle').attr('cx', '270').attr('cy', '222').attr('r', '90');
  symbol.append('path').attr('d', 'M191,316s34.744,18.244,73,18c40.2-.256,84-19,84-19l50,52-10,20-47,11,32,36-2,17-238,1s-23.621-30.406-11-60C137.979,354.531,191,316,191,316Z').attr('fill-rule', 'evenodd');
}
function defsMinGanUser () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'UserCustom_20190702154100004')
    .attr('viewBox', '0 0 600 600');
  symbol.append('circle').attr('cx', '300').attr('cy', '300').attr('r', '300').attr('fill', 'rgba(0,0,0,0.01)').attr('stroke', '#000').attr('stroke-width', '10px');
  symbol.append('circle').attr('cx', '270').attr('cy', '222').attr('r', '90');
  symbol.append('path').attr('d', 'M191,316s34.744,18.244,73,18c40.2-.256,84-19,84-19l37,40s-37.881-13.669-53,22c-12.442,29.354,35,75,35,75H133s-23.621-30.406-11-60C137.979,354.531,191,316,191,316Z').attr('fill-rule', 'evenodd');
  symbol.append('path').attr('d', 'M421.963,369.869s-43.616-33.989-56.029,13.161c-9.594,36.444,57.9,78.97,57.9,78.97s66.533-40.851,56.029-83.67C470.074,338.438,421.963,369.869,421.963,369.869Z').attr('fill', '#c47149').attr('fill-rule', 'evenodd');
  symbol.append('path').attr('d', 'M399,371s-46.707-36.154-60,14c-10.274,38.765,62,84,62,84s71.248-43.453,60-89C450.521,337.567,399,371,399,371Z').attr('fill', '#f29b76').attr('fill-rule', 'evenodd');
}
function defsShuangDianYuanUser () {
  var symbol = d3.select('defs').append('symbol')
    .attr('id', 'UserCustom_20190702154100005')
    .attr('viewBox', '0 0 600 600');
  symbol.append('rect').attr('width', '600').attr('height', '600').attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', '10px').attr('display', 'none');
  symbol.append('path').attr('d', 'M133,165L46,312h55L64,432l91-157H96l39-108').attr('fill-rule', 'evenodd');
  symbol.append('path').attr('d', 'M527,165L440,312h55L458,432l91-157H490l39-108').attr('fill-rule', 'evenodd');
}
const tuyuanIDs = {
  fengDian: "NewEnergy_20190326171012001",
  guangDian: "NewEnergy_20190326171012002",
  shengWuDian: "NewEnergy_20190326171012003",
  rect: "NewEnergy_20190326171012004",
  feiYunfang: "UserCustom_20190702154100001",
  deviceDefect: "UserCustom_20190702154100002",
  zhongYaoUser: "UserCustom_20190702154100003",
  minGanUser: "UserCustom_20190702154100004",
  shuangDianYuanUser: "UserCustom_20190702154100005"
}
export {
  defsFengDian,
  defsGuangDian,
  defsShengWuDian,
  defsRect,
  defsFeiYunfang,
  defsDeviceDefect,
  defsZhongYaoUser,
  defsMinGanUser,
  defsShuangDianYuanUser,
  tuyuanIDs
}
