<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="840" @cancel="cancel" modalHeight>
    <div slot="content">
      <a-form-model :model="form" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
        class="add-step-form">
        <a-form-model-item label="复制到的项目" prop="projectId">
          <a-select v-model="form.projectId" placeholder="请选择项目" style="width: 400px" option-filter-prop="children"
            allowClear>
            <a-select-option v-for="(item, index) in projectOptions" :key="index" :value="item.id"
              @click="onChangeProject(item)">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="复制到的版本" prop="versionId">
          <a-select v-model="form.versionId" placeholder="请选择版本" style="width: 400px" option-filter-prop="children"
            allowClear>
            <a-select-option v-for="(item, index) in changeVersionOptions" :key="index" :value="item.id"
              @click="onChangeVersion(item)">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-tooltip placement="right" :autoAdjustOverflow="false">
            <template slot="title">
              复制原版本并保留模块和等级，前提是要从原有项目场景版本进行复制，因为不同的版本对应模块结构会不同
            </template>
            <a-tag style="margin-left: 8px;" color="#108ee9" @click="addVersion"> 复制版本/保留模块和等级 </a-tag>
          </a-tooltip>
        </a-form-model-item>
        <a-form-model-item label="复制到的模块" prop="moduleName">
          <!-- <a-tree-select v-model="form.moduleId" style="width: 400px"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择模块" :treeData="changeTreeData"
            tree-default-expand-all :expandedKeys="expandedKeys" @expand="handleExpand" :replaceFields="replaceFields"
            allowClear>
          </a-tree-select> -->
          <el-select size="small" style="width: 400px;" ref="selectTree" v-model="form.moduleName" placeholder="请选择模块"
            filterable :filter-method="filterText" @focus="handleFocus">
            <!-- <el-option 
                v-for="item in optionData(changeTreeData)" 
                :label="item.name" 
                :value="item.id"
                style="display: none;"/> -->
            <el-option style="height: 100%; padding: 0;" value="">
              <el-tree style="font-weight: normal;width: 400px;" :data="changeTreeData" :props='treeProps'
                highlight-current default-expand-all show-checkbox check-strictly check-on-click-node node-key="id"
                :default-checked-keys="expandedKeys" :filter-node-method="filterNode"
                :expand-on-click-node="expandOnClickNode" @check="handleNodeClick" ref="tree" />
            </el-option>
          </el-select>
        </a-form-model-item>
        <a-form-model-item label="复制到的等级" prop="level">
          <a-select v-model="form.level" placeholder="请选择等级" style="width: 400px" option-filter-prop="children"
            allowClear>
            <a-select-option v-for="(item, index) in levelOptions" :key="index" :value="item.id">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-show="isVisible" label="新场景ID" prop="sceneId">
          <a-input v-model="form.sceneId" placeholder="请输入场景ID" style="width: 400px" allowClear />
        </a-form-model-item>
        <a-form-model-item v-show="isVisible" label="新场景名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入场景名称" style="width: 400px" allowClear />
        </a-form-model-item>
      </a-form-model>
      <ConfigDataAddOrEdit v-if="showAddModal" :environment_Id="environmentId" ref="ConfigDataAddOrEdit" @ok="ok"
        @close="close" />
    </div>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm"> 确定 </a-button>
      <a-modal title="是否确认复制以下场景?" v-model:open="showDialog" width="840px" :confirm-loading="confirmLoading"
        @ok="handleOk" @close="closeModal">
        <div style="height: 550px">
          <advance-table style="margin-top: -10px" :scroll="{ x: '100%', y: 420 }" :columns="sceneColumns"
            :data-source="pagedData" :loading="loading" rowKey="id" bordered size="middle" title="测试场景列表">
          </advance-table>
          <a-pagination style="float: right;margin-top: 10px;" size="small" :current="currentPage" :total="totalItems"
            :pageSize="pageSize" :showTotal="(total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`"
            :pageSizeOptions="['10', '20', '30', '40', '50']" :showSizeChanger=true :showLessItems=true
            :showQuickJumper=true @showSizeChange="handleShowSizeChange" @change="handlePageChange">
          </a-pagination>
        </div>
      </a-modal>
    </template>
  </ant-modal>
</template>

<script>
import AntModal from '@/components/pt/dialog/AntModal'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import ConfigDataAddOrEdit from '@/views/project/environmentConfig/modules/ConfigDataAddOrEdit.vue'
import * as automationApis from '@/api/ui'
import * as projectApis from '@/api/project'
import { levelOptions } from '@/utils/options'
import { sceneColumns } from './EnvConfig'

export default {
  name: 'OperationC',
  components: { AntModal, AdvanceTable, ConfigDataAddOrEdit },
  props: {
    projectOptions: {
      type: Array,
    },
    environment_Id: {
      type: String,
    },
    versionOptions: {
      type: Array,
      required: true
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
      confirmLoading: false,
      showDialog: false,
      loading: false,
      sysSceneList: [],
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      open: false,
      isVisible: false,
      formTitle: '',
      changeTreeData: [],
      expandedKeys: [],
      autoExpandParent: true,
      changeVersionOptions: [],
      levelOptions,
      showAddModal: false,
      version: {},
      copyVersion: false,
      environmentId: '',
      versionId: '',
      moduleId: '',
      batchStatus: false,
      projectId: '',
      form: {
        id: '',
        projectId: '',
        projectName: '',
        moduleId: '',
        moduleName: '',
        versionId: '',
        versionName: '',
        level: '',
        sceneId: '',
        name: ''
      },
      expandOnClickNode: false,
      treeProps: {
        children: 'children',
        label: 'name',
        key: 'name',
      },
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id',
        value: 'id',
      },
      rules: {
        projectId: [{ required: true, message: '复制到的项目不能为空', trigger: 'blur' }],
        versionId: [{ required: true, message: '复制到的版本不能为空', trigger: 'blur' }],
        moduleName: [{ required: true, message: '复制到的模块不能为空', trigger: 'blur' }],
        level: [{ required: true, message: '复制到的等级不能为空', trigger: 'blur' }],
        // sceneId: [{ required: true, message: '新场景ID不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '新场景名称不能为空', trigger: 'blur' }]
      },
    }
  },
  computed: {
    totalItems() {
      return this.sysSceneList.length
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.sysSceneList.slice(start, end)
    },
  },
  created() {

  },
  watch: {
    'form.projectId': {
      handler(val) {
        // console.log('val: ' + val)
        // this.getTreeData()
      },
      immediate: true
    },
  },
  mounted() {
    // this.expandAll()
  },
  methods: {
    /** 复制操作 */
    handleAdd(record) {
      this.open = true
      this.formTitle = '复制测试场景'
      this.environmentId = this.environment_Id
      this.changeVersionOptions = this.versionOptions
      this.sysSceneList = this.sceneList
      if (record.sceneId) {
        this.isVisible = true
        this.copyVersion = false
        this.batchStatus = false
        this.form = Object.assign(this.form, record)
        this.sysSceneList = []
        this.sysSceneList.push(record)
        this.projectId = this.form.projectId
        this.versionId = this.form.versionId
        this.moduleId = this.form.moduleId
        this.getTreeData()
      } else {
        this.isVisible = false
        this.copyVersion = false
        this.batchStatus = true
        this.form = Object.assign(this.form, this.sysSceneList[0])
        this.projectId = this.form.projectId
        this.versionId = this.form.versionId
        this.moduleId = this.form.moduleId
        this.getTreeData()
        this.form.moduleId = undefined
        this.form.moduleName = undefined
        this.form.level = undefined
        this.form.sceneId = undefined
        this.form.name = undefined
        // this.form.projectId = this.sysSceneList[0].projectId
        // this.form.versionId = this.sysSceneList[0].versionId
        // this.getTreeData()
        // this.form.moduleId = undefined
        // this.form.moduleName = undefined
        // this.form.level = undefined
        // this.form.sceneId = undefined
        // this.form.name = undefined
      }
      this.changeVersionOptions.forEach(item => {
        if (this.form.versionName === item.name) {
          this.version = item
        }
      })
    },
    // 项目选择发生变化
    onChangeProject(item) {
      this.form.projectId = item.id
      this.form.projectName = item.abbreviate
      this.form.moduleName = undefined
      this.copyVersion = false
      this.getAllVersions()
    },
    // 获取当前项目环境下的所有版本
    getAllVersions() {
      const queryParam = {
        projectId: this.form.projectId
      }
      projectApis.getEnvironmentList(queryParam).then((response) => {
        for (let environment of response.data.list) {
          if (environment.status === 1) {
            this.environmentId = environment.id
            var versionList = JSON.parse(environment.versionConfig)
            this.changeVersionOptions = []
            for (let version of versionList) {
              if (version.delFlag === 0) {
                this.changeVersionOptions.push(version)
                if (this.copyVersion) {
                  if (version.name === this.form.versionName) {
                    this.form.versionId = version.id
                  }
                } else {
                  if (version.status === 1) {
                    this.form.versionId = version.id
                    this.form.versionName = version.name
                    this.version = version
                  }
                }
              }
            }
            this.getTreeData()
            break
          }
        }
      })
    },
    onChangeVersion(version) {
      this.copyVersion = false
      this.version = version
      this.form.versionId = version.id
      this.form.versionName = version.name
      if (this.versionId !== version.id) {
        this.form.moduleId = this.moduleId + "_" + version.name
      } else {
        this.form.moduleId = this.moduleId
      }
      this.form.moduleName = undefined
      this.getTreeData()
    },
    addVersion() {
      // console.log(this.versionId);
      // console.log(this.form.versionId);
      if (this.versionId === this.form.versionId) {
        this.showAddModal = true
        this.$nextTick(() => (
          this.$refs.ConfigDataAddOrEdit.handleCopy(this.version, 1)
        ))
      } else {
        this.$message.info('复制的场景原始所属项目和版本和当前版本不匹配，无法保留原模块')
      }
    },
    close() {
      // console.log("close");
      this.showAddModal = false
      // this.getAllVersions()
      // this.$emit('getList')
    },
    ok(version) {
      this.form.versionName = version.name
      this.form.versionId = version.id
      // this.form.moduleId = this.moduleId + "_" + version.name
      this.copyVersion = true
      this.getAllVersions()
      this.$emit('getList')
    },
    getTreeData() {
      automationApis.getUiNode(this.form.projectId, this.form.versionId).then((response) => {
        this.changeTreeData = response?.data || {}
        const setting = {
          iconDisabled: true,
        }
        this.changeTreeData = [{ ...this.changeTreeData, ...setting }]
        // this.form.moduleId = this.form.moduleId==''?this.changeTreeData[0].id:this.form.moduleId
        // this.changeTreeData.forEach((node) => {
        //   this.getAllChildren(node);
        // })
        for (const node of this.changeTreeData) {
          if (this.getAllChildren(node)) {
            break
          }
        }
        if (this.batchStatus) {
          this.form.moduleName = undefined
          this.form.level = undefined
        }
        if (this.copyVersion) {
          // console.log(this.projectId);
          // console.log(this.form.projectId);
          // if (this.projectId === this.form.projectId) {
          //   this.form.moduleName = '保留原模块'
          //   this.form.level = '保留原等级'
          // } else {
          //   this.$message.info('复制的场景原始所属项目和版本和当前版本来源不匹配，无法保留原模块')
          //   this.form.moduleName = undefined
          //   this.form.level = '保留原等级'
          // }
          this.form.moduleId = undefined
          this.form.moduleName = '保留原模块'
          this.form.level = '保留原等级'
        }
      })
    },
    getAllChildren(node) {
      if (node.id === this.form.moduleId) {
        this.form.moduleName = node.name
        this.$refs.tree.setCheckedKeys([this.form.moduleId]);
        return true
      } else if (node.children) {
        node.children.forEach(child => {
          this.getAllChildren(child)
        })
      }
    },
    handleExpand(keys) {
      // 当节点展开或收起时触发该方法
      this.expandedKeys = keys;
      // console.log(this.expandedKeys);
    },
    expandAllChildren(node) {
      // 递归遍历节点的子节点并添加到expandedKeys数组中
      this.expandedKeys.push(node.id);
      if (node.children) {
        node.children.forEach(child => {
          this.expandAllChildren(child);
        });
      }
      // console.log(this.expandedKeys);
    },
    expandAll() {
      // 展开全部子节点
      this.changeTreeData.forEach(node => {
        this.expandAllChildren(node);
      });
    },
    expandAllNodes() {
      const allKeys = []
      this.getAllNodeKeys(this.changeTreeData, allKeys)
      this.expandedKeys = allKeys
    },
    getAllNodeKeys(nodes, keys) {
      for (const node of nodes) {
        keys.push(node.id);
        if (node.children) {
          this.getAllNodeKeys(node.children, keys)
        }
      }
    },
    /**
     * 树形转平面的迭代方法
     * option 1的el-option需要此方法绑定数据
     */
    optionData(array, result = []) {
      // console.log(array);
      array.forEach(item => {
        result.push({ id: item.id, name: item.name })
        // console.log(result);
        if (item.children && item.children.length !== 0) {
          this.optionData(item.children, result)
        }
      })
      return JSON.parse(JSON.stringify(result))
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
      this.form.moduleId = node.id;
      this.form.moduleName = node.name;
      this.$refs.tree.setCheckedKeys([node.id]);
      this.$refs.selectTree.blur();
    },
    handleNodeClick1(nodeData) {
      this.form.moduleId = nodeData.id; // 更新当前选中的节点ID
      // 遍历树数据，重置除当前选中节点外的所有节点的选择状态
      const resetSelection = (data) => {
        data.forEach((node) => {
          if (node.id !== this.form.moduleId) {
            this.$refs.tree.setChecked(node, false);
          }
          if (node.children) {
            resetSelection(node.children);
          }
        });
      };
      resetSelection(this.changeTreeData);
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleShowSizeChange(currentPage, pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
    },
    // 表单重置
    reset() {
      this.$refs.form?.resetFields()
    },
    // 取消
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 确定
    submitForm() {
      // console.log(this.form);
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.showDialog = true
        } else {
          this.$message.info('请检查必填项')
          return false
        }
      })
    },
    handleOk() {
      this.confirmLoading = true
      let params = {
        ...this.form,
        sysSceneList: this.sysSceneList,
      }
      automationApis.copySence(params).then((response) => {
        this.$message.success('复制成功')
        this.open = false
        this.showDialog = false
        this.confirmLoading = false
        this.$emit('getList')
      }).catch((error) => {
        this.$message.error('复制失败，请检查后重试！', error)
        this.showDialog = false
        this.confirmLoading = false
      })
      // if(this.sysSceneList.length>1){
      //   automationApis.copySenceAll(params).then((response) => {
      //     this.$message.success('复制成功')
      //     this.open = false
      //     this.showDialog = false
      //     this.confirmLoading = false
      //     this.$emit('getList')
      //     // this.cancel()
      //   }).catch((error) => {
      //     this.$message.error('复制失败，请检查后重试！')
      //     this.showDialog = false
      //     this.confirmLoading = false
      //   })
      // }else{
      //   automationApis.copySence(params).then((response) => {
      //     this.$message.success('复制成功')
      //     this.open = false
      //     this.showDialog = false
      //     this.confirmLoading = false
      //     this.$emit('getList')
      //   }).catch((error) => {
      //     this.$message.error('复制失败，请检查后重试！', error)
      //     this.showDialog = false
      //     this.confirmLoading = false
      //   })
      // }
    },
    closeModal() {
      this.showDialog = false
    },
  },
}
</script>

<style lang="less" scoped>
.configForm {
  .ant-btn-circle {
    width: 30px;
    border-radius: 50%;
    min-width: 0;
    padding: 0 7px;
    line-height: 18px;
    text-align: center;
  }
}

.add-step-form {
  margin-left: 30px;

  ::v-deep .ant-form-item-label {
    margin-right: 10px;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>