import { addProject,editProject,getAllUsersOfSystem } from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'CreateForm',
  props: {
    statusOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    AntModal
  },
  data () {
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
      }
    }
  },
  filters: {
  },
  created () {
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
    cancel () {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset () {
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '创建项目'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      this.open = true
      this.formTitle = '修改项目'
      const {id,memberList,description,name,status, abbreviate} = row
      const membersData = []
      memberList.forEach((item,index) => {
        membersData.push(item.id)
      })
      this.switchStatus = Boolean(status)
      this.form = {id,description,name,memberIds:membersData,status, abbreviate}
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
