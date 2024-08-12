<template>
  <div class="main">
    <a-icon class="QRcodeIcon" :component="allIcon.QRcodeIcon" />
    <a-form-model class="user-layout-login" id="formLogin" ref="form" :model="form" :rules="rules">
      <a-radio-group
        class="a-radio-group"
        id="a_radio_group"
        :value="name"
        size="large"
        :style="{ '--count': count }"
        @change="handleNameChange"
      >
        <a-radio-button class="a-radio-button" value="登录">登录</a-radio-button>
        <a-radio-button class="a-radio-button" value="注册">注册</a-radio-button>
        <a-radio-button v-if="type == '3'" class="a-radio-button" value="修改密码">修改密码</a-radio-button>
      </a-radio-group>
      <!-- <span :class="[type=='1'?'btn btn_active':'btn']" @click="handleTypeChange('1')">登录</span>
      <span :class="[type=='2'?'btn btn_active':'btn']" @click="handleTypeChange('2')">注册</span>
      <span :class="[type=='3'?'btn btn_active':'btn']" @click="handleTypeChange('3')">修改密码</span> -->
      <!-- <a-page-header name="用户登录" /> -->
      <a-form-model-item prop="userName">
        <a-input v-model="form.userName" size="large" placeholder="中文账号" allow-clear>
          <a-icon slot="prefix" type="user" :style="{ color: 'inherit' }" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="passWord">
        <a-input-password
          v-model="form.passWord"
          size="large"
          :placeholder="type == '3' ? '新密码' : '密码'"
          allow-clear
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'inherit' }" />
        </a-input-password>
      </a-form-model-item>
      <a-row :gutter="16" v-if="captchaOnOff">
        <a-col class="gutter-row" :span="16">
          <a-form-model-item prop="code">
            <a-input v-model="form.code" size="large" type="text" autocomplete="off" placeholder="验证码" allow-clear>
              <a-icon slot="prefix" type="security-scan" :style="{ color: 'inherit' }" />
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <!-- <img class="getCaptcha" src="~@/assets/logo.png" @click="getCode"> -->
          <!-- <img class="getCaptcha" :src="codeUrl" @click="getCode"> -->
          <!-- <img :data-src="codeUrl" @click="getCode"> -->
          <!-- <img v-lazy="codeUrl" @click="getCode" /> -->
          <img v-lazy="codeUrl" :src="codeUrl" @click="getCode" />
        </a-col>
      </a-row>
      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">记住密码</a-checkbox>
        <!-- <div style="float: right;line-height: 30px;">还没有账号？
          <a-button type="link" >立即注册</a-button>
          <a-button type="link">忘记密码</a-button>
        </div> -->
        <a-button style="float: right" type="link" @click="handleForgetPasswordChange">已有帐号，忘记密码？</a-button>
      </a-form-item>
      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="logining"
          :disabled="logining"
          @click="handleSubmit"
          >{{ name }}</a-button
        >
      </a-form-item>
      <a-space>
        <div style="margin-top: -10px">其它登录方式</div>
        <div class="icons-list">
          <a-icon class="dingtalk" :component="allIcon.dingtalkIcon" />
          <a-icon class="WeChat" :component="allIcon.WeChatIcon" />
          <a-icon class="Alipay" :component="allIcon.AlipayIcon" />
          <a-icon class="Sina" :component="allIcon.SinaIcon" />
          <!-- <a-button type="link" @click="applyLicense">授权申请</a-button> -->
        </div>
      </a-space>
    </a-form-model>
  </div>
</template>

<script>
// import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getCaptchaImage } from '@/api/login'
import { getUserProfile } from '@/api/system/user'
import allIcon from '@/core/icons'
import pinyin from 'js-pinyin'

export default {
  name: 'Login',
  components: {
    allIcon,
  },
  data() {
    return {
      name: '登录',
      type: '1',
      count: '2',
      allIcon,
      codeUrl: '',
      // codeUrl: {
      //   src: ''
      //   // error: require('../../assets/loading.gif'),
      //   // loading: require('../../assets/loading.gif')
      // },
      form: {
        userName: '',
        nickName: '',
        passWord: '',
        code: undefined,
        uuid: '',
      },
      // 验证码开关
      captchaOnOff: true,
      rules: {
        userName: [
          { required: true, message: '账号为必填项', trigger: 'change' },
          { min: 1, max: 10, message: '请填写10位以内的中文账号', trigger: 'blur' },
          { pattern: RegExp('^[\u4e00-\u9fa5]*$'), message: '用户名必须为中文汉字', trigger: 'blur' },
          // { pattern: RegExp('^[\u4e00-\u9fa5]*[A-Za-z0-9]*$'), message: '用户名必须为汉字,字母或者数字', trigger: 'blur' }
        ],
        passWord: [{ required: true, message: '密码为必填项', trigger: 'change' }],
        code: [{ required: true, message: '验证码为必填项', trigger: 'change' }],
      },
      logining: false,
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    handleNameChange(e) {
      this.name = e.target.value
      this.type = e
      this.count = '2'
      this.resetFields()
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    handleTypeChange(e) {
      this.type = e
      this.$notification.success({
        message: `${this.type}`,
      })
    },
    getCode() {
      getCaptchaImage().then((res) => {
        this.captchaOnOff = res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff
        if (this.captchaOnOff) {
          this.codeUrl = res.data.img
          this.form.uuid = res.data.uuid
        }
      })
    },
    handleForgetPasswordChange() {
      this.name = '修改密码'
      this.type = '3'
      this.count = '3'
      // this.count = document.getElementById('addd').getElementsByTagName('label').length
      // this.count = document.getElementsByClassName('a-radio-button').length
      // alert(this.count)
    },
    applyLicense() {
      window.open('/applyLicense', '_blank')
    },
    ...mapActions(['Register', 'Login', 'ForgotPassword']),
    handleSubmit() {
      let pinyin = require('js-pinyin')
      pinyin.setOptions({ checkPolyphone: false, charCase: 1 })
      // console.log(pinyin.getFullChars('管理员'));

      // 关闭登录过期的提示框
      this.$notification.close('loginExpireTip')
      this.logining = true
      this.$refs.form.validate((valid) => {
        if (this.name === '注册') {
          this.form['name'] = this.form.userName
          this.form.nickName = pinyin.getFullChars(this.form.userName)
          this.form['email'] = ''
          this.form['phoneNumber'] = ''
          this.form['no'] = '000000'
          this.form['sex'] = '0'
          this.form['deptId'] = '100'
          this.form['status'] = '0'
          this.form['userType'] = '1'
          this.form['postIds'] = ['9529010c93864105afd36719e0dfed8d']
          this.form['roleIds'] = ['c6676868d24e43098e4724014a096800']
        }
        console.log(this.form)
        if (valid) {
          this.name === '登录'
            ? this.Login(this.form)
                .then((res) => this.successMessage(res))
                .catch((err) => this.requestFailed(err))
                .finally(() => {
                  this.logining = false
                })
            : this.name === '注册'
            ? this.Register(this.form)
                .then((res) => {
                  this.$delete(this.form, 'name')
                  this.$delete(this.form, 'nickName')
                  this.$delete(this.form, 'email')
                  this.$delete(this.form, 'phoneNumber')
                  this.$delete(this.form, 'no')
                  this.$delete(this.form, 'sex')
                  this.$delete(this.form, 'deptId')
                  this.$delete(this.form, 'status')
                  this.$delete(this.form, 'userType')
                  this.$delete(this.form, 'postIds')
                  this.$delete(this.form, 'roleIds')
                  this.Login(this.form)
                    .then((res) => this.successMessage(res))
                    .catch((err) => this.requestFailed(err))
                    .finally(() => {
                      this.logining = false
                    })
                })
                .catch((err) => this.requestFailed(err))
                .finally(() => {
                  this.logining = false
                })
            : this.ForgotPassword(this.form)
                .then((res) => this.successMessage(res))
                .catch((err) => this.requestFailed(err))
                .finally(() => {
                  this.logining = false
                })
        } else {
          setTimeout(() => {
            this.logining = false
          }, 600)
        }
      })
    },
    successMessage(res) {
      if (this.name !== '修改密码') {
        localStorage.setItem('userName', this.form.userName)
        localStorage.setItem('nickName', pinyin.getFullChars(this.form.userName))
        this.$router.push({ path: '/' })
        getUserProfile().then((response) => {
          localStorage.setItem('userEmail', response.data.user.email)
        })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: `${this.name}成功`,
            description: `${this.form.userName} ${timeFix()}，欢迎使用`,
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.$notification.success({
            message: `${this.name}成功`,
            description: `请使用新密码，重新登录`,
          })
          this.name = '登录'
          this.type = '1'
          this.count = '2'
          this.form.passWord = ''
          this.form.code = ''
          this.getCode()
        }, 1000)
      }
    },
    loginSuccess(res) {
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        })
      }, 1000)
    },
    requestFailed(err) {
      // this.isLoginError = true
      // this.loginErrorInfo = err
      this.form.code = undefined
      this.getCode()
      this.$message.error(err)
    },
    handleCloseLoginError() {
      // this.isLoginError = false
      // this.loginErrorInfo = ''
    },
  },
  mounted() {
    console.info(this)
  },
}
</script>

<style lang="less" scoped>
.QRcodeIcon {
  position: absolute;
  right: 0;
  font-size: 32px;
  color: #1890ff;
  margin-top: 5px;
  margin-right: 5px;
}
.ant-space-align-center {
  color: #8f959e;
  line-height: 30px;
  height: 30px;
}
.user-layout-login {
  label {
    font-size: 14px;
  }
  .a-radio-group {
    width: 100%;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 30px;
  }
  .a-radio-button {
    width: calc(100% / var(--count));
  }
  // .a-radio-button1:hover{
  //   color: rgba(0, 0, 0, 0.65);
  //   border-color: #ff0000;
  //   box-shadow: -1px 0 0 0 #ff0000;
  // }
  // .a-radio-button1:first-child{
  //   color: rgba(0, 0, 0, 0.65);
  //   border-color: #ff0000;
  //   box-shadow: -1px 0 0 0 #ff0000;
  // }
  .btn {
    display: inline-block;
    width: calc(100% / 3);
    line-height: 26px;
    font-size: 14px;
    text-align: center;
    padding: 6px;
    border: 1px solid #e3e7ed;
    cursor: pointer;
    margin-top: 50px;
    margin-bottom: 30px;
  }
  .btn:nth-of-type(1) {
    border-radius: 4px 0 0 4px;
  }
  .btn:nth-of-type(3) {
    border-radius: 0 4px 4px 0;
  }
  .btn_active {
    color: @primary-color;
    border: 1px solid #40a9ff;
  }
  .ant-page-header {
    padding: 60px 0 45px 0;
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }
  img[lazy='loading'] {
    width: 100%;
    height: 20px;
    margin-top: 10px;
  }
  img[lazy='error'] {
    width: 100%;
    height: 20px;
    margin-top: 10px;
  }
  img[lazy='loaded'] {
    width: 100%;
    height: 40px;
  }
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    border-radius: 4px;
  }
  .icons-list {
    .anticon {
      font-size: 30px;
      width: 40px;
    }
    .dingtalk {
      color: #0089ff;
    }
    .WeChat {
      color: #51c332;
    }
    .Alipay {
      color: #06b4fd;
    }
    .Sina {
      color: #d81e06;
    }
  }
}
</style>
