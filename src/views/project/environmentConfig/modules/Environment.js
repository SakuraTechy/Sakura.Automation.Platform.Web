import { getProjectList, addEnvironment, getEnvironmentInfo, editEnvironment } from '@/api/project'
import AntModal from '@/components/pt/dialog/AntModal'
import Setting from '../../components/Setting.vue'
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
    Setting,
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      buttonWrapperCol: { span: 5, offset: 19 },
      loading: false,
      formTitle: '',
      generalList: [
        {
          id: this.uuidv1(),
          ip: '',
          domain: '',
          description: '',
          checked: '0',
        },
      ],
      serverList: [
        {
          id: this.uuidv1(),
          host: '',
          port: '',
          username: '',
          password: '',
          checked: '0',
        },
      ],
      projectOptions: [],
      sysDataBaseConfigList: [], // 数据库配置
      // 表单参数
      form: {
        id: undefined,
        environmentName: undefined,
        projectIds: [],
      },
      open: false,
      rules: {
        projectIds: [{ required: true, message: '项目选择不能为空', trigger: 'blur' }],
        environmentName: [{ required: true, message: '环境名称不能为空', trigger: 'blur' }],
      },
    }
  },
  filters: {},
  created() {
    this.getAllProjectList()
  },
  computed: {},
  watch: {},
  methods: {
    // 获取所有项目
    getAllProjectList() {
      getProjectList().then((response) => {
        this.projectOptions = response.data.list
        console.log('this.projectOptions', this.projectOptions);
      })
    },
    // tab标签页改变
    callback(key) {
      console.log(key)
    },
    // 添加通用配置
    addGeneral(item, index) {
      this.generalList.push({
        id: this.uuidv1(),
        ip: '',
        domain: '',
        description: '',
        checked: '1',
      })
    },
    // 删除通用配置
    deleteGeneral(item, index) {
      this.generalList.splice(index, 1)
    },
    // 添加服务器配置
    addSever(item, index) {
      this.serverList.push({
        id: this.uuidv1(),
        host: '',
        port: '',
        username: '',
        password: '',
        checked: '1',
      })
    },
    // 删除服务器配置
    deleteSever(item, index) {
      this.serverList.splice(index, 1)
    },
    // 添加数据库配置
    addDataBase(dataBaseForm) {
      const id = this.uuidv1()
      this.sysDataBaseConfigList.push({ ...dataBaseForm, id })
    },
    // 删除数据库配置
    delDataBase(row) {
      const { sysDataBaseConfigList } = this
      this.sysDataBaseConfigList = sysDataBaseConfigList.filter((item) => item.id !== row.id)
    },
    // 改变选择的状态
    changeState(type, item) {
      if (type === '1') {
        this.serverList.map((server) => {
          server.checked = server.id === item.id ? '0' : '1'
        })
      } else {
        this.generalList.map((general) => {
          general.checked = general.id === item.id ? '0' : '1'
        })
      }
    },
    onChangeStatus(row) {
      this.sysDataBaseConfigList.map((item) => {
        item.checked = item.id === row.id ? '0' : '1'
      })
    },
    // 改变页面放大缩小按钮的位置
    changeButtonSize(sizeState) {
      if (sizeState === 0) {
        this.buttonWrapperCol = { span: 5, offset: 22 }
      } else {
        this.buttonWrapperCol = { span: 5, offset: 19 }
      }
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
      this.formTitle = '创建环境'
    },
    /** 修改按钮操作 */
    handleUpdate(row, ids) {
      this.reset()
      this.open = true
      this.formTitle = '编辑环境'
      // 调用接口获取环境信息
      getEnvironmentInfo(row.id).then((response) => {
        const { id, environmentName, sysProjectList, sysCommonConfigList, sysDataBaseConfigList, sysServerConfigList } =
          response.data
        const projectList = []
        sysProjectList.forEach((item, index) => {
          projectList.push(item.id)
        })
        this.form = {
          id,
          environmentName,
          projectIds: projectList,
        }
        this.generalList = sysCommonConfigList
          ? sysCommonConfigList
          : [
              {
                id: this.uuidv1(),
                ip: '',
                domain: '',
                description: '',
                checked: '1',
              },
            ]
        this.serverList = sysServerConfigList
          ? sysServerConfigList
          : [
              {
                id: this.uuidv1(),
                host: '',
                port: '',
                username: '',
                password: '',
                checked: '1',
              },
            ]
        this.sysDataBaseConfigList = sysDataBaseConfigList ? sysDataBaseConfigList : []
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      const data = {
        ...this.form,
        sysCommonConfigList: this.generalList,
        sysDataBaseConfigList: this.sysDataBaseConfigList,
        sysServerConfigList: this.serverList,
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            editEnvironment(data).then((response) => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            })
          } else {
            addEnvironment(data).then((response) => {
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
