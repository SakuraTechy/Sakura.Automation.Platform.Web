<template>
  <div class="container">
    <div class="title-wrapper">
      <!-- <div class="title">{{ title }}</div> -->
      <a-form-model class="form-control-wrapper" ref="form" :model="form" :rules="rules" slot="content"
        :label-col="{ span: 2 }" :wrapper-col="{ span: 4 }">
        <a-form-model-item label="所属项目" prop="projectId">
          <a-select v-model="form.projectId" placeholder='请选择'>
            <!-- <a-select-option v-for="p in projectData" :key="p.value" :value="p.value">
            {{ p.name }}
          </a-select-option> -->
            <a-select-option v-for="item in projectOptions" :key="item.id" :value='item.id'>
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="环境名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入" allow-clear :rows="2" />
        </a-form-model-item>
        <a-form-model-item label="启用状态">
          <a-switch v-model="switchStatus" @change="onchange" />
        </a-form-model-item>
      </a-form-model>
      <div class="button-control-wrapper">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="save">保存</a-button>
      </div>
    </div>
    <a-divider></a-divider>
    <div class="tab_wrapper">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="版本配置">
          <ConfigVersion :environment_Id="environment_Id"></ConfigVersion>
        </a-tab-pane>
        <!-- <a-tab-pane key="2" tab="域名配置">
          <ConfigDomain :environment_Id="environment_Id"></ConfigDomain>
        </a-tab-pane> -->
        <a-tab-pane key="3" tab="帐号配置">
          <ConfigAccount :environment_Id="environment_Id"></ConfigAccount>
        </a-tab-pane>
        <a-tab-pane key="4" tab="服务器配置">
          <ConfigServer :environment_Id="environment_Id"></ConfigServer>
        </a-tab-pane>
        <a-tab-pane key="5" tab="数据库配置">
          <ConfigDataBase :environment_Id="environment_Id"></ConfigDataBase>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script type="text/javascript">
import { addEnvironment, editEnvironment, updateEnvironmentStatus } from '@/api/project'
import ConfigVersion from './ConfigVersion.vue';
import ConfigDomain from './ConfigDomain.vue';
import ConfigAccount from './ConfigAccount.vue';
import ConfigServer from './ConfigServer.vue';
import ConfigDataBase from './ConfigDataBase.vue';

export default {
  name: "EnvConfig",
  components: { ConfigVersion, ConfigDomain, ConfigAccount, ConfigServer, ConfigDataBase },
  props: {
    record: {
      type: Object,
    },
    environmentId: {
      type: String,
    },
    projectOptions: {
      type: Array,
    }
  },
  data() {
    return {
      title: this.record ? '修改环境配置' : '新增环境配置',
      form: {
        id: '',
        name: '',
        projectId: undefined,
        projectName: '',
        status: 0,
      },
      environment_Id: this.environmentId,
      rules: {
        projectId: [{ required: true, message: '所属项目不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '环境名称不能为空', trigger: 'blur' }],
      },
      // projectOptions: [
      //   { id: 'e4fc16d5ca964d7b8917c4086eaf5fc3', name: '奇安信网神数据库审计与防护系统' },
      //   { id: '204b18c2ea424698843149999de13d32', name: '数据库综合安全防护系统' },
      // ],
      switchStatus: true
    };
  },
  created() {
    // this.getAllProjectList()
    // console.log('this.environmentId', this.environmentId)
    console.log(this.record);
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
            ? editEnvironment(this.form).then(response => {
              this.$message.success('修改成功')
            })
            : addEnvironment(this.form).then(response => {
              this.$message.success('新增成功')
              this.environment_Id = response.data.id
              console.log('this.environment_Id', this.environment_Id)
            })
          : false
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.status = Number(this.switchStatus)
          if (this.form.id === '') {
            addEnvironment(this.form).then((response) => {
              this.$message.success('新增成功')
              this.environment_Id = response.data.id
            })
          } else {
            editEnvironment(this.form).then((response) => {
              this.$message.success('修改成功')
            })
          }
        } else {
          return false
        }
      })
    },
    // 修改环境状态
    onchange(value) {
      this.form.status = Number(value)
      this.title === '修改环境配置' ? updateEnvironmentStatus(this.form).then(() => {
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
  // height: 160px;
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
  // height: calc(100vh - 375px);
  margin-top: -25px;
}
</style>