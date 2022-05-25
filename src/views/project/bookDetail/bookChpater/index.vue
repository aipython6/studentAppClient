<template>
  <div class="container">
    <el-tree
      :data="list"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="margin-left: 10px;">
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="章节名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入章节名称" />
        </el-form-item>
        <el-form-item label="课本名称" prop="pname">
          <el-autocomplete
            prefix-icon="el-icon-search"
            v-model="temp.pname"
            clearable
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入课本名称"
            @select="handleSelect"
          ></el-autocomplete>
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
import { getYMD } from "@/utils/handleDate";
import { add, edit, del, all } from "@/api/bookDetail/bookChapter";
import { allbookList } from "@/api/bookDetail/book";
import { getUsername } from "../../../../utils/auth";
export default {
  name: "bookChapter",
  components: { Header, Pagination },
  data() {
    return {
      // 对话框title
      textMap: {
        update: "更新一级章节",
        create: "新增一级章节",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      list: [],
      listLoading: false,
      temp: {
        name: "",
        enabled: 0,
        blid: "",
        pname: "",
        create_by: getUsername(),
      },
      rules: {
        name: [{ required: true, message: "请输入课本名称", trigger: "blur" }],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
        pname: [{ required: true, message: "请选择上级类目", trigger: "blur" }],
      },
      bookList: [],
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getAll();
    this.getBookList();
  },
  methods: {

    append(data) {
      console.log(data)
      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
    },

    remove(node, data) {
      console.log(node)
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);
    },
    
    getAll() {
      all().then((res) => {
        this.listLoading = true;
        const { content } = res;
        this.list = content;
        setTimeout(() => {
          this.listLoading = false;
        }, 1000);
      });
    },

    getBookList() {
      allbookList(this.listQuery).then((res) => {
        const { content } = res;
        this.bookList = content.map((e) => {
          return {
            blid: e.blid,
            value: e.name,
          };
        });
      });
    },



    resetTemp() {
      this.temp = {
        name: "",
        enabled: 0,
        blid: "",
        pname: "",
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

    handleSetStatus(row) {
      const { ccid, blid, name, enabled } = row;
      const temp = {
        ccid: ccid,
        blid: blid,
        name: name,
        enabled: enabled,
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
      const { bcid } = row;
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(bcid).then((res) => {
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
      const bookList = this.bookList;
      const results = queryString
        ? bookList.filter(this.createStateFilter(queryString))
        : bookList;
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
      this.temp.blid = item.blid;
    },

    handleDownload() {},
  },
};
</script>
