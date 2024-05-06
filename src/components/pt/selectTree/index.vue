<template>
  <a-tree-select
    v-model="value"
    :style="{ width }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    placeholder="请选择"
    :replaceFields="replaceFields"
    tree-default-expand-all
  >
  </a-tree-select>
</template>

<script>
export default {
  props: {
    width: {
       type: String,
       default: '100%'
    }
  },
  // 注入树形数据
  inject: ['treeData'],
  data() {
    return {
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id',
        value: 'id'
      },
      value: null
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('changeTreeData', val)
      }
    }
  },
  created() {},
  methods: {
    handleValue(value) {
      this.value = value
    }
  }
}
</script>

<style lang="less" scoped>
</style>
