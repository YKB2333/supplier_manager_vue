<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from "echarts";
import { on, off } from "@/utils/tools";
export default {
  name: "ChartBar",
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      let dataAxis = Object.keys(this.value).reverse();
      let data = Object.values(this.value).reverse();
      var labelLeft = {
        // normal: {
        //   position: "left"
        // }
      };
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 80,
          bottom: 30
        },
        xAxis: {
          type: "value",
          splitLine: { lineStyle: { type: "dashed" } }
        },
        yAxis: {
          type: "category",
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: dataAxis
        },
        visualMap: {
          orient: "horizontal",
          left: "bottom",
          min: 0,
          max: data[data.length-1],
          // Map the score column to color
          inRange: {
            color: ["#D7DA8B", "#E15457"]
          }
        },
        series: [
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                formatter: "{b}"
              }
            },
            data: data.map(value => {
              return { value, label: labelLeft };
            })
          }
        ]
      };

      let myCharts = echarts.init(this.$refs.dom);
      this.dom = myCharts;
      myCharts.setOption(option);
      on(window, "resize", this.resize);
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
