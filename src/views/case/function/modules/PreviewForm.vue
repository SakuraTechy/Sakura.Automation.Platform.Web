<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="false"
    modalWidth="900"
    @cancel="cancel"
    modalHeight="600"
  >
    <template slot="content">
      <a-page-header style="border-left: 3px solid #2147e6; padding: 2px 10px; margin-bottom:10px" title="步骤信息" />
      <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span:2 }" :wrapper-col=" { span: 21 }">
        <a-form-model-item label="前置条件" prop="precondition">
          <a-textarea v-model="form.mavonValue" auto-size disabled/>
        </a-form-model-item>
        <a-dropdown :trigger="['click']" >
          <div class="ant-dropdown-link">
            <span v-text="defaultText"></span>
            <a-icon type="down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item v-for="(item) in options" :key="item.key" @click="dropItemClick(item)">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <div v-if="activeItem==='1'">
          <a-form-model-item label="用例步骤" prop="description">
            <a-textarea v-model="form.description" auto-size disabled/>
          </a-form-model-item>
          <a-form-model-item label="预期结果" prop="expectResult">
            <a-textarea v-model="form.expectResult" auto-size disabled/>
          </a-form-model-item>
        </div>
        <div v-else>
          <a-table :columns="columns" :data-source="dataSource" :pagination="false" bordered>
          </a-table>
        </div>
      </a-form-model>
    </template>
    <template slot="footer">
      <a-button type="primary" @click="cancel"> 确 定 </a-button>
    </template>
  </ant-modal>
</template>

<script>
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'PreviewForm',
  components: { AntModal },
  data() {
    return {
      open: false,
      activeItem: '0',
      dataSource: [
        {
          key: 0,
          serial: 1,
          caseStep: '',
          expectedResult: ''
        }
      ],
      formTitle: '',
      defaultText: '描述方式',
       columns: [
        {
          title: '序号',
          width: '15%',
          dataIndex: 'serial'
        },
        {
          title: '用例步骤',
          dataIndex: 'caseStep'
        },
        {
          title: '预期结果',
          dataIndex: 'expectedResult'
        }
      ],
      options: [
        {
          key: '0',
          name: '步骤描述'
        },
        {
          key: '1',
          name: '文本描述'
        }
      ],
      form: {
        mavonValue: '',
        expectResult: '',
        description: ''
      },
      rules: {}
    }
  },
  methods: {
    cancel() {
      this.open = false
      this.$emit('close')
    },
    dropItemClick(item) {
      this.activeItem = item.key
      this.defaultText = item.name
    },
      /** 修改按钮操作 */
    handlePreview (record) {
        this.open = true
        this.formTitle = record.caseName
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../function.less';
.ant-dropdown-link {
    margin: 40px 0;
}
.ant-table-wrapper {
    margin: 0 70px;
}
</style>
