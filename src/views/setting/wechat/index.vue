<template>
  <div class="container">
    <el-tabs type="border-card"  v-model="activeName">
      <el-tab-pane label="图片管理" name='first'>
        <weImage />
      </el-tab-pane>
      <el-tab-pane label="链接管理" name="second">
        <Link />
      </el-tab-pane>
      <el-tab-pane label="消息管理" name="third">
        <Notice />
      </el-tab-pane>
      <el-tab-pane label="文字识别" name="fourth">
        <OCR />
      </el-tab-pane>
      <el-tab-pane label="小程序用户列表" name="fifth">
        <Student />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import weImage from './image'
import Link from './link'
import Notice from './notice'
import OCR from './OCR'
import Student from './student'
export default {
  components: { weImage, Link, Notice, OCR, Student },
  data() {
    return {
      activeName: 'first'
    };
  },
};
</script>
<style lang="scss" scoped>
  .container {
    margin: 10px;
  }
</style>
