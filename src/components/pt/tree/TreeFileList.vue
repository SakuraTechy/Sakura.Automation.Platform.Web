<template>
  <div v-if="treeData.length > 0">
    <a-tree
      :tree-data="treeData"
      default-expand-all
      blockNode
      draggable
      :replaceFields="replaceFields"
      :selectedKeys="selectedKeys"
      @select="clickSelectKeys"
      @dragenter="onDragEnter"
      @drop="onDrop"
    >
      <template #title="{ id, name, parentId, number, iconDisabled }">
        <span style="float: right">{{ number }}</span>
        <span @mouseenter="openIcon" @mouseleave="closeIcon" class="tree-title">
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>{{ name }}</span>
            </template>
            <span class="tree-name">{{ name }}</span>
          </a-tooltip>
          <span class="operation">
            <a-icon :style="{ color: '#0e37e4' }" type="plus-circle" @click="onAddNode(id, parentId)" />
            <a-icon
              :style="{ color: '#0e37e4', margin: '0 4px' }"
              type="edit"
              @click="onChangeName(id, parentId, name)"
              v-show="!iconDisabled"
            />
            <a-icon
              :style="{ color: '#0e37e4' }"
              type="delete"
              @click="onDel(id, name, parentId)"
              v-show="!iconDisabled"
            />
          </span>
        </span>
      </template>
    </a-tree>
    <ant-modal
      :visible="open"
      :modal-title="formTitle"
      :adjust-size="false"
      modalWidth="600"
      @cancel="cancel"
      modalHeight="200"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        slot="content"
        layout="vertical"
        :labelCol="{ span: 2 }"
        :wrapperCol="{ span: 20 }"
      >
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="cancel"> 取消 </a-button>
        <a-button type="primary" @click="submitForm"> 确定 </a-button>
      </template>
    </ant-modal>
  </div>
</template>
<script>
import { addUiNodeList, editUiNodeList, deleteUiNodeList } from '@/api/ui'
import AntModal from '@/components/pt/dialog/AntModal'
export default {
  name: 'TreeList',
  components: {
    AntModal,
  },
  data() {
    return {
      treeData: [],
      projectId: '',
      selectedKeys: null,
      replaceFields: { children: 'children', key: 'id', title: 'name' },
      formTitle: '',
      // 表单参数
      form: {
        id: '',
        parentId: '',
        name: '',
      },
      addParams: {},
      open: false,
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {},
  methods: {
    // 获取树形结构
    getTreeData(treeData, projectId) {
      const {selectedKeys} = this
      if (!selectedKeys) {
          // 默认点击第一项
         this.clickSelectKeys([treeData[0].id])
      }
      this.treeData = treeData
      this.projectId = projectId
    },
    // 清空选择的节点
    clearSelectedkeys() {
      this.selectedKeys = null
    },
    // 拖动节点
    onDragEnter(info) {
      console.log(info, 'onDragEnter')
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    // 拖动节点
    onDrop(info) {
      console.log(info, 'onDrop')
      console.log(info.dragNodesKeys[0]) //拖动的模块id
      console.log(info.node.eventKey) // 需要拖动的位置
      // const {projectId,treeData} = this
      // const id = info.dragNodesKeys[0]
      // const parentId = info.node.eventKey
      // const name = this.findNodeId(treeData,id,'name')
      // const params = {id,parentId,projectId,name}
      // editUiNodeList(params).then((response) => {
      //       this.$message.success('拖动成功')
      //       this.$emit('ok',id)
      //       this.selectedKeys = [id]
      // })
    },
    // 鼠标经过显示操作
    openIcon(e) {
      Array.from(e.target.childNodes)[1].className = 'operation showOperation'
    },
    // 鼠标离开隐藏操作
    closeIcon(e) {
      Array.from(e.target.childNodes)[1].className = 'operation'
    },
    // 选中节点
    clickSelectKeys(selectedKeys) {
      this.selectedKeys = selectedKeys
      this.$emit('onClick', this.selectedKeys[0])
    },
    // 删除节点
    onDel(id, name, parentId) {
      var that = this
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + name + '的数据以及子节点数据',
        onOk() {
          deleteUiNodeList(id).then((response) => {
            that.$message.success('删除成功')
            that.$emit('ok')
            that.clickSelectKeys([parentId])
          })
        },
        onCancel() {
          that.clickSelectKeys([id])
        },
      })
    },
    // 改变node名字
    onChangeName(id, parentId, name) {
      this.open = true
      this.formTitle = '修改模块'
      this.form = Object.assign(this.form, { id, parentId, name })
    },
    // 添加node
    onAddNode(id, parentId) {
      this.form = {
        id: '',
        parentId: '',
        name: '',
      }
      this.open = true
      this.formTitle = '新增模块'
      this.form.parentId = id
    },
    // 关闭弹窗
    cancel() {
      this.open = false
      this.form = {
        id: '',
        parentId: '',
        name: '',
      }
      this.$emit('close')
    },
    // 提交
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          const { id, parentId, name } = this.form
          const { projectId } = this
          if (this.form.id) {
            const params = { id, parentId, name, projectId }
            editUiNodeList(params)
              .then((response) => {
                this.$message.success('修改成功')
                this.open = false
                this.$emit('ok')
                this.clickSelectKeys([id])
              })
              .catch(() => {
                this.$emit('ok')
                this.clickSelectKeys([id])
              })
          } else {
            const params = { parentId, name, projectId }
            addUiNodeList(params)
              .then((response) => {
                this.$message.success('新增成功')
                this.open = false
                this.clickSelectKeys([parentId])
                this.$emit('ok')
              })
              .catch(() => {
                this.$emit('ok')
                this.clickSelectKeys([parentId])
              })
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.operation {
  position: absolute;
  top: 0;
  right: 20px;
  display: none;
}
::v-deep .ant-tree-node-content-wrapper {
  position: relative;
}
.showOperation {
  display: block;
}
::v-deep .ant-tree-title {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 30px;
}
.tree-title {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.tree-name {
  display: inline-block;
  width:65%;
  overflow: hidden;
  white-space: nowrap;/*不换行*/
 text-overflow:ellipsis;/*超出部分文字以...显示*/
}
</style>
 