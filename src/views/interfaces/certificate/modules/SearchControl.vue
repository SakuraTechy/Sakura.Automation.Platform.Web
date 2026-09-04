<template>
  <div class="table-page-search-wrapper">
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-row :gutter="100">
        <a-col :md="7" :sm="12">
          <a-form-item label="产品名称">
            <a-select
              v-model="query.productId"
              placeholder="请选择"
              allow-clear
              show-search
              option-filter-prop="children"
              @change="handleProductChange">
              <a-select-option v-for="item in projectOptions" :key="item.productId" :value="item.productId">
                {{ item.productName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="12">
          <a-form-item label="产品版本">
            <a-select v-model="query.versionId" placeholder="请选择" allow-clear show-search option-filter-prop="children">
              <a-select-option v-for="item in productVersions" :key="item.versionId" :value="item.versionId">
                {{ item.versionNo }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="12">
          <a-form-item label="证书编号">
            <a-input v-model="query.licenseNo" placeholder="请输入证书编号" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="3" :sm="24">
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="handleQuery"><a-icon type="search" />查 询</a-button>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :md="7" :sm="12">
          <a-form-item label="制作状态">
            <a-select v-model="query.status" placeholder="请选择" allow-clear>
              <a-select-option v-for="item in statusOptions" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="12">
          <a-form-item label="申请人">
            <a-input v-model="query.createBy" placeholder="请输入申请人" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="12">
          <a-form-item label="申请时间">
            <a-range-picker
              v-model="query.createTimeRange"
              :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始日期', '结束日期']"
              allow-clear
              @change="handleDateChange"
            />
          </a-form-item>
        </a-col>
        <a-col :md="3" :sm="24">
          <span class="table-page-search-submitButtons">
            <a-button @click="resetQuery"><a-icon type="redo" />重 置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import axios from 'axios'
import { certificateStatusOptions } from './Config'

export default {
  name: 'SearchControl',
  props: {
    token: { type: String, default: '' },
    config: { type: Object, required: true },
    projectOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      productVersions: [],
      statusOptions: certificateStatusOptions,
      query: {
        productId: undefined,
        versionId: undefined,
        licenseNo: '',
        status: undefined,
        createBy: '',
        createStartTime: '',
        createEndTime: '',
        createTimeRange: []
      }
    }
  },
  methods: {
    buildUrl(endpoint) {
      return `${this.config.environment2.url}${endpoint}`
    },
    async handleProductChange(productId) {
      this.query.versionId = undefined
      this.productVersions = []
      if (!productId) return
      try {
        const response = await axios.get(this.buildUrl(this.config.environment2.productVersions), {
          params: { productId, pageNum: 1, pageSize: 9999 },
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.productVersions = this.normalizeVersionList(response.data)
      } catch (error) {
        this.$message.error('获取产品版本失败')
      }
    },
    normalizeList(data) {
      const value = data && data.data !== undefined ? data.data : data
      return Array.isArray(value) ? value : (value && (value.rows || value.list)) || []
    },
    normalizeVersionList(data) {
      return this.normalizeList(data)
        .filter(item => String(item.certVersion || '').trim() !== '')
        .sort((left, right) => this.compareVersionNo(left.versionNo, right.versionNo))
    },
    compareVersionNo(left, right) {
      const leftParts = String(left || '').replace(/^v/i, '').split('.')
      const rightParts = String(right || '').replace(/^v/i, '').split('.')
      const length = Math.max(leftParts.length, rightParts.length)
      for (let index = 0; index < length; index++) {
        const leftPart = leftParts[index] || ''
        const rightPart = rightParts[index] || ''
        const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : null
        const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : null
        if (leftNumber !== null && rightNumber !== null && leftNumber !== rightNumber) return rightNumber - leftNumber
        if (leftPart !== rightPart) return rightPart.localeCompare(leftPart, undefined, { numeric: true, sensitivity: 'base' })
      }
      return 0
    },
    handleDateChange(value) {
      this.query.createStartTime = value && value[0] ? value[0] : ''
      this.query.createEndTime = value && value[1] ? value[1] : ''
    },
    handleQuery() {
      const { createTimeRange, ...query } = this.query
      this.$emit('handleQuery', query)
    },
    resetQuery() {
      this.query = {
        productId: undefined,
        versionId: undefined,
        licenseNo: '',
        status: undefined,
        createBy: '',
        createStartTime: '',
        createEndTime: '',
        createTimeRange: []
      }
      this.productVersions = []
      this.$emit('resetQuery')
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 0;
}
.table-page-search-submitButtons {
  display: block;
  padding-top: 4px;
  text-align: right;
}
.ant-calendar-picker {
  width: 100% !important;
}
</style>
