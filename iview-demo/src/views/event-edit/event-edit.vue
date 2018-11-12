<template>
  <div class="event-edit">
    <div class="panel">
      <p class="edit-title">基本属性</p>
      <div class="edit-main">
        <Form ref="formItem" :model="formItem" inline :label-width="80">
            <FormItem prop="input" label="影响业务：">
              <Select :size="'small'" clearable v-model="formItem.select" placeholder="请选择涉及系统">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
            <FormItem prop="input" label="影响时长：" class="clock">
              <Select :size="'small'" clearable v-model="formItem.c14" placeholder="请输入影响时长">
                <Option value="1">&lt; 15min</Option>
                <Option value="2">15 ~ 30min</Option>
                <Option value="3">30 ~ 60min</Option>
                <Option value="4">1 ~ 4h</Option>
                <Option value="5">&gt; 4h</Option>
              </Select>
            </FormItem>
            <FormItem prop="input" label="引发原因：">
                <Input :size="'small'" clearable v-model="formItem.c27" placeholder="请输入事件原因..."></Input>
            </FormItem>
            <FormItem prop="input" label="原因团队：">
                <Input :size="'small'" clearable v-model="formItem.c29" placeholder="请输入原因团队..."></Input>
            </FormItem>
        </Form>
      </div>
    </div>
    <div class="panel">
      <p class="edit-title">事件影响</p>
      <div class="edit-main">
        <Form ref="formItem" :model="formItem" inline :label-width="80">
            <FormItem prop="input" label="影响业务：">
              <Select :size="'small'" clearable v-model="formItem.select" placeholder="请选择涉及系统">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
            <FormItem prop="input" label="影响时长：" class="clock">
              <Select :size="'small'" clearable v-model="formItem.c14" placeholder="请输入影响时长">
                <Option value="1">&lt; 15min</Option>
                <Option value="2">15 ~ 30min</Option>
                <Option value="3">30 ~ 60min</Option>
                <Option value="4">1 ~ 4h</Option>
                <Option value="5">&gt; 4h</Option>
              </Select>
            </FormItem>
            <FormItem prop="input" label="引发原因：">
                <Input :size="'small'" clearable v-model="formItem.c27" placeholder="请输入事件原因..."></Input>
            </FormItem>
            <FormItem prop="input" label="原因团队：">
                <Input :size="'small'" clearable v-model="formItem.c29" placeholder="请输入原因团队..."></Input>
            </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import module from './event-edit.js';
  export default {
    ...module
  };
</script>

<style lang="stylus" src="./event-edit.styl" scoped></style>
