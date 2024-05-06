<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="800" @cancel="cancel"
    modalHeight="200">
    <div slot="content">
      <a-form-model :model="form" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
        class="add-step-form">
        <a-form-model-item label="新场景用例ID" prop="sysSceneCase.id" :rules="rules.id">
          <a-input v-model="form.sysSceneCase.id" style="width: 420px" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="新场景用例名称" prop="sysSceneCase.name" :rules="rules.name">
          <a-input v-model="form.sysSceneCase.name" style="width: 420px" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item label="新场景用例备注" prop="sysSceneCase.remark" :rules="rules.remark">
          <a-input v-model="form.sysSceneCase.remark" style="width: 420px" placeholder="请输入" />
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
import { copyCase } from '@/api/ui'

export default {
  name: 'OperationC',
  components: { AntModal },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      open: false,
      formTitle: '',
      form: {
        id: '',
        sysSceneCase: {
          id: '',
          name: '',
          remark: '',
          copyId: ''
        }
      },
      rules: {
        copyId: [{ required: true, message: '用例ID不能为空', trigger: 'blur' }],
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
    handleAdd(row) {
      console.log(row);
      this.form.id = row.id
      this.form.sysSceneCase.id = row.name
      this.form.sysSceneCase.name = row.name
      this.form.sysSceneCase.remark = row.remark
      this.form.sysSceneCase.copyId = row.sceneId
      this.open = true
      this.formTitle = '复制用例'
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 调用复制接口
          copyCase(this.form).then((response) => {
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
