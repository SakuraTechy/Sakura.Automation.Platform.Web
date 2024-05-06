<template>
  <div>
    <a-card :bordered="false">
      <split splitHeight="100%" leftWidth="300">
        <template slot="paneL">
          <div class="card-container">
            <div style="margin-bottom: 23px">
              <a-page-header style="border-left: 3px solid #2147e6; padding: 2px 10px" title="基础信息" />
            </div>
            <a-form-model
              ref="caseForm"
              :model="form"
              :rules="caseRules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-form-model-item label="用例名称" prop="caseName">
                <a-input v-model="form.caseName" placeholder="请输入" style="width: 200px" />
              </a-form-model-item>
              <a-form-model-item label="所属模块" prop="module">
                <select-tree @changeTreeData="changeTreeData" ref="selectTree" width="95%"></select-tree>
              </a-form-model-item>
              <a-form-model-item label="版本号" prop="versionId">
                <a-select v-model="form.versionId" style="width: 200px" option-filter-prop="children">
                  <a-select-option v-for="(d, index) in versionOptions" :key="index" :value="d.id">
                    {{ d.version }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <!-- <a-form-model-item label="标签" prop="tag">
              <vue-tags-input
                v-model="form.tag"
                :tags="tags"
                placeholder="按下回车键添加"
                @tags-changed="newTags => tags = newTags"
              />
            </a-form-model-item> -->
              <a-form-model-item label="责任人" prop="duty">
                <a-select
                  v-model="form.duty"
                  placeholder="请选择责任人"
                  style="width: 200px"
                  option-filter-prop="children"
                >
                  <a-select-option v-for="(d, index) in dutyOptions" :key="index" :value="d.id">
                    {{ d.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="用例等级" prop="estate">
                <a-select
                  v-model="form.estate"
                  placeholder="请选择用例等级"
                  style="width: 200px"
                  option-filter-prop="children"
                >
                  <a-select-option v-for="(d, index) in estateOptions" :key="index" :value="d.dictValue">
                    {{ d.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="用例状态" prop="status">
                <a-select
                  v-model="form.status"
                  placeholder="请选择用例状态"
                  style="width: 200px"
                  option-filter-prop="children"
                >
                  <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.dictValue">
                    {{ d.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-form-model>
          </div>
        </template>
        <template slot="paneR">
          <div style="margin: 12px 25px" class="case-content">
            <a-page-header style="border-left: 3px solid #2147e6; padding: 2px 10px" title="步骤信息" />
            <a-form-model ref="form" :model="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-form-model-item label="前置条件" prop="precondition">
                <mavon-editor @save="saveData" v-model="form.mavonValue" :subfield="false" :codeStyle="codeStyle" />
              </a-form-model-item>
              <a-dropdown :trigger="['click']">
                <div class="ant-dropdown-link">
                  <span v-text="defaultText"></span>
                  <a-icon type="down" />
                </div>
                <a-menu slot="overlay">
                  <a-menu-item v-for="item in options" :key="item.key" @click="dropItemClick(item)">
                    {{ item.name }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <div v-if="activeItem === '1'">
                <a-form-model-item label="用例步骤" prop="description">
                  <mavon-editor
                    @save="saveDescriptionData"
                    v-model="form.description"
                    :subfield="false"
                    :codeStyle="codeStyle"
                  />
                </a-form-model-item>
                <a-form-model-item label="预期结果" prop="expectResult">
                  <mavon-editor
                    @save="saveResultData"
                    v-model="form.expectResult"
                    :subfield="false"
                    :codeStyle="codeStyle"
                  />
                </a-form-model-item>
              </div>
              <div v-else>
                <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
                  <template slot="caseStep" slot-scope="text, record">
                    <editable-cell :text="text" @change="onCellChange(record.key, 'caseStep', $event)" />
                  </template>
                  <template slot="expectedResult" slot-scope="text, record">
                    <editable-cell :text="text" @change="onCellChange(record.key, 'expectedResult', $event)" />
                  </template>
                  <template slot="operation" slot-scope="text, record">
                    <a-button
                      type="primary"
                      shape="circle"
                      icon="plus"
                      @click="handleAdd(record)"
                      style="margin-right: 10px"
                    />
                    <a-popconfirm
                      v-if="dataSource.length && record.key !== 0"
                      title="确定删除此步骤吗?"
                      @confirm="() => onDelete(record.key)"
                    >
                      <a-button type="danger" shape="circle" icon="delete" :disabled="record.key === 0" />
                    </a-popconfirm>
                  </template>
                </a-table>
              </div>
              <a-page-header style="border-left: 3px solid #2147e6; padding: 2px 10px" title="其他信息" />
              <a-form-model-item label="" prop="otherInfo" :wrapper-col="{ span: 23 }">
                <a-tabs v-model="activeKey" style="margin-left: 100px; min-height: 300px">
                  <a-tab-pane key="1" tab="备注">
                    <mavon-editor
                      @save="saveOtherData"
                      v-model="form.otherRemark"
                      :subfield="false"
                      :codeStyle="codeStyle"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="2" tab="关联测试">
                    <relevance-list
                      :onSave="onSave"
                      :isHandleEdit="isHandleEdit"
                      :case-info="caseInfo"
                    ></relevance-list>
                  </a-tab-pane>
                  <a-tab-pane key="3" tab="关联需求"> 暂无配置 </a-tab-pane>
                  <a-tab-pane key="4" tab="附件"> 暂无配置 </a-tab-pane>
                </a-tabs>
              </a-form-model-item>
              <div class="bottom-control" style="z-index:9999">
                <a-space>
                  <a-button type="primary" @click="submitForm"> 保存 </a-button>
                </a-space>
              </div>
            </a-form-model>
          </div>
        </template>
      </split>
    </a-card>
  </div>
</template>

<script>
import Split from '@/components/pt/split/Index'
import EditableCell from '../../components/EditableCell.vue'
import VueTagsInput from '@johmun/vue-tags-input'
import SelectTree from '@/components/pt/selectTree/index.vue'
import RelevanceList from './RelevanceTable.vue'
export default {
  name: 'AddOrEditForm',
  components: { Split, EditableCell, VueTagsInput, SelectTree, RelevanceList },
  props: {
    caseInfo: {
      type: Object,
    },
    estateOptions: {
      type: Array,
    },
    statusOptions: {
      type: Array,
    },
    activeId: {
      type: String,
    },
    versionOptions: {
      type: Array,
    },
  },
  data() {
    return {
      activeKey: '1',
      isHandleEdit: false,
      onSave: false, // 判断用户有没有点保存
      tags: [], // 标签组
      dataSource: [
        {
          key: 0,
          serial: 1,
          caseStep: '',
          expectedResult: '',
        },
      ],
      columns: [
        {
          title: '序号',
          width: '15%',
          dataIndex: 'serial',
        },
        {
          title: '用例步骤',
          dataIndex: 'caseStep',
          scopedSlots: { customRender: 'caseStep' },
        },
        {
          title: '预期结果',
          dataIndex: 'expectedResult',
          scopedSlots: { customRender: 'expectedResult' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '15%',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      defaultText: '描述方式',
      activeItem: '0', // dropdown 下拉列表元素
      codeStyle: 'vs2015', // 代码风格配色
      isShowModifyMarkdown: false,
      isShowMarkdownUi: false,
      markData: '', // 保存markdown的原始数据
      htmlData: '', // 保存markdown自动转换为html后的数据
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {
        caseName: '',
        module: '',
        tag: '',
        duty: '1',
        estate: '',
        status: '',
        mavonValue: '',
        description: '',
        expectResult: '',
        versionId: '',
        otherRemark: '',
      },
      options: [
        {
          key: '0',
          name: '步骤描述',
        },
        {
          key: '1',
          name: '文本描述',
        },
      ],
      // 责任人
      dutyOptions: [
        {
          id: '1',
          name: 'Admin',
        },
      ],
      caseRules: {
        caseName: [{ required: true, message: '用例名称不能为空', trigger: 'blur' }],
        module: [{ required: true, message: '所属模块不能为空', trigger: 'blur' }],
        duty: [{ required: true, message: '责任人不能为空', trigger: 'blur' }],
        estate: [{ required: true, message: '用例等级不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '用例状态不能为空', trigger: 'blur' }],
        versionId: [{ required: true, message: '版本选择不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {},
  watch: {
    caseInfo: {
      handler(val) {
        if (val.content) {
          this.isHandleEdit = true
          this.form = Object.assign(this.form, val.content)
          // this.tags = val.tags.split(',')
          this.$nextTick(() => {
            this.$refs.selectTree.handleValue(val.content.module)
          })
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find((item) => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    // 选择器选择的value发生改变
    changeTreeData(value) {
      this.form.module = value
    },
    // 删除步骤
    onDelete(key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter((item) => item.key !== key)
      this.getRearrange()
    },
    // 增加删除之后重新排序
    getRearrange() {
      this.dataSource.map((item, index) => {
        item.serial = index + 1
      })
    },
    // 任意位置新增步骤
    handleAdd(record) {
      const { dataSource } = this
      const newData = {
        serial: '',
        key: this.uuidv1(),
        caseStep: ``,
        expectedResult: ``,
      }
      dataSource.map((item, index) => {
        if (item.key === record.key) {
          this.dataSource.splice(index + 1, 0, newData)
        }
      })
      this.getRearrange()
    },
    // 下拉菜单点击
    dropItemClick(item) {
      this.activeItem = item.key
      this.defaultText = item.name
    },
    saveData(value, callback) {
      // markdown中的保存按钮
      // 保存数据，用于页面按钮操作的显示
      this.markData = value
      this.htmlData = callback
      console.log(this.markData) // markdown的原始数据
      console.log(this.htmlData) // markdown自动转换为html后的数据
    },
    saveDescriptionData() {},
    saveResultData() {},
    saveOtherData() {},
    modifyMarkdown() {
      this.isShowModifyMarkdown = true
    },
    showMarkdownUi() {
      this.isShowMarkdownUi = true
    },
    submitForm() {
      this.$refs.caseForm.validate((valid) => {
        if (valid) {
          this.onSave = true
          this.$message.success('保存成功')
          const id = this.uuidv1()
          this.$emit('onSave', { ...this.form, id })
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../function.less';
.ant-layout.ant-layout-has-sider {
  height: 100%;
}
/deep/ .ant-form-item-with-help {
  margin-bottom: 10px;
}
.markdown-body {
  width: 100%;
  margin: auto;
}
.v-note-wrapper {
  min-height: 0;
  max-height: 1000px;
}
// .ant-form {
//   margin-bottom: 52px;
// }
.case-content {
  height:720px;
  overflow-y: auto;
}
</style>
