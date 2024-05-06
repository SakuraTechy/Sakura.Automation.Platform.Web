<template>
  <div>
    <mavon-editor
      @save="saveData"
      v-model="mavonValue"
      :codeStyle="codeStyle"/>
    <!-- <br>
    <br>
    <button @click="modifyMarkdown">从数据库（我存在了markData变量中）拿到markdown中的数据进行编辑</button>
    <br>
    <mavon-editor
      v-if="isShowModifyMarkdown"
      v-model="markData"
      :codeStyle="codeStyle"
    />
    <br>
    <br>
    <button @click="showMarkdownUi" >从数据库（我存在了markData变量中）拿到markdown中的数据进行页面展示</button>
    <br>
    <div v-if="isShowMarkdownUi">
      <div>这里是markdown自动转换为html的数据：{{ htmlData }}</div>
      <br>
      <mavon-editor
        :value="markData"
        :subfield="false"
        defaultOpen="preview"
        :toolbarsFlag="false"
        :editable="false"
        :scrollStyle="true"
        :codeStyle="codeStyle"
      />
    </div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      codeStyle: 'vs2015', // 代码风格配色，更多请看 https://github.com/hinesboy/mavonEditor/blob/master/src/lib/core/hljs/lang.hljs.css.js
      isShowModifyMarkdown: false,
      isShowMarkdownUi: false,
      mavonValue: '',
      markData: '', // 保存markdown的原始数据
      htmlData: '' // 保存markdown自动转换为html后的数据
    }
  },
  computed: {
    prop () {
      const data = {
        subfield: false, // 单双栏模式
        defaultOpen: 'edit', // edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true
      }
      return data
    }
  },
  methods: {
    saveData (value, callback) { // markdown中的保存按钮
      // 保存数据，用于页面按钮操作的显示
      this.markData = value
      this.htmlData = callback
      console.log(this.markData) // markdown的原始数据
      console.log(this.htmlData) // markdown自动转换为html后的数据
    },
    modifyMarkdown () {
      this.isShowModifyMarkdown = true
    },
    showMarkdownUi () {
      this.isShowMarkdownUi = true
    }
  }
}
</script>
<style lang="less" scoped>
.markdown-body{
  width: 100%;
  height: 100px;
  margin: auto
}
</style>
