<template>
  <ant-modal modalWidth="600" modalHeight="480" :visible="open" :modal-title="formTitle" :adjust-size="true"
    @cancel="cancel">
    <a-form-model ref="form" :model="form" :rules="rules" slot="content" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }">
      <a-form-model-item label="项目名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="项目简称" prop="abbreviate">
        <a-input v-model="form.abbreviate" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="项目成员" prop="memberIds">
        <a-select mode="multiple" v-model="form.memberIds" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="项目描述" prop="description">
        <a-input v-model="form.description" placeholder="请输入" type="textarea" allow-clear :rows="2" />
      </a-form-model-item>
      <a-form-model-item label="启用状态">
        <a-switch v-model="switchStatus" @change="onchange" />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel">
        取消
      </a-button>
      <a-button type="primary" @click="submitForm">
        {{this.okButton}}
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
import projectForm from './Project'
export default {
  ...projectForm
}
</script>
