import AntModal from '@/components/pt/dialog/AntModal'
import * as api from '@/api/api'

import { testPlanTypeOptions, testPlanStatusOptions } from '../../components/Config'

export default {
  name: 'CreateForm',
  props: {
    memberOptions: {
      type: Array,
      required: true
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
      testPlanTypeOptions,
      testPlanStatusOptions,
      switchStatus: true,
      // 表单参数
      form: {
        id: '',
        name: '',
        abbreviate: '',
        memberIds: [],
        principalName: '',
        type: '',
        planTime: undefined,
        description: '',
        status: 1,
        environmentConfig: '',
        automationConfig: '',
        uiTestCase: '',
      },
      open: false,
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        abbreviate: [{ required: true, message: '简称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        memberIds: [{ required: true, message: '成员不能为空', trigger: 'blur' }],
        type: [{ required: true, message: `类型不能为空`, trigger: 'blur' }],
        planTime: [{ required: true, message: `时间不能为空`, trigger: 'blur' }],
        principalName: [{ required: true, message: `责任人不能为空`, trigger: 'blur' }],
      },
    }
  },
  filters: {},
  created() {
    
  },
  computed: {},
  watch: {},
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.$emit('close')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.formTitle = '新建测试计划'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.formTitle = '修改测试计划'
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
            api.updateTestPlan(this.form).then((response) => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            })
          } else {
            api.addTestPlan(this.form).then((response) => {
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
