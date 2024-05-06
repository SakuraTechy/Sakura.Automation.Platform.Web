<template>
  <div class="table-page-search-wrapper">
    <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-row :gutter="100">
        <a-col :md="7" v-if="queryData[0].label === 'ID'">
          <a-form-item style="width: 450px" :label="queryData[0].label">
            <a-input v-model="queryParam[queryData[0].value]" :placeholder='`请输入${queryData[0].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[0].label === '所属项目'">
          <a-form-item style="width: 450px" :label="queryData[0].label">
            <a-select v-model="queryParam[queryData[0].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in projectOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[0].label === '所属计划'">
          <a-form-item style="width: 450px" :label="queryData[0].label">
            <a-select v-model="queryParam[queryData[0].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in testPlanOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[1].label === '所属计划'">
          <a-form-item style="width: 450px" :label="queryData[1].label">
            <a-select v-model="queryParam[queryData[1].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in testPlanOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[1].label === '计划类型'">
          <a-form-item style="width: 450px" :label="queryData[1].label">
            <a-select v-model="queryParam[queryData[1].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in testPlanTypeOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[1].label === '任务类型'">
          <a-form-item style="width: 450px" :label="queryData[1].label">
            <a-select v-model="queryParam[queryData[1].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in timedTaskTypeOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '任务类型'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-select v-model="queryParam[queryData[2].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in timedTaskTypeOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '计划名称'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-input v-model="queryParam[queryData[2].value]" :placeholder='`请输入${queryData[2].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '报告名称'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-input v-model="queryParam[queryData[2].value]" :placeholder='`请输入${queryData[2].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '任务名称'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-input v-model="queryParam[queryData[2].value]" :placeholder='`请输入${queryData[2].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button type="primary" :disabled="multiple" @click="handleQuery"><a-icon type="search" />查 询</a-button>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :md="7" v-if="queryData[3].label === '任务名称'">
          <a-form-item style="width: 450px" :label="queryData[3].label">
            <a-input v-model="queryParam[queryData[3].value]" :placeholder='`请输入${queryData[3].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[3].label === '计划状态'">
          <a-form-item style="width: 450px" :label="queryData[3].label">
            <a-select v-model="queryParam[queryData[3].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in testPlanStatusOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[3].label === '任务状态'">
          <a-form-item style="width: 450px" :label="queryData[3].label">
            <a-select v-model="queryParam[queryData[3].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in timedTaskStatusOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[3].label === '执行方式'">
          <a-form-item style="width: 450px" :label="queryData[3].label">
            <a-select v-model="queryParam[queryData[3].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in testReportExecutionModeOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[4].label === '执行状态'">
          <a-form-item style="width: 450px" :label="queryData[4].label">
            <a-select v-model="queryParam[queryData[4].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in timedTaskExecStatusOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[4].label === '创建人'">
          <a-form-item style="width: 450px" :label="queryData[4].label">
            <a-select v-model="queryParam[queryData[4].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[5].label">
            <a-range-picker v-model="createTime" :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" @change="change" @ok="onOk" allow-clear />
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button :disabled="multiple" @click="resetQuery"><a-icon type="redo" />重 置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import log from '@/utils/log.js'
import { testPlanTypeOptions, timedTaskTypeOptions, testPlanStatusOptions, timedTaskStatusOptions,testReportExecutionModeOptions,timedTaskExecStatusOptions } from '../components/Config.js'

export default {
  name: 'SearchControl',
  props: {
    queryData: {
      type: Array,
      required: true
    },
    projectOptions: {
      type: Array,
    },
    testPlanOptions: {
      type: Array,
    },
    memberOptions: {
      type: Array,
      required: true
    },
    // multiple: {
    //   type: Boolean,
    // }
  },
  data() {
    return {
      multiple: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      testPlanTypeOptions,
      timedTaskTypeOptions,
      testPlanStatusOptions,
      timedTaskStatusOptions,
      timedTaskExecStatusOptions,
      testReportExecutionModeOptions,
      createTime: undefined,
      queryParam: {
        name: '',
        projectId: '',
        testPlanId: undefined,
        executionMode: undefined,
        type: undefined,
        status: undefined,
        createStartTime: '',
        createEndTime: '',
      },
    }
  },
  created() {
    // console.log(this.$route)
    this.queryParam.projectId = this.$route.params.projectId
    this.queryParam.type = this.$route.params.type
    this.queryParam.name = this.$route.params.name
    this.queryParam.testPlanId = this.$route.params.testPlanId
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        // console.log(val,oldVal)
        this.queryParam.projectId = val.params.projectId
        this.queryParam.type = val.params.type
        this.queryParam.name = val.params.name
        this.queryParam.testPlanId = val.params.testPlanId
      },
      // 深度观察监听
      deep: true
    },
    queryParam: {
      handler(newVal, oldVal) {
        // console.info(newVal, oldVal)
        this.handleQuery()
      },
      deep: true
    }
  },
  methods: {
    // 选择时间
    change(value) {
      // console.log(value);
      // this.createTime = value
    },
    onOk(value) {
      // console.log(value);
      this.createTime = value
      this.queryParam.createStartTime = this.createTime[0]
      this.queryParam.createEndTime = this.createTime[1]
    },
    handleQuery() {
      let queryParam = this.queryParam
      // console.log(queryParam)
      this.$emit('handleQuery', queryParam)
    },
    resetQuery() {
      this.createTime = undefined
      this.queryParam = {
        type: undefined,
        status: undefined,
        createStartTime: '',
        createEndTime: '',
      }
      this.$emit('resetQuery')
    },
  }
}
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: auto !important;
}
</style>

