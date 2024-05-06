import {addVersion,editVersion} from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'CreateForm',
  props: {
    projectOptions: {
      type: Array
    }
  },
  components: {
    AntModal
  },
  data () {
    return {
      loading: false,
      formTitle: '',
      checkedDisabled: false,
      currentChecked: false,
      // 表单参数
      form: {
        id: '',
        versionName: '',
        isLatest: '',
        projectId: '',
        publishTime: undefined,
        startTime: undefined,
        endTime: undefined,
        description: ''
      },
      open: false,
      rules: {
        versionName: [{ required: true, message: '版本名称不能为空', trigger: 'blur' }],
        projectId: [{ required: true, message: '项目选择不能为空', trigger: 'blur' }]
      }
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
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
      this.formTitle = '创建版本'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
        this.currentChecked = row.isLatest === '0' ? true : false
        this.checkedDisabled = row.isLatest === '0' ? true : false
        this.reset()
        this.open = true
        this.formTitle = '编辑版本'
        this.form = Object.assign(this.form, row)
    },
    /** 提交按钮 */
    submitForm: function () {
      const { publishTime, startTime, endTime } = this.form
      const { currentChecked } = this
      this.form.publishTime = publishTime ? this.moment(publishTime).format('YYYY-MM-DD HH:mm:ss') : ''
      this.form.endTime = endTime ? this.moment(endTime).format('YYYY-MM-DD HH:mm:ss') : ''
      this.form.startTime = startTime ? this.moment(startTime).format('YYYY-MM-DD HH:mm:ss') : ''
      this.form.isLatest = currentChecked ? '0' : '1'
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            editVersion(this.form).then(response => {
              this.$message.success(
                '修改成功',
              )
              this.open = false
              this.$emit('ok')
            })
          } else {
            addVersion(this.form).then(response => {
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
  }
}
