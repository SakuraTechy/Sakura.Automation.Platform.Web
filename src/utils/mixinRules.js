export const mixin = {
  props: {
    id: {
      type: String,
    },
    content: {
      type: Object,
    },
  },
  data() {
    return {
    }
  },
  created() {},
  computed: {
    getTip() {
      const { action } = this.form
      switch (action) {
        case 'web-geturl':
          return '获取项目环境里面的URL域名打开'
        case 'web-geturls':
          return '指定URL域名打开'
        case 'web-close':
          return '从标签页A打开新的标签页B，关闭标签页A'
        case 'web-quit':
          return '同时会关闭浏览器'
        case 'web-refresh':
          return '刷新当前浏览器页面'
        case 'web-getcode':
          return '通过Python脚本解析图片验证码'
        case 'switch-window':
          return '切换浏览器到当前最新窗口，默认最后一个'
        case 'switch-windows':
          return '切换浏览器到指定窗口，适合多窗口互相切换'
        case 'switch-Iframe':
          return '1. 通过index获取，，第一位0 2. 通过id，name，xpath获取'
        case 'return-Iframe':
          return '返回上一级Iframe控件'
        case 'quit-Iframe':
          return '返回最上级Iframe控件'
        default:
          return ''
      }
    },
    getEleTip() {
      const { stepType } = this.form
      switch (stepType) {
        case '0':
          return '针对属性type="submit”的元素，用于提交表单数据'
        case '1':
          return '对下拉选项进行操作，可实现单选，多选，以及取消选择的操作'
        case '2':
          return '用于设置 checkbox/radio 的状态'
        case '3':
          return '对页面对象执行指定的等待操作，默认等待超时15000ms'
        default:
          return ''
      }
    },
    getMouseTip() {
      const { stepType } = this.form
      switch (stepType) {
        case '0':
          return '模拟鼠标点击的操作，支持单击/双击/按下/弹起'
        case '1':
          return '将鼠标悬停在网页元素的上方'
        case '2':
          return '模拟鼠标将元素从某个位置拖到另一个位置'
        default:
          return ''
      }
    },
    getLoopTip() {
      const { stepType } = this.form
      switch (stepType) {
        case '0':
          return '可以设置步骤执行次数'
        case '1':
          return '可以遍历给定的集合'
        case '2':
          return '设置循环表达式，满足表达式的条件则循环执行里面的步骤'
        case '3':
          return '设置表达式，满足表达式的条件则循环执行里面的步骤'
        case '4':
          return '配置If指令进行流程控制，不满足 If 条件且满足 ElseIf 条件则执行'
        case '5':
          return '配置 If 指令进行流程控制，不满足 If 条件则执行'
        default:
          return ''
      }
    },
  },
  watch: {
    'form.name': {
      handler(val) {
        this.$emit('changeName', val, this.id)
      },
      deep: true,
    },
  },
  methods: {
    handlervalidate(callback) {
      let flag = false
      this.$refs.form.validate((valid) => {
        flag = valid
      })
      return flag
    },
  },
}
