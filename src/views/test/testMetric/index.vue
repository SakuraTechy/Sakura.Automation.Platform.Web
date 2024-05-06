<template>
  <div>
    <tab-list style="margin-top: 0px" ref="sceneList" :tab="tab0" activeKey="0" @setActiveKey="setActiveKey">
      <template :slot="tab0.tab0.name">
        <div class="card-grid-container">
          <div class="small-item">
            <a-select
              style="width: 250px"
              v-model="queryParam.ui.projectId"
              placeholder="请选择项目"
              option-filter-prop="children"
              @change="handleChangeProject"
              show-search
              allowClear
            >
              <a-select-option v-for="(item, index) in projectOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select
              style="width: 150px; margin-left: 10px"
              v-model="queryParam.ui.versionId"
              placeholder="请选择版本"
              option-filter-prop="children"
              @change="handleChangeVersion"
              show-search
            >
              <a-select-option v-for="(item, index) in versionOptions" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <!-- 第一行 -->
          <!-- <UITestEcharts  class="card-grid-item large-item" ref="echarts" :record="record" :key="tabKey" /> -->
          <!-- <UITestEcharts :loading="loading" class="card-grid-item large-item" ref="echarts" :record="record" :key="tabKey" /> -->
          <a-card v-if="loading2" title="功能模块数量统计" class="card-container">
            <template #extra>
              <!-- <a-tooltip placement="top">
                <template #title>
                  <span>统计当前产品版本下所添加的功能模块，默认从全部场景下第一级模块开始统计，详情请查看UI自动化模块</span>
                </template>
                <a-icon type="question-circle" style="font-size: 18px;" />
              </a-tooltip> -->
              <a-popover title="计算规则" placement="top">
                <template #content>
                  <span>统计当前产品版本下所添加的功能模块，默认从全部场景下第一级模块开始统计，详情请查看UI自动化模块</span>
                </template>
                <a-icon type="question-circle" style="font-size: 18px;" />
              </a-popover>
            </template>
            <UITestEcharts 
              class="card-grid-item large-item"
              ref="echarts"
              :seriesData="ui.functionalModule"
              :key="tabKey"
            />
          </a-card>
          <a-card v-if="loading2" title="测试场景数量统计" class="card-container">
            <template #extra>
              <a-popover title="计算规则" placement="topRight">
                <template #content>
                  <span>统计当前产品版本下所添加的测试场景，默认根据场景等级分别进行统计，详情请查看UI自动化模块</span>
                </template>
                <a-icon type="question-circle" style="font-size: 18px;" />
              </a-popover>
            </template>
            <UITestEcharts 
              class="card-grid-item large-item"
              ref="echarts"
              :seriesData="ui.automationScene"
              :key="tabKey"
            />
          </a-card>
          <!-- 第二行 -->
          <a-card v-if="loading2" title="自动化测试执行情况统计" class="card-grid-item large-item">
            <template #extra>
              <a-popover title="计算规则" placement="topRight">
                <template #content>
                  <span>统计当前产品版本下自动化运行次数和测试场景执行情况，详情请查看测试报告模块</span>
                </template>
                <a-icon type="question-circle" style="font-size: 18px" />
              </a-popover>
            </template>
            <div class="card-grid-container1">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">历史运行总次数（次）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="topRight">
                      <template #content>
                        <span>统计当前产品版本下自动化运行次数，分别根据历史，周，月，年进行统计，详情请查看测试报告模块</span>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <!-- <span class="text-grid-text1">600</span> -->
                  <span class="text-grid-text1">{{
                    this.findJsonArray(this.ui.automationExecute.runInCustomList, 'name', '历史', 'total')
                  }}</span>
                  <div class="text-grid-container1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周（次）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.runInCustomList, 'name', '本周', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.runInCustomList, 'name', '本周', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月（次）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.runInCustomList, 'name', '本月', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.runInCustomList, 'name', '本月', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年（次）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.runInCustomList, 'name', '本年', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.runInCustomList, 'name', '本年', 'total')}}
                      </span> -->
                    </div>
                  </div>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">历史执行总数量（个）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="top">
                      <template #content>
                        <span>统计当前产品版本下测试场景执行情况，分别根据历史，周，月，年进行统计，详情请查看测试报告模块</span>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text1">{{
                    this.findJsonArray(this.ui.automationExecute.exeInCustomList, 'name', '历史', 'total')
                  }}</span>
                  <div class="text-grid-container1_1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周（个）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.exeInCustomList, 'name', '本周', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.exeInCustomList, 'name', '本周', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月（个）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.exeInCustomList, 'name', '本月', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.exeInCustomList, 'name', '本月', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年（个）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.exeInCustomList, 'name', '本年', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.exeInCustomList, 'name', '本年', 'total')}}
                      </span> -->
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
            <div class="card-grid-container2">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">自动化覆盖率（本周）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="topLeft">
                      <template #content>
                        <p>指标定义：计算本周内自动化测试场景所覆盖代码行数或功能模块区域的百分比，可计算单次或多次</p>
                        <p>计算公式1：自动化测试覆盖的代码行数 / 总代码行数 * 100%（单次）</p>
                        <p>示例1：假设一个项目版本共有10000行代码，其中自动化测试覆盖了7000行，则自动化测试覆盖率为7000/10000*100%=70%</p>
                        <p>计算公式2：自动化测试覆盖的功能点数 / 总功能点数 * 100%（单次）</p>
                        <p>示例2：假设一个项目版本共有61个功能模块，其中自动化测试覆盖了58个，则测试覆盖率为 58/61*100%=95.08% </p>
                        <p>计算公式3：(每一次自动化测试覆盖的功能点数之和 / 总功能点数) / 次数 * 100%（多次）</p>
                        <p>示例3：假设一个项目版本共有61个功能模块，在本周内共进行了2次自动化测试，分别如下：</p>
                        <p style="margin-left: 15px;">1. 第一次自动化测试覆盖了30个，则自动化测试覆盖率为 30/61*100%≈49.18% </p>
                        <p style="margin-left: 15px;">2. 第二次自动化测试覆盖了50个，则自动化测试覆盖率为 50/61*100%≈81.96%</p>
                        <p style="margin-left: 15px;">3. 计算2次的平均自动化覆盖率，则自动化测试覆盖率为（(30+50)/61)/2*100%≈65.57%</p>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text">{{
                    this.findJsonArray(this.ui.automationExecute.rateInCustomList, 'name', '本周', 'coverRate')
                  }}</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">自动化通过率（本周）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="top">
                      <template #content>
                        <p>指标定义：计算本周内自动化测试（通过的场景数量/总数量）的百分比，可计算单次或多次</p>
                        <p>计算公式1：自动化测试场景通过的数量 / 总数量 * 100%（单次）</p>
                        <p>示例1：假设一个项目版本运行了1次自动化测试，共执行了61个测试场景，通过了58个，则测试通过率为 58/61*100%=95.08%</p>
                        <p>计算公式2：(每一次自动化测试场景通过的数量之和 / 总数量) / 次数 * 100%（多次）</p>
                        <p>示例2：假设一个项目版本共有61个测试场景，在本周内共进行了2次自动化测试，分别如下：</p>
                        <p style="margin-left: 15px;">1. 第一次自动化测试通过了30个，则自动化测试通过率为 30/61*100%≈49.18%</p>
                        <p style="margin-left: 15px;">2. 第二次自动化测试通过了50个，则自动化测试通过率为 50/61*100%≈81.96%</p>
                        <p style="margin-left: 15px;">3. 计算2次的平均自动化通过率，则自动化测试通过率为（(30+50)/61)/2*100%≈65.57%</p>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text">{{
                    this.findJsonArray(this.ui.automationExecute.rateInCustomList, 'name', '本周', 'passeRate')
                  }}</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">自动化执行率（本周）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="top">
                      <template #content>
                        <p>指标定义：计算本周内自动化测试（执行完成的场景数量/总耗时）的执行速度，可计算单次或多次</p>
                        <p>计算公式1：自动化测试执行完成的场景数量 / 总耗时（小时或天）（单次）</p>
                        <p>示例1：假设在一次项目版本自动化测试中，执行了100个测试场景用例，总耗时2个小时，则测试执行率100 / 2 = 50个/小时</p>
                        <p>计算公式2：(每一次自动化测试场景通过的数量之和 / 总耗时) / 次数 * 100%（多次）</p>
                        <p>示例2：假设一个项目版本，在本周内共进行了2次自动化测试，分别如下：</p>
                        <p style="margin-left: 15px;">1. 第一次自动化测试执行了100个，总耗时2个小时，则自动化测试通过率为 100 / 2 = 50个/小时</p>
                        <p style="margin-left: 15px;">2. 第二次自动化测试执行了200个，总耗时4个小时，则自动化测试通过率为 200 / 4 = 50个/小时</p>
                        <p style="margin-left: 15px;">3. 计算2次的平均自动化执行率，则自动化测试执行率为（100+200)/(2+4)= 50个/小时</p>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <div class="text-grid-container2_3">
                    <span class="text-grid-text">{{
                      this.findJsonArray(this.ui.automationExecute.rateInCustomList, 'name', '本周', 'executeRate')
                    }}</span>
                    <span class="text-grid-text2"> 个/小时</span>
                  </div>
                </div>
              </a-card>
            </div>
          </a-card>
          <a-card v-if="loading2" title="自动化测试价值产出统计" class="card-grid-item large-item">
            <template #extra>
              <a-popover title="计算规则" placement="topRight">
                <template #content>
                  <span>统计当前产品版本下发现缺陷和人力节省情况，详情请查看测试报告模块</span>
                </template>
                <a-icon type="question-circle" style="font-size: 18px" />
              </a-popover>
            </template>
            <div class="card-grid-container1">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">历史发现总缺陷（个）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="top">
                      <template #content>
                        <span>统计当前产品版本下缺陷发现情况，分别根据历史，周，月，年进行统计，详情请查看测试报告模块</span>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text1">{{ this.findJsonArray(this.ui.automationExecute.defectCustomList, 'name', '历史', 'total') }}</span>
                  <div class="text-grid-container1_1">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周（个）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.defectCustomList, 'name', '本周', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.defectCustomList, 'name', '本周', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月（个）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.defectCustomList, 'name', '本月', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.defectCustomList, 'name', '本月', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年（个）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.defectCustomList, 'name', '本年', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.defectCustomList, 'name', '本年', 'total')}}
                      </span> -->
                    </div>
                  </div>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">历史节省总人力（人/天）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="topRight">
                      <template #content>
                        <p>指标定义：按业界测试场景用例执行效率平均标准，计算每执行一次自动化测试场景用例的所节省的人力，单位可以是（人/天）</p>
                        <p>计算公式：总测试场景用例数量 / 平均每天执行场景/用例数 = (x）人/天</p>
                        <p>示例：假设正常一个版本转测试，总计58个测试场景用例，按业界平均场景/用例执行效率70条/人/天计算，则需要 58/70≈0.82人/天</p>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text1">{{ this.findJsonArray(this.ui.automationExecute.labInCustomList, 'name', '历史', 'total') }}</span>
                  <div class="text-grid-container1_1_2">
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本周（人/天）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.labInCustomList, 'name', '本周', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.labInCustomList, 'name', '本周', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本月（人/天）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.labInCustomList, 'name', '本月', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.labInCustomList, 'name', '本月', 'total')}}
                      </span> -->
                    </div>
                    <div class="text-grid-container1_2">
                      <span class="text-grid-title">本年（人/天）</span>
                      <div class="text-grid-icon">
                        <span class="text-grid-text">
                          {{this.findJsonArray(this.ui.automationExecute.labInCustomList, 'name', '本年', 'total')}}
                        </span>
                        <img :src="icon" class="text-grid-icon">
                      </div>
                      <!-- <span class="text-grid-text">
                        +{{this.findJsonArray(this.ui.automationExecute.labInCustomList, 'name', '本年', 'total')}}
                      </span> -->
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
            <div class="card-grid-container2">
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">缺陷发现率（本周）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="top">
                      <template #content>
                        <p>指标定义：计算本周内自动化测试（缺陷发现数量/测试场景总数）的比率，可计算单次或多次</p>
                        <p>计算公式1：自动化测缺陷发现数 / 测试场景总数 × 100%（单次）</p>
                        <p>示例1：假设在一次项目版本自动化测试中，执行了100个测试场景，发现了25个缺陷，则缺陷发现率为 25 / 100 × 100% = 25%</p>
                        <p>计算公式2：(每一次自动化测缺陷发现数之和 / 总数量) / 次数 * 100%（多次）</p>
                        <p>示例2：假设一个项目版本在本月内共进行了2次自动化测试，分别如下：</p>
                        <p style="margin-left: 15px;">1. 第一次自动化测试执行了100个，发现了25个缺陷，则自动化测试缺陷发现率为 25 / 100 × 100% = 25%</p>
                        <p style="margin-left: 15px;">2. 第二次自动化测试执行了200个，发现了50个缺陷，则自动化测试缺陷发现率为 50 / 200 × 100% = 25%</p>
                        <p style="margin-left: 15px;">3. 计算2次的平均自动化缺陷发现率，则自动化测试缺陷发现率为（100+200)/(25+50)= 50个/小时</p>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text">{{ this.findJsonArray(this.ui.automationExecute.rateInCustomList, 'name', '本周', 'defectRate') }}</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">缺陷发现率（本月）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="topRight">
                      <template #content>
                        <p>指标定义：计算本月内自动化测试（缺陷发现数量/测试场景总数）的比率，可计算单次或多次</p>
                        <p>计算公式1：自动化测缺陷发现数 / 测试场景总数 × 100%（单次）</p>
                        <p>示例1：假设在一次项目版本自动化测试中，执行了100个测试场景，发现了25个缺陷，则缺陷发现率为 25 / 100 × 100% = 25%</p>
                        <p>计算公式2：(每一次自动化测缺陷发现数之和 / 总数量) / 次数 * 100%（多次）</p>
                        <p>示例2：假设一个项目版本在本月内共进行了2次自动化测试，分别如下：</p>
                        <p style="margin-left: 15px;">1. 第一次自动化测试执行了100个，发现了25个缺陷，则自动化测试缺陷发现率为 25 / 100 × 100% = 25%</p>
                        <p style="margin-left: 15px;">2. 第二次自动化测试执行了200个，发现了50个缺陷，则自动化测试缺陷发现率为 50 / 200 × 100% = 25%</p>
                        <p style="margin-left: 15px;">3. 计算2次的平均自动化缺陷发现率，则自动化测试缺陷发现率为（100+200)/(25+50)= 50个/小时</p>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text">{{ this.findJsonArray(this.ui.automationExecute.rateInCustomList, 'name', '本月', 'defectRate') }}</span>
                </div>
              </a-card>
              <a-card class="card-grid-item large-item">
                <div class="text-grid-container1">
                  <div>
                    <span class="text-grid-title">缺陷发现率（本年）</span>
                    <a-popover style="margin-left: 0px;" title="计算规则" placement="topRight">
                      <template #content>
                        <p>指标定义：计算本年内自动化测试（缺陷发现数量/测试场景总数）的比率，可计算单次或多次</p>
                        <p>计算公式1：自动化测缺陷发现数 / 测试场景总数 × 100%（单次）</p>
                        <p>示例1：假设在一次项目版本自动化测试中，执行了100个测试场景，发现了25个缺陷，则缺陷发现率为 25 / 100 × 100% = 25%</p>
                        <p>计算公式2：(每一次自动化测缺陷发现数之和 / 总数量) / 次数 * 100%（多次）</p>
                        <p>示例2：假设一个项目版本在本年内共进行了2次自动化测试，分别如下：</p>
                        <p style="margin-left: 15px;">1. 第一次自动化测试执行了100个，发现了25个缺陷，则自动化测试缺陷发现率为 25 / 100 × 100% = 25%</p>
                        <p style="margin-left: 15px;">2. 第二次自动化测试执行了200个，发现了50个缺陷，则自动化测试缺陷发现率为 50 / 200 × 100% = 25%</p>
                        <p style="margin-left: 15px;">3. 计算2次的平均自动化缺陷发现率，则自动化测试缺陷发现率为（100+200)/(25+50)= 50个/小时</p>
                      </template>
                      <a-icon type="question-circle" style="font-size: 15px" />
                    </a-popover>
                  </div>
                  <span class="text-grid-text">{{ this.findJsonArray(this.ui.automationExecute.rateInCustomList, 'name', '本年', 'defectRate') }}</span>
                </div>
              </a-card>
            </div>
          </a-card>
          <!-- 第三行 -->
          <a-card v-if="!loading" title="本周进行中的测试计划" class="card-grid-item small-item">
            <advance-table
              style="margin-top: -20px; padding: 0px 0px 10px 10px"
              :scroll="{ x: 1500, y: 500 }"
              :columns="columns"
              :data-source="list"
              :loading="loading"
              rowKey="id"
              @refresh="getTestPlanList"
              :components="isDragTable"
              bordered
              size="middle"
              tableKey="system-project-index-table"
              :format-conditions="true"
              :pagination="{
                current: queryParam.pageNum,
                pageSize: queryParam.pageSize,
                total: total,
                showSizeChanger: true,
                showLessItems: true,
                showQuickJumper: true,
                showTotal:(total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                onChange: changeSize,
                customRow: onClickRow,
                onShowSizeChange: onSizeChange,
              }"
              :needTitle="false"
            >
              <span slot="projectId" slot-scope="{ record }">
                {{ getProjectName(record.projectId) }}
              </span>
              <span slot="type" slot-scope="{ record }">
                <div
                  v-for="(item, index) in getFilterArray(testPlanTypeOptions,(item) => item.id === record.type)"
                  :key="index"
                >
                  {{ item.name }}
                </div>
              </span>
              <span slot="members" slot-scope="{ record }">
                <div v-if="record.memberList && record.memberList.length === 0">暂无成员</div>
                <a-popover v-else title="测试计划成员">
                  <template slot="content">
                    <p v-for="member in record.memberList" :key="member.key">{{ member.name }}</p>
                  </template>
                  <a>查看</a>
                </a-popover>
              </span>
              <span slot="principals" slot-scope="{ record }">
                <div v-if="record.principalList && record.principalList.length === 0">暂无成员</div>
                <a-popover v-else title="测试计划负责人">
                  <template slot="content">
                    <p v-for="principal in record.principalList" :key="principal.key">{{ principal.name }}</p>
                  </template>
                  <a>查看</a>
                </a-popover>
              </span>
              <span slot="testProgress" slot-scope="{ record }">
                <a-progress
                  style="padding: 0px 5px 0px 0px"
                  size="small"
                  :stroke-color="{ from: '#108ee9', to: '#87d068' }"
                  :percent="getTestProgress(record)"
                  :status="getTestProgress(record) >= 100 ? 'normal' : 'active'"
                />
              </span>
              <span slot="status" slot-scope="{ record }">
                <a-button
                  v-for="(item, index) in getFilterArray(testPlanStatusOptions,(item) => item.id === record.status)"
                  :key="index"
                  :style="{
                    height: '25px',
                    color: 'white',
                    backgroundColor: getButtonStyle(record.status)[0],
                    borderColor: getButtonStyle(record.status)[1],
                  }"
                >
                  {{ item.name }}
                </a-button>
              </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="uiTestScene" slot-scope="{ record }">
                {{ getSceneList(record.uiTestScene) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
                <a @click="handleTestPlan(record)" v-hasPermi="['test:testPlan:edit']"> 查看计划 </a>
                <a-divider type="vertical" v-hasPermi="['test:testPlan:remove']" />
                <a @click="handleTestReport(record)" v-hasPermi="['test:testPlan:edit']"> 查看报告 </a>
              </span>
            </advance-table>
          </a-card>
          <!-- 第四行 -->
          <a-card v-if="!loading" title="正在运行中的定时任务" class="card-grid-item small-item">
            <advance-table
              style="margin-top: -20px; padding: 0px 0px 10px 10px"
              :scroll="{ x: 1500, y: 500 }"
              :columns="columns1"
              :data-source="list1"
              :loading="loading1"
              rowKey="id"
              @refresh="getTimedTaskList"
              :components="isDragTable1"
              bordered
              size="middle"
              tableKey="system-project-index-table"
              :format-conditions="true"
              :pagination="{
                current: queryParam1.pageNum,
                pageSize: queryParam1.pageSize,
                total: total1,
                showSizeChanger: true,
                showLessItems: true,
                showQuickJumper: true,
                showTotal:(total1, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total1} 条`,
                onChange: changeSize1,
                customRow: onClickRow1,
                onShowSizeChange: onSizeChange1,
              }"
              :needTitle="false"
            >
            <span slot="testPlanId" slot-scope="{ record }">
              {{ getTestPlanName(record.testPlanId) }}
            </span>
            <span slot="type" slot-scope="{ record }">
              <div
                v-for="(item, index) in getFilterArray(timedTaskTypeOptions, (item) => item.id === record.type)"
                :key="index"
              >
                {{ item.name }}
              </div>
            </span>
            <span slot="cronExpression" slot-scope="{ record }">
              <a-popover title="最近5次运行时间" placement="bottomLeft">
                <template slot="content">
                  <p v-for="nextExecTime in record.nextExecTimeList" :key="nextExecTime.key">{{ nextExecTime }}</p>
                </template>
                <a>{{ record.cronExpression }}</a>
              </a-popover>
            </span>
            <span slot="status" slot-scope="{ record }">
              <!-- <a-button v-for="(item, index) in getFilterArray(timedTaskStatusOptions, (item) => item.id === record.status)" :key="index"
               :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record.status)[0], borderColor: getButtonStyle(record.status)[1] }"
              > {{ item.name }} 
              </a-button> -->
              <a-popconfirm
                ok-text="是"
                cancel-text="否"
                @confirm="confirmHandleStatus(record)"
                @cancel="cancelHandleStatus(record)"
              >
                <span slot="title"
                  >确认
                  <b>{{ record.status === '1' ? '开启' : '关闭' }}</b>
                  吗?
                </span>
                <a-switch
                  style="width: 50px"
                  checked-children="开"
                  un-checked-children="关"
                  :checked="record.status == 0"
                />
              </a-popconfirm>
            </span>
              <span slot="createTime" slot-scope="{ record }">
                {{ parseTime(record.createTime) }}
              </span>
              <span slot="updateTime" slot-scope="{ record }">
                {{ parseTime(record.updateTime) }}
              </span>
              <span slot="operation" slot-scope="{ record }">
              <a @click="handleTimedTaskLog(record)" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:edit']">查看任务</a>
            </span>
            </advance-table>
          </a-card>
          <!-- <a-card :loading="loading" title="卡片6" class="card-grid-item small-item"></a-card> -->
        </div>
      </template>
      <template :slot="tab0.tab1.name">
      </template>
    </tab-list>
  </div>
</template>

<script>
import * as api from '@/api/api'
import * as utils from '@/utils/sakura'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import TabList from './modules/TabList.vue'
import UITestEcharts from './modules/UITestEcharts.vue'
import { testPlanTypeOptions, testPlanStatusOptions } from '../components/Config'
import { timedTaskTypeOptions, timedTaskStatusOptions } from '@/views/test/components/Config'
import rise from '@/assets/icons/rise.svg'

export default {
  name: 'testMetric',
  props: {},
  components: {
    AdvanceTable,
    TabList,
    UITestEcharts,
  },
  computed: {
    isDragTable() {
      return this.dragTable(this.columns)
    },
    isDragTable1() {
      return this.dragTable(this.columns1)
    },
  },
  data() {
    return {
      icon: rise,
      tabKey: '0',
      tab0: {
        tab0: {
          name: 'UI自动化测试报表',
          isVisible: true,
        },
        tab1: {
          name: '接口自动化测试报表',
          isVisible: true,
        },
      },
      projectOptions: [],
      project: {
        id: undefined,
        name: '',
      },
      versionOptions: [],
      version: {
        id: undefined,
        name: '',
      },
      memberOptions: [],
      testPlanOptions: [],
      testPlanTypeOptions,
      testPlanStatusOptions,
      timedTaskTypeOptions,
      timedTaskStatusOptions,
      loading: false,
      loading1: true,
      loading2: false,
      total: 0,
      total1: 0,
      ui: {},
      list: [],
      list1: [],
      queryParam: {
        ui: {
          projectId: undefined,
          versionId: undefined,
          parentId: '',
        },
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.projectId, a.createTime',
        isAsc: 'desc',
        updateStartTime: '',
        updateEndTime: '',
        versionId: '',
      },
      queryParam1: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.testPlanId, a.createTime',
        isAsc: 'desc',
      },
      queryData: [
        {
          label: '所属项目',
          value: 'projectId',
        },
        {
          label: '计划类型',
          value: 'type',
        },
        {
          label: '计划名称',
          value: 'name',
        },
        {
          label: '计划状态',
          value: 'status',
        },
        {
          label: '创建人',
          value: 'createByName',
        },
        {
          label: '创建时间',
        },
      ],
      columns: [
        {
          title: '所属项目',
          width: 250,
          dataIndex: 'projectId',
          scopedSlots: { customRender: 'projectId' },
          ellipsis: true,
          fixed: 'left',
          align: 'center',
        },
        {
          title: '计划类型',
          width: 100,
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
        },
        // {
        //   title: '计划ID',
        //   dataIndex: 'id',
        //   width: 270,
        //   ellipsis: true,
        //   fixed: 'left',
        //   align: 'center'
        // },
        {
          title: '计划名称',
          width: 330,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center',
        },
        // {
        //   title: '计划简称',
        //   width: 113,
        //   dataIndex: 'abbreviate',
        //   ellipsis: true,
        //   fixed: 'left',
        //   align: 'center'
        // },
        // {
        //   title: '计划描述',
        //   width: 250,
        //   dataIndex: 'description',
        //   ellipsis: true,
        //   align: 'center',
        // },
        {
          title: '计划成员',
          width: 90,
          dataIndex: 'members',
          scopedSlots: { customRender: 'members' },
          align: 'center',
        },
        {
          title: '计划负责人',
          width: 90,
          dataIndex: 'principals',
          scopedSlots: { customRender: 'principals' },
          align: 'center',
        },
        {
          title: '关联场景数',
          dataIndex: 'uiTestScene',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'uiTestScene' },
          align: 'center',
        },
        {
          title: '测试进度',
          width: 130,
          dataIndex: 'testProgress',
          scopedSlots: { customRender: 'testProgress' },
          align: 'center',
        },
        {
          title: '计划状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center',
        },
        // {
        //   title: '计划开始时间',
        //   dataIndex: 'plannedStartTime',
        //   width: 155,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'plannedStartTime' },
        //   align: 'center',
        // },
        // {
        //   title: '计划结束时间',
        //   dataIndex: 'plannedEndTime',
        //   width: 155,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'plannedEndTime' },
        //   align: 'center',
        // },
        // {
        //   title: '实际开始时间',
        //   dataIndex: 'actualStartTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'actualStartTime' },
        //   align: 'center',
        // },
        // {
        //   title: '实际结束时间',
        //   dataIndex: 'actualEndTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'actualEndTime' },
        //   align: 'center',
        // },
        {
          title: '创建人',
          width: 80,
          dataIndex: 'createByName',
          align: 'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      columns1: [
        {
          title: '所属计划',
          width: 250,
          dataIndex: 'testPlanId',
          scopedSlots: { customRender: 'testPlanId' },
          ellipsis: true,
          fixed: 'left',
          align: 'center',
        },
        {
          title: '任务类型',
          width: 100,
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
        },
        {
          title: '任务名称',
          width: 330,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '运行规则',
          width: 250,
          dataIndex: 'cronExpression',
          scopedSlots: { customRender: 'cronExpression' },
          align: 'center',
        },
        {
          title: '下次执行时间',
          width: 160,
          ellipsis: true,
          dataIndex: 'nextExecTime',
          scopedSlots: { customRender: 'nextExecTime' },
          align: 'center',
        },
        {
          title: '任务状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center',
        },
        {
          title: '创建人',
          width: 80,
          dataIndex: 'createByName',
          align: 'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
    }
  },
  created() {
    this.getAllProjectList()
    this.getAllTestPlanList()
    this.getAllUsers()
    this.getWeekRange()
  },
  watch: {
    $route(to, from) {
      // console.log('Route changed');
      this.getAllProjectList()
      // this.getAllTestPlanList()
      // this.getAllUsers()
      // this.getWeekRange()
    },
    tabKey: {
      handler(val) {
        // console.log('val: ' + val)
        // this.getTestPlanList()
      },
    },
    testPlan: {
      handler(newVal, oldVal) {
        // console.info(newVal, oldVal)
        // this.handleQuery()
        // this.handleChange(newVal.id)
      },
      deep: true,
    },
  },
  mounted() {
    // console.info('11111')
  },
  methods: {
    // 获取所有项目
    getAllProjectList() {
      api.getProjectList().then((response) => {
        this.projectOptions = []
        response.data.list.forEach((item, index) => {
           if(item.status === 1) {
            this.projectOptions.push(item)
          }
        })
        this.queryParam.ui.projectId = localStorage.getItem('projectId')
          ? localStorage.getItem('projectId')
          : this.projectOptions[0].id
        this.getAllVersion()
      })
    },
    // 选项项目发生变化
    handleChangeProject(value) {
      // console.log(value)
       if(value === undefined) {
        this.queryParam.ui.projectId = undefined
        this.queryParam.ui.versionId = undefined
        localStorage.removeItem('projectId')
        localStorage.removeItem('versionId')
        this.versionOptions = []
      } else {
        this.queryParam.ui.projectId = value
        localStorage.setItem('projectId', this.queryParam.ui.projectId)
        localStorage.removeItem('versionId')
        this.getAllVersion()
      }
    },
    // 获取当前项目环境下的所有版本
    async getAllVersion() {
      const queryParam = {
        projectId: this.queryParam.ui.projectId,
      }
      await api.getEnvironmentList(queryParam).then((response) => {
        response.data.list.forEach((item, index) => {
           if(item.status === 1) {
            var versionList = JSON.parse(item.versionConfig)
            this.versionOptions = []
            versionList.forEach((item, index) => {
               if(item.delFlag === 0) {
                this.versionOptions.push(item)
                 if(item.status === 1) {
                   if(localStorage.getItem('versionId') !== null) {
                    this.queryParam.ui.versionId = localStorage.getItem('versionId')
                  } else {
                    this.queryParam.ui.versionId = item.id
                  }
                }
              }
            })
          }
        })
      })
      this.getUiNode()
    },
    handleChangeVersion(value) {
      this.queryParam.ui.versionId = value
      localStorage.setItem('versionId', this.queryParam.ui.versionId)
      this.getUiNode()
    },
    getProjectName(projectId) {
      // console.info(this.findNodeId(this.projectOptions, projectId, 'name'))
      return this.findNodeId(this.projectOptions, projectId, 'name')
    },
    // 获取所有的测试计划
    getAllTestPlanList(testPlanId) {
      const queryParam = {
        // pageNum: 1,
        // pageSize: 10
      }
      api.getTestPlanList(queryParam).then((response) => {
        this.testPlanOptions = response.data.list
      })
    },
    // 获取测试计划名称
    getTestPlanName(testPlanId) {
      // console.info(this.findNodeId(this.testPlanOptions, testPlanId, 'name'))
      return this.findNodeId(this.testPlanOptions, testPlanId, 'name')
    },
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    findJsonArray(jsonArray, targetKey, targetParamsName, targetParamsValue) {
      // console.log(utils.findJsonArray(jsonArray, 'name','历史', 'total'));
      return utils.findJsonArray(jsonArray, targetKey, targetParamsName, targetParamsValue)
    },
    findJsonArray1(list, key1, value1, key2) {
      // 假设list是一个对象数组
      const matchingItem = list.find((item) => item[key1] === value1)
      return matchingItem && matchingItem[key2] ? matchingItem[key2].toString() : ''
    },
    getSceneList(array) {
      // console.log(array)
      let sceneList = array.match(/[^\[\], ]+/g)
      return sceneList ? sceneList.length : 0
    },
    // 获取系统的所有用户
    getAllUsers() {
      api.getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    getTestProgress(record) {
      const uiTestSceneList =
        record.uiTestScene && record.uiTestScene !== '[]'
          ? record.uiTestScene.substring(1, record.uiTestScene.length - 1).split(',')
          : []
      let num1 = parseFloat(uiTestSceneList.length)
      let num2 = parseFloat(record.testProgress)
      let testProgress =(((num1 - num2) / num1) * 100).toFixed(0)
      return parseFloat(testProgress)
    },
    getButtonStyle(status) {
      switch(status) {
        case '0':
          return ['#909399', '#909399']
        case '1':
          return ['#ff4d4f', '#ff4d4f']
        case '2':
          return ['#05c878', '#05c878']
        default:
          return ['#909399', '#909399']
      }
    },
    // 获取项目名称
    getProjectName(projectId) {
      // console.info(this.findNodeId(this.projectOptions, projectId, 'name'))
      return this.findNodeId(this.projectOptions, projectId, 'name')
    },
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    handleTestPlan(record) {
      this.$router.push({
        name: 'TestPlan',
        params: {
          name: record.name,
        },
      })
    },
    handleTestReport(record) {
      this.$router.push({
        name: 'TestReport',
        params: {
          testPlanId: record.id,
        },
      })
    },
    getWeekRange() {
      const weekRange = utils.getWeekStartAndEnd()
      this.queryParam.updateStartTime = weekRange.weekStart
      this.queryParam.updateEndTime = weekRange.weekEnd
      // console.log(this.queryParam)
    },
    getUiNode() {
      api.getUiNode(this.queryParam.ui.projectId, this.queryParam.ui.versionId).then((response) => {
        this.queryParam.ui.parentId = response.data.id
        this.getTestMetricList()
      })
    },
    getTestMetricList() {
      api.getTestMetricList(this.queryParam).then((response) => {
         if(response.data.ui) {
          this.ui = response.data.ui
          this.loading2 = true
          this.getTestPlanList()
          this.getTimedTaskList()
          // setTimeout(() => {
          //   this.loading1 = false
          // }, 2000);
        }
      })
    },
    getTestPlanList() {
      this.loading = true
      api.getTestPlanList(this.queryParam).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
    },
    getTimedTaskList() {
      this.loading1 = true
      api.getTimedTaskList(this.queryParam1).then((response) => {
        this.list1 = response.data.list
        this.total1 = response.data.total
      }).finally(
        this.loading1 = false
      )
    },
    handleTimedTaskLog(record) {
      this.$router.push({
        name: 'TimedTask',
        params: {
          name: record.name,
        },
      })
    },
    /* 任务状态修改 */
    confirmHandleStatus(row) {
      const text = row.status === '1' ? '开启' : '关闭'
      row.status = row.status === '0' ? '1' : '0'
      api
        .updateTimedTask(row)
        .then(() => {
          this.$message.success(text + '成功', 3)
          this.getList()
        })
        .catch(function () {
          this.$message.error(text + '发生异常', 3)
        })
    },
    cancelHandleStatus(row) {},
    setActiveKey(key) {
      // console.log(key)
      this.tabKey = key
    },
    handleQuery(value) {
       if(value === undefined) {
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
        }
      } else {
        // console.log(this.queryParam);
        this.queryParam = Object.assign(this.queryParam, value)
        this.queryParam.pageNum = 1
      }
      this.getTestPlanList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.projectId, a.name',
        isAsc: 'asc',
      }
      this.handleQuery(this.queryParam)
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getTestPlanList()
    },
    onSizeChange(current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      this.getTestPlanList()
    },
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getTestPlanList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map((item) => item.id)
      this.names = this.selectedRows.map((item) => item.name)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    
    onShowSizeChange1(current, pageSize) {
      this.queryParam1.pageSize = pageSize
      this.getTimedTaskList()
    },
    onSizeChange1(current, size) {
      this.queryParam1.pageNum = 1
      this.queryParam1.pageSize = size
      this.getTimedTaskList()
    },
    changeSize1(current, pageSize) {
      this.queryParam1.pageNum = current
      this.queryParam1.pageSize = pageSize
      this.getTimedTaskList()
    },
    onSelectChange1(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map((item) => item.id)
      this.names = this.selectedRows.map((item) => item.name)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    onClickRow(record) {
      return {
        on: {
          click:() => {
            const keys = []
            keys.push(record.id)
            this.selectedRowKeys = keys
          },
        },
      }
    },
    onClickRow1(record) {
      return {
        on: {
          click:() => {
            const keys = []
            keys.push(record.id)
            this.selectedRowKeys = keys
          },
        },
      }
    },
  },
}
</script>

<style lang="less" scoped>
.card-container {
  width: 100%;
  height: 320px;
  // margin: 10px;

  // .chart-container {
  //   // margin-left: -140px;
  //   background-color: white;
  //   width: 100%;
  //   height: 300px;
  // }

  // .chart {
  //   margin-left: -240px;
  //   // flex: 1;
  // }
}
.card-grid-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  grid-auto-rows: auto; /* 根据内容自动分配行高 */
  grid-gap: 10px;

  .card-grid-container1 {
    display: grid;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    grid-auto-rows: auto; /* 根据内容自动分配行高 */
    grid-gap: 20px;
    padding: 0px 20px 0px 20px;

    .text-grid-container1 {
      display: grid;
      // grid-auto-flow: column; /* 垂直排列 */
      align-items: center; /* 可选，用于垂直居中 */
      // justify-items: center; /* 可选，用于水平居中 */
      grid-gap: 0px; /* 设置垂直间距 */
      padding: 20px;
      .text-grid-container1_1 {
        display: grid;
        grid-template-columns: repeat(3, auto);
        justify-items: center;
        grid-gap: 65px;
        padding: 30px 0px 0px 0px;
      }
      .text-grid-container1_1_1 {
        display: grid;
        grid-template-columns: repeat(3, auto);
        justify-items: center;
        grid-gap: 65px;
        padding: 30px 0px 0px 0px;
      }
      .text-grid-container1_1_2 {
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-gap: 32px;
        padding: 30px 0px 0px 0px;
      }
      .text-grid-container1_2 {
        display: grid;
        align-items: center; /* 可选，用于垂直居中 */
        grid-gap: 5px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
    }
    .text-grid-container2 {
      display: grid;
      align-items: center; /* 可选，用于垂直居中 */
      grid-gap: 30px; /* 设置垂直间距 */
      padding: 20px;

      .text-grid-container2_1 {
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-gap: 30px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
      .text-grid-container2_2 {
        display: grid;
        align-items: center; /* 可选，用于垂直居中 */
        grid-gap: 0px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
      .text-grid-container2_3 {
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-gap: 30px; /* 设置垂直间距 */
        padding: 0px 0px 0px 0px;
      }
    }
  }
  .card-grid-container2 {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-auto-rows: auto; /* 根据内容自动分配行高 */
    grid-gap: 20px;
    padding: 20px 20px 20px 20px;
    .text-grid-container1 {
      display: grid;
      align-items: center; /* 可选，用于垂直居中 */
      grid-gap: 0px; /* 设置垂直间距 */
      padding: 10px 0px 5px 20px;
    }
  }
  .card-grid-container3 {
    display: grid;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    grid-auto-rows: auto; /* 根据内容自动分配行高 */
    grid-gap: 20px;
    padding: 20px 20px 20px 20px;
    .text-grid-container1 {
      display: grid;
      align-items: center; /* 可选，用于垂直居中 */
      grid-gap: 0px; /* 设置垂直间距 */
      padding: 10px 0px 5px 20px;
    }
  }
  .text-grid-icon {
    display: flex;
    align-items: center;
    // justify-content: space-evenly;
    gap: 10px;
  }
  .text-grid-title {
    font-size: 14px;
    font-family: 'PingFang SC';
  }
  .text-grid-text {
    font-size: 22px;
    // font-weight: bold;
    color: rgba(0, 0, 0, 0.75);
    font-family: 'PingFang SC';
  }
  .text-grid-icon{
    width: 15px;
    height: 15px;
  }
  .text-grid-text1 {
    font-size: 30px;
    color: rgba(0, 0, 0, 0.75);
    font-family: 'PingFang SC';
  }
  .text-grid-text2 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.75);
    font-family: 'PingFang SC';
  }
}

.large-item {
  grid-column: span 1; /* 占据一列 */
}

.small-item {
  grid-column: span 2; /* 占据两列 */
}

.csmall-item {
  grid-column: span 3; /* 占据两列 */
}

::v-deep .ant-tabs-bar {
  margin: 0px 0px 10px 0px;
}

/* 定制卡片标题样式 */
::v-deep .ant-card-head {
  padding: 0px 20px;
  font-size: 19px;
  // font-family: Arial, sans-serif;
  font-family: 'PingFang SC';
  border-bottom: none !important; /* 去除标题与内容之间的分割线 */
}

::v-deep .ant-table-wrapper {
  padding: 0px 0px;
}

.card-grid-item {
  /* 卡片自身的样式 */
  border-radius: 5px;
  box-shadow: none;
  // font-size: 30px;
  // // font-family: Arial, sans-serif;
  // font-family: 'PingFang SC';
}
</style>
