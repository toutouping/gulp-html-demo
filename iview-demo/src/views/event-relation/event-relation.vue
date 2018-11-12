<template>
  <div class="event-relation">
    <div class="filter-content">
      <Row>
        <Col span="5">
          <DatePicker :value="period" format="yyyy/MM" type="daterange" placement="bottom-end" placeholder="请选择时间范围" style="width: 220px"></DatePicker>
        </Col>
        <Col span="19">
          <Select v-model="groupName" multiple filterable clearable placeholder="请选择室组" style="min-width:200px">
            <Option v-for="item in groupList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </div>
    <div ref="relationChart" class="relation-chart"></div>
  </div>
</template>


<script type="text/ecmascript-6">
  import currentModule from './event-relation.js';
  export default {
    ...currentModule
  };
</script>

<style lang="stylus" src="./event-relation.styl" scoped></style>

