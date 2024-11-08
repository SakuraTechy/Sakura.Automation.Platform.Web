<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col-style="{ display: 'none' }"
    :wrapper-col-style="{ flex: 1 }"
    size="large"
    @submit="handleLogin"
  >
    <a-form-item field="phone" hide-label>
      <!-- <a-input v-model="form.phone" placeholder="请输入手机号" :max-length="11" allow-clear>
        <template #prefix>
          <icon-phone />
        </template>
      </a-input> -->
      <a-space direction="vertical" size="mini">
        <a-input-group>
          <a-select v-model="selectedCountry"
            placeholder="请选择"
            default-value="+86"
            :trigger-props="{ autoFitPopupMinWidth: true }"
            allow-search
            @change="handleChange"
            >
            <a-option v-for="country in countries" :key="country.code" :value="country.code" :label="country.code">
              {{ country.code }} {{ country.name }}
            </a-option>
          </a-select>
          <a-input ref="inputRefd" v-model="form.phone" placeholder="请输入手机号" :max-length="11" allow-clear
            :style="{ width: '295px', borderRadius: '0px 4px 4px 0px' }" @input="validatePhone" />
        </a-input-group>
      </a-space>
    </a-form-item>
    <a-form-item field="captcha" hide-label>
      <a-input v-model="form.captcha" placeholder="请输入验证码" :max-length="6" allow-clear style="flex: 1 1">
        <template #prefix>
          <icon-safe />
        </template>
      </a-input>
      <a-button
        class="captcha-btn"
        :loading="captchaLoading"
        :disabled="!captchaDisable"
        size="large"
        @click="onCaptcha"
      >
        {{ captchaBtnName }}
      </a-button>
    </a-form-item>
    <a-form-item>
      <a-space direction="vertical" fill class="w-full">
        <a-button class="btn" type="primary" :loading="loading" html-type="submit" size="large" long>{{ !isRegister ? '立 即 登 录' : '开 始 体 验' }}</a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <Verify
    ref="VerifyRef"
    :captcha-type="captchaType"
    :mode="captchaMode"
    :img-size="{ width: '330px', height: '155px' }"
    @success="getCaptcha"
  />
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import axios from 'axios'
import { countryNameMap } from './code'
import { getSmsCaptcha } from '@/apis'
import { useTabsStore, useUserStore } from '@/stores'
import { getPhoneCountryCode } from '@/apis/auth'
import * as Regexp from '@/utils/regexp'
import { timeFix } from '@/utils'
import { encryptByRsa } from '@/utils/encrypt'

// 定义组件的 props
const props = defineProps({
  isRegister: {
    type: Boolean
  }
})

const formRef = ref<FormInstance>()
const form = reactive({
  phone: '',
  username: '',
  nickname: '',
  password: 'qq111111',
  gender: 0,
  deptId: 1,
  roleIds: ['547888897925840928'],
  status: 1,
  uuid: '',
  captcha: ''
})

const rules: FormInstance['rules'] = {
  phone: [
    { required: true, message: '请输入手机号' },
    { match: Regexp.Phone, message: '请输入正确的手机号' }
  ],
  captcha: [{ required: true, message: '请输入验证码' }]
}

// 定义国家和地区数据
interface Country {
  code: string
  name: string
}
const countries = ref<Country[]>([])
const selectedCountry = ref<Country[]>() // 默认值
const inputRefd = ref<HTMLInputElement | null>(null)

// 处理选择变化
const handleChange = (value) => {
  selectedCountry.value = value
}

// 获取国家和地区数据
// eslint-disable-next-line unused-imports/no-unused-vars
const fetchCountries = async () => {
  try {
    // const response = await getPhoneCountryCode()
    const response = await axios.get('https://restcountries.com/v3.1/all')
    const data = response.data.map((country: any) => ({
      code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
      name: countryNameMap[country.name.common]
    })).filter((country: { code: string, name: string | undefined }) => country.name !== undefined)
    countries.value = data
    console.warn(countries.value)
  } catch (error) {
    console.error('获取国家数据失败:', error)
  }
}

const VerifyRef = ref<InstanceType<any>>()
const captchaType = ref('blockPuzzle')
const captchaMode = ref('pop')
const captchaLoading = ref(false)
// 弹出行为验证码
const onCaptcha = async () => {
  if (captchaLoading.value) return
  const isInvalid = await formRef.value?.validateField('phone')
  if (isInvalid) return
  VerifyRef.value.show()
}

const captchaTimer = ref()
const captchaTime = ref(60)
const captchaBtnName = ref('获取验证码')
const captchaDisable = ref(false)

const validatePhone = () => {
  const phone = form.phone
  const isValid = Regexp.Phone.test(phone)
  captchaDisable.value = isValid
}

// 重置验证码
const resetCaptcha = () => {
  window.clearInterval(captchaTimer.value)
  captchaTime.value = 60
  captchaBtnName.value = '获取验证码'
  captchaDisable.value = true
}

// 获取验证码
const getCaptcha = async () => {
  try {
    captchaLoading.value = true
    captchaBtnName.value = '发送中...'
    // await getSmsCaptcha({
    //   phone: form.phone
    // })
    captchaLoading.value = false
    captchaDisable.value = false
    captchaBtnName.value = `获取验证码(${(captchaTime.value -= 1)}s)`
    Message.success('短信发送成功，演示默认【111111】')
    form.captcha = '111111'
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
    // Message.error(String(error))
  } finally {
    captchaLoading.value = false
  }
}

const userStore = useUserStore()
const tabsStore = useTabsStore()
const router = useRouter()
const loading = ref(false)
// 登录或注册
const handleLogin = async () => {
  const isInvalid = await formRef.value?.validate()
  if (isInvalid) return
  try {
    loading.value = true
    if (props.isRegister) {
      await userStore.PhoneSignup({
        phone: form.phone,
        captcha: form.captcha,
        username: form.phone,
        nickname: form.phone,
        password: encryptByRsa(form.password) || '',
        gender: 0,
        deptId: 1,
        roleIds: ['547888897925840928'],
        status: 1
      })
    }
    await userStore.phoneLogin({
      phone: form.phone,
      captcha: form.captcha
    })
    tabsStore.reset()
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      path: (redirect as string) || '/',
      query: {
        ...othersQuery
      }
    })
    if (props.isRegister) {
      Message.success(`注册成功，${form.phone} ${timeFix()}，欢迎使用`)
      Message.info(`初始密码【qq111111】，可前往个人中心修改密码`)
    } else {
      Message.success(`登录成功，${form.phone} ${timeFix()}，欢迎使用`)
    }
  } catch (error) {
    form.captcha = ''
  } finally {
    loading.value = false
  }
}

// watch(form, (newForm, oldForm) => {
//   // console.log('新的表单值:', newForm)
//   // console.log('旧的表单值:', oldForm)
//   // 这里可以添加更多的处理逻辑
// }, { deep: true })

// 在组件挂载时获取数据
onMounted(() => {
  // fetchCountries()
  countries.value = countryNameMap
  inputRefd.value?.focus()
})
</script>

<style lang="scss" scoped>
:deep(.arco-select-view-single) {
  width: 90px !important;
  border-radius: 4px 0px 0px 4px !important;
  font-size: 13px !important;
}

:deep(.arco-select-view-value) {
  font-size: 13px !important;
}

:deep(.arco-select-view-input) {
  font-size: 13px !important;
}

:deep(.arco-select-option-content) {
  font-size: 13px !important;
}

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
  margin-top: 10px;
}
</style>
