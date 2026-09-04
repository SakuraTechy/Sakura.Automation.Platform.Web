<template>
  <ant-modal
    modal-width="900"
    modal-height="760"
    :visible="open"
    modal-title="证书信息详情"
    :adjust-size="true"
    @cancel="cancel"
  >
    <div slot="content" class="detail-content">
      <a-row :gutter="24">
        <a-col v-for="item in infoItems" :key="item.key" :span="12" class="info-item">
          <strong>{{ item.label }}</strong>
          <span v-if="item.key === 'authModuleIds'" class="module-tags">
            <a-tag v-for="module in moduleItems" :key="module.id">{{ module.name }}</a-tag>
            <span v-if="!moduleItems.length">-</span>
          </span>
          <span v-else>{{ formatValue(certificate[item.key], item.key) }}</span>
        </a-col>
      </a-row>
      <a-divider />
      <div class="json-title">完整返回数据</div>
      <pre class="json-content">{{ formattedCertificate }}</pre>
    </div>
    <template slot="footer">
      <a-button type="primary" @click="cancel">确定</a-button>
    </template>
  </ant-modal>
</template>

<script>
import axios from 'axios'
import AntModal from '@/components/pt/dialog/AntModal'
import { getCertificateStatus } from './Config'

export default {
  name: 'CertificateDetail',
  components: { AntModal },
  props: {
    token: { type: String, default: '' },
    config: { type: Object, required: true }
  },
  data() {
    return {
      open: false,
      certificate: {},
      moduleItems: [],
      infoItems: [
        { key: 'licenseId', label: '证书ID' },
        { key: 'status', label: '状态' },
        { key: 'licenseNo', label: '证书编号' },
        { key: 'machineCode', label: '机器码' },
        { key: 'createBy', label: '申请人' },
        { key: 'createTime', label: '申请时间' },
        { key: 'submitByName', label: '提交人' },
        { key: 'submitTime', label: '提交时间' },
        { key: 'auditByName', label: '审批人' },
        { key: 'auditTime', label: '审批时间' },
        { key: 'customerName', label: '客户名称' },
        { key: 'customerShort', label: '客户简称' },
        { key: 'productName', label: '产品名称' },
        { key: 'versionName', label: '产品版本' },
        { key: 'modelName', label: '产品型号' },
        { key: 'shipmentModel', label: '出货型号' },
        { key: 'authDays', label: '授权天数' },
        { key: 'totalCount', label: '证书数量' },
        { key: 'effectDate', label: '授权生效' },
        { key: 'expiryDate', label: '授权结束' },
        { key: 'maintenanceExpiry', label: '维保结束' },
        { key: 'authModuleIds', label: '授权模块' },
        { key: 'perfConfig', label: '性能配置' }
      ]
    }
  },
  computed: {
    formattedCertificate() {
      return JSON.stringify(this.certificate, null, 2)
    }
  },
  methods: {
    cancel() {
      this.open = false
      this.$emit('close')
    },
    formatValue(value, key) {
      if (value === null || value === undefined || value === '') return '-'
      if (key === 'status') return getCertificateStatus(value)
      return typeof value === 'object' ? JSON.stringify(value) : value
    },
    normalizeList(data) {
      const value = data && data.data !== undefined ? data.data : data
      return Array.isArray(value) ? value : (value && (value.rows || value.list)) || []
    },
    getModuleIds(record) {
      if (Array.isArray(record.authModuleIdList)) return record.authModuleIdList.map(String)
      return String(record.authModuleIds || '').split(',').map(item => item.trim()).filter(Boolean)
    },
    async loadModuleItems(record) {
      const moduleIds = this.getModuleIds(record)
      this.moduleItems = moduleIds.map(id => ({ id, name: id }))
      if (!record.productId || !record.versionId || !moduleIds.length) return
      try {
        const endpoint = `${this.config.environment2.productModules}/${record.productId}/${record.versionId}`
        const response = await axios.get(`${this.config.environment2.url}${endpoint}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        const modules = this.normalizeList(response.data)
        const moduleMap = modules.reduce((result, module) => {
          result[String(module.moduleId)] = module.moduleName
          return result
        }, {})
        this.moduleItems = moduleIds.map(id => ({ id, name: moduleMap[id] || id }))
      } catch (error) {
        // Keep the IDs visible when the optional module-name request fails.
      }
    },
    handlePreview(record) {
      this.certificate = { ...record }
      this.moduleItems = []
      this.open = true
      this.loadModuleItems(record)
    }
  }
}
</script>

<style lang="less" scoped>
.detail-content {
  padding: 20px;
  background: #f4f8ff;
}
.info-item {
  display: flex;
  margin-bottom: 12px;
  line-height: 22px;
}
.info-item strong {
  flex: 0 0 90px;
  color: #555;
}
.info-item span {
  flex: 1;
  word-break: break-all;
}
.json-title {
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
}
.json-content {
  max-height: 210px;
  overflow: auto;
  padding: 12px;
  background: #fff;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
