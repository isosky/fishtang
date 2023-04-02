<template>
  <div id="app">
    <el-col :span="8">
      <el-row :span="5">
        <el-input v-model="new_fund_label" style="width: 450px"></el-input>
        <el-button
          type="primary"
          @click="commitlabel"
          icon="el-icon-check"
        ></el-button>
      </el-row>
      <el-row :span="5">
        <el-table :data="label_data">
          <el-table-column
            prop="fund_label"
            label="行业"
            width="120"
          ></el-table-column>
        </el-table>
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row :span="5">
        <el-select
          v-model="label_data_selected"
          clearable
          filterable
          allow-create
          default-first-option
          placeholder="请选择行业"
          style="width: 200px"
        >
          <el-option
            v-for="item in fund_label_option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="fund_had_code_selected"
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
          </el-option>
        </el-select>
        <el-button
          type="primary"
          @click="commitfundlabel"
          icon="el-icon-check"
        ></el-button>
      </el-row>
      <el-row :span="5">
        <el-table :data="getfundlabeldata">
          <el-table-column
            prop="fund_label"
            label="行业"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="fund_code"
            label="行业"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="fund_name"
            label="行业"
            width="240"
          ></el-table-column>
        </el-table>
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row :span="5">
        <el-input v-model="author" style="width: 250px"></el-input>
        <el-select
          v-model="apps_selected"
          clearable
          filterable
          allow-create
          default-first-option
          placeholder="请选择apps"
          style="width: 200px"
        >
          <el-option
            v-for="item in apps_option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-switch
          v-model="isfirm"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
        <el-button
          type="primary"
          @click="commitauthor"
          icon="el-icon-check"
        ></el-button>
      </el-row>
      <el-row :span="5">
        <el-table :data="authortable">
          <el-table-column
            prop="funder_name"
            label="行业"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="apps"
            label="行业"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="is_firm"
            label="行业"
            width="240"
          ></el-table-column>
        </el-table>
      </el-row>
    </el-col>
  </div>
</template>
  
  <script>
import axios from "axios";
export default {
  data() {
    return {
      new_fund_label: "",
      label_data: [],
      label_data_selected: "",
      fund_label_option: [],
      fund_had_code_selected: "",
      fund_had_option: [],
      author: "",
      apps_selected: "",
      apps_option: [],
      getfundlabeldata: [],
      authortable: [],
      isfirm: null,
    };
  },
  mounted: function () {
    this.freshall();
  },
  methods: {
    freshall: function () {
      this.getlabel();
      this.gethadfund();
      this.getfundlabel();
      this.getlabeldata();
      this.getapps();
      this.getauthortable();
    },
    commitauthor: function () {
      axios
        .post("/commitauthor", {
          author: this.author,
          apps_selected: this.apps_selected,
          isfirm: this.isfirm,
        })
        .then((response) => {
          this.author = "";
          this.apps_selected = "";
          this.isfirm = null;
          this.freshall();
        });
    },
    commitlabel: function () {
      axios
        .post("/commitlabel", {
          new_fund_label: this.new_fund_label,
        })
        .then((response) => {
          this.new_fund_label = "";
          this.freshall();
        });
    },
    commitfundlabel: function () {
      axios
        .post("/commitfundlabel", {
          label_data_selected: this.label_data_selected,
          fund_had_code_selected: this.fund_had_code_selected,
        })
        .then((response) => {
          this.label_data_selected = "";
          this.fund_had_code_selected = "";
          this.freshall();
        });
    },
    gethadfund: function () {
      axios.get("/getfund").then((response) => {
        this.fund_had_option = response.data.data;
      });
    },
    getfundlabel: function () {
      axios.get("/getfundlabel").then((response) => {
        this.fund_label_option = response.data;
      });
    },
    getlabel: function () {
      axios.get("/getlabel").then((response) => {
        this.label_data = response.data;
      });
    },
    getlabeldata: function () {
      axios.get("/getfundlabeldata").then((response) => {
        this.getfundlabeldata = response.data;
      });
    },
    getauthortable: function () {
      axios.get("/getauthortable").then((response) => {
        this.authortable = response.data;
      });
    },
    getapps: function () {
      axios.get("/getappsoption").then((response) => {
        this.apps_option = response.data;
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