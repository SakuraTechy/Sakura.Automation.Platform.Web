<template>
  <ant-modal
    modalWidth="630"
    modalHeight="715"
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
      <a-form-model-item label="所属计划" prop="testPlanId">
        <a-select v-model="form.testPlanId" placeholder="请选择" option-filter-prop="children" show-search allowClear>
          <a-select-option v-for="(item, index) in testPlanOptions" :key="index" :value="item.id" @click="getSceneList(item)">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="任务类型" prop="type">
        <a-select v-model="form.type" placeholder="请选择" option-filter-prop="children" show-search allowClear>
          <a-select-option v-for="(item, index) in timedTaskTypeOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="任务名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="任务描述" prop="description">
        <a-input v-model="form.description" placeholder="请输入" type="textarea" allow-clear :rows="2" />
      </a-form-model-item>
      <!-- <a-form-model-item label="运行环境" prop="runEnvironment">
        <a-select
          v-model="form.runEnvironment"
          placeholder="请选择"
          option-filter-prop="children"
          show-search
          allowClear
        >
          <a-select-option
            v-for="(item, index) in timedTaskRunEnvironmentOptions"
            :key="index"
            :value="item.id"
            @click="handleRunEnvironment(item)"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item> -->
      <a-form-model-item label="运行环境" prop="runEnvironment">
        <a-radio-group v-model="form.runEnvironment" button-style="solid">
          <!-- <a-radio-button value="1">产品环境</a-radio-button>
          <a-radio-button value="2">自动化环境</a-radio-button> -->
          <a-radio-button v-for="(item, index) in timedTaskRunEnvironmentOptions" :key="index" :value="item.id" @click="handleRunEnvironment(item)">
            {{ item.name }}
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="运行规则" prop="cronExpression">
        <div style="display: flex; align-items: center">
          <a-input v-model="form.cronExpression" placeholder="请输入cron执行表达式" />
          <a-tooltip title="Cron在线表达式生成器，点击查看">
            <a-tag style="margin-left: 8px" color="#108ee9">
              <a href="https://cron.ciding.cc/" target="_blank">cron表达式</a>
            </a-tag>
          </a-tooltip>
        </div>
        <!-- <a-input v-model="form.cronExpression" placeholder="请输入">
          <template #prefix>
            <user-outlined />
          </template>
          <template #suffix>
            <a-tooltip title="Cron在线表达式生成器，点击查看">
              <a-tag color="#108ee9">
                <a href="https://cron.ciding.cc/" target="_blank">cron表达式</a>
              </a-tag>
            </a-tooltip>
          </template>
        </a-input> -->
      </a-form-model-item>
      <a-form-model-item label="是否并发" prop="concurrent">
        <a-radio-group v-model="form.concurrent" button-style="solid">
          <a-radio-button value="0">允许</a-radio-button>
          <a-radio-button value="1">禁止</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="错误策略" prop="misfirePolicy">
        <a-radio-group v-model="form.misfirePolicy" button-style="solid">
          <a-radio-button value="1">立即执行</a-radio-button>
          <a-radio-button value="2">执行一次</a-radio-button>
          <a-radio-button value="3">放弃执行</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="任务状态" prop="status">
        <!-- <a-select v-model="form.status" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(item, index) in timedTaskStatusOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select> -->
        <a-radio-group style="margin-top: 5px" v-model="form.status" button-style="solid">
          <a-radio v-for="(item, index) in timedTaskStatusOptions" :key="index" :value="item.id">{{
            item.name
          }}</a-radio>
        </a-radio-group>
        <!-- <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button value="0">开启</a-radio-button>
          <a-radio-button value="1">关闭</a-radio-button>
        </a-radio-group> -->
      </a-form-model-item>
      <!-- 执行测试场景弹窗 -->
      <executScenceForm 
        ref="executScenceForm" 
        :testPlan="form.testPlan"
        :sceneList="sceneList"
      />
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
import AntModal from '@/components/pt/dialog/AntModal'
import * as api from '@/api/api'
import * as automationApis from '@/api/ui'
import { timedTaskTypeOptions, timedTaskStatusOptions, timedTaskRunEnvironmentOptions } from '../../components/Config'
import executScenceForm from '@/views/ui/automation/modules/executScenceForm.vue'
import log from '@/utils/log'
import { browserQueryData } from '@/views/project/automationConfig/modules/Config'

export default {
  name: 'CreateForm',
  props: {
    testPlanOptions: {
      type: Array,
    },
  },
  components: {
    AntModal,
    executScenceForm,
  },
  data() {
    return {
      okButton: '立即创建',
      loading: false,
      formTitle: '',
      timedTaskTypeOptions,
      timedTaskStatusOptions,
      timedTaskRunEnvironmentOptions,
      switchStatus: true,
      // 表单参数
      form: {
        testPlan: {
          id: undefined,
          name: '',
        },
        testPlanId: '',
        type: undefined,
        id: '',
        name: '',
        description: '',
        runEnvironment: '',
        cronExpression: '',
        concurrent: '1',
        misfirePolicy: '1',
        status: '0',
        createBy: '',
      },
      sceneList: [],
      open: false,
      rules: {
        testPlanId: [{ required: true, message: `计划不能为空`, trigger: 'blur' }],
        type: [{ required: true, message: `类型不能为空`, trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        runEnvironment: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
        cronExpression: [{ required: true, message: '规则不能为空', trigger: 'blur' }],
      },
    }
  },
  filters: {},
  created() {
    
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.$emit('close')
    },
    resetForm() {
      this.form = {
        testPlanId: undefined,
        type: undefined,
        id: '',
        name: '',
        description: '',
        runEnvironment: '',
        cronExpression: '',
        concurrent: '1',
        misfirePolicy: '1',
        status: '0',
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
      this.formTitle = '新建定时任务'
      this.resetForm()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.formTitle = '修改定时任务'
      this.okButton = '确定'
      this.form = Object.assign(this.form, row)
      this.testPlanOptions.forEach((item) => {
        if (item.id === this.form.testPlanId) {
          this.form.testPlan = item
        }
      })
      this.getSceneList(this.form.testPlan)
    },
    handleCopy(row) {
      this.open = true
      this.formTitle = '复制定时任务'
      this.okButton = '确定'
      this.form = Object.assign(this.form, row)
      this.testPlanOptions.forEach((item) => {
        if (item.id === this.form.testPlanId) {
          this.form.testPlan = item
        }
      })
      this.getSceneList(this.form.testPlan)
      this.form.id = ''
    },
    getSceneList(testPlan){
      this.form.testPlan = testPlan
      const queryParam = {
        name: this.form.testPlan.name
      }
      api.getTestPlanList(queryParam).then((response) => {
        var uiTestScene = response.data.list[0].uiTestScene
        uiTestScene = uiTestScene.substring(1, uiTestScene.length - 1).split(',');
        uiTestScene = uiTestScene.map(scene => scene.trim());
        this.sceneList = []
        uiTestScene.forEach(id => {
          if(id){
            automationApis.getScenceInfo(id).then((response) => {
            if(response.data){
                this.$delete(response.data, 'caseMsg')
                this.$delete(response.data, 'debugRecord')
                this.$delete(response.data, 'testRecord')
                this.sceneList.push(response.data)
              }
            })
          }else{
            this.$message.warning('测试计划关联测试场景为空，请先关联测试场景!')
          }
        })
        this.sceneList.sort((a, b) => a.sceneId - b.sceneId);
        console.log(this.sceneList);
      })
    },
    handleRunEnvironment(key) {
      // console.log('当前选中的选项值为：', key);
      const type = {
        id: '4',
        name: '定时任务'
      }
      if(this.form.testPlanId===undefined){
        this.$message.warning('请先选择所属计划!')
      }else if(this.sceneList.length<1){
        this.$message.warning('测试计划关联测试场景为空，请先关联测试场景!')
      }else{
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(undefined,key.id,type)
        })
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log(this.form)
          if (this.form.id === '') {
            api.addTimedTask(this.form).then((response) => {
              this.$message.success('新增成功')
              this.open = false
              this.$emit('ok')
              this.form.runEnvironment=''
            })
          } else {
            api.updateTimedTask(this.form).then((response) => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
              this.form.runEnvironment=''
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

<style lang="less" scoped>
// ::v-deep .ant-input-affix-wrapper .ant-input:not(:last-child) {
//   padding-right: 100px;
// }
// ::v-deep .ant-input-affix-wrapper .ant-input-suffix {
//   right: 3px;
// }
</style>
