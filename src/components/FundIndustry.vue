<template>
  <div id="app">
    <el-col :span="10"
      ><el-row>
        <el-date-picker
          v-model="check_time_select"
          type="date"
          @change="getcheckdata"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-select
          v-model="funder_industry_selected"
          clearable
          filterable
          default-first-option
          placeholder="请选择行业"
        >
          <el-option
            v-for="item in fundindustrydata"
            :key="item.cname"
            :label="item.cname"
            :value="item.cname"
          >
          </el-option>
        </el-select> </el-row
      ><el-row>
        <el-table
          :data="
            fundindustrydata.filter(
              (v) =>
                v.cname == funder_industry_selected || !funder_industry_selected
            )
          "
          height="925"
          :cell-style="pricestyle"
          @row-click="industryselect"
          :default-sort="{ prop: 'zhangfu', order: 'descending' }"
          ><el-table-column
            prop="types"
            label="分类"
            width="80"
            :filters="[
              { text: '中证', value: '中证' },
              { text: '板块', value: '板块' },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.types === '中证' ? 'primary' : 'success'"
                disable-transitions
                >{{ scope.row.types }}</el-tag
              >
            </template></el-table-column
          >
          <el-table-column prop="cname" label="行业" width="120">
          </el-table-column>
          <el-table-column
            label="涨幅"
            prop="zhangfu"
            sortable
            width="90"
          ></el-table-column>
          <el-table-column
            label="近3日"
            prop="to3day"
            sortable
            width="90"
          ></el-table-column>
          <el-table-column
            label="近7天"
            prop="to7day"
            sortable
            width="90"
          ></el-table-column>
          <el-table-column
            label="近15天"
            prop="to15day"
            sortable
            width="90"
          ></el-table-column>
          <el-table-column
            label="流入"
            prop="zllr"
            sortable
            width="90"
          ></el-table-column>
          <el-table-column label="包含" prop="contains" sortable width="90">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <el-table :data="scope.row.ind_fund_list">
                  <el-table-column
                    width="150"
                    property="fund_code"
                    label="基金名称"
                  ></el-table-column>
                  <el-table-column
                    width="300"
                    property="fund_name"
                    label="基金代码"
                  ></el-table-column>
                  <el-table-column
                    width="60"
                    property="percent_sum"
                    label="持仓"
                  ></el-table-column>
                </el-table>
                <p slot="reference">{{ scope.row.contains }}</p>
              </el-popover>
            </template></el-table-column
          >
          <el-table-column prop="url_org" label="链接" width="80">
            <template scope="scope">
              <a
                :href="scope.row.url_org"
                target="_blank"
                style="text-decoration: none"
                >链接</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row></el-col
    >
    <el-col :span="14">
      <el-row :span="5">
        <div id="k_ccode_div" style="height: 990px"></div
      ></el-row>
    </el-col>
  </div>
</template>

<script>
import axios from "axios";
var echarts = require("echarts");
// var formatUtil = echarts.format;
export default {
  data() {
    return {
      funder_industry_selected: "",
      check_time_select: "",
      fundindustrydata: [],
      chartdata: null,
      k_ccode_chart: "",
      code_select: "",
      k_ccode_option: {
        title: {
          text: "",
          left: "48%",
          textStyle: {
            fontSize: 30,
          },
        },
        animation: false,
        legend: {
          bottom: 10,
          left: "center",
          data: ["K", "MA5", "MA10", "MA20", "MA30"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          textStyle: {
            color: "#000",
          },
          position: function (pos, params, el, elRect, size) {
            const obj = {
              top: 10,
            };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
          },
          // extraCssText: 'width: 170px'
        },
        axisPointer: {
          link: [
            {
              xAxisIndex: "all",
            },
          ],
          label: {
            backgroundColor: "#777",
          },
        },
        visualMap: {
          show: false,
          seriesIndex: 5,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: "#ec0000",
            },
            {
              value: -1,
              color: "#00da3c",
            },
          ],
        },
        grid: [
          {
            left: "10%",
            right: "8%",
            height: "50%",
          },
          {
            left: "10%",
            right: "8%",
            top: "63%",
            height: "16%",
          },
        ],
        xAxis: [
          {
            type: "category",
            data: null,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              z: 100,
            },
          },
          {
            type: "category",
            gridIndex: 1,
            data: null,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: "dataMin",
            max: "dataMax",
          },
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true,
            },
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0, 1],
            start: 85,
            end: 100,
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: "slider",
            top: "85%",
            start: 85,
            end: 100,
          },
        ],
        series: [
          {
            name: "K",
            type: "candlestick",
            data: null,
            itemStyle: {
              color: "#ec0000",
              color0: "#00da3c",
              borderColor: undefined,
              borderColor0: undefined,
            },
            tooltip: {
              formatter: function (param) {
                param = param[0];
                return [
                  "Date: " + param.name + '<hr size=1 style="margin: 3px 0">',
                  "Open: " + param.data[0] + "<br/>",
                  "Close: " + param.data[1] + "<br/>",
                  "Lowest: " + param.data[2] + "<br/>",
                  "Highest: " + param.data[3] + "<br/>",
                ].join("");
              },
            },
          },
          {
            name: "MA5",
            type: "line",
            data: null,
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA10",
            type: "line",
            data: null,
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA20",
            type: "line",
            data: null,
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA30",
            type: "line",
            data: null,
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "Volume",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: null,
          },
        ],
      },
    };
  },
  mounted: function () {
    this.k_ccode_chart = echarts.init(
      document.getElementById("k_ccode_div"),
      "white",
      {
        renderer: "canvas",
      }
    );
    this.init();
  },
  methods: {
    init: function () {
      this.getfundindustrydata();
    },
    pricestyle: function ({ row, column, rowIndex, columnIndex }) {
      //   console.log(columnIndex);
      if (columnIndex > 0) {
        if (row[column.property] > 0) {
          return "color : Red";
        } else if (row[column.property] < 0) {
          return "color : Green";
        } else {
          return "color : Black";
        }
      }
    },
    getcheckdata: function () {
      console.log(this.check_time_select);
      this.getfundindustrydata();
    },
    // todo 待优化
    calculateMA: function (dayCount) {
      var result = [];
      let data = this.chartdata;
      for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
      }
      return result;
    },
    industryselect: function (row) {
      if (row !== undefined) {
        this.code_select = row.ccode;
      }
      axios
        .post("/getchartdata", { ccode: this.code_select })
        .then((response) => {
          //   console.log(response);
          this.chartdata = response.data;
          this.k_ccode_option.title.text = this.chartdata.cname;
          this.k_ccode_option.xAxis[0].data = this.chartdata.categoryData;
          this.k_ccode_option.xAxis[1].data = this.chartdata.categoryData;
          this.k_ccode_option.series[0].data = this.chartdata.values;
          this.k_ccode_option.series[1].data = this.calculateMA(5);
          this.k_ccode_option.series[2].data = this.calculateMA(10);
          this.k_ccode_option.series[3].data = this.calculateMA(20);
          this.k_ccode_option.series[4].data = this.calculateMA(30);
          this.k_ccode_option.series[5].data = this.chartdata.volumes;
          this.k_ccode_chart.setOption(this.k_ccode_option);
          //   console.log(this.k_ccode_option);
        });
    },
    getfundindustrydata: function () {
      axios
        .post("/getfundindustrydata", { check_time: this.check_time_select })
        .then((response) => {
          //   console.log(response);
          this.fundindustrydata = response.data;
          this.code_select = this.fundindustrydata[0].ccode;
          this.industryselect();
        });
    },
    filterTag(value, row) {
      return row.types === value;
    },
  },
};
</script>

