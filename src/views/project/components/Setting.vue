<template>
  <div class="setting">
    <a-tabs v-model="activeKey">
      <a-tab-pane key="1" tab="通用配置">
        <div v-for="(item, index) in generalList" :key="index" style="margin-bottom: 10px">
            <a-row :gutter="8">
              <a-col :span="1">
                <div :style="{marginTop:index === 0 ? '35px' : 0}">
                  <a-checkbox :checked="item.checked==='0' ? true : false" 
                   @change="changeState('0',item)"
                   >
                  </a-checkbox>
                </div>
              </a-col>
              <a-col :span="6">
                <div class="general-header" v-show="index === 0">ip</div>
                <a-input v-model="item.ip" />
              </a-col>
              <a-col :span="7">
                <div class="general-header" v-show="index === 0">域名</div>
                <a-input v-model="item.domain" />
              </a-col>
              <a-col :span="6">
                <div class="general-header" v-show="index === 0">注释</div>
                <a-input v-model="item.description" />
              </a-col>
              <a-col :span="4">
                <a-button
                  type="primary"
                  v-show="index === generalList.length - 1"
                  shape="circle"
                  icon="plus"
                  @click="addGeneral(item, index)"
                  style="margin-right: 5px"
                  :style="{marginTop:index === 0 ? '30px' : 0}"
                />
                <a-button
                  type="danger"
                  shape="circle"
                  icon="delete"
                  v-show="generalList.length > 1"
                  :disabled="item.checked==='0' ? true : false"
                  @click="deleteGeneral(item, index)"
                  :style="{marginTop:index === 0 ? '30px' : 0}"
                />
              </a-col>
            </a-row>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="数据库配置">
        <a-form-model
          ref="dataBaseForm"
          :model="dataBaseForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="datebaseRule"
          class="data-setting"
        >
          <a-form-model-item label="数据源名称：" prop="dataSourceName">
            <a-input v-model="dataBaseForm.dataSourceName" placeholder="请输入数据源名称" />
          </a-form-model-item>
          <a-form-model-item label="数据库驱动：" prop="driver">
            <a-select v-model="dataBaseForm.driver" placeholder="请选择数据库驱动" option-filter-prop="children" @change="handleChange">
              <a-select-option v-for="(d, index) in driverOptions" :key="index" :value="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="数据库连接url：" prop="url">
            <a-input v-model="dataBaseForm.url" placeholder="请输入数据库连接url" />
          </a-form-model-item>
          <a-form-model-item label="用户名：" prop="username">
            <a-input v-model="dataBaseForm.username" placeholder="请输入用户名" />
          </a-form-model-item>
          <a-form-model-item label="密码：" prop="password">
            <a-input type="password" v-model="dataBaseForm.password" placeholder="请输入密码" />
          </a-form-model-item>
          <a-form-model-item label="最大连接数：" prop="maxActive">
            <a-input-number v-model="dataBaseForm.maxActive" />
          </a-form-model-item>
          <a-form-model-item label="超时时间(ms)：" prop="timeOut">
            <a-input-number v-model="dataBaseForm.timeOut" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="buttonWrapperCol">
            <a-space>
              <a-button type="primary" @click="checkDatabase">校验</a-button>
              <a-button type="primary" @click="addDatabase">添加</a-button>
            </a-space>
          </a-form-model-item>
        </a-form-model>
        <advance-table
          :columns="columns"
          :data-source="sysDataBaseConfigList"
          title=" "
          rowKey="id"
          size="middle"
          tableKey="setting-index-table"
          :format-conditions="true"
        >
         <span slot="checked" slot-scope="{ record }">
            <a-switch
            :checked="record.checked === '0' ? true : false"
             @change="onChangeStatus(record)"
             :disabled="record.checked==='0' ? true : false"
          />
          </span>
          <span slot="operation" slot-scope="{ record }">
            <a @click="delDataBase(record)">删除</a>
          </span>
        </advance-table>
      </a-tab-pane>
       <a-tab-pane key="3" tab="服务器配置">
          <div v-for="(item, index) in serverList" :key="index" style="margin-bottom: 10px">
            <a-row :gutter="8">
               <a-col :span="1">
                <div :style="{marginTop:index === 0 ? '35px' : 0}">
                  <a-checkbox 
                  :checked="item.checked==='0' ? true : false"
                   @change="changeState('1',item)"
                  >
                  </a-checkbox>
                </div>
               </a-col>
              <a-col :span="5">
                <div class="general-header" v-show="index === 0">主机</div>
                <a-input v-model="item.host" />
              </a-col>
              <a-col :span="5">
                <div class="general-header" v-show="index === 0">端口</div>
                <a-input v-model="item.port" />
              </a-col>
              <a-col :span="5">
                <div class="general-header" v-show="index === 0">用户名</div>
                <a-input v-model="item.username" />
              </a-col>
               <a-col :span="4">
                <div class="general-header" v-show="index === 0">密码</div>
                <a-input v-model="item.password" type="password"/>
              </a-col>
              <a-col :span="4">
                <a-button
                  type="primary"
                  v-show="index === serverList.length - 1"
                  shape="circle"
                  icon="plus"
                  @click="addSever(item, index)"
                  style="margin-right: 5px"
                  :style="{marginTop:index === 0 ? '30px' : 0}"
                />
                <a-button
                  type="danger"
                  shape="circle"
                  icon="delete"
                  v-show="serverList.length > 1"
                  :disabled="item.checked==='0' ? true : false"
                  @click="deleteSever(item, index)"
                  :style="{marginTop:index === 0 ? '30px' : 0}"
                />
              </a-col>
            </a-row>
          </div>
       </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import {checkDataBase} from '@/api/project'
export default {
  name: 'Setting',
  components: { AdvanceTable },
  props: {
    labelCol: {
      type: Object,
      default: null,
    },
    wrapperCol: {
      type: Object,
      default: null,
    },
    buttonWrapperCol: {
      type: Object,
      default: null,
    },
    generalList: {
      type: Array,
      required: true,
    },
    serverList:{
      type:Array,
      required:true
    },
    activeIndex:{
      type:Number,
      default:null
    },
    sysDataBaseConfigList: {
      type: Array,
      required: true,
    },
  },
  watch:{
    activeIndex:{
      handler(val) {
        // console.log(val);
        console.log(this.activeKey);
      },
    }
  },
  data() {
    return {
      dataBaseForm: {
        checked:'1',
        dataSourceName: '',
        driver: '',
        username: '',
        password: '',
        url: '',
        maxActive: 1,
        timeOut: 100000,
      },
      activeKey:'1',
      columns: [
        {
          title: '数据源名称',
          dataIndex: 'dataSourceName',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '数据库驱动',
          dataIndex: 'driver',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '数据库连接URL',
          dataIndex: 'url',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '用户名',
          dataIndex: 'username',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '最大连接数',
          dataIndex: 'maxActive',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '最大等待时间',
          dataIndex: 'timeOut',
          ellipsis: true,
          scopedSlots: { customRender: 'caseType' },
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'checked',
          ellipsis: true,
          scopedSlots: { customRender: 'checked' },
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      datebaseRule: {
        dataSourceName: [{ required: true, message: '数据源名称不能为空', trigger: 'blur' }],
        driver: [{ required: true, message: '数据库驱动不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '数据库连接url不能为空', trigger: 'blur' }],
        maxActive: [{ required: true, message: '项目最大连接数不能为空', trigger: 'blur' }],
        timeOut: [{ required: true, message: '超时时间不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
      driverOptions: [
        {
          name: 'com.mysql.jdbc.Driver',
          url: 'jdbc:mysql://127.0.0.1:3306/database',
        },
        {
          name: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
          url: 'jdbc:sqlserver://127.0.0.1:1433;DatabaseName=database',
        },
        {
          name: 'org.postgresql.Driver',
          url: 'jdbc:postgresql://127.0.0.1:5432/database',
        },
        {
          name: 'oracle.jdbc.OracleDriver',
          url: 'jdbc:oracle:thin:@192.168.2.1:1521:database',
        },
      ],
    }
  },
  methods: {
    addGeneral(item, index) {
      this.$emit('add', item, index)
    },
    deleteGeneral(item, index) {
      this.$emit('delete', item, index)
    },
    deleteSever(item,index) {
       this.$emit('deleteSever', item, index)
    },
    addSever(item,index) {
      this.$emit('addSever', item, index)
    },
    changeState(type,item) {
       this.$emit('changeState',type,item)
    },
    resetForm() {
      this.$refs.dataBaseForm.resetFields()
    },
    handleChange(value) {
     this.driverOptions.map((item,index) => {
      if (item.name===value) {
        this.dataBaseForm.url = item.url
      }
     })
    },
    // 添加数据库配置
    addDatabase() {
      this.$refs.dataBaseForm.validate((valid) => {
        if (valid) {
          this.$emit('addDataBase', this.dataBaseForm)
          this.resetForm()
        } else {
          return false
        }
      })
    },
    // 删除添加的数据库配置
    delDataBase(row) {
      this.$emit('delDataBase',row)
    },
    onChangeStatus(row) {
      this.$emit('onChangeStatus',row)
    },
    // 校验数据库配置
    checkDatabase() {
      this.$refs.dataBaseForm.validate((valid) => {
        if (valid) {
          checkDataBase(this.dataBaseForm).then(response => {
             this.$message.success('校验成功')
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import '../environment.less';
.ant-input-number {
  width: 170px;
}
/deep/ .ant-form-item-with-help {
  margin-bottom: 15px;
}
.data-setting {
  ::v-deep .ant-form-item-label {
    text-align: right;
  }
  ::v-deep .anticon {
    margin-top:0
  }
}
</style>
