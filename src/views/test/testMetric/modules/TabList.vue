<template>
  <div class="tab-content">
    <a-tabs v-model="localActiveKey" hideAdd type="editable-card" @edit="onEdit">
      <a-tab-pane v-if="this.tab.tab0?this.tab.tab0.isVisible:false" key="0" :tab="this.tab.tab0.name" :closable="false">
        <slot :name="this.tab.tab0.name"></slot>
      </a-tab-pane>
      <a-tab-pane v-if="this.tab.tab1?this.tab.tab1.isVisible:false" key="1" :tab="this.tab.tab1.name" :closable="false">
        <slot :name="this.tab.tab1.name"></slot>
      </a-tab-pane>
      <a-tab-pane v-if="this.tab.tab2?this.tab.tab2.isVisible:false" key="2" :tab="this.tab.tab2.name" :closable="false">
        <slot :name="this.tab.tab2.name"></slot>
      </a-tab-pane>
      <a-tab-pane v-if="this.tab.tab3?this.tab.tab3.isVisible:false" key="3" :tab="this.tab.tab3.name" :closable="false">
        <slot :name="this.tab.tab3.name"></slot>
      </a-tab-pane>
      <a-tab-pane v-if="this.tab.tab4?this.tab.tab4.isVisible:false" key="4" :tab="this.tab.tab4.name" :closable="false">
        <slot :name="this.tab.tab4.name"></slot>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  name: 'Tab',
  props: {
    activeKey: {
      type: String
    },
    tab: {
      type: Object
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
      localActiveKey: this.activeKey,
      panes: [], // 新建tab
      newTabIndex: 1, // 新建tab唯一值
      titleIndex: 1,
      // isVisible: false,
    }
  },
  watch: {
    localActiveKey: {
      handler(activeKey) {
        // console.log(activeKey);
        this.localActiveKey = activeKey;
        this.$emit('setActiveKey', activeKey)
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
    // console.log(this.tab);
    // console.log(this.tab.tab0);
    // console.log(this.tab.tab0.name);
    // const tabs = document.querySelectorAll('.ant-tabs-nav');
    // tabs[1].style.left = '75px';
    // tabs[1].style.maxWidth = 'calc(100% - 82px)';
    // console.log(tabs);
    // const tabs1 = document.querySelectorAll('.ant-tabs-nav-container');
    // console.log(tabs1);
    // console.log(this.tab);
    // if(!this.tab0 ==='UI自动化测试报告'){
      // this.activeKey = '0'
      // this.isVisible = true
      // tabs1[1].style.left = '75px';
      // tabs1[1].style.maxWidth = 'calc(100% - 82px)';
    // }
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
