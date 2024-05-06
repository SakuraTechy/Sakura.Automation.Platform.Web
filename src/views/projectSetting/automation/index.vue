<template>
  <div>
    <a-card :bordered="false">
      <a-tabs v-model="activeKey" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
        <a-tab-pane key="1" tab="自动化列表" :closable="false">
          <div class="title-wrapper">自动化列表</div>
          <SearchControl :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery"  />
          <a-divider></a-divider>
          <!-- table表格 -->
          <advance-table
          :scroll="{ x: 1500, y: 500 }"
            :columns="columns"
            :data-source="list"
            :loading="loading"
            rowKey="id"
            @refresh="getList"
            :components="isDragTable"
            bordered
            size="middle"
            tableKey="system-project-index-table"
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
            :needTitle="false"
          >
            <div class="table-operations" slot="button">
              <div>
                <a-button type="primary" size="small" @click="handleAdd()" style="margin-right: 16px; " v-hasPermi="['projectSetting:project:add']">
                  <a-icon type="plus" />新建
                </a-button>
                <a-button size="small" @click="handleImport" v-hasPermi="['projectSetting:project:add']">
                  <a-icon type="upload" />批量导入
                </a-button>
              </div>
              <a-button size="small" @click="handleExport" v-hasPermi="['projectSetting:project:add']">
                <a-icon type="download" />下载
              </a-button>
            </div>
            <span slot="createTime" slot-scope="{ record }">
              {{ parseTime(record.createTime) }}
            </span>
            <span slot="members" slot-scope="{ record }">
                <div v-if="record.memberList && record.memberList.length === 0">暂无成员</div>
                <a v-else>查看</a>
            </span>
            <span slot="updateTime" slot-scope="{ record }">
              {{ parseTime(record.updateTime) }}
            </span>
            <span slot="operation" slot-scope="{ record }">
              <a @click="handleUpdate(record)" > 修改 </a>
              <a-divider type="vertical" v-show="record.id!=='1'" />
              <a @click="handleDelete(record)" v-show="record.id!=='1'"> 删除 </a>
              <a-divider type="vertical" />
              <a @click="handleSetting(record, undefined)"> 环境配置 </a>
              <a-divider type="vertical" />
              <a @click="handleSetting(record, undefined)"> 自动化配置 </a>
            </span>
          </advance-table>
        </a-tab-pane>
        <a-tab-pane v-for="(item, index) in panes" :key="(index + 2).toString()" :tab="item.title" :closable="true">
          <autoConfig />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script type="text/javascript">
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '../components/SearchControl.vue'
import autoConfig from './modules/autoConfig.vue';
export default {
  name: "Automation",
  components: { AdvanceTable, SearchControl, autoConfig },
  data() {
    return {
      queryData: [
        {
          label: '配置ID',
          value: 'id',
        },
        {
          label: '配置名称',
          value: 'projectName',
        },
        {
          label: '配置描述',
          value: 'abbreviate',
        },
        {
          label: '配置类型',
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
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      columns: [
      {
          title: '配置ID',
          dataIndex: 'id',
          width:200,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '配置名称',
          dataIndex: 'name',
          width:200,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '配置描述',
          width:200,
          dataIndex: 'abbreviate',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '配置类型',
          width:200,
          dataIndex: 'lastDomain',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '创建人',
          dataIndex: 'createByName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed:'right',
          width:280,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      list: [],
      total: 0,
      panes: [
        { title: '新增自动化配置'},
        { title: '新增自动化配置'},
      ],
      activeKey: '2'
    };
  },
  created() {
  },
  computed: {
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  methods: {
    getList () {},
    changeSize (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onClickRow (record) {
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
    onSizeChange (current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      this.getList()
    },
    handleQuery (value) {
      if(value === undefined){
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
        }
        this.getList()
      } else {
        this.queryParam = Object.assign(this.queryParam, value)
        this.queryParam.pageNum = 1
        this.getList()
      }
    },
   /** 重置按钮操作 */
    resetQuery () {
      this.queryParam = {
       pageNum: 1,
       pageSize: 10,
      }
      this.handleQuery()
    },
    handleExport() {},
    handleImport() {},
    handleAdd (record) {
      this.panes.push({title: '新增自动化配置'})
      this.activeKey = (this.panes.length + 1).toString()
    },
    onEdit(targetKey, action){
      this[action](targetKey);
    },
    remove(targetKey){
      this.panes.splice(targetKey - 2, 1)
      this.activeKey = '1'
    }
  },
};
</script>
<style lang="less" scoped>
.title-wrapper {
  padding: 20px 0 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}
.table-operations {
  display: flex;
  justify-content: space-between;
}
</style>