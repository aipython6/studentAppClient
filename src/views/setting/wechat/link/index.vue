<template>
  <div class="image">
    <Header
      :roles="[user.role]"
      :showInput="false"
      :showSearchType="false"
      :showSearchBtn="false"
      :showDownloadBtn="false"
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
          label="标题"
          prop="name"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="tpye"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="省份"
          prop="pname"
          align="center"
          min-width="11px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.pname }}</span>
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
          label="图片"
          prop="coverImg"
          align="center"
          min-width="8px"
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
                :src="row.coverImg"
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
        <el-form-item label="标题" prop="name">
          <el-input
            v-model="temp.name"
            clearable
            placeholder="请输入标题内容"
          />
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="temp.link" clearable placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="链接类型" prop="type">
          <el-input
            v-model="temp.type"
            clearable
            placeholder="请输入网站类型"
          />
        </el-form-item>
        <el-form-item label="所属省份" prop="pname">
          <el-autocomplete
            prefix-icon="el-icon-search"
            v-model="temp.pname"
            clearable
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入网站所属省份"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="图片" prop="coverImg">
          <el-upload
            :headers="headers"
            accept=".png,.jpg,.jpeg,.bmp,.wmf,.tif,.webp"
            class="avatar-uploader"
            :action="upload_url"
            :show-file-list="false"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";
import { linkCoverImgUpload } from "@/utils/url";
import { getUsername, getToken } from "@/utils/auth";
import { all, add, edit, del, getProvinces } from "@/api/settings/wechat/link";
export default {
  components: { Header, Pagination },
  name: "weImage",
  data() {
    return {
      provinces: [],
      tableKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      // 对话框title
      textMap: {
        update: "更新链接内容",
        create: "新增链接内容",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      temp: {
        enabled: 0,
        coverImg: "",
        pname: "",
        type: "",
        name: "",
        pid: "",
        link: "",
        create_by: getUsername(),
      },
      list: [],
      listLoading: false,
      rules: {
        name: [{ required: true, message: "请输入链接标题", trigger: "blur" }],
        pname: [{ required: true, message: "请输入省份", trigger: "blur" }],
        link: [{ required: true, message: "请输入链接", trigger: "blur" }],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入链接类型", trigger: "blur" }],
        coverImg: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur",
          },
        ],
      },
      headers: { authorization: "", username: "" },
      imageUrl: "",
      upload_url: linkCoverImgUpload,
      srcList: [],
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getProvinces();
    this.getAll();
    this.headers.authorization = getToken();
    this.headers.username = getUsername();
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    getProvinces() {
      getProvinces().then((res) => {
        this.provinces = res.content.map((e) => {
          return {
            pid: e.pid,
            value: e.pname,
          };
        });
      });
    },

    getAll() {
      all(this.listQuery).then((res) => {
        this.listLoading = true;
        const { content, total } = res;
        this.list = content;
        this.total = total;
        this.srcList = this.list.map((e) => e.coverImg);
        setTimeout(() => {
          this.listLoading = false;
        }, 1000);
      });
    },

    resetTemp() {
      this.temp = {
        enabled: 0,
        coverImg: "",
        pname: "",
        type: "",
        name: "",
        pid: "",
        link: "",
        create_by: getUsername(),
      };
      this.imageUrl = "";
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
      this.imageUrl = row.coverImg;
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
      const { lid, coverImg } = row;
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(lid, coverImg).then((res) => {
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
      const provinces = this.provinces;
      const results = queryString
        ? provinces.filter(this.createStateFilter(queryString))
        : provinces;
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
      console.log(item);
      this.temp.pid = item.pid;
    },

    // 限制图片大小的函数,小于5M
    handleChange(file) {
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$refs.clearFiles();
        this.$message({
          message: "上传的图片不能大于3M",
          type: "error",
        });
      }
      return false;
    },

    handleAvatarSuccess(file) {
      const { content, msg, code } = file;
      if (code === 200) {
        this.$message.success(msg);
        this.temp.coverImg = content.url;
        this.imageUrl = content.url;
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
  },
};
</script>
<style scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
#doctor-avatar {
  border: 1px dashed #d9d9d9;
}
#doctor-avatar:hover {
  cursor: pointer;
}
</style>
<style lang="scss" scoped></style>
