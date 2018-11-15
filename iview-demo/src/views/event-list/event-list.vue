<template>
  <div>
    <div class="event-list">
      <div class="form-wrapper">
        <Form ref="formItem" :model="formItem" inline :label-width="80">
            <FormItem label="影响业务：">
              <Select clearable v-model="formItem.c11111111111" placeholder="请选择涉及系统">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
            <FormItem label="引发原因：">
                <Input clearable v-model="formItem.c27" placeholder="请输入事件原因..."></Input>
            </FormItem>
            <FormItem label="原因团队：">
                <Input clearable v-model="formItem.c29" placeholder="请输入原因团队..."></Input>
            </FormItem>
            <FormItem label="事件级别：">
              <CheckboxGroup class="lever" size="default" v-model="formItem.c3">
                  <Checkbox label="L1" size="default"></Checkbox>
                  <Checkbox label="L2" size="default"></Checkbox>
                  <Checkbox label="L3" size="default"></Checkbox>
                  <Checkbox label="L4" size="default"></Checkbox>
                  <Checkbox label="L5" size="default"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="影响时长：">
              <el-date-picker :clearable="true"
                v-model="formItem.timeInterval"
                type="datetimerange"
                align="right"
                size = "mini"
                unlink-panels
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </FormItem>
        </Form>
      </div>
      <div class="operate">
        <Tooltip placement="bottom">
            <Button type="primary" icon="ios-settings-outline">列定制</Button>
            <div slot="content" class="column-select">
              <CheckboxGroup v-model="seleColumnList">
                <div v-for="item in columnObject" :key="item.category">
                  <p class="title">{{item.category}}</p>
                  <p class="line"></p>
                  <Row>
                    <Col span="8" v-for="subItem in item.list" :key="subItem.title">
                      <Checkbox :disabled="subItem.checkDisabled" :label="subItem.title">
                        <span>{{subItem.title}}</span>
                      </Checkbox>
                    </Col>
                  </Row>
                </div>
              </CheckboxGroup>
            </div>
        </Tooltip>
        <Button type="primary" @click="showImportModal = true" icon="ios-cloud-upload-outline">导入</Button>
        <Modal v-model="showImportModal" title="事件信息导入"
            @on-ok="importConfirm" @on-cancel="importCancel">
              <Upload type="drag"
                action="/api/order/export/impExcel">
                <div style="padding: 20px 0; color: #ccc">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>Click or drag files here to upload</p>
                </div>
            </Upload>
        </Modal>
        <Button type="primary" @click="exportTableList" icon="ios-cloud-download-outline">导出</Button>
      </div>
      <div id="table-contain">
        <Table style="max-height: 400px" :columns="columnsList" :data="dataList"></Table>
      </div>
      <div class="page-contain">
        <Page :total="100" show-sizer show-elevator size="small" />
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import eventList from './event-list.js';
  export default {
    ...eventList
  };
</script>

<style lang="stylus" src="./event-list.styl" scoped></style>

