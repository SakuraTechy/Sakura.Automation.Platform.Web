import Vue from 'vue'

// 获取当前的环境
const CURRENTENV = process.env.NODE_ENV
// 对象转换为数组
function convertToArray (nodes) {
    let arr = null
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
        arr = new Array(20)
        for (let i = 0; i < nodes.length; i++) {
            arr.push(nodes[i])
        }
    }
    return arr
}
/**
 * 通用日志打印
 * @param {要打印的日志内容} args
 * @param {日志标识,默认为log,warn,error,dir} logTag
 */
function commLog (args, logTag = 'info') {
    if (CURRENTENV !== 'development') return
    switch (logTag) {
        case 'info':
            console.log(...convertToArray(args))
            break
        case 'warn':
            console.warn(...convertToArray(args))
            break
        case 'error':
            console.error(...convertToArray(args))
            break
        case 'dir':
            console.dir(...convertToArray(args))
            break
    }
}
Vue.use({
    install: (Vue) => {
        // 特别注意:此处不能用箭头函数,否则函数内部arguments的作用域就变了
        // 普通日志
        Vue.prototype.$info = function () {
            commLog(arguments)
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
    error: function () {
        commLog(arguments, 'error')
    },
    dir: function () {
        commLog(arguments, 'dir')
    }
}
