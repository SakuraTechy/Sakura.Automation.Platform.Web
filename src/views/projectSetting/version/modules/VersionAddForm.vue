<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    modalWidth="640"
    @cancel="cancel"
    modalHeight="620"
  >
    <a-form-model ref="form" :model="form" :rules="rules" slot="content" layout="vertical">
      <a-form-model-item label="版本" prop="versionName">
        <a-input v-model="form.versionName" placeholder="请输入版本名称" />
      </a-form-model-item>
      <a-form-model-item label="">
        <a-checkbox v-model="currentChecked">
          设置为最新版本
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item label="所属项目" prop="projectId">
        <a-select v-model="form.projectId" placeholder="请选择项目" option-filter-prop="children">
          <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="d.id">
            {{ d.projectName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="描述" prop="description">
        <a-textarea placeholder="请输入描述" :auto-size="{ minRows: 2, maxRows: 6 }" v-model="form.description"/>
      </a-form-model-item>
      <a-form-model-item label="发布时间" prop="publishTime">
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择发布时间"
          show-time
          v-model="form.publishTime"
        />
      </a-form-model-item>
      <a-form-model-item label="开始时间" prop="startTime">
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          show-time
          placeholder="请选择开始时间"
          v-model="form.startTime"
        />
      </a-form-model-item>
      <a-form-model-item label="结束时间" prop="endTime">
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          show-time
          placeholder="请选择结束时间"
          v-model="form.endTime"
        />
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
import versionForm from './Version'
export default {
  ...versionForm
}
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: 100%;
}
</style>
