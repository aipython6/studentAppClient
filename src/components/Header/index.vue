<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col :span="9" v-if="searchType === '发布时间'">
        <el-date-picker
          :size="size === 'medium' ? '' : 'small'"
          v-model="searchVal"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-col>
      <el-col :span="5" v-else>
        <el-input
          v-if="showInput"
          :size="size"
          v-model="searchVal"
          :placeholder="'按' + searchType + '搜索'"
          style="width: 200px"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter(searchType)"
        />
      </el-col>
      <el-col :span="4" v-if="showSearchType">
        <el-select
          :size="size"
          v-model="searchType"
          placeholder="请选择搜索类型"
          style="width: 150px"
          class="filter-item"
        >
          <el-option
            v-for="item in typeItems"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="3" v-if="showSearchBtn">
        <el-button
          :size="size"
          v-waves
          class="filter-item"
          type="warning"
          icon="el-icon-search"
          @click="handleFilter(searchType, searchVal)"
          >搜索</el-button
        >
      </el-col>
      <!-- 只允许admin角色添加 -->
      <el-col :span="3" v-if="showAddBtn">
        <el-button
          v-waves
          :size="size"
          :disabled="!roles.includes('admin')"
          class="filter-item"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="handleCreate(dialogStatus)"
          >添加</el-button
        >
      </el-col>
      <el-col :span="2" v-if="showDownloadBtn">
        <el-button
          v-waves
          :size="size"
          class="filter-item"
          type="success"
          icon="el-icon-download"
          style="margin-left: 0"
          @click="handleDownload"
          >导出表格</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import waves from "@/directive/waves";
export default {
  directives: { waves },
  name: "Header",
  props: {
    typeItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 角色,只有admin才有添加的权限
    roles: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否显示输入框
    showInput: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 是否显示searchType下拉列表
    showSearchType: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 是否显示搜索按钮
    showSearchBtn: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 是否显示添加按钮
    showAddBtn: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 是否显示导出按钮
    showDownloadBtn: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 输入框和按钮的大小
    size: {
      type: String,
      default: () => {
        return "medium";
      },
    },
  },
  data() {
    return {
      searchType: this.typeItems[0],
      searchVal: "",
      dialogStatus: false,
    };
  },
  methods: {
    handleFilter(searchType, searchVal) {
      this.$emit("handleFilter", {
        searchType: searchType,
        searchVal: searchVal,
      });
    },
    handleCreate(dialogStatus) {
      this.$emit("handleCreate", !dialogStatus);
    },
    handleDownload() {
      this.$emit("handleDownload");
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin: 15px;
}
</style>
