<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="940" modalHeight @cancel="cancel">
    <!-- 这里不做兼容处理，防止后续添加字段 -->
    <a-form-model ref="form1" :model="form1" :rules="rules" slot="content" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }">
      <div v-if="configType === 1">
        <a-form-model-item label="项目名称" prop="name">
          <a-input v-model="form1.name" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="项目描述" prop="description">
          <a-input v-model="form1.description" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="项目地址" prop="url">
          <a-input v-model="form1.url" placeholder="请输入" type="textarea" :disabled="multiple" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="项目路径" prop="path">
          <a-input v-model="form1.path" placeholder="请输入" type="textarea" :disabled="multiple" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
      </div>
      <div v-if="configType === 2">
        <a-form-model-item label="IP" prop="ip">
          <a-input v-model="form1.ip" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="端口" prop="port">
          <a-input v-model="form1.port" @change="handleInputChange" placeholder="请输入" type="number" allow-clear
            :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="userName">
          <a-input v-model="form1.userName" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="passWord">
          <a-input v-model="form1.passWord" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="地址" prop="url">
          <a-input v-model="form1.url" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="项目" prop="projectId">
          <!-- <a-input v-model="form1.job" placeholder="请输入" allow-clear :disabled="multiple" /> -->
          <a-select v-model="form1.job" placeholder="请选择项目" style="width: 320px" option-filter-prop="children" @change="">
            <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="d.name">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item label="描述" prop="description">
          <a-input v-model="form1.description" placeholder="请输入" :disabled="multiple" type="textarea" allow-clear
            :rows="2" />
        </a-form-model-item> -->
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
      </div>
      <div v-if="configType === 3">
        <a-form-model-item label="环境名称" prop="name">
          <a-input v-model="form1.name" placeholder="请输入" :disabled="true" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="环境描述" prop="description">
          <a-input v-model="form1.description.name" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="参数配置" prop="config1" class="configForm">
          <a-space v-for="(item, index) in form1.configList" :key="index" style="margin-bottom: 10px">
            <a-input v-model="item.paramsName" style="width: 130px" placeholder="请输入参数名" :disabled="multiple" allow-clear/>
            <a-input v-model="item.paramsValue" style="width: 420px" placeholder="请输入参数值" :disabled="multiple" allow-clear/>
            <a-button type="primary" v-if="index === form1.configList.length - 1" shape="circle" icon="plus"
              @click="addConfig(item, index)" style="margin-left;: 10px" :disabled="multiple" />
            <a-button type="danger" shape="circle" icon="delete" v-if="form1.configList.length > 1"
              @click="deleteConfig(item, index)" :disabled="multiple" />
          </a-space>
        </a-form-model-item>
      </div>
      <div v-if="configType === 4">
        <a-form-model-item label="浏览器类型" prop="type">
          <a-select v-model="form1.type" placeholder="请选择浏览器类型" @change="onActionChange" :disabled="multiple">
            <a-select-option v-for="item in browserType" :key="item.type" :value="item.type">
              {{ item.type }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="浏览器名称" prop="name">
          <a-input v-model="form1.name" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="浏览器版本" prop="version">
          <a-input v-model="form1.version" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="浏览器官方下载地址" prop="officialDownload">
          <a-input v-model="form1.officialDownload" placeholder="请输入" type="textarea" :disabled="multiple" allow-clear
            :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="浏览器驱动下载地址" prop="driverDownload">
          <a-input v-model="form1.driverDownload" placeholder="请输入" type="textarea" :disabled="multiple" allow-clear
            :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="浏览器程序路径" prop="path">
          <a-input v-model="form1.path" placeholder="请输入" :disabled="multiple" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="浏览器驱动路径" prop="driver">
          <a-input v-model="form1.driver" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="浏览器配置文件路径" prop="profile">
          <a-input v-model="form1.profile" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
      </div>
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" :disabled="multiple" @click="submitForm">{{ this.okButton }}</a-button>
    </template>
  </ant-modal>
</template>
<script>
import * as projectApis from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
import { browserType } from './Config'

export default {
  name: 'ConfigDataAddOrEdit',
  props: {
    automation_Id: {
      type: String,
    },
    // statusOptions: {
    //   type: Array,
    //   required: true
    // }
  },
  components: {
    AntModal
  },
  data() {
    const validateHandler = (rule, value, callback) => {
      const valid = this.form1.configList.filter((item, index) => {
        return item.paramsName === ''
      })
      if (!valid.length) {
        callback()
      } else {
        return false
      }
    }
    return {
      okButton: '立即创建',
      loading: false,
      formTitle: '',
      open: false,
      switchStatus: false,
      multiple: false,
      memberOptions: [],
      projectOptions: [],
      browserType,

      url: {
        ip: '',
        port: ''
      },

      form1: {
        id: '',
        name: '',
        description: {
          name: '',
          systemType: '',
          userName: '',
          passWord: '',
        },
        url: '',
        job: '',
        path: '',
        configList: [
          {
            paramsName: '',
            paramsValue: '',
          }
        ],
        userName: '',
        passWord: '',
        driver: '',
        maxActive: '',
        maxWait: '',
        ip: '',
        host: '',
        port: undefined,
        type: '',
        version: '',
        officialDownload: '',
        driverDownload: '',
        profile: '',
        status: 0
      },

      // 表单参数
      form: {
        id: '',
        ids: [],
        project: {
          id: '',
          name: '',
          description: '',
          url: '',
          path: '',
          status: 0,
        },
        jenkins: {
          id: '',
          ip: '',
          port: undefined,
          userName: '',
          passWord: '',
          url: '',
          job: '',
          status: 0
        },
        environment: {
          id: '',
          name: '',
          description: {},
          configList: [
            {
              paramsName: '',
              paramsValue: '',
            }
          ],
          status: 0
        },
        browser: {
          type: '',
          id: '',
          name: '',
          version: '',
          officialDownload: '',
          driverDownload: '',
          path: '',
          driver: '',
          profile: '',
          status: 0
        },
      },
      rules: {
        name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        description: [{ required: true, message: `描述不能为空`, trigger: 'blur' }],
        url: [{ required: true, message: `地址不能为空`, trigger: 'blur' }],
        // job: [{ required: true, message: `项目不能为空`, trigger: 'blur' }],
        path: [{ required: true, message: `路径不能为空`, trigger: 'blur' }],
        type: [{ required: true, message: `选择类型不能为空`, trigger: 'blur' }],
        userName: [{ required: true, message: `用户名不能为空`, trigger: 'blur' }],
        passWord: [{ required: true, message: `密码不能为空`, trigger: 'blur' }],
        driver: [{ required: true, message: `驱动地址不能为空`, trigger: 'blur' }],
        maxActive: [{ required: true, message: `最大连接池数量不能为空`, trigger: 'blur' }],
        maxWait: [{ required: true, message: `最大等待时间不能为空`, trigger: 'blur' }],
        ip: [{ required: true, message: `IP不能为空`, trigger: 'blur' }],
        host: [{ required: true, message: `主机名称不能为空`, trigger: 'blur' }],
        port: [{ required: true, message: `端口不能为空`, trigger: 'blur' }],
        configList: [
          { required: true, message: '参数配置不能为空', trigger: 'blur', validator: validateHandler },
        ],
        // versions: {
        //   name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        //   description: [{ required: true, message: `描述不能为空`, trigger: 'blur' }],
        // },
        // domains: {
        //   name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        //   url: [{ required: true, message: `地址不能为空`, trigger: 'blur' }],
        // },
      },
      configType: 1,
      TitleMap: {
        1: '项目',
        2: 'Jenkins',
        3: '环境',
        4: '浏览器',
        // 4: '服务器',
        // 5: '数据库'
      }
    }
  },
  filters: {
  },
  computed: {
  },
  watch: {
    'form1.ip': {
      handler(val) {
        if (val !== undefined) {
          this.form1.url = `http://${this.form1.ip}:${this.form1.port}`
        }
      }
    },
    'form1.port': {
      handler(val) {
        if (val !== undefined) {
          this.form1.url = `http://${this.form1.ip}:${this.form1.port}`
        }
      }
    }
  },
  created() {
    this.form.id = this.automation_Id
    // this.getAllProjects()
  },
  methods: {
    // 获取系统的所有用户
    getAllUsers() {
      getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    // 获取所有项目
    getAllProjects() {
      projectApis.getAutomationInfo(this.automation_Id).then((response) => {
        if (response.data.projectConfig.length > 0) {
          this.projectOptions = JSON.parse(response.data.projectConfig)
        } else {
          this.projectOptions = []
        }
      })
    },
    getList() {
      this.form1 = {}
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.$emit('close')
      // this.$emit('getList')
    },
    // 表单重置
    reset() {
      // if (this.$refs.form !== undefined) {
      //   this.$refs.form.resetFields()
      // }
      this.$refs.form1?.resetFields()
      this.switchStatus = false
      this.form1 = {
        id: '',
        description: '',
        name: '',
        url: '',
        job: '',
        path: '',
        configList: [
          {
            paramsName: '',
            paramsValue: '',
          }
        ],
        userName: '',
        passWord: '',
        driver: '',
        maxActive: '',
        maxWait: '',
        host: '',
        port: undefined,
        status: 0
      }
    },
    /**
    * @description 新增按钮操作
    * @param {number} type 配置种类，在TitleMap中对应
    */
    handleAdd(type) {
      this.reset()
      this.form.id = this.automation_Id
      // this.form.id = this.automation_Id
      if (this.form.id === '') {
        this.$message.info('请先保存配置！')
      } else {
        this.open = true
        this.configType = type
        this.formTitle = `新增${this.TitleMap[this.configType]}配置`
        // delete this.accountType[0]
        // console.info(this.accountType)
        if (type === 2) {
          this.getAllProjects()
        }
      }
    },
    /** 查看按钮操作 */
    handleView(row, type) {
      this.open = true
      this.okButton = '确定'
      this.configType = type
      this.multiple = true
      this.formTitle = `查看${this.TitleMap[this.configType]}配置`
      this.switchStatus = Boolean(row.status)
      this.form1 = row
      if (type === 3) {
        // this.toString(row)
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, type) {
      // this.form.id = this.automation_Id
      this.open = true
      this.okButton = '确定'
      this.configType = type
      this.formTitle = `修改${this.TitleMap[this.configType]}配置`
      // const { id, name, description, status } = row
      // this.switchStatus = Boolean(status)
      // this.form.versions = { id, name, description, status }
      this.switchStatus = Boolean(row.status)
      if (type === 2) {
        this.getAllProjects()
      }
      this.form1 = row
      if (type === 3) {
        // this.toString(row)
      }
      // this.form1.status = 0
      // this.onDescription(this.form1.type)
    },
    handleCopy(row, type) {
      this.form.id = this.automation_Id
      this.open = true
      this.okButton = '确定'
      this.configType = type
      this.formTitle = `复制${this.TitleMap[this.configType]}配置`
      this.switchStatus = Boolean(row.status)
      this.form1 = row
      this.form1.id = ''
      if(type===2){
        this.getAllProjects()
      }
      // this.onActionChange(this.form1.type)
    },
    handleDelete(row, ids, names, type) {
      // // 修改 row 中 host 属性名为 name
      // let { host, ...others } = row
      // row = {
      //   name: host,
      //   ...others
      // }
      var that = this
      that.form.ids = []
      row.id ? that.form.ids.push(row.id) : that.form.ids = ids
      // const id = row.id || ids
      const name = row.name || row.host || row.userName || names
      // const name = row.name !== undefined ? row.name : row.userName || names
      // const form = that.form
      console.info(that.form)
      that.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + name + '的数据',
        onOk() {
          switch (type) {
            case 1:
              projectApis.removeAutomationProject(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
            case 2:
              projectApis.removeAutomationJenkins(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
            case 3:
              projectApis.removeAutomationEnvironment(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
            case 4:
              projectApis.removeAutomationBrowser(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
          }
          // that.form.ids = []
          // that.$emit('getList')
          // return projectApis.removeVersion(form).then(() => {
          //   that.$message.success('删除成功')
          //   that.$emit('getList')
          //   that.form.ids = []
          // })
        },
        onCancel() { }
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form1.validate(valid => {
        if (valid) {
          switch (this.configType) {
            case 1:
              // this.form.project = this.form1
              Object.keys(this.form.project).forEach(key => {
                this.form.project[key] = this.form1[key]
              })
              if (this.form1.id === '') {
                projectApis.addAutomationProject(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editAutomationProject(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
            case 2:
              Object.keys(this.form.jenkins).forEach(key => {
                this.form.jenkins[key] = this.form1[key]
              })
              if (this.form1.id === '') {
                projectApis.addAutomationJenkins(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editAutomationJenkins(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
            case 3:
              Object.keys(this.form.environment).forEach(key => {
                this.form.environment[key] = this.form1[key]
              })
              if (this.form1.id === '') {
                projectApis.addAutomationEnvironment(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editAutomationEnvironment(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
            case 4:
              Object.keys(this.form.browser).forEach(key => {
                this.form.browser[key] = this.form1[key]
              })
              if (this.form1.id === '') {
                projectApis.addAutomationBrowser(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editAutomationBrowser(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
          }
        } else {
          return false
        }
      })
    },
    submitForm1: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            editVersion(this.form).then(response => {
              this.$message.success('修改成功',)
              this.open = false
              this.$emit('getList')
            })
          } else {
            addVersion(this.form).then(response => {
              this.$message.success('新增成功',)
              this.open = false
              this.$emit('getList')
            })
          }
        } else {
          return false
        }
      })
    },
    /** 修改状态 */
    onchange: function (value) {
      this.form1.status = value ? 1 : 0
    },
    handleInputChange() {
      // this.form1.port = parseInt(this.form1.port)
      this.form1.port = this.form1.port ? parseInt(this.form1.port) : this.form1.port
    },
    onActionChange(value) {
      for (let key of Object.keys(this.browserType)) {
        var type = this.browserType[key].type
        if (value === type) {
          this.form1.name = this.browserType[key].label
          this.form1.version = this.browserType[key].version
          this.form1.officialDownload = this.browserType[key].officialDownload
          this.form1.driverDownload = this.browserType[key].driverDownload
          this.form1.path = this.browserType[key].path
          this.form1.driver = this.browserType[key].driver
          this.form1.profile = this.browserType[key].profile
          return
        }
      }
    },
    toString(value) {
      this.form1.description = JSON.stringify(value.description)
    },
    addConfig(item, index) {
      this.form1.configList.push({
        paramsName: '',
        paramsValue: '',
      })
    },
    // 删除配置信息
    deleteConfig(item, index) {
      this.form1.configList.splice(index, 1)
    },
  }
}
</script>

<style lang="less" scoped>
.configForm {
  .ant-btn-circle {
    width: 30px;
    border-radius: 50%;
    min-width: 0;
    padding: 0 7px;
    line-height: 18px;
    text-align: center;
  }
}
</style>