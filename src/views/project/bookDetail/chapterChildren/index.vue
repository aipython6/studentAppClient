<template>
  <div class="container">
    <Header
      :size="'small'"
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
import { mapGetters } from "vuex";
import { getYMD } from "@/utils/handleDate";
import { getUsername } from "../../../../utils/auth";
import { allBookChapter } from "@/api/bookDetail/bookChapter";
import { add, edit, del, all } from "@/api/bookDetail/chapterChildren";
export default {
  components: { Header, Pagination },
  name: "chapterChildren",
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
        update: "更新一级章节",
        create: "新增一级章节",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      typeItems: ["课本名称", "发布时间"],
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      list: [],
      listLoading: false,
      typeItems: ["课本名称", "发布时间"],
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
      bookChapterList: [],
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    getBookChapterList() {
      allBookChapter(this.listQuery).then((res) => {
        const { content } = res;
        this.bookChapterList = content.map((e) => {
          return {
            bcid: e.bcid,
            value: e.name,
          };
        });
      });
    },
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

    load() {},
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
      const { ccid, bcid, name, enabled } = row;
      const temp = {
        ccid: ccid,
        bcid: bcid,
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
<style lang="scss" scoped></style>
