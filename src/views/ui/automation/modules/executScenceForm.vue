<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    modalWidth="1650"
    modalHeight="887"
    @cancel="cancel"
  >
    <div slot="content">
      <a-tabs style="margin-top: -15px" type="card" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="产品环境">
          <div style="margin-bottom: 15px">
            <a style="font-weight: bold; font-size: 16px">产品环境信息</a>
            <div style="float: right; display: flex; gap: 10px">
              <a-select
                v-model="environmentId"
                placeholder="请选择产品环境"
                style="width: 200px"
                option-filter-prop="children"
                @change="changeEnvironment"
                allowClear
              >
                <a-select-option v-for="(d, index) in EnvironmentOptions" :key="index" :value="d.id">
                  {{ d.name }}
                </a-select-option>
              </a-select>
              <a-button type="primary" @click="handleEnvironmentConfig"> 去配置 </a-button>
            </div>
            <!-- <a-descriptions style="margin-top: 15px;" bordered :size="size" :column="column">
              <a-descriptions-item label="产品名称" :labelStyle="labelStyle" :contentStyle="contentStyle">{{ this.project.name }}</a-descriptions-item>
              <a-descriptions-item label="产品简称">{{ this.project.abbreviate }}</a-descriptions-item>
              <a-descriptions-item label="产品版本">{{ this.project.version.name }}</a-descriptions-item>
              <a-descriptions-item label="版本描述">{{ this.project.version.description }}</a-descriptions-item>
              <a-descriptions-item label="产品域名">{{ this.project.domain.url }}</a-descriptions-item>

              <a-descriptions-item label="产品环境">{{ this.project.server.description }}</a-descriptions-item>
              <a-descriptions-item label="IP">{{ this.project.server.host }}</a-descriptions-item>
              <a-descriptions-item label="端口">{{ this.project.server.port }}</a-descriptions-item>
              <a-descriptions-item label="用户名">{{ this.project.server.userName }}</a-descriptions-item>
              <a-descriptions-item label="密码">{{ this.project.server.passWord }}</a-descriptions-item>
            </a-descriptions> -->
            <el-descriptions style="margin-top: 15px" :size="'medium'" :column="5" border>
              <el-descriptions-item label="产品名称" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.project.name
              }}</el-descriptions-item>
              <el-descriptions-item label="产品简称" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.project.abbreviate
              }}</el-descriptions-item>
              <el-descriptions-item label="产品版本" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.project.version.name
              }}</el-descriptions-item>
              <el-descriptions-item label="版本描述" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.project.version.description
              }}</el-descriptions-item>
              <el-descriptions-item label="前端域名" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.project.server.domain
              }}</el-descriptions-item>

              <el-descriptions-item label="产品环境" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.project.server.type
              }}</el-descriptions-item>
              <el-descriptions-item label="IP" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.project.server.host
              }}</el-descriptions-item>
              <el-descriptions-item label="端口" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.project.server.port
              }}</el-descriptions-item>
              <el-descriptions-item label="用户名" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.project.server.userName
              }}</el-descriptions-item>
              <el-descriptions-item label="密码" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.project.server.passWord
              }}</el-descriptions-item>
            </el-descriptions>
            <advance-table
              style="margin-top: -0px; margin-left: -12px; width: 101.6%"
              :scroll="{ x: '100%', y: 218 }"
              :columns="versionColumns"
              :data-source="versionList"
              :loading="loading"
              rowKey="id"
              @refresh="getEnvironmentList"
              bordered
              size="middle"
              title="版本配置信息"
            >
              <span slot="status" slot-scope="{ record }">
                <a-switch
                  :checked="Boolean(record.status)"
                  @change="(value) => onchangeVersion(value, record)"
                  :disabled="false"
                />
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
                <a @click="handleViewVersion(record)" v-hasPermi="['project:environmentConfig:versionConfig:query']">
                  详情
                </a>
              </span>
            </advance-table>
            <!-- <advance-table style="margin-top: -10px;margin-left: -12px;width: 101.6%;" :scroll="{ x: '100%', y: 218 }"
              :columns="domainColumns" :data-source="domainList" :loading="loading" rowKey="id"
              @refresh="getEnvironmentList" bordered size="middle" title="域名配置信息">
              <span slot="status" slot-scope="{ record }">
                <a-switch :checked="Boolean(record.status)" @change="(value) => onchangeDomain(value, record)"
                  :disabled="false" />
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
            </advance-table> -->
            <advance-table
              style="margin-top: -10px; margin-left: -12px; width: 101.6%"
              :scroll="{ x: '100%', y: 245 }"
              :columns="serverColumns"
              :data-source="serverList"
              :loading="loading"
              rowKey="id"
              @refresh="getEnvironmentList"
              bordered
              size="middle"
              title="服务器配置信息"
            >
              <span slot="type" slot-scope="{ record }">
                <a>{{ record.type }}</a>
              </span>
              <span slot="description" slot-scope="{ record }">
                <a-select
                  v-model="project.version.name"
                  placeholder="请选择版本"
                  style="width: 100%"
                  option-filter-prop="children"
                >
                  <a-select-option
                    v-for="(item, index) in versionList"
                    :key="index"
                    :value="item.name"
                    @click="onChangeVersion(item)"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </span>
              <span slot="status" slot-scope="{ record }">
                <a-switch
                  :checked="Boolean(record.status)"
                  @change="(value) => onchangeServer(value, record)"
                  :disabled="false"
                />
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
                <a @click="handleViewServer(record)" v-hasPermi="['project:environmentConfig:serverConfig:query']">
                  详情
                </a>
                <a-divider type="vertical" />
                <a @click="handleRemote(record)" v-hasPermi="['project:environmentConfig:serverConfig:query']">
                  远程
                </a>
              </span>
            </advance-table>
            <advance-table
              style="margin-top: -10px; margin-left: -12px; width: 101.6%"
              :scroll="{ x: '100%', y: 218 }"
              :columns="dataBaseColumns"
              :data-source="dataBaseList"
              :loading="loading"
              rowKey="id"
              @refresh="getEnvironmentList"
              bordered
              size="middle"
              title="数据库配置信息"
            >
              <span slot="type" slot-scope="{ record }">
                <a
                  v-for="(item, value) in dataBaseType"
                  v-if="item.type === record.type"
                  :key="value"
                  :value="item.type"
                >
                  {{ item.label }}
                </a>
              </span>
              <span slot="status" slot-scope="{ record }">
                <a-switch
                  :checked="Boolean(record.status)"
                  @change="(value) => onchange(value, record)"
                  :disabled="true"
                />
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
                <a @click="handleViewDataBase(record)" v-hasPermi="['project:environmentConfig:dataBaseConfig:query']">
                  详情
                </a>
                <a-divider type="vertical" />
                <a @click="handleRemote(record)" v-hasPermi="['project:environmentConfig:dataBaseConfig:query']">
                  远程
                </a>
              </span>
            </advance-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="自动化环境" force-render>
          <div style="margin-bottom: 15px">
            <a style="font-weight: bold; font-size: 16px">自动化环境信息</a>
            <div style="float: right; display: flex; gap: 10px">
              <a-select
                v-model="automation.id"
                placeholder="请选择自动化配置"
                style="width: 200px"
                option-filter-prop="children"
                @change="changeAutomation"
                allowClear
              >
                <a-select-option v-for="(d, index) in AutomationOptions" :key="index" :value="d.id">
                  {{ d.name }}
                </a-select-option>
              </a-select>
              <a-button type="primary" @click="handleAutomationConfig"> 去配置 </a-button>
            </div>
            <!-- <a-descriptions style="margin-top: 15px;" bordered :size="size" :column="column">
              <a-descriptions-item label="自动化名称">{{ this.automation.name }}</a-descriptions-item>
              <a-descriptions-item label="自动化描述">{{ this.automation.description }}</a-descriptions-item>
              <a-descriptions-item label="自动化产品">{{ this.automation.project.name }}</a-descriptions-item>
              <a-descriptions-item label="Jenkins">{{ this.automation.jenkins.url }}</a-descriptions-item>
              <a-descriptions-item label="浏览器">{{ this.automation.browser.name }}</a-descriptions-item>

              <a-descriptions-item label="自动化环境">{{ this.automation.environment.description.systemType }}</a-descriptions-item>
              <a-descriptions-item label="环境名称">{{ this.automation.environment.description.name }}</a-descriptions-item>
              <a-descriptions-item label="IP">{{ this.automation.environment.name }}</a-descriptions-item>
              <a-descriptions-item label="用户名">{{ this.automation.environment.description.userName }}</a-descriptions-item>
              <a-descriptions-item label="密码">{{ this.automation.environment.description.passWord }}</a-descriptions-item>
            </a-descriptions> -->
            <el-descriptions style="margin-top: 15px" border :size="'medium'" :column="column">
              <el-descriptions-item label="自动化名称" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.automation.name
              }}</el-descriptions-item>
              <el-descriptions-item label="自动化描述" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.automation.description
              }}</el-descriptions-item>
              <el-descriptions-item label="自动化项目" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.automation.project.name
              }}</el-descriptions-item>
              <el-descriptions-item label="Jenkins" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.automation.jenkins.url
              }}</el-descriptions-item>
              <el-descriptions-item label="浏览器" :labelStyle="labelStyle" :contentStyle="contentStyle">{{
                this.automation.browser.name
              }}</el-descriptions-item>

              <el-descriptions-item label="自动化环境" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.automation.environment.description.systemType
              }}</el-descriptions-item>
              <el-descriptions-item label="环境名称" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.automation.environment.description.name
              }}</el-descriptions-item>
              <el-descriptions-item label="IP" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.automation.environment.name
              }}</el-descriptions-item>
              <!-- <el-descriptions-item label="端口" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{ this.automation.environment.description.systemType }}</el-descriptions-item> -->
              <el-descriptions-item label="用户名" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.automation.environment.description.userName
              }}</el-descriptions-item>
              <el-descriptions-item label="密码" :labelStyle="labelStyle" :contentStyle="contentStyle1">{{
                this.automation.environment.description.passWord
              }}</el-descriptions-item>
            </el-descriptions>
            <advance-table
              style="margin-top: -0px; margin-left: -12px; width: 101.6%"
              :scroll="{ x: '100%', y: 218 }"
              :columns="projectColumns"
              :data-source="projectList"
              :loading="loading"
              rowKey="id"
              @refresh="getAutomationList"
              bordered
              size="middle"
              title="项目配置信息"
            >
              <span slot="url" slot-scope="{ record }">
                <a :href="record.url" target="_blank">{{ record.url }}</a>
              </span>
              <span slot="status" slot-scope="{ record }">
                <a-switch
                  :checked="Boolean(record.status)"
                  @change="(value) => onchangeProject(value, record)"
                  :disabled="true"
                />
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <!-- <span slot="operation" slot-scope="{ record }">
                <a @click="handleViewProject(record)" v-hasPermi="['project:automationConfig:projectConfig:query']"> 查看 </a>
              </span> -->
            </advance-table>
            <advance-table
              style="margin-top: -10px; margin-left: -12px; width: 101.6%"
              :scroll="{ x: '100%', y: 218 }"
              :columns="jenkinsColumns"
              :data-source="jenkinsList"
              :loading="loading"
              rowKey="id"
              @refresh="getAutomationList"
              bordered
              size="middle"
              title="Jenkins配置信息"
            >
              <span slot="status" slot-scope="{ record }">
                <a-switch
                  :checked="Boolean(record.status)"
                  @change="(value) => onchangeJenkins(value, record)"
                  :disabled="false"
                />
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
                <a @click="handleViewJenkins(record)" v-hasPermi="['project:automationConfig:jenkinsConfig:query']">
                  详情
                </a>
                <a-divider type="vertical" />
                <a @click="handlePreviewJenkins(record)" v-hasPermi="['project:automationConfig:jenkinsConfig:query']">
                  查看
                </a>
              </span>
            </advance-table>
            <div style="position: relative; margin-top: -5px">
              <div
                style="float: right; display: flex; gap: 10px; position: absolute; top: 8px; right: 7px; z-index: 999"
              >
                <a-input
                  v-model="queryParam.name"
                  style="width: 200px"
                  placeholder="请输入环境名称"
                  @change="handleQuery"
                  allow-clear
                />
                <a-select
                  v-model="queryParam.active.idle.status"
                  placeholder="请选择"
                  style="width: 130px"
                  option-filter-prop="children"
                  @change="handleQuery"
                  allowClear
                >
                  <a-select-option v-for="(d, index) in useStatusOptions" :key="index" :value="d.idle">
                    {{ d.label }}
                  </a-select-option>
                </a-select>
                <a-button type="primary" @click="handleSyncAll"> 一键同步 </a-button>
              </div>
              <advance-table
                style="margin-left: -12px; width: 101.6%"
                :scroll="{ x: '100%', y: 222 }"
                :columns="environmentColumns"
                :data-source="environmentList"
                :loading="loading"
                rowKey="id"
                @refresh="getAutomationList"
                bordered
                size="middle"
                title="环境配置信息"
              >
                <span slot="description" slot-scope="{ record }">
                  <a :href="record.url" target="_blank">{{ record.description.name }}</a>
                </span>
                <span slot="offline" slot-scope="{ record }">
                  <a-popover v-if="record.active.offline.status === 0" title="消息提示">
                    <template #content>
                      <span>{{ record.active.offline.offlineCauseReason }}</span>
                    </template>
                    <a-button type="Default" style="height: 25px">离线</a-button>
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
                    <a-button type="primary" style="height: 25px">在线</a-button>
                  </a-popover>
                </span>
                <span slot="idle" slot-scope="{ record }">
                  <a-button
                    v-if="record.active.offline.status === 1 && record.active.idle.status === 1"
                    type="primary"
                    style="height: 25px; background-color: #05d966; border-color: #05d966"
                    >空闲</a-button
                  >
                  <a-popover v-else-if="record.active.offline.status === 1 && record.active.idle.status === 0">
                    <template #content>
                      <a-descriptions title="使用信息" bordered>
                        <a-descriptions-item
                          label="用户"
                          v-for="(executor, index) in record.active.idle.executors"
                          :key="index"
                          >{{ executor.user }}</a-descriptions-item
                        >
                        <a-descriptions-item
                          label="地址"
                          v-for="(executor, index) in record.active.idle.executors"
                          :key="index"
                          >{{ executor.url }}</a-descriptions-item
                        >
                      </a-descriptions>
                    </template>
                    <a-button type="danger" style="height: 25px">使用中</a-button>
                  </a-popover>
                  <a-button v-else type="Default" style="height: 25px">离线</a-button>
                </span>
                <span slot="status" slot-scope="{ record }">
                  <a-switch
                    :checked="Boolean(record.status)"
                    @change="(value) => onchangeEnvironment(value, record)"
                    :disabled="false"
                  />
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleSync(record)" v-hasPermi="['project:automationConfig:environmentConfig:add']">
                    同步
                  </a>
                  <a-divider type="vertical" />
                  <!-- <a :disabled="multiple" @click="handleUpdate(record)"
                v-hasPermi="['project:automationConfig:environmentConfig:edit']"> 修改 </a>
              <a-divider type="vertical" /> -->
                  <a
                    @click="handleViewEnvironment(record)"
                    v-hasPermi="['project:automationConfig:environmentConfig:query']"
                  >
                    详情
                  </a>
                  <a-divider type="vertical" />
                  <a @click="handleRemote(record)" v-hasPermi="['project:automationConfig:environmentConfig:query']">
                    远程
                  </a>
                </span>
              </advance-table>
            </div>
            <advance-table
              style="margin-top: -10px; margin-left: -12px; width: 101.6%"
              :scroll="{ x: '100%', y: 218 }"
              :columns="browserColumns"
              :data-source="browserList"
              :loading="loading"
              rowKey="id"
              @refresh="getAutomationList"
              bordered
              size="middle"
              title="浏览器配置信息"
            >
              <span slot="type" slot-scope="{ record }">
                <a
                  v-for="(item, value) in browserType"
                  v-if="item.type === record.type"
                  :key="value"
                  :value="item.type"
                >
                  {{ item.type }}
                </a>
              </span>
              <span slot="status" slot-scope="{ record }">
                <a-switch
                  :checked="Boolean(record.status)"
                  @change="(value) => onchangeBrowser(value, record)"
                  :disabled="false"
                />
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
                <a @click="handleViewBrowser(record)" v-hasPermi="['project:automationConfig:browserConfig:query']">
                  详情
                </a>
              </span>
            </advance-table>
            <EConfigDataAddOrEdit
              v-if="showAddModal"
              :environment_Id="environmentId"
              ref="EConfigDataAddOrEdit"
              @close="showAddModal = false"
            />
            <AConfigDataAddOrEdit
              v-if="showAddModal"
              :automation_Id="automation.id"
              ref="AConfigDataAddOrEdit"
              @close="showAddModal = false"
            />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm"> 确定 </a-button>
      <!-- <a-modal title="是否确认执行以下场景?" v-model:open="showDialog" width="650px" :confirm-loading="confirmLoading" @ok="handleOk"
        @close="closeModal">
        <div style="height: 400px">
          <a-list size="small" bordered :data="pagedData"  style="height: 381px;overflow-y: auto;">
            <a-list-item v-for="(item, index) in pagedData" :key="index">{{ item }}</a-list-item>
          </a-list>
          <a-pagination
            style="float: right;margin-top: 10px;"
            size="small"
            :current="currentPage"
            :total="totalItems"
            :pageSize="pageSize"
            :showTotal="(total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`"
            :pageSizeOptions="['10', '20', '30', '40', '50']"
            :showSizeChanger=true
            :showLessItems=true
            :showQuickJumper=true
             @showSizeChange="handleShowSizeChange" @change="handlePageChange">
          </a-pagination>
        </div>
      </a-modal> -->
      <a-modal
        title="是否确认执行以下场景?"
        v-model="showDialog"
        width="840px"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @close="closeModal"
      >
        <div style="height: 550px">
          <advance-table
            style="margin-top: -10px"
            :scroll="{ x: '100%', y: 420 }"
            :columns="sceneColumns"
            :data-source="pagedData"
            :loading="loading"
            rowKey="id"
            bordered
            size="middle"
            title="测试场景执行列表"
          >
          </advance-table>
          <a-pagination
            style="float: right; margin-top: 10px"
            size="small"
            :current="currentPage"
            :total="totalItems"
            :pageSize="pageSize"
            :showTotal="(total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`"
            :pageSizeOptions="['10', '20', '30', '40', '50']"
            :showSizeChanger="true"
            :showLessItems="true"
            :showQuickJumper="true"
            @showSizeChange="handleShowSizeChange"
            @change="handlePageChange"
          >
          </a-pagination>
        </div>
      </a-modal>
    </template>
  </ant-modal>
</template>

<script>
import AntModal from '@/components/pt/dialog/AntModal'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import * as projectApis from '@/api/project'
import * as automationApis from '@/api/ui'
import * as api from '@/api/api'

import {
  versionColumns, domainColumns, serverColumns, dataBaseColumns, dataBaseType,
  projectColumns, jenkinsColumns, environmentColumns, useStatusOptions, browserColumns, browserType, sceneColumns
} from './EnvConfig'
import EConfigDataAddOrEdit from './../../../project/environmentConfig/modules/ConfigDataAddOrEdit.vue'
import AConfigDataAddOrEdit from './../../../project/automationConfig/modules/ConfigDataAddOrEdit.vue'
import { randomUUID } from '@/utils/util'
import log from '@/log/log'

export default {
  name: 'OperationC',
  components: { AntModal, AdvanceTable, EConfigDataAddOrEdit, AConfigDataAddOrEdit },
  props: {
    // AqueryParam: {
    //   type: Object,
    // },
    // Aids: {
    //   type: Array,
    //   required: true,
    // },
    // sceneIds: {
    //   type: Array,
    //   required: true,
    // },
    testPlan: {
      type: Object,
    },
    sceneList: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      sceneColumns: sceneColumns,

      size: 'small',
      column: 5,

      labelStyle: {
        color: '#222222'
      },
      contentStyle: {
        background: '#FDE2E2',
        // fontWeight: 'bold'
      },
      contentStyle1: {
        background: '#E1F3D8',
        // fontWeight: 'bold'
      },
      activeKey: '1',
      environmentId: '',
      environmentName: '',
      EnvironmentOptions: [],

      versionColumns: versionColumns,
      versionList: [],
      versionName: '',
      domainColumns: domainColumns,
      domainList: [],
      serverColumns: serverColumns,
      serverList: [],
      dataBaseColumns: dataBaseColumns,
      dataBaseType,
      dataBaseList: [],

      project: {
        id: '',
        name: '',
        abbreviate: '',
        version: {
          id: '',
          name: '',
          description: '',
        },
        domain: {
          name: '',
          url: '',
        },
        server: {
          type: '',
          host: '',
          port: '',
          userName: '',
          passWord: '',
          domain: '',
        },
        dataBases: {
          type: '',
          version: '',
          id: '',
          name: '',
          port: undefined,
          driver: '',
          url: '',
          userName: '',
          passWord: '',
          maxActive: '',
          maxWait: '',
          description: '',
          configList: [
            {
              paramsName: '',
              paramsValue: '',
            }
          ],
          status: 0
        }
      },

      // automationId: '',
      automationName: '',
      AutomationOptions: [],

      projectColumns: projectColumns,
      projectList: [],

      jenkinsColumns: jenkinsColumns,
      jenkinsList: [],

      environmentColumns: environmentColumns,
      environmentList: [],
      environmentList1: [],
      useStatusOptions,
      optionName: '',

      browserColumns: browserColumns,
      browserType,
      browserList: [],

      automation: {
        id: '',
        name: '',
        description: '',
        project: {
          name: '',
          description: '',
          url: '',
        },
        jenkins: {
          ip: '',
          port: '',
          userName: '',
          passWord: '',
          url: '',
          job: '',
        },
        environment: {
          idle: '',
          name: '',
          description: '',
          ip: '',
          port: '',
          userName: '',
          passWord: '',
        },
        browser: {
          name: '',
          version: '',
          path: '',
          driver: '',
          profile: '',
          type: '',
        },
      },
      showAddModal: false,
      showDialog: false,
      confirmLoading: false,

      testReport: {
        id: '',
        name: '',
        description: '',
        triggerMode: '0',
        executionMode: '',
      },
      executionMode: '',

      ids: [],
      names: [],
      sceneList1: [],
      loading: false,
      total: 0,
      selectedRowKeys: [],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        active: {
          offline: {
            status: 1,
            offlineCauseReason: ''
          },
          idle: {
            status: undefined,
            executors: {
              url: '',
              user: ''
            }
          }
        }
      },

      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      open: false,
      formTitle: '',
      changeTreeData: [],
      changeVersionOptions: [],
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id',
        value: 'id',
      },
      rules: {
        projectId: [{ required: true, message: '复制到的产品不能为空', trigger: 'blur' }],
        moduleId: [{ required: true, message: '复制到的模块不能为空', trigger: 'blur' }],
        versionName: [{ required: true, message: '复制到的版本不能为空', trigger: 'blur' }],
        sceneId: [{ required: true, message: '新场景ID不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '新场景名称不能为空', trigger: 'blur' }]
      },
    }
  },
  computed: {
    // totalItems1() {
    //   return this.sceneIds.length
    // },
    // pagedData1() {
    //   const start = (this.currentPage - 1) * this.pageSize
    //   const end = start + this.pageSize
    //   return this.sceneIds.slice(start, end)
    // },
    totalItems() {
      return this.sceneList.length
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.sceneList.slice(start, end)
    },
  },
  created() {
    // console.log(this.testPlan);
  },
  watch: {
    activeKey: {
      handler(val) {
        if (val === '1') {
          this.getProjectList()
          this.getEnvironmentList()
        } else {
          this.getAutomationList()
        }
      },
    },
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
    },
    handleShowSizeChange(currentPage, pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
    },
    handleAdd1(record) {
      this.open = true
      this.activeKey = '1'
      this.formTitle = '环境配置信息确认'
      // this.changeTreeData = this.treeData
      // this.changeVersionOptions = this.versionOptions
      // this.form = Object.assign(this.form, row)
      this.project.id = record.projectId
      // this.Aids.length > 0 ? this.Aids : this.Aids.push(record.id)
      // this.sceneIds.length > 0 ? this.sceneIds : this.sceneIds.push(record.sceneId)
      // this.sceneList.length > 0 ? this.sceneList : this.sceneList.push(row)
      this.versionName = record.versionName
      this.getProjectList()
      this.getEnvironmentList()
      this.getAutomationList()
    },
    handleAdd(record,key,type) {
      // console.log(record);
      // console.log(key);
      // console.log(type);
      // console.log(this.sceneList);
      this.open = true
      this.activeKey = key
      this.formTitle = '环境配置信息确认'
      this.project.id = record?record.projectId:this.sceneList[0].projectId
      this.versionName = record?record.versionName:this.sceneList[0].versionName
      // this.executionMode = key || record.key
      // const keys = ['0', '1', '3'];
      // this.optionName = keys.includes(key) ? '远程调试' : '本地调试';
      this.executionMode = type.id
      this.optionName = type.name
      // this.optionName = key==='0'||key==='1'||key==='3'?'远程调试':'本地调试'
      // this.Aids.length > 0 ? this.Aids : this.Aids.push(record.id)
      this.getProjectList()
      if(key==='1'){
        this.getEnvironmentList()
      }
      // this.handleSyncAll()
      // this.getAutomationList()
    },
    changeEnvironment(id) {
      if (id != undefined) {
        this.getProjectList()
        this.getEnvironmentInfo(id)
      }
    },
    changeAutomation(id) {
      if (id != undefined) {
        this.getAutomationInfo(id)
      }
    },
    goEnvironmentConfig() {
      window.open("url")
      this.$router.push({ path: '/project/environmentConfig' })
    },
    handleEnvironmentConfig() {
      this.$router.push({
        name: 'EnvironmentConfig',
        params: {
          projectId: this.project.id
        }
      })
      this.cancel()
    },
    handleAutomationConfig() {
      this.$router.push({
        name: 'AutomationConfig',
        params: {
          type: 'web'
        }
      })
      this.cancel()
    },
    getProjectList() {
      const queryParam = {
        id: this.project.id
      }
      projectApis.getProjectList(queryParam).then((response) => {
        this.project.name = response.data.list[0].name
        this.project.abbreviate = response.data.list[0].abbreviate
      })
    },
    getEnvironmentList() {
      const queryParam = {
        projectId: this.project.id
      }
      projectApis.getEnvironmentList(queryParam).then((response) => {
        this.EnvironmentOptions = response.data.list
        this.EnvironmentOptions.forEach((item, index) => {
          if (item.status === 1) {
            this.project.id = item.projectId
            this.environmentId = item.id
            this.getEnvironmentInfo(item.id)
            // this.getDataBaseList(item.id)
          }
        })
      })
      // this.getServerList(this.environmentId )
      // this.getDataBaseList()
    },
    getEnvironmentInfo(environmentId) {
      this.loading = true
      // this.versionList = []
      // this.domainList = []
      // this.serverList = []
      // this.dataBaseList = []
      projectApis.getEnvironmentInfo(environmentId).then((response) => {
        if (response.data.versionConfig.length > 0) {
          this.versionList = []
          var versionList = JSON.parse(response.data.versionConfig)
          versionList.forEach((item, index) => {
            if (item.delFlag===0) {
              this.versionList.push(item)
              if (this.versionName === item.name) {
                this.project.version = item
              } else if (item.status === 1) {
                this.project.version = item
                this.versionName = item.name
              }
              // console.log(this.project.version);
            }
          })
        }
        // if (response.data.domainConfig.length !=null && response.data.domainConfig.length > 0) {
        //   this.domainList = JSON.parse(response.data.domainConfig)
        //   this.domainList.forEach((item, index) => {
        //     if (item.status === 1) {
        //       this.project.domain = item
        //     }
        //   })
        // }
        if (response.data.serverConfig.length > 0) {
          this.serverList = JSON.parse(response.data.serverConfig)
          this.serverList.forEach((item, index) => {
            if (item.status === 1) {
              this.project.server = item
              item.configList.forEach((key) => {
                if (key.paramsName === '前端域名') {
                  this.project.server.domain = key.paramsValue
                }
              })
            }
          })
        }
        if (response.data.dataBaseConfig.length > 0) {
          this.dataBaseList = JSON.parse(response.data.dataBaseConfig)
          this.dataBaseList.forEach((item, index) => {
            if (item.name === this.project.server.host) {
              this.project.dataBases = item
              // item.configList.forEach((key) => {
              // })
            }
          })
        }
        this.loading = false
      })
    },
    getDataBaseList() {
      this.loading = true
      projectApis.getEnvironmentInfo(environmentId).then((response) => {
        if (response.data.dataBaseConfig.length > 0) {
          this.dataBaseList = JSON.parse(response.data.dataBaseConfig)
        } else {
          this.dataBaseList = []
        }
        this.loading = false
      })
    },
    // 表格内-状态切换
    onchangeVersion(value, record) {
      record.status = Number(value)
      let params = {
        id: this.environmentId,
        versions: record
      }
      projectApis.editVersion(params).then(response => {
        this.$message.success('启用成功')
      }).finally(() => {
        this.getEnvironmentInfo(this.environmentId)
      })
    },
    onChangeVersion(item) {
      this.project.version = item
    },
    onchangeDomain(value, record) {
      record.status = Number(value)
      let params = {
        id: this.environmentId,
        domains: record
      }
      projectApis.editDomain(params).then(response => {
        this.$message.success('启用成功')
      }).finally(() => {
        this.getEnvironmentInfo(this.environmentId)
      })
    },
    onchangeServer(value, record) {
      record.status = Number(value)
      let params = {
        id: this.environmentId,
        servers: record
      }
      projectApis.editServer(params).then(response => {
        this.$message.success('启用成功')
      }).finally(() => {
        this.getEnvironmentInfo(this.environmentId)
      })
    },
    onchangeDataBase(value, record) {
      record.status = Number(value)
      let params = {
        id: this.environmentId,
        dataBases: record
      }
      projectApis.editDataBase(params).then(response => {
        
      })
    },
    handleViewVersion(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.EConfigDataAddOrEdit.handleView(record, 1)
      ))
    },
    handleViewServer(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.EConfigDataAddOrEdit.handleView(record, 4)
      ))
    },
    handleViewDataBase(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.EConfigDataAddOrEdit.handleView(record, 5)
      ))
    },
    getAutomationList() {
      const queryParam = {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.type, a.name, a.status',
        isAsc: 'desc',
        type: 'web'
      }
      projectApis.getAutomationList(queryParam).then((response) => {
        this.AutomationOptions = response.data.list
        this.AutomationOptions.forEach((item, index) => {
          if (item.status === 1) {
            this.automation.id = item.id
            this.automation.name = item.name
            this.automation.description = item.description
            this.handleSyncAll()
            // this.getAutomationInfo(item.id)
          }
        })
      })
    },
    getAutomationInfo(automationId) {
      this.loading = true
      projectApis.getAutomationInfo(automationId).then((response) => {
        // this.projectList = []
        // this.jenkinsList = []
        // this.environmentList = []
        // this.browserList = []
        if (response.data.projectConfig.length > 0) {
          this.projectList = JSON.parse(response.data.projectConfig)
          this.projectList.forEach((item, index) => {
            if (item.status === 1) {
              this.automation.project = item
            }
          })
        }
        if (response.data.jenkinsConfig.length > 0) {
          this.jenkinsList = JSON.parse(response.data.jenkinsConfig)
          this.jenkinsList.forEach((item, index) => {
            if (item.status === 1) {
              this.automation.jenkins = item
              this.automation.project.name = item.job
            }
          })
        }
        if (response.data.environmentConfig.length > 0) {
          this.environmentList = JSON.parse(response.data.environmentConfig)
          this.environmentList1 = []
          this.names = []
          this.environmentList.forEach((item, index) => {
            if (item.status === 1) {
              this.automation.environment = item
            }
            if (item.description.systemType === 'Windows') {
              this.environmentList1.push(item)
              if (item.description.name === localStorage.getItem('userName')) {
                localStorage.setItem('userIP', item.name)
                if (this.optionName ==='本地调试') {
                  this.queryParam.name = item.name
                  // this.names.push(item.name)
                }else{
                  this.queryParam.name = undefined
                }  // this.names.push(item.name)
              }
              this.names.push(item.name)
            }
          })
        }
        if (response.data.browserConfig.length > 0) {
          this.browserList = JSON.parse(response.data.browserConfig)
          this.browserList.forEach((item, index) => {
            if (item.status === 1) {
              this.automation.browser = item
            }
          })
        }
        this.loading = false
        return this.handleQuery()
      })
    },
    handleViewProject(record) {
      if (record.url !== '') {
        window.open(record.url)
      } else {
        this.$message.error('未配置项目地址，请检查后重试！')
      }
    },
    handleViewJenkins(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.AConfigDataAddOrEdit.handleView(record, 2)
      ))
    },
    handlePreviewJenkins(record) {
      if (record.url !== '' && record.job !== '') {
        window.open(record.url + '/job/' + record.job)
      } else {
        this.$message.error('未配置Jenkins地址和项目，请检查后重试！')
      }
    },
    onchangeProject(value, record) {
      record.status = Number(value)
      let params = {
        id: this.automation.id,
        project: record
      }
      projectApis.editAutomationProject(params).then(response => {
        this.$message.success('启用成功')
      }).finally(() => {
        this.getAutomationInfo(this.automation.id)
      })
    },
    onchangeJenkins(value, record) {
      record.status = Number(value)
      let params = {
        id: this.automation.id,
        jenkins: record
      }
      projectApis.editAutomationJenkins(params).then(response => {
        this.$message.success('启用成功')
      }).finally(() => {
        this.getAutomationInfo(this.automation.id)
      })
    },
    onchangeEnvironment(value, record) {
      // console.log(record);
      if (record.active.offline.status === 1 && record.active.idle.status === 1) {
        record.status = Number(value)
        let params = {
          id: this.automation.id,
          environment: record
        }
        projectApis.editAutomationEnvironment(params).then(response => {
          this.$message.success('启用成功')
        }).finally(() => {
          this.getAutomationInfo(this.automation.id)
        })
      } else if (record.active.offline.status === 0) {
        this.$message.warning('当前环境已离线，空闲时才能启用，详情请查看使用状态！')
        this.queryParam.active.idle.status = 2
      } else if (record.active.idle.status === 0) {
        this.$message.warning('当前环境正在使用中，空闲时才能启用，详情请查看使用状态！')
        this.queryParam.active.idle.status = 0
      }
      this.handleQuery()
    },
    onchangeBrowser(value, record) {
      record.status = Number(value)
      let params = {
        id: this.automation.id,
        browser: record
      }
      projectApis.editAutomationBrowser(params).then(response => {
        this.$message.success('启用成功')
      }).finally(() => {
        this.getAutomationInfo(this.automation.id)
      })
    },
    handleSyncAll() {
      this.loading = true
      var userIP = localStorage.getItem('userIP')
      let params = {
        id: this.automation.id,
        names: this.optionName==='本地调试' ? userIP!=null?[userIP]:[]:this.names
      }
      projectApis.syncAutomationEnvironment(params).then(response => {
        this.$message.success('同步成功')
      }).catch(err => {
        console.log('同步失败', err)
        this.$message.error('同步失败')
      }).finally(() => {
        this.getAutomationInfo(this.automation.id)
      })
    },
    handleSync(record) {
      var names = []
      if (this.selectedRowKeys.length > 0) {
        names = this.names
      } else if (record !== undefined && record.name !== undefined) {
        names.push(record.name)
      } else {
        this.$message.warning('请选择要批量同步的环境！')
        return
      }
      let params = {
        id: this.automation.id,
        names: names
      }
      projectApis.syncAutomationEnvironment(params).then(response => {
        this.$message.success('同步成功')
      }).catch(err => {
        console.log('同步失败', err)
        this.$message.error('同步失败')
      }).finally(() => {
        this.getAutomationInfo(this.automation.id)
      })
    },
    handleViewEnvironment(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.AConfigDataAddOrEdit.handleView(record, 3)
      ))
    },
    handleViewBrowser(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.AConfigDataAddOrEdit.handleView(record, 4)
      ))
    },
    handleRemote(record) {
      var url = ''
      var configList = record.configList
      configList.forEach((item, index) => {
        if (item.paramsName === 'VM_Path') {
          url = item.paramsValue
        }
      })
      if (url !== '') {
        window.open(url)
      } else {
        this.$message.error('未配置VMware® VSphere®虚拟机远程地址，请先进行配置，可从虚拟机管理平台获取！')
      }
    },
    handleQuery() {
      let queryParam = {}
      let queryParam1 = {
        name: this.queryParam.name
      }
      let queryParam2 = {
        name: this.queryParam.name,
        active: {
          offline: {
            status: this.queryParam.active.idle.status < 2 ? 1 : 0,
          },
          idle: {
            status: this.queryParam.active.idle.status === 2 ? 1 : this.queryParam.active.idle.status
          }
        }
      }
      if (this.environmentList1.length > 0) {
        // if (this.queryParam.name !=='') {
        //   delete queryParam.active
        // }else{
        //   queryParam = {
        //     ...active
        //   }
        // }
        this.queryParam.name? queryParam = queryParam1 : queryParam = queryParam2
        this.environmentList = this.getEnvironmentList1(this.environmentList1, queryParam)
      }
    },
    getEnvironmentList1(arr, param) {
      // console.log(param);
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
        }
        // console.info('符合条件总计：', num)
        // console.info('bProps.length', bProps.length)
        if (num >= bProps.length) {
          obj.push(item);
        }
      })
      return obj
    },
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
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getEnvironmentList()
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
    onSizeChange(current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      this.getEnvironmentList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map(item => item.id)
      this.names = this.selectedRows.map(item => item.name)
      this.single = selectedRowKeys.length !== 1
    },
    // 表单重置
    reset() {
      this.$refs.form?.resetFields()
    },
    // 取消
    cancel() {
      this.open = false
      // this.reset()
      this.$emit('close')
      this.$emit('getList')
    },
    closeModal() {
      this.showDialog = false
      this.$emit('close')
    },
    // 获取场景基本信息
    getScence(id) {
      if (id !== undefined) {
        automationApis.getScenceInfo(id).then((response) => {
          this.sceneList1 = []
          // this.sceneList1.push(response.data)
          this.sceneList1.push(this.filterObjectProperties(response.data))
        })
      }
    },
    filterObjectProperties(obj) {
      return {
        id: obj.id,
        sceneId: obj.sceneId,
      }
    },
    filterArrayItems(data) {
      return data.map((item) => ({
        id: item.id,
        sceneId: item.sceneId,
      }))
    },
    // 确定
    submitForm() {
      // this.showDialog = true
      if(this.project.version.name === this.versionName){
        if(this.automation.environment.active===undefined){
          this.$message.warning('请选择自动化环境！')
        }  else if (this.automation.environment.active.offline.status === 0) {
          this.$message.warning('当前环境已离线，空闲时才能启用，详情请查看使用状态！')
          this.queryParam.active.idle.status = 2
        } else if (this.automation.environment.active.idle.status === 0) {
          this.$message.warning('当前环境正在使用中，空闲时才能启用，详情请查看使用状态！')
         this.queryParam.active.idle.status = 0
        } else if (this.automation.environment.active.offline.status === 1 && this.automation.environment.active.idle.status === 1) {
          this.showDialog = true
          // this.sceneList1 = this.sceneList.length>1?this.sceneList:this.getScence(this.sceneList[0].id)
          // console.log(this.sceneList);
          this.sceneList1 = this.filterArrayItems(this.sceneList)
        }
      }else{
        this.$message.warning('产品版本和场景版本不匹配，请检查后重试！')
      }
    },
    handleOk() {
      this.confirmLoading = true
      if (this.executionMode === '4') {
        let params = {
          id: this.testPlan ? this.testPlan.id : '',
          executeConfig: {
            testPlanId: this.testPlan ? this.testPlan.id : '',
            executeName: localStorage.getItem('userName'),
            executeEmail: localStorage.getItem('userEmail'),
            testReport: {
              id: this.uuidv1().replaceAll('-', ''),
              name: this.testPlan ? `${this.testPlan.name}_测试报告` : '',
              description: this.testPlan ? `${this.testPlan.name}_测试报告` : '',
              triggerMode: '1',
              executionMode: this.executionMode || '',
            },
            sysSceneList: this.sceneList1,
            projectConfig: this.project,
            automationConfig: this.automation,
          },
        }
        api.updateTestPlan(params).then((response) => {
          this.$message.success('设置定时任务运行环境成功，请确保自动化环境在后续可以正常使用')
          this.confirmLoading = false
          this.showDialog = false
          this.cancel()
        }).catch((error) => {
            this.$message.error('设置定时任务运行环境失败，请检查环境配置！')
            this.confirmLoading = false
          })
      } else {
        let params = {
          testPlanId: this.testPlan ? this.testPlan.id : '',
          executeName: localStorage.getItem('userName'),
          executeEmail: localStorage.getItem('userEmail'),
          testReport: {
            id: this.uuidv1().replaceAll('-', ''),
            name: this.testPlan ? `${this.testPlan.name}_测试报告` : '',
            description: this.testPlan ? `${this.testPlan.name}_测试报告` : '',
            triggerMode: '0',
            executionMode: this.executionMode || '',
          },
          sysSceneList: this.sceneList1,
          projectConfig: this.project,
          automationConfig: this.automation,
        }
        // console.log(params);
        automationApis.execScence(params).then((res) => {
            if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
              this.$message.success('执行成功，跳转至Jenkins控制台！')
              setTimeout(() => {
                window.open(res.data.consoleUrl)
                this.confirmLoading = false
                this.showDialog = false
                this.cancel()
              }, 1000)
            } else {
              this.$message.error('执行失败，请检查Jenkins构建结果！')
              this.confirmLoading = false
            }
          })
          .catch((error) => {
            this.$message.error('执行失败，请检查Jenkins环境！')
            this.confirmLoading = false
          })
      }
    },
    // 执行场景（单个，多个）
    // handleExecut(record) {
    //   var that = this
    //   const ids = record.id || this.ids
    //   const sceneIds = record.sceneId || this.sceneIds
    //   this.$Modal.confirm({
    //     title: '是否确认执行?',
    //     content: '当前选中为' + sceneIds + '的数据',
    //     onOk() {
    //       return execScence(ids).then((res) => {
    //         if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
    //           that.$message.success('执行成功，跳转至Jenkins控制台！', 3)
    //           setTimeout(() => {
    //             window.open(res.data.consoleUrl)
    //           }, 1000)
    //         } else {
    //           this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
    //         }
    //       }).catch((error) => {
    //         that.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
    //       })
    //     },
    //     onCancel() { },
    //   })
    // },
    // // 执行场景（项目对应版本下所有）
    // handleExecutAll(params) {
    //   console.log(params);
    //   // var that = this
    //   // const { projectId, queryParam } = that
    //   // const params = {
    //   //   ...queryParam,
    //   //   projectId,
    //   // }
    //   this.$Modal.confirm({
    //     title: '是否确认执行?',
    //     content: '当前为选择项目版本下所有的场景',
    //     onOk() {
    //       return execScenceAll(params).then((res) => {
    //         if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
    //           that.$message.success('执行成功，跳转至Jenkins控制台!', 3)
    //           setTimeout(() => {
    //             window.open(res.data.consoleUrl)
    //           }, 1000)
    //         } else {
    //           this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
    //         }
    //       }).catch((error) => {
    //         that.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
    //       })
    //     },
    //     onCancel() { },
    //   })
    // },
  },
}
</script>

<style>
.descriptions-item-label {
  color: red;
}

.descriptions-item-content {
  background: #fde2e2;
}
</style>