<template>
  <div class="table-page-search-wrapper">
    <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-item label="用例名称">
            <a-input
              v-model="searchParam.caseName"
              placeholder="请输入用例名称"
              allow-clear
              @keyup.enter.native="handleQuery"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="版本号">
            <a-select v-model="searchParam.versionId" placeholder="请选择" style="width: 220px">
              <a-select-option v-for="(d, index) in versionOptions" :key="index" :value="d.id">
                {{ d.version }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24" v-if="advanced">
          <a-form-item label="用例等级">
            <a-select v-model="searchParam.estate" placeholder="请选择" style="width: 220px">
              <a-select-option v-for="(d, index) in estateOptions" :key="index" :value="d.dictValue">
                {{ d.dictLabel }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="用例状态" v-if="advanced">
            <a-select v-model="searchParam.status" placeholder="请选择" style="width: 220px">
              <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.dictValue">
                {{ d.dictLabel }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'CaseSearch',
  props: {
    estateOptions: {
      type: Array
    },
    statusOptions: {
      type: Array
    },
    versionOptions: {
      type: Array
    }
  },
  data() {
    return {
      advanced: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      searchParam: {
        caseName: '',
        versionId: '',
        estate: '',
        status: ''
      }
    }
  },
  watch: {
    searchParam: {
      handler(val) {
        this.$emit('changeParam', val)
      },
      deep: true
    }
  },
  methods: {
    handleQuery() {
      this.$emit('handleQuery')
    },
    resetQuery() {
      this.searchParam = {
        caseName: '',
        versionId: '',
        estate: '',
        status: ''
      }
      this.$emit('resetQuery')
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    }
  }
}
</script>
