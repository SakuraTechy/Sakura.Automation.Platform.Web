<template>
  <div class="splitpanle" :style="{height:splitHeight}" >
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider
        v-show="asideSwitch"
        v-model="collapsed"
        v-bind="$attrs"
        v-on="$listeners"
        :trigger="null"
        :collapsedWidth="0"
        theme="light"
        :width="leftWidth"
        collapsible>
        <div style="height:100%">
          <slot name="paneL"></slot>
          <a-icon
            class="trigger"
            :type="collapsed ? 'double-right' : 'double-left'"
            @click="clickSplitIcon"
          />
        </div>
      </a-layout-sider>
      <a-layout-content :style="{ background: '#fff', minHeight: '100%' }">
        <slot name="paneR"></slot>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script>
  export default {
    name: 'Split',
    props: {
       leftWidth: { type: String, default: '200' }, // 分割器左侧区域宽度
       splitHeight: { type: String, default: '100vh' }
    },
    data () {
      return {
         asideSwitch: true,
         collapsed: false
      }
    },
    watch: {
      leftWidth: {
        handler(val) {
          if (val === '0') {
            this.asideSwitch = false
          } else {
            this.asideSwitch = true
          }
        },
        immediate: true
      }
    },
    created () {
    },
    methods: {
      clickSplitIcon () {
        this.collapsed = !this.collapsed
      }
    }
  }
</script>

<style lang="less">
  .splitpanle{
    .ant-layout-sider{
      position: relative;
      border-right: 1px solid rgb(235, 237, 240);
      z-index: 1;
      padding: 10px 20px 0 10px;
      // min-height: calc(100vh - 167px);
      // height:calc(100vh - 110px);
      height: 100%;
    }
    .ant-layout-sider{
      .ant-input-affix-wrapper{
        width: calc(100% - 20px);
      }
    }
    .trigger{
      position: absolute;
      right: -1px;
      top: 45px;
      padding: 0px;
      width: 20px;
      height: 30px;
      line-height: 30px;
      border: 1px solid rgb(235, 237, 240);
      border-right: 1px solid #fff;
      z-index: 1;
      font-size: 14px;
      border-radius:2px ;
    }
    .anticon-menu-unfold{
      right:-18px;
    }
    .ant-layout-has-sider{
      z-index: 999;
      position: relative;
      background: #fff;
    }
    .ant-layout-sider-collapsed{
      &.ant-layout-sider{
        padding:16px 0;
        border: 0;
      }
      .trigger{
      position: absolute;
      right: -20px;
      border: 1px solid rgb(235, 237, 240);
      border-left: 1px solid #fff;
      }
    }
  }
</style>
