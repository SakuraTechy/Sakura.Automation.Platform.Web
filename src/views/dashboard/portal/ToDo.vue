<template style="background:#f5f6fa;">
  <div class="typical-home" ref="portaletDiv">
    <a-row :gutter="[24,24]" class="module-list">
      <a-col :span="24">
        <div class="module-in module-in01">
          <a-page-header :ghost="false" title="技术选型">
            <template slot="extra">
              <a-icon type="more" />
            </template>
          </a-page-header>
          <a-row :gutter="[24,24]">
            <a-col :span="12">
              <div class="technology">
                <a-list size="small" :split="false" :data-source="consoleTech">
                  <a-list-item slot="renderItem" slot-scope="item">
                    {{ item }}
                  </a-list-item>
                  <div slot="header">
                    后端
                  </div>
                </a-list>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="technology">
                <a-list size="small" :split="false" :data-source="frontTech" >
                  <a-list-item slot="renderItem" slot-scope="item" >
                    {{ item }}
                  </a-list-item>
                  <div slot="header">
                    前端
                  </div>
                </a-list>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  import lineRadar from '@/views/demo/chart/line-chart'
  // 顶部列表
  const dataList = [{
      icon: 'area-chart',
      text: 'OKR',
      color: '#5584fd'
    },
    {
      icon: 'pie-chart',
      text: '汇报',
      color: '#3470ff'
    },
    {
      icon: 'bar-chart',
      text: '日报',
      color: '#ff8801'
    },
    {
      icon: 'dot-chart',
      text: '周报',
      color: '#00d6b9'
    },
    {
      icon: 'line-chart',
      text: '审批',
      color: '#ff8801'
    },
    {
      icon: 'radar-chart',
      text: '审批',
      color: '#ff8801'
    },
    {
      icon: 'sliders',
      text: '公告',
      color: '#ff8801'
    },
    {
      icon: 'android',
      text: '月报',
      color: '#7e3bf3'
    }
  ]
  // 待办事项
  const data = [{
      title: '待审批',
      data: '10'
    },
    {
      title: '待提交',
      data: '10'
    },
    {
      title: '待阅示',
      data: '4'
    }
  ]
  const detaildata = [{
      state: '【待审批】',
      txt: '公告发布审批公告发布审批公告发布审批公告发布审批公告发布审批公告发布审批公告发布审批公告发布审批',
      hint: '公告发布审批说明1'
    },
    {
      state: '【待提交】',
      txt: '差旅费报销差旅费报销',
      hint: '公告发布审批说明2'
    },
    {
      state: '【待提交】',
      txt: '录用管理',
      hint: '公告发布审批说明3'
    },
    {
      state: '【待审批】',
      txt: '通知公告',
      hint: '公告发布审批说明4'
    },
    {
      state: '【待审批】',
      txt: '公告发布审批公告发布审批',
      hint: '公告发布审批说明5'
    }
  ]
  // 关注项目总览
  const projectcolumns = [{
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      scopedSlots: {
        customRender: 'status'
      },
      key: 'status',
      ellipsis: true,
      width: 96
    },
    {
      title: '责任人',
      dataIndex: 'take',
      key: 'take',
      ellipsis: true,
      width: 86
    }
  ]
  const projectdata = [{
      key: '1',
      name: '项目名称项目名称项目名称项目名称项目名称',
      icon: 'warning',
      text: '未开始',
      take: '张三'
    },
    {
      key: '2',
      name: '项目名称项目名称项目名称项目名称项目名称',
      icon: 'processing',
      text: '进行中',
      take: '李四'
    },
    {
      key: '3',
      name: '项目名称项目名名称项目名称',
      icon: 'processing',
      text: '进行中',
      take: '王五'
    },
    {
      key: '4',
      name: '项目名称项目名称项目名称项名称项目名称',
      icon: 'success',
      text: '已完成',
      take: '张三'
    },
    {
      key: '5',
      name: '项目名称项目名名称项目名称',
      icon: 'processing',
      text: '进行中',
      take: '王五'
    }
  ]
  // 组件API搜索
  const apidata = [{
      icon: 'pie-chart',
      con: '选择组件'
    },
    {
      icon: 'bar-chart',
      con: '上传文件组件'
    },
    {
      icon: 'dot-chart',
      con: '卡片式暂无数据组件'
    },
    {
      icon: 'line-chart',
      con: '计数文本框组件'
    }
  ]
  // 帮助文档
  const aiddata = [
    '组件使用方法',
    '组件使用方法',
    '组件使用方法',
    '组件使用方法',
    '组件使用方法'
  ]
  // 后端技术
  const consoleTech = [
   'SpringBoot',
   'Spring Security',
   'JWT',
   'MyBatis',
   'Druid',
   'Fastjson'
  ]
  // 前端技术
  const frontTech = [
   'Vue',
   'Vuex',
   'Ant-Design-VUE',
   'Axios',
   'Sass',
   'Quill'
  ]
  // 公告
  const noticedata = [{
      state: '【升级】',
      title: '1月6日DOS高防（国际）升级通知',
      url: 'https://www.baidu.com'
    },
    {
      state: '【升级】',
      title: '商标局2021年元旦期间服务器异常停止商标递交申请通知',
      url: 'https://www.antdv.com/'
    },
    {
      state: '【升级】',
      title: '1月消息列队',
      url: 'https://www.baidu.com'
    },
    {
      state: '【升级】',
      title: '1月6日DOS高防（国际）升级通知',
      url: 'https://www.baidu.com'
    },
    {
      state: '【升级】',
      title: '商标局2021年元旦期间服务器异常停止商标递交申请通知',
      url: 'https://www.baidu.com'
    }
  ]
  // 统计信息
  const statisticscolumns = [{
      title: '状态',
      dataIndex: 'status',
      scopedSlots: {
        customRender: 'status'
      },
      key: 'status',
      ellipsis: true
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      ellipsis: true
    },
    {
      title: '增长率',
      dataIndex: 'tags',
      key: 'tags',
      scopedSlots: {
        customRender: 'tags'
      },
      ellipsis: true
    }
  ]
  const statisticsdata = [{
      key: '1',
      icon: 'error',
      text: '超期未完成',
      quantity: '10',
      tags: 35
    },
    {
      key: '2',
      icon: 'processing',
      text: '超期完成',
      quantity: '10',
      tags: -12
    },
    {
      key: '3',
      icon: 'warning',
      text: '进行中',
      quantity: '10',
      tags: 45
    },
    {
      key: '4',
      icon: 'default',
      text: '未开始',
      quantity: '10',
      tags: 24
    }
  ]
  // 热度产品
  const heatdata = [{
      index: '1',
      icon: 'copy',
      txt: '快速开发工具',
      value: '10.2',
      arrow: 'arrow-down',
      color: '#5fb38f',
      url: 'https://www.baidu.com'
    },
    {
      index: '2',
      icon: 'snippets',
      txt: '代码生成器',
      value: '11.2',
      arrow: 'arrow-up',
      color: '#ed2e2e',
      url: 'https://www.antdv.com'
    },
    {
      index: '3',
      icon: 'edit',
      txt: '流程设计器',
      value: '17.2',
      url: 'https://www.baidu.com'
    },
    {
      index: '4',
      icon: 'fund',
      txt: '菜单管理',
      value: '15.2',
      url: 'https://www.antdv.com'
    },
    {
      index: '5',
      icon: 'highlight',
      txt: '快速开发工具',
      value: '11.2',
      arrow: 'arrow-down',
      color: '#5fb38f',
      url: 'https://www.baidu.com'
    }
  ]
  // 添加弹出页
  const adddata = [{
      title: '审批',
      txt: '简单、高效、开放的审批工具',
      url: 'https://www.baidu.com',
      icon: 'ie',
      color: '#ff7741'
    },
    {
      title: '打卡',
      txt: '专业智能工具，实现高效考勤管理',
      url: 'https://www.baidu.com',
      icon: 'code-sandbox',
      color: '#3389ff'
    },
    {
      title: '公告',
      txt: '重要信息全员播报，特殊安排定向通知',
      url: 'https://www.baidu.com',
      icon: 'medium',
      color: '#ff7741'
    },
    {
      title: 'OKR',
      txt: '简单实用的团队目标管理工具',
      url: 'https://www.baidu.com',
      icon: 'slack',
      color: '#00d6b9'
    },
    {
      title: '打卡',
      txt: '专业智能工具，实现高效考勤管理',
      url: 'https://www.baidu.com',
      icon: 'ant-cloud',
      color: '#3389ff'
    }
  ]
  export default {
    data () {
      return {
        visible: false,
        data,
        detaildata,
        projectcolumns,
        projectdata,
        apidata,
        aiddata,
        consoleTech,
        frontTech,
        noticedata,
        dateFormat: 'YYYY-MM-DD',
        statisticscolumns,
        statisticsdata,
        compile: false,
        heatdata,
        adddata,
        dataList
      }
    },
    created () {
      this.reloadTab('1')
    },
    watch: {
    },
    mounted () {
      this.$emit('setHeight', this.$refs.portaletDiv.offsetHeight)
    },
    components: {
      lineRadar
    },
    methods: {
      getHeight () {
        return this.$refs.portaletDiv.offsetHeight
      },
      reloadTab (type) {
      },
      showModal () {
        this.visible = true
      },
      handleOk (e) {
        console.log(e)
        this.visible = false
      },
      compileshowModal () {
        this.compile = true
      },
      compilehandleOk (e) {
        console.log(e)
        this.compile = false
      },
      callback (key) {
        console.log(key)
      },
      onSearch (value) {
        console.log(value)
      },
      modalcallback (key) {
        console.log(key)
      },
      goTarget (href) {
        window.open(href, '_blank')
      },
      caseDisplay (href) {
        this.$message.success(
          '案例系统正在研发中，敬请期待！',
          3
         )
      }
    }
  }
</script>
<style lang="less">
  @import '../typical-home.less';
    .modlule-show{
          height: 240px;
          .ant-btn-lg {
          height: 40px;
          padding: 0 15px;
          font-size: 16px;
          border-radius: 4px;
       }
    }
</style>
