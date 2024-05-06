<template>
  <div>
    <a-dropdown>
      <a-menu slot="overlay" @click="handleMenuClick">
        <a-menu-item key="1"> 场景用例 </a-menu-item>
        <a-menu-item key="2" disabled> 接口用例 </a-menu-item>
        <a-menu-item key="3" disabled> 性能用例 </a-menu-item>
      </a-menu>
      <a-button style="margin-left: 8px" type="primary"> 关联测试 <a-icon type="down" /> </a-button>
    </a-dropdown>
    <add-case-form
      v-if="showAddModal"
      ref="relevance"
      @ok="getList"
      @close="showAddModal = false"
      :activeCaseId="activeCaseId"
      :activeTable="activeTable"> </add-case-form>
    <advance-table
      :columns="columns"
      :data-source="list"
      title=" "
      :loading="loading"
      rowKey="id"
      @refresh="getList"
      size="middle"
      tableKey="case-relevance-index-table"
      :format-conditions="true"
    >
      <span slot="projectId" slot-scope="{ record }">
        {{ findNodeId(projectOptions,record.projectId,'project') }}
      </span>
      <span slot="versionId" slot-scope="{ record }">
        {{ findNodeId(versionOptions,record.versionId,'version') }}
      </span>
      <span slot="caseType" slot-scope="{ record }">
        {{ estateCaseTypeFormat(record) }}
      </span>
      <span slot="operation" slot-scope="{ record }">
        <a @click="cancelRelevant(record)" v-hasPermi="['projectSetting:environment:delete']"> 取消关联 </a>
      </span>
    </advance-table>
  </div>
</template>

<script>
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AddCaseForm from './AddCaseForm.vue'
export default {
  name: 'RelevanceList',
  props: {
    onSave: {
      type: Boolean
    },
    isHandleEdit: {
      type: Boolean,
      default: false
    },
   caseInfo: {
      type: Object
    }
  },
  components: { AdvanceTable, AddCaseForm },
  inject: ['projectOptions', 'versionOptions'],
  data() {
    return {
      activeTable: '',
      list: [],
      loading: false,
      caseTypeOptions: [],
      activeCaseId: '', // 关联场景的用例id
      showAddModal: false,
      columns: [
        {
          title: '用例名称',
          dataIndex: 'caseName',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '项目',
          dataIndex: 'projectId',
          ellipsis: true,
          scopedSlots: { customRender: 'projectId' },
          align: 'center'
        },
        {
          title: '版本',
          dataIndex: 'versionId',
          ellipsis: true,
          scopedSlots: { customRender: 'versionId' },
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'caseType',
          ellipsis: true,
          scopedSlots: { customRender: 'caseType' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ]
    }
  },
  watch: {
    'caseInfo.activeKey': {
      handler(val) {
        if (val && val !== '0' && this.caseInfo.content) {
          if (this.caseInfo.key === val) {
             const { id } = this.caseInfo.content
             this.activeCaseId = id
             this.getList()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.$http.get(`/dict/sys_normal_case-type`).then((response) => {
      this.caseTypeOptions = response.result.list
    })
  },
  methods: {
    getList() {
      console.log(this.activeCaseId)
      this.showAddModal = false
      this.loading = true
      this.$http.get(`/system/case/test`).then((response) => {
        this.list = response.result.list
        this.list.map((item) => {
          item.operation = item.remark
        })
        this.total = response.result.total
        this.loading = false
      })
    },
     estateCaseTypeFormat(row) {
      return this.selectDictLabel(this.caseTypeOptions, row.caseType)
    },
    handleButtonClick(e) {
      console.log('click left button', e)
    },
    // 下拉选择点击
    handleMenuClick(param) {
      if (!this.onSave && !this.isHandleEdit) {
        this.$message.info('请先保存，再关联')
        return
      }
      this.activeTable = param.key
      this.showAddModal = true
      const title = param.key === '1' ? '关联场景用例' : param.key === '2' ? '关联接口用例' : '关联性能用例'
      this.$nextTick(() => { this.$refs.relevance.handleRelevance(title) })
    },
    // 取消关联
    cancelRelevant(record) {
    }
  }
}
</script>

<style lang="less" scoped>
.advanced-table {
  min-height: calc(20vh - 100px)
}

</style>
