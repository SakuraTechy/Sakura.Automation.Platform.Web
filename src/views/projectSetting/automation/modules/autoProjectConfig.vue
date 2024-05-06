<template>
  <div>
    <a-form ref="form" :model="form" slot="content" :label-col="{ span: 2 }" :wrapper-col="{ span: 4}">
      <a-form-item label="项目名称">
        <a-input v-model="form.name" placeholder="请输入项目名称" allow-clear />
      </a-form-item>
      <a-form-item label="项目描述">
        <a-input v-model="form.des" placeholder="请输入项目描述" allow-clear />
      </a-form-item>
      <a-form-item label="项目地址">
        <a-input v-model="form.add" placeholder="请输入项目地址" allow-clear />
      </a-form-item>
    </a-form>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "AutoProjectConfig",
  components: {},
  data() {
    return {
      form: {}
    };
  },
  created() {
  },
  methods: {
  },
};
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

</style>