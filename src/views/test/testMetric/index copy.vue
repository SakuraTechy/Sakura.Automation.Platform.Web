<template>
  <div>
    <tab-list style="margin-top: 0px" ref="sceneList" :tab="tab0" activeKey="0">
      <template :slot="tab0.tab0.name">
        <!-- <UITestEcharts ref="echarts" :record="record" :key="tabKey" />-->
        <div class="card-grid-container">
          <div class="small-item">
            <a-select
              style="width: 250px"
              v-model="project.id"
              placeholder="请选择项目"
              option-filter-prop="children"
              @change="handleChangeProject"
              show-search
              allowClear
            >
              <a-select-option v-for="(item, index) in projectOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select
              style="width: 150px; margin-left: 10px"
              v-model="version.id"
              placeholder="请选择版本"
              option-filter-prop="children"
              @change="handleChangeVersion"
              show-search
              allowClear
            >
              <a-select-option v-for="(item, index) in versionOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <!-- 第一行 -->
          <UITestEcharts class="card-grid-item large-item" ref="echarts" :record="record" :key="tabKey" />
          <UITestEcharts class="card-grid-item large-item" ref="echarts" :record="record" :key="tabKey" />
          <!-- 第二行 -->
          <!-- <a-card title="自动化测试执行情况统计" class="card-grid-item large-item">
            <div class="card-grid-container1">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">历史运行总数量 (次)</span>
                  <span class="text-grid-text">600</span>
                  <div class="text-grid-container1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周 (次)</span>
                      <span class="text-grid-text">+7 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月 (次)</span>
                      <span class="text-grid-text">+28 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年 (次)</span>
                      <span class="text-grid-text">+336 ></span>
                    </div>
                  </div>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container2">
                  <div class="text-grid-container2_1">
                    <div class="text-grid-container2_2">
                      <span class="text-grid-title">历史场景执行数量 (个)</span>
                      <span class="text-grid-text">19488</span>
                    </div>
                    <div class="text-grid-container2_2">
                      <span class="text-grid-title">历史节省人力 (人/天)</span>
                      <span class="text-grid-text">278.40</span>
                    </div>
                  </div>
                  <div class="text-grid-container2_1">
                    <div class="text-grid-container2_2">
                      <span class="text-grid-title">本周场景执行数量 (个)</span>
                      <span class="text-grid-text">406</span>
                    </div>
                    <div class="text-grid-container2_2">
                      <span class="text-grid-title">本周节省人力 (人/天)</span>
                      <span class="text-grid-text">5.80</span>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
            <div class="card-grid-container2">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">自动化覆盖率（%）</span>
                  <span class="text-grid-text">100%</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">自动化执行率（本周）</span>
                  <div class="text-grid-container2_3">
                    <span class="text-grid-text">50</span>
                    <span class="text-grid-text2"> 个/小时</span>
                  </div>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">缺陷发现率（本周）</span>
                  <span class="text-grid-text">100%</span>
                </div>
              </a-card>
            </div>
          </a-card> -->
          <!-- <a-card title="场景定时任务数量统计" class="card-grid-item large-item">
            <div class="card-grid-container1">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">场景定时任务数量统计 (个)</span>
                  <span class="text-grid-text">58</span>
                  <div class="text-grid-container1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周 (个)</span>
                      <span class="text-grid-text">+7 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月 (个)</span>
                      <span class="text-grid-text">+28 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年 (个)</span>
                      <span class="text-grid-text">+336 ></span>
                    </div>
                  </div>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container2">
                  <div class="text-grid-container2_1">
                    <div class="text-grid-container2_2">
                      <span class="text-grid-title">历史执行总次数 (个)</span>
                      <span class="text-grid-text">117</span>
                    </div>
                  </div>
                  <div class="text-grid-container2_1">
                    <div class="text-grid-container2_2">
                      <span class="text-grid-title">本周执行次数 (个)</span>
                      <span class="text-grid-text">7</span>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
            <div class="card-grid-container3">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">当前运行数（个）</span>
                  <span class="text-grid-text">10</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">运行通过率（%）</span>
                  <span class="text-grid-text">100%</span>
                </div>
              </a-card>
            </div>
          </a-card> -->
          <a-card title="自动化测试执行情况统计" class="card-grid-item large-item">
            <div class="card-grid-container1">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">历史运行总次数 (次)</span>
                  <span class="text-grid-text1">600</span>
                  <div class="text-grid-container1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周 (次)</span>
                      <span class="text-grid-text">+17 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月 (次)</span>
                      <span class="text-grid-text">+128 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年 (次)</span>
                      <span class="text-grid-text">+336 ></span>
                    </div>
                  </div>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">历史执行总数量 (个)</span>
                  <span class="text-grid-text1">20000</span>
                  <div class="text-grid-container1_1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周 (个)</span>
                      <span class="text-grid-text">+406 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月 (个)</span>
                      <span class="text-grid-text">+1624 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年 (个)</span>
                      <span class="text-grid-text">+19488 ></span>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
            <div class="card-grid-container2">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">自动化覆盖率（%）</span>
                  <span class="text-grid-text">100%</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">自动化通过率（本周）</span>
                  <span class="text-grid-text">100%</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">自动化执行率（本周）</span>
                  <div class="text-grid-container2_3">
                    <span class="text-grid-text">50.00</span>
                    <span class="text-grid-text2"> 个/小时</span>
                  </div>
                </div>
              </a-card>
            </div>
          </a-card>
          <a-card title="自动化测试价值产出统计" class="card-grid-item large-item">
            <div class="card-grid-container1">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">历史发现总缺陷 (个)</span>
                  <span class="text-grid-text1">400</span>
                  <div class="text-grid-container1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周 (个)</span>
                      <span class="text-grid-text">+110 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月 (个)</span>
                      <span class="text-grid-text">+130 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年 (个)</span>
                      <span class="text-grid-text">+360 ></span>
                    </div>
                  </div>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">历史节省总人力 (人/天)</span>
                  <span class="text-grid-text1">578.40</span>
                  <div class="text-grid-container1_1_2">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周 (人/天)</span>
                      <span class="text-grid-text">+115.80 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月 (人/天)</span>
                      <span class="text-grid-text">+123.23 ></span>
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年 (人/天)</span>
                      <span class="text-grid-text">+302.44 ></span>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
            <div class="card-grid-container2">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">缺陷发现率（本周）</span>
                  <span class="text-grid-text">30%</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">缺陷发现率（本月）</span>
                  <span class="text-grid-text">90%</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <span class="text-grid-title">缺陷发现率（本年）</span>
                  <span class="text-grid-text">100%</span>
                </div>
              </a-card>
            </div>
          </a-card>
          <!-- 第三行 -->
          <a-card title="本周进行中的测试计划" class="card-grid-item small-item">
            <advance-table
              style="margin-top: -20px; padding: 0px 0px 10px 10px"
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
                <a-progress
                  style="padding: 0px 5px 0px 0px"
                  size="small"
                  :stroke-color="{ from: '#108ee9', to: '#87d068' }"
                  :percent="getTestProgress(record)"
                  :status="getTestProgress(record) >= 100 ? 'normal' : 'active'"
                />
              </span>
              <span slot="status" slot-scope="{ record }">
                <a-button
                  v-for="(item, index) in getFilterArray(testPlanStatusOptions, (item) => item.id === record.status)"
                  :key="index"
                  :style="{
                    height: '25px',
                    color: 'white',
                    backgroundColor: getButtonStyle(record.status)[0],
                    borderColor: getButtonStyle(record.status)[1],
                  }"
                >
                  {{ item.name }}
                </a-button>
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="uiTestScene" slot-scope="{ record }">
                {{ getSceneList(record.uiTestScene) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
                <a @click="handleTestPlan(record)" v-hasPermi="['test:testPlan:edit']"> 查看计划 </a>
                <a-divider type="vertical" v-hasPermi="['test:testPlan:remove']" />
                <a @click="handleTestReport(record)" v-hasPermi="['test:testPlan:edit']"> 查看报告 </a>
              </span>
            </advance-table>
          </a-card>
          <!-- 第四行 -->
          <a-card title="卡片6" class="card-grid-item small-item"></a-card>
        </div>
      </template>
      <template :slot="tab0.tab1.name"> </template>
    </tab-list>
  </div>
</template>

<script>
import * as api from '@/api/api'
import * as utils from '@/utils/sakura'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import TabList from './modules/TabList.vue'
import UITestEcharts from './modules/UITestEcharts.vue'
import { testPlanTypeOptions, testPlanStatusOptions } from '../components/Config'

export default {
  name: 'testMetric',
  props: {},
  components: {
    AdvanceTable,
    TabList,
    UITestEcharts,
  },
  provide() {
    return {
      testPlanOptions: this.testPlanOptions,
    }
  },
  computed: {
    isDragTable() {
      return this.dragTable(this.columns)
    },
  },
  data() {
    return {
      tabKey: '0',
      tab0: {
        tab0: {
          name: 'UI自动化测试度量',
          isVisible: true,
        },
        tab1: {
          name: '接口自动化测试度量',
          isVisible: true,
        },
      },

      projectOptions: [],
      project: {
        id: undefined,
        name: '',
      },
      versionOptions: [],
      version: {
        id: undefined,
        name: '',
      },
      memberOptions: [],
      testPlanTypeOptions,
      testPlanStatusOptions,
      loading: false,
      total: 0,
      list: [],

      queryParam: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.projectId, a.createTime',
        isAsc: 'desc',
        createStartTime: '',
        createEndTime: '',
        versionId: '',
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
          width: 330,
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
          title: '关联场景数',
          dataIndex: 'uiTestScene',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'uiTestScene' },
          align: 'center',
        },
        {
          title: '测试进度',
          width: 140,
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
        // {
        //   title: '计划开始时间',
        //   dataIndex: 'plannedStartTime',
        //   width: 155,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'plannedStartTime' },
        //   align: 'center',
        // },
        // {
        //   title: '计划结束时间',
        //   dataIndex: 'plannedEndTime',
        //   width: 155,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'plannedEndTime' },
        //   align: 'center',
        // },
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
    }
  },
  created() {
    this.getAllProjectList()
    this.getAllUsers()
    // this.getWeekRange()
    this.getList()
  },
  watch: {
    activeId: {
      handler(val) {
        // console.log('val: ' + val)
        // this.getList()
      },
    },
    testPlan: {
      handler(newVal, oldVal) {
        // console.info(newVal, oldVal)
        // this.handleQuery()
        // this.handleChange(newVal.id)
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    // 获取所有项目
    getAllProjectList() {
      api.getProjectList().then((response) => {
        this.projectOptions = []
        response.data.list.forEach((item, index) => {
          if (item.status === 1) {
            this.projectOptions.push(item)
          }
        })
        this.project.id = localStorage.getItem('projectId')? localStorage.getItem('projectId'): this.projectOptions[0].id
        this.getAllVersion()
      })
    },
    // 选项项目发生变化
    handleChangeProject(value) {
      console.log(value);
      if(value===undefined){
        this.project.id = undefined
        this.version.id = undefined
        localStorage.removeItem('projectId')
        localStorage.removeItem('versionId')
        this.versionOptions = []
      }else{
        this.project.id = value
        localStorage.setItem('projectId', this.project.id)
        localStorage.removeItem('versionId')
        this.getAllVersion()  
      }
    },
    // 获取当前项目环境下的所有版本
    async getAllVersion() {
      const queryParam = {
        projectId: this.project.id,
      }
      await api.getEnvironmentList(queryParam).then((response) => {
        response.data.list.forEach((item, index) => {
          if (item.status === 1) {
            var versionList = JSON.parse(item.versionConfig)
            this.versionOptions = []
            versionList.forEach((item, index) => {
              if (item.delFlag === 0) {
                this.versionOptions.push(item)
                if (item.status === 1) {
                  if (localStorage.getItem('versionId') !== null) {
                    this.version.id = localStorage.getItem('versionId')
                  } else {
                    this.version.id = item.id
                  }
                }
              }
            })
          }
        })
      })
    },
    handleChangeVersion(value) {
      this.version.id = value
      localStorage.setItem('versionId', this.version.id)
      // this.getList()
    },
    getProjectName(projectId) {
      // console.info(this.findNodeId(this.projectOptions, projectId, 'name'))
      return this.findNodeId(this.projectOptions, projectId, 'name')
    },
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    getSceneList(array) {
      // console.log(array)
      let sceneList = array.match(/[^\[\], ]+/g)
      return sceneList ? sceneList.length : 0
    },
    // 获取系统的所有用户
    getAllUsers() {
      api.getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    getTestProgress(record) {
      const uiTestSceneList =
        record.uiTestScene && record.uiTestScene !== '[]'
          ? record.uiTestScene.substring(1, record.uiTestScene.length - 1).split(',')
          : []
      let num1 = parseFloat(uiTestSceneList.length)
      let num2 = parseFloat(record.testProgress)
      let testProgress = (((num1 - num2) / num1) * 100).toFixed(0)
      return parseFloat(testProgress)
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
          return ['#909399', '#909399']
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
    handleTestPlan(record) {
      this.$router.push({
        name: 'TestPlan',
        params: {
          name: record.name,
        },
      })
    },
    handleTestReport(record) {
      this.$router.push({
        name: 'TestReport',
        params: {
          testPlanId: record.id,
        },
      })
    },
    getWeekRange() {
      const weekRange = utils.getWeekStartAndEnd()
      this.queryParam.createStartTime = weekRange.weekStart
      this.queryParam.createEndTime = weekRange.weekEnd
      // console.log(this.queryParam)
    },
    getList() {
      this.loading = true
      api.getTestPlanList(this.queryParam).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
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
  },
}
</script>

<style lang="less" scoped>
.card-grid-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  grid-auto-rows: auto; /* 根据内容自动分配行高 */
  grid-gap: 10px;

  .card-grid-container1 {
    display: grid;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    grid-auto-rows: auto; /* 根据内容自动分配行高 */
    grid-gap: 20px;
    padding: 0px 20px 0px 20px;

    .text-grid-container1 {
      display: grid;
      // grid-auto-flow: column; /* 垂直排列 */
      align-items: center; /* 可选，用于垂直居中 */
      // justify-items: center; /* 可选，用于水平居中 */
      grid-gap: 0px; /* 设置垂直间距 */
      padding: 20px;
      .text-grid-container1_1 {
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-gap: 65px;
        padding: 30px 0px 0px 0px;
      }
      .text-grid-container1_1_1 {
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-gap: 45px;
        padding: 30px 0px 0px 0px;
      }
      .text-grid-container1_1_2 {
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-gap: 20px;
        padding: 30px 0px 0px 0px;
      }
      .text-grid-container1_2 {
        display: grid;
        align-items: center; /* 可选，用于垂直居中 */
        grid-gap: 0px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
    }
    .text-grid-container2 {
      display: grid;
      align-items: center; /* 可选，用于垂直居中 */
      grid-gap: 30px; /* 设置垂直间距 */
      padding: 20px;

      .text-grid-container2_1 {
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-gap: 30px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
      .text-grid-container2_2 {
        display: grid;
        align-items: center; /* 可选，用于垂直居中 */
        grid-gap: 0px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
      .text-grid-container2_3 {
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-gap: 30px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
    }
  }
  .card-grid-container2 {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-auto-rows: auto; /* 根据内容自动分配行高 */
    grid-gap: 20px;
    padding: 20px 20px 20px 20px;
    .text-grid-container1 {
      display: grid;
      align-items: center; /* 可选，用于垂直居中 */
      grid-gap: 0px; /* 设置垂直间距 */
      padding: 10px 0px 5px 20px;
    }
  }
  .card-grid-container3 {
    display: grid;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    grid-auto-rows: auto; /* 根据内容自动分配行高 */
    grid-gap: 20px;
    padding: 20px 20px 20px 20px;
    .text-grid-container1 {
      display: grid;
      align-items: center; /* 可选，用于垂直居中 */
      grid-gap: 0px; /* 设置垂直间距 */
      padding: 10px 0px 5px 20px;
    }
  }
  .text-grid-title {
    font-size: 14px;
    font-family: 'PingFang SC';
  }
  .text-grid-text {
    font-size: 22px;
    // font-weight: bold;
    color: rgba(0, 0, 0, 0.75);
    font-family: 'PingFang SC';
  }
  .text-grid-text1 {
    font-size: 30px;
    color: rgba(0, 0, 0, 0.75);
    font-family: 'PingFang SC';
  }
  .text-grid-text2 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.75);
    font-family: 'PingFang SC';
  }
}

.large-item {
  grid-column: span 1; /* 占据一列 */
}

.small-item {
  grid-column: span 2; /* 占据两列 */
}

.csmall-item {
  grid-column: span 3; /* 占据两列 */
}

::v-deep .ant-tabs-bar {
  margin: 0px 0px 10px 0px;
}

/* 定制卡片标题样式 */
::v-deep .ant-card-head {
  padding: 0px 20px;
  font-size: 19px;
  // font-family: Arial, sans-serif;
  font-family: 'PingFang SC';
  border-bottom: none !important; /* 去除标题与内容之间的分割线 */
}

::v-deep .ant-table-wrapper {
  padding: 0px 0px;
}

.card-grid-item {
  /* 卡片自身的样式 */
  border-radius: 5px;
  box-shadow: none;
  // font-size: 30px;
  // // font-family: Arial, sans-serif;
  // font-family: 'PingFang SC';
}
</style>
