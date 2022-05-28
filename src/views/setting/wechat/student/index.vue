<template>
  <div class="image">
    <Header :typeItems="typeItems" />
    <div class="table-data">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :row-class-name="rowClassName"
        :default-sort="{ prop: 'create_time' }"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          align="center"
          prop="xh"
          min-width="5px"
        />
        <el-table-column
          label="姓名"
          prop="username"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          prop="gender"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.gender }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="年龄"
          prop="age"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="昵称"
          prop="nickName"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="生日"
          prop="birthday"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.birthday }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="create_time"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="学校"
          prop="school"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.school }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="专业"
          prop="professional"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.professional }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getAll"
      />
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import { all } from "@/api/settings/wechat/student";
export default {
  components: { Header, Pagination },
  name: "weImage",
  data() {
    return {
      tableKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      list: [],
      listLoading: false,
      typeItems: ["姓名", "性别", "学校", "专业"],
    };
  },
  mounted() {
    this.getAll();
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },

    getAll() {
      all(this.listQuery).then((res) => {
        this.listLoading = true;
        const { content, total } = res;
        this.list = content;
        this.total = total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1000);
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
