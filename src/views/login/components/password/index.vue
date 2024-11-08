<template>
  <a-form ref="formRef" :model="form" :rules="rules" :label-col-style="{ display: 'none' }"
    :wrapper-col-style="{ flex: 1 }" size="large" @submit="handleLogin">
    <a-form-item field="username" hide-label>
      <a-input ref="inputRefd" v-model="form.username" placeholder="请输入用户名（帐号，手机号，邮箱）" allow-clear @input="validatePhone">
        <template #prefix>
          <icon-user />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="password" hide-label>
      <a-input-password v-model="form.password" placeholder="请输入新密码" :max-length="20" allow-clear>
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item field="email" hide-label>
      <a-input v-model="form.email" placeholder="请输入邮箱" allow-clear @input="validatePhone">
        <template #prefix>
          <icon-email />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="captcha" hide-label>
      <a-input v-model="form.captcha" placeholder="请输入验证码" :max-length="6" allow-clear style="flex: 1 1">
        <template #prefix>
          <icon-safe />
        </template>
      </a-input>
      <a-button class="captcha-btn" :loading="captchaLoading" :disabled="!captchaDisable" size="large"
        @click="onCaptcha({})">
        {{ captchaBtnName }}
      </a-button>
    </a-form-item>
    <a-form-item>
      <a-space direction="vertical" fill class="w-full">
        <a-button class="btn" type="primary" :loading="loading" html-type="submit" size="large" long>立 即 修 改</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { type BehaviorCaptchaReq, getEmailCaptcha } from '@/apis'
import { useTabsStore, useUserStore } from '@/stores'
import * as Regexp from '@/utils/regexp'
import { updatePassword } from '@/apis/system'
import { encryptByRsa } from '@/utils/encrypt'
import { useAuthStore } from '@/stores/modules/auth'

const authStore = useAuthStore()
const inputRefd = ref<HTMLInputElement | null>(null)

const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: '',
  email: '',
  captcha: ''
})

const rules: FormInstance['rules'] = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请设置新密码' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { match: Regexp.Email, message: '请输入正确的邮箱' }
  ],
  captcha: [{ required: true, message: '请输入验证码' }]
}

const captchaTimer = ref()
const captchaTime = ref(60)
const captchaBtnName = ref('获取验证码')
const captchaDisable = ref(false)

const validatePhone = () => {
  const email = form.email
  const isValid = Regexp.Email.test(email)
  captchaDisable.value = isValid
}

// 重置验证码
const resetCaptcha = () => {
  window.clearInterval(captchaTimer.value)
  captchaTime.value = 60
  captchaBtnName.value = '获取验证码'
  captchaDisable.value = true
}

const captchaLoading = ref(false)
// 获取验证码
const onCaptcha = async (captchaReq: BehaviorCaptchaReq) => {
  if (captchaLoading.value) return
  const isInvalid = await formRef.value?.validateField('email')
  if (isInvalid) return
  try {
    captchaLoading.value = true
    captchaBtnName.value = '发送中...'
    // const captchaReq: BehaviorCaptchaReq = { /* 根据需要填充属性 */ }
    await getEmailCaptcha(form.email, captchaReq)
    captchaLoading.value = false
    captchaDisable.value = false
    captchaBtnName.value = `获取验证码(${(captchaTime.value -= 1)}s)`
    Message.success('邮件发送成功，请前往邮箱查看验证码')
    // Message.success('仅提供效果演示，实际使用请查看代码取消相关注释')
    captchaTimer.value = window.setInterval(() => {
      captchaTime.value -= 1
      captchaBtnName.value = `获取验证码(${captchaTime.value}s)`
      if (captchaTime.value <= 0) {
        resetCaptcha()
      }
    }, 1000)
  } catch (error) {
    resetCaptcha()
  } finally {
    captchaLoading.value = false
  }
}
const loading = ref(false)
// 登录
const handleLogin = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return
    loading.value = true
    await updatePassword({
      username: form.username,
      newPassword: encryptByRsa(form.password) || '',
      email: form.email,
      captcha: form.captcha
    }).then((re) => {
      if (re.success) {
        Message.success('修改成功，请使用新密码重新登录')
        authStore.toggleMode()
      }
    })
  } catch (error) {
    // form.captcha = ''
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  inputRefd.value?.focus()
})
</script>

<style lang="scss" scoped>
.arco-input-wrapper,
:deep(.arco-select-view-single) {
  height: 40px;
  border-radius: 4px;
  font-size: 13px;
}

.arco-input-wrapper.arco-input-error {
  background-color: rgb(var(--danger-1));
  border-color: rgb(var(--danger-3));
}

.arco-input-wrapper.arco-input-error:hover {
  background-color: rgb(var(--danger-1));
  border-color: rgb(var(--danger-6));
}

.arco-input-wrapper :deep(.arco-input) {
  font-size: 13px;
  color: var(--color-text-1);
}

.arco-input-wrapper:hover {
  border-color: rgb(var(--arcoblue-6));
}

.captcha-btn {
  height: 40px;
  margin-left: 12px;
  min-width: 98px;
  border-radius: 4px;
}

.btn {
  height: 40px;
}
</style>
