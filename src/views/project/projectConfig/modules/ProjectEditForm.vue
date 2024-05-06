<template>
  <a-drawer
    width="35%"
    :title="formTitle"
    :label-col="4"
    :wrapper-col="14"
    :visible="open"
    :maskClosable="false"
    :body-style="{height:'calc(100vh - 100px)',overflow:'auto'}"
    @close="cancel">
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="项目名称" prop="projectName">
        <a-input v-model="form.projectName" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="项目成员" prop="memberIds">
        <a-select
          mode="multiple"
          v-model="form.memberIds"
          placeholder="请选择"
          option-filter-prop="children">
          <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="项目备注" prop="remark">
        <a-input v-model="form.description" placeholder="请输入" type="textarea" :rows="2" allow-clear />
      </a-form-model-item>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" @click="submitForm">
            确定
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
import projectForm from './Project'
export default {
  ...projectForm
}
</script>
