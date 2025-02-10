<template>
  <a-form
    ref="formRef" :model="form" :rules="rules" :label-col-style="{ display: 'none' }"
    :wrapper-col-style="{ flex: 1 }" size="large" @submit="handleLogin"
  >
    <a-form-item field="username" hide-label>
      <a-input ref="inputRef" v-model="form.username" :placeholder="getPlaceholder()" allow-clear>
        <template #prefix>
          <icon-user />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="password" hide-label>
      <a-input-password v-model="form.password" :placeholder=" !isRegister ? '请输入登录密码' : '请设置登录密码'">
        <template #prefix>
          <icon-lock />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item field="captcha" hide-label>
      <a-input v-model="form.captcha" placeholder="请输入验证码" :max-length="4" allow-clear style="flex: 1 1">
        <template #prefix>
          <icon-safe />
        </template>
      </a-input>
      <div class="captcha-container" @click="getCaptcha">
        <img :src="captchaImgBase64" alt="验证码" class="captcha" />
        <div v-if="form.expired" class="overlay">
          <p>已过期，请刷新</p>
        </div>
      </div>
    </a-form-item>
    <a-form-item>
      <a-row justify="space-between" align="center" class="w-full">
        <a-checkbox v-model="loginConfig.rememberMe">记住我</a-checkbox>
        <a-link v-if="!isRegister" @click="authStore.toggleMode">忘记密码</a-link>
      </a-row>
    </a-form-item>
    <a-form-item>
      <a-space direction="vertical" fill class="w-full">
        <a-button class="btn" type="primary" :loading="loading" html-type="submit" size="large" long>{{ !isRegister ? '立 即 登 录' : '开 始 体 验' }}</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { useStorage } from '@vueuse/core'
import { getImageCaptcha } from '@/apis/common'
import { useTabsStore, useUserStore } from '@/stores'
import { useAuthStore } from '@/stores/modules/auth'
import { encryptByRsa } from '@/utils/encrypt'
import { timeFix } from '@/utils'

// 定义组件的 props
const props = defineProps({
  isRegister: {
    type: Boolean,
  },
})
const inputRef = ref<HTMLInputElement | null>(null)

const loginConfig = useStorage('login-config', {
  rememberMe: props.isRegister,
  username: '',
  password: '',
})

const formRef = ref<FormInstance>()
const form = reactive({
  username: !props.isRegister ? loginConfig.value.username : '',
  nickname: '',
  password: !props.isRegister ? loginConfig.value.password : '',
  gender: 0,
  deptId: 1,
  roleIds: ['547888897925840928'],
  status: 1,
  captcha: '',
  uuid: '',
  expired: false,
})
const rules: FormInstance['rules'] = {
  username: [{ required: true, message: '请设置用户名，5-20个字符' }],
  password: [{ required: true, message: '请设置登录密码' }],
  captcha: [{ required: true, message: '请输入验证码' }],
}

// 验证码过期定时器
let timer
const startTimer = (expireTime: number) => {
  if (timer) {
    clearTimeout(timer)
  }
  const remainingTime = expireTime - Date.now()
  if (remainingTime <= 0) {
    form.expired = true
    return
  }
  timer = setTimeout(() => {
    form.expired = true
  }, remainingTime)
}
// 组件销毁时清理定时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

const captchaImgBase64 = ref()
// 获取验证码
const getCaptcha = () => {
  getImageCaptcha().then((res) => {
    const { uuid, img, expireTime } = res.data
    form.uuid = uuid
    captchaImgBase64.value = img
    form.expired = false
    startTimer(expireTime)
  })
}

const userStore = useUserStore()
const tabsStore = useTabsStore()
const router = useRouter()
const loading = ref(false)

const getPlaceholder = () => {
  return !props.isRegister ? '请输入用户名' : '请设置用户名，5-20个字符'
}

const authStore = useAuthStore()
// const toggleForgotPasswordMode = inject<() => void>('toggleForgotPasswordMode')

// 登录或注册
const handleLogin = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return
    loading.value = true
    if (props.isRegister) {
      await userStore.accountSignup({
        username: form.username,
        nickname: form.username,
        password: encryptByRsa(form.password) || '',
        gender: 0,
        deptId: 1,
        roleIds: ['547888897925840928'],
        status: 1,
      })
    }
    await userStore.accountLogin({
      username: form.username,
      password: encryptByRsa(form.password) || '',
      captcha: form.captcha,
      uuid: form.uuid,
    })
    tabsStore.reset()
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      path: (redirect as string) || '/',
      query: {
        ...othersQuery,
      },
    })
    const { rememberMe } = loginConfig.value
    loginConfig.value.username = rememberMe ? form.username : ''
    loginConfig.value.password = rememberMe ? form.password : ''
    if (props.isRegister) {
      Message.success(`注册成功，${form.username} ${timeFix()}，欢迎使用`)
    } else {
      Message.success(`登录成功，${form.username} ${timeFix()}，欢迎使用`)
    }
  } catch (error) {
    getCaptcha()
    form.captcha = ''
    // Message.error(String(error))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getCaptcha()
  inputRef.value?.focus()
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

.arco-checkbox-checked :deep(.arco-checkbox-icon-check) {
  transform: scale(1.2);
  transition: transform 0.3s cubic-bezier(0.3, 1.3, 0.3, 1);
}

.captcha {
  width: 111px;
  height: 36px;
  margin: 0 0 0 5px;
}

.btn {
  height: 40px;
  // margin-top: 20px;
}

.captcha-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.captcha-container {
  position: relative;
  display: inline-block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay p {
  font-size: 12px;
  color: white;
}
</style>
