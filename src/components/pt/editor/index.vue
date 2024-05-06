<template>
  <div class="codeEditBox">
    <editor
      v-model="code"
      @init="editorInit"
      @input="codeChange"
      lang="javascript"
      :options="editorOptions"
      theme="chrome"></editor>
  </div>
</template>

<script>
	import Editor from 'vue2-ace-editor'
	export default {
		name: 'CodeEditor',
		props: {
			codeId: {
				type: String
			}
		},
		components: {
			Editor
		},
		data() {
			return {
                // 双向绑定的编辑器内容值属性
				code: '',
				editorOptions: {
					// 设置代码编辑器的样式
					enableBasicAutocompletion: true, // 启用基本自动完成
					enableSnippets: true, // 启用代码段
					enableLiveAutocompletion: true, // 启用实时自动完成
					tabSize: 2, // 标签大小
					fontSize: 14, // 设置字号
					showPrintMargin: false // 去除编辑器里的竖线
				}
			}
		},
		methods: {
            // 编辑内容改变时触发
			codeChange(val) {
				if (val) {
                  this.$emit('changeCode', val, this.codeId)
				}
			},
			editorInit() {
				require('brace/theme/chrome')
				require('brace/ext/language_tools') // language extension prerequsite...
				require('brace/mode/yaml')
				require('brace/mode/json')
				require('brace/mode/less')
				require('brace/snippets/json')
				require('brace/mode/lua')
				require('brace/snippets/lua')
				require('brace/mode/javascript')
				require('brace/snippets/javascript')
			}
		}
	}
</script>

<style scoped>
	.codeEditBox {
		width: 100%;
		height: 200px;
	}
</style>
