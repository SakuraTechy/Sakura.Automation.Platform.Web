<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    modalWidth="1000"
    @cancel="cancel"
    @changeSize="changeButtonSize"
    modalHeight="520"
  >
    <a-form-model ref="form" :model="form" :rules="rules" slot="content" layout="vertical">
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
        :serverList="serverList"
        :wrapperCol="wrapperCol"
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
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel">
        取消
      </a-button>
      <a-button type="primary" @click="submitForm">
        立即创建
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
import environmentForm from './Environment'
export default {
  ...environmentForm
}
</script>
<style lang="less" scoped>
</style>
