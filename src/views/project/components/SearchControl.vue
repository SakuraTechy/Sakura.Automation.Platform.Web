<template>
  <div class="table-page-search-wrapper">
    <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-row :gutter="100">
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[0].label">
            <a-input v-model="queryParam[queryData[0].value]" :placeholder='`请输入${queryData[0].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[1].label">
            <a-input v-model="queryParam[queryData[1].value]" :placeholder='`请输入${queryData[1].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '所属项目'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-select v-model="queryParam[queryData[2].value]" placeholder='请选择' :defaultValue="0" allowClear>
              <a-select-option v-for="item in projectOptions" :key="item.id" :value='item.id'>
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '配置类型'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-select v-model="queryParam.type" :defaultValue=1 placeholder="请选择" allowClear>
              <a-select-option v-for="(item, value) in automationType" :key="value" :value="item.type">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7"
          v-if="queryData[2].label !== '所属项目' && queryData[2].label !== '数据库类型' && queryData[2].label !== '配置类型' && queryData[2].label !== '浏览器类型'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-input v-model="queryParam[queryData[2].value]" :placeholder='`请输入${queryData[2].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <!-- 环境列表 -->
        <a-col :md="7" v-if="queryData[2].label === '数据库类型'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-select v-model="queryParam.type" :defaultValue=1 placeholder="请选择" allowClear>
              <a-select-option v-for="(item, value) in dataBaseType" :key="value" :value="item.type">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label === '浏览器类型'">
          <a-form-item style="width: 450px" :label="queryData[2].label">
            <a-select v-model="queryParam.type" :defaultValue=1 placeholder="请选择" allowClear>
              <a-select-option v-for="(item, value) in browserType" :key="value" :value="item.type">
                {{ item.type }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button type="primary" :disabled="multiple" @click="handleQuery"><a-icon type="search" />查 询</a-button>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="100" v-if="queryData[3].label === '帐号类型'">
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[3].label">
            <a-select v-model="queryParam.type" :defaultValue=1 placeholder="请选择" allowClear>
              <a-select-option v-for="(item, value) in accountType" :key="value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[4].label">
            <a-select v-model="queryParam.status" :defaultValue=1 placeholder="请选择" allowClear>
              <a-select-option v-for="(d, index) in enableStatusOptions" :key="index" :value="d.id">
                {{ d.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[5].label">
            <a-input v-model="queryParam[queryData[5].value]" :placeholder='`请输入${queryData[5].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button :disabled="multiple" @click="resetQuery"><a-icon type="redo" />重 置</a-button>
          </span>
        </a-col>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[6].label">
            <a-range-picker v-model="queryParam.createTime" :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" @change='change' @ok="onOk" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="100" v-else>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[3].label">
            <!-- <a-select v-model:value="queryParam[queryData[3].value]" :defaultValue="2" placeholder="请选择">
              <a-select-option :value="2">
                全部
              </a-select-option>
              <a-select-option :value="1">
                已启用
              </a-select-option>
              <a-select-option :value="0">
                已关闭
              </a-select-option>
            </a-select> -->
            <a-select v-if="queryData[3].label === '启用状态'" v-model="queryParam.status" :defaultValue=1 placeholder="请选择"
              allowClear>
              <a-select-option v-for="(d, index) in enableStatusOptions" :key="index" :value="d.id">
                {{ d.label }}
              </a-select-option>
            </a-select>
            <a-select v-else-if="queryData[3].label === '使用状态'" v-model="queryParam.active.idle.status" :defaultValue=1
              placeholder="请选择" allowClear>
              <a-select-option v-for="(d, index) in useStatusOptions" :key="index" :value="d.idle">
                {{ d.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[4].label">
            <a-input v-model="queryParam[queryData[4].value]" :placeholder='`请输入${queryData[4].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item style="width: 450px" :label="queryData[5].label">
            <a-range-picker v-model="createTime" :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" @change='onOk' @ok="onOk" allow-clear />
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
import { enableStatusOptions, useStatusOptions } from '../components/Config.js'
import { accountType, dataBaseType } from '../environmentConfig/modules/EnvConfig.js'
import { automationType, browserType } from '../automationConfig/modules/Config.js'

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
    // multiple: {
    //   type: Boolean,
    // }
  },
  data() {
    return {
      multiple: false,
      enableStatusOptions,
      useStatusOptions,
      accountType,
      dataBaseType,
      automationType,
      browserType,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      createTime: undefined,
      queryParam: {
        projectId: '',
        status: undefined,
        type: undefined,
        createStartTime: '',
        createEndTime: '',
        active: {
          offline: {
            status: 1,
            offlineCauseReason: ''
          },
          idle: {
            status: undefined,
            executors: {
              url: '',
              user: ''
            }
          }
        }
      },
    }
  },
  created() {
    // console.log(this.$route)
    this.queryParam.projectId = this.$route.params.projectId
    this.queryParam.type = this.$route.params.type
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        // console.log(val,oldVal)
        this.queryParam.projectId = val.params.projectId
        this.queryParam.type = val.params.type
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
    handleQuery() {
      let queryParam = this.queryParam
      // console.log(queryParam)
      if (this.queryData[3].label === '启用状态'||this.queryData[4].label === '启用状态') {
        delete this.queryParam.active
        this.$emit('handleQuery', queryParam)
      } else {
        queryParam = {
          ...this.queryParam,
          active: {
            offline: {
              status: this.queryParam.active.idle.status < 2 ? 1 : 0,
            },
            idle: {
              status: this.queryParam.active.idle.status === 2 ? 1 : this.queryParam.active.idle.status
            }
          }
        }
        this.$emit('handleQuery', queryParam)
      }
    },
    resetQuery() {
      this.createTime = undefined
      this.queryParam = {
        status: undefined,
        type: undefined,
        createStartTime: '',
        createEndTime: '',
        active: {
          offline: {
            status: 1,
            offlineCauseReason: ''
          },
          idle: {
            status: undefined,
            executors: {
              url: '',
              user: ''
            }
          }
        }
      }
      this.$emit('resetQuery')
    },
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
  }
}
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: auto !important;
}
.ant-row {
  width: 100%;
}
</style>

