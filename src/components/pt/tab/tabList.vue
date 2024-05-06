<template>
  <div class="tab-content">
    <div v-if="isVisible" class="add-tab" :style="{ left: `5px` }">
      <a-button type="primary" @click="addTab()" icon="plus"> </a-button>
    </div>
    <a-tabs v-model="activeKey" hideAdd type="editable-card" @edit="onEdit">
      <a-tab-pane key="0" :tab="tab" :closable="false">
        <slot name="table"></slot>
      </a-tab-pane>
      <a-tab-pane v-for="pane in panes" :key="pane.key" :closable="pane.closable">
        <template slot="tab">
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>{{ pane.title }}</span>
            </template>
            <span> {{ pane.title.length > 6 ? `${pane.title.slice(0, 6)}...` : pane.title }}</span>
          </a-tooltip>
        </template>
        <slot name="addForm" :content="{ ...pane, activeKey }"></slot>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  name: 'Tab',
  props: {
    tab: {
      type: String
    },
    newTitle: {
      type: String
    },
    projectId: {
      type: String
    }
  },
  data() {
    return {
      leftWidth: 0,
      activeKey: '0', // 激活的tab
      panes: [], // 新建tab
      newTabIndex: 1, // 新建tab唯一值
      titleIndex: 1,
      isVisible: false,
    }
  },
  watch: {
    activeKey: {
      handler(val) {
        if (val === '0') {
          this.leftWidth = '300'
          this.$emit('changeLeftWidth', this.leftWidth, val)
        } else {
          this.leftWidth = '0'
          this.$emit('changeLeftWidth', this.leftWidth, val)
        }
        for(var pan of this.panes){
          if(pan.key === val){
            this.$emit('setSceneList', pan.content)
            break
          }
        }
        // this.$emit('setSceneList', this.leftWidth, val)
      }
    },
    // 当项目发生变化，清空之前项目添加编辑的信息
    projectId: {
      handler(val) {
        if (val) {
          this.panes = []
        }
      }
    }
  },
  mounted() {
    // const tabs = document.querySelectorAll('.ant-tabs-nav');
    // tabs[1].style.left = '75px';
    // tabs[1].style.maxWidth = 'calc(100% - 82px)';
    // console.log(tabs);
    const tabs1 = document.querySelectorAll('.ant-tabs-nav-container');
    // console.log(tabs1);
    // console.log(this.tab);
    if(this.tab==='场景列表'){
      this.isVisible = true
      tabs1[1]?tabs1[1].style.left = '75px':''
      tabs1[1]?tabs1[1].style.maxWidth = 'calc(100% - 82px)':''
    }else if(this.tab==='UI自动化测试'){
      this.isVisible = false
      tabs1[3]?tabs1[3].style.left = '5px':''
      tabs1[3]?tabs1[3].style.maxWidth = 'calc(100% - 82px)':''
    }
  },
  methods: {
    // 关闭tab
    onEdit(targetKey, action) {
      var that = this
      this.$Modal.confirm({
        title: '关闭页面?',
        content: '确认关闭当前页面吗?',
        onOk() {
          return that[action](targetKey)
        },
        onCancel() { }
      })
    },
    // 保存后更新用例
    handleUpdateCase(record, updateTitle) {
      this.panes.map((item, index) => {
        if (item.key === this.activeKey) {
          item.title = updateTitle
          if (item.content) {
            item.content = Object.assign(item.content, record)
          } else {
            item.content = record
          }
        }
      })
    },
    // 新建tab
    addTab(record, editTitle, id) {
      this.leftWidth = '0'
      const panes = this.panes
      let title
      let samePane = []
      if (record) {
        samePane = this.panes.filter((pane, i) => {
          return pane.content !== null ? id === pane.content.id : null
        })
        title = editTitle
      } else {
        title = `${this.newTitle+this.titleIndex++}`
      }
      if (samePane.length) {
        this.activeKey = samePane[0].key
        return
      }
      const activeKey = `${this.newTabIndex++}`
      panes.push({
        title: title,
        content: record || null,
        key: activeKey
      })
      this.panes = panes
      this.activeKey = activeKey
      // const tabs = document.querySelectorAll('.ant-tabs-nav');
      // console.log(tabs);
    },
    // 移除tab
    remove(targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter((pane) => pane.key !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key
        } else {
          activeKey = panes[0].key
        }
      }
      this.panes = panes
      if (!this.panes.length) {
        this.activeKey = '0'
        this.leftWidth = '300'
      } else {
        this.activeKey = activeKey
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tab-content {
  position: relative;
  box-sizing: border-box;

  .add-tab {
    cursor: pointer;
    z-index: 999;
    position: absolute;
    top: 6px;
    left: 100px;
    width: 60px;
    height: 30px;
  }
}

.ant-divider-horizontal {
  margin: 10px 0;
}

/deep/ .ant-tabs-tab {
  // width: 105px !important;
  text-align: center;
}
</style>
