import request from '@/utils/request'

const userApi = {
  CaptchaImage: '/common/captchaImage',
  Register: '/register',
  Login: '/login',
  ForgotPassword: '/forgotPassword',
  Logout: '/logout',
  UserInfo: '/home/getInfo',
  SendSms: '/system/sysSms/sendSms'
}

// 获取验证码
export function getCaptchaImage () {
  return request({
    url: userApi.CaptchaImage,
    method: 'get',
    timeout: 20000
  })
}

// 获取手机验证码
export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

// 注册方法
export function register (parameter) {
  return request({
    url: userApi.Register,
    headers: {
      isToken: false
    },
    method: 'post',
    data: parameter
  })
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

/**
 * @name: 忘记密码
 * @param parameter
 * @return {}
 */
export function forgotPassword (parameter) {
  return request({
    url: userApi.ForgotPassword,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function loginBySms (parameter) {
  return request({
    url: '/system/sysSms/loginBySms',
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
