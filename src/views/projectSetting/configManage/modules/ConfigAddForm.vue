<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    modalWidth="1000"
    @cancel="cancel"
    modalHeight="450"
  >
    <a-form-model ref="form" :model="form" :rules="rules" slot="content" layout="vertical">
     <a-form-model-item label="配置名称" prop="configName">
        <a-input v-model="form.configName" placeholder="请输入" />
      </a-form-model-item>
       <a-form-model-item label="配置参数" prop="paramsName">
        <a-input v-model="form.paramsName" placeholder="请输入" />
      </a-form-model-item>
       <a-form-model-item label="配置值" prop="paramsValue">
        <a-input v-model="form.paramsValue" placeholder="请输入" />
      </a-form-model-item>
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
import configForm from './Config'
export default {
  ...configForm
}
</script>
<style lang="less" scoped>
</style>
