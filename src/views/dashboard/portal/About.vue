<!--
 * @Author: liuzhi liuzhi@sakura.com
 * @Date: 2022-07-18 15:31:14
 * @LastEditors: liuzhi liuzhi@sakura.com
 * @LastEditTime: 2022-07-18 15:36:51
 * @FilePath: Sakura.Test.Platform.Web\src\views\dashboard\portal\About.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="typical-home" ref="portaletDiv">
    <a-row :gutter="[24, 24]" class="module-list">
      <!-- 待办事项 -->
      <a-col :span="24">
        <div class="module-in module-in01 modlule-show" style="height:220px;">
          <a-page-header :ghost="false" title="平台简介">
            <template slot="extra">
              <a-icon type="more" />
            </template>
          </a-page-header>
          <p style="text-indent: 30px;">
            Sakura Automation Platform 是一站式持续自动化平台，涵盖APP自动化、WEB自动化、API接口自动化、性能自动化，并且支持分布式测试，全面兼容 Appium、Selenium、Rest Assured、JMeter 等主流开源框架，有效助力开发和测试团队充分利用云弹性进行高度可扩展的自动化测试，加速高质量的软件交付，推动测试整体效率的提升。
          </p>
          <p>
            当前版本：{{ version }}
          </p>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import config from '../../../../package.json'

export default {
  data() {
    return {}
  },
  computed: {
  },
  created() {
    this.version = config.version
  },
  methods: {
    goTarget(url) {
      window.open(url)
    },
    caseDisplay(url) {
      this.$message.success(
        '案例正在研发中，目前尚未实现，敬请期待！',
        3
      )
    }
  }
}
</script>
