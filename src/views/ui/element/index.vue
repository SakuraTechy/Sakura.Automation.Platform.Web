<template>
  <split splitHeight="100%" :leftWidth="leftWidth">
    <template slot="paneL">
      <tree-list :treeData="treeData" @onClick="onClick"> </tree-list>
    </template>
    <template slot="paneR">
      <a-page-header
        style="border-bottom: 1px solid rgb(235, 237, 240);padding:8px 16px;"
        title=""/>
      <!-- 条件搜索 -->
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="元素名称">
                  <a-input
                    v-model="queryParam.elementName"
                    placeholder="请输入元素名称"
                    allow-clear
                    @keyup.enter.native="handleQuery"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="定位类型">
                  <a-select v-model="queryParam.locateType" placeholder="请选择" style="width: 220px">
                    <a-select-option v-for="(d, index) in locateTypeOptions" :key="index" :value="d.dictValue">
                      {{ d.dictLabel }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col>
                <span class="table-page-search-submitButtons" style="float: right">
                  <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                  <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-divider></a-divider>
      <a-card :bordered="false" class="table-card">
        <element-add-form
          v-if="showAddModal"
          ref="elementAddForm"
          :locateTypeOptions="locateTypeOptions"
          @ok="getList(activeId)"
          @close="showAddModal = false"></element-add-form>
        <element-edit-form
          v-if="showEditModal"
          ref="elementEditForm"
          :locateTypeOptions="locateTypeOptions"
          @ok="getList(activeId)"
          @close="showEditModal = false"></element-edit-form>
        <!-- table表格 -->
        <advance-table
          :columns="columns"
          :data-source="list"
          title="元素管理"
          :loading="loading"
          rowKey="id"
          @refresh="getList"
          size="middle"
          tableKey="ui-test-element-index-table"
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
            <a-button type="primary" size="small" @click="handleAdd()" v-hasPermi="['projectSetting:project:add']">
              <a-icon type="plus" />创建元素
            </a-button>
            <a-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['projectSetting:environment:delete']"
            >
              <a-icon type="delete" />删除
            </a-button>
          </div>
          <span slot="locateType" slot-scope="{ record }">
            {{ locateTypeFormat(record) }}
          </span>
          <span slot="createTime" slot-scope="{ record }">
            {{ parseTime(record.createTime) }}
          </span>
          <span slot="updateTime" slot-scope="{ record }">
            {{ parseTime(record.updateTime) }}
          </span>
          <span slot="operation" slot-scope="{ record }">
            <a @click="handleUpdate(record, undefined)" v-hasPermi="['projectSetting:environment:edit']"> 编辑 </a>
            <a-divider type="vertical" v-hasPermi="['projectSetting:environment:delete']" />
            <a @click="handleDelete(record)" v-hasPermi="['projectSetting:environment:delete']"> 删除 </a>
          </span>
        </advance-table>
      </a-card>
    </template>
  </split>
</template>

<script>
import TreeList from '@/components/pt/tree/TreeList.vue'
import Split from '@/components/pt/split/Index'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import { Modal } from 'ant-design-vue'
import ElementAddForm from './modules/ElementAddForm.vue'
import ElementEditForm from './modules/ElementEditForm.vue'
export default {
  name: 'Element',
  components: {
    TreeList,
    Split,
    AdvanceTable,
    ElementAddForm,
    ElementEditForm
  },
  // 给下拉列表树提供树形数据
  provide() {
    return {
      treeData: this.treeData
    }
  },
  data() {
    return {
      leftWidth: '300', // 左边aside大小
      locateTypeOptions: [], // 元素定位列表
      showAddModal: false,
      showEditModal: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      multiple: true,
      elementNames: [],
      ids: [],
      activeId: '1', // 控制选中的node颜色
      showIcon: true, // 控制node的icon操作是否显示
      showPreviewModal: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        elementName: '',
        locateType: ''
      },
      columns: [
        {
          title: '元素名称',
          dataIndex: 'elementName',
          width: 100,
          ellipsis: true,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '定位类型',
          dataIndex: 'locateType',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'locateType' },
          align: 'center'
        },
        {
          title: '元素定位',
          dataIndex: 'locate',
          width: 100,
          align: 'center'
        },
         {
          title: '创建人',
          dataIndex: 'createBy',
          width: 100,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 200,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
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
      ],
      list: [],
      newTree: {},
      treeData: [
        {
          name: '全部元素',
          label: '全部元素',
          id: '1',
          pid: 0,
          dragDisabled: true,
          addTreeNodeDisabled: false,
          addLeafNodeDisabled: true,
          editNodeDisabled: true,
          delNodeDisabled: true,
          children: [
            {
              name: '未规划元素',
              id: '2',
              isLeaf: false,
              pid: 1,
              number: 2
              // addTreeNodeDisabled: true,
              // addLeafNodeDisabled: true,
              // editNodeDisabled: true,
              // delNodeDisabled: true
            },
            {
              name: '其他元素',
              id: '5',
              isLeaf: false,
              pid: 2,
              number: 1
            }
          ]
        }
      ]
    }
  },
  created() {
    this.$http.get(`/dict/sys_normal_locate`).then((response) => {
       this.locateTypeOptions = response.result.list
    })
  },
  watch: {
    activeId: {
      handler(val) {
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
   getList() {
      this.showAddModal = false
      this.showEditModal = false
      this.loading = true
      this.$http.get(`/ui/element/${this.activeId}`).then((response) => {
        this.list = response.result.list
        this.list.map((item) => {
          item.operation = item.remark
        })
        this.total = response.result.total
        this.loading = false
      })
    },
   locateTypeFormat (row) {
      return this.selectDictLabel(this.locateTypeOptions, row.locateType)
    },
    // 是否显示左侧侧边菜单
    changeLeftWidth(width) {
      this.leftWidth = width
    },
    // 点击node
    onClick(params) {
      console.log('onClick', params)
      this.activeId = params.id
    },
   handleQuery() {
      this.queryParam.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.queryParam = {
       pageNum: 1,
       pageSize: 10,
       elementName: ''
      }
      this.handleQuery()
    },
    // 创建元素
    handleAdd(record) {
        this.showAddModal = true
        this.$nextTick(() => (this.$refs.elementAddForm.handleAdd(record)
      ))
    },
    // 编辑元素
    handleUpdate(record) {
      this.showEditModal = true
      this.$nextTick(() => {
        this.$refs.elementEditForm.handleUpdate(record)
      })
    },
    // 删除元素
    handleDelete(row) {
      var that = this
      // const projectids = row.id || this.ids
      const elementNames = row.elementName || this.elementNames
      Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + elementNames + '的数据',
        onOk() {
          return that.$message.success('删除成功', 3)
        },
        onCancel() {}
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
      this.elementNames = this.selectedRows.map((item) => item.elementName)
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
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-divider-horizontal {
    margin: 10px 0;
}
.table-card {
  min-height: calc(97vh - 196px);
}
</style>
