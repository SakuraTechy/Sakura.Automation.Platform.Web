import { addConfiguration,editConfiguration } from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'CreateForm',
  components: {
    AntModal,
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      buttonWrapperCol: { span: 5, offset: 19 },
      loading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: undefined,
        configName: undefined,
        paramsName: undefined,
        paramsValue:undefined
      },
      open: false,
      rules: {
        configName: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
        paramsName: [{ required: true, message: '配置参数不能为空', trigger: 'blur' }],
        paramsValue: [{ required: true, message: '配置值不能为空', trigger: 'blur' }],
      },
    }
  },
  filters: {},
  created() {
  },
  computed: {},
  watch: {},
  methods: {
    // tab标签页改变
    callback(key) {
      console.log(key)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset() {},
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.formTitle = '新增配置'
    },
    /** 修改按钮操作 */
    handleUpdate(row, ids) {
      this.reset()
      this.open = true
      this.formTitle = '编辑配置'
      const {id,configName,paramsName,paramsValue} = row
      this.form = {
        id,
        configName,
        paramsName,
        paramsValue
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            addConfiguration(this.form).then((response) => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            })
          } else {
            editConfiguration(this.form).then((response) => {
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
  },
}
