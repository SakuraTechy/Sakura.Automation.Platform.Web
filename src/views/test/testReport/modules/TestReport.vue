<template>
  <div>
    <a-card :bordered="false" class="container">
      <tab-list
        style="margin-top: 0px"
        @changeLeftWidth="changeLeftWidth"
        @setSceneList="setSceneList"
        ref="sceneList"
        :newTitle="newTitle"
        :tab="tab0"
        activeKey="1"
        :projectId="project.id"
      >
        <template :slot="tab0.tab1.name">
          <a-descriptions style="margin-top: -5px" title="产品环境信息" size="small" :column="5" bordered>
            <a-descriptions-item label="产品名称">{{ record.projectConfig.name }}</a-descriptions-item>
            <a-descriptions-item label="产品简称">{{ record.projectConfig.abbreviate }}</a-descriptions-item>
            <a-descriptions-item label="产品版本">{{ record.projectConfig.version.name }}</a-descriptions-item>
            <a-descriptions-item label="版本描述">{{ record.projectConfig.version.description }}</a-descriptions-item>
            <a-descriptions-item label="访问域名">
            <a :href="record.projectConfig.server.domain" target="_blank">{{ findJsonArray1(record.projectConfig.server.configList,"paramsName","前端域名","paramsValue") }}</a>
            </a-descriptions-item>

            <a-descriptions-item label="环境名称">{{ record.projectConfig.server.description }}</a-descriptions-item>
            <a-descriptions-item label="IP">{{ record.projectConfig.server.host }}</a-descriptions-item>
            <a-descriptions-item label="端口">{{ findJsonArray1(record.projectConfig.server.configList,"paramsName","前端端口","paramsValue") }}</a-descriptions-item>
            <a-descriptions-item label="前端账号">{{ findJsonArray1(record.projectConfig.server.configList,"paramsName","前端账号","paramsValue") }}</a-descriptions-item>
            <a-descriptions-item label="前端密码">{{ findJsonArray1(record.projectConfig.server.configList,"paramsName","前端密码","paramsValue") }}</a-descriptions-item>

            <a-descriptions-item label="系统类型">{{ record.projectConfig.server.type }}</a-descriptions-item>
            <a-descriptions-item label="IP">{{ record.projectConfig.server.host }}</a-descriptions-item>
            <a-descriptions-item label="端口">{{ record.projectConfig.server.port }}</a-descriptions-item>
            <a-descriptions-item label="服务器账号">{{ record.projectConfig.server.userName }}</a-descriptions-item>
            <a-descriptions-item label="服务器密码">{{ record.projectConfig.server.passWord }}</a-descriptions-item>
          </a-descriptions>
                      
          <a-descriptions style="margin-top: 10px" title="自动化环境信息" size="small" :column="5" bordered>
            <a-descriptions-item label="自动化名称">{{ record.automationConfig.name }}</a-descriptions-item>
            <a-descriptions-item label="自动化描述">{{ record.automationConfig.description }}</a-descriptions-item>
            <a-descriptions-item label="自动化项目">{{ record.automationConfig.project.name }}</a-descriptions-item>
            <a-descriptions-item label="Jenkins">
              <a :href="record.automationConfig.jenkins.url" target="_blank">{{ record.automationConfig.jenkins.url }}</a>
            </a-descriptions-item>
            <a-descriptions-item label="浏览器">{{ record.automationConfig.browser.name }}</a-descriptions-item>

            <a-descriptions-item label="自动化环境">{{ record.automationConfig.environment.description.systemType }}</a-descriptions-item>
            <a-descriptions-item label="环境名称">{{ record.automationConfig.environment.description.name }}</a-descriptions-item>
            <a-descriptions-item label="IP">{{ record.automationConfig.environment.name }}</a-descriptions-item>
            <a-descriptions-item label="账号">{{ record.automationConfig.environment.description.userName }}</a-descriptions-item>
            <a-descriptions-item label="密码">{{ record.automationConfig.environment.description.passWord }}</a-descriptions-item>
          </a-descriptions>
                      <!-- <a-divider style="padding: ;"/> -->
      <tab-list
        style="margin-top: 10px"
        ref="sceneList"
        :newTitle="newTitle"
        :tab="tab1"
        activeKey="0"
        :projectId="project.id"
        @changeLeftWidth="changeLeftWidth"
        @setSceneList="setSceneList"
        @setActiveKey="setActiveKey"
      >
        <template :slot="tab1.tab0.name">
          <TestReportEcharts ref="echarts" :record="record" :key="tabKey"></TestReportEcharts>
        </template>
        <template :slot="tab1.tab1.name">
          <advance-table style="margin-top: -15px;margin-left: -10px;" :scroll="{ x: 1500, y: 295 }" :columns="columns" :data-source="list" :needTitle="false"
                :loading="loading" rowKey="id" @refresh="getList" size="small" :components="isDragTable" bordered
                tableKey="ui-test-automation-index-table"
                :format-conditions="true"
                :pagination="{
                  current: queryParam.pageNum,
                  pageSize: queryParam.pageSize,
                  pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
                  total: total,
                  showSizeChanger: true,
                  showLessItems: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                  onChange: changeSize,
                  customRow: onClickRow,
                  onShowSizeChange: onSizeChange,
                }">
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <span slot="executeStatus" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,'testPlanId').executeStatus :'未开始' }}
                </span>
                <span slot="casePassRate" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePassRate : '-' }}
                </span>
                <span slot="executeResult" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").executeResult : '-' }}
                </span>
                <span slot="duration" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? formatDuration(getTestRecord(record.testRecordList,"testPlanId").duration) : '-' }}
                </span>
                <span slot="caseTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseTotal : '-' }}
                </span>
                <span slot="casePass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePass : '-' }}
                </span>
                <span slot="caseFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseFail : '-' }}
                </span>
                <span slot="caseSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseSkip : '-' }}
                </span>
                <span slot="stepTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepTotal : '-' }}
                </span>
                <span slot="stepPass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepPass : '-' }}
                </span>
                <span slot="stepFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepFail : '-' }}
                </span>
                <span slot="stepSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepSkip : '-' }}
                </span>
                <span slot="executeName" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,"testPlanId").executeName : '-' }}
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleConsoleUrl(record)" v-hasPermi="['ui:automation:exec']"> 日志 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestReportUrl(record)" v-hasPermi="['ui:automation:exec']"> 报告 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestVideoUrl(record)" v-hasPermi="['ui:automation:exec']"> 回放 </a>
                </span>
              </advance-table>
        </template>
        <template :slot="tab1.tab2.name">
          <advance-table style="margin-top: -15px;margin-left: -10px;" :scroll="{ x: 1500, y: 295 }" :columns="columns" :data-source="list" :needTitle="false"
                :loading="loading" rowKey="id" @refresh="getList" size="small" :components="isDragTable" bordered
                tableKey="ui-test-automation-index-table"
                :format-conditions="true"
                :pagination="{
                  current: queryParam.pageNum,
                  pageSize: queryParam.pageSize,
                  pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
                  total: total,
                  showSizeChanger: true,
                  showLessItems: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                  onChange: changeSize,
                  customRow: onClickRow,
                  onShowSizeChange: onSizeChange,
                }">
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <span slot="executeStatus" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,'testPlanId').executeStatus :'未开始' }}
                </span>
                <span slot="casePassRate" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePassRate : '-' }}
                </span>
                <span slot="executeResult" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").executeResult : '-' }}
                </span>
                <span slot="duration" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? formatDuration(getTestRecord(record.testRecordList,"testPlanId").duration) : '-' }}
                </span>
                <span slot="caseTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseTotal : '-' }}
                </span>
                <span slot="casePass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePass : '-' }}
                </span>
                <span slot="caseFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseFail : '-' }}
                </span>
                <span slot="caseSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseSkip : '-' }}
                </span>
                <span slot="stepTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepTotal : '-' }}
                </span>
                <span slot="stepPass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepPass : '-' }}
                </span>
                <span slot="stepFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepFail : '-' }}
                </span>
                <span slot="stepSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepSkip : '-' }}
                </span>
                <span slot="executeName" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,"testPlanId").executeName : '-' }}
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleConsoleUrl(record)" v-hasPermi="['ui:automation:exec']"> 日志 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestReportUrl(record)" v-hasPermi="['ui:automation:exec']"> 报告 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestVideoUrl(record)" v-hasPermi="['ui:automation:exec']"> 回放 </a>
                </span>
              </advance-table>
        </template>
        <template :slot="tab1.tab3.name">
          <advance-table style="margin-top: -15px;margin-left: -10px;" :scroll="{ x: 1500, y: 295 }" :columns="columns" :data-source="list" :needTitle="false"
                :loading="loading" rowKey="id" @refresh="getList" size="small" :components="isDragTable" bordered
                tableKey="ui-test-automation-index-table"
                :format-conditions="true"
                :pagination="{
                  current: queryParam.pageNum,
                  pageSize: queryParam.pageSize,
                  pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
                  total: total,
                  showSizeChanger: true,
                  showLessItems: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                  onChange: changeSize,
                  customRow: onClickRow,
                  onShowSizeChange: onSizeChange,
                }">
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <span slot="executeStatus" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,'testPlanId').executeStatus :'未开始' }}
                </span>
                <span slot="casePassRate" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePassRate : '-' }}
                </span>
                <span slot="executeResult" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").executeResult : '-' }}
                </span>
                <span slot="duration" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? formatDuration(getTestRecord(record.testRecordList,"testPlanId").duration) : '-' }}
                </span>
                <span slot="caseTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseTotal : '-' }}
                </span>
                <span slot="casePass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePass : '-' }}
                </span>
                <span slot="caseFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseFail : '-' }}
                </span>
                <span slot="caseSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseSkip : '-' }}
                </span>
                <span slot="stepTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepTotal : '-' }}
                </span>
                <span slot="stepPass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepPass : '-' }}
                </span>
                <span slot="stepFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepFail : '-' }}
                </span>
                <span slot="stepSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepSkip : '-' }}
                </span>
                <span slot="executeName" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,"testPlanId").executeName : '-' }}
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleConsoleUrl(record)" v-hasPermi="['ui:automation:exec']"> 日志 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestReportUrl(record)" v-hasPermi="['ui:automation:exec']"> 报告 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestVideoUrl(record)" v-hasPermi="['ui:automation:exec']"> 回放 </a>
                </span>
           </advance-table>
        </template>
        <template :slot="tab1.tab4.name">
          <advance-table style="margin-top: -15px;margin-left: -10px;" :scroll="{ x: 1500, y: 295 }" :columns="columns" :data-source="list" :needTitle="false"
                :loading="loading" rowKey="id" @refresh="getList" size="small" :components="isDragTable" bordered
                tableKey="ui-test-automation-index-table"
                :format-conditions="true"
                :pagination="{
                  current: queryParam.pageNum,
                  pageSize: queryParam.pageSize,
                  pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
                  total: total,
                  showSizeChanger: true,
                  showLessItems: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                  onChange: changeSize,
                  customRow: onClickRow,
                  onShowSizeChange: onSizeChange,
                }">
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <span slot="executeStatus" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,'testPlanId').executeStatus :'未开始' }}
                </span>
                <span slot="casePassRate" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePassRate : '-' }}
                </span>
                <span slot="executeResult" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").executeResult : '-' }}
                </span>
                <span slot="duration" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? formatDuration(formatDuration(getTestRecord(record.testRecordList,"testPlanId").duration)) : '-' }}
                </span>
                <span slot="caseTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseTotal : '-' }}
                </span>
                <span slot="casePass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePass : '-' }}
                </span>
                <span slot="caseFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseFail : '-' }}
                </span>
                <span slot="caseSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").caseSkip : '-' }}
                </span>
                <span slot="stepTotal" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepTotal : '-' }}
                </span>
                <span slot="stepPass" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepPass : '-' }}
                </span>
                <span slot="stepFail" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepFail : '-' }}
                </span>
                <span slot="stepSkip" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,'testPlanId').executeStatus==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").stepSkip : '-' }}
                </span>
                <span slot="executeName" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,"testPlanId").executeName : '-' }}
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleConsoleUrl(record)" v-hasPermi="['ui:automation:exec']"> 日志 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestReportUrl(record)" v-hasPermi="['ui:automation:exec']"> 报告 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestVideoUrl(record)" v-hasPermi="['ui:automation:exec']"> 回放 </a>
                </span>
           </advance-table>
        </template>
        </tab-list>
        </template>
      </tab-list>
    </a-card>
  </div>
</template>

<script>
import * as api from '@/api/api'
import TreeList from '@/views/ui/automation/components/TreeList.vue'
import Split from '@/components/pt/split/Index'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AddOrEditForm from '@/views/ui/automation/modules/AddOrEditForm.vue'
import TabList from './TabList.vue'
import { findChildItem, findChildId } from '@/utils/sakura'
import { levelOptions, statusOptions } from '@/utils/options'
import UiSearch from '@/views/ui/automation/components/UiSearch.vue'
import CopyScence from '@/views/ui/automation/modules/OperationC.vue'
import executScenceForm from '@/views/ui/automation/modules/executScenceForm.vue'
import TestSceneAddForm from '../../testPlan/modules/TestSceneAddForm.vue'
import TestReportEcharts from './TestReportEcharts.vue'
import * as utils from '@/utils/sakura'

import {
  getUiNodeAll,
  getUiNode,
  getSceneList,
  deleteScenceList,
  exportScence,
  exportScenceList,
  exportScenceAll,
  execScence,
  execScenceAll,
  getScenceInfo,
} from '@/api/ui'
import log from '@/utils/log'

export default {
  name: 'Element',
  props: {
    record: {
      type: Object,
    },
    memberOptions: {
      type: Array,
    },
  },
  components: {
    TreeList,
    Split,
    AdvanceTable,
    TabList,
    UiSearch,
    AddOrEditForm,
    CopyScence,
    executScenceForm,
    TestSceneAddForm,
    TestReportEcharts,
  },
  // 给下拉列表树提供树形数据
  provide() {
    return {
      // treeData: this.treeData,
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
          name: '功能测试报告',
          isVisible: true,
        },
        tab1: {
          name: 'UI自动化测试报告',
          isVisible: true,
        },
      },
      tab1: {
        tab0: {
          name: '报表统计',
          isVisible: true,
          total: ''
        },
        tab1: {
          name: '所有场景',
          isVisible: true,
          total: ''
        },
        tab2: {
          name: '通过场景',
          isVisible: true,
          total: ''
        },
        tab3: {
          name: '失败场景',
          isVisible: true,
          total: ''
        },
        tab4: {
          name: '跳过场景',
          isVisible: true,
          total: ''
        },
      },
      leftWidth: '300',
      newTitle: '新建场景',
      levelOptions,
      statusOptions,
      resultOptions: [],
      versionOptions: [],
      testPlanOptions: [], // 所有计划列表
      // testPlanId: '',
      testPlan: {
        id: '',
        name: '',
        projectId: '',
        testSceneState: 'select',
      },
      project: {
        id: '',
        name: '',
        abbreviate: '',
      },
      environment_Id: '',
      loading: false,
      total: 0,
      
      statusColor: ['#f25f62', '#5cbc31', '#888c92'], // 控制用例状态颜色
      estateColor: ['#c71218', '#f25f62', '#e69736'], // 控制用例等级颜色
      selectedRowKeys: [],
      selectedRows: [],
      multiple: true,
      names: [],
      ids: [],
      sceneIds: [],
      sceneList: [],
      activeId: '', // 控制选中的node颜色
      showIcon: true, // 控制node的icon操作是否显示
      showPreviewModal: false,
      version: {},
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        sceneId: '',
        name: '',
        versionId: '',
        versionName: '',
        moduleName: '',
        level: '',
        status: '',
        executeResultType: 'report',
        executeResult: '',
        createByName: '',
        principalName: '',
        estate: '',
      },
      columns: [
        {
          title: '场景ID',
          dataIndex: 'sceneId',
          width: 180,
          fixed: 'left',
          ellipsis: true,
          align: 'center',
          sorter: {
            compare: (a, b) => a.sceneId - b.sceneId,
            multiple: 3,
          },
        },
        {
          title: '场景名称',
          dataIndex: 'name',
          width: 387,
          fixed: 'left',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '场景版本',
          dataIndex: 'versionName',
          width: 120,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '场景等级',
          dataIndex: 'level',
          width: 80,
          align: 'center',
        },
        {
          title: '标签',
          dataIndex: 'tags',
          // scopedSlots: { customRender: 'tags' },
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '执行状态',
          // dataIndex: 'testRecordList[0].executeStatus',
          width: 80,
          scopedSlots: { customRender: 'executeStatus' },
          align: 'center',
        },
        {
          title: '通过率',
          width: 70,
          // dataIndex: 'testRecordList[0].casePassRate',
          scopedSlots: { customRender: 'casePassRate' },
          align: 'center',
        },
        {
          title: '执行结果',
          // dataIndex: 'testRecordList[0].executeResult',
          scopedSlots: { customRender: 'executeResult' },
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '运行耗时',
          // dataIndex: 'testRecordList[0].executeResult',
          scopedSlots: { customRender: 'duration' },
          width: 100,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '用例数',
          width: 60,
          // dataIndex: 'testRecordList[0].caseTotal',
          scopedSlots: { customRender: 'caseTotal' },
          align: 'center',
        },
        {
          title: '通过',
          width: 60,
          // dataIndex: 'testRecordList[0].casePass',
          scopedSlots: { customRender: 'casePass' },
          align: 'center',
        },
        {
          title: '失败',
          width: 60,
          // dataIndex: 'testRecordList[0].caseFail',
          scopedSlots: { customRender: 'caseFail' },
          align: 'center',
        },
        {
          title: '跳过',
          width: 60,
          // dataIndex: 'testRecordList[0].caseSkip',
          scopedSlots: { customRender: 'caseSkip' },
          align: 'center',
        },
        {
          title: '步骤数',
          width: 60,
          // dataIndex: 'testRecordList[0].stepTotal',
          scopedSlots: { customRender: 'stepTotal' },
          align: 'center',
        },
        {
          title: '通过',
          width: 60,
          // dataIndex: 'testRecordList[0].stepPass',
          scopedSlots: { customRender: 'stepPass' },
          align: 'center',
        },
        {
          title: '失败',
          width: 60,
          // dataIndex: 'testRecordList[0].stepFail',
          scopedSlots: { customRender: 'stepFail' },
          align: 'center',
        },
        {
          title: '跳过',
          width: 60,
          // dataIndex: 'testRecordList[0].stepSkip',
          scopedSlots: { customRender: 'stepSkip' },
          align: 'center',
        },
        {
          title: '创建人',
          dataIndex: 'createByName',
          width: 70,
          align: 'center',
        },
        {
          title: '责任人',
          width: 70,
          scopedSlots: { customRender: 'principalName' },
          dataIndex: 'principalName',
          align: 'center',
        },
        {
          title: '执行人',
          // dataIndex: 'testRecordList[0].executeName',
          scopedSlots: { customRender: 'executeName' },
          width: 70,
          align: 'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'createTime' },
        },
        {
          title: '最后更新时间',
          dataIndex: 'updateTime',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      list: [],
      list1: [],
      newTree: {},
      treeData: [],
    }
  },
  created() {
    this.getList()
    // console.log(this.record);
    typeof this.record.projectConfig === 'string'?this.record.projectConfig = JSON.parse(this.record.projectConfig):[]
    typeof this.record.automationConfig === 'string'?this.record.automationConfig = JSON.parse(this.record.automationConfig):[]
    // this.record.statisticAnalysis = JSON.parse(this.record.statisticAnalysisStr)
    // this.tab1.tab1.name = `${this.tab1.tab1.name} ${this.record.statisticAnalysis.ui.sceneTotal}`
    // this.tab1.tab2.name = `${this.tab1.tab2.name} ${this.record.statisticAnalysis.ui.scenePass}`
    // this.tab1.tab3.name = `${this.tab1.tab3.name} ${this.record.statisticAnalysis.ui.sceneFail}`
    // this.tab1.tab4.name = `${this.tab1.tab4.name} ${this.record.statisticAnalysis.ui.sceneSkip}`
    // this.$http.get(`/dict/sys_normal_result`).then((response) => {
    //   this.resultOptions = response.result.list
    // })
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
  mounted() {
  },
  methods: {
    findJsonArray1(jsonArray, targetKey, targetParamsName, targetParamsValue) {
      return utils.findJsonArray(jsonArray, targetKey,targetParamsName, targetParamsValue)
    },
    findJsonArray(jsonArray, targetKey, targetParamsName, targetParamsValue) {
      targetParamsName = this.record.testPlanId
      // console.log(utils.findJsonArray(jsonArray, 'testPlanId','4e5fa9519ea34f88bc88ce78180db37b', 'executeStatus'));
      return utils.findJsonArray(jsonArray, targetKey,targetParamsName, targetParamsValue)
    },
    getTestRecord(jsonArray, testPlanId) {
      jsonArray.sort((a, b) => b.buildNumber - a.buildNumber);
      const result = jsonArray.filter(testRecord => testRecord.testPlanId === this.record.testPlanId)[0]
      // console.log(result);
      return result?result:[]
    },
    getList() {
      const params = {
        ...this.queryParam,
        projectId: this.record.projectId,
        versionId: this.record.versionId,
        testPlanId: this.record.testPlanId,
        testSceneState: this.testPlan.testSceneState,
        buildNumber: this.record.statisticAnalysis.ui.buildNumber
      }
      this.loading = true
      getSceneList(params).then((response) => {
        this.list = response.data.list
        // this.list = this.list.reduce((testSceneList, testScene) => {
        //   testScene.testRecordList = testScene.testRecord?JSON.parse(testScene.testRecord):[]
        //   if(this.queryParam.executeResult===''){
        //     testSceneList.push(testScene)
        //   }else{
        //     testScene.testRecordList.forEach(testRecord =>{
        //       if (testRecord.testPlanId === this.record.testPlanId &&
        //         testRecord.buildNumber == this.record.statisticAnalysis.ui.buildNumber &&
        //         testRecord.executeResult === this.queryParam.executeResult
        //       ) {
        //         testSceneList.push(testScene)
        //       }
        //     })
        //   }
        //   return testSceneList
        // }, [])
        this.list.forEach((item, index) => {
          item.testRecordList = item.testRecord?JSON.parse(item.testRecord) : []
        })
        this.total =  response.data.total
        if (this.queryParam.executeResult==='全部通过') {
          this.tab1.tab2.name = `通过场景 ${this.total}`
        } else if (this.queryParam.executeResult==='不通过') {
          this.tab1.tab3.name = `失败场景 ${this.total}`
        }else if (this.queryParam.executeResult==='跳过') {
          this.tab1.tab4.name = `跳过场景 ${this.total}`
        }else{
          this.tab1.tab1.name = `所有场景 ${this.total}`
        }
        this.loading = false
        this.close()
      })
    },
    // 获取列表
    getList1() {
      const { projectId, activeId, queryParam, treeData } = this
      let arr = [activeId]
      let childItem = findChildItem(treeData, activeId)
      // let moduleIds = activeId === treeData[0].id ? [] : findChildId(childItem, arr)
      let moduleIds = this.queryParam.versionId != '' ? findChildId(childItem, arr) : []
      // let moduleIds = this.queryParam.versionId != "" && this.queryParam.moduleName!=='全部场景' ? arr:[]
      const params = {
        ...queryParam,
        projectId,
        moduleIds,
        testPlanId: this.testPlan.id,
        testSceneState: this.testPlan.testSceneState,
      }
      this.loading = true
      getSceneList(params).then((response) => {
        this.list = response.data.list
        this.sceneList = this.list
        this.total = response.data.total
        this.close()
      }).finally(
        this.loading = false
      )
    },
    // 获取所有的测试计划
    getAllTestPlanList() {
      const queryParam = {
        // pageNum: 1,
        // pageSize: 10
      }
      api.getTestPlanList(queryParam).then((response) => {
        this.testPlanOptions = response.data.list
        for (var testPlan of this.testPlanOptions) {
          // console.log(this.record)
          if (testPlan.id === this.record.id) {
            this.testPlan.id = testPlan.id
            this.testPlan.projectId = testPlan.projectId
            break
          }
        }
        this.getAllVersions()
      })
    },
    // 计划选择发生变化
    handleChange(newValue) {
      // console.log(newValue)
      for (var testPlan of this.testPlanOptions) {
        if (testPlan.id === newValue) {
          this.testPlan.id = testPlan.id
          this.testPlan.projectId = testPlan.projectId
          break
        }
      }
      // this.testPlan.projectId = this.testPlanOptions[index].id
      // this.project.name = this.testPlanOptions[index].name
      // this.project.abbreviate = this.testPlanOptions[index].abbreviate
      // localStorage.setItem('projectId', this.testPlanOptions[index].id);
      // localStorage.setItem('name', this.testPlanOptions[index].name);
      // localStorage.setItem('abbreviate', this.testPlanOptions[index].abbreviate);
      this.$refs.treeList.clearSelectedkeys()
      this.$refs.uiSearch.resetQuery()
      this.getAllVersions()
    },
    // 获取当前计划环境下的所有版本
    async getAllVersions() {
      const queryParam = {
        projectId: this.testPlan.projectId,
      }
      await api.getEnvironmentList(queryParam).then((response) => {
        response.data.list.forEach((item, index) => {
          if (item.status === 1) {
            this.environment_Id = item.id
            var versionList = JSON.parse(item.versionConfig)
            this.versionOptions = []
            versionList.forEach((item, index) => {
              if (item.delFlag === 0) {
                this.versionOptions.push(item)
                if (item.status === 1) {
                  this.version = item
                  this.queryParam.versionId = item.id
                  // this.$refs.uiSearch.searchParam.versionId = item.id
                  // this.$refs.uiSearch.searchParam.versionName = item.name
                }
              }
            })
          }
        })
      })
      // await this.getTreeData()
    },
    getTags(tags) {
      if (!tags) {
        return tags
      } else {
        return JSON.parse(tags).join(',')
      }
    },
    getAllPageList() {
      // this.getTreeData()
      this.getList()
      this.getTreeData()
      this.getAllVersions()
    },
    // 获取树形结构
    getTreeData() {
      // const { projectId } = this
      if (this.queryParam.versionId !== '') {
        getUiNode(this.testPlan.projectId, this.queryParam.versionId).then((response) => {
          this.treeData = response?.data || {}
          const setting = {
            iconDisabled: true,
          }
          this.treeData = [{ ...this.treeData, ...setting }]
          this.$nextTick(() => {
            this.$refs.treeList.getTreeData(
              this.treeData,
              this.testPlan.projectId,
              this.queryParam.versionId,
              this.queryParam.versionName
            )
          })
        })
      }
    },
    getTreeDataAll() {
      // const { projectId } = this
      getUiNodeAll(this.testPlan.projectId).then((response) => {
        this.treeData = response?.data || {}
        const setting = {
          iconDisabled: true,
        }
        this.treeData = [{ ...this.treeData, ...setting }]
        this.$nextTick(() => {
          this.$refs.treeList.getTreeData(this.treeData, this.testPlan.projectId, this.queryParam.versionId)
        })
      })
    },
    resultTypeFormat(row) {
      return this.selectDictLabel(this.resultOptions, row.result)
    },
    // 是否显示左侧侧边菜单
    changeLeftWidth(width, key) {
      this.leftWidth = width
      if (key === '0') {
        this.getTreeData(this.activeId)
        this.getList()
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const treeElement = this.$refs.treeList.$el
        console.log(treeElement)
        treeElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
      })
    },
    scrollToNode(node) {
      console.log(node)
      this.$nextTick(() => {
        const targetElement = document.getElementById(node)
        if (targetElement) {
          console.log(targetElement)
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      })
    },
    // 点击树节点
    onClick(params) {
      // console.log('onClick', params)
      this.activeId = params
      // this.getTreeData()
      this.treeData.forEach((node) => {
        this.getAllChildren(node)
      })
      this.getList()
      this.$refs.treeList.moduleId = params
      // this.scrollToBottom()
      // this.scrollToNode(this.selectedKeys[0])
    },
    getAllChildren(node) {
      if (node.id === this.activeId) {
        this.queryParam.moduleName = node.name
      } else if (node.children) {
        node.children.forEach((child) => {
          this.getAllChildren(child)
        })
      }
    },
    // 监听查询参数改变
    changeParam(searchParam) {
      // console.log(searchParam);
      this.queryParam = Object.assign(this.queryParam, searchParam)
      this.handleQuery()
    },
    handleQuery() {
      if (this.queryParam.versionId !== '') {
        this.$refs.treeList.clearSelectedkeys()
        this.getTreeData()
      } else {
        // this.getTreeDataAll()
        this.getList()
      }
    },
    resetQuery() {
      this.selectedRowKeys = []
      this.ids = []
      this.sceneIds = []
      this.multiple = !this.selectedRowKeys.length
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        sceneId: '',
        name: '',
        versionId: '',
        versionName: '',
        level: '',
        status: '',
        executeResultType: 'report',
        executeResult: '',
        createByName: '',
        principalName: '',
        estate: '',
      }
    },
    //切换tab标签后设置场景信息
    setSceneList(record) {
      // console.log(record)
      this.sceneList = []
      this.sceneList.push(record)
    },
    setActiveKey(key) {
      // console.log(key)
      this.tabKey = key
      if(key==='1'){
        this.queryParam.executeResult = '全部通过, 不通过, 跳过, -'
      }else if(key==='2'){
        this.queryParam.executeResult = '全部通过'
      }else if(key==='3'){
        this.queryParam.executeResult = '不通过'
      }else if(key==='4'){
        this.queryParam.executeResult = '跳过'
      }
      this.getList()
    },
    // 保存后更新场景
    handleUpdateCase(record) {
      // console.log(record)
      const updateTitle = record.name
      this.$nextTick(() => {
        this.sceneList = []
        this.sceneList.push(record)
        this.$refs.sceneList.handleUpdateCase(record, updateTitle)
      })
    },
    handleAdd() {
      this.$nextTick(() => {
        this.$refs.TestSceneAddForm.handleAdd()
      })
    },
    // 编辑场景
    handleUpdate(record) {
      const editTitle = record.name
      const id = record.id
      this.$nextTick(() => {
        this.sceneList = []
        this.sceneList.push(record)
        // this.version.id = record.versionId
        this.$refs.sceneList.addTab(record, editTitle, id)
      })
    },
    // 删除场景
    handleDelete1(row) {
      var that = this
      const ids = row.id || this.ids
      const names = row.name || this.names
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的数据',
        onOk() {
          return deleteScenceList(ids).then(() => {
            that.$message.success('删除成功')
            that.getTreeData()
            that.getList()
            that.onSelectChange([], [])
          })
        },
        onCancel() {},
      })
    },
    // 取消关联场景
    handleDelete(record) {
      if (record) {
        this.sceneList = []
        this.sceneList.push(record)
      }
      let params = {
        testPlanId: this.testPlan.id,
        sysSceneList: this.sceneList,
        // projectConfig: this.project,
        // automationConfig: this.automation
      }
      api.removeTestScene(params).then((response) => {
        this.$message.success('取消关联成功')
        this.open = false
        this.getList()
      })
    },
    // 复制场景
    handleCopy(record) {
      if (this.queryParam.versionId !== '') {
        this.$nextTick(() => {
          this.$refs.copyScenceForm.handleAdd(record)
        })
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    async handleCopyAll(record) {
      if (this.queryParam.versionId !== '') {
        // this.queryParam.pageSize = 1000
        this.handleQuery()
        setTimeout(() => {
          // console.log(this.sceneList);
          this.$nextTick(() => {
            this.$refs.copyScenceForm.handleAdd(record)
          })
        }, 2000)
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    /** 单个导出场景操作 */
    handleExport(record) {
      var that = this
      // console.log(record, 'edit')
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return exportScence(ids)
            .then((res) => {
              if (res.status != 404) {
                that.readBlobDown(res, sceneIds, 'application/xml')
                // saveAs(res, '导出文件名称.xml')
                that.$message.success('导出成功', 3)
              }
            })
            .catch((error) => {
              that.$message.error('导出失败', 3)
              reject(error)
            })
        },
        onCancel() {},
      })
    },
    /** 批量导出场景操作
     * zip文件提示损坏：https://blog.csdn.net/jhhjkn/article/details/125318805
     */
    handleExports(row) {
      var that = this
      const ids = row.id || this.ids
      const names = row.name || this.names
      const sceneIds = row.sceneId || this.sceneIds
      const project = this.project
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return new Promise((resolve, reject) => {
            exportScenceList(ids)
              .then((res) => {
                if (res.status != 404) {
                  that.readBlobDown(res, project.abbreviate, 'application/zip')
                  that.$message.success('导出成功', 3)
                }
                resolve(res)
              })
              .catch((error) => {
                that.$message.error('导出失败', 3)
                reject(error)
              })
          })
        },
        onCancel() {},
      })
    },
    handleExportss(record) {
      var that = this
      // console.log(record, 'edit')
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return exportScenceList(ids)
            .then((res) => {
              console.info(ids.length)
              console.info(ids.item)
              console.info(ids.total)
              if (res.status != 404) {
                if (sceneIds.length == 1) {
                  that.readBlobDown(res, sceneIds, 'application/xml')
                } else {
                  that.readBlobDown(res, 'TestCaseXml', 'application/zip')
                }
                // saveAs(res, '导出文件名称.xml')
                that.$message.success('导出成功', 3)
              }
            })
            .catch((error) => {
              that.$message.error('导出失败', 3)
              reject(error)
            })
        },
        onCancel() {},
      })
    },
    /** 批量导出计划下所有场景操作
     * zip文件提示损坏：https://blog.csdn.net/jhhjkn/article/details/125318805
     */
    handleExportAll() {
      var that = this
      const { projectId } = this
      const project = this.project
      const params = {
        ...that.queryParam,
        projectId,
      }
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前为选择计划下所有的数据',
        onOk() {
          return exportScenceAll(params)
            .then((res) => {
              if (res.status != 404) {
                that.readBlobDown(res, project.abbreviate, 'application/zip')
                that.$message.success('导出成功', 3)
              }
            })
            .catch((error) => {
              that.$message.error('导出失败', 3)
              reject(error)
            })
        },
        onCancel() {},
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
    // 执行场景（单个，多个）
    handleExecut(record) {
      if (record.sceneId) {
        this.sceneList = []
        this.sceneList.push(record)
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(record, '远程调试')
        })
      } else if (this.queryParam.versionId !== '') {
        this.$refs.executScenceForm.handleAdd(record, '远程调试')
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    async handleExecutAll(record) {
      if (this.queryParam.versionId !== '') {
        // this.queryParam.pageSize = 1000
        await this.handleQuery()
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(record, '远程调试')
        })
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    close() {
      this.selectedRowKeys = []
      this.multiple = !this.selectedRowKeys.length
    },
    // 执行场景（单个，多个）
    handleExecut1(record) {
      var that = this
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认执行?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return execScence(ids)
            .then((res) => {
              if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
                that.$message.success('执行成功，跳转至Jenkins控制台！', 3)
                setTimeout(() => {
                  window.open(res.data.consoleUrl)
                }, 1000)
              } else {
                this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
              }
            })
            .catch((error) => {
              that.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
            })
        },
        onCancel() {},
      })
    },
    // 执行场景（计划对应版本下所有）
    handleExecutAll1() {
      var that = this
      // var projectId = this.testPlan.projectId
      // var versionId = this.queryParam.versionId
      // const params = {
      //   projectId,
      //   versionId,
      // }
      const { projectId, queryParam } = that
      // that.$delete(this.queryParam,'pageNum')		//删除属性方法
      // that.$delete(this.queryParam,'pageSize')
      const params = {
        ...queryParam,
        projectId,
      }
      this.$Modal.confirm({
        title: '是否确认执行?',
        content: '当前为选择计划版本下所有的场景',
        onOk() {
          return execScenceAll(params)
            .then((res) => {
              if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
                that.$message.success('执行成功，跳转至Jenkins控制台!', 3)
                setTimeout(() => {
                  window.open(res.data.consoleUrl)
                }, 1000)
              } else {
                this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
              }
            })
            .catch((error) => {
              that.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
            })
        },
        onCancel() {},
      })
    },
    runAsync1(ids) {
      var p = new Promise((resolve, reject) => {
        setTimeout(() => {
          execScence(ids)
            .then((res) => {
              if (res.status != 404) {
                resolve(res.data.ConsoleURL)
              }
            })
            .catch((error) => {
              reject(error)
            })
        }, 1000)
      })
      return p
    },
    runAsync2(data) {
      var p = new Promise((resolve, reject) => {
        setTimeout(() => {
          window.open(data)
          resolve('随便什么数据2')
        }, 2000)
      })
      return p
    },
    handleExecut2(record) {
      var that = this
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认执行?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          that
            .runAsync1(ids)
            .then((data) => {
              that.$message.success('执行成功，跳转至Jenkins控制台！', 3)
              return that.runAsync2(data)
            })
            .then((data) => {
              // console.log(data);
              return '直接返回数据'
            })
        },
        onCancel() {},
      })
    },
    // 查看控制台运行日志
    handleConsoleUrl(record) {
      const consoleUrl = this.getTestRecord(record.testRecordList, 'testPlanId').consoleUrl
      if (consoleUrl) {
        this.$message.success('获取运行日志成功！', 3)
        setTimeout(() => {
          window.open(consoleUrl)
        }, 500)
      } else {
        this.$message.error('获取运行日志失败，请先执行场景！', 3)
      }
    },
    // 查看Jenkins测试报告
    handleTestReportUrl(record) {
      const testReportUrl = this.getTestRecord(record.testRecordList, 'testPlanId').testReportUrl
      if (testReportUrl) {
        this.$message.success('获取测试报告成功！', 3)
        setTimeout(() => {
          window.open(testReportUrl)
        }, 500)
      } else {
        this.$message.error('获取测试报告失败，请先执行场景！', 3)
      }
    },
    // 查看Jenkins测试回放视频
    handleTestVideoUrl(record) {
      const testReportUrl = this.getTestRecord(record.testRecordList, 'testPlanId').testReportUrl
      if (testReportUrl) {
        this.$message.success('获取测试视频成功！', 3)
        setTimeout(() => {
          window.open(testReportUrl.replace('/index.html', '/video/'+record.sceneId+'.mp4'))
        }, 500)
      } else {
        this.$message.error('获取测试视频失败，请先执行场景！', 3)
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
      this.sceneIds = this.selectedRows.map((item) => item.sceneId)
      this.sceneList = this.selectedRows.map((item) => item)
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
  // min-height: calc(100vh - 380px);
}

.container {
  height: calc(100vh - 176px);
  width: 100%;
  position: relative;
}

.fixed-top {
  position: sticky;
  width: 100%;
  top: 0;
}

.scrollable {
  overflow-y: scroll;
  margin-top: 5px;
  // height: 100%;
  // margin-bottom: 5px;
  max-height: calc(100vh - 280px);
}

.case-status {
  padding: 2px 5px;
  color: #fff;
  border-radius: 5%;
}
.table-operations {
  padding: 5px 0px 5px 0px;
  display: flex;
  justify-content: space-between;
}

</style>
