<template>
  <div>
    <a-tabs v-model="activeKey" class="tab-title" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
      <a-tab-pane key="1" tab="证书列表" :closable="false">
        <a-card :bordered="false" style="height: 100px">
          <SearchControl
            ref="search"
            :token="token"
            :queryData="queryData"
            :projectOptions="projectOptions"
            :memberOptions="memberOptions"
            @handleQuery="handleQuery"
            @resetQuery="resetQuery"
          />
        </a-card>
        <a-divider />
        <a-card :bordered="false" class="container">
          <!-- table表格 -->
          <advance-table
            :scroll="{ x: 1500, y: 460 }"
            :columns="columns"
            :data-source="list"
            :loading="loading"
            rowKey="certificateId"
            @refresh="getList"
            :components="isDragTable"
            bordered
            size="middle"
            tableKey="system-testPlan-index-table"
            :format-conditions="true"
            :pagination="{
              current: queryParam.pageNum,
              pageSize: queryParam.pageSize,
              pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
              total: total,
              showSizeChanger: true,
              showLessItems: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
              onChange: changeSize,
              customRow: onClickRow,
              onShowSizeChange: onSizeChange,
            }"
            :row-selection="rowSelection"
            :needTitle="false"
          >
            <div class="table-operations" slot="button">
              <a-button type="primary" @click="handleAdd()" v-hasPermi="['test:timedTask:add']">
                <a-icon type="plus-square" />申请证书
              </a-button>
              <a-space :size="8" style="margin-right: 8px">
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleMakes1"
                  v-hasPermi="['test:timedTask:remove']"
                >
                  <a-icon type="snippets" />批量制作
                </a-button>
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleDownloads"
                  v-hasPermi="['test:timedTask:remove']"
                >
                  <a-icon type="download" />批量下载
                </a-button>
              </a-space>
            </div>
            <span slot="name" slot-scope="{ record }">
              {{ record.applyUser.name }}
            </span>
            <span slot="fullName" slot-scope="{ record }">
              {{ record.clientInfo.fullName }}
            </span>
            <span slot="productVersionNumber" slot-scope="{ record }">
              {{ record.productVersion.productVersionNumber }}
            </span>
            <span slot="shortName" slot-scope="{ record }">
              {{ record.clientInfo.shortName }}
            </span>
            <span slot="approvalTime" slot-scope="{ record }">
              {{ parseTime(record.approvalTime) }}
            </span>
            <span slot="authorizationDeadline" slot-scope="{ record }">
              {{ parseTime(record.authorizationDeadline) }}
            </span>
            <span slot="certificateState" slot-scope="{ record }">
              <div
                :class="{
                  'execute-status': true,
                  'remove': item.name === '待制作',
                  'success': record.certificateState === 4
                }"
                v-for="(item, index) in getFilterArray(certificateStateOptions, (item) => item.id === record.certificateState)"
                :key="index">
                {{ item.name }}
              </div>
            </span>
            <span slot="productChName" slot-scope="{ record }">
              {{ record.product.productChName }}
            </span>
            <span slot="typeName" slot-scope="{ record }">
              {{ record.productType.typeName }}
            </span>
            <span slot="createTime" slot-scope="{ record }">
              {{ parseTime(record.createTime) }}
            </span>
            <span slot="updateTime" slot-scope="{ record }">
              {{ parseTime(record.updateTime) }}
            </span>
            <span slot="operation" slot-scope="{ record }">
              <a :class="{ disabled: record.certificateState === 4 }" @click="handleMake(record)" v-hasPermi="['test:timedTask:edit']">制作</a>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:edit']" />
              <a :class="{ disabled: record.certificateState === 3 }" @click="handleDownload(record)" v-hasPermi="['test:timedTask:edit']">下载</a>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:edit']" />
              <a @click="handlePreview(record)" v-hasPermi="['test:timedTask:edit']">详情</a>
            </span>
          </advance-table>
          <!-- 增加 -->
          <TimedTaskAddForm
            v-if="showAddModal"
            ref="timedTaskAddForm"
            :projectOptions="projectOptions"
            :token="token"
            @ok="getList"
            @close="showAddModal = false"
            @handleMakes="handleMakes"
          />
          <TimedTaskLog
            v-if="showAddModal"
            ref="timedTaskLog"
            :projectOptions="projectOptions"
            :token="token"
            @ok="getList"
            @close="showAddModal = false"
          />
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import * as api from '@/api/api'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from './modules/SearchControl'
import { certificateStateOptions, timedTaskStatusOptions } from './modules/Config'
import TimedTaskAddForm from './modules/TimedTaskAddForm'
import TimedTaskLog from './modules/TimedTaskLog.vue'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'Environment',
  components: { SearchControl, AdvanceTable, TimedTaskAddForm, TimedTaskLog },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10
      },
      queryParam1: {
        productChName: undefined,
        productVersionId: undefined,
        machineCodeMd5: '',
        certificateState: undefined,
        name: '',
        createStartTime: '',
        createEndTime: ''
      },
      keyword: '',
      queryData: [
        {
          label: '产品名称',
          value: 'productChName'
        },
        {
          label: '产品版本',
          value: 'productVersionNumber'
        },
        {
          label: '证书编号',
          value: 'machineCodeMd5'
        },
        {
          label: '制作状态',
          value: 'certificateState'
        },
        {
          label: '申请人',
          value: 'name'
        },
        {
          label: '申请时间',
          value: 'approvalTime'
        }
      ],
      columns: [
        {
          title: '申请人',
          width: 100,
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          ellipsis: true,
          fixed: 'left',
          align: 'center'
        },
        // {
        //   title: '客户简称',
        //   width: 100,
        //   dataIndex: 'shortName',
        //   scopedSlots: { customRender: 'shortName' },
        //   ellipsis: true,
        //   align: 'center'
        // },
        // {
        //   title: '客户名称',
        //   width: 120,
        //   dataIndex: 'fullName',
        //   scopedSlots: { customRender: 'fullName' },
        //   align: 'center'
        // },
        {
          title: '产品名称',
          width: 180,
          dataIndex: 'productChName',
          ellipsis: true,
          scopedSlots: { customRender: 'productChName' },
          align: 'center'
        },
        {
          title: '产品版本',
          width: 100,
          dataIndex: 'productVersionNumber',
          ellipsis: true,
          scopedSlots: { customRender: 'productVersionNumber' },
          align: 'center'
        },
        {
          title: '产品型号',
          width: 200,
          dataIndex: 'typeName',
          ellipsis: true,
          scopedSlots: { customRender: 'typeName' },
          align: 'center'
        },
        {
          title: '证书码编号',
          width: 154,
          dataIndex: 'machineCodeMd5',
          ellipsis: true,
          scopedSlots: { customRender: 'machineCodeMd5' },
          align: 'center'
        },
        {
          title: '机器码文件名',
          width: 285,
          dataIndex: 'uploadFileName',
          ellipsis: true,
          scopedSlots: { customRender: 'uploadFileName' },
          align: 'center'
        },
        {
          title: '状态',
          width: 90,
          dataIndex: 'certificateState',
          ellipsis: true,
          scopedSlots: { customRender: 'certificateState' },
          align: 'center'
        },
        {
          title: '申请时间',
          width: 160,
          dataIndex: 'approvalTime',
          scopedSlots: { customRender: 'approvalTime' },
          align: 'center'
        },
        {
          title: '授权结束日期',
          width: 160,
          dataIndex: 'authorizationDeadline',
          scopedSlots: { customRender: 'authorizationDeadline' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      panes: [],
      tab: '',
      activeKey: '1',
      projectOptions: [],
      memberOptions: [],
      certificateStateOptions,
      timedTaskStatusOptions,
      total: 0,
      list: [],
      list1: [],
      certificateList: [],
      certificateIds: [],
      markdownList: [],
      names: [],
      environmentId: '',
      selectedRowKeys: [],
      selectedRows: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      showAddModal: false,
      showEditModal: false,
      isLinkDisabled: false,
      token: ''
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.id === '1',
            name: record.name
          }
        })
      }
    },
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  watch: {
    $route(to, from) {
      // console.log('Route changed');
      // this.getAllTestPlanList()
      this.getList()
    }
  },
  created() {
    this.Login()
  },
  beforeRouteUpdate(to, from, next) {
    // console.log('Route parameter changed')
    this.Login()
    next()
  },
  methods: {
    calculateWidth(originalWidth, screenWidth) {
      return Math.round((screenWidth / 1920) * originalWidth)
    },
    // 获取所有项目
    getAllProjectList1() {
      api.getProjectList().then((response) => {
        this.projectOptions = response.data.list
        // console.log('this.projectOptions', this.projectOptions);
      })
    },
    getAllProjectList() {
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      axios.get(buildUrl('/productManage/products'), {
        headers: { 'Authorization': this.token }
      }).then((response) => {
        this.projectOptions = response.data.data.list
      })
    },
    // 获取所有的测试计划
    getAllTestPlanList() {
      const queryParam = {
        // pageNum: 1,
        // pageSize: 10
      }
      api.getTestPlanList(queryParam).then((response) => {
        this.testPlanOptions = response.data.list
      })
    },
    // 获取测试计划名称
    getTestPlanName(testPlanId) {
      // console.info(this.findNodeId(this.testPlanOptions, testPlanId, 'name'))
      return this.findNodeId(this.testPlanOptions, testPlanId, 'name')
    },
    // 获取系统的所有用户
    getAllUsers() {
      api.getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    getButtonStyle(status) {
      switch (status) {
        case '0':
          return ['#909399', '#909399']
        case '1':
          return ['#ff4d4f', '#ff4d4f']
        case '2':
          return ['#05c878', '#05c878']
        default:
          return ['#909399', '#909399']
      }
    },
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    async Login() {
      this.loading = true
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
        let checkcodeResponse = await axios.get(buildUrl(this.$config.environment.checkcode))
        // console.log('Checkcode Response:', checkcodeResponse)
        let captchaImage = `data:image/jpg;base64,${checkcodeResponse.data.data.checkCodeImg}`
        let parseCaptchaBody = {
          pythonPath: this.$config.environment.pythonPath,
          pythonScript: this.$config.environment.pythonScript,
          captchaUrl: captchaImage,
          captchaPath: this.$config.environment.captchaPath,
          captchaSave: this.$config.environment.captchaSave
        }
        let parseCaptchaResponse = await axios.post(process.env.VUE_APP_BASE_URL + this.$config.environment.parseCaptcha, parseCaptchaBody)
        // console.log('Parse Captcha Response:', parseCaptchaResponse)

        let loginFormData = new FormData()
        loginFormData.append('username', this.$config.environment.username)
        loginFormData.append('password', this.$config.environment.password)
        loginFormData.append('checkCode', parseCaptchaResponse.data.data.code)
        loginFormData.append('checkCodeValue', checkcodeResponse.data.data.checkCodeValue)
        loginFormData.append('createTime', checkcodeResponse.data.data.createTime)

        const maxRetries = 10
        let loginResponse
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            // Step 3: Attempt login
            loginResponse = await axios.post(buildUrl(this.$config.environment.login), loginFormData)
            // console.log('Login Response:', loginResponse)
            if (loginResponse.data.data && loginResponse.data.data.user) {
              this.token = loginResponse.data.data.user
              if (this.token) {
                this.getAllProjectList()
                this.getList()
              }
              break
            } else {
              // console.warn(`Login attempt ${attempt} failed. Response:`, loginResponse)
              if (attempt === maxRetries) {
                throw new Error('Login failed after maximum retries')
              }
              checkcodeResponse = await axios.get(buildUrl(this.$config.environment.checkcode))
              captchaImage = `data:image/jpg;base64,${checkcodeResponse.data.data.checkCodeImg}`
              parseCaptchaBody = {
                pythonPath: this.$config.environment.pythonPath,
                pythonScript: this.$config.environment.pythonScript,
                captchaUrl: captchaImage,
                captchaPath: this.$config.environment.captchaPath,
                captchaSave: this.$config.environment.captchaSave
              }
              parseCaptchaResponse = await axios.post(process.env.VUE_APP_BASE_URL + this.$config.environment.parseCaptcha, parseCaptchaBody)
              loginFormData = new FormData()
              loginFormData.append('username', this.$config.environment.username)
              loginFormData.append('password', this.$config.environment.password)
              loginFormData.append('checkCode', parseCaptchaResponse.data.data.code)
              loginFormData.append('checkCodeValue', checkcodeResponse.data.data.checkCodeValue)
              loginFormData.append('createTime', checkcodeResponse.data.data.createTime)
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          } catch (error) {
            // console.error(`Login attempt ${attempt} failed with error:`, error)
            if (attempt === maxRetries) {
              throw error
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
    },
    async getList() {
      this.loading = true
      const url = `${this.$config.environment.url + this.$config.environment.makes}?keyword=${this.keyword}&page=${this.queryParam.pageNum}&size=${this.queryParam.pageSize}&certificateStateQuery=`
      await axios.get(url, {
        headers: { 'Authorization': this.token }
      }).then((response) => {
        this.list = response.data.data.list
        this.total = response.data.data.total
      }).finally(
        this.loading = false
      )
      this.selectedRowKeys = []
      this.multiple = !this.selectedRowKeys.length
    },
    getList1() {
      this.list1 = []
      this.loading = true
      const url = `${this.$config.environment.url + this.$config.environment.makes}?keyword=${this.keyword}&page=${this.queryParam.pageNum}&size=${this.queryParam.pageSize}&certificateStateQuery=`
      axios.get(url, {
        headers: { 'Authorization': this.token }
      }).then((response) => {
        this.list = response.data.data.list
        this.traverseDeep(this.queryParam1, (key, value) => {
            // console.log(`${key}: ${value}`)
            if (value) {
              this.list.forEach((item) => {
                this.traverseDeep(item, (key1, value1) => {
                  if (key1.includes(key)) {
                    if (value1 === value) {
                      this.list1.push(item)
                    }
                  }
                })
              })
            }
          })
          this.list = this.list1
      }).finally(
        this.loading = false
      )
    },
    handleQuery(queryParam) {
      this.keyword = ''
      if (queryParam === undefined) {
        this.queryParam = {
          pageNum: 1,
          pageSize: 10
        }
      } else {
        for (const key in queryParam) {
          if (queryParam[key]) {
            this.keyword = queryParam[key]
          }
        }
        // this.queryParam1 = Object.assign(this.queryParam, queryParam)
        // console.log('queryParam1', this.queryParam1)
      }
      if (this.token !== '') {
        this.getList()
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.selectedRowKeys = []
      // this.multiple = !this.selectedRowKeys.length
      this.queryParam = {
        pageNum: 1,
        pageSize: 10
      }
      // this.handleQuery()
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSizeChange(current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      this.getList()
    },
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.certificateIds = this.selectedRows.map((item) => item.certificateId)
      this.certificateList = this.selectedRows.map((item) => item)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            const keys = []
            keys.push(record.id)
            this.selectedRowKeys = keys
          }
        }
      }
    },
    handleAdd() {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.timedTaskAddForm.handleAdd())
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.timedTaskAddForm.handleUpdate(record))
    },
    handleDelete(record) {
    },
    handleCopy(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.timedTaskAddForm.handleCopy(record))
    },
    async handleMake(record) {
      this.certificateList = []
      this.certificateList.push(record)
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      const formData = new FormData()
      formData.append('certificateId', record.certificateId)
      const response = await axios.post(buildUrl(this.$config.environment.operate), formData, {
        headers: { 'Authorization': this.token }
      })
      if (response.data.code === 0) {
        this.$message.success('证书制作成功！')
        this.getList()
        this.setbhook()
      } else {
        this.$message.error('证书制作失败！')
      }
    },
    async handleMakes1() {
      let code
      for (const certificateId of this.certificateIds) {
        const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
        const formData = new FormData()
        formData.append('certificateId', certificateId)
        const response = await axios.post(buildUrl(this.$config.environment.operate), formData, {
          headers: { 'Authorization': this.token }
        })
        if (response.data.code === 0) {
          code = response.data.code
        }
      }
      if (code === 0) {
        this.$message.success('证书批量制作成功！')
      } else {
        this.$message.error('部分证书批量制作失败，请检查后重试！')
      }
      this.getList()
      this.setbhook()
    },
    async handleMakes(certificateList) {
      let code
      this.certificateList = certificateList ?? this.certificateList
      for (const certificate of this.certificateList) {
        const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
        const formData = new FormData()
        formData.append('certificateId', certificate.certificateId)
        const response = await axios.post(buildUrl(this.$config.environment.operate), formData, {
          headers: { 'Authorization': this.token }
        })
        if (response.data.code === 0) {
          code = response.data.code
        }
      }
      if (code === 0) {
        this.$message.success('证书批量制作成功！')
      } else {
        this.$message.error('部分证书批量制作失败，请检查后重试！')
      }
      this.getList()
      this.setbhook()
    },
    async setbhook() {
      await this.downloadFile()
      await this.webhook()
    },
    async downloadFile() {
      this.markdownList = []
      await Promise.all(
        this.certificateList.map(async (record) => {
          const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
          const formData = new FormData()
          formData.append('url', buildUrl(this.$config.environment.download) + '?certificateId=' + record.certificateId)
          formData.append('authorization', this.token)
          formData.append('savePath', this.$config.environment.savePath)
          const fileName = record.product.productChName + '-' + record.productType.typeName + '.zip'
          formData.append('fileName', fileName)
          const response = await axios.post(process.env.VUE_APP_BASE_URL + this.$config.environment.downloadFile, formData, {
            headers: { 'Authorization': 'Bearer ' + storage.get(ACCESS_TOKEN) }
          })
          if (response.data.code === 200) {
            await this.getMarkdownList(record, fileName)
          }
        })
      )
    },
    async getMarkdownList(record, fileName) {
      const markdown = {
        orderId: record.orderId,
        name: record.applyUser.name,
        productChName: record.product.productChName,
        productVersionNumber: record.productVersion.productVersionNumber,
        typeName: record.productType.typeName,
        machineCodeMd: record.machineCodeMd5,
        uploadFileName: record.uploadFileName,
        fileName: this.$config.environment.downloadPath + fileName
      }
      this.markdownList.push(markdown)
    },
    async webhook() {
      const buildUrl = process.env.VUE_APP_BASE_URL + this.$config.environment.webhookUrl
      const formData = {
        url: this.$config.environment.webhook,
        msgtype: 'markdown',
        markdownList: this.markdownList
      }
      await axios.post(buildUrl, formData, {
        headers: { 'Authorization': 'Bearer ' + storage.get(ACCESS_TOKEN) }
      }).then((response) => {
        if (response.data.code === 200) {
          this.$message.success('推送至企业微信机器人成功！')
        } else {
          this.$message.error('推送至企业微信机器人失败！')
        }
      })
    },
    async webhook1(record, fileName) {
      const buildUrl = process.env.VUE_APP_BASE_URL + this.$config.environment.webhookUrl
      const formData = {
        url: this.$config.environment.webhook,
        msgtype: 'markdown',
        markdown: {
          content: `产品证书一键自动化制作成功，<font color="warning">共1个</font>，详情如下，请相关同事注意。
           >申请编号：<font color="info"> ${record.orderId}</font>
           >申请姓名：<font color="info"> ${record.applyUser.name}</font>
           >产品名称：<font color="comment"> ${record.product.productChName}</font>
           >产品版本：<font color="comment"> ${record.productVersion.productVersionNumber}</font>
           >产品型号：<font color="comment"> ${record.productType.typeName}</font>
           >证书编码：<font color="comment"> ${record.machineCodeMd5}</font>
           >机器码名：<font color="comment"> ${record.uploadFileName}</font>
           >产品证书： [点击下载](${this.$config.environment.downloadPath + fileName})`
        }
      }
      await axios.post(buildUrl, formData, {
          headers: {
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + storage.get(ACCESS_TOKEN)
          }
      }).then((response) => {
        if (response.data.code === 200) {
          this.$message.success('推送至企业微信机器人成功！')
        } else {
          this.$message.error('推送至企业微信机器人失败！')
        }
      })
      // fetch(buildUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + storage.get(ACCESS_TOKEN)
      //   },
      //   body: JSON.stringify(formData1)
      // })
      // console.log(JSON.stringify(formData1))
      // .then(response => response.json())
      // .then(data => console.log('Success:', data))
      // .catch(error => console.error('Error:', error))
      // fetch('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=fba8ce79-c1b0-4fae-ad3d-56c1bd3051ae', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formData),
      //   credentials: 'include'
      // }).then(response => response.json())
      //   .then(data => console.log(data))
      //   .catch(error => console.error('Error:', error))
    },
    async handleDownload(record) {
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      await axios.get(buildUrl(this.$config.environment.download) + '?certificateId=' + record.certificateId, {
        responseType: 'blob',
        headers: { 'Authorization': this.token }
      }).then((response) => {
        this.readBlobDown(response.data, record.product.productChName + '-' + record.productType.typeName, 'application/zip')
        this.$message.success('证书下载成功！')
        this.getList()
      })
    },
    async handleDownloads() {
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      await axios.get(buildUrl(this.$config.environment.download) + '?certificateId=' + this.certificateIds.join(','), {
        responseType: 'blob',
        headers: { 'Authorization': this.token }
      }).then((response) => {
        this.readBlobDown(response.data, 'aas-license', 'application/zip')
        this.$message.success('证书批量下载成功！')
        this.getList()
      })
    },
    async handleDownload1(record) {
      try {
        const response = await axios.get('http://172.23.1.230:8091/certificateApply/download?certificateId=27556', {
          responseType: 'blob',
          headers: {
            Authorization: '67e50d81f64842bb8a719f67e72ebe43'
          }
        })
        console.log('Response:', response) // 调试信息
        console.log('Response data type:', typeof response.data) // 检查数据类型
        const filename = `${record.product.productChName}-${record.productType.typeName}.zip`
        this.readBlobDown1(response.data, filename, 'application/zip')
      } catch (error) {
        console.error('下载文件时出错:', error)
      }
    },
    handlePreview(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.timedTaskLog.handlePreview(record))
    },
    handleTimedTask(record) {
      this.$router.push({
        name: 'TimedTask',
        params: {
          name: record.name
        }
      })
    },
    handleImport() {},
    handleExport(row) {
      // var that = this
      // var ids1 = []
      // if (row.id !== undefined) {
      //   ids1.push(row.id)
      // }
      // // row.id ? this.certificateIds.push(row.id) : ''
      // // const certificateIds = row.id || that.certificateIds
      // const certificateIds = ids1.length > 0 ? ids1 : that.certificateIds
      // const names = row.name || that.names
      // // console.info(certificateIds)
      // var param = {
      //   testPlanId: row.testPlanId,
      //   certificateIds: certificateIds,
      // }
      // that.$Modal.confirm({
      //   title: '确认导出所选中数据?',
      //   content: '当前选中为' + names + '的测试任务',
      //   onOk() {
      //     return api
      //       .exporttimedTask(param)
      //       .then((res) => {
      //         if (res.status != 404) {
      //           that.readBlobDown(res, 'environment.yml', 'application/x-yaml')
      //           that.$message.success('导出成功')
      //         }
      //       })
      //       .catch((error) => {
      //         that.$message.error('导出失败')
      //         reject(error)
      //       })
      //   },
      //   onCancel() {},
      // })
    },
    /**
     * 读取下载的文件流
     */
    readBlobDown(result, filename, filetype) {
      // console.log(result)
      // let url = window.URL.createObjectURL(new Blob([result]))
      const blob = new Blob([result], { type: filetype }) // application/zip就是设置下载类型，需要设置什么类型可在标题二处查看
      const url = window.URL.createObjectURL(blob) // 设置路径
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', filename) // 指定下载后的文件名，防跳转
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      // 释放内存
      window.URL.revokeObjectURL(link.href)
    },
    readBlobDown1(result, filename, filetype) {
      let blobData
      if (result instanceof Blob) {
        blobData = [result]
      } else if (typeof result === 'string') {
        // 如果是 Base64 字符串，则解码为二进制数据
        const base64Data = result.replace(/[\r\n]/g, '') // 移除换行符
        const binaryString = atob(base64Data)
        const len = binaryString.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        blobData = [bytes.buffer]
      } else if (result instanceof ArrayBuffer || ArrayBuffer.isView(result)) {
        blobData = [new Uint8Array(result)]
      } else {
        throw new Error(`Unsupported data type: ${typeof result}`)
      }
      // 创建 Blob 对象
      const blob = new Blob(blobData, { type: filetype })
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', filename)

      // 添加到 DOM 并触发点击事件
      document.body.appendChild(link)
      link.click()

      // 清理
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    onEdit1(targetKey, action) {
      this[action](targetKey)
    },
    onEdit(targetKey, action) {
      var that = this
      this.$Modal.confirm({
        title: '关闭页面?',
        content: '确认关闭当前页面吗?',
        onOk() {
          return that[action](targetKey)
        },
        onCancel() {}
      })
    },
    remove(targetKey) {
      this.panes.splice(targetKey - 2, 1)
      this.activeKey = '1'
      this.getList()
    },
    // 表格内-状态切换
    onchange(row) {
      api.updateTimedTask(row).then(() => {
        this.$message.success('修改成功')
        this.getList()
        // setTimeout(() => {this.getList()}, 2000)
      })
    },
    /* 任务状态修改 */
    confirmHandleStatus(row) {
      const text = row.status === '1' ? '开启' : '关闭'
      row.status = row.status === '0' ? '1' : '0'
      api
        .updateTimedTask(row)
        .then(() => {
          this.$message.success(text + '成功', 3)
          this.getList()
        })
        .catch(function () {
          this.$message.error(text + '发生异常', 3)
        })
    },
    cancelHandleStatus(row) {}
  }
}
</script>

<style lang="less" scoped>
.tab-title {
  background-color: white;
  padding: 10px 10px 0 10px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}
.title-wrapper {
  padding: 20px 0 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
  font-family: 'Microsoft YaHei';
}
.table-operations {
  // padding: 5px 0px 5px 0px;
  padding: 0px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
}

.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 305px);
  margin-top: -20px;
}

.ant-progress-line {
  padding: 0px 5px 0px 0px;
}

.execute-status {
  /* 定义颜色变量 */
  --status-background-color: #ededf1;
  --status-color: #2e2e2e;

  /* 使用变量 */
  background-color: var(--status-background-color);
  color: var(--status-color);
  border-radius: 4px;
  padding: 2px 10px;
  font-weight: 500;
}
/* 定义不同的状态颜色 */
.execute-status.remove {
  --status-background-color: #ededf1;
  --status-color: #2e2e2e;
}
.execute-status.inprogress {
  --status-background-color: #ebf1ff;
  --status-color: #3370ff;
}
.execute-status.success {
  --status-background-color: #e5f9ef;
  --status-color: #00c261;
}

.execute-status.error {
  --status-background-color: #fce4e4;
  --status-color: #ff4d4f;
}

.execute-status.warning {
  --status-background-color: #fff3cd;
  --status-color: #ffc107;
}

.disabled {
  color: #1a1a1a;
  pointer-events: none; /* 禁用鼠标事件 */
  opacity: 0.6;         /* 改变透明度，使其看起来像禁用 */
  cursor: not-allowed;  /* 更改鼠标指针样式 */
}

/* 当屏幕宽度小于等于1920px时，根据当前的width自适应相应大小 */
@media (min-width: 1920px) {
  .container {
    width: calc(100% * (1920 / 1920));
    // width: calc(Math.round((1920 / 1920) * 1676));
  }
}
</style>
