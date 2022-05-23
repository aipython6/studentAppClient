<template>
  <div class="container">
    <Header
      :typeItems="typeItems"
      :roles="[user.role]"
      @handleFilter="handleFilter"
      @handleDownload="handleDownload"
      @handleCreate="handleCreate"
    />
  </div>
</template>
<script>
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import { getYMD } from '@/utils/handleDate'
import { mapGetters } from "vuex";
import { getUsername } from "../../../utils/auth";
import { all, edit, add, del } from '@/api/bookType/bookType'
export default {
  components: { Header, Pagination },
  data() {
    return {
      typeItems: ['课本名称', '发布时间', '编者', '出版社', 'ISBN'],
    };
  },
  computed:{
    ...mapGetters(['user'])
  },
  methods: {
    handleFilter() {},
    handleCreate() {},
    handleDownload() {}
  }
};
</script>
<style lang="scss" scoped>
.container {
  .table-data {
    margin: 15px;
  }
}
</style>