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
        确 定
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
import AntModal from '@/components/pt/dialog/AntModal'
import SelectTree from '@/components/pt/selectTree/index.vue'
export default {
  name: 'CreateForm',
  props: {
    locateTypeOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    AntModal,
    SelectTree
  },
  data () {
    return {
      loading: false,
      formTitle: '',
      // 表单参数
      form: {
        id: '',
        module: '',
        elementName: '',
        locateType: null,
        locate: '',
        remark: ''
      },
      open: false,
      rules: {
        elementName: [{ required: true, message: '元素名称不能为空', trigger: 'blur' }],
        module: [{ required: true, message: '所属模块不能为空', trigger: 'blur' }],
        locateType: [{ required: true, message: '请选择定位类型', trigger: 'blur' }],
        locate: [{ required: true, message: '元素定位不能为空', trigger: 'blur' }]
      }
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    changeTreeData(value) {
      this.form.module = value
     },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset () {
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '创建元素'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
        this.reset()
        this.open = true
        this.formTitle = '修改元素'
        this.form = Object.assign(this.form, row)
        this.$nextTick(() => { this.$refs.selectTree.handleValue(row.module) })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
              this.$message.success(
                '修改成功',
                3
              )
              this.open = false
              this.$emit('ok')
          } else {
              this.$message.success(
                '新增成功',
                3
              )
              this.open = false
              this.$emit('ok')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
