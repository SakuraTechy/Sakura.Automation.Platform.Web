<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    modalWidth="650"
    @cancel="cancel"
    modalHeight="600"
  >
    <a-form-model ref="form" :model="form" :rules="rules" slot="content" layout="vertical">
      <a-form-model-item label="元素名称" prop="elementName">
        <a-input v-model="form.elementName" placeholder="请输入"/>
      </a-form-model-item>
      <a-form-model-item label="所属模块" prop="module">
        <select-tree @changeTreeData="changeTreeData" ref="selectTree"></select-tree>
      </a-form-model-item>
      <a-form-model-item label="定位类型" prop="locateType">
        <a-select
          v-model="form.locateType"
          placeholder="请选择"
          option-filter-prop="children">
          <a-select-option v-for="(d, index) in locateTypeOptions" :key="index" :value="d.dictValue">
            {{ d.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="元素定位" prop="locate">
        <a-input v-model="form.locate" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-input
          v-model="form.remark"
          placeholder="请输入"
          type="textarea"
          allow-clear
          :rows="2"
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
import elementForm from './Element'
export default {
  ...elementForm
}
</script>
