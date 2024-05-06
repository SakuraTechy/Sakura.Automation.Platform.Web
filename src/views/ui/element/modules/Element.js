import { checkPostCodeUnique, checkPostNameUnique } from '@/api/system/post'
import AntModal from '@/components/pt/dialog/AntModal'
import SelectTree from '@/components/pt/selectTree/index.vue'
export default {
  name: 'CreateForm',
  props: {
    locateTypeOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    AntModal,
    SelectTree
  },
  data () {
    return {
      loading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: '',
        module: '',
        elementName: '',
        locateType: null,
        locate: '',
        remark: ''
      },
      open: false,
      rules: {
        elementName: [{ required: true, message: '元素名称不能为空', trigger: 'blur' }],
        module: [{ required: true, message: '所属模块不能为空', trigger: 'blur' }],
        locateType: [{ required: true, message: '请选择定位类型', trigger: 'blur' }],
        locate: [{ required: true, message: '元素定位不能为空', trigger: 'blur' }]
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
    changeTreeData(value) {
      this.form.module = value
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
      this.formTitle = '创建元素'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
        this.reset()
        this.open = true
        this.formTitle = '修改元素'
        this.form = Object.assign(this.form, row)
        this.$nextTick(() => { this.$refs.selectTree.handleValue(row.module) })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
              this.$message.success(
                '修改成功',
                3
              )
              this.open = false
              this.$emit('ok')
          } else {
              this.$message.success(
                '新增成功',
                3
              )
              this.open = false
              this.$emit('ok')
          }
        } else {
          return false
        }
      })
    },
    checkPostCodeUnique (rule, value, callback) {
      const msg = '岗位编码已存在'
      if (value === '') {
        callback()
      } else {
        const checkData = {
          postCode: value,
          id: this.form.id !== undefined ? this.form.id : ''
        }
        checkPostCodeUnique(checkData).then(response => {
          if (response.data.code === '1') {
            callback()
          } else {
            callback(msg)
          }
        })
      }
    },
    checkPostNameUnique (rule, value, callback) {
      const msg = '岗位名称已存在'
      if (value === '') {
        callback()
      } else {
        const checkData = {
          postName: value,
          id: this.form.id !== undefined ? this.form.id : ''
        }
        checkPostNameUnique(checkData).then(response => {
          if (response.data.code === '1') {
            callback()
          } else {
            callback(msg)
          }
        })
      }
    }
  }
}
