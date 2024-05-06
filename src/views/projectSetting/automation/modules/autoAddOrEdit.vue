<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="640" @cancel="cancel"
    modalHeight="420">
    <!-- 这里不做兼容处理，防止后续添加字段 -->
    <a-form-model ref="form" :model="form" slot="content" :label-col="{ span: 4 }" labelAlign="left"
      :wrapper-col="{ span: 14 }">
      <!-- 环境配置 -->
      <div v-if="configType === 1">
        <a-form-model-item label="环境名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入环境名称" />
        </a-form-model-item>
        <a-form-model-item label="环境描述" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入环境描述" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
        <a-form-model-item label="自动化项目保存路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
        <a-form-model-item label=".Java脚本文件保存路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
        <a-form-model-item label=".XML脚本文件保存路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
        <a-form-model-item label="TestReportXml文件保存路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
        <a-form-model-item label="TestRunXml文件保存路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
        <a-form-model-item label="TestRunLog文件保存路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
        <a-form-model-item label="TestOutPut文件保存路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
        <a-form-model-item label="Python程序文件路径" prop="projectName" :label-col="{ span: 8 }">
          <a-input v-model="form.name" placeholder="请输入路径" />
        </a-form-model-item>
      </div>
      <!-- 浏览器配置 -->
      <div v-if="configType === 2">
        <a-form-model-item label="浏览器名称" prop="projectName">
          <a-input v-model="form.name" placeholder="请输入浏览器名称" />
        </a-form-model-item>
        <a-form-model-item label="浏览器版本" prop="abbreviate">
          <a-input v-model="form.abbreviate" placeholder="请输入浏览器版本" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
        <a-form-model-item label="浏览器官方下载地址" prop="projectName" :label-col="{ span: 6 }">
          <a-input v-model="form.name" placeholder="请输入浏览器官方下载地址" />
        </a-form-model-item>
        <a-form-model-item label="浏览器驱动下载地址" prop="projectName" :label-col="{ span: 6 }">
          <a-input v-model="form.name" placeholder="请输入浏览器驱动下载地址" />
        </a-form-model-item>
        <a-form-model-item label="浏览器路径" prop="projectName" :label-col="{ span: 6 }">
          <a-input v-model="form.name" placeholder="请输入浏览器路径" />
        </a-form-model-item>
        <a-form-model-item label="浏览器驱动路径" prop="projectName" :label-col="{ span: 6 }">
          <a-input v-model="form.name" placeholder="请输入浏览器驱动路径" />
        </a-form-model-item>
        <a-form-model-item label="浏览器配置文件路径" prop="projectName" :label-col="{ span: 6 }">
          <a-input v-model="form.name" placeholder="请输入浏览器配置文件路径" />
        </a-form-model-item>
      </div>
    </a-form-model>
    <template slot="footer">
      <a-button type="primary" @click="submitForm">
        确定
      </a-button>
      <a-button @click="cancel">
        取消
      </a-button>
    </template>
  </ant-modal>
</template>
<script type="text/javascript">
import { addProject, editProject, getAllUsersOfSystem } from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'AutoAddOrEdit',
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
        1: '环境',
        2: '浏览器',
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
