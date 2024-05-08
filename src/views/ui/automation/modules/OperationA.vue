<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="1070" @cancel="cancel"
    modalHeight="710">
    <div slot="content">
      <a-page-header title="场景步骤" />
      <a-form-model :model="form.step" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
        class="add-step-form">
        <a-form-model-item label="用例ID" prop="copyPid" v-if="showCopy">
          <a-select v-model="form.step.copyPid" placeholder="请选择场景用例" style="width: 420px" option-filter-prop="children">
            <a-select-option v-for="(d, index) in copyCaseList" :key="index" :value="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="步骤名称" prop="name">
          <a-input v-model="form.step.name" style="width: 420px" />
        </a-form-model-item>
        <a-form-model-item label="步骤排序" prop="sortType">
          <a-select v-model="form.sortType" placeholder="请选择排序类型" style="width: 420px" option-filter-prop="children"
            @change="onSortChange">
            <a-select-option v-for="(d, index) in sortOptions" :key="index" :value="d.value">
              <span>{{ d.label }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="当前步骤序号" prop="order" v-if="showSort">
          <a-input v-model="form.step.order" style="width: 300px" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="目标步骤序号" prop="itemOrder" v-if="showSort">
          <a-input v-model="form.itemOrder" style="width: 300px" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="操作类型" prop="operationType">
          <a-select v-model="form.step.operationType" placeholder="请选择操作类型" style="width: 300px"
            option-filter-prop="children" @change="onStepChange">
            <a-select-option v-for="(d, index) in operations" :key="index" :value="d.name">
              <span>{{ d.name }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="操作方法" prop="action">
          <a-select v-model="form.step.action" placeholder="请选择操作方法" style="width: 300px" option-filter-prop="children"
            @change="onActionChange">
            <a-select-option v-for="(d, index) in stepOptions" :key="index" :value="d.id">
              <span>{{ d.name }}</span>
            </a-select-option>
          </a-select>
          <span style="margin-left: 10px">{{ getTip }}</span>
        </a-form-model-item>
        <a-form-model-item label="环境配置" prop="setting" v-if="showDomain">
          <a-select v-model="form.step.setting" placeholder="请选择环境配置" style="width: 300px" option-filter-prop="children"
            @change="onDomainChange">
            <a-select-option v-for="(d, index) in settingOptions" :key="index" :value="d.id">
              <span>{{ d.environmentName }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <div v-if="form.step.action && showConfig" class="configForm">
          <a-form-model-item label="操作步骤" prop="config">
            <a-space v-for="(item, index) in form.step.config" :key="index" style="margin-bottom: 10px">
              <a-input v-model="item.paramsName" style="width: 130px" placeholder="请输入参数名" />
              <a-input v-model="item.paramsValue" style="width: 420px" placeholder="请输入参数值" />
              <span v-if="form.step.action !== 'web-geturl'">
                <a-button type="primary" v-if="index === form.step.config.length - 1" shape="circle" icon="plus"
                  @click="addConfig(item, index)" style="margin-right: 10px" />
                <a-button type="danger" shape="circle" icon="delete" v-if="form.step.config.length > 1"
                  @click="deleteConfig(item, index)" />
              </span>
            </a-space>
          </a-form-model-item>
        </div>
      </a-form-model>
      <!-- <a-page-header title="高级设置" />
      <Advance
        ref="advanceSetting"
        :treeData="treeData"
        :replaceFields="replaceFields"
        :showElement="showElement"
      ></Advance> -->
    </div>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm"> 确定 </a-button>
    </template>
  </ant-modal>
</template>

<script>
import { operations, sortOptions } from '@/utils/options'
import Advance from '../components/Advance.vue'
import AntModal from '@/components/pt/dialog/AntModal'
import { getSenceCaseInfo, addSenceStep, editSenceStep, getSenceStepInfo, copySenceStepList } from '@/api/ui'
import { getSettingInfo } from '@/api/project'
export default {
  name: 'OperationA',
  components: { Advance, AntModal },
  data() {
    // 验证配置信息
    const validateHandler = (rule, value, callback) => {
      const valid = this.form.step.config.filter((item, index) => {
        return item.paramsName === ''
      })
      if (!valid.length) {
        callback()
      } else {
        return false
      }
    }
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
      stepOptions: [], // 操作方法
      editType: false,
      showCopy: false,
      showSort: false,
      showElement: false,
      submitType: '',
      projectId: '',
      operations, // 操作类型和操作步骤
      operationType: '', // 操作类型
      showConfig: false, // 是否展示配置项
      showDomain: false, // 是否展示域名
      open: false,
      formTitle: '',
      setting: '',
      sortOptions,
      form: {
        id: '',
        sortType: 0,
        itemOrder: 1,
        step: {
          setting: '',
          action: '',
          pid: '',
          name: '',
          order: 1,
          operationType: '', // 操作类型
          config: [
            // 操作步骤
            {
              paramsName: '',
              paramsValue: '',
            },
          ],
          copyId: '',
          copyPid: '',
        },
      },
      settingOptions: [],
      copyCaseList: [],
      rules: {
        copyPid: [{ required: true, message: '上级用例ID', trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        operationType: [{ required: true, message: '操作类型不能为空', trigger: 'blur' }],
        action: [{ required: true, message: '操作方法不能为空', trigger: 'blur' }],
        config: [
          { required: true, message: '操作步骤需填写完整，不能为空', trigger: 'blur', validator: validateHandler },
        ],
      },
    }
  },
  computed: {
    getTip() {
      const { action } = this.form.step
      switch (action) {
        case 'web-geturl':
          return '获取项目环境里面的URL域名打开'
        case 'web-geturls':
          return '指定URL域名打开'
        case 'web-close':
          return '从标签页A打开新的标签页B，关闭标签页A'
        case 'web-quit':
          return '同时会关闭浏览器'
        case 'web-refresh':
          return '刷新当前浏览器页面'
        case 'web-getcode':
          return '通过Python脚本解析图片验证码'
        case 'switch-window':
          return '切换浏览器到当前最新窗口，默认最后一个'
        case 'switch-windows':
          return '切换浏览器到指定窗口，适合多窗口互相切换'
        case 'switch-Iframe':
          return '1. 通过index获取，第一位0 2. 通过id，name，xpath获取'
        case 'return-Iframe':
          return '返回上一级Iframe控件'
        case 'quit-Iframe':
          return '返回最上级Iframe控件'
        default:
          return ''
      }
    },
  },
  watch: {
    'form.step.operationType': {
      handler(val) {
        this.operations.map((item) => {
          if (item.name === val) {
            this.stepOptions = item.children
          }
        })
      },
    },
    'form.step.action': {
      handler(value) {
        if (this.submitType === 'add') {
          const config = this.findNodeId(this.operations, value, 'config')
          this.form.step.config = config
        }
        this.showConfig = this.form.step.config ? true : false
        if (value === 'web-geturl' || value === 'exe-shell') {
          this.showDomain = true
          // this.getSetting(this.projectId)
        } else {
          this.showDomain = false
        }
      }
    },
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset() {
      this.$refs.form?.resetFields()
      this.stepOptions = [] // 把步骤置空
    },
    onSortChange(value) {
      if (value === 0) {
        this.showSort = false
      } else {
        this.showSort = true
      }
    },
    // 获取该项目下的环境和域名
    // getSetting(id) {
    //   getSettingInfo(id).then((response) => {
    //     this.settingOptions = response.data
    //   })
    // },
    // 环境改变
    onDomainChange(value) {
      const { action } = this.form.step
      if (value && action === 'web-geturl') {
        this.form.step.config = []
        const environmentDomain = this.findNodeId(this.settingOptions, value, 'environmentDomain')
        this.form.step.config.push({ paramsName: 'value', paramsValue: environmentDomain })
      } else if (value && action === 'exe-shell') {
        this.form.step.config = []
        const sysServerConfigList = this.findNodeId(this.settingOptions, value, 'sysServerConfigList')
        sysServerConfigList.map((item, index) => {
          if (item.checked === '0') {
            this.form.step.config.push(
              { paramsName: 'host', paramsValue: item.host },
              { paramsName: 'port', paramsValue: item.port },
              { paramsName: 'userName', paramsValue: item.username },
              { paramsName: 'passWord', paramsValue: item.password }
            )
          }
        })
      }
    },
    // 操作类型发生改变
    onStepChange(value) {
      this.form.step.action = ''
    },
    // 操作方法发生改变
    onActionChange(value) {
      this.form.step.setting = ''
      const config = this.findNodeId(this.operations, value, 'config')
      this.form.step.config = config
      // if (value === 'web-getcode') {
      //   this.form.step.config = [
      //     { paramsName: 'locator', paramsValue: '' },
      //     { paramsName: 'url', paramsValue: '' },
      //     { paramsName: 'element', paramsValue: '' },
      //     { paramsName: 'value', paramsValue: '' },
      //     { paramsName: 'expect', paramsValue: '' },
      //     { paramsName: 'message', paramsValue: '' },
      //   ]
      // } else {
      //   this.form.step.config = [{ paramsName: '', paramsValue: '' }]
      // }
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.open = true
      this.editType = true
      this.showCopy = false
      this.form.id = row.id
      this.form.step.pid = row.caseId
      this.projectId = row.projectId
      this.submitType = 'add'
      this.formTitle = '新增步骤'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.editType = true
      this.showCopy = false
      this.submitType = 'edit'
      this.formTitle = '编辑步骤'
      this.form.sortType = 0
      this.showSort = false
      const params = { id: row.id, step: { id: row.stepId, pid: row.pid } }
      this.form.id = row.id
      getSenceStepInfo(params).then((response) => {
        const data = response?.data
        // console.info(data)
        this.form.step = Object.assign(this.form.step, data)
        // console.info(this.form.step)
      })
      this.projectId = row.projectId
    },
    /** 复制按钮操作 */
    handleCopy(row, stepList) {
      this.copyCaseList = stepList.map(item => ({ name: item.name, id: item.id }))
      this.open = true
      this.editType = true
      this.showCopy = true
      this.submitType = 'copy'
      this.formTitle = '复制步骤'
      this.form.sortType = 0
      this.showSort = false
      const params = { id: row.id, step: { id: row.stepId, pid: row.pid } }
      const params1 = { id: row.id, sysSceneCase: { id: row.pid } }
      this.form.id = row.id
      getSenceStepInfo(params).then((response) => {
        const data = response?.data
        this.form.step = Object.assign(this.form.step, data)
        this.form.step.copyPid = this.form.step.pid
        getSenceCaseInfo(params1).then((response) => {
          const { stepList } = response.data
          this.form.step.order = stepList.length?stepList.length+1:0
        })
      })
      this.projectId = row.projectId
    },
    // 增加配置信息
    addConfig(item, index) {
      this.form.step.config.push({
        paramsName: '',
        paramsValue: '',
      })
    },
    // 删除配置信息
    deleteConfig(item, index) {
      this.form.step.config.splice(index, 1)
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const operationName = this.findNodeId(this.stepOptions, this.form.step.action, 'name')
          this.$set(this.form.step, 'operationName', operationName)
          switch (this.submitType) {
            case 'add':
              const { step } = this.form
              const id = this.uuidv1()
              const stepInfo = { ...step, id }
              const params = { ...this.form, step: stepInfo }
              // 调用新增接口
              addSenceStep(params).then((response) => {
                this.$message.success('新增步骤成功')
                this.open = false
                const activeId = id
                this.$emit('updateStepList', activeId)
              })
              break
            case 'edit':
              // 调用编辑接口
              editSenceStep(this.form).then((response) => {
                this.$message.success('编辑步骤成功')
                this.open = false
                const { id: activeId } = this.form.step
                this.$emit('updateStepList', activeId)
              })
              break
            case 'copy':
              this.form.step.copyId = this.uuidv1()
              // 调用复制接口
              copySenceStepList(this.form).then((response) => {
                this.form.step.id = this.form.step.copyId
                this.form.sortType = 0
                editSenceStep(this.form).then((response) => {
                  this.$message.success('复制步骤成功')
                  this.open = false
                  const { id: activeId } = this.form.step
                  this.$emit('updateStepList', activeId)
                })
              })
              break
          }
        } else {
          this.$message.info('请检查必填项')
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.configForm {
  .ant-btn-circle {
    width: 30px;
    border-radius: 50%;
    min-width: 0;
    padding: 0 7px;
    line-height: 18px;
    text-align: center;
  }
}

.add-step-form {
  margin-left: 30px;

  ::v-deep .ant-form-item-label {
    margin-right: 10px;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>