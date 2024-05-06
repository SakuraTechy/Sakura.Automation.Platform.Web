<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="640" @cancel="cancel"
    modalHeight="420">
    <!-- 这里不做兼容处理，防止后续添加字段 -->
    <a-form-model ref="form1" :model="form1" :rules="rules" slot="content" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }">
      <!-- 版本配置 -->
      <div v-if="configType === 1">
        <a-form-model-item label="版本名称" prop="name" :rules="rules.name">
          <a-input v-model="form1.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="版本描述" prop="description" :rules="rules.description">
          <a-input v-model="form1.description" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 域名配置 -->
      <div v-if="configType === 2">
        <a-form-model-item label="域名名称" prop="name" :rules="rules.name">
          <a-input v-model="form1.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="域名地址" prop="url" :rules="rules.url">
          <a-input v-model="form1.url" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 账号配置 -->
      <div v-if="configType === 3">
        <a-form-model-item label="账号类型">
          <a-select v-model="form.projectId" placeholder="请选择账号类型">
            <a-select-option v-for="p in []" :key="p.value" :value="p.value">
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="账号名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="账号地址" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="账号描述" prop="remark">
          <a-input v-model="form.description" placeholder="请输入" type="textarea" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 服务器配置 -->
      <div v-if="configType === 4">
        <a-form-model-item label="主机名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="主机端口" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="主机描述" prop="remark">
          <a-input v-model="form.description" placeholder="请输入" type="textarea" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 数据库配置 -->
      <div v-if="configType === 5">
        <a-form-model-item label="数据库类型">
          <a-select v-model="form.projectId" placeholder="请选择数据库类型">
            <a-select-option v-for="p in []" :key="p.value" :value="p.value">
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据库名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="数据库驱动">
          <a-select v-model="form.projectId" placeholder="请选择数据库驱动">
            <a-select-option v-for="p in []" :key="p.value" :value="p.value">
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据库连接串" prop="remark">
          <a-input v-model="form.description" placeholder="请输入" type="textarea" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="最大连接数" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="最大等待时间" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="submitForm">{{ this.okButton }}</a-button>
    </template>
  </ant-modal>
</template>
<script>
import * as projectApis from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'ConfigDataAddOrEdit',
  props: {
    environment_Id: {
      type: String,
    },
    statusOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    AntModal
  },
  data() {
    return {
      okButton: '立即创建',
      loading: false,
      formTitle: '',
      open: false,
      switchStatus: false,
      memberOptions: [],

      form1: {
        id: '',
        description: '',
        name: '',
        url: '',
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
          status: 0,
        },
        domains: {
          id: '',
          name: '',
          url: '',
          status: 0
        },
      },
      rules: {
        name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        description: [{ required: true, message: `描述不能为空`, trigger: 'blur' }],
        url: [{ required: true, message: `地址不能为空`, trigger: 'blur' }],
        // versions: {
        //   name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        //   description: [{ required: true, message: `描述不能为空`, trigger: 'blur' }],
        // },
        // domains: {
        //   name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        //   url: [{ required: true, message: `地址不能为空`, trigger: 'blur' }],
        // },
        // name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        // name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        // name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }],
        // name: [{ required: true, message: `名称不能为空`, trigger: 'blur' }]
      },
      configType: 1,
      TitleMap: {
        1: '版本',
        2: '域名',
        3: '账号',
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
        this.$message.info('请先保存环境！')
      } else {
        this.open = true
        this.configType = type
        this.formTitle = `新增${this.TitleMap[this.configType]}配置`
      }
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
    },
    handleDelete(row, ids, names, type) {
      var that = this
      that.form.ids = []
      row.id ? that.form.ids.push(row.id) : that.form.ids = ids
      // const id = row.id || ids
      const name = row.name || names
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
              this.form.versions = this.form1
              if (this.form1.id === '') {
                projectApis.addVersion(this.form).then(response => {
                  this.$message.success('新增成功',)
                  this.open = false
                  this.$emit('getList')
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
              this.form.domains = this.form1
              if (this.form1.id === '') {
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
    }
  }
}

</script>