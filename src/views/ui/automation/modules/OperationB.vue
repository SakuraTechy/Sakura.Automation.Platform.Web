<template>
  <ant-modal :visible="open" :modal-title="formTitle" :adjust-size="true" modalWidth="800" @cancel="cancel"
    modalHeight="600">
    <div slot="content">
      <a-form-model :model="form.sysSceneCase" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
        class="add-step-form">
        <a-form-model-item label="场景用例ID" prop="id">
          <a-input v-model="form.sysSceneCase.id" class="check-strictly-fix" :disabled="editType" placeholder="请输入"
            allow-clear />
        </a-form-model-item>
        <a-form-model-item label="新所属场景" prop="selected" v-if="showCopy">
          <!-- <el-cascader size="small" class="check-strictly-fix" :props="props" v-model="selected" @change="handleChange"
            ref="cascaderRef" placeholder="请输入" clearable /> -->
          <el-cascader size="small" class="check-strictly-fix" :options="options" v-model="selected"
            @change="handleChange" placeholder="请选择或搜索" clearable filterable />
        </a-form-model-item>
        <a-form-model-item label="新场景用例ID" prop="copyId" v-if="showCopy">
          <a-input v-model="form.sysSceneCase.copyId" class="check-strictly-fix" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="场景用例名称" prop="name">
          <a-input v-model="form.sysSceneCase.name" class="check-strictly-fix" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="场景用例备注" prop="remark">
          <a-textarea v-model="form.sysSceneCase.remark" placeholder="请输入" class="check-strictly-fix" auto-size
            allow-clear />
        </a-form-model-item>
        <a-form-model-item label="场景用例排序" prop="sortType">
          <a-select v-model="form.sortType" placeholder="请选择排序类型" class="check-strictly-fix"
            option-filter-prop="children" @change="onSortChange">
            <a-select-option v-for="(d, index) in sortOptions" :key="index" :value="d.value">
              <span>{{ d.label }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="当前用例序号" prop="order" v-if="showSort">
          <a-input v-model="form.sysSceneCase.order" style="width: 200px" placeholder="请输入" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="目标用例序号" prop="itemOrder" v-if="showSort">
          <a-input v-model="form.itemOrder" style="width: 200px" placeholder="请输入" allow-clear />
        </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button @click="cancel"> 取消 </a-button>
      <a-button type="primary" @click="submitForm"> 确定 </a-button>
    </template>
  </ant-modal>
</template>

<script>
import { sortOptions } from '@/utils/options'
import AntModal from '@/components/pt/dialog/AntModal'
import { getSceneList, getSenceCaseList, addScenceCaseList, getSenceCaseInfo, editScenceCaseList, copySenceCaseList } from '@/api/ui'
import * as projectApis from '@/api/project'

export default {
  name: 'OperationB',
  components: { AntModal },
  data() {
    const validateSceneId = (rule, value, callback) => {
      if (this.form.copyId === '' || Array.isArray(value) && value.length === 0) {
        callback(new Error('新所属场景不能为空'))
      } else {
        callback()
      }
    }
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      showCopy: false,
      showSort: false,
      open: false,
      editType: false,
      submitType: '',
      formTitle: '',
      sortOptions,
      form: {
        id: '',
        sortType: 0,
        itemOrder: 1,
        sysSceneCase: {
          id: '',
          copyId: '',
          name: '',
          order: 1,
          cancel: true,
          remark: ''
        },
        projectId: '',
        versionId: '',
        copyId: ''
      },
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad,
        value: 'id',
        label: 'name',
        leaf: (node) => {
          return node.level === 2 || node.data?.isLeaf
        },
        expandTrigger: 'hover',
        checkStrictly: false // 允许点击非叶子节点展开
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }]
        }]
      },
      {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }]
        }]
      }],
      selected: [], // 绑定选中值
      rules: {
        id: [{ required: true, message: '场景ID不能为空', trigger: 'blur' }],
        selected: { required: true, validator: validateSceneId, trigger: 'blur' },
        name: [{ required: true, message: '场景名称不能为空', trigger: 'blur' }],
        copyId: [{ required: true, message: '新场景ID不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset() {
      this.$refs.form?.resetFields()
    },
    onSortChange(value) {
      if (value === 0) {
        this.showSort = false
      } else {
        this.showSort = true
      }
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.form.id = row.id
      this.form.copyId = row.id
      this.form.sysSceneCase.id = ''
      this.open = true
      this.formTitle = '新增场景用例'
      this.editType = false
      this.showCopy = false
      this.submitType = 'add'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.formTitle = '编辑场景用例'
      this.submitType = 'edit'
      this.reset()
      this.editType = true
      this.showCopy = false
      this.open = true
      this.form.sortType = 0
      this.form.id = row.id
      this.form.copyId = row.id
      this.showSort = false
      const params = { id: row.id, sysSceneCase: { id: row.caseId } }
      getSenceCaseInfo(params).then((response) => {
        // const { id, name, order, cancel, remark } = response.data
        // this.form.sysSceneCase = { id, name, order, cancel, remark }
        this.form.sysSceneCase.id = response.data.id
        this.form.sysSceneCase.name = response.data.name
        this.form.sysSceneCase.order = response.data.order
        this.form.sysSceneCase.remark = response.data.remark
        this.form.sysSceneCase.cancel = response.data.cancel
      })
    },
    /** 复制按钮操作 */
    handleCopy(row) {
      this.formTitle = '复制场景用例'
      this.submitType = 'copy'
      // this.reset()
      this.open = true
      this.editType = true
      this.showCopy = true
      this.form.sortType = 0
      this.showSort = false
      // this.form.itemOrder=
      this.form.id = row.id
      // this.form.sysSceneCase.id = row.caseId
      this.form.sysSceneCase.copyId = row.caseId
      const params = { id: row.id, sysSceneCase: { id: row.caseId } }
      this.buildDynamicTree().then(tree => {
        // console.log('动态构建的树形结构:', tree, JSON.stringify(tree))
        this.options = tree
      })
      getSenceCaseInfo(params).then((response) => {
        // const { id, name, order, cancel, remark } = response.data
        // this.form.sysSceneCase = { id, name, order, cancel, remark }
        // this.form.sysSceneCase.copyId = id
        this.form.sysSceneCase.id = response.data.id
        this.form.sysSceneCase.name = response.data.name
        // this.form.sysSceneCase.order = response.data.order
        this.form.sysSceneCase.remark = response.data.remark
        this.form.sysSceneCase.cancel = response.data.cancel
        getSenceCaseList(this.form.id).then((response) => {
          const { projectId, versionId, id, caseMsg } = response.data
          const caseList = caseMsg ? JSON.parse(caseMsg) : []
          this.form.sysSceneCase.order = caseList.length + 1
          this.$nextTick(() => {
            this.selected = [projectId, versionId, id]
            this.form.copyId = id
          })
        })
      })
    },
    // 重置节点状态的核心方法
    resetNode(level) {
      const panel = this.$refs.cascaderRef.panel
      // 清除已加载的子节点
      panel.checkedValue = []
      panel.menu = []
      panel.activePath = []
      panel.lazyLoadMap = new Map() // 清除懒加载缓存
    },
    // 监听选择变化
    handleChange(value) {
      console.log('选中值变化:', value)
      // 当第一层变化时强制重置状态
      if (value.length === 1) {
        this.resetNode(1)
        this.$refs.cascaderRef.panel.lazyLoad() // 手动触发加载
      }
      this.form.copyId = this.selected[2]
      console.log(this.form.copyId)
    },
    async lazyLoad(node, resolve) {
      const { level } = node
      console.log(`[Debug] 加载层级 ${level} 节点:`, node)
      try {
        let nodes = []
        switch (level) {
          case 0: {
            // 第一层：项目列表
            const res = await projectApis.getProjectList({})
            nodes = res.data.list.map(p => ({
              id: p.id,
              name: p.name,
              level: 0
            }))
            console.log('[Debug] 项目层加载完成:', nodes)
            break
          }
          case 1: {
            // 每次加载前重置状态
            this.resetNode(level)
            // 第二层：版本列表
            const projectId = node?.data?.id
            console.log('[Debug] 获取项目ID:', projectId)
            if (!projectId) {
              console.error('项目ID未找到，父节点数据:', node.parent?.data)
              return resolve([])
            }
            const res = await projectApis.getEnvironmentList({ projectId })
            const versionNodes = res.data.list.flatMap(env => {
              if (env.status !== 1) return []
              try {
                return JSON.parse(env.versionConfig || '[]')
                  .filter(v => v.delFlag === 0 && v.status === 1) // 过滤有效版本
                  .map(v => ({
                    id: v.id,
                    name: v.name,
                    level: 1,
                    parentId: projectId // 携带父级参数
                  }))
              } catch (e) {
                console.error('版本解析失败:', e)
                return []
              }
            })
            console.log('[Debug] 版本层加载完成:', versionNodes)
            nodes = versionNodes
            break
          }
          case 2: {
            // 每次加载前重置状态
            // this.resetNode(level)
            // 第三层：场景列表
            const projectId = node?.data?.parentId
            const versionId = node?.data?.id
            console.log('[Debug] 场景请求参数:', { projectId, versionId })
            if (!projectId || !versionId) {
              console.error('参数缺失:', { projectId, versionId })
              return resolve([])
            }
            try {
              const res = await getSceneList({ projectId, versionId })
              nodes = res.data.map(s => ({
                id: s.id,
                name: s.name,
                level: 2,
                isLeaf: true,
                leaf: true,
                hasChildren: false
              }))
              console.log('[Debug] 最后一层加载完成:', res)
            } catch (e) {
              console.error('最后一层解析失败:', e)
              return []
            }
            break
          }
        }
        resolve(nodes)
      } catch (error) {
        console.error(`层级 ${level} 加载失败:`, error)
        resolve([])
      }
    },
    // 通用数据获取方法
    async fetchApiData(url, params = {}) {
      try {
        const query = new URLSearchParams(params).toString()
        const response = await fetch(`${url}?${query}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        return await response.json()
      } catch (error) {
        console.error('API请求失败:', error)
        return []
      }
    },
    // 递归构建树形结构
    async getProjectList() {
      try {
        return await projectApis.getProjectList({})
      } catch (error) {
        console.error('API请求失败:', error)
        return []
      }
    },
    // 递归构建树形结构
    async buildDynamicTree() {
      const FIELD_MAP = {
        id: 'id',
        name: 'name',
        children: 'children'
      }
      // 获取一级节点
      const level1Data = await projectApis.getProjectList({})
      return Promise.all(
        level1Data.data.list.map(async l1Node => {
          const projectId = l1Node[FIELD_MAP.id]
          const level2Data = await projectApis.getEnvironmentList({ projectId })
          // 修复1：使用Promise.all处理二级节点的子节点
          const children = await Promise.all(
            level2Data.data.list.map(async l2Node => {
              if (l2Node.status !== 1) return []
              try {
                const parsedVersions = JSON.parse(l2Node.versionConfig || '[]')
                  .filter(v => v.delFlag === 0)
                // 修复2：使用Promise.all处理三级节点
                const versionChildren = await Promise.all(
                  parsedVersions.map(async v => {
                    const versionId = v.id
                    const level3Data = await getSceneList({ projectId, versionId })
                    return {
                      value: v[FIELD_MAP.id],
                      label: v[FIELD_MAP.name],
                      children: level3Data.data.map(l3Node => ({
                        value: l3Node[FIELD_MAP.id],
                        label: l3Node[FIELD_MAP.name]
                      }))
                    }
                  })
                )
                return versionChildren
              } catch (e) {
                console.error('版本解析失败:', e)
                return []
              }
            })
          )

          // 修复3：扁平化二级节点数组（根据数据结构调整）
          return {
            value: l1Node[FIELD_MAP.id],
            label: l1Node[FIELD_MAP.name],
            children: children.flat() // 确保数据结构正确
          }
        })
      )
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          switch (this.submitType) {
            case 'add':
              // 调用新增接口
              addScenceCaseList(this.form).then((response) => {
                this.$message.success('新增用例成功')
                this.open = false
                const { id: activeId } = this.form.sysSceneCase
                this.$emit('updateStepList', activeId)
              })
              break
            case 'edit':
              // 调用编辑接口
              editScenceCaseList(this.form).then((response) => {
                this.$message.success('编辑用例成功')
                this.open = false
                const { id: activeId } = this.form.sysSceneCase
                this.$emit('updateStepList', activeId)
              })
              break
            case 'copy':
              // 调用复制接口
              copySenceCaseList(this.form).then((response) => {
                this.$message.success('复制用例成功')
                this.open = false
                this.form.sysSceneCase.id = response.data.id
                const { id: activeId } = this.form.sysSceneCase
                if (this.form.id === this.form.copyId) {
                  this.$emit('updateStepList', activeId)
                }
              })
              break
          }
        } else {
          this.$message.info('请检查必填项')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.configForm {
  .ant-btn-circle {
    width: 30px;
    border-radius: 50%;
    min-width: 0;
    padding: 0 7px;
    line-height: 18px;
    text-align: center;
  }
}

.add-step-form {
  margin-left: 30px;

  ::v-deep .ant-form-item-label {
    margin-right: 10px;
    font-size: 16px;
    font-weight: 700;
  }
}

/* 关键样式覆盖 */
.check-strictly-fix {
  width: 500px;

  /* 隐藏原生单选按钮 */
  .el-cascader-node__prefix {
    display: none !important;
  }

  /* 扩大点击区域 */
  .el-cascader-node__label {
    position: relative;
    padding-left: 20px !important;
    cursor: pointer;

    /* 自定义伪元素代替单选按钮 */
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 14px;
      height: 14px;
      border: 1px solid #dcdfe6;
      border-radius: 50%;
    }
  }

  /* 选中状态样式 */
  .el-cascader-node.is-checked .el-cascader-node__label::before {
    background-color: #409eff;
    border-color: #409eff;
  }
}

/* 强制隐藏叶子节点箭头 */
.el-cascader-node[aria-leaf="true"] .el-cascader-node__postfix {
  display: none !important;
}

/* 优化点击体验 */
.el-cascader-node__label {
  cursor: pointer;
  transition: all 0.2s;
}

.el-cascader-node__label:hover {
  color: #409eff;
}
</style>
