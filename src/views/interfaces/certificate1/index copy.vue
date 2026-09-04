<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="container">
      <a-radio-button class="a-radio-button" @click="handleSubmit">登录</a-radio-button>
      <keep-alive>
        <iframe :src="certificate" frameborder="no" style="width: 100%; height: 100%" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"/>
      </keep-alive>
    </div>
  </a-spin>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  name: 'certificate',
  components: {},
  data() {
    return {
      certificate: `${process.env.VUE_APP_CERTIFICATE_URL + '/certificate-manufacture'}`,
      loading: true
    }
  },
  filters: {},
  created() {},
  computed: {},
  watch: {},
  mounted() {
    // this.login()
    this.loading = false
  },
  methods: {
    async login1() {
      this.loading = true
      const checkcode_url = `${process.env.VUE_APP_CERTIFICATE_URL + '/user/checkcode'}`
      const checkcode_response = (await axios.get(checkcode_url))
      console.log(checkcode_response.data.data.checkCodeImg)
      
      const parseCaptcha_url = `${process.env.VUE_APP_BASE_URL + '/common/parseCaptcha'}`
      const parseCaptcha_body = {
        pythonPath: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_PATH,
        pythonScript: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_SCRIPT,
        captchaUrl: 'data:image/jpg;base64,' + checkcode_response.data.data.checkCodeImg,
        captchaPath: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_PATH,
        captchaSave: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_SAVE
      }
      const parseCaptcha_response = (await axios.post(parseCaptcha_url, parseCaptcha_body))

      const login_url = `${process.env.VUE_APP_CERTIFICATE_URL + '/user/login'}`
      const login_formData = new FormData()
      login_formData.append('username', process.env.VUE_APP_CERTIFICATE_USERNAME)
      login_formData.append('password', process.env.VUE_APP_CERTIFICATE_PASSWORD)
      login_formData.append('checkCode', parseCaptcha_response.data.data.code)
      login_formData.append('checkCodeValue', checkcode_response.data.data.checkCodeValue)
      login_formData.append('createTime', checkcode_response.data.data.createTime)
      while (true) {
        const login_response = (await axios.post(login_url, login_formData))
        if (login_response.data.data && login_response.data.data.user) {
         Cookies.set('user', login_response.data.data.user)
         break
        }
      }

      const applications_url = `${process.env.VUE_APP_CERTIFICATE_URL + '/certificateApply/applications'}`
      const applications_formData = new FormData()
      applications_formData.append('clientInfoId', process.env.VUE_APP_CERTIFICATE_CLIENTINFOID)
      applications_formData.append('productId', process.env.VUE_APP_CERTIFICATE_PRODUCTID)
      applications_formData.append('productVersionId', process.env.VUE_APP_CERTIFICATE_PRODUCTVERSIONID)
      applications_formData.append('productTypeId', process.env.VUE_APP_CERTIFICATE_PRODUCTTYPEID)
      applications_formData.append('maxInstance', process.env.VUE_APP_CERTIFICATE_MAXINSTANCE)
      applications_formData.append('maxStorage', process.env.VUE_APP_CERTIFICATE_MAXSTORAGE)
      applications_formData.append('maxPerformance', process.env.VUE_APP_CERTIFICATE_MAXPERFORMANCE)
      applications_formData.append('applyTotal', process.env.VUE_APP_CERTIFICATE_APPLYTOTAL)
      applications_formData.append('technicalName', process.env.VUE_APP_CERTIFICATE_TECHNICALNAME)
      applications_formData.append('certificateType', process.env.VUE_APP_CERTIFICATE_CERTIFICATETYPE)
      applications_formData.append('modelType', process.env.VUE_APP_CERTIFICATE_MODELTYPE)
      applications_formData.append('authorizationDeadlineTime', process.env.VUE_APP_CERTIFICATE_AUTHORIZATIONDEADLINETIME)
      applications_formData.append('maintenanceWarnDate', process.env.VUE_APP_CERTIFICATE_MAINTENANCEWARNDATE)
      applications_formData.append('orderId', process.env.VUE_APP_CERTIFICATE_ORDERID)
      applications_formData.append('MachineCodeFile', process.env.VUE_APP_CERTIFICATE_MACHINECODEFILE)
      applications_formData.append('requestType', process.env.VUE_APP_CERTIFICATE_REQUESTTYPE)
      applications_formData.append('maxAbilityEquipment', process.env.VUE_APP_CERTIFICATE_MAXABILITYEQUIPMENT)
      applications_formData.append('externalEquipmentControl', process.env.VUE_APP_CERTIFICATE_EXTERNALEQUIPMENTCONTROL)
      applications_formData.append('abilityEquipmentType', process.env.VUE_APP_CERTIFICATE_ABILITYEQUIPMENTTYPE)
      applications_formData.append('machineCode', process.env.VUE_APP_CERTIFICATE_MACHINECODE)
      const applications_response = (await axios.post(applications_url, applications_formData, {
        headers: {
          'Authorization': Cookies.get('user')
        }
      }))
      if (applications_response.data.data && applications_response.data.data.code) {
        console.log(applications_response.data.data.code)
      }
      // try {
      // }catch (error) {
      //   console.error('Error fetching scene list:', error);
      // }finally {
      //   this.loading = false
      // }
      // axios
      //   .post(url, body)
      //   .then((response) => {
      //     // localStorage.setItem('userIP', item.name)
      //     // 设置默认过期时间（可选）
      //     // Vue.$cookies.config('expires', 30) // 以分钟为单位，默认是session（浏览器关闭时失效）
      //     // 更新token值
      //     // Vue.$cookies.set('token', response.data.data.token)
      //     console.log(response.data.data.token);
      //     Cookies.set('token', response.data.data.token)
      //     this.loading = false;
      //   })
      //   .catch((error) => {
      //     this.error = error.message || 'An error occurred while fetching data.'
      //     this.loading = false;
      //   })
    },
    async login2() {
      try {
        this.loading = true;
        let buildUrl = (endpoint) => `${process.env.VUE_APP_CERTIFICATE_URL}${endpoint}`;
        let checkcodeResponse = await axios.get(buildUrl('/user/checkcode'));
        console.log('Checkcode Response:', checkcodeResponse); // 添加日志
        let captchaImage = `data:image/jpg;base64,${checkcodeResponse.data.data.checkCodeImg}`;
        let parseCaptchaBody = {
          pythonPath: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_PATH,
          pythonScript: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_SCRIPT,
          captchaUrl: captchaImage,
          captchaPath: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_PATH,
          captchaSave: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_SAVE
        };
        let parseCaptchaResponse = await axios.post(`${process.env.VUE_APP_BASE_URL}/common/parseCaptcha`, parseCaptchaBody);
        console.log('Parse Captcha Response:', parseCaptchaResponse); // 添加日志

        // Step 2: Prepare login data
        let loginFormData = new FormData();
        loginFormData.append('username', process.env.VUE_APP_CERTIFICATE_USERNAME);
        loginFormData.append('password', process.env.VUE_APP_CERTIFICATE_PASSWORD);
        loginFormData.append('checkCode', parseCaptchaResponse.data.data.code);
        loginFormData.append('checkCodeValue', checkcodeResponse.data.data.checkCodeValue);
        loginFormData.append('createTime', checkcodeResponse.data.data.createTime);

        let loginResponse;
        const maxRetries = 10;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            // Step 3: Attempt login
            loginResponse = await axios.post(buildUrl('/user/login'), loginFormData);
            console.log('Login Response:', loginResponse); // 添加日志
            if (loginResponse.data.data && loginResponse.data.data.user) {
              console.log('Login successful:', this.certificate);
              this.certificate = 'http://172.23.1.230:8091/'
              break;
            } else {
              console.warn(`Login attempt ${attempt} failed. Response:`, loginResponse); // 修改日志
              if (attempt === maxRetries) {
                throw new Error('Login failed after maximum retries');
              }
              checkcodeResponse = await axios.get(buildUrl('/user/checkcode'));
              captchaImage = `data:image/jpg;base64,${checkcodeResponse.data.data.checkCodeImg}`;
              parseCaptchaBody = {
                pythonPath: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_PATH,
                pythonScript: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_SCRIPT,
                captchaUrl: captchaImage,
                captchaPath: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_PATH,
                captchaSave: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_SAVE
              };
              parseCaptchaResponse = await axios.post(`${process.env.VUE_APP_BASE_URL}/common/parseCaptcha`, parseCaptchaBody);
              loginFormData = new FormData();
              loginFormData.append('username', process.env.VUE_APP_CERTIFICATE_USERNAME);
              loginFormData.append('password', process.env.VUE_APP_CERTIFICATE_PASSWORD);
              loginFormData.append('checkCode', parseCaptchaResponse.data.data.code);
              loginFormData.append('checkCodeValue', checkcodeResponse.data.data.checkCodeValue);
              loginFormData.append('createTime', checkcodeResponse.data.data.createTime);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            }
          } catch (error) {
            console.error(`Login attempt ${attempt} failed with error:`, error); // 修改日志
            if (attempt === maxRetries) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
          }
        }

        // Step 4: Save user info in cookies
        // Cookies.set('user', loginResponse.data.data.user);
        // console.log('User Cookie Set:', Cookies.get('user'));

        const permissionList = [{ name: '我的申请'},{ name: '证书制作'},{ name: '客户信息'}]
        sessionStorage.setItem('permissionList', JSON.stringify(permissionList))
        sessionStorage.setItem('roleId', '5')
        sessionStorage.setItem('userId', '53')
        sessionStorage.setItem('roleName', 'liuzhi')
        sessionStorage.setItem('userName', '刘智')
        sessionStorage.setItem('token', loginResponse.data.data.user)

        const iframe = document.getElementById('certificate')
        iframe.onload = () => {
            iframe.contentWindow.postMessage({ type: 'SET_DATA', data: 'value' }, 'http://172.23.1.230:8091')
        }
        // 监听来自父页面的消息
        window.addEventListener('message', function(event) {
          console.log('Received message:', event);
            // 验证消息来源，以确保安全
            if (event.origin === 'http://172.23.1.230:8091') {
                console.warn('Message received from an unknown origin:', event.origin);
                return;
            }

            // 处理接收到的消息
            if (event.data.type === 'SET_DATA') {
                console.log('Received data:', event.data.data);

                // 你可以在这里处理数据，例如存入 sessionStorage
                sessionStorage.setItem('receivedData', event.data.data);
            }
        });

        // Step 5: Prepare application data
        const applicationsFormData = new FormData();
        [
          ['clientInfoId', process.env.VUE_APP_CERTIFICATE_CLIENTINFOID],
          ['productId', process.env.VUE_APP_CERTIFICATE_PRODUCTID],
          ['productVersionId', process.env.VUE_APP_CERTIFICATE_PRODUCTVERSIONID],
          ['productTypeId', process.env.VUE_APP_CERTIFICATE_PRODUCTTYPEID],
          ['maxInstance', process.env.VUE_APP_CERTIFICATE_MAXINSTANCE],
          ['maxStorage', process.env.VUE_APP_CERTIFICATE_MAXSTORAGE],
          ['maxPerformance', process.env.VUE_APP_CERTIFICATE_MAXPERFORMANCE],
          ['applyTotal', process.env.VUE_APP_CERTIFICATE_APPLYTOTAL],
          ['technicalName', process.env.VUE_APP_CERTIFICATE_TECHNICALNAME],
          ['certificateType', process.env.VUE_APP_CERTIFICATE_CERTIFICATETYPE],
          ['modelType', process.env.VUE_APP_CERTIFICATE_MODELTYPE],
          ['authorizationDeadlineTime', process.env.VUE_APP_CERTIFICATE_AUTHORIZATIONDEADLINETIME],
          ['maintenanceWarnDate', process.env.VUE_APP_CERTIFICATE_MAINTENANCEWARNDATE],
          ['orderId', process.env.VUE_APP_CERTIFICATE_ORDERID],
          ['MachineCodeFile', process.env.VUE_APP_CERTIFICATE_MACHINECODEFILE],
          ['requestType', process.env.VUE_APP_CERTIFICATE_REQUESTTYPE],
          ['maxAbilityEquipment', process.env.VUE_APP_CERTIFICATE_MAXABILITYEQUIPMENT],
          ['externalEquipmentControl', process.env.VUE_APP_CERTIFICATE_EXTERNALEQUIPMENTCONTROL],
          ['abilityEquipmentType', process.env.VUE_APP_CERTIFICATE_ABILITYEQUIPMENTTYPE],
          ['machineCode', process.env.VUE_APP_CERTIFICATE_MACHINECODE]
        ].forEach(([key, value]) => applicationsFormData.append(key, value))

        // Step 6: Submit application request
        // const authHeader = Cookies.get('user');
        const token = sessionStorage.getItem('token')
        console.log('Authorization Header:', token)
        const applicationsResponse = await axios.post(buildUrl('/certificateApply/applications'), applicationsFormData, {
          headers: { 'Authorization': token }
        })
        console.log('Applications Response:', applicationsResponse)

        if (applicationsResponse.data.data && applicationsResponse.data.data.code) {
          console.log(`Application response code: ${applicationsResponse.data.data.code}`)
        }
      } catch (error) {
        console.error('Error during login or application submission:', error)
      } finally {
        this.loading = false
      }
    },
    async handleSubmit () {
      try {
        this.loading = true
        let buildUrl = (endpoint) => `${process.env.VUE_APP_CERTIFICATE_URL}${endpoint}`
        let checkcodeResponse = await axios.get(buildUrl('/user/checkcode'))
        console.log('Checkcode Response:', checkcodeResponse); // 添加日志
        let captchaImage = `data:image/jpg;base64,${checkcodeResponse.data.data.checkCodeImg}`
        let parseCaptchaBody = {
          pythonPath: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_PATH,
          pythonScript: process.env.VUE_APP_PARSE_CAPTCHA_PYTHON_SCRIPT,
          captchaUrl: captchaImage,
          captchaPath: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_PATH,
          captchaSave: process.env.VUE_APP_PARSE_CAPTCHA_CAPTCHA_SAVE
        };
        let parseCaptchaResponse = await axios.post(`${process.env.VUE_APP_BASE_URL}/common/parseCaptcha`, parseCaptchaBody);
        console.log('Parse Captcha Response:', parseCaptchaResponse); // 添加日志

        document.getElementsByClassName('input-inner input-inline')[0].value = process.env.VUE_APP_CERTIFICATE_USERNAME
        document.getElementsByClassName('input-inner input-inline')[1].value = process.env.VUE_APP_CERTIFICATE_PASSWORD
        document.getElementsByClassName('input-inner input-inline')[2].value = parseCaptchaResponse.data.data.code
        document.getElementsByClassName('login-button normal-btn-color')[0].click()
      } catch (error) {
        console.error('Error during login or application submission:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh - 110px);
  width: 100%;
  position: relative;
}
</style>
