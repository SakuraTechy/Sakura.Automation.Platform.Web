import Vue from 'vue'

// 获取当前的环境
const CURRENTENV = process.env.NODE_ENV

/**
 * 通用日志打印
 * @param {要打印的日志内容} args
 * @param {日志标识,默认为log,warn,error,dir} logTag
 */
function commLog (args, logTag = 'info') {
    if (CURRENTENV !== 'development') return
    switch (logTag) {
        case 'info':
          log.pretty(args[0], args[1])
          // console.log(...convertToArray(args))
          break
        case 'success':
          log.pretty(args[0], args[1], logTag)
          break
        case 'warn':
          log.pretty(args[0], args[1], logTag)
          // console.warn(...convertToArray(args))
          break
        case 'error':
          log.pretty(args[0], args[1], logTag)
          // console.error(...convertToArray(args))
          break
        case 'dir':
          log.pretty(args[0], args[1], 'default')
          // console.dir(...convertToArray(args))
          break
    }
}

// 对象转换为数组
// eslint-disable-next-line no-unused-vars
function convertToArray (nodes) {
  let arr = []
  // 兼容ie
  try {
      arr = Array.prototype.slice.call(nodes, 0)
      // 因为 slice是 array类的方法
      // 而传进来的参数是一个 DOM对象的数组
      // 所以通过call 方法把 array类的方法放到这个对象里面执行
      // call 的第二个参数是表示向被调用的方法传进参数
      // 这里的0 表示从index为0的地方开始
  } catch (ex) {
      // 出现异常就用最常见的方法处理
      arr = []
      for (let i = 0; i < nodes.length; i++) {
        arr.push(nodes[i])
      }
  }
  return arr
}

Vue.use({
    install: (Vue) => {
        // 特别注意:此处不能用箭头函数,否则函数内部arguments的作用域就变了
        // 普通日志
        Vue.prototype.$info = function () {
            commLog(arguments)
        }
        // 成功日志
        Vue.prototype.$success = function () {
          commLog(arguments, 'success')
        }
        // 警告日志
        Vue.prototype.$warn = function () {
            commLog(arguments, 'warn')
        }
        // 错误日志
        Vue.prototype.$error = function () {
            commLog(arguments, 'error')
        }
        // 打印对象
        Vue.prototype.$dir = function () {
            commLog(arguments, 'dir')
        }
    }
})

// 导出第二种使用方式
export default {
    info: function () {
        commLog(arguments)
    },
    warn: function () {
      commLog(arguments, 'warn')
  },
    success: function () {
        commLog(arguments, 'success')
    },
    error: function () {
        commLog(arguments, 'error')
    },
    dir: function () {
        commLog(arguments, 'dir')
    }
}

const log = {}

/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ info | success | warn | error | text ]
 */
export function typeColor (type = 'default') {
  let color = ''
  switch (type) {
    case 'info':
      color = '#1089ff'
      break
    case 'success':
      color = '#52c41a'
      break
    case 'warn':
      color = '#fea638'
      break
    case 'error':
      color = '#ff4d4f'
      break
    case 'default':
      color = '#35495E'
      break
    default:
      color = type
      break
  }
  return color
}

/**
 * 漂亮的输出
 * @param title 前面的标题
 * @param text 输出文本
 * @param type 输出样式，可以是6个状态值，也可以是自定义颜色
 */
log.pretty = function (title, text, type = 'info') {
  // console.log(typeof text)
  // 如果是对象则调用打印对象方式
  if (typeof text === 'object') {
    if (type === 'warn') {
      console.log(
        `║ %c ${title}`,
        `background:${typeColor(type)};border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        JSON.stringify(text)
      )
    } else {
      console.log(
        `║ %c ${title}`,
        `background:${typeColor(type)};border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        text
      )
    }
    // console.log(text)
    // console.log(JSON.stringify(text))
    // console.table(text)
  } else {
    // console.log(`%c ${title}`, 'font-size:20pt')
    console.log(
    `║ %c ${title} %c ${text} %c`,
    `background:${typeColor(type)};border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
    `border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 0 2px 2px 0; color: ${typeColor(type)};`,
    'background:transparent'
    )
  }
}

log.info = function (text, back = false) {
  this.print(text, 'info', back)
}
log.success = function (text, back = false) {
  this.print(text, 'success', back)
}
log.info = function (text, back = false) {
  this.print(text, 'info', back)
}
log.warn = function (text, back = false) {
  this.print(text, 'warn', back)
}
log.error = function (text, back = false) {
  this.print(text, 'error', back)
}

/**
 * 打印方法
 * @param text 输出文本
 * @param type 输出样式，可以是6个状态值，也可以是自定义颜色
 * @param back 是否将色值应用于背景色
 */
 log.print = function (text, type = 'default', back = false) {
  if (typeof text === 'object') { // 如果是对象则调用打印对象方式
    console.dir(text)
    return
  }
  if (back) { // 如果是打印带背景图的
    console.log(
      `%c ${text} `,
      `background:${typeColor(type)}; padding: 2px; border-radius: 2px;color: #fff;`
    )
  } else {
    console.log(
      `%c ${text} `,
      `color: ${typeColor(type)};`
    )
  }
}

log.info = function (text, back = false) {
  this.print(text, 'info', back)
}
log.success = function (text, back = false) {
  this.print(text, 'success', back)
}
log.info = function (text, back = false) {
  this.print(text, 'info', back)
}
log.warn = function (text, back = false) {
  this.print(text, 'warn', back)
}
log.error = function (text, back = false) {
  this.print(text, 'error', back)
}

// export default log
