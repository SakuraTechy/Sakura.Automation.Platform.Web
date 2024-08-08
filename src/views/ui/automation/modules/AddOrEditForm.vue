<template>
  <div>
    <a-card :bordered="false" class="ui-card">
      <split splitHeight="100%" :leftWidth="width">
        <template slot="paneL">
          <div class="card-container">
            <a-tabs v-model="activeKey" :tabBarGutter="0">
              <!-- 基础信息 -->
              <a-tab-pane key="1" tab="基础信息">
                <a-form-model ref="sceneForm" :model="form" :rules="sceneRules" :label-col="labelCol"
                  :wrapper-col="wrapperCol" style="margin-top: 20px">
                  <a-form-model-item label="场景ID" prop="sceneId">
                    <a-input v-model="form.sceneId" placeholder="请输入" style="width: 275px" />
                  </a-form-model-item>
                  <a-form-model-item label="场景名称" prop="name">
                    <a-input v-model="form.name" placeholder="请输入" style="width: 275px" />
                  </a-form-model-item>
                  <a-form-model-item label="所属项目" prop="projectId">
                    <a-select v-model="form.projectId" placeholder="请选择项目" style="width: 275px"
                      option-filter-prop="children" @change="onChangeProject" disabled>
                      <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="d.id">
                        {{ d.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="所属版本" prop="versionName">
                    <a-select v-model="form.versionName" placeholder="请选择版本" style="width: 275px"
                      option-filter-prop="children">
                      <a-select-option v-for="(item, index) in versionOptions" :key="index" :value="item.name"
                        @click="onChangeVersion(item)">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="所属模块" prop="moduleId">
                    <!-- <a-tree-select v-model="form.moduleId" style="width: 77%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择" v-if="changeTreeData.length > 0" :tree-data="changeTreeData" tree-default-expand-all :expandedKeys="expandedKeys" @expand="handleExpand" :replaceFields="replaceFields">
                    </a-tree-select> -->
                    <el-select size="small" style="width: 275px;" ref="selectTree" v-model="form1.moduleName"
                      placeholder="请选择模块" filterable :filter-method="filterText" @focus="handleFocus">
                      <el-option style="height: 100%; padding: 0;" value="">
                        <el-tree
                          style="font-weight: normal;width: 275px;"
                          :data="changeTreeData"
                          :props='treeProps'
                          highlight-current
                          default-expand-all
                          show-checkbox
                          check-strictly
                          check-on-click-node
                          node-key="id"
                          :default-checked-keys="defaultExpandedKeys"
                          :filter-node-method="filterNode"
                          :expand-on-click-node="false"
                          @check="handleNodeClick"
                          ref="tree" />
                      </el-option>
                    </el-select>
                  </a-form-model-item>
                  <a-form-model-item label="场景等级" prop="level">
                    <a-select v-model="form.level" placeholder="请选择用例等级" style="width: 275px"
                      option-filter-prop="children">
                      <a-select-option v-for="(d, index) in levelOptions" :key="index" :value="d.id">
                        {{ d.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="执行状态" prop="status">
                    <a-select v-model="form.status" placeholder="请选择状态" style="width: 275px"
                      option-filter-prop="children">
                      <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.id">
                        {{ d.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="责任人" prop="principalId">
                    <a-select v-model="form.principalId" placeholder="请选择责任人" style="width: 275px"
                      option-filter-prop="children">
                      <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.id">
                        {{ d.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="标签" prop="tag">
                    <vue-tags-input v-model="tasInput" :tags="tags" placeholder="按下回车键添加" style="width:275px"
                      @tags-changed="(newTags) => (tags = newTags)" />
                  </a-form-model-item>
                  <a-form-model-item label="描述" prop="description">
                    <a-textarea v-model="form.description" placeholder="请输入" style="width: 275px" auto-size />
                  </a-form-model-item>
                </a-form-model>
              </a-tab-pane>
              <!-- 步骤信息 -->
              <a-tab-pane key="2" tab="场景用例">
                <div style="margin-left: 30px; margin-bottom: 10px">
                  <a-button type="primary" size="small" @click="addSenceCase">新增用例</a-button>
                  <a-button type="primary" size="small" style="float: right;margin-right: 30px;"
                    @click="refresh">刷新用例</a-button>
                </div>
                <div v-if="!stepList.length" style="margin: 100px auto; text-align: center">暂无步骤</div>
                <div v-else class="ui-step-list">
                  <a-tree
                  :tree-data="stepList"
                  blockNode
                  draggable
                  defaultExpandAll
                  :replaceFields="replaceFields"
                  :expandedKeys="expandedKeys"
                  :selectedKeys="selectedKeys"
                  :auto-expand-parent="autoExpandParent"
                  @select="clickSelectKeys"
                  @expand="onExpand"
                  @dragenter="onDragEnter"
                  @drop="onDrop"
                  ref="stepTree">
                    <template #title="{ id, name, order, level, pid }">
                      <span class="tree-title">
                        <span class="tree-name">
                          <span class="index-circle">{{ order }}</span>
                          <a-tooltip placement="topLeft">
                            <template slot="title">
                              <span>{{ name }}</span>
                            </template>
                            <span :id="id" :class="level === 1 ? 'tree-title-name' : ''">{{ name }}</span>
                          </a-tooltip>
                        </span>
                        <span class="operation">
                          <a-dropdown>
                            <a-icon class="icon" type="edit" @click="(e) => e.preventDefault()" />
                            <!-- <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> ... </a> -->
                            <a-menu slot="overlay">
                              <a-menu-item v-if="level === 1">
                                <a href="javascript:;" @click="addSenceStepList(id)">新增步骤</a>
                              </a-menu-item>
                              <a-menu-item>
                                <a href="javascript:;" @click="copySenceCase(id)" v-if="level === 1">复制用例</a>
                                <a href="javascript:;" v-else @click="copySenceStepList(id, pid)">复制步骤</a>
                              </a-menu-item>
                              <a-menu-item>
                                <a href="javascript:;" @click="editSenceCase(id)" v-if="level === 1">编辑用例</a>
                                <a href="javascript:;" @click="editSenceStepList(id, pid)" v-else>编辑步骤</a>
                              </a-menu-item>
                              <!-- <a-menu-item>
                                <a href="javascript:;" @click="copySenceCase(id)" v-if="level === 1">复制用例</a>
                                <a href="javascript:;" @click="copySenceStepList(id, pid)" v-else>复制步骤</a>
                              </a-menu-item> -->
                              <a-menu-item>
                                <a href="javascript:;" v-if="level === 1" @click="delCaseList(id, name)">删除用例</a>
                                <a href="javascript:;" v-else @click="delStepList(id, name, pid)">删除步骤</a>
                              </a-menu-item>
                            </a-menu>
                          </a-dropdown>
                        </span>
                      </span>
                    </template>
                  </a-tree>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </template>
        <template slot="paneR">
          <!-- 头部卡片 -->
          <div style="margin: 12px 25px" class="header-right">
            <div>
              <a-card :bordered="false">
                <a-row>
                  <a-col :span="4">
                    <div>用例总数：{{ stepList.length }}</div>
                  </a-col>
                  <a-col :span="5">
                    <a @click="addVariant" class="card-middle">场景变量：{{ variantCount }}</a>
                  </a-col>
                  <a-col :span="15">
                    <a-checkbox v-model="performanceChecked" style="margin-right: 5px"> 性能模式 </a-checkbox>
                    <a-select v-model="webValue" style="width: 120px; margin-right: 5px">
                      <a-select-option value="1"> chrome </a-select-option>
                      <a-select-option value="2"> firefox </a-select-option>
                    </a-select>
                    <a-dropdown style="margin-right: 5px">
                      <a-menu slot="overlay">
                        <a-menu-item v-for="item in options" :key="item.id" @click="handleMenuClick(item)">{{
                          item.name
                        }}
                        </a-menu-item>
                      </a-menu>
                      <a-button type="primary" style="margin-left: 8px">
                        {{ defaultText }} <a-icon type="down" />
                      </a-button>
                    </a-dropdown>
                    <a-button type="primary" @click="submitForm">保存</a-button>
                  </a-col>
                </a-row>
              </a-card>
            </div>
          </div>
          <variant v-if="showModal" ref="variantForm" @close="getVariantCount" />
          <!-- 下面内容 -->
          <div class="step-right">
            <div v-if="!stepList.length" style="margin: 100px auto; text-align: center">在左侧添加场景步骤</div>
            <!-- 步骤内容 -->
            <div v-else>
              <div v-show="showStepInfo">
                <a-page-header title="场景步骤" />
                <div class="step-info-form">
                  <a-form-model ref="form" :model="stepInfoForm" layout="vertical" :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 18 }">
                    <a-form-model-item label="步骤名称：" prop="name">
                      {{ stepInfoForm.name }}
                    </a-form-model-item>
                    <a-form-model-item label="操作类型：" prop="operationType">
                      {{ stepInfoForm.operationType }}
                    </a-form-model-item>
                    <a-form-model-item label="操作方法：" prop="action">
                      {{ findNodeId(operations, stepInfoForm.action, 'name') }}
                    </a-form-model-item>
                    <a-form-model-item label="环境配置：" prop="setting">
                      {{ findNodeId(settingOptions, stepInfoForm.setting, 'name') || '无' }}
                    </a-form-model-item>
                    <a-form-model-item label="操作步骤：" prop="config" v-if="stepInfoForm.config.length > 0">
                      <a-space v-for="(item, index) in stepInfoForm.config" :key="index" style="margin-bottom: 10px">
                        <a-input v-model="item.paramsName" style="width: 130px" placeholder="请输入参数名" disabled />
                        <a-input v-model="item.paramsValue" style="width: 420px" placeholder="请输入参数值" disabled />
                      </a-space>
                    </a-form-model-item>
                  </a-form-model>
                </div>
              </div>
              <div v-show="showCaseInfo">
                <a-page-header title="场景用例信息" />
                <div class="step-info-form">
                  <a-form-model ref="form" :model="senceCaseInfo" layout="vertical" :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 18 }">
                    <a-form-model-item label="用例ID：" prop="name">
                      {{ senceCaseInfo.id }}
                    </a-form-model-item>
                    <a-form-model-item label="用例名称：" prop="action">
                      {{ senceCaseInfo.name }}
                    </a-form-model-item>
                    <a-form-model-item label="用例备注：" prop="remark">
                      {{ senceCaseInfo.remark }}
                    </a-form-model-item>
                  </a-form-model>
                </div>
              </div>
            </div>
            <!-- <a-page-header title="高级设置" />
            <Advance
              ref="advanceSetting"
              :treeData="treeData"
              :replaceFields="replaceFields"
              :showElement="showElement"
            ></Advance> -->
          </div>
        </template>
      </split>
    </a-card>
    <!-- 新增用例，编辑，复制用例弹窗 -->
    <AddCaseList ref="caseForm" @updateStepList="getStepList"></AddCaseList>
    <CopyCaseForm ref="copyCaseForm" @updateStepList="getStepList"></CopyCaseForm>
    <!-- 新增步骤，编辑，复制步骤弹窗 -->
    <AddStepList ref="stepForm" @updateStepList="getStepList"></AddStepList>
    <CopyStepForm ref="copyStepForm" @updateStepList="getStepList"></CopyStepForm>
    <!-- 执行测试场景弹窗 -->
    <executScenceForm ref="executScenceForm" :sceneList="sceneList"></executScenceForm>
  </div>
</template>

<script>
import Split from '@/components/pt/split/Index'
import { levelOptions, statusOptions, operations } from '@/utils/options'
import { getAllUsersOfSystem } from '@/api/project'
import VueTagsInput from '@johmun/vue-tags-input'
import {
  execScence,
  getScenceInfo,
  addScenceList,
  editScenceList,
  getVersionList,
  getSenceCaseList,
  delSenceCaseList,
  getSenceCaseInfo,
  getSenceStepInfo,
  delSenceStepList,
  dragSenceStepInfo,
  getUiNode
} from '@/api/ui'
import * as projectApis from '@/api/project'
import Variant from './Variant.vue'
import AddStepList from './OperationA.vue'
import AddCaseList from './OperationB.vue'
import Advance from '../components/Advance.vue'
import CopyCaseForm from './copyCaseForm.vue'
import CopyStepForm from './copyStepForm.vue'
import executScenceForm from './executScenceForm.vue'
export default {
  components: { Split, AddStepList, Variant, VueTagsInput, Advance, AddCaseList, CopyCaseForm, CopyStepForm, executScenceForm },
  name: 'addOrEditForm',
  props: {
    sceneInfo: {
      type: Object,
    },
    projectOptions: {
      type: Array,
    },
    activeId: {
      type: String,
    },
    projectId: {
      type: String,
      required: true,
    },
    treeData: {
      type: Array,
      required: true,
    },
    memberOptions: {
      type: Array,
      required: true
    },
    versionOptions: {
      type: Array,
      required: true
    },
    version: {
      type: Object,
    },
    sceneList: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      defaultText: '本地调试',
      operations,
      saveId: undefined,
      tasInput: '',
      changeTreeData: [],
      levelOptions,
      statusOptions,
      showElement: false, // 高级设置是否展示元素库
      showCaseInfo: false, // 显示用例信息
      showStepInfo: false, // 显示步骤信息
      tags: [],
      variantCount: 0,
      variantList: [],
      showModal: false,
      activeKey: '1',
      width: '500',
      activeIndex: 0, // 激活的步骤
      performanceChecked: false, // 是否性能模式
      webValue: '1', // 浏览器选择
      isHandleEdit: false,
      onSave: false, // 判断用户有没有点保存
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      settingOptions: [],
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id',
        value: 'id',
      },
      defaultExpandedKeys: [],
      treeProps: {
        children: 'children',
        label: 'name',
        key: 'name',
      },
      form1: {
        moduleName: '',
      },
      form: {
        id: undefined,
        sceneId: '', //场景ID
        projectId: '', // 所属项目ID
        projectName: '', // 所属项目名称
        versionId: '',// 所属版本ID
        versionName: '', // 所属版本名称
        level: 'P0', // 用例等级
        name: '', //场景名称
        moduleId: '', // 所属模块
        moduleName: '',
        status: '未开始', // 执行状态
        tags: '', // 所属标签
        principalId: '', // 责任人
        description: '', //场景描述
        caseMsg: '',
        caseTotal: 0,
        casePass: 0,
        caseFail: 0,
        caseSkip: 0,
        passRate: '0%',
        executeResult: '不通过',
        stepTotal: 0,
        stepPass: 0,
        stepFail: 0,
        stepSkip: 0
      },
      senceCaseInfo: {
        cancel: '',
        id: '',
        name: '',
        remark: '',
      }, // 场景用例信息
      stepInfoForm: {
        id: '',
        name: '',
        action: '',
        setting: '',
        config: [{ paramsName: '', paramsValue: '' }],
        operationName: '',
        operationType: '',
      },
      optionName: '',
      options: [
        {
          id: '2',
          name: '本地调试',
        },
        {
          id: '3',
          name: '远程调试',
        },
        {
          id: '4',
          name: '查看日志',
        },
        {
          id: '5',
          name: '查看报告',
        },
        {
          id: '6',
          name: '查看回放',
        },
      ],
      // 责任人
      // memberOptions: [],
      // versionOptions: [],
      stepList: [], // 步骤内容
      expandedKeys: [],
      selectedKeys: null,
      autoExpandParent: true,
      sceneRules: {
        sceneId: [{ required: true, message: '场景ID不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '场景名称不能为空', trigger: 'blur' }],
        moduleId: [{ required: true, message: '所属模块不能为空', trigger: 'blur' }],
        projectId: [{ required: true, message: '项目不能为空', trigger: 'blur' }],
        principalId: [{ required: true, message: '责任人不能为空', trigger: 'blur' }],
        level: [{ required: true, message: '用例等级不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        versionName: [{ required: true, message: '版本不能为空', trigger: 'blur' }]
      },
    }
  },
  created() {
    // this.changeTreeData = this.treeData
    // this.form.moduleId = this.form.moduleId ? this.form.moduleId : this.activeId
    this.form.projectId = this.projectId
    this.form.principalId = this.form.principalId ? this.form.principalId : this.$store.getters.userId
    this.form.versionId = this.version.id
    this.form.versionName = this.version.name
    this.getScence()
    this.getTreeData()
    // this.getAllUsers()
    // this.getAllVersions()
    // this.getSetting()

  },
  watch: {
    sceneInfo: {
      handler(val) {
        if (val.content) {
          this.isHandleEdit = true
          this.form = Object.assign(this.form, val.content)
          this.tags = [] // 先把之前push的tags标签置空，再拿到保存后的tags
          const tags = val.content.tags === '' ? [] : JSON.parse(val.content.tags)
          tags.map(item => {
            this.tags.push({ text: item }) // 因为组件必须是object必须有text属性，才不会报错
          })
        }
      },
      deep: true,
      immediate: true,
    },
    activeKey:{
      handler(val){
        if(val==='1'){
          this.width = '500'
        }else{
          this.width = '700'
        }
      },
      deep:true,
      immediate:true
    }
  },
  mounted() {
    this.expandAllNodes()
  },
  methods: {
    refresh() {
      this.getStepList()
      this.$message.success('刷新成功')
    },
    // 获取场景基本信息
    getScence() {
      const id = this.form.id ? this.form.id : this.saveId
      if (id !== undefined) {
        getScenceInfo(id).then((response) => {
          this.form = response.data
          this.getTreeData()
          this.getStepList()
        })
      }
    },
    // 获取当前项目的环境
    // getSetting() {
    //   projectApis.getSettingInfo(this.projectId).then((response) => {
    //     this.settingOptions = response.data.environments
    //   })
    // },
    // 切换项目
    onChangeProject(value) {
      this.form.projectId = item.id
      this.getAllVersions()
      this.getTreeData()
    },
    getAllVersions() {
      const queryParam = {
        projectId: this.form.projectId
      }
      projectApis.getEnvironmentList(queryParam).then((response) => {
        response.data.list.forEach((item, index) => {
          if (item.status === 1) {
            this.changeVersionOptions = JSON.parse(item.versionConfig)
            this.changeVersionOptions.forEach(item => {
              if (item.status === 1) {
                this.form.versionId = item.id
                this.form.versionName = item.name
              }
            })
          }
        })
      })
    },
    onChangeVersion(version) {
      // console.log(version);
      this.form.versionId = version.id
      // this.form.versionName = version.name
      this.getTreeData()
      this.form.moduleId = undefined
      this.form1.moduleName = undefined
    },
    getTreeData() {
      // console.log(this.form.versionId);
      getUiNode(this.form.projectId, this.form.versionId).then((response) => {
        this.changeTreeData = response?.data || {}
        const setting = {
          iconDisabled: true,
        }
        this.changeTreeData = [{ ...this.changeTreeData, ...setting }]
        this.form.moduleId? this.form.moduleId: this.form.moduleId=this.changeTreeData[0].id
        this.$refs.tree.setCheckedKeys([this.form.moduleId]);
        this.changeTreeData.forEach((node) => {
          this.getAllChildren(node);
        })
      })
    },
    getAllChildren(node) {
      if (node.id === this.form.moduleId) {
        this.form1.moduleName = node.name
      } else if (node.children) {
        node.children.forEach(child => {
          this.getAllChildren(child);
        })
      }
    },
    handleFocus() {
      this.$refs.tree.filter('');
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 点击节点的响应
    handleNodeClick(node) {
      this.$refs.tree.setCheckedKeys([node.id])
      this.$refs.selectTree.blur()
      this.form.moduleId = node.id
      this.form1.moduleName = node.name
      this.form.moduleName = node.name
    },
    expandAllNodes() {
      const allKeys = [];
      this.getAllNodeKeys(this.stepList, allKeys);
      this.expandedKeys = allKeys;
      // console.log(this.expandedKeys);
    },
    getAllNodeKeys(nodes, keys) {
      for (const node of nodes) {
        keys.push(node.id);
        if (node.children) {
          this.getAllNodeKeys(node.children, keys);
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const treeElement = this.$refs.stepTree.$el;
        treeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    },
    scrollToNode(node) {
      // console.log(node);
      this.$nextTick(() => {
        const targetElement = document.getElementById(node);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    },
    // 获取步骤列表
    getStepList(activeId) {
      const id = this.form.id ? this.form.id : this.saveId ? this.saveId : undefined
      // console.log(id);
      if (!id) {
        this.stepList = []
      } else {
        // 调用接口获取步骤列表
        getSenceCaseList(id).then((response) => {
          const { caseMsg } = response.data
          const caseList = caseMsg ? JSON.parse(caseMsg) : []
          if (!caseList.length) {
            this.stepList = []
            return
          }
          this.stepList = caseList.map((item) => {
            const children = item.stepMsg === 'null' ? [] : item.stepList
            return { ...item, level: 1, children }
          })
          // console.log(activeId)
          this.expandAllNodes()
          if (activeId) {
            this.clickSelectKeys([activeId])
          } else {
            this.clickSelectKeys([this.stepList[0].id])
          }
        })
        // const caseList = this.form.caseMsg ? JSON.parse(this.form.caseMsg) : []
        // if (!caseList.length) {
        //   this.stepList = []
        //   return
        // }
        // this.stepList = caseList.map((item) => {
        //   const children = item.stepMsg === 'null' ? [] : item.stepList
        //   return { ...item, level: 1, children }
        // })
        // // console.log(this.stepList)
        // if (activeId) {
        //   this.clickSelectKeys([activeId])
        // } else {
        //   this.clickSelectKeys([this.stepList[0].id])
        // }
      }
    },
    // 展开节点
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 拖动节点
    onDragEnter(info) {
      // console.log(info, 'onDragEnter')
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    // 拖动节点
    onDrop(info) {
      // console.log(info, 'onDrop')
      // console.log(info.dragNodesKeys) //拖动的模块id
      // console.log(info.node.eventKey) // 需要拖动的位置
      const dragNode = info.dragNodesKeys[0]
      const eventKey = info.node.eventKey
      const length = info.dragNodesKeys.length
      const level = this.findNodeId(this.stepList, info.dragNodesKeys[length - 1], 'level')
      const dragPid = this.findNodeId(this.stepList, dragNode, 'pid')
      const eventPid = this.findNodeId(this.stepList, eventKey, 'pid')
      if (info.dropToGap || level || dragPid !== eventPid) {
        return this.$message.info('不允许拖拽')
      }
      const id = this.form.id ? this.form.id : this.saveId
      const order = this.findNodeId(this.stepList, dragNode, 'order')
      const itemOrder = this.findNodeId(this.stepList, eventKey, 'order')
      const pid = this.findNodeId(this.stepList, dragNode, 'pid')
      const params = {
        id,
        itemOrder,
        sysSceneCase: {
          order,
        },
        step: {
          id: dragNode,
          pid,
          order,
        },
      }
      dragSenceStepInfo(params).then((response) => {
        this.$message.success('拖拽成功')
        this.getStepList(dragNode)
      })
    },
    // 点击选中的步骤
    clickSelectKeys(selectedKeys, e) {
      this.selectedKeys = selectedKeys.length > 0 ? selectedKeys : [e.node.eventKey]
      if (!selectedKeys.length) return
      const level = this.findNodeId(this.stepList, selectedKeys[0], 'level')
      if (level === 1) {
        this.showCaseInfo = true
        this.showStepInfo = false
        // 调用接口获取用例信息
        const id = this.form.id ? this.form.id : this.saveId
        const params = { id, sysSceneCase: { id: selectedKeys[0] } }
        getSenceCaseInfo(params).then((response) => {
          this.senceCaseInfo = response.data
        })
      } else {
        this.showCaseInfo = false
        this.showStepInfo = true
        // 调用接口获取步骤信息
        const id = this.form.id ? this.form.id : this.saveId
        const pid = this.findNodeId(this.stepList, selectedKeys[0], 'pid')
        const params = { id, step: { id: selectedKeys[0], pid } }
        getSenceStepInfo(params).then((response) => {
          // this.stepInfoForm = response.data
          this.stepInfoForm = Object.assign(this.stepInfoForm, response.data)
        })
      }
      if(!e){
        // this.scrollToBottom()
        this.scrollToNode(selectedKeys[0])
      }
    },
    // 新增用例
    addSenceCase() {
      const { projectId } = this
      const id = this.form.id ? this.form.id : this.saveId
      // 如果没有点击保存，就需要先保存基本信息再新增步骤
      if (!id) {
        return this.$message.info('请先点击保存，再添加场景用例')
      }
      this.$nextTick(() => {
        this.$refs.caseForm.handleAdd({ projectId, id })
      })
    },
    // 编辑用例
    editSenceCase(caseId) {
      const { projectId } = this
      const id = this.form.id ? this.form.id : this.saveId
      this.$nextTick(() => {
        this.$refs.caseForm.handleUpdate({ projectId, id, caseId })
      })
    },
    // 复制用例
    copySenceCase(caseId) {
      const { projectId } = this
      const id = this.form.id ? this.form.id : this.saveId
      this.$nextTick(() => {
        this.$refs.caseForm.handleCopy({ projectId, id, caseId })
      })
    },
    // 复制用例
    copySenceCase1(sceneId) {
      const id = this.form.id ? this.form.id : this.saveId
      this.$nextTick(() => {
        this.$refs.copyCaseForm.handleAdd({ id, sceneId })
      })
    },
    // 删除用例
    delCaseList(caseId, name) {
      const id = this.form.id ? this.form.id : this.saveId
      var that = this
      this.$Modal.confirm({
        title: '确认删除所选中步骤?',
        content: '当前选中为' + name + '的数据',
        onOk() {
          const params = { id, sysSceneCase: { id: caseId } }
          delSenceCaseList(params).then((response) => {
            that.$message.success('删除成功')
            that.getStepList()
          })
        },
        onCancel() { },
      })
    },
    // 新增步骤
    addSenceStepList(caseId) {
      const { projectId } = this
      const id = this.form.id ? this.form.id : this.saveId
      // 如果没有点击保存，就需要先保存基本信息再新增步骤
      if (!id) {
        return this.$message.info('请先点击保存，再添加步骤')
      }
      this.$nextTick(() => {
        this.$refs.stepForm.handleAdd({ projectId, id, caseId })
      })
    },
    // 编辑步骤
    editSenceStepList(stepId, pid) {
      const { projectId } = this
      const id = this.form.id ? this.form.id : this.saveId
      this.$nextTick(() => {
        this.$refs.stepForm.handleUpdate({ projectId, id, stepId, pid })
      })
    },
    // 复制步骤
    copySenceStepList(stepId, pid, stepList) {
      const { projectId } = this
      const id = this.form.id ? this.form.id : this.saveId
      this.$nextTick(() => {
        this.$refs.stepForm.handleCopy({ projectId, id, stepId, pid }, this.stepList)
      })
    },
    // 复制步骤
    copySenceStepList1(stepId, stepPid) {
      const id = this.form.id ? this.form.id : this.saveId
      this.$nextTick(() => {
        this.$refs.copyStepForm.handleAdd({ id, stepId, stepPid }, this.stepList)
      })
    },
    // 删除用例
    delCaseList(caseId, name) {
      const id = this.form.id ? this.form.id : this.saveId
      var that = this
      this.$Modal.confirm({
        title: '确认删除所选中步骤?',
        content: '当前选中为' + name + '的数据',
        onOk() {
          const params = { id, sysSceneCase: { id: caseId } }
          delSenceCaseList(params).then((response) => {
            that.$message.success('删除成功')
            that.getStepList()
          })
        },
        onCancel() { },
      })
    },
    // 删除步骤
    delStepList(caseId, name, pid) {
      const id = this.form.id ? this.form.id : this.saveId
      var that = this
      this.$Modal.confirm({
        title: '确认删除所选中步骤?',
        content: '当前选中为' + name + '的数据',
        onOk() {
          const params = { id, step: { id: caseId, pid } }
          delSenceStepList(params).then((response) => {
            that.$message.success('删除成功')
            that.getStepList(pid)
          })
        },
        onCancel() { },
      })
    },
    // 点击下拉菜单
    handleMenuClick(item) {
      this.defaultText = item.name
      const id = this.form.id ? this.form.id : this.saveId
      if (item.name === '本地调试') {
        // console.log(this.sceneList);
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(undefined,"1",item)
        })
        // this.$Modal.confirm({
        //   title: '是否确认执行?',
        //   content: '当前选中为' + this.form.sceneId + '的数据',
        //   onOk() {
        //     return execScence(id).then((res) => {
        //       if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
        //         this.$message.success('执行成功，跳转至Jenkins控制台！', 3)
        //         setTimeout(() => {
        //           window.open(res.data.consoleUrl)
        //         }, 1000)
        //       } else {
        //         this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
        //       }
        //     }).catch((error) => {
        //       this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
        //     })
        //   },
        //   onCancel() { }
        // })
      } else if (item.name === '远程调试') {
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(undefined,"1",item)
        })
      } else if (item.name === '查看日志') {
        return getScenceInfo(id).then((res) => {
          const debugRecordList = res.data.debugRecord?JSON.parse(res.data.debugRecord) : []
          if (debugRecordList.length > 0 && debugRecordList[0].consoleUrl !== undefined) {
            this.$message.success('获取运行日志成功！', 3)
            setTimeout(() => {
              window.open(debugRecordList[0].consoleUrl)
            }, 1000)
          } else {
            this.$message.error('获取运行日志失败，请先执行场景！', 3)
          }
        }).catch((error) => {
          this.$message.error('接口请求失败，请稍后重试！', 3)
        })
      } else if (item.name === '查看报告') {
        return getScenceInfo(id).then((res) => {
          const debugRecordList = res.data.debugRecord?JSON.parse(res.data.debugRecord) : []
          if (debugRecordList.length > 0 && debugRecordList[0].testReportUrl !== undefined) {
            this.$message.success('获取测试报告成功！', 3)
            setTimeout(() => {
              window.open(debugRecordList[0].testReportUrl)
            }, 1000)
          } else {
            this.$message.error('获取测试报告失败，请先执行场景！', 3)
          }
        }).catch((error) => {
          this.$message.error('接口请求失败，请稍后重试！', 3)
        })
      }else if (item.name === '查看回放') {
        return getScenceInfo(id).then((res) => {
          const debugRecordList = res.data.debugRecord?JSON.parse(res.data.debugRecord) : []
          if (debugRecordList.length > 0 && debugRecordList[0].testReportUrl !== undefined) {
            this.$message.success('获取测试回放成功！', 3)
            setTimeout(() => {
              window.open(debugRecordList[0].testReportUrl.replace('/index.html', '/video/'+record.sceneId+'.mp4'))
            }, 1000)
          } else {
            this.$message.error('获取测试回放失败，请先执行场景！', 3)
          }
        }).catch((error) => {
          this.$message.error('接口请求失败，请稍后重试！', 3)
        })
      }
    },
    // 添加场景变量
    addVariant() {
      this.showModal = true
      this.$nextTick(() => {
        this.$refs.variantForm.handleAdd()
      })
    },
    getVariantCount(list) {
      this.variantCount = list.length
      this.variantList = list
    },
    // 提交场景
    submitForm() {
      // 把所有的组件表单内容合并在stepList中并且提交
      this.$refs.sceneForm.validate((valid) => {
        if (valid) {
          const { id, sceneId, projectId, versionName, level, name, moduleId, status, tags, principalId, description } = this.form
          const jsonTags = []
          this.tags.map((item) => {
            jsonTags.push(item.text)
          })
          this.form.tags = JSON.stringify(jsonTags)
          // const params = {
          //   id,
          //   sceneId,
          //   projectId,
          //   versionName,
          //   level,
          //   name,
          //   moduleId,
          //   status,
          //   tags: JSON.stringify(jsonTags),
          //   principalId,
          //   description,
          //   caseTotal,
          //   casePass,
          //   caseFail,
          //   caseSkip,
          //   passRate: '0%',
          //   executeResult: '不通过',
          //   stepTotal,
          //   stepPass,
          //   stepFail,
          //   stepSkip
          // }
          // console.info(this.form)

          if (this.form.id || this.saveId) {
            const id = this.form.id ? this.form.id : this.saveId
            // 调用编辑接口
            editScenceList({ ...this.form, id }).then((response) => {
              this.$message.success('修改成功')
              this.$emit('onSave', { ...this.form, id })
            })
          } else {
            // 调用新增接口
            addScenceList(this.form).then((response) => {
              const { id } = response.data
              this.saveId = id // 获取用户保存后的id，用于当前页面编辑
              this.onSave = true // 判断用户是否点击保存基本信息
              this.$message.success('保存成功')
              this.$emit('onSave', { ...this.form, id })
            })
          }
        } else {
          this.$message.info('请检查必填项')
          this.activeKey = '1'
          return false
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
@import '../automation.less';

.operation {
  float: right;
  .icon {
    // color: #8097ff;
    // margin-right: 8px;
  }
}

.ui-card {
  height: calc(84vh - 30px)
}

::v-deep .ant-tree-title {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 30px;
}

.tree-title {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.tree-name {
  display: inline-block;
  width: 97%;
  overflow: hidden;
  white-space: nowrap;
  /*不换行*/
  text-overflow: ellipsis;
  /*超出部分文字以...显示*/
}

.tree-title-name {
  font-weight: 700;
}

// ::v-deep .ant-tabs-tabpane {
//   height:calc(75vh - 30px);
//   overflow-y: auto;
//   overflow-x: hidden;
// }
.ui-step-list {
  height: calc(70vh - 30px);
  overflow-y: auto;
  overflow-x: hidden;
}

::v-deep .ti-tag {
  background-color: #3356e8 !important;
}
</style>
