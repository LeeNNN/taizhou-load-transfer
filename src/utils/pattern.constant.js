// 至少包含 数字和英文，长度6-20
// export const patternPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
export const patternPassword = /^[0-9A-Za-z]{6,20}$/
// 字符开头的4到10位的字符、数字组成
export const patternUsername = /^[A-Za-z][0-9A-Za-z]{3,9}$/