<template>
  <div class="container">
    <div class="baseinfo">
      <span class="bname">{{ obj.bname }}</span>
      <span class="cname">{{ obj.cname }}</span>
      <span class="name">第{{ obj.name }}节</span>
    </div>
    <div>
      <Header
        :roles="[user.role]"
        :showInput="false"
        :showSearchType="false"
        :showSearchBtn="false"
        :showDownloadBtn="false"
        @handleCreate="handleCreate"
      />
    </div>
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
          label="二级章节名称"
          prop="pname"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>第{{ row.pname }}节</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          prop="create_time"
          align="center"
          min-width="17px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <i class="el-icon-time" style="margin-right: 3px" />
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="章节内容"
          prop="url"
          align="center"
          min-width="8px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击查看大图"
              placement="bottom"
            >
              <el-image
                id="chapter-content"
                :src="row.url"
                :preview-src-list="srcList"
                style="width: 90px; height: 50px; border-radius: 5px"
              />
            </el-tooltip>
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
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入类目名称" disabled />
        </el-form-item>
        <el-form-item label="章节图片" prop="urls">
          <el-upload
            :headers="headers"
            accept=".png,.jpg,.jpeg,.bmp,.wmf,.tif,.webp"
            class="upload-demo"
            :action="upload_url"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="successUpload"
            :on-change="handleChange"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">文件不超过3M</div>
          </el-upload>
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
import { allBybid } from "@/api/bookDetail/chapterContent";
import Pagination from "@/components/Pagination";
import Header from "@/components/Header";
import { getBid, getUsername, getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import { chapterContentUpload } from "@/utils/url";
import { all, edit, add, del } from "@/api/bookDetail/chapterContent";
export default {
  name: "chapterContent",
  components: { Header, Pagination },
  data() {
    return {
      obj: { name: "", bname: "", cname: "" },
      tableKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      // 对话框title
      textMap: {
        update: "更新课本内容",
        create: "新增课本内容",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      temp: {
        name: "",
        enabled: 0,
        urls: [],
        bid: getBid(),
        create_by: getUsername(),
      },
      list: [],
      listLoading: false,
      rules: {
        name: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
        urls: [
          {
            required: true,
            message: "请上传章节图片",
            trigger: "blur",
          },
        ],
      },
      headers: { authorization: "", username: "" },
      upload_url: chapterContentUpload,
      fileList: [],
      srcList: [],
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.headers.authorization = getToken();
    this.headers.username = getUsername();
    const bid = getBid();
    this.allBybid(bid);
    this.getAll();
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    allBybid(bid) {
      allBybid(bid).then((res) => {
        const { content } = res;
        this.obj.bname = content.bname;
        this.obj.cname = content.cname;
        this.obj.name = content.name;
      });
    },

    getAll() {
      const temp = Object.assign({}, this.listQuery, { bid: getBid() });
      all(temp).then((res) => {
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

    resetTemp() {
      this.temp = {
        name: this.obj.name,
        enabled: 0,
        urls: [],
        bid: getBid(),
        create_by: getUsername(),
      };
      this.fileList = [];
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
      this.fileList.push({ url: row.url });
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
      const { ccid } = row;
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(ccid).then((res) => {
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

    // 限制图片大小的函数,小于5M
    handleChange(file) {
      const isLt3M = file.size / 1024 / 1024 < 5;
      if (!isLt3M) {
        this.$refs.clearFiles();
        this.$message({
          message: "上传的图片不能大于5M",
          type: "error",
        });
      }
      return false;
    },

    successUpload(file) {
      if (file.code === 200) {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        // this.fileList.push(file.content.url);
        this.temp.urls.push(file.content.url);
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin: 15px;
  .baseinfo {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    .bname {
      color: #981395;
      font-size: 19px;
      font-weight: bold;
      margin-right: 14px;
    }
    .cname {
      font-size: 17px;
      color: #009a72;
      margin-right: 14px;
    }
    .name {
      font-size: 15px;
      color: #5d54af;
    }
  }
}
</style>
