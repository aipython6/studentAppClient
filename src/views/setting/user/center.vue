<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img
                  :src="user.avatar"
                  title="点击上传头像"
                  class="avatar"
                  @click="toggleShow"
                />
                <myUpload
                  field="img"
                  v-model="show"
                  :headers="headers"
                  :url="uploadUrl"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <i class="el-icon-user" /> 登录账号
                  <div class="user-right">{{ user.username }}</div>
                </div>
              </li>
              <li>
                <i class="el-icon-time" /> 创建时间
                <div class="user-right">{{ user.create_time }}</div>
              </li>
              <li>
                <i class="el-icon-tickets" /> 用户简介
                <div class="user-right">{{ user.remark }}</div>
              </li>
              <li>
                <i class="el-icon-setting" /> 安全设置
                <div class="user-right">
                  <a
                    @click="$refs.pass.dialog = true"
                    style="margin-right: 10px"
                    >修改密码</a
                  >
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <updatePass ref="pass" />
  </div>
</template>
<script>
import myUpload from "vue-image-crop-upload/upload-2.vue";
import { mapGetters } from "vuex";
import updatePass from "./components/updatePass.vue";
import { getUsername, getToken } from "@/utils/auth";
import { avatarUpload } from "@/utils/url";
import store from "@/store";
export default {
  components: { myUpload, updatePass },
  data() {
    return {
      show: false,
      saveLoading: false,
      headers: {
        authorization: getToken(),
        username: getUsername(),
      },
      uploadUrl: avatarUpload,
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    // 头像上传成功后再次刷新个人信息
    cropUploadSuccess(jsonData, field) {
      store.dispatch("user/getInfo").then(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 45px;
  padding: 25px 300px;
}
ul {
  font-size: 25px;
  color: #475f77;
  li {
    margin-top: 10px;
  }
}
.avatar {
  width: 140px;
  height: 140px;
  // border-radius: 50%;
  border-radius: 10px;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;
    a {
      color: #317ef3;
    }
  }
}
</style>
