<template>
  <ant-modal
    modal-width="600"
    modal-height="850"
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    @cancel="cancel"
  >
    <div slot="content">
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <!-- <a-form-model-item label="客户名称" prop="customerName">
          <a-input v-model="form.customerName" placeholder="请输入客户名称" />
        </a-form-model-item>
        <a-form-model-item label="客户简称" prop="customerShort">
          <a-input v-model="form.customerShort" placeholder="请输入客户简称" />
        </a-form-model-item> -->
        <a-form-model-item label="产品项目" prop="productId">
          <a-select
            v-model="form.productId"
            placeholder="请选择产品"
            show-search
            option-filter-prop="children"
            allow-clear
            @change="handleChangeProject">
            <a-select-option v-for="item in projectOptions" :key="item.productId" :value="item.productId">
              {{ item.productName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="产品版本" prop="versionId">
          <a-select
            v-model="form.versionId"
            placeholder="请选择版本"
            show-search
            option-filter-prop="children"
            allow-clear
            @change="handleChangeVersion">
            <a-select-option v-for="item in productVersions" :key="item.versionId" :value="item.versionId">
              {{ item.versionNo }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="产品型号" prop="modelId">
          <a-select
            v-model="form.modelId"
            placeholder="请选择型号"
            show-search
            option-filter-prop="children"
            allow-clear
            @change="handleChangeModel">
            <a-select-option v-for="item in productModels" :key="item.modelId" :value="item.modelId">
              {{ item.modelName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="授权模块">
          <a-select
            v-model="form.authModuleIdList"
            mode="multiple"
            :options="productModules"
            :max-tag-count="50"
            placeholder="请选择授权模块"
            allow-clear />
        </a-form-model-item>
        <a-form-model-item label="授权生效" prop="effectDate">
          <el-date-picker
            size="small"
            v-model="form.effectDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :picker-options="pickerOptions"
            style="width: 100%"
            clearable />
        </a-form-model-item>
        <a-form-model-item label="授权结束" prop="expiryDate">
          <el-date-picker
            size="small"
            v-model="form.expiryDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            :picker-options="pickerOptions"
            style="width: 100%"
            clearable />
        </a-form-model-item>
        <a-form-model-item label="维保结束" prop="maintenanceExpiry">
          <el-date-picker
            size="small"
            v-model="form.maintenanceExpiry"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            :picker-options="pickerOptions"
            style="width: 100%"
            clearable />
        </a-form-model-item>
        <a-form-model-item label="授权天数" prop="authDays">
          <a-input-number v-model="form.authDays" :min="1" :precision="0" style="width: 100%" />
        </a-form-model-item>
      </a-form-model>
      <div class="form-item-row">
        <span class="form-item-label">机器码：</span>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="limit"
          accept=".info,.txt"
          multiple
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">可批量将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传.info或.txt文件，且单个文件不超过500KB</div>
        </el-upload>
      </div>
    </div>
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" :loading="loading" @click="submitForm">立即申请</a-button>
      <a-button type="primary" :loading="loading" @click="submitAndApprove">一键制作</a-button>
    </template>
  </ant-modal>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
import AntModal from '@/components/pt/dialog/AntModal'
import { randomUUID } from '@/utils/util'

export default {
  name: 'CertificateAddForm',
  components: { AntModal },
  props: {
    projectOptions: { type: Array, default: () => [] },
    config: { type: Object, required: true },
    token: { type: String, default: '' }
  },
  data() {
    const start = this.formatDate(new Date(), '00:00:00')
    const expiry = this.addDays(start, 7, '23:59:59')
    return {
      open: false,
      formTitle: '添加证书申请',
      loading: false,
      uploadUrl: '/',
      limit: 10,
      fileList: [],
      productVersions: [],
      productModels: [],
      productModules: [],
      updatingFromDate: false,
      pickerOptions: {
        shortcuts: [1, 7, 14, 365].map(days => ({
          text: `${days}天`,
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * days)
            date.setHours(0, 0, 0, 0)
            picker.$emit('pick', date)
          }
        }))
      },
      form: {
        productId: undefined,
        versionId: undefined,
        modelId: undefined,
        customerId: 1,
        customerName: '昂楷科技内部测试',
        customerShort: 'ANKKI',
        authModuleIdList: [],
        effectDate: start,
        expiryDate: expiry,
        maintenanceExpiry: expiry,
        authDays: 7,
        totalCount: 1
      },
      rules: {
        productId: [{ required: true, message: '产品项目不能为空', trigger: 'change' }],
        versionId: [{ required: true, message: '产品版本不能为空', trigger: 'change' }],
        modelId: [{ required: true, message: '产品型号不能为空', trigger: 'change' }],
        customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        customerShort: [{ required: true, message: '客户简称不能为空', trigger: 'blur' }],
        effectDate: [{ required: true, message: '生效时间不能为空', trigger: 'change' }],
        expiryDate: [{ required: true, message: '授权结束时间不能为空', trigger: 'change' }],
        maintenanceExpiry: [{ required: true, message: '维保结束时间不能为空', trigger: 'change' }],
        authDays: [{ required: true, message: '授权天数不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    'form.effectDate'() {
      this.updateAuthDaysFromDates()
    },
    'form.expiryDate'() {
      this.updateAuthDaysFromDates()
    },
    'form.authDays'(value) {
      if (!this.updatingFromDate && value) this.updateExpiryDate(value)
    }
  },
  methods: {
    buildUrl(endpoint) {
      return `${this.config.environment2.url}${endpoint}`
    },
    headers() {
      return { Authorization: `Bearer ${this.token}` }
    },
    formatDate(date, time) {
      const pad = value => String(value).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${time || `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`}`
    },
    addDays(dateString, days, time) {
      const date = new Date(dateString.replace(' ', 'T'))
      date.setDate(date.getDate() + days)
      return this.formatDate(date, time)
    },
    getDatePart(value) {
      return String(value || '').slice(0, 10)
    },
    calculateAuthDays() {
      const start = this.getDatePart(this.form.effectDate).split('-').map(Number)
      const end = this.getDatePart(this.form.expiryDate).split('-').map(Number)
      if (start.length !== 3 || end.length !== 3 || start.some(Number.isNaN) || end.some(Number.isNaN)) return 0
      return Math.round((Date.UTC(end[0], end[1] - 1, end[2]) - Date.UTC(start[0], start[1] - 1, start[2])) / 86400000)
    },
    updateAuthDaysFromDates() {
      const days = this.calculateAuthDays()
      if (days < 1 || days === this.form.authDays) return
      this.updatingFromDate = true
      this.form.authDays = days
      this.$nextTick(() => {
        this.updatingFromDate = false
      })
    },
    updateExpiryDate(days) {
      const start = this.getDatePart(this.form.effectDate)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return
      const date = new Date(`${start}T00:00:00`)
      date.setDate(date.getDate() + Number(days))
      this.form.expiryDate = this.formatDate(date, '23:59:59')
    },
    normalizeList(data) {
      const value = data && data.data !== undefined ? data.data : data
      return Array.isArray(value) ? value : (value && (value.rows || value.list)) || []
    },
    normalizeVersionList(data) {
      return this.normalizeList(data)
        .filter(item => String(item.certVersion || '').trim() !== '')
        .sort((left, right) => this.compareVersionNo(left.versionNo, right.versionNo))
    },
    compareVersionNo(left, right) {
      const leftParts = String(left || '').replace(/^v/i, '').split('.')
      const rightParts = String(right || '').replace(/^v/i, '').split('.')
      const length = Math.max(leftParts.length, rightParts.length)
      for (let index = 0; index < length; index++) {
        const leftPart = leftParts[index] || ''
        const rightPart = rightParts[index] || ''
        const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : null
        const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : null
        if (leftNumber !== null && rightNumber !== null && leftNumber !== rightNumber) return rightNumber - leftNumber
        if (leftPart !== rightPart) return rightPart.localeCompare(leftPart, undefined, { numeric: true, sensitivity: 'base' })
      }
      return 0
    },
    resetForm() {
      const start = this.formatDate(new Date(), '00:00:00')
      const expiry = this.addDays(start, 7, '23:59:59')
      this.form = {
        productId: undefined,
        versionId: undefined,
        modelId: undefined,
        customerId: (this.config.environment2.certificateDefaults || {}).customerId || 1,
        customerName: (this.config.environment2.certificateDefaults || {}).customerName || '',
        customerShort: (this.config.environment2.certificateDefaults || {}).customerShort || '',
        authModuleIdList: [],
        effectDate: start,
        expiryDate: expiry,
        maintenanceExpiry: expiry,
        authDays: 7,
        totalCount: 1
      }
      this.fileList = []
      this.productVersions = []
      this.productModels = []
      this.productModules = []
      if (this.$refs.form) this.$refs.form.resetFields()
    },
    cancel() {
      this.open = false
      this.$emit('close')
    },
    handleAdd() {
      this.resetForm()
      this.open = true
      this.formTitle = '添加证书申请'
    },
    async handleChangeProject(productId) {
      const product = this.projectOptions.find(item => item.productId === productId)
      this.form.versionId = undefined
      this.form.modelId = undefined
      this.productVersions = []
      this.productModels = []
      this.productModules = []
      if (!product) return
      try {
        const response = await axios.get(this.buildUrl(this.config.environment2.productVersions), {
          params: { productId, pageNum: 1, pageSize: 9999 }, headers: this.headers()
        })
        this.productVersions = this.normalizeVersionList(response.data)
      } catch (error) {
        this.$message.error('获取产品版本失败')
      }
    },
    async handleChangeVersion(versionId) {
      this.form.modelId = undefined
      this.productModels = []
      this.productModules = []
      if (!versionId || !this.form.productId) return
      await Promise.all([this.getProductModels(), this.getProductModules()])
    },
    async getProductModels() {
      try {
        const response = await axios.get(this.buildUrl(this.config.environment2.productTypes), {
          params: { productId: this.form.productId, versionId: this.form.versionId, status: 0 }, headers: this.headers()
        })
        this.productModels = this.normalizeList(response.data)
      } catch (error) {
        this.$message.error('获取产品型号失败')
      }
    },
    async getProductModules() {
      try {
        const endpoint = `${this.config.environment2.productModules}/${this.form.productId}/${this.form.versionId}`
        const response = await axios.get(this.buildUrl(endpoint), { headers: this.headers() })
        this.productModules = this.normalizeList(response.data).map(item => ({
          value: item.moduleId,
          label: item.moduleName
        }))
      } catch (error) {
        this.$message.error('获取授权模块失败')
      }
    },
    handleChangeModel(modelId) {
      const model = this.productModels.find(item => item.modelId === modelId)
      this.form.authModuleIdList = model && Array.isArray(model.moduleIds)
        ? model.moduleIds.slice()
        : this.productModules.map(item => item.value)
    },
    validateMachineCodeFile(file) {
      if (!file) return false
      if (!/\.(info|txt)$/i.test(file.name)) {
        this.$message.error(`${file.name} 不是有效的机器码文件`)
        return false
      }
      if (file.size > 500 * 1024) {
        this.$message.error(`${file.name} 超过 500KB`)
        return false
      }
      return true
    },
    beforeUpload(file) {
      return this.validateMachineCodeFile(file)
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      this.$message.warning(`最多选择 ${this.limit} 个机器码文件`)
    },
    async readMachineCode(file) {
      const text = (await file.text()).replace(/^\uFEFF/, '').trim()
      let data = {}
      try {
        data = JSON.parse(text)
      } catch (error) {
        const match = text.match(/(?:machineCode|机器码)\s*[:=]\s*([^\r\n]+)/i)
        data.machineCode = match ? match[1].trim() : text.split(/\r?\n/).map(item => item.trim()).filter(Boolean)[0]
      }
      const machineCode = data.machineCode || (Array.isArray(data.machineCodeList) && data.machineCodeList[0])
      if (!machineCode) throw new Error(`${file.name} 中未找到机器码`)
      const licenseNo = data.licenseNo || md5(machineCode).slice(0, 16).toUpperCase()
      return { machineCode, licenseNo }
    },
    getProductConfig(product) {
      const config = this.config[product.productName] || {}
      return { ...config, ...(this.config.environment2.certificateDefaults || {}) }
    },
    createPayload(machines) {
      const machine = machines[0]
      const product = this.projectOptions.find(item => item.productId === this.form.productId) || {}
      const version = this.productVersions.find(item => item.versionId === this.form.versionId) || {}
      const model = this.productModels.find(item => item.modelId === this.form.modelId) || {}
      const defaults = this.getProductConfig(product)
      const modules = this.form.authModuleIdList || []
      return {
        testNo: randomUUID(), // 生成唯一测试编号
        licenseNo: machine.licenseNo,
        customerId: this.form.customerId || defaults.customerId,
        customerName: this.form.customerName,
        customerShort: this.form.customerShort,
        productId: product.productId,
        productName: product.productName,
        versionId: version.versionId,
        versionName: version.versionNo,
        certVersion: version.certVersion || defaults.certVersion || '',
        modelId: model.modelId,
        modelName: model.modelName,
        shipmentModel: model.modelMapping || model.modelName,
        isNeutral: defaults.isNeutral || '0',
        hasSysinfoMenu: defaults.hasSysinfoMenu || '0',
        isClusterLicense: defaults.isClusterLicense || '0',
        maintenanceExpiry: this.form.maintenanceExpiry,
        authType: defaults.authType || '1',
        totalCount: machines.length,
        effectDate: this.form.effectDate,
        expiryDate: this.form.expiryDate,
        authDays: Number(this.form.authDays),
        authModuleIdList: modules.map(Number),
        machineCode: machines.map(item => item.machineCode).join(','),
        authModuleIds: modules.join(','),
        perfConfig: model.performanceConfig || '{}',
        machineCodeList: machines.map(item => item.machineCode),
        certNoList: machines.map(item => item.licenseNo)
      }
    },
    extractLicenseIds(data) {
      const value = data && data.data !== undefined ? data.data : data
      if (!value) return []
      if (Array.isArray(value)) return value.map(item => typeof item === 'object' ? item.licenseId : item).filter(Boolean)
      if (Array.isArray(value.licenseIdList)) return value.licenseIdList.filter(Boolean)
      if (Array.isArray(value.licenseIds)) return value.licenseIds.filter(Boolean)
      if (typeof value.licenseIds === 'string') return value.licenseIds.split(',').map(item => item.trim()).filter(Boolean)
      const records = value.rows || value.list || value.licenseList
      if (Array.isArray(records)) return records.map(item => typeof item === 'object' ? item.licenseId : item).filter(Boolean)
      return value.licenseId ? [value.licenseId] : []
    },
    async createLicenses(submit, autoMake) {
      if (!this.fileList.length) {
        this.$message.warning('请选择机器码文件')
        return
      }
      this.loading = true
      try {
        const invalidFile = this.fileList.find(item => !this.validateMachineCodeFile(item.raw))
        if (invalidFile) return
        const machines = await Promise.all(this.fileList.map(item => this.readMachineCode(item.raw)))
        const payload = this.createPayload(machines)
        const response = await axios.post(this.buildUrl(this.config.environment2.batchApplications), payload, {
          headers: { ...this.headers(), 'Content-Type': 'application/json' }
        })
        if (response.data.code !== 200) throw new Error(response.data.msg || '证书申请失败')
        const licenseIds = this.extractLicenseIds(response.data)
        if (submit || autoMake) {
          if (!licenseIds.length) throw new Error('批量申请成功，但未返回证书 ID')
          for (const licenseId of licenseIds) {
            const submitResponse = await axios.put(this.buildUrl(this.config.environment2.submit), { licenseId }, {
              headers: { ...this.headers(), 'Content-Type': 'application/json' }
            })
            if (submitResponse.data.code !== 200) throw new Error(submitResponse.data.msg || `证书 ${licenseId} 提交审核失败`)
          }
        }
        if (autoMake) {
          for (const licenseId of licenseIds) {
            const approveResponse = await axios.put(this.buildUrl(this.config.environment2.approve), { licenseId }, {
              headers: { ...this.headers(), 'Content-Type': 'application/json' }
            })
            if (approveResponse.data.code !== 200) throw new Error(approveResponse.data.msg || `证书 ${licenseId} 审批失败`)
          }
        }
        this.$message.success(autoMake ? '一键制作成功，证书已完成审批' : (submit ? '证书申请并提交审核成功' : '添加证书申请成功'))
        this.cancel()
        this.$emit('ok', autoMake ? licenseIds : null)
      } catch (error) {
        this.$message.error(error.message || '证书申请失败')
      } finally {
        this.loading = false
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) this.createLicenses(false, false)
      })
    },
    submitAndSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) this.createLicenses(true, false)
      })
    },
    submitAndApprove() {
      this.$refs.form.validate(valid => {
        if (valid) this.createLicenses(true, true)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form-item-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  // padding: 0 24px;
}

.form-item-label {
  width: 25%;
  text-align: right;
  padding-right: 12px;
  line-height: 40px;
}

.upload-demo {
  width: 66.66%;

  ::v-deep .el-upload,
  ::v-deep .el-upload-dragger {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 150px;
    width: 100%;
    .el-icon-upload {
      margin: 0px;
      font-size: 50px;
      margin-bottom: 10px;
    }
  }
}

::v-deep .ant-modal-body {
  padding: 24px 10px 24px 0px;
}
</style>
