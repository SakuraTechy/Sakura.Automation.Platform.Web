<template>
  <div>
    <a-tabs v-model="activeKey" class="tab-title" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
      <a-tab-pane key="1" tab="计划列表" :closable="false">
        <a-card :bordered="false" style="height: 100px">
          <SearchControl
            :queryData="queryData"
            :projectOptions="projectOptions"
            :memberOptions="memberOptions"
            @handleQuery="handleQuery"
            @resetQuery="resetQuery"
          />
        </a-card>
        <a-divider />
        <a-card :bordered="false" class="container">
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
            :row-selection="rowSelection"
            :needTitle="false"
          >
            <div class="table-operations" slot="button">
              <a-button type="primary" @click="handleAdd()" v-hasPermi="['test:testPlan:add']">
                <a-icon type="plus-square" />新建计划
              </a-button>
              <a-space :size="8" style="margin-right: 8px">
                <a-button type="primary" @click="handleImport" v-hasPermi="['test:testPlan:export']">
                  <a-icon type="upload" />批量导入
                </a-button>
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleExport"
                  v-hasPermi="['test:testPlan:export']"
                >
                  <a-icon type="download" />批量导出
                </a-button>
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPermi="['test:testPlan:remove']"
                >
                  <a-icon type="delete" />批量删除
                </a-button>
              </a-space>
            </div>
            <!-- <span slot="status" slot-scope="{ record }">
          <a-switch :checked="Boolean(record.status)" @change="(value) => onchange(record, value)" />
        </span> -->
            <span slot="projectId" slot-scope="{ record }">
              {{ getProjectName(record.projectId) }}
            </span>
            <span slot="type" slot-scope="{ record }">
              <div
                v-for="(item, index) in getFilterArray(testPlanTypeOptions, (item) => item.id === record.type)"
                :key="index"
              >
                {{ item.name }}
              </div>
            </span>
            <span slot="members" slot-scope="{ record }">
              <div v-if="record.memberList && record.memberList.length === 0">暂无成员</div>
              <a-popover v-else title="测试计划成员">
                <template slot="content">
                  <p v-for="member in record.memberList" :key="member.key">{{ member.name }}</p>
                </template>
                <a>查看</a>
              </a-popover>
            </span>
            <span slot="principals" slot-scope="{ record }">
              <div v-if="record.principalList && record.principalList.length === 0">暂无成员</div>
              <a-popover v-else title="测试计划负责人">
                <template slot="content">
                  <p v-for="principal in record.principalList" :key="principal.key">{{ principal.name }}</p>
                </template>
                <a>查看</a>
              </a-popover>
            </span>
            <span slot="testProgress" slot-scope="{ record }">
              <a-progress style="padding: 0px 5px 0px 0px;"
                size="small" 
                :stroke-color="{ from: '#108ee9',to: '#87d068' }"
                :percent="getTestProgress(record)"
                :status="getTestProgress(record) >= 100 ? 'normal' : 'active'"
              />
              <!-- <a-progress
                size="small" 
                :stroke-color="{ from: '#108ee9',to: '#87d068' }"
                :percent="100"
                status="normal"
              /> -->
            </span>
            <span slot="status" slot-scope="{ record }">
              <a-button v-for="(item, index) in getFilterArray(testPlanStatusOptions, (item) => item.id === record.status)" :key="index"
               :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record.status)[0], borderColor: getButtonStyle(record.status)[1] }"
              > {{ item.name }} 
              </a-button>
              <!-- <a-button 
                v-if="record.status === '1'" 
                type="primary" 
                style="height: 20px;background-color: #05d966;border-color: #05d966;"
              > 已完成 </a-button> -->
            </span>
            <span slot="createTime" slot-scope="{ record }">
              {{ parseTime(record.createTime) }}
            </span>
            <span slot="updateTime" slot-scope="{ record }">
              {{ parseTime(record.updateTime) }}
            </span>
            <span slot="operation" slot-scope="{ record }">
              <a @click="handleUpdate(record)" v-hasPermi="['test:testPlan:edit']">修改</a>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:testPlan:edit']" />
              <a @click="handleCopy(record)" v-hasPermi="['test:testPlan:add']">复制</a>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:testPlan:add']" />
              <a-dropdown>
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">执行</a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleExecut1(record)" v-hasPermi="['test:testPlan:execTestScene']"> 功能测试 </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleExecut(record)" v-hasPermi="['test:testPlan:execTestScene']"> UI自动化测试 </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:testPlan:execTestScene']" />
              <a-dropdown>
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">更多<a-icon type="down" /> </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleDelete(record)" v-show="record.id !== '1'" v-hasPermi="['test:testPlan:remove']">删除</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleTestReport(record)" v-hasPermi="['test:testPlan:edit']"> 报告 </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <!-- <a-divider type="vertical" v-hasPermi="['test:testPlan:remove']" /> -->
              <!-- <a-divider type="vertical" />
              <a @click="handleEnvironmentConfig(record)" v-hasPermi="['project:environmentConfig:list']"> 环境配置 </a>
              <a-divider type="vertical" />
              <a @click="handleAutomationConfig(record)" v-hasPermi="['project:automationConfig:list']"> 自动化配置 </a> -->
            </span>
          </advance-table>
          <!-- 增加 -->
          <test-plan-add-form
            v-if="showAddModal"
            ref="TestPlanAddForm"
            :projectOptions="projectOptions"
            :memberOptions="memberOptions"
            @ok="getList"
            @close="showAddModal = false"
          />
          <!-- 修改 -->
          <test-plan-edit-form
            v-if="showEditModal"
            ref="TestPlanEditForm"
            :projectOptions="projectOptions"
            :memberOptions="memberOptions"
            @ok="getList"
            @close="showEditModal = false"
          />
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-for="(item, index) in panes" :key="(index + 2).toString()" :tab="item.title" :closable="true">
        <TestScene
          ref="testScene"
          :tab="tab"
          :record="item.record"
          :memberOptions="memberOptions"
          @getList="getList"
          @remove="remove"
        ></TestScene>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import * as api from '@/api/api'
import * as ui from '@/api/ui'
import SearchControl from '../components/SearchControl.vue'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import TestPlanAddForm from './modules/TestPlanAddForm'
import TestPlanEditForm from './modules/TestPlanEditForm'
import { testPlanTypeOptions, testPlanStatusOptions } from '../components/Config'
import TestScene from './modules/TestScene.vue'

export default {
  name: 'Environment',
  components: { SearchControl, AdvanceTable, TestPlanAddForm, TestPlanEditForm, TestScene },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.projectId, a.createTime',
        isAsc: 'desc',
      },
      queryData: [
        {
          label: '所属项目',
          value: 'projectId',
        },
        {
          label: '计划类型',
          value: 'type',
        },
        {
          label: '计划名称',
          value: 'name',
        },
        {
          label: '计划状态',
          value: 'status',
        },
        {
          label: '创建人',
          value: 'createByName',
        },
        {
          label: '创建时间',
        },
      ],
      columns: [
        {
          title: '所属项目',
          width: 250,
          dataIndex: 'projectId',
          scopedSlots: { customRender: 'projectId' },
          ellipsis: true,
          fixed: 'left',
          align: 'center',
        },
        {
          title: '计划类型',
          width: 100,
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
        },
        // {
        //   title: '计划ID',
        //   dataIndex: 'id',
        //   width: 270,
        //   ellipsis: true,
        //   fixed: 'left',
        //   align: 'center'
        // },
        {
          title: '计划名称',
          width: 308,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center',
        },
        // {
        //   title: '计划简称',
        //   width: 113,
        //   dataIndex: 'abbreviate',
        //   ellipsis: true,
        //   fixed: 'left',
        //   align: 'center'
        // },
        // {
        //   title: '计划描述',
        //   width: 250,
        //   dataIndex: 'description',
        //   ellipsis: true,
        //   align: 'center',
        // },
        {
          title: '计划成员',
          width: 90,
          dataIndex: 'members',
          scopedSlots: { customRender: 'members' },
          align: 'center',
        },
        {
          title: '计划负责人',
          width: 90,
          dataIndex: 'principals',
          scopedSlots: { customRender: 'principals' },
          align: 'center',
        },
        {
          title: '测试进度',
          width: 120,
          dataIndex: 'testProgress',
          scopedSlots: { customRender: 'testProgress' },
          align: 'center',
        },
        {
          title: '计划状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center',
        },
        {
          title: '计划开始时间',
          dataIndex: 'plannedStartTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'plannedStartTime' },
          align: 'center',
        },
        {
          title: '计划结束时间',
          dataIndex: 'plannedEndTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'plannedEndTime' },
          align: 'center',
        },
        // {
        //   title: '实际开始时间',
        //   dataIndex: 'actualStartTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'actualStartTime' },
        //   align: 'center',
        // },
        // {
        //   title: '实际结束时间',
        //   dataIndex: 'actualEndTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'actualEndTime' },
        //   align: 'center',
        // },
        {
          title: '创建人',
          width: 80,
          dataIndex: 'createByName',
          align: 'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      panes: [],
      tab: '',
      activeKey: '1',
      projectOptions: [],
      memberOptions: [],
      testPlanTypeOptions,
      testPlanStatusOptions,
      total: 0,
      list: [],
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
      showAddModal: false,
      showEditModal: false,
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.id === '1',
            name: record.name,
          },
        }),
      }
    },
    isDragTable() {
      return this.dragTable(this.columns)
    },
  },
  watch: {
    $route(to, from) {
      // console.log('Route changed');
      this.getAllProjectList()
      this.getList()
    },
    activeKey: {
      handler(key) {
        // console.log('key: ' + key)
        if(key>1){
          // console.log(this.panes)
          // console.log(this.panes[key-2].record.id)
          // console.log(this.$refs.testScene)
          // console.log(this.$refs.testScene[key-2])
          if(this.$refs.testScene!==undefined&&this.$refs.testScene[key-2]!==undefined){
            this.$refs.testScene[key-2].handleChange(this.panes[key-2].record.id)
            // this.$refs.testScene[key-2].testPlan.id = this.panes[key-2].record.id
            // this.$refs.testScene[key-2].testPlan.projectId = this.panes[key-2].record.projectId
          }
        }else{
          this.getList()
        }
      },
    },
  },
  created() {
    // console.log('Created method called');
    this.getAllProjectList()
    this.getAllUsers()
    this.getList()
    const originalWidth = 1676
    const screenWidth = 1330
    const result = this.calculateWidth(originalWidth, screenWidth)
    console.log('在屏幕宽度为' + screenWidth + 'px时，容器的宽度应为' + result + 'px。')
  },
  beforeRouteUpdate(to, from, next) {
    console.log('Route parameter changed');
    this.getAllProjectList()
    this.getList()
    next()
  },
  methods: {
    calculateWidth(originalWidth, screenWidth) {
      return Math.round((screenWidth / 1920) * originalWidth)
    },
    // 获取所有项目
    getAllProjectList() {
      api.getProjectList().then((response) => {
        this.projectOptions = response.data.list
        // console.log('this.projectOptions', this.projectOptions);
      })
    },
    // 获取系统的所有用户
    getAllUsers() {
      api.getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    getSceneList(record) {
      const params = {
        testPlanId: record.id,
        testSceneState: 'select',
      }
      ui.getSceneList(params).then((response) => {
        let number = 0
        response.data.list.forEach(testRecord =>{
          console.log(record.id);
          console.log(testRecord);
          if (testRecord.testPlanId === record.id && testRecord.executeStatus === '已完成') {
            number++
          }else{
            number--
          }
        })
        console.log(number);
      })
    },
    getTestProgress(record){
      // console.log(record);
      const uiTestSceneList = record.uiTestScene&&record.uiTestScene!=='[]'?record.uiTestScene.substring(1, record.uiTestScene.length - 1).split(','):[]
      let num1 = parseFloat(uiTestSceneList.length)
      let num2 = parseFloat(record.testProgress)
      let testProgress = ((num1-num2) / num1 * 100).toFixed(0)
      // console.log(testProgress);
      //  if(parseFloat(testProgress)>=100){
      //   record.status = '2'
      //  }
      return parseFloat(testProgress);
    },
    getButtonStyle(status) {
      switch (status) {
        case '0':
          return ['#909399', '#909399']
        case '1':
          return ['#ff4d4f', '#ff4d4f']
        case '2':
          return ['#05c878', '#05c878']
        default:
          return ['#909399', '#909399'];
      }
    },
    // 获取项目名称
    getProjectName(projectId) {
      // console.info(this.findNodeId(this.projectOptions, projectId, 'name'))
      return this.findNodeId(this.projectOptions, projectId, 'name')
    },
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    getList() {
      this.loading = true
      api.getTestPlanList(this.queryParam).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
      this.selectedRowKeys = []
      this.multiple = !this.selectedRowKeys.length
    },
    handleQuery(value) {
      if (value === undefined) {
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
        }
      } else {
        // console.log(this.queryParam);
        this.queryParam = Object.assign(this.queryParam, value)
        this.queryParam.pageNum = 1
      }
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.selectedRowKeys = []
      // this.multiple = !this.selectedRowKeys.length
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.projectId, a.name',
        isAsc: 'asc',
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
      this.ids = this.selectedRows.map((item) => item.id)
      this.names = this.selectedRows.map((item) => item.name)
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
    handleAdd() {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.TestPlanAddForm.handleAdd())
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.TestPlanAddForm.handleUpdate(record))
    },
    handleCopy(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.TestPlanAddForm.handleCopy(record))
    },
    handleDelete(row) {
      var that = this
      row.id ? this.ids.push(row.id) : ''
      const ids = this.ids
      const names = row.name || this.names
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的测试计划',
        onOk() {
          return api
            .deleteTestPlan({ ids })
            .then((res) => {
              if (res.code === 200) {
                that.$message.success('删除成功')
                that.getList()
                // that.onSelectChange([], [])
              }
            })
            .catch((error) => {
              that.$message.error('删除失败', 3)
              reject(error)
            })
        },
      })
      this.ids = []
    },
    handleExecut1(record) {
      this.tab='功能测试'
    },
    handleExecut(record) {
      this.tab='UI自动化测试'
      var num = false
      var key = 0
      if (this.panes.length > 0) {
        // console.log(this.panes);
        this.panes.forEach((item,index) => {
          if (item.title === record.name) {
            num = true
            key = index+2
            return
          }
        })
        if (num) {
          // this.$message.info('已存在打开的窗口，请先关闭！')
          this.activeKey = key.toString()
        } else {
          this.panes.push({
            title: record.name,
            // title: '计划执行',
            record,
            multiple: true
          })
          this.activeKey = (this.panes.length + 1).toString()
          this.environmentId = ''
        }
      } else {
        this.panes.push({
          title: record.name,
          // title: '计划执行',
          record,
          multiple: true
        })
        this.activeKey = (this.panes.length + 1).toString()
        this.environmentId = ''
      }
    },
    handleTestReport(record) {
      this.$router.push({
        name: 'TestReport',
        params: {
          testPlanId: record.id
        }
      })
    },
    handleImport() {},
    handleExport(row) {
      // var that = this
      // var ids1 = []
      // if (row.id !== undefined) {
      //   ids1.push(row.id)
      // }
      // // row.id ? this.ids.push(row.id) : ''
      // // const ids = row.id || that.ids
      // const ids = ids1.length > 0 ? ids1 : that.ids
      // const names = row.name || that.names
      // // console.info(ids)
      // var param = {
      //   projectId: row.projectId,
      //   ids: ids,
      // }
      // that.$Modal.confirm({
      //   title: '确认导出所选中数据?',
      //   content: '当前选中为' + names + '的测试计划',
      //   onOk() {
      //     return api
      //       .exportTestPlan(param)
      //       .then((res) => {
      //         if (res.status != 404) {
      //           that.readBlobDown(res, 'environment.yml', 'application/x-yaml')
      //           that.$message.success('导出成功')
      //         }
      //       })
      //       .catch((error) => {
      //         that.$message.error('导出失败')
      //         reject(error)
      //       })
      //   },
      //   onCancel() {},
      // })
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
    onEdit1(targetKey, action) {
      this[action](targetKey)
    },
    onEdit(targetKey, action) {
      var that = this
      this.$Modal.confirm({
        title: '关闭页面?',
        content: '确认关闭当前页面吗?',
        onOk() {
          return that[action](targetKey)
        },
        onCancel() { }
      })
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
        status: Number(value),
      }
      // api.updateTestPlanStatus(params).then(() => {
      //   this.$message.success('修改成功')
      //   this.getList()
      //   // setTimeout(() => {this.getList()}, 2000)
      // })
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
  font-family: 'Microsoft YaHei';
}
.table-operations {
  // padding: 5px 0px 5px 0px;
  padding: 0px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
}

.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 305px);
  margin-top: -15px;
}

.ant-progress-line {
  padding: 0px 5px 0px 0px;
}

/* 当屏幕宽度小于等于1920px时，根据当前的width自适应相应大小 */
@media (min-width: 1920px) {
  .container {
    width: calc(100% * (1920 / 1920));
    // width: calc(Math.round((1920 / 1920) * 1676));
  }
}
</style>
