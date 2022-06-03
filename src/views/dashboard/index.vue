<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <span style="color: #227fc3">{{ username }}</span
      >,欢迎你使用后台管理系统
    </div>
    <div v-if="user.role !== 'admin'">
      <span style="color: #f40f65; margin-top: 10px"
        >你不是管理员,无修改数据权限,若要修改数据,请联系管理员~</span
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["username", "user"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
