<template>
  <div>
    <a-card :bordered="false">
      <preview-form v-if="showPreviewModal" ref="previewForm" @close="showPreviewModal = false"> </preview-form>
      <split splitHeight="750px" :leftWidth="leftWidth">
        <template slot="paneL">
          <div style="margin-bottom: 20px">
            <a-select
              v-model="projectId"
              placeholder="请选择项目"
              style="width: 220px"
              option-filter-prop="children"
              @change="handleChange"
            >
              <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="d.id">
                {{ d.projectName }}
              </a-select-option>
            </a-select>
          </div>
          <tree-list :treeData="treeData" @onClick="onClick"></tree-list>
        </template>
        <template slot="paneR">
          <tab-list @changeLeftWidth="changeLeftWidth" ref="caseList" :newTitle="newTitle" tab="用例列表">
            <template slot="table">
              <!-- 条件搜索 -->
              <case-search
                :estateOptions="estateOptions"
                :statusOptions="statusOptions"
                :version-options="versionOptions"
                @handleQuery="handleQuery"
                @changeParam="changeParam"
                @resetQuery="resetQuery"
              ></case-search>
              <a-divider></a-divider>
              <!-- table表格 -->
              <advance-table
                :scroll="{ x: 1500, y: 500 }"
                :columns="columns"
                :data-source="list"
                title="用例管理"
                :loading="loading"
                rowKey="id"
                @refresh="getList"
                size="middle"
                tableKey="case-function-index-table"
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
                  <a-button
                    type="danger"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['projectSetting:environment:delete']"
                  >
                    <a-icon type="delete" />删除
                  </a-button>
                </div>
                <span
                  slot="estate"
                  slot-scope="{ record }"
                  class="case-status"
                  :style="{ backgroundColor: estateColor[record.estate] }"
                >
                  {{ estateTypeFormat(record) }}
                </span>
                <span
                  slot="status"
                  slot-scope="{ record }"
                  class="case-status"
                  :style="{ backgroundColor: statusColor[record.status] }"
                >
                  {{ statusTypeFormat(record) }}
                </span>
                <span slot="module" slot-scope="{ record }">
                  {{ findNodeId(treeData, record.module, 'name') }}
                </span>
                <span slot="versionId" slot-scope="{ record }">
                  {{ findNodeId(versionOptions, record.versionId, 'version') }}
                </span>
                <span slot="describe" slot-scope="{ record }">
                  <a type="link" @click="handlePreview(record)"> 预览 </a>
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleUpdate(record, undefined)" v-hasPermi="['projectSetting:environment:edit']">
                    编辑
                  </a>
                  <a-divider type="vertical" v-hasPermi="['projectSetting:environment:delete']" />
                  <a @click="handleDelete(record)" v-hasPermi="['projectSetting:environment:delete']"> 删除 </a>
                </span>
              </advance-table>
            </template>
            <template #addForm="info">
              <add-or-edit-form
                @onSave="handleUpdateCase"
                ref="addOrEditForm"
                :active-id="activeId"
                :case-info="info.content"
                :estateOptions="estateOptions"
                :statusOptions="statusOptions"
                :version-options="versionOptions"
              >
              </add-or-edit-form>
            </template>
          </tab-list>
        </template>
      </split>
    </a-card>
  </div>
</template>

<script>
import TreeList from '@/components/pt/tree/TreeList.vue'
import Split from '@/components/pt/split/Index'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AddOrEditForm from './modules/AddOrEditForm.vue'
import PreviewForm from './modules/PreviewForm.vue'
import TabList from '@/components/pt/tab/tabList.vue'
import { Modal } from 'ant-design-vue'
import { columns } from '../caseColumn'
import CaseSearch from '../components/CaseSearch.vue'
import { getAllProject } from '@/api/project'
export default {
  name: 'Function',
  components: {
    TreeList,
    Split,
    AdvanceTable,
    AddOrEditForm,
    PreviewForm,
    TabList,
    CaseSearch,
  },
  // 给下拉列表树提供树形数据
  provide() {
    return {
      treeData: this.treeData,
      projectOptions: this.projectOptions,
      versionOptions: this.versionOptions,
    }
  },
  data() {
    return {
      leftWidth: '300', // 左边aside大小
      newTitle: '新建用例',
      loading: false,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      multiple: true,
      caseNames: [],
      ids: [],
      activeId: '1', // 控制选中的node颜色
      showPreviewModal: false,
      estateOptions: [],
      statusOptions: [],
      statusColor: ['#f25f62', '#5cbc31', '#888c92'], // 控制用例状态颜色
      estateColor: ['#c71218', '#f25f62', '#e69736'], // 控制用例等级颜色
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        caseName: '',
        versionId: '',
        estate: '',
        status: '',
      },
      columns,
      list: [],
      projectOptions: [],
      newTree: {},
      versionOptions: [
        {
          id: '1',
          version: 'v1.0.1',
        },
        {
          id: '2',
          version: 'v1.0.2',
        },
      ],
      treeData: [
        {
          name: '全部用例',
          id: '1',
          pid: '0',
          dragDisabled: true,
          addTreeNodeDisabled: false,
          addLeafNodeDisabled: true,
          editNodeDisabled: true,
          delNodeDisabled: true,
          children: [
            {
              name: '未规划用例',
              id: '2',
              isLeaf: false,
              pid: '1',
              number: 2,
              // addTreeNodeDisabled: true,
              // addLeafNodeDisabled: true,
              // editNodeDisabled: true,
              // delNodeDisabled: true
            },
            {
              name: '其他用例',
              id: '5',
              isLeaf: false,
              pid: '1',
              number: 1,
            },
          ],
        },
      ],
    }
  },
  created() {
    this.getAllProjectList()
    this.$http.get(`/dict/sys_normal_estate`).then((response) => {
      this.estateOptions = response.result.list
    })
    this.$http.get(`/dict/sys_normal_status`).then((response) => {
      this.statusOptions = response.result.list
    })
  },
  watch: {
    activeId: {
      handler(val) {
        this.getList()
      },
      immediate: true,
    },
  },
  methods: {
    // 获取所有项目
    getAllProjectList() {
      getAllProject().then((response) => {
        this.projectOptions = response.data
      })
    },
    // 获取最新版本
    getList() {
      this.loading = true
      this.$http.get(`/system/case/${this.activeId}`).then((response) => {
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
    // 是否显示左侧侧边菜单
    changeLeftWidth(width) {
      this.leftWidth = width
    },
    onClick(params) {
      console.log('onClick', params)
      this.activeId = params.id
    },
    // 搜索框的变化
    changeParam(searchParam) {
      this.queryParam = Object.assign(this.queryParam, searchParam)
    },
    handleQuery() {
      this.queryParam.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        caseName: '',
        versionId: '',
        estate: '',
        status: '',
      }
      this.handleQuery()
    },
    // 保存后更新用例
    handleUpdateCase(record) {
      const updateTitle = record.caseName
      this.$nextTick(() => {
        this.$refs.caseList.handleUpdateCase(record, updateTitle)
      })
    },
    // 编辑用例
    handleUpdate(record) {
      const editTitle = record.caseName
      this.$nextTick(() => {
        this.$refs.caseList.addTab(record, editTitle)
      })
    },
    // 预览
    handlePreview(record) {
      this.showPreviewModal = true
      this.$nextTick(() => {
        this.$refs.previewForm.handlePreview(record)
      })
    },
    // 删除数据
    handleDelete(row) {
      var that = this
      // const projectids = row.id || this.ids
      const caseNames = row.caseName || this.caseNames
      Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + caseNames + '的数据',
        onOk() {
          return that.$message.success('删除成功', 3)
        },
        onCancel() {},
      })
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
      this.caseNames = this.selectedRows.map((item) => item.caseName)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            const keys = []
            keys.push(record.id)
            this.selectedRowKeys = keys
          },
        },
      }
    },
  },
}
</script>

<style lang="less" scoped>
.advanced-table {
  min-height: calc(94vh - 240px);
}
.case-status {
  padding: 2px 5px;
  color: #fff;
  border-radius: 5%;
}
</style>
