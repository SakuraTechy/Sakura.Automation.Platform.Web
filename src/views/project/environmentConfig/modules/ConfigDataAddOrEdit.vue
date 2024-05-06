<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="960" modalHeight @cancel="cancel">
    <!-- 这里不做兼容处理，防止后续添加字段 -->
    <a-form-model ref="form1" :model="form1" :rules="rules" slot="content" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }">
      <!-- 版本配置 -->
      <div v-if="configType === 1">
        <a-form-model-item label="版本名称" prop="name">
          <a-input v-model="form1.name" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="版本描述" prop="description">
          <a-input v-model="form1.description" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="主线版本">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="参数配置" prop="config1" class="configForm">
          <a-space v-for="(item, index) in form1.configList" :key="index" style="margin-bottom: 10px">
            <a-input v-model="item.paramsName" style="width: 130px" placeholder="请输入参数名" :disabled="multiple"
              allow-clear />
            <a-input v-model="item.paramsValue" style="width: 500px" placeholder="请输入参数值" :disabled="multiple"
              allow-clear />
            <a-button type="primary" v-if="index === form1.configList.length - 1" shape="circle" icon="plus"
              @click="addConfig(item, index)" style="margin-left;: 10px" :disabled="multiple" />
            <a-button type="danger" shape="circle" icon="delete" v-if="form1.configList.length > 1"
              @click="deleteConfig(item, index)" :disabled="multiple" />
          </a-space>
        </a-form-model-item>
      </div>
      <!-- 域名配置 -->
      <div v-if="configType === 2">
        <a-form-model-item label="域名名称" prop="name">
          <a-input v-model="form1.name" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="域名地址" prop="url">
          <a-input v-model="form1.url" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
      </div>
      <!-- 帐号配置 -->
      <div v-if="configType === 3">
        <a-form-model-item label="帐号类型" prop="type">
          <a-select v-model="form1.type" placeholder='请选择' :disabled="multiple">
            <a-select-option v-for="item in accountType" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="帐号名称" prop="userName">
          <a-input v-model="form1.userName" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="帐号密码" prop="passWord">
          <a-input v-model="form1.passWord" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="帐号描述" prop="description">
          <a-input v-model="form1.description" placeholder="请输入" type="textarea" :disabled="multiple" allow-clear
            :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
      </div>
      <!-- 服务器配置 -->
      <div v-if="configType === 4">
        <a-form-model-item label="服务器类型" prop="type">
          <a-select v-model="form1.type" placeholder="请选择服务器类型" :disabled="multiple">
            <a-select-option v-for="item in serverType" :key="item.type" :value="item.type">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-popover placement="right" title="Title">
          <template style="left: -100px;" #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <a-form-model-item label="服务器版本" prop="version">
            <a-input v-model="form1.version" placeholder="请输入" :disabled="multiple" allow-clear />
          </a-form-model-item>
        </a-popover> -->
        <a-form-model-item label="服务器版本" prop="version">
          <el-popover placement="right" title="在Linux中如何查看服务器版本?" trigger="hover">
            <span>
              <a>安装：rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm</a>
              <br />
              <a>安装：sudo yum install redhat-lsb-core</a>
              <br />
              <a>执行：lsb_release -a</a>
            </span>
            <a-input slot="reference" v-model="form1.version" placeholder="请输入" :disabled="multiple" allow-clear />
          </el-popover>
        </a-form-model-item>
        <a-form-model-item label="主机名称" prop="host">
          <a-input v-model="form1.host" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="主机端口" prop="port">
          <a-input v-model="form1.port" @change="handleInputChange" placeholder="请输入" type="number" :disabled="multiple"
            allow-clear />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="userName">
          <a-input v-model="form1.userName" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="passWord">
          <a-input v-model="form1.passWord" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-input v-model="form1.description" placeholder="请输入" :disabled="multiple" allow-clear :rows="2" />
        </a-form-model-item>
        <!-- <a-form-model-item label="域名地址" prop="domain">
          <a-input v-model="form1.domain" placeholder="请输入" :disabled="multiple" allow-clear />
        </a-form-model-item> -->
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="参数配置" prop="config1" class="configForm">
          <a-space v-for="(item, index) in form1.configList" :key="index" style="margin-bottom: 10px">
            <a-input v-model="item.paramsName" style="width: 130px" placeholder="请输入参数名" :disabled="multiple"
              allow-clear />
            <a-input v-model="item.paramsValue" style="width: 500px" placeholder="请输入参数值" :disabled="multiple"
              allow-clear />
            <a-button type="primary" v-if="index === form1.configList.length - 1" shape="circle" icon="plus"
              @click="addConfig(item, index)" style="margin-left;: 10px" :disabled="multiple" />
            <a-button type="danger" shape="circle" icon="delete" v-if="form1.configList.length > 1"
              @click="deleteConfig(item, index)" :disabled="multiple" />
          </a-space>
        </a-form-model-item>
      </div>
      <!-- 数据库配置 -->
      <div v-if="configType === 5">
        <a-form-model-item label="数据库类型" prop="type">
          <a-select v-model="form1.type" placeholder="请选择数据库类型" @change="onActionChange" :disabled="multiple">
            <a-select-option v-for="item in dataBaseType" :key="item.type" :value="item.type">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据库版本" prop="version">
          <el-popover placement="right" title="在Navicat中如何查看数据库版本?" trigger="hover">
            <el-table :data="dataBaseType">
              <el-table-column width="100" property="type" label="数据库类型"></el-table-column>
              <el-table-column width="550" property="sql" label="SQL"></el-table-column>
            </el-table>
            <a-input slot="reference" v-model="form1.version" placeholder="请输入" :disabled="multiple" allow-clear />
          </el-popover>
        </a-form-model-item>
        <a-form-model-item label="数据库驱动" prop="driver">
          <a-input v-model="form1.driver" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="数据库名称" prop="name">
          <a-input v-model="form1.name" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="数据库端口" prop="port">
          <a-input v-model="form1.port" @change="handleInputChange" placeholder="请输入" type="number" allow-clear
            :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="数据库连接串" prop="url">
          <a-input v-model="form1.url" placeholder="请输入" :disabled="multiple" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="userName">
          <a-input v-model="form1.userName" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="passWord">
          <a-input v-model="form1.passWord" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="最大连接数" prop="maxActive">
          <a-input v-model="form1.maxActive" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="最大等待时间" prop="maxWait">
          <a-input v-model="form1.maxWait" placeholder="请输入" allow-clear :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="数据库描述" prop="description">
          <a-input v-model="form1.description" placeholder="请输入" :disabled="multiple" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple" />
        </a-form-model-item>
        <a-form-model-item label="参数配置" prop="config1" class="configForm">
          <a-space v-for="(item, index) in form1.configList" :key="index" style="margin-bottom: 10px">
            <a-input v-model="item.paramsName" style="width: 130px" placeholder="请输入参数名" :disabled="multiple"
              allow-clear />
            <a-input v-model="item.paramsValue" style="width: 500px" placeholder="请输入参数值" :disabled="multiple"
              allow-clear />
            <a-button type="primary" v-if="index === form1.configList.length - 1" shape="circle" icon="plus"
              @click="addConfig(item, index)" style="margin-left;: 10px" :disabled="multiple" />
            <a-button type="danger" shape="circle" icon="delete" v-if="form1.configList.length > 1"
              @click="deleteConfig(item, index)" :disabled="multiple" />
          </a-space>
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
import { accountType, serverType, dataBaseType } from './EnvConfig'

export default {
  name: 'ConfigDataAddOrEdit',
  props: {
    environment_Id: {
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
      accountType,
      serverType,
      dataBaseType,

      url: {
        ip: '',
        port: ''
      },

      form1: {
        id: '',
        description: '',
        name: '',
        url: '',
        userName: '',
        passWord: '',
        driver: '',
        maxActive: '',
        maxWait: '',
        host: '',
        port: undefined,
        type: '',
        version: '',
        versionName: '',
        domain: '',
        configList: [
          {
            paramsName: '',
            paramsValue: '',
          }
        ],
        status: 0
      },

      // 表单参数
      form: {
        id: '',
        ids: [],
        versions: {
          id: '',
          name: '',
          description: '',
          configList: [
            {
              paramsName: '',
              paramsValue: '',
            }
          ],
          status: 0,
        },
        domains: {
          id: '',
          name: '',
          url: '',
          status: 0
        },
        accounts: {
          type: '',
          id: '',
          userName: '',
          passWord: '',
          description: '',
          status: 0
        },
        servers: {
          id: '',
          type: '',
          version: '',
          host: '',
          port: undefined,
          userName: '',
          passWord: '',
          description: '',
          // domain: '',
          configList: [
            {
              paramsName: '',
              paramsValue: '',
            }
          ],
          status: 0
        },
        dataBases: {
          type: '',
          version: '',
          id: '',
          name: '',
          port: undefined,
          driver: '',
          url: '',
          userName: '',
          passWord: '',
          maxActive: '',
          maxWait: '',
          description: '',
          configList: [
            {
              paramsName: '',
              paramsValue: '',
            }
          ],
          status: 0
        },
      },
      rules: {
        name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        description: [{ required: true, message: `描述不能为空`, trigger: 'blur' }],
        url: [{ required: true, message: `地址不能为空`, trigger: 'blur' }],
        type: [{ required: true, message: `选择类型不能为空`, trigger: 'blur' }],
        version: [{ required: true, message: `版本不能为空`, trigger: 'blur' }],
        userName: [{ required: true, message: `用户名不能为空`, trigger: 'blur' }],
        passWord: [{ required: true, message: `密码不能为空`, trigger: 'blur' }],
        driver: [{ required: true, message: `数据库驱动不能为空`, trigger: 'blur' }],
        maxActive: [{ required: true, message: `最大连接池数量不能为空`, trigger: 'blur' }],
        maxWait: [{ required: true, message: `最大等待时间不能为空`, trigger: 'blur' }],
        host: [{ required: true, message: `主机名称不能为空`, trigger: 'blur' }],
        port: [{ required: true, message: `端口不能为空`, trigger: 'blur' }],
        domain: [{ required: true, message: `域名不能为空`, trigger: 'blur' }],
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
      copyStatus: false,
      TitleMap: {
        1: '版本',
        2: '域名',
        3: '帐号',
        4: '服务器',
        5: '数据库'
      }
    }
  },
  filters: {
  },
  computed: {
  },
  watch: {
    'form1.name': {
      handler(val) {
        if (this.url.ip !== '') {
          this.form1.url = this.url.ip
          this.form1.url = this.form1.url.replace('localhost', val)
          this.url.port = this.form1.url
        }
      }
    },
    'form1.port': {
      handler(val) {
        if (this.url.port !== '') {
          this.form1.url = this.url.port
          this.form1.url = this.form1.url.replace('port', val)
        }
      }
    },
    // 'form1.name': {
    //   handler(newVal, oldVal) {
    //     console.log(newVal,oldVal);
    //     // this.form1.name = this.form1.name
    //   }
    // }
  },
  created() {
    this.form.id = this.environment_Id
  },
  methods: {
    // 获取系统的所有用户
    getAllUsers() {
      getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    getList() {
      this.form1 = {}
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.$emit('close')
      this.$emit('getList')
      this.form1.name = this.versionName
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
        userName: '',
        passWord: '',
        driver: '',
        maxActive: '',
        maxWait: '',
        host: '',
        port: undefined,
        configList: [
          {
            paramsName: '',
            paramsValue: '',
          }
        ],
        status: 0
      }
    },
    /**
    * @description 新增按钮操作
    * @param {number} type 配置种类，在TitleMap中对应
    */
    handleAdd(type) {
      this.reset()
      this.form.id = this.environment_Id
      // this.form.id = this.environment_Id
      if (this.form.id === '') {
        this.$message.warning('请先保存环境！')
      } else {
        this.open = true
        this.configType = type
        this.formTitle = `新增${this.TitleMap[this.configType]}配置`
        // delete this.accountType[0]
        // console.info(this.accountType)
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
      this.onActionChange(this.form1.type)
    },
    /** 修改按钮操作 */
    handleUpdate(row, type) {
      // this.form.id = this.environment_Id
      this.open = true
      this.okButton = '确定'
      this.configType = type
      this.formTitle = `修改${this.TitleMap[this.configType]}配置`
      // const { id, name, description, status } = row
      // this.switchStatus = Boolean(status)
      // this.form.versions = { id, name, description, status }
      this.switchStatus = Boolean(row.status)
      this.form1 = row
      console.log(this.form1);
      this.onActionChange(this.form1.type)
    },
    handleCopy(row, type) {
      console.log(this.environment_Id);
      this.form.id = this.environment_Id
      this.open = true
      this.okButton = '确定'
      this.configType = type
      this.formTitle = `复制${this.TitleMap[this.configType]}配置`
      this.switchStatus = Boolean(row.status)
      this.form1 = row
      this.copyStatus = true
      this.versionName= row.name
      // console.log(this.form1);
      this.onActionChange(this.form1.type)
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
              projectApis.removeVersion(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
            case 2:
              projectApis.removeDomain(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
            case 3:
              projectApis.removeAccount(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
            case 4:
              projectApis.removeServer(that.form).then(response => {
                that.$message.success('删除成功')
                that.form.ids = []
                that.$emit('getList')
              })
              break
            case 5:
              projectApis.removeDataBase(that.form).then(response => {
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
              // this.form.versions = this.form1
              Object.keys(this.form.versions).forEach(key => {
                this.form.versions[key] = this.form1[key]
              })
              if (this.form1.id === '' || this.copyStatus) {
                projectApis.addVersion(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                  this.$emit('ok',this.form.versions)
                })
              } else {
                projectApis.editVersion(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
            case 2:
              Object.keys(this.form.domains).forEach(key => {
                this.form.domains[key] = this.form1[key]
              })
              if (this.form1.id === '' || this.copyStatus) {
                projectApis.addDomain(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editDomain(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
            case 3:
              Object.keys(this.form.accounts).forEach(key => {
                this.form.accounts[key] = this.form1[key]
              })
              if (this.form1.id === '' || this.copyStatus) {
                projectApis.addAccount(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editAccount(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
            case 4:
              Object.keys(this.form.servers).forEach(key => {
                this.form.servers[key] = this.form1[key]
              })
              if (this.form1.id === '' || this.copyStatus) {
                projectApis.addServer(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editServer(this.form).then(response => {
                  this.$message.success('修改成功',)
                  this.open = false
                  this.$emit('getList')
                })
              }
              break
            case 5:
              Object.keys(this.form.dataBases).forEach(key => {
                this.form.dataBases[key] = this.form1[key]
              })
              if (this.form1.id === '' || this.copyStatus) {
                projectApis.addDataBase(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
                })
              } else {
                projectApis.editDataBase(this.form).then(response => {
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
    // 数据库类型发生改变
    onActionChange(value) {
      // console.info(value)
      // console.info(this.dataBaseType)
      // this.dataBaseType.forEach((k,v)=>{
      //   if(k.type===value){
      //     console.info(k.driver)
      //     console.info(k.url)
      //   }
      //   console.info(value)
      // })
      for (let key of Object.keys(this.dataBaseType)) {
        var type = this.dataBaseType[key].type
        if (value === type) {
          // console.info(this.dataBaseType[key].driver)
          // console.info(this.dataBaseType[key].url)
          this.form1.driver = this.dataBaseType[key].driver
          this.form1.url = this.dataBaseType[key].url
          this.url.ip = this.dataBaseType[key].url
          return
        }
      }
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