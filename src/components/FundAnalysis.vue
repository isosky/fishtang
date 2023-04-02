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
        ><el-col :span="3">
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
        <el-col :span="4">
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
            <el-button
              type="primary"
              @click="lastmonth"
              icon="el-icon-arrow-left"
            ></el-button>
            <el-button
              type="primary"
              @click="nextmonth"
              icon="el-icon-arrow-right"
            ></el-button>
            <el-button type="primary" icon="el-icon-refresh"></el-button>
            <el-button type="primary" icon="el-icon-plus"></el-button>
            <el-button
              type="primary"
              icon="el-icon-coin"
            ></el-button></el-button-group
        ></el-col>
      </el-row>
      <el-row style="height: 450px">
        <el-col :span="6">
          <div>
            <el-statistic
              group-separator=","
              :precision="2"
              :value="sform.earn_history"
              style="
                height: 100px;
                margin-top: 40px;
                font-size: 30px;
                text-align: center;
              "
              title="历史收益"
            ></el-statistic>
            <el-statistic
              group-separator=","
              :precision="2"
              :value="sform.earn_sum"
              style="
                height: 100px;
                margin-top: 40px;
                font-size: 30px;
                text-align: center;
              "
              title="持有收益"
            ></el-statistic>
            <el-statistic
              group-separator=","
              :precision="2"
              :value="sform.earn_percent"
              style="
                height: 100px;
                margin-top: 40px;
                font-size: 30px;
                text-align: center;
              "
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
    <el-col :span="14">
      <el-row>
        <el-table
          :data="reviewtabledata"
          show-summary
          style="width: 100%"
          height="700"
          :cell-style="pricestyle"
          ref="reviewtabledata"
        >
          <el-table-column
            prop="fund_review_time"
            label="时间"
            width="120"
          ></el-table-column>
          <el-table-column prop="apps" label="来源" width="80">
          </el-table-column>
          <el-table-column prop="funder_name" label="博主名称" width="120">
          </el-table-column>
          <el-table-column
            prop="fund_review_attitude"
            label="走势预期"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="fund_review"
            label="总结"
            width="300"
          ></el-table-column>
          <el-table-column prop="isfirm" label="实盘" width="80">
          </el-table-column>
          <el-table-column
            prop="earn_percent"
            sortable
            label="收益率"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="review_confidence"
            sortable
            label="可信度"
            width="100"
          >
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                @click="diashowreview(scope.row)"
                type="text"
                size="small"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-col>
    <el-dialog :visible.sync="dialogreviewFormVisible" width="30%">
      <el-form :model="reviewform">
        <el-row :span="5">
          <el-form-item label="基金代码" :label-width="formLabelWidth">
            <el-input
              v-model="reviewform.fund_name"
              disabled
              style="width: 450px"
            ></el-input>
          </el-form-item>
          <el-form-item label="复盘日期" :label-width="formLabelWidth">
            <el-date-picker
              v-model="reviewform.fund_review_time"
              disabled
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row :span="5">
          <el-form-item label="走势预期" :label-width="formLabelWidth">
            <el-slider
              :min="-10"
              :max="10"
              :step="2.5"
              show-input
              show-stops
              v-model="reviewform.fund_review_attitude"
              style="width: 450px"
            ></el-slider>
          </el-form-item>
        </el-row>
        <el-row :span="5">
          <el-form-item label="操作想法" :label-width="formLabelWidth">
            <el-radio-group v-model="reviewform.operation" size="medium">
              <el-radio label="大卖"></el-radio>
              <el-radio label="小卖"></el-radio>
              <el-radio label="不动"></el-radio>
              <el-radio label="小买"></el-radio>
              <el-radio label="大买"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row :span="5">
          <el-form-item label="review" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              v-model="reviewform.fund_review"
              :autosize="{ minRows: 5 }"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogreviewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitreview">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import axios from "axios";
var echarts = require("echarts");
export default {
  data() {
    return {
      formLabelWidth: "100px",
      dialogreviewFormVisible: false,
      reviewform: {},
      reviewtabledata: [],
      fund_had_option: [],
      fund_had_list: "",
      fund_had_code_selected: "",
      fund_had_name_selected: "",
      funder_option: [],
      funder_selected: "",
      date_selected: "",
      calendar_click: "",
      sform: {},
      calendar_chart: "",
      calendar_option: {
        // grid: {
        //   left: "0",
        //   right: "0",
        // },
        tooltip: {
          formatter: function (params) {
            return "收益率: " + params.value[1].toFixed(2);
          },
        },
        // TODO 颜色这块还得研究研究
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
          outOfRange: {
            color: ["green", "red"],
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
    let that = this;
    this.calendar_chart = echarts.init(
      document.getElementById("calendar_div"),
      "white",
      {
        renderer: "canvas",
      }
    );
    this.calendar_chart.on("click", function (params) {
      that.calendar_click = params.data[0];
      that.getreviewtabledata();
    });
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
      //   console.log("temp");
      this.gethadfund();
    },
    getreviewtabledata: function () {
      if (this.calendar_click == "") {
        let y = new Date().getFullYear() + "-";
        let m =
          new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1) + "-"
            : new Date().getMonth() + 1 + "-";
        let d =
          new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate();
        let currentDate = y + m + d;
        this.calendar_click = currentDate;
      }
      axios
        .post("/getreviewtabledata", {
          fund_code: this.fund_had_code_selected,
          fund_review_time: this.calendar_click,
        })
        .then((response) => {
          this.reviewtabledata = response.data;
        });
    },
    getcalendar: function () {
      if (this.fund_had_code_selected != "" && this.date_selected != "") {
        console.log("我的某个基金");
        axios
          .post("/getfundcalendar", {
            fund_code: this.fund_had_code_selected,
          })
          .then((response) => {
            // console.log(response);
            this.calendar_option.series[0].data = response.data.bs_data;
            this.calendar_option.series[1].data = response.data.bs_data;
            this.calendar_option.series[2].data = response.data.data;
            this.calendar_option.calendar.range = this.date_selected;
            this.sform = response.data.sform;
            // console.log(this.calendar_option);
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
        this.getreviewtabledata();
      });
    },
    lastmonth: function () {
      let arr = this.date_selected.split("-");
      let year = arr[0]; //获取当前日期的年份
      let month = arr[1]; //获取当前日期的月份

      let year2 = year;
      let month2 = parseInt(month) - 1;
      if (month2 == 0) {
        //1月的上一月是前一年的12月
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }

      if (month2 < 10) {
        //10月之前都需要补0
        month2 = "0" + month2;
      }
      let preMonth = year2 + "-" + month2;
      this.date_selected = preMonth;
      this.getcalendar();
    },
    nextmonth: function () {
      var arr = this.date_selected.split("-");
      let year = arr[0]; //获取当前日期的年份
      let month = arr[1]; //获取当前日期的月份

      let year2 = year;
      let month2 = parseInt(month) + 1;
      if (month2 == 13) {
        //12月的下月是下年的1月
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      if (month2 < 10) {
        //10月之前都需要补0
        month2 = "0" + month2;
      }

      let nextMonth = year2 + "-" + month2;
      this.date_selected = nextMonth;
      this.getcalendar();
    },
    pricestyle: function ({ row, column, rowIndex, columnIndex }) {
      // console.log(columnIndex);
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
    diashowreview: function (event) {
      this.reviewform = event;
      this.dialogreviewFormVisible = true;
    },
    commitreview: function () {
      // console.log(this.reviewform);
      axios
        .post("/commitreview", {
          reviewform: this.reviewform,
          isupdate: true,
        })
        .then((response) => {
          this.reviewform = this.$options.data().reviewform;
          this.dialogreviewFormVisible = false;
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
.formlabelwidth {
  width: 120px;
}
</style>
  