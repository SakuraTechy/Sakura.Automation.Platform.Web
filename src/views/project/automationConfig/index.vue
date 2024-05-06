<template>
  <div>
    <a-tabs v-model="activeKey" class="tab-title" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
      <a-tab-pane key="1" tab="自动化配置列表" :closable="false">
        <a-card :bordered="false" style="height: 100px">
          <SearchControl :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery" />
        </a-card>
        <a-divider />
        <a-card :bordered="false" class="container">
          <!-- table表格 -->
          <advance-table :scroll="{ x: 1500, y: 500 }" :columns="columns" :data-source="list" :loading="loading"
            rowKey="id" @refresh="getList" :components="isDragTable" bordered size="middle"
            tableKey="system-project-index-table" :format-conditions="true" :pagination="{
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
            }" :row-selection="rowSelection" :needTitle="false">
            <div class="table-operations" slot="button">
              <a-button type="primary" @click="handleAdd()" v-hasPermi="['project:automationConfig:add']">
                <a-icon type="plus-square" />新建自动化配置
              </a-button>
              <a-space :size="8" style="margin-right: 8px">
                <a-button type="primary" @click="handleImport" v-hasPermi="['project:automationConfig:export']">
                  <a-icon type="upload" />批量导入
                </a-button>
                <a-button type="danger" :disabled="multiple" @click="handleExport"
                  v-hasPermi="['project:automationConfig:export']">
                  <a-icon type="download" />批量导出
                </a-button>
                <a-button type="danger" :disabled="multiple" @click="handleDelete"
                  v-hasPermi="['project:automationConfig:remove']">
                  <a-icon type="delete" />批量删除
                </a-button>
              </a-space>
            </div>
            <span slot="type" slot-scope="{ record }">
              <a v-for="(item, value) in automationType" v-if="item.type === record.type" :key="value" :value="item.type">
                {{ item.label }}
              </a>
            </span>
            <span slot="status" slot-scope="{ record }">
              <a-switch :checked="Boolean(record.status)" @change="(value) => onchange(value, record)" />
            </span>
            <span slot="createTime" slot-scope="{ record }">
              {{ parseTime(record.createTime) }}
            </span>
            <span slot="updateTime" slot-scope="{ record }">
              {{ parseTime(record.updateTime) }}
            </span>
            <span slot="operation" slot-scope="{ record }">
              <a @click="handleView(record)" v-hasPermi="['project:automationConfig:query']"> 查看 </a>
              <a-divider type="vertical" />
              <a @click="handleUpdate(record)" v-hasPermi="['project:automationConfig:edit']"> 修改 </a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)" v-show="record.id !== '1'"
                v-hasPermi="['project:automationConfig:remove']">删除</a>
              <a-divider type="vertical" />
              <a @click="handleExport(record)" v-hasPermi="['project:automationConfig:export']"> 导出 </a>
            </span>
          </advance-table>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-for="(item, index) in panes" :key="(index + 2).toString()" :tab="item.title" :closable="true">
        <Config :multiple="item.multiple" :automationId="automationId" @getList="getList" @remove="remove" :record="item.record"></Config>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getAutomationList, deleteAutomation, updateAutomationStatus, exportAutomationConfig } from '@/api/project'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '../components/SearchControl.vue'
import Config from './modules/Config.vue'
import { automationType } from './modules/Config'

export default {
  name: 'Automation',
  components: { AdvanceTable, SearchControl, Config },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      automationType,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.type, a.name, a.status',
        isAsc: 'desc'
      },
      queryData: [
        {
          label: '配置ID',
          value: 'id',
        },
        {
          label: '配置名称',
          value: 'name',
        },
        {
          label: '配置类型',
          value: 'type',
        },
        {
          label: '启用状态',
          value: 'status',
        },
        {
          label: '创建人',
          value: 'createByName',
        },
        {
          label: '创建时间',
        }
      ],
      columns: [
        {
          title: '配置ID',
          width: 270,
          dataIndex: 'id',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '配置名称',
          width: 135,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '配置描述',
          width: 200,
          dataIndex: 'description',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '最新项目',
          width: 220,
          dataIndex: 'lastProject',
          align: 'center',
          ellipsis: true
        },
        {
          title: '最新Jenkins',
          width: 120,
          dataIndex: 'lastJenkins',
          align: 'center',
          ellipsis: true
        },
        {
          title: '最新环境',
          width: 120,
          dataIndex: 'lastEnvironment',
          align: 'center'
        },
        {
          title: '最新浏览器',
          width: 100,
          dataIndex: 'lastBrowser',
          align: 'center'
        },
        {
          title: '配置类型',
          width: 100,
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
          ellipsis: true
        },
        {
          title: '启用状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '创建人',
          width: 100,
          dataIndex: 'createByName',
          align: 'center'
        },
        {
          title: '创建时间',
          width: 160,
          dataIndex: 'createTime',
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '更新时间',
          width: 160,
          dataIndex: 'updateTime',
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      list: [],
      total: 0,
      ids: [],
      names: [],
      automationId: '',
      selectedRowKeys: [],
      selectedRows: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      panes: [],
      activeKey: '1'
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.id === '1',
            name: record.name
          }
        })
      }
    },
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  created() {
    this.getList()
    // console.info(this.automationType)
  },
  watch: {
    activeKey: {
      handler(val) {
        // console.log('val: ' + val)
        this.getList()
      },
    },
  },
  methods: {
    getList() {
      this.loading = true
      getAutomationList(this.queryParam).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
      this.selectedRowKeys = []
      this.multiple = !this.selectedRowKeys.length
    },
    handleQuery(value) {
      this.queryParam = Object.assign(this.queryParam, value)
      this.queryParam.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.multiple = true
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.type, a.name, a.status',
        isAsc: 'desc'
      }
      this.handleQuery(this.queryParam)
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
      this.ids = this.selectedRows.map(item => item.id)
      this.names = this.selectedRows.map(item => item.name)
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
    },
    handleAdd() {
      var num = false
      if (this.panes.length > 0) {
        this.panes.forEach(item => {
          if (item.title === '新增自动化配置') {
            num = true
            return
          }
        });
        if (num) {
          this.$message.info('已存在打开的新增窗口，请先关闭！')
        } else {
          this.panes.push({ title: '新增自动化配置' })
          this.activeKey = (this.panes.length + 1).toString()
          this.automationId = ''
        }
      } else {
        this.panes.push({ title: '新增自动化配置' })
        this.activeKey = (this.panes.length + 1).toString()
        this.automationId = ''
      }
    },
    handleView(record) {
      var num = false
      if (this.panes.length > 0) {
        this.panes.forEach(item => {
          if (item.title === record.name) {
            num = true
            return
          }
        });
        if (num) {
          this.$message.info('已存在打开的修改窗口，请先关闭！')
        } else {
          this.panes.push({
            title: record.name,
            record,
            multiple: true
          })
          this.activeKey = (this.panes.length + 1).toString()
          this.automationId = record.id
        }
      } else {
        this.panes.push({
          title: record.name,
          record,
          multiple: true
        })
        this.activeKey = (this.panes.length + 1).toString()
        this.automationId = record.id
      }
    },
    handleUpdate(record) {
      var num = false
      if (this.panes.length > 0) {
        this.panes.forEach(item => {
          if (item.title === record.name) {
            num = true
            return
          }
        });
        if (num) {
          this.$message.info('已存在打开的修改窗口，请先关闭！')
        } else {
          this.panes.push({
            title: record.name,
            record,
            multiple: false
          })
          this.activeKey = (this.panes.length + 1).toString()
          this.automationId = record.id
        }
      } else {
        this.panes.push({
          title: record.name,
          record,
          multiple: false
        })
        this.activeKey = (this.panes.length + 1).toString()
        this.automationId = record.id
      }
    },
    handleDelete(row) {
      // console.info(row.id)
      var that = this
      var ids1 = []
      if (row.id !== undefined) {
        ids1.push(row.id)
      }
      // row.id ? this.ids.push(row.id) : ''
      // const ids = row.id || that.ids
      const ids = ids1.length > 0 ? ids1 : that.ids
      const names = row.name || that.names
      // console.info(ids)
      var param = {
        projectId: row.projectId,
        ids: ids
      }
      that.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的数据',
        onOk() {
          deleteAutomation(param).then(() => {
            that.getList()
            that.$message.success('删除成功')
            // that.ids = []
            // that.selectedRowKeys = []
          })
        },
        onCancel() { }
      })
    },
    handleImport() { },
    handleExport(row) {
      var that = this
      var ids1 = []
      if (row.id !== undefined) {
        ids1.push(row.id)
      }
      // row.id ? this.ids.push(row.id) : ''
      // const ids = row.id || that.ids
      const ids = ids1.length > 0 ? ids1 : that.ids
      const names = row.name || that.names
      // console.info(ids)
      var param = {
        projectId: row.projectId,
        ids: ids
      }
      that.$Modal.confirm({
        title: '确认导出所选中数据?',
        content: '当前选中为' + names + '的数据',
        onOk() {
          return exportAutomationConfig(param)
            .then((res) => {
              if (res.status != 404) {
                that.readBlobDown(res, 'automation.yml', 'application/x-yaml')
                that.$message.success('导出成功')
              }
            })
            .catch((error) => {
              that.$message.error('导出失败')
              reject(error)
            })
        },
        onCancel() { }
      })
    },
    /**
     * 读取下载的文件流
     */
    readBlobDown(result, filename, filetype) {
      // let url = window.URL.createObjectURL(new Blob([result]))
      let blob = new Blob([result], { type: filetype }) //application/zip就是设置下载类型，需要设置什么类型可在标题二处查看，
      const url = window.URL.createObjectURL(blob) //设置路径
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', filename) //指定下载后的文件名，防跳转
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      // 释放内存
      window.URL.revokeObjectURL(link.href)
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    remove(targetKey) {
      this.panes.splice(targetKey - 2, 1)
      this.activeKey = '1'
      this.getList()
    },
    // 表格内-状态切换
    onchange(value, { id, projectId }) {
      let params = {
        id,
        projectId,
        status: Number(value)
      }
      updateAutomationStatus(params).then(() => {
        this.$message.success('修改成功')
        this.getList()
        // setTimeout(() => {this.getList()}, 2000)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tab-title {
  background-color: white;
  padding: 10px 10px 0 10px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}

.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 310px);
  margin-top: -15px;
}

.title-wrapper {
  padding: 20px 0 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}

.table-operations {
  padding: 0px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
}
</style>
