<template>
  <div class="table-page-search-wrapper">
    <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-row :gutter="100">
        <a-col :md="7" :sm="24">
          <a-form-item label="场景ID">
            <a-input v-model="searchParam.sceneId" placeholder="请输入场景ID" allow-clear @keyup.enter.native="handleQuery"
              style="width: 250px" />
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-item label="场景名称">
            <a-input v-model="searchParam.name" placeholder="请输入场景名称" allow-clear @keyup.enter.native="handleQuery"
              style="width: 250px" />
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-item label="场景版本">
            <!-- <a-select v-model="searchParam.versionId" placeholder="全部版本" style="width: 250px"
              option-filter-prop="children" @change="onChangeVersion">
              <a-select-option v-for="(d, index) in versionOptions" :key="index" :value="d.id">
                {{ d.versionName }}
              </a-select-option>
            </a-select> -->
            <a-select v-model="searchParam.versionId" placeholder="请选择" style="width: 250px"
              option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(d, index) in versionOptions" :key="index" :value="d.id" @click="handleOptionClick(d)">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
          </span>
        </a-col>  
      </a-row>
      <a-row :gutter="100">
        <a-col :md="7" :sm="24">
          <a-form-item label="场景等级">
            <a-select v-model="searchParam.level" placeholder="请选择" style="width: 250px" allowClear>
              <a-select-option v-for="(d, index) in levelOptions" :key="index" :value="d.id">
                {{ d.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-item label="执行状态">
            <a-select v-model="searchParam.executeStatus" placeholder="请选择" style="width: 250px" allowClear>
              <a-select-option v-for="(d, index) in executionOptions" :key="index" :value="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-item label="执行结果">
            <a-select v-model="searchParam.executeResult" placeholder="请选择" style="width: 250px" allowClear>
              <a-select-option v-for="(d, index) in resultOptions" :key="index" :value="d.id">
                {{ d.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button style="margin-left: 10px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <!-- <a-col :md="8" :sm="24">
          <a-form-item label="创建人" v-if="advanced">
            <a-input v-model="searchParam.createByName" placeholder="请输入创建人" allow-clear @keyup.enter.native="handleQuery"
              style="width: 250px" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="责任人" v-if="advanced">
            <a-input v-model="searchParam.principalName" placeholder="请输入责任人" allow-clear @keyup.enter.native="handleQuery"
              style="width: 250px" />
          </a-form-item>
        </a-col> -->
        <a-col :md="7" :sm="24">
          <a-form-item label="创建人" v-if="advanced">
            <a-select v-model="searchParam.createByName" placeholder="请选择" style="width: 250px" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-item label="责任人" v-if="advanced">
            <a-select v-model="searchParam.principalName" placeholder="请选择" style="width: 250px" option-filter-prop="children" show-search allowClear>
              <a-select-option v-for="(d, index) in memberOptions" :key="index" :value="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7">
          <a-form-item label="创建时间">
            <a-range-picker v-model="createTime" :show-time="{ format: 'HH:mm:ss' }" style="width: 330px"
              format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" @change="onOk" @ok="onOk" allow-clear />
          </a-form-item>
        </a-col>
        <!-- <a-col>
          <span class="table-page-search-submitButtons" style="float: right">
            <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
            <a-button style="margin-left: 10px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-col> -->
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { levelOptions, statusOptions, executionOptions, resultOptions } from '@/utils/options'

export default {
  name: 'UiSearch',
  props: {
    memberOptions: {
      type: Array,
      required: true
    },
    versionOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // versionOptions: [],
      levelOptions,
      statusOptions,
      executionOptions,
      resultOptions,
      // memberOptions: [],
      advanced: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      createTime: undefined,
      searchParam: {
        sceneId: '',
        name: '',
        versionId: undefined,
        versionName: undefined,
        level: undefined,
        status: undefined,
        executeStatus: undefined,
        executeResult: undefined,
        createByName: undefined,
        principalName: undefined,
        createStartTime: '',
        createEndTime: '',
      }
    }
  },
  created() {
    // this.getAllUsers()
  },
  computed: {
    newSearchParam() {
      var newSearchParam = JSON.stringify(this.searchParam, (key, value) => {
        return typeof value === 'undefined' ? '' : value
      })
      return JSON.parse(newSearchParam)
    }
  },
  watch: {
    newSearchParam: {
      handler(newVal, oldVal) {
        let newValStr = JSON.stringify(newVal)
        let oldValStr = JSON.stringify(oldVal)
        // console.info(newValStr, oldValStr)
        if (newValStr !== oldValStr) {
          // console.info("符合条件，触发查询")
          this.$emit('changeParam', newVal)
        }
      },
      // deep: true,
      // immediate: true
    }
  },
  methods: {
    // // 获取系统的所有用户
    // getAllUsers() {
    //   projectApis.getAllUsersOfSystem().then((response) => {
    //     // this.createByNameOptions = response.data
    //     // console.info(this.createByNameOptions)
    //     const createByNameOptions = []
    //     response.data.forEach((item, index) => {
    //       createByNameOptions.push(item.name)
    //     })
    //     // console.info(membersData)
    //     this.createByNameOptions = createByNameOptions
    //   })
    // },
    // // 获取当前项目的所有版本
    // getAllVersions(projectId) {
    //   const queryParam = {
    //     projectId: projectId
    //   }
    //   projectApis.getEnvironmentList(queryParam).then((response) => {
    //     const versionOptions = []
    //     response.data.list.forEach((item, index) => {
    //       if (item.status === 1) {
    //         JSON.parse(item.versionConfig).forEach(version => {
    //           versionOptions.push(version.name)
    //           if (version.status === 1) {
    //             this.searchParam.versionName = version.name
    //           }
    //         })
    //       }
    //     })
    //     this.versionOptions = versionOptions
    //   })
    // },
    onChangeVersion(value) {
      // console.log('Clicked:', value)
      this.searchParam.versionId = value
      // this.searchParam.versionName = value
      // this.$emit('handleQuery', versionId)
    },
    handleOptionClick(option) {
      // console.log('Clicked:', option)
      this.searchParam.versionName = option.name
    },
    handleQuery() {
      this.$emit('handleQuery')
    },
    resetQuery() {
      this.createTime = undefined
      this.searchParam = {
        sceneId: '',
        name: '',
        versionId: undefined,
        versionName: undefined,
        level: undefined,
        status: undefined,
        executeStatus: undefined,
        executeResult: undefined,
        createByName: undefined,
        principalName: undefined,
        createStartTime: '',
        createEndTime: '',
      }
      this.$emit('resetQuery')
    },
    onOk(value) {
      // console.log(value);
      this.createTime = value
      this.searchParam.createStartTime = this.createTime[0]
      this.searchParam.createEndTime = this.createTime[1]
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  // max-width: calc(100% - 10px);
  padding: 10px 30px;
  padding-bottom: 0;
}
</style>