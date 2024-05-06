<template>
  <a-drawer
    width="65%"
    :title="formTitle"
    :label-col="3"
    :wrapper-col="14"
    :visible="open"
    :maskClosable="false"
    @close="cancel"
  >
    <div v-if="environmentList.length === 0" class="project-empty">
      <Empty />
    </div>
    <div class="project-setting" v-else>
      <a-card class="project-setting-left">
        <div
          class="sider-item"
          :class="index === activeIndex ? 'active-item' : ''"
          @click="getEnvironmentInfo(item, index)"
          v-for="(item, index) in environmentList"
          :key="index"
        >
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>{{ item.environmentName }}</span>
            </template>
            <span class="environment-item-name">{{ item.environmentName }}</span>
          </a-tooltip>
          <span class="environment-item-icon"><a-icon type="delete" @click="deleteEnvironment(item, index)" /></span>
        </div>
      </a-card>
      <a-card class="project-setting-right">
        <div v-for="(item, index) in environmentList" :key="index">
          <div v-if="index === activeIndex">
            <a-form-model ref="form" :model="item" :rules="rules">
              <a-form-model-item label="环境名称" prop="environmentName">
                <a-input v-model="item.environmentName" placeholder="请输入" disabled />
              </a-form-model-item>
              <setting
                :labelCol="labelCol"
                :generalList="item.sysCommonConfigList"
                :sysDataBaseConfigList="item.sysDataBaseConfigList"
                :serverList="item.sysServerConfigList"
                :wrapperCol="wrapperCol"
                :buttonWrapperCol="buttonWrapperCol"
                :activeIndex="activeIndex"
                @add="addGeneral"
                @delete="deleteGeneral"
                @addDataBase="addDataBase"
                @delDataBase="delDataBase"
                @addSever="addSever"
                @deleteSever="deleteSever"
                @changeState="changeState"
                @onChangeStatus="onChangeStatus"
              />
            </a-form-model>
          </div>
        </div>
      </a-card>
    </div>
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="submitForm" v-show="environmentList.length > 0"> 保存 </a-button>
        <a-button @click="cancel"> 取消 </a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script>
import Setting from '../../components/Setting.vue'
import { getSettingInfo, deleteSetting, editSetting } from '@/api/project'
export default {
  name: 'ProjectSettingForm',
  components: { Setting },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      buttonWrapperCol: { span: 5, offset: 19 },
      open: false,
      formTitle: '',
      activeIndex: 0,
      projectId: '',
      environmentList: [],
      rules: {
        environmentName: [{ required: true, message: '环境名称不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 添加通用配置
    addGeneral(item, index) {
      const { environmentList, activeIndex } = this
      environmentList[activeIndex].sysCommonConfigList.push({
        id: this.uuidv1(),
        ip: '',
        domain: '',
        description: '',
        checked: '1',
      })
    },
    // 删除通用配置
    deleteGeneral(item, index) {
      const { environmentList, activeIndex } = this
      environmentList[activeIndex].sysCommonConfigList.splice(index, 1)
    },
    // 添加服务器配置
    addSever(item, index) {
      const { environmentList, activeIndex } = this
      environmentList[activeIndex].sysServerConfigList.push({
        id: this.uuidv1(),
        host: '',
        port: '',
        username: '',
        password: '',
        checked: '1',
      })
    },
    // 删除服务器配置
    deleteSever(item, index) {
      const { environmentList, activeIndex } = this
      environmentList[activeIndex].sysServerConfigList.splice(index, 1)
    },
    // 改变选择的状态
    changeState(type, item) {
      const { environmentList, activeIndex } = this
      if (type === '1') {
        environmentList[activeIndex].sysServerConfigList.map((server) => {
          server.checked = server.id === item.id ? '0' : '1'
        })
      } else {
        environmentList[activeIndex].sysCommonConfigList.map((general) => {
          general.checked = general.id === item.id ? '0' : '1'
        })
      }
    },
    // 添加数据库配置
    addDataBase(dataBaseForm) {
      const { environmentList, activeIndex } = this
      const id = this.uuidv1()
      environmentList[activeIndex].sysDataBaseConfigList.push({ ...dataBaseForm, id })
    },
    // 删除数据库配置
    delDataBase(row) {
      const { environmentList, activeIndex } = this
      const { sysDataBaseConfigList } = environmentList[activeIndex]
      environmentList[activeIndex].sysDataBaseConfigList = sysDataBaseConfigList.filter((item) => item.id !== row.id)
    },
    // 改变数据库配置状态
    onChangeStatus(row) {
      const { environmentList, activeIndex } = this
      environmentList[activeIndex].sysDataBaseConfigList.map((item) => {
        item.checked = item.id === row.id ? '0' : '1'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset() {},
    handleSetting(row, ids) {
      this.reset()
      this.open = true
      this.formTitle = '环境配置'
      this.projectId = row.id
      this.getSettingInfo(row.id)
    },
    // 获取环境配置信息
    getSettingInfo(id) {
      getSettingInfo(id).then((response) => {
        this.environmentList = response?.data || []
      })
    },
    getEnvironmentInfo(item, index) {
      this.activeIndex = index
    },
    // 删除环境配置
    deleteEnvironment(item, index) {
      var that = this
      const name = item.environmentName
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中' + name + '的数据',
        onOk() {
          return deleteSetting(that.projectId, item.id).then((response) => {
            that.$message.success('删除成功')
            that.activeIndex = 0
            that.getSettingInfo(that.projectId)
          })
        },
        onCancel() {},
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      const data = []
      this.environmentList.forEach((item, index) => {
        const { id, environmentName, sysCommonConfigList, sysDataBaseConfigList, sysServerConfigList } = item
        const { projectId } = this
        data.push({
          id,
          environmentName,
          sysCommonConfigList,
          sysDataBaseConfigList,
          sysServerConfigList,
          projectId,
        })
      })
      editSetting(data).then((response) => {
        this.$message.success('保存成功')
        this.open = false
        this.$emit('ok')
      })
    },
  },
}
</script>
<style lang="less" scoped>
.project-setting {
  display: flex;
  width: 100%;
  min-height: 100%;
  .project-setting-left {
    min-width: 135px;
    width: 15%;
    margin-right: 20px;
  }
  .project-setting-right {
    width: 85%;
    padding: 10px;
  }
}
.sider-item {
  width: 100%;
  height: 80px;
  text-align: center;
  line-height: 80px;
  cursor: pointer;
  position: relative;
  .environment-item-icon {
    position: absolute;
    top: 0;
    right: 10px;
  }
}
.active-item {
  color: #2147e6;
  background-color: #f0f5ff;
  border-right: 2px solid #2147e6;
}
.project-empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .ant-drawer-body {
  height: calc(100% - 20px);
}
.environment-item-name {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
}
</style>
