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
      <a-form-model-item label="配置名称" prop="configName">
        <a-input v-model="form.configName" placeholder="请输入" />
      </a-form-model-item>
       <a-form-model-item label="配置参数" prop="paramsName">
        <a-input v-model="form.paramsName" placeholder="请输入" />
      </a-form-model-item>
       <a-form-model-item label="配置值" prop="paramsValue">
        <a-input v-model="form.paramsValue" placeholder="请输入" />
      </a-form-model-item>
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
import configForm from './Config'
export default {
  ...configForm
}
</script>
<style lang="less" scoped>
.ant-input-number {
    width:170px
  }
</style>
