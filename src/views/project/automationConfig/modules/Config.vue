<template>
  <div class="container">
    <div class="title-wrapper">
      <!-- <div class="title">{{ title }}</div> -->
      <a-form-model class="form-control-wrapper" ref="form" :model="form" :rules="rules" slot="content"
        :label-col="{ span: 2 }" :wrapper-col="{ span: 5 }">
        <a-form-model-item label="配置类型" prop="type">
          <a-select v-model="form.type" placeholder="请选择" allowClear :disabled="multiple">
            <a-select-option v-for="(item, value) in automationType" :key="value" :value="item.type">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="配置名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入" allow-clear :rows="2" :disabled="multiple"/>
        </a-form-model-item>
        <a-form-model-item label="配置描述" prop="description">
          <a-input v-model="form.description" placeholder="请输入" allow-clear :rows="2" :disabled="multiple"/>
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" :disabled="multiple"/>
        </a-form-model-item>
      </a-form-model>
      <div class="button-control-wrapper">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" :disabled="multiple" @click="save">保存</a-button>
      </div>
    </div>
    <a-divider style="margin-top: 0px;" />
    <div class="tab_wrapper">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="项目配置">
          <ConfigProject :automation_Id="automation_Id" :multiple="multiple"></ConfigProject>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Jenkins配置">
          <ConfigJenkins :automation_Id="automation_Id" :multiple="multiple"></ConfigJenkins>
        </a-tab-pane>
        <a-tab-pane key="3" tab="环境配置">
          <ConfigEnvironment :automation_Id="automation_Id" :multiple="multiple"></ConfigEnvironment>
        </a-tab-pane>
        <a-tab-pane key="4" tab="浏览器配置">
          <ConfigBrowser :automation_Id="automation_Id" :multiple="multiple"></ConfigBrowser>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- <a-divider style="margin-top: 0px;" />
    <div class="tab_wrapper">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="项目配置">
          <ConfigProject :automation_Id="automation_Id" :multiple="multiple"></ConfigProject>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Jenkins配置">
          <ConfigJenkins :automation_Id="automation_Id" :multiple="multiple"></ConfigJenkins>
        </a-tab-pane>
        <a-tab-pane key="3" tab="环境配置">
          <ConfigEnvironment :automation_Id="automation_Id" :multiple="multiple"></ConfigEnvironment>
        </a-tab-pane>
        <a-tab-pane key="4" tab="浏览器配置">
          <ConfigBrowser :automation_Id="automation_Id" :multiple="multiple"></ConfigBrowser>
        </a-tab-pane>
      </a-tabs>
    </div>-->
  </div> 
</template>
<script type="text/javascript">
import { addAutomation, editAutomation, updateAutomationStatus } from '@/api/project'
import { automationType } from './Config.js'
import ConfigProject from './ConfigProject.vue';
import ConfigJenkins from './ConfigJenkins.vue';
import ConfigEnvironment from './ConfigEnvironment.vue';
import ConfigBrowser from './ConfigBrowser.vue';

export default {
  name: "EnvConfig",
  components: { ConfigProject, ConfigJenkins, ConfigEnvironment, ConfigBrowser },
  props: {
    record: {
      type: Object,
    },
    automationId: {
      type: String,
    },
    multiple: {
      type: Boolean,
    }
  },
  data() {
    return {
      // multiple: true,
      automationType,
      title: this.record ? '修改自动化配置' : '新增自动化配置',
      form: {
        type: undefined,
        id: '',
        name: '',
        description: '',
        status: 0,
      },
      automation_Id: this.automationId,
      rules: {
        type: [{ required: true, message: '配置类型不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '配置描述不能为空', trigger: 'blur' }],
      },
      switchStatus: true
    };
  },
  created() {
    // this.getAllProjectList()
    // console.log('this.record', this.record)
    // console.log('this.multiple', this.multiple)
    if (this.record) {
      Object.keys(this.form).forEach(key => this.form[key] = this.record[key]);
      this.form.status = parseInt(this.record.status ?? 0)
      this.switchStatus = Boolean(parseInt(this.record.status ?? 0));
    }
  },
  mounted() {
  },
  methods: {
    // 取消
    cancel() {
      this.$emit('remove')
    },
    // 保存
    save1() {
      this.$refs.form.validate(valid => {
        // if (!valid) return false;
        valid
          ? this.form.id
            ? editAutomation(this.form).then(response => {
              this.$message.success('修改成功')
            })
            : addAutomation(this.form).then(response => {
              this.$message.success('新增成功')
              this.automation_Id = response.data.id
              console.log('this.automation_Id', this.automation_Id)
            })
          : false
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.status = Number(this.switchStatus)
          if (this.form.id === '') {
            addAutomation(this.form).then((response) => {
              this.$message.success('新增成功')
              this.automation_Id = response.data.id
            })
          } else {
            editAutomation(this.form).then((response) => {
              this.$message.success('修改成功')
            })
          }
        } else {
          return false
        }
      })
    },
    // 修改自动化状态
    onchange(value) {
      this.form.status = Number(value)
      this.title === '修改自动化配置' ? updateAutomationStatus(this.form).then(() => {
        this.$message.success('修改状态成功')
        this.$emit('getList')
      }) : null
    }
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 162px) !important;
  // margin-top: -20px;
}

.title-wrapper {
  // height: calc(100vh - 185px);
  display: flex;
  padding: 18px 0px 0px 0px;

  .form-control-wrapper {
    width: 100%;
    margin-left: -20px;
  }

  .button-control-wrapper {
    margin-left: auto;
    margin-right: 10px;
    display: grid;
    grid-template-columns: repeat(2, 80px);
    grid-template-rows: 30px;
    grid-column-gap: 15px;
  }
}

.tab_wrapper {
  // height: calc(100vh - 230px);
  margin-top: -25px;
}
</style>