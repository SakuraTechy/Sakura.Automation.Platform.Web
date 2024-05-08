<template>
  <div slot="content">
    <a-tree 
    :tree-data="treeData" 
    blockNode 
    draggable 
    v-if="treeData.length > 0" 
    defaultExpandAll
    :auto-expand-parent="autoExpandParent" 
    :expandedKeys="expandedKeys" 
    :replaceFields="replaceFields"
    :selectedKeys="selectedKeys" 
    @select="clickSelectKeys" 
    @expand="onExpand" 
    @dragenter="onDragEnter" 
    @drop="onDrop"
    ref="nodeTree">
      <template #title="props">
        <span style="margin-right: 3px"><a-icon type="folder" /></span>
        <span @mouseenter="openIcon" @mouseleave="closeIcon" class="tree-title">
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>{{ props.name }}</span>
            </template>
            <span :id="props.id" class="tree-name">{{ props.name }}</span>
          </a-tooltip>
          <span v-if="showAddModal" class="operation">
            <!-- <a-icon :style="{ color: '#0e37e4',marginRight: `${(props.number.toString().length)*12}px`}" type="plus-circle" @click.stop="onAddNode(props.id, props.parentId)" /> -->
            <a-icon class="icon" type="plus-circle" @click.stop="onAddNode(props.id, props.parentId)" />
            <a-icon class="icon" type="edit" @click.stop="onChangeName(props.id, props.parentId, props.name)" v-show="!props.iconDisabled" />
            <!-- <a-icon :style="{ color: '#0e37e4',marginRight: props.number.toString().length>2?'60px':'30px'}" type="delete" @click.stop="onDel(props.id, props.name, props.parentId)" v-show="!props.iconDisabled" /> -->
            <a-icon class="icon" type="delete" @click.stop="onDel(props.id, props.name, props.parentId)" v-show="!props.iconDisabled" />   
          </span>
        </span>
        <span style="float: right">{{ props.number }}</span>
      </template>
    </a-tree>
    <!-- <ant-modal
      :visible="open"
      :modal-title="formTitle"
      :adjust-size="false"
      modalWidth="2800"
      modalHeight
      @cancel="cancel"
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
        <a-form-model-item label="模块名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入模块名称" allowClear/>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="cancel"> 取消 </a-button>
        <a-button type="primary" @click="submitForm"> 确定 </a-button>
      </template>
    </ant-modal> -->
    <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="460" modalHeight @cancel="cancel">
      <a-form-model slot="content" layout="vertical" :model="form" ref="form" :rules="rules" :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 20 }">
        <a-form-model-item label="模块名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入模块名称" allowClear />
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
import log from '@/utils/log'
export default {
  name: 'TreeList',
  components: {
    AntModal,
  },
  props: {
    showAddModal: {
      type: Boolean,
    }
  },
  data() {
    return {
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: null,
      replaceFields: { children: 'children', key: 'id', title: 'name' },
      formTitle: '',
      moduleId: '',
      // 表单参数
      form: {
        id: '',
        name: '',
        number: 0,
        parentId: '',
        projectId: '',
        versionId: '',
        versionName: '',
      },
      addParams: {},
      open: false,
      rules: {
        name: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
  },
  mounted() {
    this.expandAllNodes()
  },
  computed: {
    // operation() {
    //   console.log(this.form.number);
    //   return {
    //     'right': `${this.form.number.length * 10}px`
    //   }
    // }
  },
  methods: {
    expandAllNodes() {
      const allKeys = [];
      this.getAllNodeKeys(this.treeData, allKeys);
      this.expandedKeys = allKeys;
      // console.log(this.expandedKeys);
    },
    getAllNodeKeys(nodes, keys) {
      for (const node of nodes) {
        keys.push(node.id);
        if (node.children) {
          this.getAllNodeKeys(node.children, keys);
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const treeElement = this.$refs.nodeTree.$el;
        if (treeElement) {
          treeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });
    },
    scrollToNode(node) {
      this.$nextTick(() => {
        const targetElement = document.getElementById(node);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      });
    },
    // 获取树形结构
    getTreeData(treeData, projectId, versionId, versionName) {
      this.treeData = treeData
      this.form.projectId = projectId
      this.form.versionId = versionId
      this.form.versionName = versionName
      // 默认展开全部节点
      this.expandAllNodes()
      if (!this.selectedKeys) {
        // 默认点击第一项
        this.clickSelectKeys([treeData[0].id])
      } else {
        this.clickSelectKeys([this.moduleId])
      }
    },
    // 清空选择的节点
    clearSelectedkeys() {
      this.selectedKeys = null
    },
    // 展开节点
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 拖动节点
    onDragEnter(info) {
      // console.log(info, 'onDragEnter')
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    // 拖动节点
    onDrop(info) {
      // console.log(info, 'onDrop')
      // console.log(info.dragNodesKeys[0]) //拖动的模块id
      // console.log(info.node.eventKey) // 需要拖动的位置
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
    clickSelectKeys(selectedKeys, e) {
      this.selectedKeys = selectedKeys.length > 0 ? selectedKeys : [e.node.eventKey]
      this.$emit('onClick', this.selectedKeys[0])
      // // this.scrollToBottom()
      this.scrollToNode(this.selectedKeys[0])
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
      this.open = true
      this.formTitle = '新增模块'
      this.form.id = ''
      this.form.name = ''
      this.form.parentId = id
    },
    // 关闭弹窗
    cancel() {
      this.open = false
      this.$emit('close')
    },
    // 提交
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            editUiNodeList(this.form)
              .then((response) => {
                this.$message.success('修改成功')
                this.open = false
                this.$emit('ok')
                this.clickSelectKeys([this.form.id])
              })
              .catch(() => {
                this.$emit('ok')
                this.clickSelectKeys([this.form.id])
              })
          } else {
            // console.log(this.form)
            addUiNodeList(this.form)
              .then((response) => {
                this.$message.success('新增成功')
                this.open = false
                this.$emit('ok')
                this.moduleId = response.msg
                // this.clickSelectKeys([response.msg])
              })
              .catch(() => {
                this.$emit('ok')
                // this.clickSelectKeys([this.form.parentId])
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
  right: 30px;
  display: none;

  .icon {
    color: #0e37e4;
    margin-right: 8px;
  }
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

::v-deep .ant-tree > li:first-child {
  padding-top: 0px;
}

::v-deep .ant-tree li .ant-tree-title {
    padding: 0 4px;
    display: flex;
    align-items: center;
}

.tree-title {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.tree-name {
  display: inline-block;
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  /*不换行*/
  text-overflow: ellipsis;
  /*超出部分文字以...显示*/
}
</style>
