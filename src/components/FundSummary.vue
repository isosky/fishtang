<template>
  <div id="app">
    <el-col :span="24">
      <el-row>
        <div id="treemap_fund_had_div" style="height: 950px"></div>
      </el-row>
    </el-col>
  </div>
</template>

<script>
import axios from "axios";
var echarts = require("echarts");
var formatUtil = echarts.format;
export default {
  data() {
    return {
      treemap_fund_had_chart: "",
      treemap_fund_had_option: {
        tooltip: {
          formatter: function (info) {
            var value = info.value;
            var treePathInfo = info.treePathInfo;
            var treePath = [];

            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name);
            }

            return [
              '<div class="tooltip-title">' +
                formatUtil.encodeHTML(treePath.join("/")) +
                "</div>",
              "金额: " + formatUtil.addCommas(value),
            ].join("");
          },
        },
        series: [
          {
            type: "treemap",
            label: {
              show: true,
              formatter: function (params) {
                // console.log(params);
                let arr = [
                  "{name|" + params.treePathInfo[1].name + "}",
                  "{hr|}",
                  "{name1|" + params.name + "}",
                  "{hr|}",
                  "{budget| " + echarts.format.addCommas(params.value) + "} ",
                  "{hr|}",
                  "{budgetpercent| " +
                    echarts.format.addCommas(
                      Math.round(params.value / 1000, 2).toString() + "%"
                    ) +
                    "} ",
                ];
                return arr.join("\n");
              },
              rich: {
                budget: {
                  fontSize: 22,
                  lineHeight: 30,
                  color: "yellow",
                },
                budgetpercent: {
                  fontSize: 22,
                  lineHeight: 30,
                  color: "black",
                },
                household: {
                  fontSize: 14,
                  color: "#fff",
                },
                label: {
                  fontSize: 9,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "#fff",
                  borderRadius: 2,
                  padding: [2, 4],
                  lineHeight: 25,
                  align: "right",
                },
                name: {
                  fontSize: 16,
                  color: "#fff",
                },
                name1: {
                  fontSize: 12,
                  color: "#fff",
                },
                hr: {
                  width: "100%",
                  borderColor: "rgba(255,255,255,0.2)",
                  borderWidth: 0.5,
                  height: 0,
                  lineHeight: 10,
                },
              },
            },
            levels: [
              {
                itemStyle: {
                  borderWidth: 0,
                  gapWidth: 5,
                },
              },
              {
                itemStyle: {
                  gapWidth: 1,
                },
              },
              {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                  gapWidth: 1,
                  borderColorSaturation: 0.6,
                },
              },
            ],
            data: [],
          },
        ],
      },
    };
  },
  mounted: function () {
    let that = this;
    this.treemap_fund_had_chart = echarts.init(
      document.getElementById("treemap_fund_had_div"),
      "white",
      {
        renderer: "canvas",
      }
    );
    this.init();
  },
  methods: {
    init: function () {
      axios.get("/gethadtreemap").then((response) => {
        console.log(response);
        this.treemap_fund_had_option.series[0].data = response.data;
        this.treemap_fund_had_chart.setOption(this.treemap_fund_had_option);
      });
    },
  },
};
</script>

