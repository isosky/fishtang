<template>
  <div id="app">
    <el-row v-if="islogin">
      <el-col :span="1">
        <el-menu
          :default-active="defaultactive"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @select="moveto"
        >
          <el-menu-item index="1">
            <i class="el-icon-money"></i>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-aim"></i>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-monitor"></i>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="23">
        <div>
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="!islogin">
      <el-input v-model="todo_user_name" placeholder="请输入内容"></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="todo_user_pass"
        show-password
      ></el-input>
      <el-button type="primary" @click="login">确 定</el-button>
    </el-row>
  </div>
</template>

<script>
// console.log(FishTang.data())

import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      islogin: false,
      defaultactive: "1",
      isCollapse: true,
      routers: ["/FishTang", "/FS", "/FA", "/syssetting"],
      todo_user_name: "",
      todo_user_pass: "",
    };
  },
  methods: {
    moveto: function (index) {
      this.$router.push(this.routers[index - 1]);
    },
    login: function () {
      axios
        .post("/login", {
          user_name: this.todo_user_name,
          user_pass: this.todo_user_pass,
        })
        .then((response) => {
          if (response.data.code == 200) {
            axios.defaults.headers.common["Authorization"] =
              response.data.token;
            this.islogin = true;
            this.$router.push("/FishTang");
          }
        });
    },
  },
};
</script>
