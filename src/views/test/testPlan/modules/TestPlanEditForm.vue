<template>
  <ant-modal
    modalWidth="600"
    modalHeight="480"
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    @cancel="cancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      slot="content"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="计划名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="计划简称" prop="abbreviate">
        <a-input v-model="form.abbreviate" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="计划成员" prop="memberIds">
        <a-select mode="multiple" v-model="form.memberIds" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="计划责任人" prop="principalName">
        <a-select mode="multiple" v-model="form.principalName" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="计划类型" prop="type">
        <a-select mode="multiple" v-model="form.type" placeholder="请选择" option-filter-prop="children">
          <a-select-option v-for="(d, index) in testPlanTypeOptions" :key="index" :value="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="计划时间" prop="planTime">
        <a-range-picker v-model="form.planTime" :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" @change='change' @ok="onOk" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="计划描述" prop="description">
        <a-input v-model="form.description" placeholder="请输入" type="textarea" allow-clear :rows="2" />
      </a-form-model-item>
      <a-form-model-item label="启用状态">
        <a-switch v-model="switchStatus" @change="onchange" />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm">
        {{ this.okButton }}
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
import TestPlanForm from './TestPlanForm'
export default {
  ...TestPlanForm,
}
</script>