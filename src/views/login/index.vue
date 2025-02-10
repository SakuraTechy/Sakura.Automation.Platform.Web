<template>
  <div class="login pc">
    <!-- <h3 class="login-logo">
      <img v-if="logo" :src="logo" alt="logo" />
      <img v-else src="/logo.svg" alt="logo" />
      <span>{{ title }}</span>
    </h3> -->

    <a-row align="stretch" class="login-box">
      <a-col :xs="0" :sm="10" :md="11">
        <div class="login-left">
          <!-- <img class="login-left__img" src="@/assets/images/banner.png" alt="banner" /> -->
          <img v-if="logo" class="login-left__log" :src="logo" alt="logo" />
          <img v-else class="login-left__log" src="/logo.svg" alt="logo" />
          <div class="login-left__title">SakurA 自动化平台</div>
          <div class="login-left__version">{{ version }}</div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="10" :md="13">
        <div class="login-right">
          <a-tabs v-if="!authStore.isEmailLogin && !authStore.isForgotPassword" v-model:active-key="authStore.activeKey" class="login-right__form" @change="authStore.onTabChange">
            <a-tab-pane v-if="!authStore.isRegister && !authStore.isEmailLogin && !authStore.isForgotPassword" key="1" title="账号登录">
              <Account v-if="authStore.activeKey === '1'" :is-register="authStore.isRegister" />
            </a-tab-pane>
            <a-tab-pane v-if="!authStore.isRegister && !authStore.isEmailLogin && !authStore.isForgotPassword" key="2" title="手机号登录">
              <Phone v-if="authStore.activeKey === '2'" :is-register="authStore.isRegister" />
            </a-tab-pane>
            <a-tab-pane v-if="authStore.isRegister && !authStore.isEmailLogin && !authStore.isForgotPassword" key="3" title="账号注册">
              <Account v-if="authStore.activeKey === '3'" :is-register="authStore.isRegister" />
            </a-tab-pane>
            <a-tab-pane v-if="authStore.isRegister && !authStore.isEmailLogin && !authStore.isForgotPassword" key="4" title="手机号注册">
              <Phone v-if="authStore.activeKey === '4'" :is-register="authStore.isRegister" />
            </a-tab-pane>
          </a-tabs>
          <h3 v-if="authStore.isEmailLogin" class="login-right__title">邮箱登录</h3>
          <EmailLogin v-if="authStore.isEmailLogin" />
          <h3 v-if="authStore.isForgotPassword" class="login-right__title">找回密码</h3>
          <Password v-if="authStore.isForgotPassword" />
          <div class="login-right__oauth">
            <div v-show="!authStore.isRegister">
              <a-divider orientation="center">其他登录方式</a-divider>
              <div class="list">
                <div v-if="authStore.isEmailLogin || authStore.isForgotPassword" class="mode item" @click="authStore.toggleMode"><icon-user /> 账号/手机号登录</div>
                <div v-else class="mode item" @click="authStore.toggleEmailLoginMode"><icon-email /> 邮箱登录 </div>
                <a v-if="!authStore.isForgotPassword" class="item" title="使用 Gitee 账号登录" @click="onOauth('gitee')">
                  <GiSvgIcon name="gitee" :size="24" />
                </a>
                <a v-if="!authStore.isForgotPassword" class="item" title="使用 GitHub 账号登录" @click="onOauth('github')">
                  <GiSvgIcon name="github" :size="24" />
                </a>
              </div>
            </div>
            <div v-if="!authStore.isForgotPassword" class="register">
              <span style="line-height: 1.5715;">{{ !authStore.isRegister ? '没有账号？' : '已有账号？' }}</span>
              <a-link @click="authStore.toggleRegisterMode">{{ !authStore.isRegister ? '去注册' : '立即登录' }}</a-link>
            </div>
          </div>
        </div>
      </a-col>
      <GiSvgIcon name="qr-code" color="rgb(var(--primary-6))" class="login-right__qrcode" :size="24" />
    </a-row>

    <div v-if="isDesktop" class="footer">
      <div class="beian">
        <div class="below text">
          {{ appStore.getCopyright() }}{{ appStore.getForRecord() ? ` ·${appStore.getForRecord()}` : '' }}
        </div>
      </div>
    </div>

    <GiThemeBtn class="theme-btn" />
    <Background />
  </div>
  <div class="login h5">
    <div class="login-logo">
      <img v-if="logo" :src="logo" alt="logo" />
      <img v-else src="/logo.svg" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <a-row align="stretch" class="login-box">
      <a-col :xs="24" :sm="12" :md="11">
        <div class="login-right">
          <h3 v-if="isEmailLogin" class="login-right__title">邮箱登录</h3>
          <EmailLogin v-show="isEmailLogin" />
          <a-tabs v-show="!isEmailLogin" class="login-right__form">
            <a-tab-pane key="1" title="账号登录">
              <Account />
            </a-tab-pane>
            <a-tab-pane key="2" title="手机号登录">
              <Phone />
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <div class="login-right__oauth">
      <a-divider orientation="center">其他登录方式</a-divider>
      <div class="list">
        <div v-if="isEmailLogin" class="mode item" @click="toggleLoginMode"><icon-user /> 账号/手机号登录</div>
        <div v-else class="mode item" @click="toggleLoginMode"><icon-email /> 邮箱登录</div>
        <a class="item" title="使用 Gitee 账号登录" @click="onOauth('gitee')">
          <GiSvgIcon name="gitee" :size="24" />
        </a>
        <a class="item" title="使用 GitHub 账号登录" @click="onOauth('github')">
          <GiSvgIcon name="github" :size="24" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from '../../../package.json'
import Password from './components/password/index.vue'
import Background from './components/background/index.vue'
import Account from './components/account/index.vue'
import Phone from './components/phone/index.vue'
import EmailLogin from './components/email/index.vue'
import { socialAuth } from '@/apis/auth'
import { useAppStore } from '@/stores'
import { useDevice } from '@/hooks'
import { useAuthStore } from '@/stores/modules/auth'

defineOptions({
  name: 'Login',
  // created() {
  //   this.version = config.version
  // }
})

const authStore = useAuthStore()

const { isDesktop } = useDevice()
const appStore = useAppStore()
const title = computed(() => appStore.getTitle())
const logo = computed(() => appStore.getLogo())
const version = ref(config.version)
const isRegister = ref(false)
const isEmailLogin = ref(false)
const isForgotPassword = ref(false)
const activeKey = ref('1')

// 监听切换事件，更新 activeKey
const onTabChange = (key) => {
  activeKey.value = key
}
const keyMap = {
  1: '3',
  2: '4',
  3: '1',
  4: '2',
}
// 切换注册模式
const toggleRegisterMode = () => {
  isRegister.value = !isRegister.value
  isEmailLogin.value = false
  activeKey.value = keyMap[activeKey.value]
}
// 切换登录模式
const toggleLoginMode = () => {
  isRegister.value = !isRegister.value
  isEmailLogin.value = false
  activeKey.value = keyMap[activeKey.value]
}
// 切换邮箱登录模式
const toggleEmailLoginMode = () => {
  isEmailLogin.value = !isEmailLogin.value
}
// 切换找回密码模式
const toggleForgotPasswordMode = () => {
  isForgotPassword.value = !isForgotPassword.value
}
// 提供方法
provide('toggleForgotPasswordMode', toggleForgotPasswordMode)

// 第三方登录授权
const onOauth = async (source: string) => {
  const { data } = await socialAuth(source)
  window.location.href = data.authorizeUrl
}

onMounted(() => {
  // console.log(authStore.activeKey)
})
</script>

<style lang="scss" scoped>
@media screen and (max-width: 570px) {
  .pc {
    display: none !important;
    background-color: white !important;
  }

  .login {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    background-color: var(--color-bg-5);
    color: #121314;

    &-logo {
      width: 100%;
      height: 104px;
      font-weight: 700;
      font-size: 20px;
      line-height: 32px;
      display: flex;
      padding: 0 10px;
      align-items: center;
      justify-content: start;
      background-image: url('/src/assets/images/login_h5.jpg');
      background-size: 100% 100%;
      box-sizing: border-box;

      img {
        width: 60px;
        height: 60px;
        margin-right: -5px;
      }
    }

    &-box {
      width: 100%;
      display: flex;
      z-index: 999;
    }
  }

  .login-right {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px 30px 0;
    box-sizing: border-box;

    &__title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 20px;
      line-height: 32px;
      margin-bottom: 30px;
    }

    &__form {
      :deep(.arco-tabs-nav-tab) {
        display: flex;
        justify-content: start;
        align-items: center;
      }

      :deep(.arco-tabs-tab) {
        color: var(--color-text-2);
        margin: 0 20px 0 0;
      }

      :deep(.arco-tabs-tab-title) {
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
      }

      :deep(.arco-tabs-content) {
        margin-top: 10px;
      }

      :deep(.arco-tabs-tab-active),
      :deep(.arco-tabs-tab-title:hover) {
        color: rgb(var(--arcoblue-6));
      }

      :deep(.arco-tabs-nav::before) {
        display: none;
      }

      :deep(.arco-tabs-tab-title:before) {
        display: none;
      }
    }

    &__oauth {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      padding-bottom: 20px;

      // margin-top: auto;
      // margin-bottom: 20px;
      :deep(.arco-divider-text) {
        color: var(--color-text-4);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }

      .list {
        align-items: center;
        display: flex;
        justify-content: center;
        width: 100%;

        .item {
          margin-right: 15px;
        }

        .mode {
          color: var(--color-text-2);
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          padding: 6px 10px;
          align-items: center;
          border: 1px solid var(--color-border-3);
          border-radius: 32px;
          box-sizing: border-box;
          display: flex;
          height: 32px;
          justify-content: center;
          cursor: pointer;

          .icon {
            width: 21px;
            height: 20px;
          }
        }

        .mode svg {
          font-size: 16px;
          margin-right: 10px;
        }

        .mode:hover,
        .mode svg:hover {
          background: rgba(var(--primary-6), 0.05);
          border: 1px solid rgb(var(--primary-3));
          color: rgb(var(--arcoblue-6));
        }
      }

      .register {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .theme-btn {
    position: fixed;
    top: 20px;
    right: 30px;
    z-index: 9999;
  }

  .footer {
    align-items: center;
    box-sizing: border-box;
    position: absolute;
    bottom: 10px;
    z-index: 999;

    .beian {
      .text {
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.2px;
        line-height: 20px;
        text-align: center;
      }

      .below {
        align-items: center;
        display: flex;
      }
    }
  }
}

@media screen and (min-width: 571px) {
  .h5 {
    display: none !important;
  }

  .login {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-bg-5);

    &-logo {
      position: fixed;
      top: 10px;
      left: 20px;
      z-index: 9999;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 20px;
      line-height: 32px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 60px;
        height: 60px;
        margin-right: -5px;
      }
    }

    &-box {
      width: 86%;
      max-width: 820px;
      height: 510px;
      z-index: 999;
      box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      display: flex;
      flex-wrap: nowrap;
    }
  }

  .login-left {
    width: 100%;
    height: 100%;
    border-radius: 10px 0 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    /* 子项之间的垂直间距 */
    position: relative;
    overflow: hidden;
    // background: linear-gradient(60deg, rgb(var(--primary-6)), rgb(var(--primary-3)));
    background: url(@/assets/images/left-bg.png) no-repeat center top;
    background-size: 110%;

    &__img {
      width: 100%;
      position: absolute;
      bottom: 0;
      right: 0;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      transition: all 0.3s;
      object-fit: cover;
    }

    &__log {
      width: 100px;
      height: 100px;
    }

    &__title {
      font-size: 22px;
      font-weight: 600;
      background-image: linear-gradient(135deg, #ffc626, #32bee7);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      font-family: auto;
      opacity: 0.8;
      letter-spacing: 1.5px;
      text-shadow: -1px -1px 1px #deefff, 0 -1px 1px #152c48, 1px -1px 1px #0836b9, 1px 0 1px #013a4a, 1px 1px 1px #134a5a, 0 1px 1px #32bee7, -1px 1px 1px #32bee7, -1px 0 1px #75cf13, 0 0 4px #56a7d7;
    }

    &__version {
      font-size: 18px;
      font-weight: 600;
      background-image: linear-gradient(135deg, #ffc626, #32bee7);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      font-family: auto;
      opacity: 0.8;
      letter-spacing: 1.5px;
      text-shadow: -1px -1px 1px #deefff, 0 -1px 1px #152c48, 1px -1px 1px #0836b9, 1px 0 1px #013a4a, 1px 1px 1px #134a5a, 0 1px 1px #32bee7, -1px 1px 1px #32bee7, -1px 0 1px #75cf13, 0 0 4px #56a7d7;
    }
  }

  .login-right {
    width: 100%;
    height: 100%;
    border-radius: 0 10px 10px 0;
    background: var(--color-bg-1);
    display: flex;
    flex-direction: column;
    padding: 20px 30px 0;
    box-sizing: border-box;

    &__qrcode {
      margin-top: 8px;
      margin-left: -30px;
    }

    &__title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 22px;
      line-height: 32px;
      margin-bottom: 40px;
    }

    &__form {
      :deep(.arco-tabs-nav-tab) {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      :deep(.arco-tabs-tab) {
        color: var(--color-text-2);
      }

      :deep(.arco-tabs-tab-title) {
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
      }

      :deep(.arco-tabs-content) {
        margin-top: 10px;
      }

      :deep(.arco-tabs-tab-active),
      :deep(.arco-tabs-tab-title:hover) {
        color: rgb(var(--arcoblue-6));
      }

      :deep(.arco-tabs-nav::before) {
        display: none;
      }

      :deep(.arco-tabs-tab-title:before) {
        display: none;
      }
    }

    &__oauth {
      margin-top: auto;
      margin-bottom: 15px;

      :deep(.arco-divider-text) {
        color: var(--color-text-4);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }

      .list {
        align-items: center;
        display: flex;
        justify-content: center;
        width: 100%;

        .item {
          margin-right: 15px;
        }

        .mode {
          color: var(--color-text-2);
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          padding: 6px 10px;
          align-items: center;
          border: 1px solid var(--color-border-3);
          border-radius: 32px;
          box-sizing: border-box;
          display: flex;
          height: 32px;
          justify-content: center;
          cursor: pointer;

          .icon {
            width: 21px;
            height: 20px;
          }
        }

        .mode svg {
          font-size: 16px;
          margin-right: 10px;
        }

        .mode:hover,
        .mode svg:hover {
          background: rgba(var(--primary-6), 0.05);
          border: 1px solid rgb(var(--primary-3));
          color: rgb(var(--arcoblue-6));
        }
      }

      .register {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .theme-btn {
    position: fixed;
    top: 20px;
    right: 30px;
    z-index: 9999;
  }

  .footer {
    align-items: center;
    box-sizing: border-box;
    position: absolute;
    bottom: 10px;
    z-index: 999;

    .beian {
      .text {
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.2px;
        line-height: 20px;
        text-align: center;
      }

      .below {
        align-items: center;
        display: flex;
      }
    }
  }
}
</style>
