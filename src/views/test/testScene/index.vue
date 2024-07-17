<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="container">
      <keep-alive>
        <iframe :src="agiletc" frameborder="no" style="width: 100%; height: 100%" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"/>
      </keep-alive>
    </div>
  </a-spin>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import pinyin from 'js-pinyin'

export default {
  name: 'testCase',
  components: {},
  data() {
    // this.$notification.success({
    //   message: `${process.env.VUE_APP_BASE_URL + '/swagger-ui/index.html'}`,
    // })
    return {
      agiletc: `${process.env.VUE_APP_AgileTC_WEB_URL + ''}`,
      loading: false,
    }
  },
  filters: {},
  created() {},
  computed: {},
  watch: {},
  mounted() {
    // this.login()
  },
  methods: {
    async login() {
      let pinyin = require('js-pinyin');
      pinyin.setOptions({checkPolyphone: false, charCase: 1});
      this.loading = true;
      const url = `${process.env.VUE_APP_AgileTC_WEB_URL + '/api/user/login'}`
      const body = {
        username: localStorage.getItem('userName'),
        // account: pinyin.getFullChars(localStorage.getItem('userName')),
        password: '111111',
        isLogin: true,
      }
      try {
        const response = (await axios.post(url, body));
        console.log(response);
        // if (response.data && response.data.token) {
        //   // 设置默认过期时间（可选）
        //   // Vue.$cookies.config('expires', 30) // 以分钟为单位，默认是session（浏览器关闭时失效）
        //   // 更新token值
        //   // Vue.$cookies.set('token', response.data.token)

        //   // 更新token值，并可以指定过期时间（比如2小时后过期）
        //   // Cookies.set('token', 'new_token_value', { expires: 2 }) // 这里expires是一个表示从现在开始多少小时后过期的对象
        //   // 如果不需要指定过期时间，则直接设置即可
        //   // console.log(response.data.token);
        //   Cookies.set('token', response.data.token)
        // }else{
        //   this.$message.error(response.et+'，请重新登录！')
        // }
      }catch (error) {
        console.error('Error fetching scene list:', error);
      }finally {
        this.loading = false
      }
      // axios
      //   .post(url, body)
      //   .then((response) => {
      //     // localStorage.setItem('userIP', item.name)
      //     // 设置默认过期时间（可选）
      //     // Vue.$cookies.config('expires', 30) // 以分钟为单位，默认是session（浏览器关闭时失效）
      //     // 更新token值
      //     // Vue.$cookies.set('token', response.data.token)
      //     console.log(response.data.token);
      //     Cookies.set('token', response.data.token)
      //     this.loading = false;
      //   })
      //   .catch((error) => {
      //     this.error = error.message || 'An error occurred while fetching data.'
      //     this.loading = false;
      //   })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh - 110px);
  width: 100%;
  position: relative;
}
</style>
