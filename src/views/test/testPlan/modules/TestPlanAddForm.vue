<template>
  <ant-modal
    modalWidth="650"
    modalHeight="720"
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    @cancel="cancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      slot="content"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="所属项目" prop="projectId">
        <a-select v-model="form.projectId" placeholder="请选择" option-filter-prop="children" show-search allowClear>
          <a-select-option v-for="(item, index) in projectOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="计划类型" prop="type">
        <a-select v-model="form.type" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(item, index) in testPlanTypeOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="计划名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="计划简称" prop="abbreviate">
        <a-input v-model="form.abbreviate" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="计划描述" prop="description">
        <a-input v-model="form.description" placeholder="请输入" type="textarea" allow-clear :rows="2" />
      </a-form-model-item>
      <a-form-model-item label="计划成员" prop="memberIds">
        <a-select mode="multiple" v-model="form.memberIds" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(item, index) in memberOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="主负责人" prop="principalIds">
        <a-select mode="multiple" v-model="form.principalIds" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(item, index) in memberOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="计划时间" prop="planTime">
        <a-range-picker v-model="form.planTime" :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" @change="change" @ok="onOk" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="计划状态" prop="status">
        <a-select v-model="form.status" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(item, index) in testPlanStatusOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm">
        {{ this.okButton }}
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
// import TestPlanForm from './TestPlanForm'
// export default {
//   ...TestPlanForm,
// }
import AntModal from '@/components/pt/dialog/AntModal'
import * as api from '@/api/api'
import { testPlanTypeOptions, testPlanStatusOptions } from '../../components/Config'
import log from '@/utils/log'

export default {
  name: 'CreateForm',
  props: {
    projectOptions: {
      type: Array,
    },
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
        projectId: undefined,
        type: undefined,
        id: '',
        name: '',
        abbreviate: '',
        description: '',
        memberIds: [],
        principalIds: [],
        planTime: [],
        plannedStartTime: '',
        plannedEndTime: '',
        status: "0",
        environmentConfig: '',
        automationConfig: '',
        uiTestCase: '',
      },
      open: false,
      rules: {
        projectId: [{ required: true, message: `项目不能为空`, trigger: 'blur' }],
        type: [{ required: true, message: `类型不能为空`, trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        abbreviate: [{ required: true, message: '简称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        memberIds: [{ required: true, message: '成员不能为空', trigger: 'blur' }],
        principalIds: [{ required: true, message: `负责人不能为空`, trigger: 'blur' }],
        planTime: [{ required: true, message: `时间不能为空`, trigger: 'blur' }],
      },
    }
  },
  filters: {},
  created() {},
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.$emit('close')
    },
    resetForm() {
      this.form = {
        projectId: undefined,
        type: undefined,
        id: '',
        name: '',
        abbreviate: '',
        description: '',
        memberIds: [],
        principalIds: [],
        planTime: [],
        plannedStartTime: '',
        plannedEndTime: '',
        status: "0",
        environmentConfig: '',
        automationConfig: '',
        uiTestCase: '',
      }
    },
    // 选择时间
    change(value) {
      // console.log(value);
      // this.form.planTime = value
    },
    onOk(value) {
      // console.log(value);
      this.form.planTime = value
      this.form.plannedStartTime = this.form.planTime[0]
      this.form.plannedEndTime = this.form.planTime[1]
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.formTitle = '新建测试计划'
      this.resetForm()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.formTitle = '修改测试计划'
      this.okButton = '确定'
      this.form = Object.assign(this.form, row)
      this.form.memberIds = []
      row.memberList.forEach((item, index) => {
        this.form.memberIds.push(item.id)
      })
      this.form.principalIds = []
      row.principalList.forEach((item, index) => {
        this.form.principalIds.push(item.id)
      })
      this.form.planTime = []
      this.form.planTime.push(row.plannedStartTime)
      this.form.planTime.push(row.plannedEndTime)
    },
    handleCopy(row) {
      this.open = true
      this.formTitle = '复制测试计划'
      this.okButton = '确定'
      this.form = Object.assign(this.form, row)
      this.form.id = ''
      this.form.uiTestScene = ''
      this.form.memberIds = []
      row.memberList.forEach((item, index) => {
        this.form.memberIds.push(item.id)
      })
      this.form.principalIds = []
      row.principalList.forEach((item, index) => {
        this.form.principalIds.push(item.id)
      })
      this.form.planTime = []
      this.form.planTime.push(row.plannedStartTime)
      this.form.planTime.push(row.plannedEndTime)
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.form.id === '') {
            api.addTestPlan(this.form).then((response) => {
              this.$message.success('新增成功')
              this.open = false
              this.$emit('ok')
            })
          } else {
            api.updateTestPlan(this.form).then((response) => {
              this.$message.success('修改成功')
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
</script>
