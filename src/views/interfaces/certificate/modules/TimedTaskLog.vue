<template>
  <ant-modal
    modalWidth="1000"
    modalHeight="925"
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    @cancel="cancel"
  >
    <div slot="content" style="background-color: #f4f8ff; padding: 20px;">
      <a-row type="flex" justify="center">
        <a-col :span="24">
          <div v-for="(item, index) in infoItems" :key="index" class="info-item">
            <strong>{{ item.label }}:</strong>
            <span>{{ item.value }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
    <template slot="footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="cancel">
        {{ okButton }}
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
import AntModal from '@/components/pt/dialog/AntModal'
import axios from 'axios'

export default {
  name: 'CreateForm',
  props: {
    token: {
      type: String
    }
  },
  components: {
    AntModal
  },
  data() {
    return {
      open: false,
      formTitle: '',
      okButton: '确定',
      certificate: undefined,
      infoItems: [
        { id: 'clientInfo.fullName', label: '客户名称', value: '' },
        { id: 'clientInfo.agent', label: '代理商', value: '' },
        { id: 'orderId', label: '订单编号', value: '' },
        { id: 'applyTotal', label: '申请总数', value: '' },
        { id: 'maxInstance', label: '最大实例数', value: '' },
        { id: 'maxPerformance', label: '流量限制', value: '' },
        { id: 'product.productChName', label: '产品名称', value: '' },
        { id: 'productVersion.productVersionNumber', label: '版本号', value: '' },
        { id: 'agent', label: '在线数据量', value: '' },
        { id: 'modelType', label: '授权模块', value: '' },
        { id: 'maintenanceWarnDate', label: '维保期限', value: '' },
        { id: 'technicalName', label: '技术服务', value: '' },
        { id: 'certificateState', label: '状态', value: '' },
        { id: 'makeUser.name', label: '制作人', value: '' },
        { id: 'makeTime', label: '制作时间', value: '' },
        { id: 'approvalUser.name', label: '审批人', value: '' },
        { id: 'approvalTime', label: '审批时间', value: '' },
        { id: 'approvalOpinion', label: '审批意见', value: '' },
        { id: 'licenseMakeNumber', label: '证书制作次数', value: '' },
        { id: 'desenTaskConcNum', label: '脱敏任务并发数', value: '' },
        { id: 'wmTaskConcNum', label: '水印任务并发数', value: '' },
        // { id: 'description', label: '描述', value: '' },
        { id: 'machineCodeMd5', label: '证书码编号', value: '' },
        { id: 'machineCode', label: '机器码', value: '' }
      ]
}
  },
  filters: {},
  created() {

  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    cancel() {
      this.open = false
      this.$emit('close')
    },
    async getList(record) {
      const buildUrl = (endpoint) => `${this.$config.environment.url}${endpoint}`
      await axios.get(buildUrl(this.$config.environment.details + '?certificateId=' + record.certificateId), {
        headers: { 'Authorization': this.token }
      }).then((response) => {
        this.certificate = response.data.data.certificate
        this.updateInfoItems(this.certificate, this.infoItems)
      })
    },
    updateInfoItems1(infoItem, infoItems) {
      infoItems.forEach(item => {
        const path = item.id.split('.')
        let current = infoItem
        for (const key of path) {
          const timeKeys = ['maintenanceWarnDate', 'makeTime', 'approvalTime']
          if (timeKeys.includes(key)) {
            if (current[key]) {
              current = this.parseTime(current[key])
            } else {
              current = '-'
            }
          } else {
            if (current[key]) {
              current = current[key]
            } else {
              current = '-'
            }
          }
        }
        item.value = current
      })
    },
    updateInfoItems(infoItem, infoItems) {
      infoItems.forEach(item => {
        const path = item.id.split('.')
        let current = infoItem
        for (const key of path) {
          current = (['maintenanceWarnDate', 'makeTime', 'approvalTime'].includes(key) && current[key]) ? this.parseTime(current[key]) : current[key] ?? '-'
        }
        item.value = current
      })
    },
    handlePreview(record) {
      this.getList(record)
      this.open = true
      this.formTitle = '证书信息详情'
    }
  }
}
</script>

<style lang="less" scoped>
.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px; /* 可选：为每个信息项之间添加间距 */
}

.info-item strong {
  font-weight: bold;
  min-width: 105px; /* 可选：设定标签的最小宽度以保持一致性 */
  margin-right: 120px; /* 为标签和值之间添加间距 */
}

.info-item span {
  flex-grow: 1; /* 让 span 占据剩余空间 */
  word-break: break-all; /* 允许长单词换行 */
}
</style>
