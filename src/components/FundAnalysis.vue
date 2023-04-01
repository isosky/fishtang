<template>
  <div id="app">
    <el-col :span="10">
      <el-row :span="5">
        <el-col :span="6">
          <el-select
            v-model="fund_had_code_selected"
            @change="getcalendar"
            clearable
            filterable
            default-first-option
            placeholder="请选择基金"
          >
            <el-option
              v-for="item in fund_had_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select></el-col
        ><el-col :span="3" :offset="1">
          <el-date-picker
            v-model="date_selected"
            type="month"
            value-format="yyyy-MM"
            @change="getcalendar"
            placeholder="选择月"
            style="width: 120px"
          >
          </el-date-picker
        ></el-col>
        <el-col :span="4" :offset="1">
          <el-select
            v-model="funder_selected"
            @change="getcalendar"
            clearable
            filterable
            default-first-option
            placeholder="请选择博主"
          >
            <el-option
              v-for="item in funder_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select></el-col
        ><el-col :span="8" :offset="1">
          <el-button-group>
            <el-button type="primary" icon="el-icon-arrow-left"></el-button>
            <el-button type="primary" icon="el-icon-arrow-right"></el-button>
            <el-button type="primary" icon="el-icon-refresh"></el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
            ></el-button></el-button-group
        ></el-col>
      </el-row>
      <el-row style="height: 450px">
        <el-col :span="6">
          <div>
            <el-statistic
              group-separator=","
              :precision="2"
              :value="sform.v1"
              title="历史收益"
            ></el-statistic>
            <el-statistic
              group-separator=","
              :precision="2"
              :value="sform.v2"
              title="持有收益"
            ></el-statistic>
            <el-statistic
              group-separator=","
              :precision="2"
              :value="sform.v3"
              title="持有收益率"
            ></el-statistic>
          </div> </el-col
        ><el-col :span="18">
          <div id="calendar_div" style="height: 450px"></div>
        </el-col>
      </el-row>
      <el-row>
        <div id="div_one_total" style="height: 450px"></div>
      </el-row>
    </el-col>
    <el-col :span="6">234</el-col>
    <el-col :span="6">456</el-col>
  </div>
</template>
  
<script>
import axios from "axios";
var echarts = require("echarts");
export default {
  data() {
    return {
      fund_had_option: [],
      fund_had_list: "",
      fund_had_code_selected: "",
      fund_had_name_selected: "",
      funder_option: [],
      funder_selected: "",
      date_selected: "",
      sform: {
        v1: 123.11,
        v2: 123.22,
        v3: 123.33,
      },
      calendar_chart: "",
      calendar_option: {
        grid: {
          left: "0",
          right: "0",
        },
        visualMap: {
          show: false,
          splitNumber: 10,
          min: -5,
          max: 5,
          inRange: {
            color: [
              "#00ff16",
              "#5dff6b",
              "#8fff99",
              "#b3ffba",
              "#e0ffe3",
              "#ffffff",
              "#ffdfdf",
              "#ffb7b7",
              "#ffa9a9",
              "#ff9494",
              "#ff0000",
            ],
          },
        },
        calendar: {
          range: ["2023-03"],
          orient: "vertical",
          cellSize: [70, 70],

          seriesIndex: [2],
          yearLabel: {
            show: false,
          },
          dayLabel: {
            firstDay: 1, // 从周一开始
            nameMap: "cn",
          },
          monthLabel: {
            show: false,
          },
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "calendar",
            symbolSize: 0,
            label: {
              show: true,
              formatter: function (params) {
                var d = echarts.number.parseDate(params.value[0]);
                console.log(params.value[2]);
                return d.getDate() + "\n\n" + params.value[1] + "\n\n";
              },
              color: "#000",
            },
            data: [],
            silent: true,
          },
          {
            type: "scatter",
            coordinateSystem: "calendar",
            symbolSize: 0,
            label: {
              show: true,
              formatter: function (params) {
                return "\n\n\n" + (params.value[2] || "");
              },
              fontSize: 14,
              fontWeight: 700,
              color: "#a00",
            },
            data: [],
            silent: true,
          },
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: [],
          },
        ],
      },
      one_total_chart: "",
      one_total_option: {
        title: {
          text: "",
          left: "10%",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
          min: function (value) {
            return (value.min * 0.99).toFixed(4);
          },
        },
        dataZoom: [
          {
            show: true,
            startValue: "",
          },
          {
            type: "inside",
            show: true,
            startValue: "",
          },
        ],
        series: {
          data: [],
          type: "line",
          markLine: {
            label: { formatter: "{b},{c}" },
            data: "",
          },
          markPoint: {
            data: "",
          },
        },
      },
    };
  },
  mounted: function () {
    this.calendar_chart = echarts.init(
      document.getElementById("calendar_div"),
      "white",
      {
        renderer: "canvas",
      }
    );
    this.one_total_chart = echarts.init(
      document.getElementById("div_one_total"),
      "white",
      {
        renderer: "canvas",
      }
    );
    this.init();
  },
  methods: {
    init: function () {
      console.log("temp");
      this.gethadfund();
    },
    getcalendar: function () {
      console.log(this.fund_had_code_selected);
      console.log(this.date_selected);
      if (this.fund_had_code_selected != "" && this.date_selected != "") {
        console.log("我的某个基金");
        // this.fund_had_name_selected =
        //   this.fund_had_list[this.fund_had_code_selected];
        axios
          .post("/getfundcalendar", {
            fund_code: this.fund_had_code_selected,
          })
          .then((response) => {
            console.log(response);
            this.calendar_option.series[0].data = response.data.bs_data;
            this.calendar_option.series[1].data = response.data.bs_data;
            this.calendar_option.series[2].data = response.data.data;
            this.calendar_option.calendar.range = this.date_selected;
            console.log(this.calendar_option);
            this.calendar_chart.setOption(this.calendar_option);
          });

        this.setonetotalchart();
      }
      if (this.funder_selected != "" && this.date_selected != "") {
        console.log("某个博主");
      }
    },
    gethadfund: function () {
      axios.get("/getfund").then((response) => {
        this.fund_had_option = response.data.data;
        this.fund_had_list = response.data.listdata;
        this.fund_had_code_selected = this.fund_had_option[0]["value"];
        this.setonetotalchart();
        let y = new Date().getFullYear() + "-";
        let m =
          new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1;
        this.date_selected = y + m;
        this.getcalendar();
      });
    },
    setonetotalchart: function () {
      axios
        .post("/getonetotalchart", {
          fund_code: this.fund_had_code_selected,
        })
        .then((response) => {
          this.one_total_option.xAxis.data = response.data.xAxisdata;
          this.one_total_option.series.data = response.data.seriesdata;
          this.fund_had_name_selected =
            this.fund_had_list[this.fund_had_code_selected];
          this.one_total_option.title.text =
            this.fund_had_name_selected + "近90天走势";
          this.one_total_option.dataZoom[0].startValue =
            response.data.xaxisrange;
          this.one_total_option.dataZoom[1].startValue =
            response.data.xaxisrange;
          this.one_total_option.series.markPoint.data = response.data.mps;
          this.one_total_option.series.markLine.data = response.data.mkl;
          this.one_total_chart.setOption(this.one_total_option);
        });
    },
  },
};
</script>
  
  <style>
.el-row {
  margin-bottom: 5px;
}
.el-col {
  border-radius: 4px;
}
</style>
  