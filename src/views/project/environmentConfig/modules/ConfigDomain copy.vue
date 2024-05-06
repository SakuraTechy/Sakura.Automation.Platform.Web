<template>
  <div>
    <SearchControl :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery"  />
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
          <a @click="handleUpdate(record)"> 修改 </a>
          <a-divider type="vertical"/>
          <a @click="handleDelete(record)"> 删除 </a>
          <a-divider type="vertical"/>
          <a @click="handleSetting(record, undefined)"> 环境配置 </a>
          <a-divider type="vertical"/>
          <a @click="handleSetting(record, undefined)"> 自动化配置 </a>
        </span>
      </advance-table>
      <ConfigDataAddOrEdit 
        v-if="showAddModal"
        :statusOptions="statusOptions"
        ref="AddOrEditForm"
        @close="showAddModal = false"
       />
  </div>
</template>
<script type="text/javascript">
import SearchControl from '../../components/SearchControl.vue';
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import ConfigDataAddOrEdit from './ConfigDataAddOrEdit.vue'
import { domainQueryData, domainColumns } from './EnvConfig'
export default {
  name: "ConfigDomain",
  components: { SearchControl, AdvanceTable, ConfigDataAddOrEdit },
  data() {
    return {
      queryData: domainQueryData,
      columns: domainColumns,
      list: [],
      showAddModal: false,
      statusOptions: [],
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,

    };
  },
  computed: {
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  created() {
  },
  methods: {
    handleQuery(){
    },
    resetQuery(){
    },
    getList(){},
    onSizeChange (current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      this.getList()
    },
    changeSize (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    // 新建
    handleAdd(){
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.AddOrEditForm.handleAdd(2)
      ))
    },
    // 导入
    handleImport(){},
    // 下载
    handleExport(){},
  },
}
</script>
<style lang="less" scoped>
@import url(./EnvConfig.css);
</style>