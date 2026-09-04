<template>
  <div class="certificate-page">
    <a-tabs v-model="activeKey" class="tab-title" default-active-key="1" type="editable-card" hide-add>
      <a-tab-pane key="1" tab="证书列表" :closable="false">
        <a-card :bordered="false" class="search-card">
          <SearchControl
            v-if="config"
            :config="config"
            :token="token"
            :project-options="projectOptions"
            @handleQuery="handleQuery"
            @resetQuery="resetQuery"
          />
        </a-card>
        <a-divider />
        <a-card :bordered="false" class="container">
          <advance-table
            :scroll="{ x: 1500, y: 460 }"
            :columns="columns"
            :data-source="list"
            :loading="loading"
            row-key="licenseId"
            bordered
            size="middle"
            table-key="certificate2-list"
            :pagination="pagination"
            :row-selection="rowSelection"
            :need-title="false"
          >
            <div slot="button" class="table-operations">
              <a-button type="primary" @click="handleAdd"><a-icon type="plus-square" />申请证书</a-button>
              <a-space>
                <a-button :disabled="!selectedRowKeys.length" @click="submitSelected"><a-icon type="check" />批量提交</a-button>
                <a-button :disabled="!selectedRowKeys.length" @click="approveSelected"><a-icon type="audit" />批量审批</a-button>
                <a-button :disabled="!selectedRowKeys.length" @click="downloadSelected"><a-icon type="download" />批量下载</a-button>
              </a-space>
            </div>
            <span slot="submitByName" slot-scope="{ record }">{{ record.submitByName || record.createBy || '-' }}</span>
            <span slot="productName" slot-scope="{ record }">{{ record.productName || '-' }}</span>
            <span slot="versionName" slot-scope="{ record }">{{ record.versionName || '-' }}</span>
            <span slot="modelName" slot-scope="{ record }">{{ record.modelName || '-' }}</span>
            <span slot="status" slot-scope="{ record }">
              <span :class="['execute-status', statusClass(record.status)]">{{ getStatus(record.status) }}</span>
            </span>
            <span slot="createTime" slot-scope="{ record }">{{ record.createTime || '-' }}</span>
            <span slot="expiryDate" slot-scope="{ record }">{{ record.expiryDate || '-' }}</span>
            <span slot="operation" slot-scope="{ record }">
              <a @click="handlePreview(record)">详情</a>
              <a-divider type="vertical" />
              <a v-if="String(record.status) === '0'" @click="submitRecord(record)">提交</a>
              <a v-if="String(record.status) === '1'" @click="approveRecord(record)">审批</a>
              <a-divider v-if="['0', '1'].includes(String(record.status))" type="vertical" />
              <a :class="{ disabled: String(record.status) !== '2' }" @click="downloadRecord(record)">下载</a>
            </span>
          </advance-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
    <TimedTaskAddForm
      v-if="config && showAddModal"
      ref="timedTaskAddForm"
      :project-options="projectOptions"
      :config="config"
      :token="token"
      @ok="handleAddFormOk"
      @close="showAddModal = false"
    />
    <TimedTaskLog
      v-if="config && showLogModal"
      ref="timedTaskLog"
      :config="config"
      :token="token"
      @close="showLogModal = false"
    />
  </div>
</template>

<script>
import axios from 'axios'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from './modules/SearchControl'
import TimedTaskAddForm from './modules/TimedTaskAddForm'
import TimedTaskLog from './modules/TimedTaskLog'
import { certificateStatusOptions, getCertificateStatus } from './modules/Config'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { randomUUID } from '@/utils/util'
import {
  getCertificateToken,
  isCertificateTokenExpired,
  removeCertificateToken,
  setCertificateToken,
  throwIfCertificateTokenExpired
} from '@/utils/certificateAuth'

const CERTIFICATE_TOKEN_KEY = 'certificate2_token'

export default {
  name: 'Certificate2',
  components: { AdvanceTable, SearchControl, TimedTaskAddForm, TimedTaskLog },
  data() {
    return {
      loading: false,
      config: null,
      token: '',
      projectOptions: [],
      list: [],
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      showAddModal: false,
      showLogModal: false,
      activeKey: '1',
      query: {},
      queryParam: { pageNum: 1, pageSize: 10 },
      statusOptions: certificateStatusOptions,
      markdownList: [],
      certificateList: [],
      columns: [
        { title: '申请人', dataIndex: 'submitByName', width: 100, scopedSlots: { customRender: 'submitByName' }, ellipsis: true, fixed: 'left', align: 'center' },
        { title: '产品名称', dataIndex: 'productName', width: 180, scopedSlots: { customRender: 'productName' }, ellipsis: true, align: 'center' },
        { title: '产品版本', dataIndex: 'versionName', width: 100, scopedSlots: { customRender: 'versionName' }, align: 'center' },
        { title: '产品型号', dataIndex: 'modelName', width: 200, scopedSlots: { customRender: 'modelName' }, ellipsis: true, align: 'center' },
        { title: '证书码编号', dataIndex: 'licenseNo', width: 154, ellipsis: true, align: 'center' },
        { title: '机器码文件名', dataIndex: 'licenseFile', width: 285, ellipsis: true, align: 'center', customRender: (text, record) => text ? text.split('/').pop() : record.machineCode },
        { title: '状态', dataIndex: 'status', width: 90, scopedSlots: { customRender: 'status' }, align: 'center' },
        { title: '申请时间', dataIndex: 'createTime', width: 160, scopedSlots: { customRender: 'createTime' }, align: 'center' },
        { title: '授权结束日期', dataIndex: 'expiryDate', width: 160, scopedSlots: { customRender: 'expiryDate' }, align: 'center' },
        { title: '操作', dataIndex: 'operation', fixed: 'right', width: 150, scopedSlots: { customRender: 'operation' }, align: 'center' }
      ]
    }
  },
  computed: {
    rowSelection() {
      return { selectedRowKeys: this.selectedRowKeys, onChange: this.onSelectChange }
    },
    pagination() {
      return {
        current: this.queryParam.pageNum,
        pageSize: this.queryParam.pageSize,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        total: this.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: this.changePage,
        onShowSizeChange: this.changePageSize
      }
    }
  },
  created() {
    this.loadConfig().then(() => this.ensureAuthenticated())
  },
  methods: {
    loadConfig() {
      if (!window.config) {
        return Promise.reject(new Error('配置文件加载失败'))
      }
      const config = window.config
      const environment2 = { ...config.environment2 }
      // 保存原始的生产环境URL，用于后端下载证书文件
      environment2.productionUrl = config.environment2.url
      if (process.env.NODE_ENV === 'development' && environment2.devUrl) {
        environment2.url = environment2.devUrl
      }
      this.config = { ...config, environment2 }
      return Promise.resolve()
    },
    buildUrl(endpoint) {
      return `${this.config.environment2.url}${endpoint}`
    },
    headers() {
      return { Authorization: `Bearer ${this.token}` }
    },
    normalizeList(data) {
      const value = data && data.data !== undefined ? data.data : data
      return Array.isArray(value) ? value : (value && (value.rows || value.list)) || []
    },
    getStatus(status) {
      return getCertificateStatus(status)
    },
    statusClass(status) {
      return { 'status-wait': String(status) === '0', 'status-review': String(status) === '1', 'status-success': String(status) === '2', 'status-error': String(status) === '3' }
    },
    async ensureAuthenticated() {
      if (this._authPromise) return this._authPromise
      this._authPromise = (async () => {
        const cachedToken = getCertificateToken(CERTIFICATE_TOKEN_KEY)
        if (cachedToken) {
          this.token = cachedToken
          try {
            await Promise.all([this.getProjects(true), this.getList(true)])
            return
          } catch (error) {
            if (!isCertificateTokenExpired(error)) throw error
            this.token = ''
            removeCertificateToken(CERTIFICATE_TOKEN_KEY)
          }
        }
        await this.login()
      })()
      try {
        return await this._authPromise
      } finally {
        this._authPromise = null
      }
    },
    async login() {
      if (this._loginPromise) return this._loginPromise
      this._loginPromise = (async () => {
      this.loading = true
      try {
        const response = await axios.post(this.buildUrl(this.config.environment2.login), {
          username: this.config.environment2.username,
          password: this.config.environment2.password,
          code: '',
          uuid: ''
        })
        if (response.data.code !== 200 || !response.data.token) throw new Error(response.data.msg || '登录失败')
        this.token = response.data.token
        setCertificateToken(CERTIFICATE_TOKEN_KEY, this.token)
        await Promise.all([this.getProjects(true), this.getList(true)])
      } catch (error) {
        this.$message.error(error.message || '登录失败，请重试')
      } finally {
        this.loading = false
      }
      })()
      try {
        return await this._loginPromise
      } finally {
        this._loginPromise = null
      }
    },
    async getProjects(skipRefresh = false) {
      try {
        const response = await axios.get(this.buildUrl(this.config.environment2.products), {
          params: { pageNum: 1, pageSize: 9999 }, headers: this.headers()
        })
        throwIfCertificateTokenExpired(response)
        this.projectOptions = this.normalizeList(response.data)
      } catch (error) {
        if (!skipRefresh && isCertificateTokenExpired(error)) {
          this.token = ''
          removeCertificateToken(CERTIFICATE_TOKEN_KEY)
          await this.login()
          return this.getProjects(true)
        }
        throw error
      }
    },
    async getList(skipRefresh = false) {
      if (!this.token) return
      this.loading = true
      try {
        const response = await axios.get(this.buildUrl(this.config.environment2.makes), {
          params: { ...this.queryParam, ...this.query }, headers: this.headers()
        })
        throwIfCertificateTokenExpired(response)
        const value = response.data && response.data.data !== undefined ? response.data.data : response.data
        this.list = (value && (value.rows || value.list)) || []
        this.total = Number(response.data.total || (value && value.total) || 0)
        this.selectedRowKeys = []
        this.selectedRows = []
      } catch (error) {
        if (!skipRefresh && isCertificateTokenExpired(error)) {
          this.token = ''
          removeCertificateToken(CERTIFICATE_TOKEN_KEY)
          await this.login()
          return this.getList(true)
        }
        if (isCertificateTokenExpired(error)) throw error
        this.$message.error(error.message || '获取证书列表失败')
      } finally {
        this.loading = false
      }
    },
    handleQuery(query) {
      this.query = Object.keys(query).reduce((result, key) => {
        if (query[key] !== undefined && query[key] !== '') result[key] = query[key]
        return result
      }, {})
      this.queryParam.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.query = {}
      this.queryParam = { pageNum: 1, pageSize: 10 }
      this.getList()
    },
    changePage(page, pageSize) {
      this.queryParam.pageNum = page
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    changePageSize(page, pageSize) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSelectChange(keys, rows) {
      this.selectedRowKeys = keys
      this.selectedRows = rows
    },
    handleAdd() {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.timedTaskAddForm.handleAdd())
    },
    async handleAddFormOk(licenseIds) {
      await this.getList()
      if (licenseIds && licenseIds.length > 0) {
        this.certificateList = this.list.filter(record => licenseIds.includes(record.licenseId))
        if (this.certificateList.length > 0) {
          await this.saveAndNotify()
        }
      }
    },
    handlePreview(record) {
      this.showLogModal = true
      this.$nextTick(() => this.$refs.timedTaskLog.handlePreview(record))
    },
    async putAction(endpoint, record) {
      const response = await axios.put(this.buildUrl(endpoint), { licenseId: record.licenseId }, {
        headers: { ...this.headers(), 'Content-Type': 'application/json' }
      })
      if (response.data.code !== 200) throw new Error(response.data.msg || '操作失败')
    },
    async submitRecord(record) {
      try {
        await this.putAction(this.config.environment2.submit, record)
        this.$message.success('提交审核成功')
        this.getList()
      } catch (error) { this.$message.error(error.message || '提交审核失败') }
    },
    async approveRecord(record) {
      try {
        await this.putAction(this.config.environment2.approve, record)
        this.$message.success('审批通过成功')
        this.certificateList = [record]
        await this.saveAndNotify()
      } catch (error) { this.$message.error(error.message || '审批失败') }
    },
    async runSelected(action) {
      if (!this.selectedRows.length) return
      try {
        for (const record of this.selectedRows) {
          if (action === 'submit' && String(record.status) === '0') await this.putAction(this.config.environment2.submit, record)
          if (action === 'approve' && String(record.status) === '1') await this.putAction(this.config.environment2.approve, record)
        }
        this.$message.success('批量操作成功')
        if (action === 'approve') {
          this.certificateList = this.selectedRows.filter(r => String(r.status) === '1')
          await this.saveAndNotify()
        } else {
          this.getList()
        }
      } catch (error) { this.$message.error(error.message || '批量操作失败') }
    },
    submitSelected() { this.runSelected('submit') },
    approveSelected() { this.runSelected('approve') },
    async downloadRecord(record) {
      if (String(record.status) !== '2') return
      try {
        const response = await axios.get(`${this.buildUrl(this.config.environment2.download)}/${record.licenseId}`, {
          responseType: 'blob', headers: this.headers()
        })
        this.saveBlob(response.data, `${record.licenseNo || record.licenseId}.zip`)
        this.$message.success('证书下载成功')
        this.certificateList = [record]
        // await this.saveAndNotify()
      } catch (error) { this.$message.error(error.message || '证书下载失败') }
    },
    async downloadSelected() {
      const rows = this.selectedRows.filter(record => String(record.status) === '2')
      if (!rows.length) { this.$message.warning('选中的证书中没有可下载记录'); return }
      try {
        for (const record of rows) {
          const response = await axios.get(`${this.buildUrl(this.config.environment2.download)}/${record.licenseId}`, {
            responseType: 'blob', headers: this.headers()
          })
          this.saveBlob(response.data, `${record.licenseNo || record.licenseId}.zip`)
        }
        this.$message.success('批量下载成功')
        this.certificateList = rows
        // await this.saveAndNotify()
      } catch (error) { this.$message.error(error.message || '批量下载失败') }
    },
    saveBlob(data, filename) {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/zip' }))
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    async saveAndNotify() {
      console.log('=== saveAndNotify 开始 ===')
      console.log('certificateList:', this.certificateList)
      await this.getList()
      console.log('刷新后的 list:', this.list)
      await this.downloadFileToServer()
      await this.sendWebhook()
      console.log('=== saveAndNotify 完成 ===')
    },
    async downloadFileToServer() {
      this.markdownList = []
      const certificateList1 = []
      console.log('开始保存证书到服务器, certificateList:', this.certificateList)
      for (const item of this.certificateList) {
        const found = this.list.find(listItem => listItem.licenseId === item.licenseId)
        if (found) certificateList1.push(found)
      }
      console.log('找到的证书记录:', certificateList1)
      await Promise.all(
        certificateList1.map(async (record) => {
          const formData = new FormData()
          // 构建下载URL：
          // 开发环境：通过当前前端地址的代理访问，避免SSL证书问题
          // 生产环境：直接使用生产环境URL
          let downloadUrl
          if (process.env.NODE_ENV === 'development' && this.config.environment2.devUrl) {
            // 使用当前浏览器地址 + 代理路径
            const origin = window.location.origin
            downloadUrl = `${origin}${this.config.environment2.devUrl}${this.config.environment2.download}/${record.licenseId}`
          } else {
            downloadUrl = `${this.config.environment2.productionUrl}${this.config.environment2.download}/${record.licenseId}`
          }
          formData.append('url', downloadUrl)
          formData.append('authorization', this.token)
          formData.append('savePath', this.config.environment2.savePath)
          const fileName = `${record.productName}_${record.versionName}_${record.modelName}_${record.licenseNo}.zip`
          formData.append('fileName', fileName)
          console.log('正在保存文件:', fileName)
          console.log('下载URL:', downloadUrl)
          console.log('保存路径:', this.config.environment2.savePath)
          try {
            const response = await axios.post(
              process.env.VUE_APP_BASE_URL + this.config.environment2.downloadFile,
              formData,
              { headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) } }
            )
            console.log('文件保存响应:', response.data)
            if (response.data.code === 200) {
              await this.buildMarkdownData(record, fileName)
            }
          } catch (error) {
            console.error('保存证书到服务器失败:', error)
          }
        })
      )
      console.log('构建的 markdownList:', this.markdownList)
    },
    async buildMarkdownData(record, fileName) {
      console.log('构建 Markdown 数据，record:', record)
      // 使用旧版本的字段名，确保与后端兼容
      const markdown = {
        orderId: record.testNo || randomUUID(), // 优先使用后端返回的testNo，确保与申请时的testNo一致
        userName: localStorage.getItem('userName') || record.createBy,
        productChName: record.productName,
        productVersionNumber: record.versionName,
        typeName: record.modelName,
        machineCodeMd: record.licenseNo,
        uploadFileName: record.licenseFile.split('/').pop() || record.machineCode,
        makeUserName: record.auditByName || '',
        certificateState: String(record.status) === '2' ? '成功' : '失败',
        makeTime: record.createTime || '',
        authorizationDeadlineTime: record.expiryDate || '',
        maintenanceWarnDate: record.expiryDate || '',
        fileName: this.config.environment2.downloadPath + fileName
      }
      console.log('构建的 markdown 对象:', markdown)
      this.markdownList.push(markdown)
    },
    async sendWebhook() {
      if (!this.markdownList.length) {
        console.warn('markdownList 为空，跳过推送')
        return
      }
      try {
        const buildUrl = process.env.VUE_APP_BASE_URL + this.config.environment2.webhookUrl
        const formData = {
          url: this.config.environment2.webhook,
          msgtype: 'markdown',
          markdownList: this.markdownList
        }
        console.log('准备发送企业微信通知:', formData)
        const response = await axios.post(buildUrl, formData, {
          headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }
        })
        console.log('企业微信推送响应:', response.data)
        if (response.data.code === 200) {
          this.$message.success('推送至企业微信机器人成功！')
        } else {
          this.$message.error(`推送至企业微信机器人失败: ${response.data.msg || ''}`)
        }
      } catch (error) {
        console.error('发送企业微信通知失败:', error)
        this.$message.error('推送至企业微信机器人失败！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.certificate-page {
  min-height: calc(100vh - 120px);
}
.tab-title {
  background-color: white;
  padding: 10px 10px 0 10px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}
.search-card {
  height: 100px;
}
.container {
  width: 100%;
  height: calc(100vh - 305px);
  margin-top: -20px;
}
.table-operations {
  display: flex;
  justify-content: space-between;
  padding: 0 0 10px;
}
.execute-status {
  display: inline-block;
  border-radius: 4px;
  padding: 2px 10px;
  font-weight: 500;
}
.status-wait { color: #666; background: #ededf1; }
.status-review { color: #3370ff; background: #ebf1ff; }
.status-success { color: #00a95c; background: #e5f9ef; }
.status-error { color: #ff4d4f; background: #fce4e4; }
.disabled { color: #999; pointer-events: none; opacity: .6; }
</style>
