<template>
  <div id="app">
    <el-row>
      <el-col :span="4">
        <el-button @click="getfishdata" type="primary">刷新</el-button>
        <el-button @click="freshfishtang" type="success">刷新top50</el-button>
        <el-button @click="gethistory" type="danger">拉取历史净值</el-button>
      </el-col>
      <!-- <el-col :span="12"> -->
      <el-upload
        ref="upload"
        action="action"
        :http-request="uploadjson"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" type="primary">选取文件</el-button>
        <el-button type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      <!-- </el-col> -->
    </el-row>
    <el-col :span="16">
      <el-row>
        <el-table
          :data="fishtang"
          style="width: 100%"
          height="900"
          @row-click="changefundchart"
          :cell-style="beautifulcell"
        >
          <el-table-column prop="fund_code" label="代码" width="80">
          </el-table-column>
          <el-table-column prop="fund_name" label="名称" width="260">
          </el-table-column>
          <!-- <el-table-column prop="fund_type" label="类型" width="100">
          </el-table-column> -->
          <el-table-column prop="to7day" sortable label="近7天" width="100">
          </el-table-column>
          <el-table-column prop="to30day" label="近30天" width="80">
          </el-table-column>
          <el-table-column prop="to90day" label="近90天" width="80">
          </el-table-column>
          <el-table-column prop="to180day" label="近180天" width="80">
          </el-table-column>
          <el-table-column
            prop="earn_percent"
            sortable
            label="昨天"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="fund_industry_label"
            label="基金行业"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="fund_label"
            label="标签"
            width="100"
            :filters="[
              { text: 'W', value: 'W' },
              { text: 'R', value: 'R' },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
          </el-table-column>
          <el-table-column prop="cost" label="成本" width="80">
          </el-table-column>
          <el-table-column
            prop="have_earn_percent"
            sortable
            label="收益率"
            width="100"
          >
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="addtoobserve(scope.row)"
                type="text"
                size="small"
                v-if="!scope.row.fund_label"
                >加入</el-button
              >
              <el-button
                @click="removeobserve(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.fund_label"
                >移除</el-button
              ></template
            >
          </el-table-column>
        </el-table>
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row>
        <div id="div_one_total" style="height: 450px"></div>
      </el-row>
      <el-row> </el-row>
    </el-col>
  </div>
</template>

<script>
import axios from "axios";
var echarts = require("echarts");
export default {
  data() {
    return {
      fishtang: [],
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
      click_fund_code: "",
      click_fund_name: "",
      fileList: [],
    };
  },
  mounted: function () {
    this.getfishdata();
    this.one_total_chart = echarts.init(
      document.getElementById("div_one_total"),
      "white",
      {
        renderer: "canvas",
      }
    );
  },
  methods: {
    uploadjson: function (params) {
      console.log(params);
      const formData = new FormData();
      formData.append("file", params.file);
      axios.post("/uploadfiles", formData).then((response) => {
        this.$message({
          message: "更新成功",
          type: "success",
        });
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    getfishdata: function () {
      axios.get("/getfishdata").then((response) => {
        // console.log(response);
        this.$message({
          message: "获取数据成功",
          type: "success",
        });
        this.fishtang = response.data.data;
      });
    },
    gethistory: function () {
      axios.get("/gethistory").then((response) => {
        // console.log(response);
        if (response.data.update) {
          this.$message.success(response.data.msg);
        } else {
          this.$message.error(response.data.msg);
        }
      });
    },

    freshfishtang: function () {
      this.fishtang = [];
      axios.get("/freshfishtang").then((response) => {
        this.$message({
          message: "更新成功",
          type: "success",
        });
        this.getfishdata();
      });
    },
    freshfry: function () {
      this.fishtang = [];
      axios.get("/freshfry").then((response) => {
        this.$message({
          message: "鱼苗信息拉取成功",
          type: "success",
        });
        this.getfishdata();
      });
    },
    filterTag(value, row) {
      // TODO 判断undefined
      console.log(row.fund_label);
      console.log(~row.fund_label.indexOf(value));
      return row.fund_label === value;
    },
    addtoobserve: function (event) {
      // console.log(event);
      axios
        .post("/addtoobserve", {
          fund_code: event.fund_code,
          fund_name: event.fund_name,
        })
        .then((response) => {
          this.$message({
            message: "更新成功",
            type: "success",
          });
          this.getfishdata();
        });
    },
    removeobserve: function (event) {
      axios
        .post("/removeobserve", {
          fund_code: event.fund_code,
          fund_name: event.fund_name,
        })
        .then((response) => {
          this.$message({
            message: "更新成功",
            type: "success",
          });
          this.getfishdata();
        });
    },
    changefundchart: function (row, event, column) {
      this.click_fund_code = row.fund_code;
      this.click_fund_name = row.fund_name;
      this.setonetotalchart();
    },
    setonetotalchart: function () {
      axios
        .post("/getonetotalchart", {
          fund_code: this.click_fund_code,
          fishtang: true,
        })
        .then((response) => {
          this.one_total_option.xAxis.data = response.data.xAxisdata;
          this.one_total_option.series.data = response.data.seriesdata;
          this.one_total_option.title.text =
            this.click_fund_name + "近15天走势";
          this.one_total_option.dataZoom[0].startValue =
            response.data.xaxisrange;
          this.one_total_option.dataZoom[1].startValue =
            response.data.xaxisrange;
          this.one_total_option.series.markPoint.data = response.data.mps;
          this.one_total_option.series.markLine.data = response.data.mkl;
          // console.log(response);
          // console.log(this.one_total_option);
          this.one_total_chart.setOption(this.one_total_option);
        });
    },
    beautifulcell: function ({ row, column, rowIndex, columnIndex }) {
      // console.log(this)
      // console.log(row,column,rowIndex,columnIndex)
      if ((columnIndex > 1 && columnIndex < 7) || columnIndex == 10) {
        if (row[column.property] > 0) {
          return "color : Red";
        } else {
          return "color : Green";
        }
      }
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
