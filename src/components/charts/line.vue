<template>
  <div ref="dom" class="charts chart-line"></div>
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/utils/tools";
// echarts.registerTheme("tdTheme", tdTheme);
export default {
  name: "ChartLine",
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null
    };
  },
  methods: {
    resize() {
      myCharts.resize();
    },
    init(){
      let dataAxis = Object.keys(this.value);
      let data = Object.values(this.value);
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center"
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: dataAxis
        },
        yAxis: {
            type: 'value'
        },
        series: [
          {
            type: "line",
            data
          }
        ]
      };
      // let myCharts = echarts.init(this.$refs.dom, "tdTheme");
      let myCharts = echarts.init(this.$refs.dom);
      this.dom = myCharts;
      myCharts.setOption(option);
      on(window, "resize", this.resize);
    }
  },
  watch:{
    value(){
      this.init();
    }
  },
  mounted() {
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
