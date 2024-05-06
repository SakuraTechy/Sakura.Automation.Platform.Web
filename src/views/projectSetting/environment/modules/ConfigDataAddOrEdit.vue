<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="640" @cancel="cancel"
    modalHeight="420">
    <!-- 这里不做兼容处理，防止后续添加字段 -->
    <a-form-model ref="form" :model="form" slot="content" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }">
      <!-- 版本配置 -->
      <div v-if="configType === 1">
        <a-form-model-item label="版本名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入版本名称" />
        </a-form-model-item>
        <a-form-model-item label="版本描述" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入版本描述" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 域名配置 -->
      <div v-if="configType === 2">
        <a-form-model-item label="域名名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入域名名称" />
        </a-form-model-item>
        <a-form-model-item label="域名地址" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入域名地址" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 账号配置 -->
      <div v-if="configType === 3">
        <a-form-model-item label="账号类型">
          <a-select v-model="form.projectId" placeholder="请选择账号类型">
            <a-select-option v-for="p in []" :key="p.value" :value="p.value" >
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="账号名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入账号名称" />
        </a-form-model-item>
        <a-form-model-item label="账号地址" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入账号地址" />
        </a-form-model-item>
        <a-form-model-item label="账号描述" prop="remark">
          <a-input v-model="form.description" placeholder="请输入账号描述" type="textarea" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 服务器配置 -->
      <div v-if="configType === 4">
        <a-form-model-item label="主机名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入主机名称" />
        </a-form-model-item>
        <a-form-model-item label="主机端口" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入主机端口" />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入用户名" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入密码" />
        </a-form-model-item>
        <a-form-model-item label="主机描述" prop="remark">
          <a-input v-model="form.description" placeholder="请输入主机描述" type="textarea" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
      <!-- 数据库配置 -->
      <div v-if="configType === 5">
        <a-form-model-item label="数据库类型">
          <a-select v-model="form.projectId" placeholder="请选择数据库类型">
            <a-select-option v-for="p in []" :key="p.value" :value="p.value" >
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据库名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入数据库名称" />
        </a-form-model-item>
        <a-form-model-item label="数据库驱动">
          <a-select v-model="form.projectId" placeholder="请选择数据库驱动">
            <a-select-option v-for="p in []" :key="p.value" :value="p.value" >
              {{ p.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据库连接串" prop="remark">
          <a-input v-model="form.description" placeholder="请输入数据库连接串" type="textarea" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入用户名" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入密码" />
        </a-form-model-item>
        <a-form-model-item label="最大连接数" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入最大连接数" />
        </a-form-model-item>
        <a-form-model-item label="最大等待时间" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入最大等待时间" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </div>
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel">
        取消
      </a-button>
      <a-button type="primary" @click="submitForm">
        立即创建
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
import { addProject, editProject, getAllUsersOfSystem } from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'ConfigDataAddOrEdit',
  props: {
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
      loading: false,
      formTitle: '',
      memberOptions: [],
      switchStatus: false,
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        memberIds: [],
        description: undefined,
        abbreviate: undefined,
        status: 0
      },
      open: false,
      rules: {
        memberIds: [{ required: true, message: '成员选择不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }]
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
  created() {
    this.getAllUsers()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 获取系统的所有用户
    getAllUsers() {
      getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset() {
    },
    /**
    * @description 新增按钮操作
    * @param {number} type 配置种类，在TitleMap中对应
    */
    handleAdd(type) {
      this.reset()
      this.open = true
      this.configType = type
      this.formTitle = `新增${this.TitleMap[this.configType]}配置`
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.open = true
      this.formTitle = `修改${this.TitleMap[this.configType]}配置`
      const { id, memberList, description, name, status, abbreviate } = row
      const membersData = []
      memberList.forEach((item, index) => {
        membersData.push(item.id)
      })
      this.switchStatus = Boolean(status)
      this.form = { id, description, name, memberIds: membersData, status, abbreviate }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            editProject(this.form).then(response => {
              this.$message.success(
                '修改成功',
              )
              this.open = false
              this.$emit('ok')
            })
          } else {
            addProject(this.form).then(response => {
              this.$message.success(
                '新增成功',
              )
              this.open = false
              this.$emit('ok')
            })
          }
        } else {
          return false
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
