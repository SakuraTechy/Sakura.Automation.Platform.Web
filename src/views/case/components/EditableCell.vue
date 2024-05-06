<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-textarea :value="value" @change="handleChange" @pressEnter="check" placeholder="请输入" auto-size/>
      <a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>

export default {
  props: {
    text: String
  },
    name: 'EditableCell',
    data() {
        return {
           value: this.text,
           editable: true
        }
    },
    methods: {
    handleChange(e) {
      const value = e.target.value
      this.value = value
    },
    check() {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit() {
      this.editable = true
    }
  }
}
</script>

<style lang="less" scoped>
@import '../function.less';
</style>
