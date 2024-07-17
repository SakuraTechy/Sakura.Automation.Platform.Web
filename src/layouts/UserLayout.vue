<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="loginbox">
        <div class="top">
          <div class="header">
            <a href="/">
              <!-- <img src="~@/assets/logo.svg" class="logo" alt="logo"> -->
              <!-- <img src=".././assets/images/login/sakura-log.svg" class="logo" alt="logo" /> -->
              <img src="../../public/ankki-log.png" class="logo" alt="logo" />
              <!-- <span class="title">Sakura Sharp</span><br> -->
              <div class="title">自动化测试平台</div>
              <div class="title" style="font-size:18px">{{ version }}</div>
            </a>
          </div>
        </div>
        <router-view />
      </div>

      <div class="footer">
        <div class="links">
          <a href="https://github.com/fuzui/AiDex-Antdv" target="_blank">帮助</a>
          <a href="https://github.com/fuzui/AiDex-Antdv" target="_blank">隐私</a>
          <a href="https://github.com/fuzui/AiDex-Antdv" target="_blank">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2024 <a target="_blank"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'
import config from '../../package.json'

export default {
  name: 'UserLayout',
  mixins: [deviceMixin],
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  },
  created () {
    this.version = config.version
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      width: 100%;
      min-height: 100%;
      background: #e2effc url(~@/assets/wrapper.jpg) no-repeat center top;
      background-size: 100%;
      vertical-align: middle;
      display: flex;

      a {
        text-decoration: none;
      }
      .loginbox{
        width: 800px;
        height:500px;
        margin:auto;
        background: #ffffff;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
      }
      .top {
        text-align: center;
        width: 355px;
        height: 500px;
        background: url(~@/assets/login-bg.png) no-repeat center top;
        float:left;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }
          .logo {
            height: 90px;
            width: 100%;
            vertical-align: top;
            margin-top: 160px;
            margin-bottom: 0px;
            border-style: none;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            background-image: linear-gradient(135deg, #ffc626, #32bee7);
            background-clip:text;
            -webkit-background-clip:text;
            color: transparent;
            font-family: cursive;
            opacity: 0.8;
            text-shadow: -1px -1px 1px #deefff, 0 -1px 1px #152c48, 1px -1px 1px #0836b9, 1px 0 1px #013a4a, 1px 1px 1px #134a5a, 0 1px 1px #32bee7, -1px 1px 1px #32bee7, -1px 0 1px #75cf13, 0 0 4px #56a7d7;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: #e2effc url(~@/assets/wrapper.jpg) no-repeat center top;
    background-size: 100%;
    vertical-align: middle;
    display: flex;

    a {
      text-decoration: none;
    }
    .loginbox {
      width: 800px;
      height: 500px;
      margin: auto;
      background: #ffffff;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
    }
    .top {
      text-align: center;
      width: 355px;
      height: 500px;
      background: url(~@/assets/login-bg.png) no-repeat center top;
      float: left;

      .header {
        height: 44px;
        line-height: 44px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 90px;
          width: 100%;
          vertical-align: top;
          margin-top: 160px;
          margin-bottom: 0px;
          border-style: none;
        }

        .title {
          font-size: 22px;
          font-weight: 600;
          background-image: linear-gradient(135deg, #ffc626, #32bee7);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          font-family: auto;
          opacity: 0.8;
          letter-spacing: 1.5px;
          text-shadow: -1px -1px 1px #deefff, 0 -1px 1px #152c48, 1px -1px 1px #0836b9, 1px 0 1px #013a4a,
            1px 1px 1px #134a5a, 0 1px 1px #32bee7, -1px 1px 1px #32bee7, -1px 0 1px #75cf13, 0 0 4px #56a7d7;
        }
      }
      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      width: 445px;
      height: 500px;
      margin: 0 auto;
      float: left;
      display: block;
      padding: 0 30px;
      position: relative;
    }
    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>
