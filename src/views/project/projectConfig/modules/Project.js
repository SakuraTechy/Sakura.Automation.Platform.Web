import { addProject, editProject, getAllUsersOfSystem } from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'CreateForm',
  props: {
    statusOptions: {
      type: Array,
      required: true,
    },
  },
  components: {
    AntModal,
  },
  data() {
    return {
      okButton: '立即创建',
      loading: false,
      formTitle: '',
      memberOptions: [],
      switchStatus: true,
      // 表单参数
      form: {
        id: '',
        name: '',
        memberIds: [],
        description: '',
        abbreviate: '',
        status: 1,
      },
      open: false,
      rules: {
        name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        abbreviate: [{ required: true, message: '项目简称不能为空', trigger: 'blur' }],
        memberIds: [{ required: true, message: '项目成员不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '项目描述不能为空', trigger: 'blur' }],
      },
    }
  },
  filters: {},
  created() {
    this.getAllUsers()
  },
  computed: {},
  watch: {},
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
      this.$emit('close')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.formTitle = '新建项目配置'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.formTitle = '修改项目配置'
      this.okButton = '确定'
      const { id, memberList, description, name, status, abbreviate } = row
      const membersData = []
      memberList.forEach((item, index) => {
        membersData.push(item.id)
      })
      this.switchStatus = Boolean(parseInt(status))
      this.form = { id, description, name, memberIds: membersData, status, abbreviate }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id !== '') {
            editProject(this.form).then((response) => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            })
          } else {
            addProject(this.form).then((response) => {
              this.$message.success('新增成功')
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
    },
  },
}
