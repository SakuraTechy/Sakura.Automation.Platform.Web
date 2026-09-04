<template>
  <div class="table-page-search-wrapper">
    <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-row :gutter="100">
        <a-col :md="7" v-if="queryData[0].label === '产品名称'">
          <a-form-item style="width: 450px" :label="queryData[0].label">
            <a-select v-model="queryParam[queryData[0].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in projectOptions" :key="index" :value="item.productChName" @click="handleChangeProject(item)">
                {{ item.productChName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[1].label === '产品版本'">
          <a-form-item style="width: 450px" :label="queryData[1].label">
            <a-select v-model="queryParam[queryData[1].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in productVersions" :key="index" :value="item.productVersionNumber">
                {{ item.productVersionNumber }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '证书编号'">
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
        <a-col :md="7" v-if="queryData[3].label === '制作状态'">
          <a-form-item style="width: 450px" :label="queryData[3].label">
            <a-select v-model="queryParam[queryData[3].value]" placeholder="请选择" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(item, index) in certificateStateOptions" :key="index" :value="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[4]!==undefined&&queryData[4].label === '申请人'">
          <a-form-item style="width: 450px" :label="queryData[4].label">
            <a-input v-model="queryParam[queryData[4].value]" :placeholder='`请输入${queryData[4].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[5]!==undefined&&queryData[5].label === '申请时间'">
          <a-form-item style="width: 450px" :label="queryData[5].label">
            <a-range-picker v-model="queryParam[queryData[5].value]" :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" @change="change" @ok="onOk" allow-clear/>
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
import axios from 'axios'
import { certificateStateOptions } from './Config'

export default {
  name: 'SearchControl',
  props: {
    token: {
      type: String
    },
    queryData: {
      type: Array,
      required: true
    },
    projectOptions: {
      type: Array
    }
  },
  data() {
    return {
      multiple: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      productVersions: [],
      certificateStateOptions,
      approvalTime: undefined,
      queryParam: {
        productChName: undefined,
        productVersionId: undefined,
        machineCodeMd5: '',
        certificateState: undefined,
        name: '',
        createStartTime: '',
        createEndTime: ''
      }
    }
  },
  created() {
    // console.log(this.$route)
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        // console.log(val,oldVal)
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
    handleChangeProject(project) {
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      axios.get(buildUrl(this.$config.environment.productVersions + '?productId=' + project.productId), {
        headers: { 'Authorization': this.token }
      }).then((response) => {
        this.productVersions = response.data.data.list
      })
    },
    // 选择时间
    change(value) {
      // console.log(value);
      this.approvalTime = value
      this.queryParam.createStartTime = this.approvalTime[0]
      this.queryParam.createEndTime = this.approvalTime[1]
    },
    onOk(value) {
      // console.log(value);
      this.approvalTime = value
      this.queryParam.createStartTime = this.approvalTime[0]
      this.queryParam.createEndTime = this.approvalTime[1]
    },
    handleQuery() {
      const queryParam = this.queryParam
      // console.log(queryParam)
      this.$emit('handleQuery', queryParam)
    },
    resetQuery() {
      this.approvalTime = undefined
      this.queryParam = {
        productChName: undefined,
        productVersionId: undefined,
        machineCodeMd5: '',
        certificateState: undefined,
        name: '',
        createStartTime: '',
        createEndTime: ''
      }
      this.$emit('resetQuery')
    }
  }
}
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: auto !important;
}
</style>
