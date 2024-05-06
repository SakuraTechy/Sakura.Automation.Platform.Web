<template>
  <div class="main-advance">
    <div style="padding: 10px">
      <a-select
        v-model="postPosition"
        placeholder="请选择"
        style="width: 220px; margin-right: 10px"
        option-filter-prop="children"
        @change="handleChange"
      >
        <a-select-option v-for="(d, index) in postPositionOptions" :key="index" :value="d.value">
          <span>{{ d.label }}</span>
        </a-select-option>
      </a-select>
      <a-button type="primary" @click="addPostposition"> 添加 </a-button>
    </div>
    <div style="padding: 10px" class="preposition">
      <a-collapse @change="changeActivekey">
        <a-collapse-panel v-for="(item, index) in postPositionList" :key="item.id">
          <template slot="header">
            <span class="index-circle">{{ index + 1 }}</span>
            <span>{{ item.name }}</span>
            <a-tooltip placement="topLeft" v-show="item.name === '后置脚本'">
              <template slot="title">
                <span>仅支持js脚本，设置的脚本将在浏览器执行</span>
              </template>
              <a-icon type="question-circle" style="margin-left: 10px; cursor: pointer" />
            </a-tooltip>
            <a-button type="danger" shape="circle" icon="delete" @click="delPreposition(item, index)" />
          </template>
          <div class="content">
            <div v-show="item.name === '等待时间'">
              <a-input-number v-model="item.form.time" style="width: 220px; margin-left: 10px" />ms
            </div>
            <div v-show="item.name === '后置脚本'">
              <a-form-model :model="item.form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 19 }">
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="脚本类型">
                      <a-select
                        v-model="item.form.scriptType"
                        placeholder="请选择"
                        style="width: 220px"
                        option-filter-prop="children"
                      >
                        <a-select-option v-for="(d, formIndex) in scriptTypeOptions" :key="formIndex" :value="d.value">
                          <span>{{ d.label }}</span>
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="10">
                    <a-form-model-item label="设置变量">
                      <a-select
                        v-model="item.form.setVariant"
                        placeholder="请选择"
                        style="width: 220px"
                        option-filter-prop="children"
                      >
                        <a-select-option v-for="(d, formIndex) in variantOptions" :key="formIndex" :value="d.value">
                          <span>{{ d.label }}</span>
                        </a-select-option>
                      </a-select>
                      <a-input
                        v-show="item.form.setVariant === '1'"
                        style="width: 160px; margin-left: 5px"
                        placeholder="变量名"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
              <Editor :codeId="item.id" @changeCode="saveCode"></Editor>
            </div>
            <div v-show="item.name === '数据提取'">
              <div style="padding: 10px">
                <a-select
                  v-model="item.form.fetchData"
                  placeholder="请选择"
                  style="width: 220px; margin-right: 10px"
                  option-filter-prop="children"
                >
                  <a-select-option v-for="(d, dataIndex) in dataOptions" :key="dataIndex" :value="d.value">
                    <span>{{ d.label }}</span>
                  </a-select-option>
                </a-select>
                <a-button type="primary" @click="addFetchData(item)"> 添加 </a-button>
              </div>
              <a-collapse>
                <a-collapse-panel v-for="(childItem, childIndex) in item.children" :key="childIndex">
                  <template slot="header">
                    <span class="index-circle" style="color: #69c242; border: 2px solid #69c242">{{
                      childIndex + 1
                    }}</span>
                    <span>{{ childItem.name }}</span>
                    <a-button
                      type="danger"
                      shape="circle"
                      icon="delete"
                      @click="delFetchData(index, childItem, childIndex)"
                    />
                  </template>
                  <div class="content">
                    <div v-show="childItem.name === '提取窗口信息'">
                      <a-select
                        v-model="childItem.childrenForm.window"
                        placeholder="请选择"
                        style="width: 220px; margin-right: 10px"
                        option-filter-prop="children"
                      >
                        <a-select-option v-for="(d, windowIndex) in windowOptions" :key="windowIndex" :value="d.value">
                          <span>{{ d.label }}</span>
                        </a-select-option>
                      </a-select>
                      <a-input
                        v-model="childItem.childrenForm.windowVariant"
                        style="width: 220px"
                        :placeholder="
                          childItem.childrenForm.window === '0' ? '请输入储存窗口变量' : '请输入储存网页标题变量'
                        "
                      ></a-input>
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          <span>将提取的内容保存到变量中</span>
                        </template>
                        <a-icon type="question-circle" style="margin-left: 10px; cursor: pointer" />
                      </a-tooltip>
                    </div>
                    <div v-show="childItem.name === '提取元素信息'">
                      <div>
                        <a-select
                          v-model="childItem.childrenForm.elementObject"
                          placeholder="请选择"
                          style="width: 220px; margin-right: 10px"
                          option-filter-prop="children"
                        >
                          <a-select-option
                            v-for="(d, dataIndex) in elementInfoOptions"
                            :key="dataIndex"
                            :value="d.value"
                          >
                            <span>{{ d.label }}</span>
                          </a-select-option>
                        </a-select>
                        <a-input
                          v-model="childItem.childrenForm.variant"
                          style="width: 220px"
                          placeholder="请输入变量名"
                        ></a-input>
                        <a-tooltip placement="topLeft">
                          <template slot="title">
                            <span>将提取的内容保存到变量中</span>
                          </template>
                          <a-icon type="question-circle" style="margin-left: 10px; cursor: pointer" />
                        </a-tooltip>
                      </div>
                      <div style="margin: 10px 0" v-show="childItem.childrenForm.elementObject === '0'">
                        <a-input
                          v-model="childItem.childrenForm.normalObject"
                          style="width: 320px; margin-right: 10px"
                          placeholder="普通对象"
                        ></a-input>
                        <a-checkbox v-model="childItem.childrenForm.stringTypeChecked">是否为字符串类型</a-checkbox>
                        <a-tooltip placement="topLeft">
                          <template slot="title">
                            <span
                            >如字符串、数字、json对象、数组等；注意：作为对象类型存储时如果不是一个合法的 js
                              对象类型（如非法特殊字符、空格影响），可能会生成报告失败</span
                            >
                          </template>
                          <a-icon type="question-circle" style="margin-left: 10px; cursor: pointer" />
                        </a-tooltip>
                      </div>
                      <div
                        style="margin: 10px 0"
                        v-show="
                          childItem.childrenForm.elementObject === '1' ||
                            childItem.childrenForm.elementObject === '2' ||
                            childItem.childrenForm.elementObject === '3'
                        "
                      >
                        <a-select
                          v-model="childItem.childrenForm.operateObject"
                          placeholder="请选择"
                          style="width: 220px"
                          option-filter-prop="children"
                        >
                          <a-select-option v-for="(d, dataIndex) in objectOptions" :key="dataIndex" :value="d.value">
                            {{ d.label }}
                          </a-select-option>
                        </a-select>
                        <a-tree-select
                          v-model="childItem.childrenForm.module"
                          v-show="childItem.childrenForm.operateObject === '0'"
                          style="width: 220px; margin: 0 10px"
                          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                          :tree-data="treeData"
                          placeholder="请选择"
                          :replaceFields="replaceFields"
                          tree-default-expand-all
                        >
                        </a-tree-select>
                        <a-input
                          v-model="childItem.childrenForm.element"
                          placeholder="（未选择元素）"
                          style="width: 200px"
                          v-show="childItem.childrenForm.operateObject === '0'"
                        />
                        <a-select
                          v-show="childItem.childrenForm.operateObject === '1'"
                          v-model="childItem.childrenForm.locateType"
                          placeholder="请选择"
                          style="width: 220px; margin: 0 10px"
                          option-filter-prop="children"
                        >
                          <a-select-option
                            v-for="(d, dataIndex) in locateTypeOptions"
                            :key="dataIndex"
                            :value="d.value"
                          >
                            {{ d.label }}
                          </a-select-option>
                        </a-select>
                        <a-input
                          v-show="childItem.childrenForm.operateObject === '1'"
                          v-model="childItem.childrenForm.locate"
                          style="width: 220px"
                          placeholder="定位"
                        />
                      </div>
                      <div v-show="childItem.childrenForm.elementObject === '4'" style="margin: 10px 0">
                        <a-input style="width: 220px" disabled v-model="childItem.childrenForm.xpathLocation"></a-input>
                        <a-input
                          style="width: 220px; margin: 0 10px"
                          disabled
                          v-model="childItem.childrenForm.xpathLocate"
                        ></a-input>
                        <a-input
                          style="width: 220px"
                          placeholder="xpath路径"
                          v-model="childItem.childrenForm.xpath"
                        ></a-input>
                        <a-tooltip placement="topLeft">
                          <template slot="title">
                            <span>只支持 xpath 方式的元素定位，返回的是一个数值</span>
                          </template>
                          <a-icon type="question-circle" style="margin-left: 10px; cursor: pointer" />
                        </a-tooltip>
                      </div>
                      <div v-show="childItem.childrenForm.elementObject === '3'">
                        <a-input
                          style="width: 420px"
                          v-model="childItem.childrenForm.elementAttribute"
                          placeholder="元素属性"
                        ></a-input>
                        <a-tooltip placement="topLeft">
                          <template slot="title">
                            <span>如元素的 name 属性，id 属性，value 属性等</span>
                          </template>
                          <a-icon type="question-circle" style="margin-left: 10px; cursor: pointer" />
                        </a-tooltip>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
            <div v-show="item.name === '断言'">
              <div style="padding: 10px">
                <a-select
                  v-model="item.form.assertData"
                  placeholder="请选择"
                  style="width: 220px; margin-right: 10px"
                  option-filter-prop="children"
                >
                  <a-select-option v-for="(d, dataIndex) in assertOptions" :key="dataIndex" :value="d.value">
                    <span>{{ d.label }}</span>
                  </a-select-option>
                </a-select>
                <a-button type="primary" @click="addAssertData(item)"> 添加 </a-button>
              </div>
              <a-collapse>
                <a-collapse-panel v-for="(childItem, childIndex) in item.children" :key="childIndex">
                  <template slot="header">
                    <span class="index-circle" style="color: #69c242; border: 2px solid #69c242">{{
                      childIndex + 1
                    }}</span>
                    <span>{{ childItem.name }}</span>
                    <a-button
                      type="danger"
                      shape="circle"
                      icon="delete"
                      @click="delFetchData(index, childItem, childIndex)"
                    />
                  </template>
                  <div class="content">
                    <div v-show="childItem.name === '断言值'">
                      <a-input
                        v-model="childItem.childrenForm.variant"
                        style="width: 320px;margin-right:10px"
                        placeholder="请输入变量"
                      ></a-input>
                      <a-input
                        v-model="childItem.childrenForm.expectValue"
                        style="width: 320px"
                        placeholder="请输入期望值"
                      ></a-input>
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          <span>断言变量与期望值是否匹配</span>
                        </template>
                        <a-icon type="question-circle" style="margin:0 10px; cursor: pointer" />
                      </a-tooltip>
                      <a-checkbox v-model="childItem.childrenForm.failEndChecked">失败终止</a-checkbox>
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          <span>勾选表示为硬断言（assert），如果断言失败，程序会终止。 不勾选表示为软断言（verify），如果断言失败，程序不会终止。</span>
                        </template>
                        <a-icon type="question-circle" style="margin:0 10px; cursor: pointer" />
                      </a-tooltip>
                    </div>
                    <div v-show="childItem.name === '弹窗文本'">
                      <a-select
                        v-model="childItem.childrenForm.text"
                        placeholder="请选择"
                        style="width: 220px; margin-right: 10px"
                        option-filter-prop="children"
                        disabled
                      >
                        <a-select-option
                          v-for="(d, dataIndex) in textInfoOptions"
                          :key="dataIndex"
                          :value="d.value"
                        >
                          <span>{{ d.label }}</span>
                        </a-select-option>
                      </a-select>
                      <a-input
                        v-model="childItem.childrenForm.expectText"
                        style="width: 320px"
                        placeholder="请输入期望的弹窗文本"
                      ></a-input>
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          <span>仅支持弹窗文本的断言 选择是，则断言成功后会点击弹窗上的确认按钮 选择否，则断言成功后不点击任何按钮</span>
                        </template>
                        <a-icon type="question-circle" style="margin: 0 10px; cursor: pointer" />
                      </a-tooltip>
                      <a-checkbox v-model="childItem.childrenForm.failEndChecked" disabled>失败终止</a-checkbox>
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          <span>勾选表示为硬断言（assert），如果断言失败，程序会终止。 不勾选表示为软断言（verify），如果断言失败，程序不会终止。</span>
                        </template>
                        <a-icon type="question-circle" style="margin:0 10px; cursor: pointer" />
                      </a-tooltip>
                    </div>
                    <div v-show="childItem.name === '网页标题'">
                      <a-input
                        v-model="childItem.childrenForm.expectWebTitle"
                        style="width: 420px"
                        placeholder="请输入期望的网页标题"
                      ></a-input>
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          <span>断言当前窗口的标题是否跟期望值一致，完全匹配则断言成功，否则失败</span>
                        </template>
                        <a-icon type="question-circle" style="margin: 0 10px; cursor: pointer" />
                      </a-tooltip>
                      <a-checkbox v-model="childItem.childrenForm.failEndChecked">失败终止</a-checkbox>
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          <span>勾选表示为硬断言（assert），如果断言失败，程序会终止。 不勾选表示为软断言（verify），如果断言失败，程序不会终止。</span>
                        </template>
                        <a-icon type="question-circle" style="margin:0 10px; cursor: pointer" />
                      </a-tooltip>
                    </div>
                    <div v-show="childItem.name === '下拉框'">
                      <div style="margin: 10px 0">
                        <a-select
                          v-model="childItem.childrenForm.operateObject"
                          placeholder="请选择"
                          style="width: 220px"
                          option-filter-prop="children"
                        >
                          <a-select-option v-for="(d, dataIndex) in objectOptions" :key="dataIndex" :value="d.value">
                            {{ d.label }}
                          </a-select-option>
                        </a-select>
                        <a-tree-select
                          v-model="childItem.childrenForm.module"
                          v-show="childItem.childrenForm.operateObject === '0'"
                          style="width: 220px; margin: 0 10px"
                          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                          :tree-data="treeData"
                          placeholder="请选择"
                          :replaceFields="replaceFields"
                          tree-default-expand-all
                        >
                        </a-tree-select>
                        <a-input
                          v-model="childItem.childrenForm.element"
                          placeholder="（未选择元素）"
                          style="width: 200px;margin-right:10px"
                          v-show="childItem.childrenForm.operateObject === '0'"
                        />
                        <a-select
                          v-show="childItem.childrenForm.operateObject === '1'"
                          v-model="childItem.childrenForm.locateType"
                          placeholder="请选择"
                          style="width: 220px; margin: 0 10px"
                          option-filter-prop="children"
                        >
                          <a-select-option
                            v-for="(d, dataIndex) in locateTypeOptions"
                            :key="dataIndex"
                            :value="d.value"
                          >
                            {{ d.label }}
                          </a-select-option>
                        </a-select>
                        <a-input
                          v-show="childItem.childrenForm.operateObject === '1'"
                          v-model="childItem.childrenForm.locate"
                          style="width: 220px;margin-right:10px"
                          placeholder="定位"
                        />
                        <a-checkbox v-model="childItem.childrenForm.failEndChecked">失败终止</a-checkbox>
                        <a-tooltip placement="topLeft">
                          <template slot="title">
                            <span>勾选表示为硬断言（assert），如果断言失败，程序会终止。 不勾选表示为软断言（verify），如果断言失败，程序不会终止。</span>
                          </template>
                          <a-icon type="question-circle" style="margin:0 10px; cursor: pointer" />
                        </a-tooltip>
                      </div>
                      <div>
                        <a-select
                          v-model="childItem.childrenForm.expectElement"
                          placeholder="请选择"
                          style="width: 220px; margin-right: 10px"
                          option-filter-prop="children"
                        >
                          <a-select-option
                            v-for="(d, dataIndex) in expectsSelectOptions"
                            :key="dataIndex"
                            :value="d.value"
                          >
                            <span>{{ d.label }}</span>
                          </a-select-option>
                        </a-select>
                        <a-input
                          v-model="childItem.childrenForm.expectValue"
                          style="width: 320px"
                          placeholder="期望值"
                        ></a-input>
                      </div>
                    </div>
                    <div v-show="childItem.name === '元素断言'">
                      <div style="margin: 10px 0">
                        <a-select
                          v-model="childItem.childrenForm.operateObject"
                          placeholder="请选择"
                          style="width: 220px"
                          option-filter-prop="children"
                        >
                          <a-select-option v-for="(d, dataIndex) in objectOptions" :key="dataIndex" :value="d.value">
                            {{ d.label }}
                          </a-select-option>
                        </a-select>
                        <a-tree-select
                          v-model="childItem.childrenForm.module"
                          v-show="childItem.childrenForm.operateObject === '0'"
                          style="width: 220px; margin: 0 10px"
                          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                          :tree-data="treeData"
                          placeholder="请选择"
                          :replaceFields="replaceFields"
                          tree-default-expand-all
                        >
                        </a-tree-select>
                        <a-input
                          v-model="childItem.childrenForm.element"
                          placeholder="（未选择元素）"
                          style="width: 200px;margin-right:10px"
                          v-show="childItem.childrenForm.operateObject === '0'"
                        />
                        <a-select
                          v-show="childItem.childrenForm.operateObject === '1'"
                          v-model="childItem.childrenForm.locateType"
                          placeholder="请选择"
                          style="width: 220px; margin: 0 10px"
                          option-filter-prop="children"
                        >
                          <a-select-option
                            v-for="(d, dataIndex) in locateTypeOptions"
                            :key="dataIndex"
                            :value="d.value"
                          >
                            {{ d.label }}
                          </a-select-option>
                        </a-select>
                        <a-input
                          v-show="childItem.childrenForm.operateObject === '1'"
                          v-model="childItem.childrenForm.locate"
                          style="width: 220px;margin-right:10px"
                          placeholder="定位"
                        />
                        <a-checkbox v-model="childItem.childrenForm.failEndChecked">失败终止</a-checkbox>
                        <a-tooltip placement="topLeft">
                          <template slot="title">
                            <span>勾选表示为硬断言（assert），如果断言失败，程序会终止。 不勾选表示为软断言（verify），如果断言失败，程序不会终止。</span>
                          </template>
                          <a-icon type="question-circle" style="margin:0 10px; cursor: pointer" />
                        </a-tooltip>
                      </div>
                      <div>
                        <a-select
                          v-model="childItem.childrenForm.expectElement"
                          placeholder="请选择"
                          style="width: 220px; margin-right: 10px"
                          option-filter-prop="children"
                        >
                          <a-select-option
                            v-for="(d, dataIndex) in expectElementOptions"
                            :key="dataIndex"
                            :value="d.value"
                          >
                            <span>{{ d.label }}</span>
                          </a-select-option>
                        </a-select>
                        <a-input
                          v-model="childItem.childrenForm.expectValue"
                          style="width: 320px"
                          :disabled="!(childItem.childrenForm.expectElement==='6'||childItem.childrenForm.expectElement==='7'||childItem.childrenForm.expectElement==='8')"
                          placeholder="期望值"
                        ></a-input>
                      </div>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
import {
  postPositionOptions,
  assertOptions,
  scriptTypeOptions,
  variantOptions,
  dataOptions,
  windowOptions,
  objectOptions,
  locateTypeOptions,
  elementInfoOptions,
  expectsSelectOptions,
  expectElementOptions
} from '@/utils/options'
import Editor from '@/components/pt/editor'
export default {
  name: 'PostpOperation',
  components: { Editor },
  props: {
    treeData: {
      type: Array
    },
    replaceFields: {
      type: Object
    },
    showElement: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postPositionOptions,
      locateTypeOptions,
      objectOptions,
      scriptTypeOptions,
      assertOptions,
      variantOptions,
      dataOptions,
      windowOptions,
      elementInfoOptions,
      expectsSelectOptions,
      expectElementOptions,
      postPositionList: [],
      selectedValue: '后置脚本',
      postPosition: '0',
      textInfoOptions: [
        {
          label: '是',
          value: '0'
        },
         {
          label: '否',
          value: '1'
        }
      ]
    }
  },
  methods: {
    handleChange(value) {
      this.postPositionOptions.map((item, index) => {
        if (item.value === value) {
          this.selectedValue = item.label
        }
      })
    },
    // 添加断言内容
    addAssertData(item) {
      let title
      let childrenForm
      const assertValueForm = {
        variant: '',
        expectValue: '',
        failEndChecked: true
      }
      const textForm = {
        text: '0',
        expectText: '',
        failEndChecked: true
      }
      const elementAssertForm = {
        operateObject: '0',
        module: '',
        element: '',
        locateType: '',
        locate: '',
        failEndChecked: true,
        expectElement: '',
        expectValue: ''
      }
      const selectForm = {
        operateObject: '0',
        module: '',
        element: '',
        locateType: '',
        locate: '',
        failEndChecked: true,
        expectElement: '0',
        expectValue: ''
      }
      const webTitleForm = {
        expectWebTitle: '',
        failEndChecked: true
      }
      switch (item.form.assertData) {
        case '0':
          title = '断言值'
          childrenForm = assertValueForm
          break
           case '1':
          title = '弹窗文本'
          childrenForm = textForm
          break
           case '2':
          title = '元素断言'
          childrenForm = elementAssertForm
          break
           case '3':
          title = '下拉框'
          childrenForm = selectForm
          break
           case '4':
          title = '网页标题'
          childrenForm = webTitleForm
          break
        default:
          title = ''
          childrenForm = {}
      }
      item.children.push({
        name: title,
        childrenForm
      })
    },
    // 添加数据提取内容
    addFetchData(item) {
      const title = item.form.fetchData === '0' ? '提取窗口信息' : '提取元素信息'
      const windowForm = {
        window: '0',
        windowVariant: ''
      }
      const elementForm = {
        elementObject: '0',
        variant: '',
        normalObject: '',
        stringTypeChecked: false,
        operateObject: '0',
        module: '',
        element: '',
        locateType: '',
        locate: '',
        xpathLocation: '元素定位',
        xpathLocate: 'xpath',
        xpath: '',
        elementAttribute: ''
      }
      const childrenForm = item.form.fetchData === '0' ? windowForm : elementForm
      item.children.push({
        name: title,
        childrenForm
      })
    },
    // 删除数据提取内容
    delFetchData(index, childItem, childIndex) {
      this.postPositionList.map((item, i) => {
        if (index === i) {
          item.children.splice(childIndex, 1)
        }
      })
    },
    // 添加后置操作
    addPostposition() {
      const timeForm = {
        time: ''
      }
      const actionScript = {
        scriptType: '0',
        setVariant: '0',
        code: ''
      }
      const dataForm = {
        fetchData: '0'
      }
      const assertForm = {
        assertData: '0'
      }
      const children = []
      const form =
        this.postPosition === '0'
          ? actionScript
          : this.postPosition === '1'
          ? timeForm
          : this.postPosition === '2'
          ? assertForm
          : dataForm
      this.postPositionList.push({
        id: this.uuidv1(),
        name: this.selectedValue,
        form,
        children
      })
      this.$emit('getPostPCount', 1, this.postPositionList.length)
    },
    // 删除后置操作
    delPreposition(item, index) {
      this.postPositionList.splice(index, 1)
      this.$emit('getPostPCount', 1, this.postPositionList.length)
    },
    saveCode(code, codeId) {
      this.postPositionList.map((item, index) => {
        if (item.id === codeId) {
         if (item.form.scriptType) {
          item.form.code = code
         }
        }
      })
    },
    changeActivekey(key) {
    }
  }
}
</script>

<style lang="less" scoped>
.main-advance {
  margin: 0 20px;
}
.preposition .ant-btn-circle {
  width: 30px;
  border-radius: 50%;
  min-width: 0;
  padding: 0 8px;
  line-height: 16px;
  text-align: center;
  float: right;
}
.content {
  padding: 10px;
}
.index-circle {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 18px;
  margin: 0 5px;
  border-radius: 50%;
  font-weight: 700;
  color: #2f54eb;
  border: 2px solid #2f54eb;
  text-align: center;
}
</style>
