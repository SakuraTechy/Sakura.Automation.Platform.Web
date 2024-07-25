<template>
  <div>
    <SearchControl ref="SearchControl" :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery"
      :disabled="multiple" />
    <a-divider style="margin-top: 15px;" />
    <advance-table style="margin-top: -20px;" :scroll="{ x: 1500, y: 178 }" :columns="columns" :data-source="list"
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
        <a-space :size="8">
          <a-button type="primary" :disabled="multiple" @click="handleAdd()"
            v-hasPermi="['project:automationConfig:environmentConfig:add']">
            <a-icon type="plus-square" />新建环境配置
          </a-button>
          <a-button type="ghost" :disabled="multiple" @click="handleSyncAll()"
            v-hasPermi="['project:automationConfig:environmentConfig:add']">
            <a-icon type="cloud" />同步环境配置
          </a-button>
        </a-space>
        <a-space :size="8" style="margin-right: 8px">
          <a-button type="primary" :disabled="multiple" @click="handleImport"
            v-hasPermi="['project:automationConfig:environmentConfig:export']">
            <a-icon type="upload" />批量导入
          </a-button>
          <a-button type="danger" :disabled="multiple1" @click="handleExport"
            v-hasPermi="['project:automationConfig:environmentConfig:export']">
            <a-icon type="download" />批量导出
          </a-button>
          <a-button type="danger" :disabled="multiple1" @click="handleSync"
            v-hasPermi="['project:automationConfig:environmentConfig:add']">
            <a-icon type="cloud" />批量同步
          </a-button>
        </a-space>
      </div>
      <span slot="description" slot-scope="{ record }">
        <a :href="record.url" target="_blank">{{ record.description.name }}</a>
      </span>
      <span slot="offline" slot-scope="{ record }">
        <a-popover v-if="record.active.offline.status === 0" title="消息提示">
          <template #content>
            <span>{{ record.active.offline.offlineCauseReason }}</span>
          </template>
          <a-button type="Default" style="height: 25px;">离线</a-button>
        </a-popover>
        <a-popover v-else>
          <template #content>
            <a-descriptions title="环境信息" bordered>
              <a-descriptions-item label="环境类型">{{ record.description.systemType }}</a-descriptions-item>
              <a-descriptions-item label="用户名">{{ record.description.userName }}</a-descriptions-item>
              <a-descriptions-item label="密码">{{ record.description.passWord }}</a-descriptions-item>
              <a-descriptions-item label="环境地址">
                <a :href="record.url" target="_blank">{{ record.url }}</a>
              </a-descriptions-item>
            </a-descriptions>
          </template>
          <a-button type="primary" style="height: 25px;">在线</a-button>
        </a-popover>
      </span>
      <span slot="idle" slot-scope="{ record }">
        <a-button v-if="record.active.offline.status === 1 && record.active.idle.status === 1" type="primary"
          style="height: 25px;background-color: #05d966;border-color: #05d966;">空闲</a-button>
        <a-popover v-else-if="record.active.offline.status === 1 && record.active.idle.status === 0">
          <template #content>
            <!-- <a-space>
              <a href v-for="executor in record.active.executors">{{ executor.user }}</a>
              <a v-for="executor in record.active.executors">{{ executor.url }}</a>
            </a-space> -->
            <a-descriptions title="使用信息" bordered>
              <a-descriptions-item label="用户" v-for="(executor,index) in record.active.idle.executors" :key="index" >{{ executor.user }}</a-descriptions-item>
              <a-descriptions-item label="地址" v-for="(executor,index) in record.active.idle.executors" :key="index" >{{ executor.url }}</a-descriptions-item>
            </a-descriptions>
          </template>
          <a-button type="danger" style="height: 25px;">使用中</a-button>
        </a-popover>
        <a-button v-else type="Default" style="height: 25px;">离线</a-button>
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
        <a :disabled="multiple" @click="handleSync(record)"
          v-hasPermi="['project:automationConfig:environmentConfig:add']"> 同步 </a>
        <a-divider type="vertical" />
        <a :disabled="multiple" @click="handleUpdate(record)"
          v-hasPermi="['project:automationConfig:environmentConfig:edit']"> 修改 </a>
        <a-divider type="vertical" />
        <a @click="handleView(record)" v-hasPermi="['project:automationConfig:environmentConfig:query']"> 详情 </a>
        <a-divider type="vertical" />
        <a @click="handleRemote(record)" v-hasPermi="['project:automationConfig:environmentConfig:query']"> 远程 </a>
        <!-- <a :disabled="multiple" @click="handleCopy(record)"
          v-hasPermi="['project:automationConfig:environmentConfig:edit']"> 复制 </a>
        <a-divider type="vertical" />
        <a :disabled="multiple" @click="handleDelete(record)" v-show="record.id !== '1'"
          v-hasPermi="['project:automationConfig:environmentConfig:remove']">删除</a>
        <a-divider type="vertical" />
        <a :disabled="multiple" @click="handleExport(record)"
          v-hasPermi="['project:automationConfig:environmentConfig:export']"> 导出 </a> -->
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
import { environmentQueryData, environmentColumns } from './Config'

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
      queryData: environmentQueryData,
      columns: environmentColumns,
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
      description: {
        name: '',
        systemType: '',
        userName: '',
        passWord: ''
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple1: true,
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
      // this.getList()
      setTimeout(() => {
        this.handleSyncAll()
      }, 100)
    }
  },
  methods: {
    async getList() {
      this.loading = true
      await projectApis.getAutomationInfo(this.automation_Id).then((response) => {
        if (response.data.environmentConfig !== null && response.data.environmentConfig.length > 0) {
          this.list = JSON.parse(response.data.environmentConfig)
        } else {
          this.list = []
        }
        this.list1 = this.list
        this.loading = false
      })
      this.selectedRowKeys = []
      this.multiple1 = !this.selectedRowKeys.length
      return this.$refs.SearchControl.handleQuery()
    },
    getList1(arr, param) {
      let obj = []
      const params = Object.keys(param)
        .filter((key) => param[key] !== '' && param[key] !== null && param[key] !== undefined)
        .reduce((acc, key) => ({ ...acc, [key]: param[key] }), {})
      var bProps = Object.getOwnPropertyNames(params)
      // console.info('bProps', bProps)
      arr.forEach((item, index) => {
        // console.info(`==================第 ${index + 1} 条===========================`)
        // console.info('item', item)
        // console.info('param', param)
        var num = 0
        // const param = _.pickBy({ ...param })
        for (var i = 0; i < bProps.length; i++) {
          var propName = bProps[i]
          // console.info('------------------------------')
          // console.info('propName', propName)
          // console.info('item[propName]', item[propName])
          // console.info('param[propName]', param[propName])
          // console.info('String(item[propName])', String(item[propName]))
          // console.info('String(param[propName])', String(param[propName]))
          if (this.isEqual(item[propName], param[propName])
            // || this.like(String(item[propName]), String(param[propName]))
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
      // console.log(value)
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
      this.multiple1 = !this.selectedRowKeys.length
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
          // return '' + objA === '' + objB;
          // console.info("objAString", objA)
          // console.info("objBString", objB)
          return '' + objA === '' + objB || this.like(objA, objB)
        case '[object Number]':
          //数字转换比较,判断是否为NaN
          // console.info("objANumber", objA)
          // console.info("objBNumber", objB)
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
            // console.info(`Object_${keys[i]}_Status`, objB[keys[i]].status)
            // if (keys[i]==='offline' && objB[keys[i]].status === 0) return true
            if (keys[i] === 'idle' && objB[keys[i]].status === undefined) return true
          }
          for (let i = 0; i < keys.length; i++) {
            // console.info(`objA_Object_item_${keys[i]}`, objA[keys[i]])
            // console.info(`objB_Object_param_${keys[i]}`, objB[keys[i]])
            // if (objB[keys[i]] === undefined) return true
            // if (keys[i]==='status' && objB[keys[i]].status === undefined) return true
            if (keys[i] === 'status' && !this.isEqual(objA[keys[i]], objB[keys[i]])) return false;
          }
          keys = Object.keys(objB);
          for (let i = 0; i < keys.length; i++) {
            // console.info(`objA_Object_item_${keys[i]}`, objA[keys[i]])
            // console.info(`objB_Object_param_${keys[i]}`, objB[keys[i]])
            // if (keys[i]==='idle' && objA[keys[i]].executors === undefined) return true
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
      // this.getList()
    },
    onSizeChange(current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      // this.getList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map(item => item.id)
      this.names = this.selectedRows.map(item => item.name)
      this.single = selectedRowKeys.length !== 1
      this.multiple1 = !this.selectedRowKeys.length
    },
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      // this.getList()
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
      // this.showAddModal = true
      // this.$nextTick(() => (
      //   this.$refs.ConfigDataAddOrEdit.handleAdd(3)
      // ))
      projectApis.getAutomationInfo(this.automation_Id).then((response) => {
        var jenkinsList = JSON.parse(response.data.jenkinsConfig)
        if (jenkinsList !== null && jenkinsList.length > 0) {
          jenkinsList.forEach((item) => {
            if (item.status === 1) {
              window.open(item.url + "/computer/new")
            }
          })
        } else {
          this.$message.info('请先添加Jenkins配置！')
        }
      })
    },
    handleSyncAll() {
      this.loading = true
      let params = {
        id: this.automation_Id,
        names: []
      }
      projectApis.syncAutomationEnvironment(params).then(response => {
        this.$message.success('同步成功')
        this.getList()
      }).catch(err => {
        console.log('同步失败', err)
        this.$message.error('同步失败')
      })
    },
    handleSync(record) {
      // record !== undefined ? record.name !== undefined ? this.names.push(record.name) : this.names : null
      var names = []
      if (this.selectedRowKeys.length > 0) {
        names = this.names
      } else if (record !== undefined && record.name !== undefined) {
        names.push(record.name)
      } else {
        this.$message.info('请选择要批量同步的环境！')
        return
      }
      let params = {
        id: this.automation_Id,
        names: names
      }
      projectApis.syncAutomationEnvironment(params).then(response => {
        // Promise.all([
        //   this.getList(),
        //   // this.$message.success('同步成功')
        // ]).then(res => {
        //   console.log(res);
        //   console.log(res[1]);
        //   if(res[0]===undefined){
        //     this.$refs.SearchControl.handleQuery()
        //   }
        // })
        // this.getList().then(res => {
        //   // console.log(res)
        //   this.$refs.SearchControl.handleQuery()
        // })
        // setTimeout(() => {
        //   this.$nextTick(() => (
        //     this.$refs.SearchControl.handleQuery(),
        //     this.$message.success('同步成功')
        //   ))
        // }, 1000)
        this.$message.success('同步成功')
        this.getList()
        // this.handleDescription(record)
      }).catch(err => {
        console.log('同步失败', err)
        this.$message.error('同步失败')
      })
    },
    handleView(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.ConfigDataAddOrEdit.handleView(record, 3)
      ))
    },
    handleRemote(record) {
      var url = ''
      var configList = record.configList
      configList.forEach((item, index) => {
        if (item.paramsName === 'VM') {
          url = item.paramsValue
        }
      })
      if (url !== '') {
        window.open(url)
        // window.open(`https://172.19.5.4/ui/webconsole.html?vmId=${item.paramsValue}&vmName=${record.name}&serverGuid=c7189593-bf4b-4589-9d99-0180f660acc3&host=172.19.5.4&sessionTicket=cst-VCT-52f22750-f622-6ac1-adc7-be8d6875b2e5--tp-4D-77-EA-89-2F-C9-07-B5-A4-08-D5-10-A4-12-67-7D-80-BB-1D-25&thumbprint=4D:77:EA:89:2F:C9:07:B5:A4:08:D5:10:A4:12:67:7D:80:BB:1D:25&locale=zh-CN`)
      } else {
        this.$message.error('未配置VMware® VSphere®虚拟机远程地址，请先进行配置，可从虚拟机管理平台获取！')
      }
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.ConfigDataAddOrEdit.handleUpdate(record, 3)
      ))
    },
    handleCopy(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.ConfigDataAddOrEdit.handleCopy(record, 3)
      ))
    },
    handleDelete(row) {
      this.showAddModal = true
      if (row.id !== undefined || this.selectedRowKeys.length > 0) {
        this.$nextTick(() => (
          this.$refs.ConfigDataAddOrEdit.handleDelete(row, this.ids, this.names, 3)
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
        environment: record
      }
      projectApis.editAutomationEnvironment(params).then(response => {
        this.$message.success('修改成功')
      }).catch(error => {
        this.$message.error('修改失败')
      }).finally(() => {
        this.getList()
      })
    },
    handleDescription(record) {
      try {
        this.description = JSON.parse(record.description)
      } catch (error) {
        this.description.name = 'Jenkins远程节点描述信息非JSON格式，请检查后重试！'
        console.error('Jenkins远程节点描述非JSON格式，请检查后重试！', error)
      }
      return this.description.name
    },
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