<template>
  <div>
    <div class="title-wrapper">
      <div class="title">{{ title }}</div>
      <div class="title-control-wrapper">
        <a-button type="primary">保存</a-button>
        <a-button>取消</a-button>
      </div>
    </div>
    <a-form ref="form" :model="form" slot="content" :label-col="{ span: 2 }" :wrapper-col="{ span: 4}">
      <a-form-item label="配置类型">
        <a-select
          v-model="form.projectId"
          placeholder="请选择">
          <a-select-option v-for="p in projectData" :key="p.value" :value="p.value">
            {{ p.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="配置名称">
        <a-input v-model="form.name" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item label="配置描述">
        <a-input v-model="form.description" placeholder="请输入配置描述" type="textarea" allow-clear :rows="2" />
      </a-form-item>
    </a-form>
    <a-divider></a-divider>
    <div class="tab_wrapper">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="项目配置">
          <autoProjectConfig />
        </a-tab-pane>
        <a-tab-pane key="2" tab="环境配置">
          <autoEnvConfig />
        </a-tab-pane>
        <a-tab-pane key="3" tab="浏览器配置">
          <autoBrowserConfig />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script type="text/javascript">
import autoProjectConfig from './autoProjectConfig.vue';
import autoEnvConfig from './autoEnvConfig.vue';
import autoBrowserConfig from './autoBrowserConfig.vue';
export default {
  name: "AutoConfig",
  components: { autoProjectConfig, autoEnvConfig, autoBrowserConfig },
  data() {
    return {
      title: '新增自动化配置',
      form: {
        projectId: undefined,
        name: undefined,
        status: 1,
      },
      projectData: [
        {name: '1',value: 1}
      ],
      switchStatus: true
    };
  },
  created() {
  },
  methods: {
    onchange(){
      
    }
  },
};
</script>
<style lang="less" scoped>
.title-wrapper {
  display: flex;
  justify-content: space-between;
  padding:  0 10px;
  .title {
    font-size: 16px;
    font-weight: 400;
    color: #101010;
  }
  .title-control-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 80px);
    grid-template-rows: 30px;
    grid-column-gap: 20px;
  }
}
.tab_wrapper {
  height: calc(100vh - 420px);
}
</style>