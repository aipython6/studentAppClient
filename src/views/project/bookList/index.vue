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
        style="width: 100%; font-size: 10px"
      >
        <el-table-column
          label="序号"
          align="center"
          prop="xh"
          min-width="4px"
        />
        <el-table-column
          label="上级类目名称"
          prop="pname"
          align="center"
          min-width="9px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.pname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="课本名称"
          prop="name"
          align="center"
          min-width="13px"
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
          min-width="12px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <i class="el-icon-time" style="margin-right: 3px" />
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="编者"
          prop="author"
          align="center"
          min-width="9px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="出版社"
          prop="publishedName"
          align="center"
          min-width="9px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.publishedName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="ISBN"
          prop="ISBN"
          align="center"
          min-width="9px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.ISBN }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="课本封面"
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
                id="book-coverImg"
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
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入课本名称" />
        </el-form-item>
        <el-form-item label="上级类目" prop="pname">
          <el-autocomplete
            prefix-icon="el-icon-search"
            v-model="temp.pname"
            clearable
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入上级类目名称"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="编者" prop="author">
          <el-input v-model="temp.author" placeholder="请输入编者" />
        </el-form-item>
        <el-form-item label="出版社" prop="publishedName">
          <el-input
            v-model="temp.publishedName"
            placeholder="请输入出版社名称"
          />
        </el-form-item>
        <el-form-item label="ISBN" prop="ISBN">
          <el-input v-model="temp.ISBN" placeholder="请输入ISBN" />
        </el-form-item>
        <el-form-item label="课本封面" prop="coverImg">
          <el-upload
            :headers="headers"
            accept=".jpg,.png,.jpeg,.bmp"
            class="avatar-uploader"
            :action="upload_url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
import { getYMD } from "@/utils/handleDate";
import { mapGetters } from "vuex";
import { getUsername, getToken } from "../../../utils/auth";
import { all, edit, add, del } from "@/api/bookList/bookList";
import { allbookType } from "@/api/bookType/bookType";
import { coverImgUpload } from "@/utils/url";
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
        update: "更新课本信息",
        create: "新增课本信息",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      typeItems: ["课本名称", "发布时间", "编者", "出版社", "ISBN"],
      temp: {
        name: "",
        enabled: 0,
        ISBN: "",
        publishedName: "",
        author: "",
        coverImg: "",
        btid: "",
        pname: "",
        create_by: getUsername(),
      },
      // 父级类目列表
      bookTypeList: [],
      list: [],
      listLoading: false,
      rules: {
        name: [{ required: true, message: "请输入课本名称", trigger: "blur" }],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
        author: [{ required: true, message: "请输入编者", trigger: "blur" }],
        publishedName: [
          { required: true, message: "请输入出版社名称", trigger: "blur" },
        ],
        ISBN: [{ required: true, message: "请输入ISBN", trigger: "blur" }],
        coverImg: [
          { required: true, message: "请上传课本封面", trigger: "blur" },
        ],
        pname: [{ required: true, message: "请选择上级类目", trigger: "blur" }],
      },
      imageUrl: "",
      headers: { authorization: "", username: "" },
      upload_url: coverImgUpload,
      srcList: [],
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getAll();
    this.getBookTypeList();
    this.headers.authorization = getToken();
    this.headers.username = getUsername();
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
        this.srcList = this.list.map((e) => e.coverImg);
        setTimeout(() => {
          this.listLoading = false;
        }, 1000);
      });
    },

    getBookTypeList() {
      allbookType(this.listQuery).then((res) => {
        const { content } = res;
        this.bookTypeList = content.map((e) => {
          return {
            btid: e.btid,
            value: e.name,
          };
        });
      });
    },

    handleFilter({ searchType, searchVal }) {
      if (searchType === "课本类型") {
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
      } else {
        this.getAll();
      }
    },

    resetTemp() {
      this.temp = {
        name: "",
        enabled: 0,
        ISBN: "",
        publishedName: "",
        author: "",
        coverImg: "",
        btid: "",
        pname: "",
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

    handleSetStatus(row) {
      const {
        btid,
        blid,
        coverImg,
        name,
        enabled,
        publishedName,
        ISBN,
        author,
      } = row;
      const temp = {
        btid: btid,
        blid: blid,
        name: name,
        enabled: enabled,
        coverImg: coverImg,
        publishedName: publishedName,
        ISBN: ISBN,
        author: author,
      };
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
      const { blid } = row;
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(blid).then((res) => {
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
      const bookTypeList = this.bookTypeList;
      const results = queryString
        ? bookTypeList.filter(this.createStateFilter(queryString))
        : bookTypeList;
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
      this.temp.btid = item.btid;
    },

    // 上传图片前的检查
    beforeAvatarUpload(file) {},
    // 图片上传成功后的回调
    handleAvatarSuccess(file) {
      const { content, msg } = file;
      this.$message.success(msg);
      this.temp.coverImg = content.url;
      this.imageUrl = content.url;
    },

    handleDownload() {},
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
<style lang="scss" scoped>
.container {
  .table-data {
    margin: 15px;
  }
}
</style>
