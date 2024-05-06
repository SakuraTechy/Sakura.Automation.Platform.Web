<template>
  <div>
    <a-tabs v-model="activeKey" class="tab-title" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
      <a-tab-pane key="1" tab="环境列表" :closable="false">
        <a-card :bordered="false" style="height: 100px">
          <SearchControl :queryData="queryData" :projectOptions="projectOptions" @handleQuery="handleQuery"
            @resetQuery="resetQuery" />
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
              <a-button type="primary" @click="handleAdd()" v-hasPermi="['project:environmentConfig:add']">
                <a-icon type="plus-square" />新建环境
              </a-button>
              <a-space :size="8" style="margin-right: 8px">
                <a-button type="primary" @click="handleImport" v-hasPermi="['project:environmentConfig:export']">
                  <a-icon type="upload" />批量导入
                </a-button>
                <a-button type="danger" :disabled="multiple" @click="handleExport"
                  v-hasPermi="['project:environmentConfig:export']">
                  <a-icon type="download" />批量导出
                </a-button>
                <a-button type="danger" :disabled="multiple" @click="handleDelete"
                  v-hasPermi="['project:environmentConfig:remove']">
                  <a-icon type="delete" />批量删除
                </a-button>
              </a-space>
            </div>
            <span slot="projectId" slot-scope="{ record }">
              {{ getProjectName(record.projectId) }}
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
              <!-- <a @click="handleUpdate(record)" v-hasPermi="['project:environmentConfig:query']"> 查看 </a>
              <a-divider type="vertical" /> -->
              <a @click="handleUpdate(record)" v-hasPermi="['project:environmentConfig:edit']"> 修改 </a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)" v-show="record.id !== '1'"
                v-hasPermi="['project:environmentConfig:remove']">删除</a>
              <a-divider type="vertical" />
              <a @click="handleExport(record)" v-hasPermi="['project:environmentConfig:export']"> 导出 </a>
            </span>
          </advance-table>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-for="(item, index) in panes" :key="(index + 2).toString()" :tab="item.title" :closable="true">
        <EnvConfig :projectOptions="projectOptions" :environmentId="environmentId" @getList="getList" @remove="remove"
          :record="item.record"></EnvConfig>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getProjectList, getEnvironmentList, deleteEnvironment, updateEnvironmentStatus, exportEnvironmentConfig } from '@/api/project'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '../components/SearchControl.vue'
import EnvConfig from './modules/EnvConfig.vue'
export default {
  name: 'Environment',
  components: { AdvanceTable, SearchControl, EnvConfig },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.project_id, a.name',
        isAsc: 'asc'
      },
      columns: [
        {
          title: '环境ID',
          width: 270,
          dataIndex: 'id',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '环境名称',
          width: 100,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '所属项目',
          dataIndex: 'projectId',
          scopedSlots: { customRender: 'projectId' },
          ellipsis: true,
          width: 250,
          align: 'center'
        },
        {
          title: '环境域名',
          width: 235,
          dataIndex: 'lastDomain',
          align: 'center',
          ellipsis: true
        },
        {
          title: '环境版本',
          width: 160,
          dataIndex: 'lastVersion',
          align: 'center'
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
      projectOptions: [],
      total: 0,
      ids: [],
      names: [],
      environmentId: '',
      selectedRowKeys: [],
      selectedRows: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      queryData: [
        {
          label: '环境ID',
          value: 'id',
        },
        {
          label: '环境名称',
          value: 'name',
        },
        {
          label: '所属项目',
          value: 'projectId',
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
  watch: {
    '$route'(to, from) {
      // console.log('Route changed');
      this.getAllProjectList()
      this.getList()
    },
    activeKey: {
      handler(val) {
        // console.log('val: ' + val)
        this.getList()
      }
    },
  },
  created() {
    // console.log('Created method called');
    this.getAllProjectList()
    this.getList()
  },
  beforeRouteUpdate(to, from, next) {
    // console.log('Route parameter changed');
    this.getAllProjectList()
    this.getList()
    next();
  },
  methods: {
    getList() {
      this.loading = true
      getEnvironmentList(this.queryParam).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
      this.selectedRowKeys = []
      this.multiple = !this.selectedRowKeys.length
    },
    // 获取所有项目
    getAllProjectList() {
      getProjectList().then((response) => {
        this.projectOptions = response.data.list
        // console.log('this.projectOptions', this.projectOptions);
      })
    },
    // 获取项目名称
    getProjectName1(projectList) {
      let arr = []
      console.info(projectList)
      projectList.map((item, index) => {
        arr.push(this.findNodeId(this.projectOptions, item.id, 'projectName'))
      })
      return arr.join(',')
    },
    getProjectName(projectId) {
      // console.info(this.findNodeId(this.projectOptions, projectId, 'name'))
      return this.findNodeId(this.projectOptions, projectId, 'name')
    },
    handleQuery(value) {
      this.queryParam = Object.assign(this.queryParam, value)
      this.queryParam.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.selectedRowKeys = []
      // this.multiple = !this.selectedRowKeys.length
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.project_id, a.name',
        isAsc: 'asc'
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
    handleAdd(record) {
      var num = false
      if (this.panes.length > 0) {
        this.panes.forEach(item => {
          if (item.title === '新增环境配置') {
            num = true
            return
          }
        });
        if (num) {
          this.$message.info('已存在打开的新增窗口，请先关闭！')
        } else {
          this.panes.push({ title: '新增环境配置' })
          this.activeKey = (this.panes.length + 1).toString()
          this.environmentId = ''
        }
      } else {
        this.panes.push({ title: '新增环境配置' })
        this.activeKey = (this.panes.length + 1).toString()
        this.environmentId = ''
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
            multiple: true
          })
          this.activeKey = (this.panes.length + 1).toString()
          this.environmentId = record.id
        }
      } else {
        this.panes.push({
          title: record.name,
          record,
          multiple: true
        })
        this.activeKey = (this.panes.length + 1).toString()
        this.environmentId = record.id
      }
    },
    handleDelete(row) {
      // console.info(row.id)
      var that = this
      var ids1 = []
      if(row.id !== undefined){
        ids1.push(row.id)
      }
      // row.id ? this.ids.push(row.id) : ''
      // const ids = row.id || that.ids
      const ids = ids1.length > 0 ?  ids1 : that.ids
      const names = row.name || that.names
      console.info(ids)
      var param = {
        projectId: row.projectId,
        ids : ids
      }
      that.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的数据',
        onOk() {
          deleteEnvironment(param).then(() => {
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
      if(row.id !== undefined){
        ids1.push(row.id)
      }
      // row.id ? this.ids.push(row.id) : ''
      // const ids = row.id || that.ids
      const ids = ids1.length > 0 ?  ids1 : that.ids
      const names = row.name || that.names
      // console.info(ids)
      var param = {
        projectId: row.projectId,
        ids : ids
      }
      that.$Modal.confirm({
        title: '确认导出所选中数据?',
        content: '当前选中为' + names + '的数据',
        onOk() {
          return exportEnvironmentConfig(param)
            .then((res) => {
              if (res.status != 404) {
                that.readBlobDown(res, 'environment.yml', 'application/x-yaml')
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
      updateEnvironmentStatus(params).then(() => {
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
