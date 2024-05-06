<template>
  <div class="advance">
    <a-tabs v-model="activeAdvance">
      <a-tab-pane key="1" tab="元素库" v-if="showElement">
        <advance-form
          v-if="showAddModal"
          ref="addvanceForm"
          :locateTypeOptions="locateTypeOptions"
          @ok="getList"
          @close="showAddModal = false"
        ></advance-form>
        <advance-table
          :columns="columns"
          :data-source="list"
          title=" "
          rowKey="id"
          @refresh="getList"
          :loading="loading"
          size="middle"
          tableKey="ui-advance-index-table"
          :format-conditions="true"
        >
          <div slot="button">
            <a-button size="small" @click="handleAdd()"> <a-icon type="plus" />创建元素 </a-button>
            <a-input-search
              style="width: 280px; margin-left: 10px"
              v-model="queryParam.elementName"
              placeholder="根据元素名称搜索"
              enter-button
              @search="handleQuery"
            />
          </div>
          <span slot="locateType" slot-scope="{ record }">
            {{ findNodeId(locateTypeOptions,record.locateType,'label') }}
          </span>
          <span slot="operation" slot-scope="{ record }">
            <a @click="handleUpdate(record, undefined)"> 编辑 </a>
          </span>
        </advance-table>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template slot="tab">
          <a-badge :count="preCount">
            <span>前置操作</span>
          </a-badge>
        </template>
        <AdvanceOperation
          @getPreCount="getCount"
          ref="advanceOperation"
          :treeData="treeData"
          :replaceFields="replaceFields"
        ></AdvanceOperation>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template slot="tab">
          <a-badge :count="postPCount">
            <span>后置操作</span>
          </a-badge>
        </template>
        <PostpOperation
          ref="postpOperation"
          @getPostPCount="getCount"
          :treeData="treeData"
          :replaceFields="replaceFields"
        >
        </PostpOperation>
      </a-tab-pane>
      <a-tab-pane key="4" tab="错误处理">
        <a-form-model :model="advanceForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="处理方式">
            <a-select v-model="advanceForm.way" placeholder="请选择" style="width: 220px" option-filter-prop="children">
              <a-select-option v-for="(d, index) in wayOptions" :key="index" :value="d.value">
                <span>{{ d.label }}</span>
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AdvanceForm from './AdvanceForm.vue'
import AdvanceOperation from './AdvanceOperation.vue'
import PostpOperation from './PostpOperation.vue'
import { wayOptions, locateTypeOptions } from '@/utils/options'
export default {
  name: 'Advance',
  props: {
    treeData: {
      type: Array
    },
    replaceFields: {
      type: Object
    },
    showElement: {
      type: Boolean,
      default: true
    }
  },
  components: { AdvanceTable, AdvanceForm, AdvanceOperation, PostpOperation },
  data() {
    return {
      activeAdvance: '2',
      wayOptions,
      preCount: 0,
      postPCount: 0,
      locateTypeOptions,
      queryParam: {
        elementName: ''
      },
      loading: false,
      list: [],
      showAddModal: false,
      columns: [
        {
          title: '元素名称',
          dataIndex: 'elementName',
          width: 100,
          ellipsis: true,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '定位类型',
          dataIndex: 'locateType',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'locateType' },
          align: 'center'
        },
        {
          title: '元素定位',
          dataIndex: 'locate',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      advanceForm: {
        way: '0'
      }
    }
  },
  created() {
  },
  watch: {
    activeAdvance: {
      handler(val) {
        if (val === '1') {
          this.getList()
        }
      },
      immediate: true
    }
  },
  methods: {
    getList() {
      this.showAddModal = false
      this.loading = true
      this.$http.get(`/ui/element/2`).then((response) => {
        this.list = response.result.list
        this.list.map((item) => {
          item.operation = item.remark
        })
        this.total = response.result.total
        this.loading = false
      })
    },
    getCount(type, val) {
      if (type === 0) {
        this.preCount = val
      } else {
        this.postPCount = val
      }
    },
    handleQuery() {
      this.getList()
    },
    // 步骤发生改变，清空列表
    changeTabActive() {
      this.activeAdvance = '2'
    },
    handleAdd(record) {
      this.showAddModal = true
      this.$nextTick(() => {
        this.$refs.addvanceForm.handleAdd(record)
      })
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => {
        this.$refs.addvanceForm.handleUpdate(record)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.advance {
  /deep/ .advanced-table .header-bar .button {
    text-align: left;
  }
  .advanced-table {
    min-height: calc(20vh - 100px);
  }
   /deep/ .ant-tabs-nav {
    padding-left: 26px;
  }
  /deep/ .ant-badge-count {
    right:-13px
  }
}
</style>
