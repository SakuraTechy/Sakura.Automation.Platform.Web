<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="false"
    modalWidth="1000"
    @cancel="cancel"
    modalHeight="600"
  >
    <template slot="content">
      <div class="content-table">
        <advance-table
          :columns="columns"
          :data-source="list"
          title=" "
          rowKey="id"
          size="middle"
          tableKey="ui-variant-index-table"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :format-conditions="true"
        >
          <div slot="button">
            <a-button size="small" type="danger" @click="handledelete()" :disabled="multiple">
              <a-icon type="delete" />删除
            </a-button>
          </div>
        </advance-table>
      </div>
      <div class="content-form">
        <a-form-model :model="form" :label-col="labelCol" ref="form" :rules="rules" :wrapper-col="wrapperCol">
          <a-form-model-item label="变量名" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="描述" prop="remark">
            <a-textarea placeholder="请输入" :auto-size="{ minRows: 3, maxRows: 5 }" v-model="form.remark" :disabled="form.name===''"/>
          </a-form-model-item>
          <a-form-model-item label="值" prop="value" >
            <a-input v-model="form.value" :disabled="form.name===''" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 9, offset: 16 }">
            <a-button type="primary" @click="addVariant"> 添 加 </a-button>
            <a-button style="margin-left: 10px" @click="reset"> 取 消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </template>
    <template slot="footer">
      <div></div>
    </template>
  </ant-modal>
</template>
<script>
import AntModal from '@/components/pt/dialog/AntModal'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
export default {
  name: 'Variant',
  components: { AntModal, AdvanceTable },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      formTitle: '',
      selectedRowKeys: [],
      selectedRows: [],
      multiple: true,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '变量名',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center'
        },
        {
          title: '值',
          dataIndex: 'value',
          align: 'center'
        }
      ],
      list: [],
      ids: [],
      form: {
        name: '',
        remark: '',
        value: '',
        type: '常量'
      },
      open: false,
      rules: {
        name: [{ required: true, message: '变量名不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    cancel() {
      this.open = false
      this.$emit('close', this.list)
    },
    handleAdd() {
      this.open = true
      this.formTitle = '场景变量'
    },
    reset() {
      this.form = {
        name: '',
        remark: '',
        value: '',
        type: '常量'
      }
    },
    // 批量删除
    handledelete() {
      const list = this.list
      this.ids.map((id) => {
        list.map((item, index) => {
          if (id === item.id) {
            this.list.splice(index, 1)
          }
        })
      })
      this.list.map((item, index) => {
        item.id = index + 1
      })
    },
    // 添加常量
    addVariant() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const id = (this.list.length + 1).toString()
          this.list.push({
            ...this.form,
            id
          })
          this.reset()
        } else {
          return false
        }
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map((item) => item.id)
      this.multiple = !selectedRowKeys.length
    }
  }
}
</script>

<style lang="less" scoped>
.content-table {
  float: left;
  width: 50%;
  height: 100%;
  margin-right: 10px;
}
.content-form {
  float: left;
  margin-top: 50px;
  width: 48%;
  height: 100%;
}
</style>
