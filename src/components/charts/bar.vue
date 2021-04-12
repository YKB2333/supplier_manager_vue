<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/utils/tools";
// echarts.registerTheme("tdTheme", tdTheme);
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
      let dataAxis = Object.keys(this.value);
      let data = Object.values(this.value);
      var yMax = this.$lodash.max(data);
      var dataShadow = [];
      for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
      }
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center"
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}号订单数量 <br/>{c1}'
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: dataShadow,
            animation: false
          },
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data
          }
        ]
      };
      // let myCharts = echarts.init(this.$refs.dom, "tdTheme");
      let myCharts = echarts.init(this.$refs.dom);
      this.dom = myCharts;
      myCharts.setOption(option);
      on(window, "resize", this.resize);
      var zoomSize = 6;
      myCharts.on("click", function(params) {
        myCharts.dispatchAction({
          type: "dataZoom",
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });
      });
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
