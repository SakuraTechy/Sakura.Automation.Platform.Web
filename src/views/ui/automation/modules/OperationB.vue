<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="900" @cancel="cancel"
    modalHeight="600">
    <div slot="content">
      <a-form-model :model="form.sysSceneCase" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
        class="add-step-form">
        <a-form-model-item label="场景用例ID" prop="id">
          <a-input v-model="form.sysSceneCase.id" style="width: 420px" :disabled="editType" placeholder="请输入"
            allow-clear />
        </a-form-model-item>
        <a-form-model-item label="新场景用例ID" prop="copyId" v-if="showCopy">
          <a-input v-model="form.sysSceneCase.copyId" style="width: 420px" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="场景用例名称" prop="name">
          <a-input v-model="form.sysSceneCase.name" style="width: 420px" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="场景用例备注" prop="remark">
          <a-textarea v-model="form.sysSceneCase.remark" placeholder="请输入" style="width: 420px" auto-size allow-clear />
        </a-form-model-item>
        <a-form-model-item label="场景用例排序" prop="sortType">
          <a-select v-model="form.sortType" placeholder="请选择排序类型" style="width: 420px" option-filter-prop="children"
            @change="onSortChange">
            <a-select-option v-for="(d, index) in sortOptions" :key="index" :value="d.value">
              <span>{{ d.label }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="当前用例序号" prop="order" v-if="showSort">
          <a-input v-model="form.sysSceneCase.order" style="width: 200px" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="目标用例序号" prop="itemOrder" v-if="showSort">
          <a-input v-model="form.itemOrder" style="width: 200px" placeholder="请输入" allow-clear />
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
import { sortOptions } from '@/utils/options'
import AntModal from '@/components/pt/dialog/AntModal'
import { getSenceCaseList, addScenceCaseList, getSenceCaseInfo, editScenceCaseList, copySenceCaseList } from '@/api/ui'
export default {
  name: 'OperationB',
  components: { AntModal },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      showCopy: false,
      showSort: false,
      open: false,
      editType: false,
      submitType: '',
      formTitle: '',
      sortOptions,
      form: {
        id: '',
        sortType: 0,
        itemOrder: 1,
        sysSceneCase: {
          id: '',
          copyId: '',
          name: '',
          order: 1,
          cancel: true,
          remark: ''
        },
      },
      rules: {
        id: [{ required: true, message: '场景ID不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '场景名称不能为空', trigger: 'blur' }],
        copyId: [{ required: true, message: '新场景ID不能为空', trigger: 'blur' }]
      },
    }
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
    onSortChange(value) {
      if (value === 0) {
        this.showSort = false
      } else {
        this.showSort = true
      }
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.form.id = row.id
      this.form.sysSceneCase.id = ''
      this.open = true
      this.formTitle = '新增场景用例'
      this.editType = false
      this.showCopy = false
      this.submitType = 'add'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.formTitle = '编辑场景用例'
      this.submitType = 'edit'
      this.reset()
      this.editType = true
      this.showCopy = false
      this.open = true
      this.form.sortType = 0
      this.showSort = false
      const params = { id: row.id, sysSceneCase: { id: row.caseId } }
      getSenceCaseInfo(params).then((response) => {
        this.form.id = row.id
        // const { id, name, order, cancel, remark } = response.data
        // this.form.sysSceneCase = { id, name, order, cancel, remark }
        this.form.sysSceneCase.id = response.data.id
        this.form.sysSceneCase.name = response.data.name
        this.form.sysSceneCase.order = response.data.order
        this.form.sysSceneCase.remark = response.data.remark
        this.form.sysSceneCase.cancel = response.data.cancel
      })
    },
    /** 复制按钮操作 */
    handleCopy(row) {
      this.formTitle = '复制场景用例'
      this.submitType = 'copy'
      // this.reset()
      this.open = true
      this.editType = true
      this.showCopy = true
      this.form.sortType = 0
      this.showSort = false
      // this.form.itemOrder=
      // this.form.id = row.id
      // this.form.sysSceneCase.id = row.caseId
      this.form.sysSceneCase.copyId = row.caseId
      const params = { id: row.id, sysSceneCase: { id: row.caseId } }
      getSenceCaseInfo(params).then((response) => {
        this.form.id = row.id
        // const { id, name, order, cancel, remark } = response.data
        // this.form.sysSceneCase = { id, name, order, cancel, remark }
        // this.form.sysSceneCase.copyId = id
        this.form.sysSceneCase.id = response.data.id
        this.form.sysSceneCase.name = response.data.name
        // this.form.sysSceneCase.order = response.data.order
        this.form.sysSceneCase.remark = response.data.remark
        this.form.sysSceneCase.cancel = response.data.cancel
        getSenceCaseList(this.form.id).then((response) => {
          const { caseMsg } = response.data
          const caseList = caseMsg ? JSON.parse(caseMsg) : []
          this.form.sysSceneCase.order = caseList.length+1
        })
      })

    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          switch (this.submitType) {
            case 'add':
              // 调用新增接口
              addScenceCaseList(this.form).then((response) => {
                this.$message.success('新增用例成功')
                this.open = false
                const { id: activeId } = this.form.sysSceneCase
                this.$emit('updateStepList', activeId)
              })
              break
            case 'edit':
              // 调用编辑接口
              editScenceCaseList(this.form).then((response) => {
                this.$message.success('编辑用例成功')
                this.open = false
                const { id: activeId } = this.form.sysSceneCase
                this.$emit('updateStepList', activeId)
              })
              break
            case 'copy':
              // 调用复制接口
              copySenceCaseList(this.form).then((response) => {
                this.$message.success('复制用例成功')
                this.open = false
                this.form.sysSceneCase.id = response.data.id
                const { id: activeId } = this.form.sysSceneCase
                this.$emit('updateStepList', activeId)
              })
              break
          }
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