<template>
  <div>
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @delete-node="onDel"
      @add-node="onAddNode"
      :model="data"
      default-tree-node-name="新建模块"
      default-leaf-node-name="新建模块"
      :default-expanded="true"
    >
      <template v-slot:leafNameDisplay="slotProps">
        <div :class="activeId == slotProps.model.id ? 'active-node-color' : ''">
          <span>
            {{ slotProps.model.name }}
          </span>
          <span>{{ slotProps.model.number }}</span>
        </div>
      </template>
      <span
        v-show="showIcon && !disabled"
        class="icon"
        slot="addTreeNodeIcon"
      ><a-icon
        :style="{ color: '#0e37e4' }"
        type="plus-circle"
      /></span>
      <span v-show="showIcon && !disabled" class="icon" slot="addLeafNodeIcon"></span>
      <span
        v-show="showIcon && !disabled"
        class="icon"
        slot="editNodeIcon"
        @click="closeTreeNodeIcon"
      ><a-icon
        :style="{ color: '#0e37e4' }"
        type="edit"
      /></span>
      <span
        v-show="showIcon && !disabled"
        class="icon"
        slot="delNodeIcon"
      ><a-icon
        :style="{ color: '#0e37e4' }"
        type="delete"
      /></span>
      <span class="icon" slot="leafNodeIcon"><a-icon type="folder" /></span>
      <span class="icon" slot="treeNodeIcon"><a-icon type="folder" /></span>
    </vue-tree-list>
    <!-- <button @click="getNewTree">Get new tree</button>
      <pre>
      {{ newTree }}
    </pre> -->
  </div>
</template>

<script>
import { VueTreeList, Tree, TreeNode } from 'vue-tree-list'
import {addUiNodeList,editUiNodeList,deleteUiNodeList} from '@/api/ui'
export default {
  name: 'TreeList',
  components: { VueTreeList },
  props: {
    treeData: {
      type: Object | Array,
      default:null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    projectId:{
      type:String,
      required:true
    }
  },
  watch: {
    treeData: {
      handler(val) {
        console.log('data', val)
        if (val) {
         this.activeId= val.id
         this.data = val instanceof Array? new Tree(val) : new Tree([val])
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      data: undefined,
      activeId: '',
      showIcon: true,
    }
  },
  created() {
  },
  methods: {
    // 编辑的时候关闭图标按钮显示
    closeTreeNodeIcon() {
      this.showIcon = false
    },
    // 删除节点
    onDel(node) {
      var that = this
      // console.log('onDel', node)
      const nodeName = node.name
      const id = node.id
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + nodeName + '的数据以及子节点数据',
        onOk() {
          deleteUiNodeList(id).then((response) => {
             that.$message.success('删除成功')
             that.$emit('ok')
          }) 
          if (that.activeId === node.id) {
            that.activeId = that.treeData.id
          }
        },
        onCancel() {
        }
      })
    },
    // 改变node名字
    onChangeName(params) {
      if (params.eventType) {
        this.showIcon = true
        const {projectId} = this
        const {id,newName} = params
        const parentId = this.findNodeId([this.treeData],params.id, 'parentId')
        const data = {id,name:newName,projectId,parentId}
        editUiNodeList(data).then((response => {
        this.$message.success('修改成功')
        this.$emit('ok')
      })).catch(() => {
        this.$emit('ok')
      })
      }
    },
    // 添加node
    onAddNode(params) {
      const {pid,name} = params
      const {projectId} = this
      const data = {parentId:pid,name,projectId}
      addUiNodeList(data).then((response) => {
        this.$message.success('新增成功')
        this.$emit('ok', params)
      }).catch(() => {
        this.$emit('ok', params)
      })
    },
    // 点击node
    onClick(params) {
      this.activeId = params.id
      this.$emit('onClick', params)
    },
    // 添加根节点
    addNode() {
      var node = new TreeNode({ name: 'new node', isLeaf: false })
      if (!this.data.children) this.data.children = []
      this.data.addChildren(node)
    },
    // 获取所有的树结构信息
    getNewTree() {
      var vm = this
      function _dfs(oldNode) {
        var newNode = {}

        for (var k in oldNode) {
          if (k !== 'children' && k !== 'parent') {
            newNode[k] = oldNode[k]
          }
        }

        if (oldNode.children && oldNode.children.length > 0) {
          newNode.children = []
          for (var i = 0, len = oldNode.children.length; i < len; i++) {
            newNode.children.push(_dfs(oldNode.children[i]))
          }
        }
        return newNode
      }

      vm.newTree = _dfs(vm.data)
    }
  }
}
</script>

<style lang="less" scoped>
.vtl {
  cursor: pointer;
  .vtl-node-main {
    &:hover {
      background-color: #d0cfcf;
    }
  }
}
.icon {
  padding: 2px;
  &:hover {
    cursor: pointer;
  }
}

.muted {
  cursor: pointer;
  color: gray;
  font-size: 80%;
}
.active-node-color {
  color: #2147e6;
}
/deep/ .vtl-icon {
  font-family: iconfont!important;
  font-size:16px;
}
/deep/ .vtl-icon-caret-right:before {
  content:"\e902"
}
/deep/ .vtl-node-main .vtl-caret {
  margin-top: 3px;
}
</style>
