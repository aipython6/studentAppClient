<template>
  <div class="container">
    <Header
      :typeItems="typeItems"
      :roles="[user.role]"
      @handleFilter="handleFilter"
      @handleDownload="handleDownload"
      @handleCreate="handleCreate"
    />
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
          min-width="3px"
        />
        <el-table-column
          label="大类名称"
          prop="name"
          align="center"
          min-width="15px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          prop="create_time"
          align="center"
          min-width="15px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <i class="el-icon-time" style="margin-right: 3px" />
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布人"
          prop="create_by"
          align="center"
          min-width="15px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_by }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否可用"
          prop="enabled"
          align="center"
          min-width="12px"
        >
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.enabled"
              :disabled="user.role !== 'admin'"
              active-color="#13ce66"
              inactive-color="#ff4949"
              inactive-text="否"
              active-text="是"
              @change="handleSetStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="18px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              :disabled="user.role !== 'admin'"
              @click="handleUpdate(row)"
              >编辑</el-button
            >
            <el-button
              v-if="row.status != 'deleted'"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              :disabled="user.role !== 'admin'"
              @click="handleDelete(row, $index)"
              >删除</el-button
            >
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="大类名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="创建人" prop="create_by">
          <el-input v-model="temp.create_by" disabled />
        </el-form-item>
        <el-form-item label="是否可用" prop="enabled">
          <el-switch
            v-model="temp.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import { getYMD } from "@/utils/handleDate";
import { mapGetters } from "vuex";
import { getUsername } from "../../../utils/auth";
import { all, edit, add, del, blurry } from "@/api/topProject/topProject";
export default {
  components: { Header, Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      // 对话框title
      textMap: {
        update: "更新课程大类",
        create: "新增课程大类",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      typeItems: ["课程大类", "发布时间"],
      tableKey: 0,
      listLoading: false,
      list: [],
      temp: {
        name: "",
        enabled: 0,
        create_by: getUsername(),
      },
      rules: {
        name: [{ required: true, message: "请输入大类名称", trigger: "blur" }],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getAll();
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    handleFilter({ searchType, searchVal }) {
      if (searchType === "课程大类") {
        const temp = Object.assign({}, { name: searchVal }, this.listQuery);
        blurry(temp).then((res) => {
          this.list = res.content;
          this.total = res.total;
        });
      } else if (searchType === "发布时间") {
        const start = getYMD(searchVal[0]);
        const end = getYMD(searchVal[1]);
        const temp = Object.assign(
          {},
          { create_time: [start, end] },
          this.listQuery
        );
        blurry(temp).then((res) => {
          this.list = res.content;
          this.total = res.total;
        });
      }
    },
    getAll() {
      all(this.listQuery).then((res) => {
        this.listLoading = true;
        const { content, total } = res;
        this.list = content;
        this.searchList = content;
        this.total = total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1000);
      });
    },
    resetTemp() {
      this.temp = {
        name: "",
        enabled: 0,
        create_by: getUsername(),
      };
    },
    handleCreate(val) {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = val;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$confirm("是否添加?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            add(this.temp).then((res) => {
              const { msg } = res;
              this.dialogFormVisible = false;
              this.getAll();
              this.$notify({
                title: "Success",
                message: msg,
                type: "success",
                duration: 2000,
              });
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$confirm("是否更新?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const tempData = Object.assign({}, this.temp);
            edit(tempData).then((res) => {
              const { msg } = res;
              this.getAll();
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: msg,
                type: "success",
                duration: 2000,
              });
            });
          });
        }
      });
    },
    handleDownload() {},
    handleSetStatus(row) {
      const { tid, name, enabled } = row;
      const temp = { tid: tid, name: name, enabled: enabled };
      this.$confirm("是否更改状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          edit(temp).then((res) => {
            const { msg } = res;
            this.getAll();
            this.$notify({
              title: "Success",
              message: msg,
              type: "success",
              duration: 2000,
            });
          });
        })
        .catch(() => {
          this.getAll();
        });
    },

    handleDelete(row, index) {
      const { tid } = row;
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(tid).then((res) => {
          const { msg } = res;
          this.getAll();
          this.$notify({
            title: "Success",
            message: msg,
            type: "success",
            duration: 2000,
          });
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 45px;
  .table-data {
    margin: 15px;
  }
}
</style>
