<template>
  <div>
    <SearchControl :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery" :disabled="multiple"/>
    <a-divider style="margin-top: 15px;" />
    <advance-table style="margin-top: -20px;" :scroll="{ x: 1500, y: 176 }" :columns="columns" :data-source="list"
      :loading="loading" rowKey="id" @refresh="getList" :components="isDragTable" bordered size="middle"
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
        <a-button type="primary" :disabled="multiple" @click="handleAdd()" v-hasPermi="['project:automationConfig:browserConfig:add']">
          <a-icon type="plus-square" />新建浏览器配置
        </a-button>
        <a-space :size="8" style="margin-right: 8px">
          <a-button type="primary" :disabled="multiple" @click="handleImport" v-hasPermi="['project:automationConfig:browserConfig:export']">
            <a-icon type="upload" />批量导入
          </a-button>
          <a-button type="danger" :disabled="multiple" @click="handleExport"
            v-hasPermi="['project:automationConfig:browserConfig:export']">
            <a-icon type="download" />批量导出
          </a-button>
          <a-button type="danger" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['project:automationConfig:browserConfig:remove']">
            <a-icon type="delete" />批量删除
          </a-button>
        </a-space>
      </div>
      <span slot="type" slot-scope="{ record }">
        <a>{{ record.type }}</a>
      </span>
      <span slot="status" slot-scope="{ record }">
        <a-switch :disabled="multiple" :checked="Boolean(record.status)" @change="(value) => onchange(value, record)" />
      </span>
      <span slot="createTime" slot-scope="{ record }">
        {{ parseTime(record.createTime) }}
      </span>
      <span slot="updateTime" slot-scope="{ record }">
        {{ parseTime(record.updateTime) }}
      </span>
      <span slot="operation" slot-scope="{ record }">
        <a @click="handleView(record)" v-hasPermi="['project:automationConfig:browserConfig:query']"> 查看 </a>
        <a-divider type="vertical" />
        <a :disabled="multiple" @click="handleUpdate(record)" v-hasPermi="['project:automationConfig:browserConfig:edit']"> 修改 </a>
        <a-divider type="vertical" />
        <a :disabled="multiple" @click="handleCopy(record)" v-hasPermi="['project:automationConfig:browserConfig:edit']"> 复制 </a>
        <a-divider type="vertical" />
        <a :disabled="multiple" @click="handleDelete(record)" v-show="record.id !== '1'"
          v-hasPermi="['project:automationConfig:browserConfig:remove']">删除</a>
        <a-divider type="vertical" />
        <a :disabled="multiple" @click="handleExport(record)" v-hasPermi="['project:automationConfig:browserConfig:export']"> 导出 </a>
      </span>
    </advance-table>
    <ConfigDataAddOrEdit v-if="showAddModal" :automation_Id="automation_Id" :statusOptions="statusOptions"
      ref="ConfigDataAddOrEdit" @getList="getList" @close="showAddModal = false" />
  </div>
</template>
<script type="text/javascript">
import * as projectApis from '@/api/project'
import SearchControl from '../../components/SearchControl.vue';
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import ConfigDataAddOrEdit from './ConfigDataAddOrEdit.vue'
import { browserQueryData, browserColumns } from './Config'

export default {
  name: "ConfigVersion",
  props: {
    automation_Id: {
      type: String,
    },
    multiple: {
      type: Boolean,
    }
  },
  components: { SearchControl, AdvanceTable, ConfigDataAddOrEdit },
  data() {
    return {
      queryData: browserQueryData,
      columns: browserColumns,
      list: [],
      list1: [],
      showAddModal: false,
      statusOptions: [],
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      ids: [],
      names: [],
      selectedRowKeys: [],
      selectedRows: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      // multiple: true,
    };
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
    if (this.automation_Id !== '') {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      projectApis.getAutomationInfo(this.automation_Id).then((response) => {
        if (response.data.browserConfig !== null && response.data.browserConfig.length > 0) {
          this.list = JSON.parse(response.data.browserConfig)
        } else {
          this.list = []
        }
        this.list1 = this.list
        this.loading = false
      })
      this.selectedRowKeys = []
    },
    getList1(arr, param) {
      let obj = []
      const params = Object.keys(param)
        .filter((key) => param[key] !== '' && param[key] !== null && param[key] !== undefined)
        .reduce((acc, key) => ({ ...acc, [key]: param[key] }), {})
      var bProps = Object.getOwnPropertyNames(params)
      // console.info('bProps', bProps)
      arr.forEach((item) => {
        // console.info('item', item)
        // console.info('param', param)
        var num = 0
        // const param = _.pickBy({ ...param })
        for (var i = 0; i < bProps.length; i++) {
          var propName = bProps[i]
          // console.info('propName', propName)
          // console.info('item[propName]', String(item[propName]))
          // console.info('param[propName]', param[propName])
          if (item[propName] === param[propName]
            || this.like(String(item[propName]), String(param[propName]))
            || param[propName] === 2
          ) {
            num++
            // console.info('符合条件：', num)
          }
          if (propName == 'createTime' && this.isTimes(item[propName], param[propName][0], param[propName][1])) {
            num++
            // console.info('符合条件：', num)
          }
        }
        // console.info('符合条件总计：', num)
        // console.info('bProps.length', bProps.length)
        if (num >= bProps.length) {
          obj.push(item);
        }
      })
      return obj
    },
    handleQuery(value) {
      if (value === undefined) {
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
        }
        this.getList()
      } else {
        this.loading = true
        if (this.list1.length > 0) {
          this.list = this.getList1(this.list1, value)
        }
        this.loading = false
      }
    },
    resetQuery() {
      this.selectedRowKeys = []
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
      }
      this.handleQuery()
    },
    //判断两个对象是否相等
    isEqual(objA, objB) {
      //相等
      if (objA === objB) return objA !== 0 || 1 / objA === 1 / objB;
      //空判断
      if (objA == null || objB == null) return objA === objB;
      //类型判断
      if (Object.prototype.toString.call(objA) !== Object.prototype.toString.call(objB)) return false;

      switch (Object.prototype.toString.call(objA)) {
        case '[object RegExp]':
        case '[object String]':
          //字符串转换比较
          return '' + objA === '' + objB;
        case '[object Number]':
          //数字转换比较,判断是否为NaN
          if (+objA !== +objA) {
            return +objB !== +objB;
          }

          return +objA === 0 ? 1 / +objA === 1 / objB : +objA === +objB;
        case '[object Date]':
        case '[object Boolean]':
          return +objA === +objB;
        case '[object Array]':
          //判断数组
          for (let i = 0; i < objA.length; i++) {
            if (!this.isEqual(objA[i], objB[i])) return false;
          }
          return true;
        case '[object Object]':
          //判断对象
          let keys = Object.keys(objA);
          for (let i = 0; i < keys.length; i++) {
            if (!this.isEqual(objA[keys[i]], objB[keys[i]])) return false;
          }

          keys = Object.keys(objB);
          for (let i = 0; i < keys.length; i++) {
            if (!this.isEqual(objA[keys[i]], objB[keys[i]])) return false;
          }

          return true;
        default:
          return false;
      }
    },
    //js 模糊匹配(也就是sql中的like)
    //其实就是类似contain()方法，找到str2里面是否包含有str1，不存在返回-1，存在返回0
    like(str1, str2) {
      var result = str1.indexOf(str2);
      if (result < 0) {
        return false;
      } else {
        return true;
      }
    },
    // 判断一个时间是否在某个时间段内
    isTimes(newdate, startdate, enddate) {
      if (startdate !== undefined && enddate !== undefined) {
        console.log("查询时间", newdate)
        console.log("开始时间", startdate)
        console.log("结束时间", enddate)
        var newdate = new Date(newdate)
        var startdate = new Date(startdate)
        var enddate = new Date(enddate)
        var a = newdate.getTime() - startdate.getTime()
        var b = newdate.getTime() - enddate.getTime()
        // console.log(a);
        // console.log(b);
        if (a < 0 || b > 0) {
          console.log('不在当前时间段内，不符合条件')
          return false
        } else {
          console.log('在当前时间段内，符合条件')
          return true
        }
      }
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map(item => item.id)
      this.names = this.selectedRows.map(item => item.name)
      this.single = selectedRowKeys.length !== 1
    },
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
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
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.ConfigDataAddOrEdit.handleAdd(4)
      ))
    },
    handleView(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.ConfigDataAddOrEdit.handleView(record,4)
      ))
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.ConfigDataAddOrEdit.handleUpdate(record, 4)
      ))
    },
    handleCopy(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.ConfigDataAddOrEdit.handleCopy(record, 4)
      ))
    },
    handleDelete(row) {
      this.showAddModal = true
      if (row.name !==undefined || this.selectedRowKeys.length > 0 ) {
        this.$nextTick(() => (
          this.$refs.ConfigDataAddOrEdit.handleDelete(row, this.ids, this.names, 4)
        ))
      } else {
        this.$message.info('请选择要删除的内容！')
      }
    },
    handleImport() { },
    handleExport() { },
    // 表格内-状态切换
    onchange(value, record) {
      record.status = Number(value)
      let params = {
        id: this.automation_Id,
        browser: record
      }
      projectApis.editAutomationBrowser(params).then(response => {
        this.getList()
        this.$message.success('修改成功',)
      })
    }
  },
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

.title-wrapper {
  padding: 20px 0 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}

.table-operations {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>