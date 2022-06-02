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
          min-width="5px"
        />
        <el-table-column
          label="用户名"
          prop="username"
          align="center"
          min-width="8px"
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
          min-width="5px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.gender }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属部门"
          prop="deptname"
          align="center"
          min-width="10px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.deptname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="角色"
          prop="role"
          align="center"
          min-width="6px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="create_time"
          align="center"
          min-width="12px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <i class="el-icon-time" style="margin-right: 3px" />
            <span>{{ row.create_time }}</span>
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
          min-width="17px"
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
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="科室名称" prop="deptname">
          <el-autocomplete
            prefix-icon="el-icon-search"
            v-model="temp.deptname"
            clearable
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入科室名称"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="temp.gender">
            <el-radio :label="0">男性</el-radio>
            <el-radio :label="1">女性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="temp.role">
            <el-radio :label="0">admin</el-radio>
            <el-radio :label="1">normal</el-radio>
          </el-radio-group>
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
import { mapGetters } from "vuex";
import { all, edit, add, del, blurry } from "@/api/settings/user/user";
import { getDeptList } from '@/api/settings/dept/dept'
export default {
  components: { Header, Pagination },
  data() {
    return {
      tableKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      // 对话框title
      textMap: {
        update: "更新用户信息",
        create: "新增用户信息",
      },
      typeItems: ['用户名'],
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      temp: {
        username: "",
        enabled: 0,
        deptid: '',
        deptname: '',
        role: "",
        gender: '',
      },
      deptList: [],
      list: [],
      listLoading: false,
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        enabled: [{ required: true, message: "请选择是否可用", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        deptname: [{ required: true, message: "请选择科室", trigger: "blur" }],
      }
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getDeptList()
    this.getAll()
  },

  methods: {
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    getDeptList() {
      getDeptList().then(res => {
        const { content } = res
        this.deptList = content.map(e => {
          return { deptid: e.deptid, value: e.deptname }
        })
      })
    },
    getAll() {
      // const temp = Object.assign({}, this.listQuery);
      all(this.listQuery).then((res) => {
        this.listLoading = true;
        const { content, total } = res;
        this.list = content;
        this.total = total;
        this.srcList = this.list.map((e) => e.url);
        setTimeout(() => {
          this.listLoading = false;
        }, 1000);
      });
    },

    handleFilter({ searchType, searchVal }) {
      if (searchType === "用户名") {
        const temp = Object.assign({}, { name: searchVal }, this.listQuery);
        blurry(temp).then((res) => {
          this.list = res.content;
          this.total = res.total;
        });
      } else {
        this.getAll();
      }
    },

    resetTemp() {
      this.temp = {
        username: "",
        enabled: 0,
        deptid: '',
        deptname: '',
        role: 0,
        gender: 0,
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
    handleDelete(row, index) {
      // 也将url传递给后台,后台根据图片文件名删除目录中的图片文件
      const { uid } = row;
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(uid).then((res) => {
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
    querySearchAsync(queryString, cb) {
      const deptList = this.deptList;
      const results = queryString
        ? deptList.filter(this.createStateFilter(queryString))
        : deptList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000);
    },
    // 过滤草稿标题内容
    createStateFilter(queryString) {
      return (state) => {
        return state.value.indexOf(queryString.toLowerCase()) === 0;
      };
    },
    // 选择草稿标题后触发
    handleSelect(item) {
      this.temp.deptid = item.deptid;
    },

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
