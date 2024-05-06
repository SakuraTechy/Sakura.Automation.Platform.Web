<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="false"
    @cancel="cancel"
    modalWidth="1200"
    modalHeight="700"
  >
    <template slot="content">
      <div>
        <a-row type="flex" :gutter="10">
          <a-col :span="6">
            <a-card :bordered="false" style="min-height: calc(93vh - 125px)">
              <tree-list :treeData="treeData" @onClick="onClick" :disabled="true"></tree-list>
            </a-card>
          </a-col>
          <a-col :span="18">
            <a-card :bordered="false" style="min-height: calc(93vh - 125px)">
              <add-case-search
                :estateOptions="estateOptions"
                :statusOptions="statusOptions"
                :version-options="versionOptions"
                @handleQuery="handleQuery"
                @changeParam="changeParam"
                @resetQuery="resetQuery"></add-case-search>
              <a-divider></a-divider>
              <advance-table
                :columns="columns"
                :data-source="list"
                title="关联用例"
                :loading="loading"
                rowKey="id"
                @refresh="getList"
                size="middle"
                tableKey="add-case-index-table"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :format-conditions="true"
                :pagination="{
                  current: queryParam.pageNum,
                  pageSize: queryParam.pageSize,
                  total: total,
                  showSizeChanger: true,
                  showLessItems: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                  onChange: changeSize,
                  customRow: onClickRow,
                  onShowSizeChange: onSizeChange,
                }"
              >
                <div class="table-operations" slot="button">
                  <span style="margin-right:10px;font-weight:600">已选中 {{ selectTotal }} 条数据</span>
                  <a-button
                    type="primary"
                    :disabled="multiple"
                    @click="handleSure"
                    v-hasPermi="['projectSetting:environment:delete']"
                  >
                    确 定
                  </a-button>
                </div>
                <span
                  slot="estate"
                  slot-scope="{ record }"
                >
                  {{ estateTypeFormat(record) }}
                </span>
                <span
                  slot="status"
                  slot-scope="{ record }"
                >
                  {{ statusTypeFormat(record) }}
                </span>
              </advance-table>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </template>
    <template slot="footer">
      <div></div>
    </template>
  </ant-modal>
</template>

<script>
import TreeList from '@/components/pt/tree/TreeList.vue'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AntModal from '@/components/pt/dialog/AntModal'
import { columns } from './changeColumn'
import AddCaseSearch from '../../components/addCaseSearch.vue'
export default {
  name: 'AddCaseForm',
  props: {
    activeTable: {
      type: String
    },
    activeCaseId: {
      type: String
    }
  },
  inject: ['versionOptions'],
  components: { AntModal, TreeList, AdvanceTable, AddCaseSearch },
  data() {
    return {
      open: false,
      formTitle: '',
      activeId: '1',
      selectTotal: 0,
      loading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      estateOptions: [],
      statusOptions: [],
      multiple: true,
      sceneNames: [],
      ids: [],
      columns,
      list: [],
      treeData: [
        {
          name: '全部场景',
          id: '1',
          pid: 0,
          dragDisabled: true,
          addTreeNodeDisabled: false,
          addLeafNodeDisabled: true,
          editNodeDisabled: true,
          delNodeDisabled: true,
          children: [
            {
              name: '未规划场景',
              id: '2',
              isLeaf: false,
              pid: 1,
              number: 2
            },
            {
              name: '其他场景',
              id: '5',
              isLeaf: false,
              pid: 2,
              number: 1
            }
          ]
        }
      ],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        sceneName: '',
        estate: '',
        status: ''
      }
    }
  },
  watch: {
    activeId: {
      handler(val) {
        this.getList()
      },
      immediate: true
    }
  },
  created() {
    this.getList()
    this.$http.get(`/dict/sys_normal_estate`).then((response) => {
      this.estateOptions = response.result.list
    })
    this.$http.get(`/dict/sys_normal_status`).then((response) => {
      this.statusOptions = response.result.list
    })
  },
  methods: {
    getList() {
      this.loading = true
      this.$http.get(`/system/automation/${this.activeId}`).then((response) => {
        this.list = response.result.list
        this.list.map((item) => {
          item.operation = item.remark
        })
        this.total = response.result.total
        this.loading = false
      })
    },
     estateTypeFormat(row) {
      return this.selectDictLabel(this.estateOptions, row.estate)
    },
    statusTypeFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    onClick(params) {
      console.log('onClick', params)
      this.activeId = params.id
    },
    cancel() {
     this.open = false
     this.$emit('close')
    },
    handleSure(row) {
      console.log(this.activeCaseId)
      const sceneIds = row.id || this.ids
      console.log(sceneIds)
      this.open = false
      this.$emit('ok')
    },
     handleQuery() {
      this.queryParam.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        sceneName: '',
        estate: '',
        status: ''
      }
      this.handleQuery()
    },
     changeParam(searchParam) {
       this.queryParam = Object.assign(this.queryParam, searchParam)
    },
    // 打开弹窗
    handleRelevance(title) {
      this.open = true
      this.formTitle = title
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSizeChange(current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      this.getList()
    },
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map((item) => item.id)
      this.sceneNames = this.selectedRows.map((item) => item.sceneName)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
      this.selectTotal = selectedRowKeys.length
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            const keys = []
            keys.push(record.id)
            this.selectedRowKeys = keys
          }
        }
      }
    }
  }
}
</script>
