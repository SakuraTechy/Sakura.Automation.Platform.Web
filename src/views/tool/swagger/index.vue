<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div :style="'height:'+ height">
      <iframe :src="swagger" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
      <iframe :src="knife4" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
    </div>
  </a-spin>
</template>

<script>

export default {
  name: 'Swagger',
  components: {
  },
  data () {
    this.$notification.success({
      message: `${process.env.VUE_APP_BASE_URL + '/swagger-ui/index.html'}`
    })
    return {
      // src: process.env.VUE_APP_BASE_API + '/swagger-ui.html',
      swagger: process.env.VUE_APP_BASE_URL + '/swagger-ui/index.html',
      knife4: process.env.VUE_APP_BASE_URL + '/doc.html',
      height: document.documentElement.clientHeight - 120 + 'px;',
      loading: true
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
  },
  watch: {
  },
  mounted: function () {
    setTimeout(() => {
      this.loading = false
    }, 230)
    const that = this
    window.onresize = function temp () {
      that.height = document.documentElement.clientHeight - 94.5 + 'px;'
    }
  },
  methods: {
  }
}
</script>
