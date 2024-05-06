<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    modalWidth="800"
    @cancel="cancel"
    modalHeight="200"
  >
    <div slot="content">
      <a-form-model
        :model="form"
        ref="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="add-step-form"
      >
        <a-form-model-item label="复制到场景用例" prop="copyPid">
          <a-select
            v-model="form.copyPid"
            placeholder="请选择场景用例"
            style="width: 320px"
            option-filter-prop="children"
          >
            <a-select-option v-for="(d, index) in copyCaseList" :key="index" :value="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
         </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm"> 确定 </a-button>
    </template>
  </ant-modal>
</template>

<script>
import AntModal from '@/components/pt/dialog/AntModal'
import { copyStep } from '@/api/ui'

export default {
  name: 'OperationC',
  components: { AntModal },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      open: false,
      formTitle: '',
      copyCaseList:[],
      form: {
        id:'',
        step: {
          id:'',
          pid:'',
        },
        copyId:'',
        copyPid:''
      },
      rules: {
        copyPid: [{ required: true, message: '复制到场景用例不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset() {
      this.$refs.form?.resetFields()
    },
    /** 复制操作 */
    handleAdd(row,stepList) {
      this.copyCaseList = stepList.map(item => ({name:item.name,id:item.id}))
      this.form.id = row.id
      this.form.step.id = row.stepId
      this.form.step.pid = row.stepPid
      this.open = true
      this.formTitle = '复制步骤'
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.copyId = this.uuidv1()
            // 调用复制接口
          copyStep(this.form).then((response) => {
            this.$message.success('复制成功')
            this.open = false
            this.$emit('updateStepList')
          }) 
        } else {
          this.$message.info('请检查必填项')
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.configForm {
  .ant-btn-circle {
    width: 30px;
    border-radius: 50%;
    min-width: 0;
    padding: 0 7px;
    line-height: 18px;
    text-align: center;
  }
}
.add-step-form {
  margin-left: 30px;
  ::v-deep .ant-form-item-label {
    margin-right: 10px;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
