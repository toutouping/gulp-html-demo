<template>
    <div class="event-trend">
      <div class="filter-content" :class="{'full-screen': isFullScreen}">
        <Row>
          <Col span="5">
            <DatePicker :value="period" format="yyyy/MM" type="daterange" placement="bottom-end" placeholder="请选择时间范围" style="width: 220px"></DatePicker>
          </Col>
          <Col span="5">
            <Select v-model="groupName" clearable placeholder="请选择室组" style="width:200px">
              <Option v-for="item in groupList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </div>
      <div ref="trendChart" class="trend-chart" :class="{'full-screen': isFullScreen}"></div>
    </div>
</template>

<script type="text/ecmascript-6">
  import currentModule from './event-trend.js';
  export default {
    ...currentModule
  };
</script>

<style lang="stylus" src="./event-trend.styl" scoped></style>