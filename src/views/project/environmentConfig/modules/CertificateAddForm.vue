<template>
  <ant-modal
    modalWidth="630"
    modalHeight="550"
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    @cancel="cancel"
  >
    <div slot="content">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-model-item label="所属项目" prop="abbreviate">
          <a-select v-model="form.abbreviate" placeholder="请选择所属项目" option-filter-prop="children" show-search allowClear>
            <a-select-option v-for="(item, index) in projectOptions" :key="index" :value="item.abbreviate" @click="handleChangeProject(item)">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属环境" prop="host">
          <a-select v-model="form.host" placeholder="请选择所属环境" option-filter-prop="children" show-search allowClear>
            <a-select-option v-for="(item, index) in serverOptions" :key="index" :value="item.host" @click="handleChangeServer(item)">
              {{ item.host }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <div class="form-item-row">
        <span class="form-item-label">产品证书：</span>
        <!-- <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :http-request="submitUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="limit"
          accept=".info,.lic"
          multiple
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传.lic文件，且不超过500kb</div>
        </el-upload> -->
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :http-request="submitUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="limit"
          accept=".lic"
          multiple
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">上传到服务器</el-button> -->
          <div slot="tip" class="el-upload__tip">只能上传.lic文件，且不超过500kb</div>
        </el-upload>
      </div>
    </div>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm"> 立即上传 </a-button>
    </template>
  </ant-modal>
</template>
<script>
import axios from 'axios'
import * as api from '@/api/api'
import * as projectApis from '@/api/project'
import { randomUUID } from '@/utils/util'
import AntModal from '@/components/pt/dialog/AntModal'

export default {
  name: 'CertificateAddForm',
  props: {
    projectOptions: {
      type: Array
    },
    serverOptions: {
      type: Array
    }
  },
  components: {
    AntModal
  },
  data() {
    return {
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      limit: 1,
      fileList: [],
      License_Path: '',

      orderIdList: [],
      certificateList: [],

      okButton: '立即申请',
      loading: false,
      formTitle: '',
      switchStatus: true,

      // 表单参数
      form: {
        abbreviate: undefined,
        host: undefined
      },
      sceneList: [],
      open: false,
      rules: {
        abbreviate: [{ required: true, message: '所属项目不能为空', trigger: 'blur' }],
        host: [{ required: true, message: '所属环境不能为空', trigger: 'blur' }]
      }
    }
  },
  filters: {},
  created() {
    // console.log(this.$config)
    // console.log(this.projectOptions)
  },
  computed: {},
  watch: {},
  mounted() {
    // console.log(this.serverOptions)
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.$emit('close')
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
      // this.form = {
      //   id: '',
      //   host: undefined
      // }
    },
    // 选择时间
    change(value) {
      // console.log(value);
      // this.form.planTime = value
    },
    onOk(value) {
      // console.log(value);
      this.form.planTime = value
      this.form.plannedStartTime = this.form.planTime[0]
      this.form.plannedEndTime = this.form.planTime[1]
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.formTitle = '导入产品证书'
      this.resetForm()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.formTitle = '修改定时任务'
      this.okButton = '确定'
      this.form = Object.assign(this.form, row)
      this.testPlanOptions.forEach((item) => {
        if (item.id === this.form.testPlanId) {
          this.form.testPlan = item
        }
      })
      this.getSceneList(this.form.testPlan)
    },
    handleChangeProject(project) {
      // this.form.abbreviate  = project.abbreviate
    },
    handleChangeServer(server) {
      // this.host = server.id
      this.License_Path = this.$config.environment.license + '/' + this.form.abbreviate + '/License'
    },
    getEnvironmentList() {
      const queryParam = {
        host: this.project.id
      }
      projectApis.getEnvironmentList(queryParam).then((response) => {
        response.data.list.forEach((item, index) => {
          if (item.status === 1) {
            this.getEnvironmentInfo(item.id)
          }
        })
      })
    },
    getEnvironmentInfo(environmentId) {
      projectApis.getEnvironmentInfo(environmentId).then((response) => {
        if (response.data.serverConfig.length > 0) {
          this.serverList = JSON.parse(response.data.serverConfig)
          this.serverList.forEach((item, index) => {
            if (item.status === 1) {
              item.configList.forEach((key) => {
                if (key.paramsName === '证书路径') {
                  this.License_Path = key.paramsValue
                }
              })
              // console.log(this.License_Path)
            }
          })
        }
      })
    },
    handlePreview(file) {
      // 处理文件预览逻辑
      // console.log('Preview file:', file)
      // 如果是图片文件，可以直接显示预览
      window.open(file.url || URL.createObjectURL(file.raw))
      if (file.type.startsWith('image/png')) {
        window.open(file.url || URL.createObjectURL(file.raw))
      } else {
        // 对于非图片文件，可以提示用户或提供其他预览方式
        this.$message.info('该文件类型不支持预览')
      }
    },
    handleRemove(file, fileList) {
      // 处理文件移除逻辑
      // console.log('Removed file:', file)
      // console.log('Current file list:', fileList)
      // 从待上传的文件列表中移除文件
      const index = this.fileList.findIndex(f => f.uid === file.uid)
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
      // 更新显示的文件列表
      this.fileList = fileList
    },
    handleChange(file, fileList) {
      // console.log('File changed:', file, fileList)
      this.fileList = fileList
      // console.log('this.fileList:', this.fileList)
      // this.fileList = fileList.slice(-3) // 保持最多三个文件
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件。这次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeUpload(type) {
      if (!this.form.abbreviate) {
        this.$message.warning('请选择所属项目!')
        return
      }
      if (!this.form.host) {
        this.$message.warning('请选择所属环境!')
        return
      }
      if (this.fileList.length === 0) {
        this.$message.warning('请选择文件后再上传!')
        return
      }
      let isLic
      let isLt500K
      for (let i = 0; i < this.fileList.length; i++) {
        const file = this.fileList[i]
        isLic = file.name.endsWith(type)
        isLt500K = file.size / 1024 < 500
        if (!isLic) {
          this.$message.error(`请上传正确的${type}格式文件！`)
          return
        }
        if (!isLt500K) {
          this.$message.error('文件大小不能超过 500KB!')
          return
        }
      }
      // // 验证文件格式和大小
      // const file = this.fileList[0]
      // const isLic = file.name.endsWith('.info') || file.name.endsWith('.lic')
      // // const isLic1 = file.type === 'image/jpeg' || file.type === 'image/png'
      // const isLt500K = file.size / 1024 < 500
      // if (!isLic) {
      //   this.$message.error('上传文件格式错误！')
      //   return
      // }
      // if (!isLt500K) {
      //   this.$message.error('文件大小不能超过 500KB!')
      //   return
      // }
      return isLic && isLt500K
    },
    async submitUpload() {
      if (this.beforeUpload('.info')) {
        await this.applications()
        this.cancel()
        this.$emit('ok')
      }
    },
    async submitUpload1() {
      if (this.beforeUpload('.info')) {
        await this.applications()
        await this.getList()
        this.cancel()
        this.$emit('handleMakes', this.certificateList)
      }
    },
    submitUpload2() {
      if (this.beforeUpload('.lic')) {
        this.customUploads()
        this.cancel()
      }
    },
    // 单个文件上传
    customUpload() {
      const formData = new FormData()
      formData.append('file', this.fileList[0].raw)
      formData.append('path', this.License_Path)
      // const response = axios.post(`${process.env.VUE_APP_BASE_URL}/system/file/upload`, formData)
      // console.log('Response:', response)
      api.uploadFile(formData).then((res) => {
        this.$message.success('文件上传成功！')
        this.fileList = []
      }).catch((error) => {
        this.$message.error('文件上传失败！', error)
      })
    },
    // 多个文件上传
    customUploads() {
      const formData = new FormData()
      this.fileList.forEach(file => {
        // 打印原始文件名
        // console.log('Original filename:', file.raw.name)
        // 创建新的文件名
        const host = this.form.host.replace(/\./g, '_')
        // console.log('host:', host)
        const newName = file.raw.name.replace(/^(.*?)(?=(_audit\.lic)$)/, host)
        // console.log('newName:', newName)
        // 使用 Blob 构造函数创建一个新的文件对象，同时保持原有的文件内容
        const newFile = new File([file.raw], newName, { type: file.raw.type })
        // 打印修改后的文件名
        // console.log('Modified filename:', newFile)
        // 将新的文件对象添加到 FormData 中
        formData.append('files', newFile)
      })
      formData.append('path', this.License_Path)
      // 发送 HTTP 请求进行文件上传
      // fetch(process.env.VUE_APP_BASE_URL + '/system/file/uploads', {
      //   headers: {
      //       'Authorization': 'Bearer ' + localStorage.getItem('access_token').replace(/"/g, '')
      //   },
      //   method: 'POST',
      //   body: formData
      // })
      // .then(response => response.json())
      // .then(data => {
      //   console.log('Upload success:', data)
      //   this.$message.success('文件上传成功！')
      // })
      // .catch(error => {
      //   console.error('Upload error:', error)
      //   this.$message.error('文件上传失败！')
      // })
      api.uploadFiles(formData).then((res) => {
        this.$message.success('文件上传成功！')
        // this.fileList = []
      }).catch((error) => {
        this.$message.error('文件上传失败！', error)
      })
    },
    async application() {
      this.orderIdList = []
      this.orderIdList.push(randomUUID())
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      const abbreviate = this.project.productChName
      const applicationsFormData = new FormData();
        [
          ['clientInfoId', this.$config[abbreviate].clientInfoId],
          ['agent', this.$config[abbreviate].agent],
          ['productId', this.$config[abbreviate].productId],
          ['productVersionId', this.$config[abbreviate].productVersionId],
          ['productTypeId', this.$config[abbreviate].productTypeId],
          ['maxInstance', this.$config[abbreviate].maxInstance],
          ['maxStorage', this.$config[abbreviate].maxStorage],
          ['maxPerformance', this.$config[abbreviate].maxPerformance],
          ['applyTotal', this.$config[abbreviate].applyTotal],
          ['technicalName', this.$config[abbreviate].technicalName],
          ['certificateType', this.$config[abbreviate].certificateType],
          ['modelType', this.$config[abbreviate].modelType],
          ['authorizationDeadlineTime', this.addDaysToDate(new Date(), this.$config[abbreviate].authorizationDeadlineTime)],
          ['maintenanceWarnDate', this.addDaysToDate(new Date(), this.$config[abbreviate].maintenanceWarnDate)],
          ['orderId', this.orderIdList[0]],
          ['MachineCodeFile', this.fileList[0].raw],
          ['requestType', this.$config[abbreviate].requestType],
          ['maxAbilityEquipment', this.$config[abbreviate].maxAbilityEquipment],
          ['externalEquipmentControl', this.$config[abbreviate].externalEquipmentControl],
          ['abilityEquipmentType', this.$config[abbreviate].abilityEquipmentType],
          ['machineCode', this.$config[abbreviate].machineCode]
        ].forEach(([key, value]) => applicationsFormData.append(key, value))
        const applicationsResponse = await axios.post(buildUrl(this.$config.environment.applications), applicationsFormData, {
          headers: { 'Authorization': this.token }
        })
        // console.log('Applications Response:', applicationsResponse)
        if (applicationsResponse.data) {
          // console.log(`Application response code: ${applicationsResponse.data.code}`)
          if (applicationsResponse.data.code === 0) {
            this.$message.success('添加证书申请成功', 1)
            this.cancel()
            this.$emit('ok')
          } else {
            this.$message.success('添加证书申请失败', 1)
          }
        }
    },
    async applications() {
      this.orderIdList = []
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      const abbreviate = this.project.productChName
      let code
      for (let i = 0; i < this.fileList.length; i++) {
        this.orderIdList.push(randomUUID())
        const applicationsFormData = new FormData();
        [
          ['clientInfoId', this.$config[abbreviate].clientInfoId],
          ['agent', this.$config[abbreviate].agent],
          ['productId', this.$config[abbreviate].productId],
          ['productVersionId', this.$config[abbreviate].productVersionId],
          ['productTypeId', this.$config[abbreviate].productTypeId],
          ['maxInstance', this.$config[abbreviate].maxInstance],
          ['maxStorage', this.$config[abbreviate].maxStorage],
          ['maxPerformance', this.$config[abbreviate].maxPerformance],
          ['applyTotal', this.$config[abbreviate].applyTotal],
          ['technicalName', this.$config[abbreviate].technicalName],
          ['certificateType', this.$config[abbreviate].certificateType],
          ['modelType', this.$config[abbreviate].modelType],
          ['authorizationDeadlineTime', this.addDaysToDate(new Date(), this.$config[abbreviate].authorizationDeadlineTime)],
          ['maintenanceWarnDate', this.addDaysToDate(new Date(), this.$config[abbreviate].maintenanceWarnDate)],
          ['orderId', this.orderIdList[i]],
          ['MachineCodeFile', this.fileList[i].raw],
          ['requestType', this.$config[abbreviate].requestType],
          ['maxAbilityEquipment', this.$config[abbreviate].maxAbilityEquipment],
          ['externalEquipmentControl', this.$config[abbreviate].externalEquipmentControl],
          ['abilityEquipmentType', this.$config[abbreviate].abilityEquipmentType],
          ['machineCode', this.$config[abbreviate].machineCode]
        ].forEach(([key, value]) => applicationsFormData.append(key, value))
        await axios.post(buildUrl(this.$config.environment.applications), applicationsFormData, {
          headers: { 'Authorization': this.token }
        }).then((applicationsResponse) => {
          applicationsResponse.data.code === 0 ? code = 0 : code = 1
        })
      }
      if (code === 0) {
        this.$message.success('批量添证书申请成功', 1)
      } else {
        this.$message.success('部分证书添加申请失败', 1)
      }
    },
    async getList() {
      this.certificateList = []
      const url = `${this.$config.environment.url + this.$config.environment.makes}?keyword=&page=1&size=10&certificateStateQuery=`
      await axios.get(url, {
        headers: { 'Authorization': this.token }
      }).then((response) => {
        // console.log(this.orderIdList)
        for (var orderId of this.orderIdList) {
          for (var item of response.data.data.list) {
            if (item.orderId === orderId) {
              this.certificateList.push(item)
            }
          }
        }
      })
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitUpload2()
        }
      })
    },
    /** 修改状态 */
    onchange: function (value) {
      this.form.status = value ? 1 : 0
    }
  }
}
</script>

<style lang="less" scoped>
.form-item-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-item-label {
  font-size: 13.5px;
  margin-left: 23px;
  // font-weight: bold;
}

.upload-demo {
  margin-left: 7px; /* 设置间距 */
  flex: 1; /* 使上传组件占据剩余空间 */

  ::v-deep .el-upload-dragger {
    width: 340px;
    // height: 100px;
    .el-icon-upload {
      font-size: 50px;
      // margin: 5px 0 0 15px;
    }
  }
}
</style>
