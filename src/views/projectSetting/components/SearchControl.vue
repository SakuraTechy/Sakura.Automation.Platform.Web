<template>
  <div class="table-page-search-wrapper">
    <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-row :gutter="48">
        <a-col :md="7">
          <a-form-item :label="queryData[0].label">
            <a-input v-model="queryParam[queryData[0].value]" :placeholder='`请输入${queryData[0].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item :label="queryData[1].label">
            <a-input v-model="queryParam[queryData[1].value]" :placeholder='`请输入${queryData[1].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-if="queryData[2].label !== '所属项目'">
          <a-form-item :label="queryData[2].label">
            <a-input v-model="queryParam[queryData[2].value]" :placeholder='`请输入${queryData[2].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" v-else>
          <a-form-item :label="queryData[2].label">
            <a-select v-model="queryParam[queryData[2].value]" :defaultValue="0">
              <a-select-option v-for="item in projectData" :key="item.value" :value='item.value' >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="7">
          <a-form-item :label="queryData[3].label">
            <a-select v-model="queryParam[queryData[3].value]" :defaultValue="2">
              <a-select-option :value='2'>
                全部
              </a-select-option>
              <a-select-option :value="1">
                已启用
              </a-select-option>
              <a-select-option :value="0">
                已关闭
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item :label="queryData[4].label">
            <a-input v-model="queryParam[queryData[4].value]" :placeholder='`请输入${queryData[4].label}`' allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item label="创建时间">
            <a-range-picker
              :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              @ok="onOk"
            />
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button @click="resetQuery"><a-icon type="redo" />重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'SearchControl',
  props: {
    queryData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      queryParam: {},
      // mock
      projectData: [
        {
          label: '全部',
          value: 0
        },
        {
          label: 'AAS-DM',
          value: 'AAS-DM'
        },
        {
          label: 'AAS-DBSG',
          value: 'AAS-DBSG'
        },
      ]
    }
  },
  methods: {
    handleQuery: function () {
      this.$emit('handleQuery', this.queryParam)
    },
    resetQuery: function () {
      this.queryParam = {}
      this.$emit('resetQuery')
    },
    onOk(value){
      this.queryParam.createStartTime = value[0]
      this.queryParam.createEndTime = value[1]
    },
  }
}
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: auto !important;
}
</style>

