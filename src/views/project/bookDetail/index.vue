<template>
  <div class="container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="章节标题管理" name="first">
        <bookChapter />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import bookChapter from "./bookChpater";
import chapterContent from "./chapterContent";
export default {
  components: { bookChapter, chapterContent },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin: 15px;
}
</style>
