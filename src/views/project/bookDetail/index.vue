<template>
  <div class="container">
      <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="一级章节管理" name="first">
        <bookChapter />
      </el-tab-pane>
      <el-tab-pane label="二级章节管理" name="second">
        <chapterChildren />
      </el-tab-pane>
      <el-tab-pane label="章节内容管理" name="third">
        <chapterContent />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import bookChapter from './bookChpater'
import chapterChildren from './chapterChildren'
import chapterContent from './chapterContent'
export default {
  components: { bookChapter, chapterChildren, chapterContent },
  data() {
    return {
      activeName: 'first'
    };
  },
};
</script>
<style lang="scss" scoped>
  .container {
    margin: 15px;
  }
</style>
