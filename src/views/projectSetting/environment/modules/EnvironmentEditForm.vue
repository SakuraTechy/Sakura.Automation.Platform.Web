<template>
  <a-drawer
     width="50%"
    :title="formTitle"
    :label-col="3"
    :wrapper-col="14"
    :visible="open"
    :maskClosable="false"
    :body-style="{height:'calc(100vh - 100px)',overflow:'auto'}"
    @close="cancel">
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="环境名称" prop="environmentName">
        <a-input v-model="form.environmentName" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="选择项目" prop="projectIds">
        <a-select
          mode="multiple"
          v-model="form.projectIds"
          placeholder="请选择"
          option-filter-prop="children">
          <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="d.id">
            {{ d.projectName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <setting
         ref="setting"
        :labelCol="labelCol"
        :generalList="generalList"
        :sysDataBaseConfigList="sysDataBaseConfigList"
        :wrapperCol="wrapperCol"
        :serverList="serverList"
        :buttonWrapperCol="buttonWrapperCol"
        @add="addGeneral"
        @delete="deleteGeneral"
        @addDataBase ="addDataBase"
        @delDataBase="delDataBase"
        @addSever="addSever"
        @deleteSever="deleteSever"
        @changeState="changeState"
        @onChangeStatus="onChangeStatus"
      ></setting>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" @click="submitForm">
            保存
          </a-button>
          <a-button @click="cancel">
            取消
          </a-button>
        </a-space>
      </div>
    </a-form-model>
  </a-drawer>
</template>
<script>
import environmentForm from './Environment'
export default {
  ...environmentForm
}
</script>
<style lang="less" scoped>
.ant-input-number {
    width:170px
  }
</style>
