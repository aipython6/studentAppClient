<template>
  <div class="container">
    <div style="font-size: 12px; color: red; margin-bottom: 5px">
      注意:课本添加按钮是添加1级章节;1级章节按钮是添加2级章节;2级章节按钮跳转到新页面来添加具体的章节内容
    </div>
    <el-input
      placeholder="输入课本名称过滤"
      v-model="filterText"
      size="small"
      clearable
    />
    <el-tree
      ref="tree"
      :data="list"
      show-checkbox
      node-key="id"
      accordion
      default-expand-all
      :auto-expand-parent="false"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="margin-left: 30px">
          <el-tooltip
            class="item"
            effect="dark"
            content="添加章节"
            placement="bottom"
          >
            <el-button type="text" size="mini" @click="() => append(data)">
              添加
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑章节"
            placement="bottom"
          >
            <el-button type="text" size="mini" @click="() => update(data)">
              编辑
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除章节"
            placement="bottom"
          >
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              删除
            </el-button>
          </el-tooltip>
        </span>
      </span>
    </el-tree>
    <!-- 一级章节的dailog -->
    <el-dialog
      :title="textMap1[dialogStatus1]"
      :visible.sync="dialogFormVisible1"
    >
      <el-form
        ref="dataForm1"
        :rules="rules1"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="temp1.pname" disabled />
        </el-form-item>
        <el-form-item label="章节名称" prop="name">
          <el-input v-model="temp1.name" placeholder="请输入一级章节名称" />
        </el-form-item>
        <el-form-item label="创建人" prop="create_by">
          <el-input v-model="temp1.create_by" disabled />
        </el-form-item>
        <el-form-item label="是否可用" prop="enabled">
          <el-switch
            v-model="temp1.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus1 === 'create' ? createData1() : updateData1()"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 二级章节的dialog -->
    <el-dialog
      :title="textMap2[dialogStatus2]"
      :visible.sync="dialogFormVisible2"
    >
      <el-form
        ref="dataForm2"
        :rules="rules2"
        :model="temp2"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="temp2.pname" disabled />
        </el-form-item>
        <el-form-item label="章节名称" prop="name">
          <el-input v-model="temp2.name" placeholder="请输入二级章节名称" />
        </el-form-item>
        <el-form-item label="创建人" prop="create_by">
          <el-input v-model="temp2.create_by" disabled />
        </el-form-item>
        <el-form-item label="是否可用" prop="enabled">
          <el-switch
            v-model="temp2.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus2 === 'create' ? createData2() : updateData2()"
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
import {
  add,
  edit,
  del,
  all,
  getNameBybid,
} from "@/api/bookDetail/bookChapter";
import { getUsername, setBid } from "../../../../utils/auth";
export default {
  name: "bookChapter",
  components: { Header, Pagination },
  data() {
    return {
      filterText: "",
      list: [],
      listLoading: false,
      /******************一级章节的dialog**************** */
      // 对话框title
      textMap1: {
        update: "更新一级章节信息",
        create: "新增一级章节信息",
      },
      dialogStatus1: "",
      dialogFormVisible1: false,
      temp1: {
        type: 1,
        bid: "",
        name: "",
        enabled: 0,
        pname: "",
        pid: "",
        create_by: getUsername(),
      },
      rules1: {
        name: [
          { required: true, message: "请输入一级章节名称", trigger: "blur" },
        ],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
      },

      /*********************** 二级章节的dialog*********************** */
      textMap2: {
        update: "更新二级章节信息",
        create: "新增二级章节信息",
      },
      dialogStatus2: "",
      dialogFormVisible2: false,
      temp2: {
        type: 2,
        bid: "",
        name: "",
        enabled: 0,
        pname: "",
        create_by: getUsername(),
      },
      rules2: {
        name: [
          { required: true, message: "请输入二级章节名称", trigger: "blur" },
        ],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getAll();
  },
  methods: {
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

    filterNode(val, data) {
      if (!val) return true;
      return data.label.indexOf(val) !== -1;
    },

    resetTemp1(pname, pid) {
      this.temp1 = {
        type: 1,
        name: "",
        enabled: true,
        pname: pname,
        pid: pid,
        create_by: getUsername(),
      };
    },
    resetTemp2(pname, pid) {
      this.temp2 = {
        type: 2,
        name: "",
        enabled: true,
        pname: pname,
        pid: pid,
        create_by: getUsername(),
      };
    },
    // 添加按钮
    async handleCreate(bid, pid, type) {
      const { pname } = await getNameBybid(bid);
      // 一级章节
      if (type === 0) {
        this.resetTemp1(pname, pid);
        this.dialogStatus1 = "create";
        this.dialogFormVisible1 = true;
        this.$nextTick(() => {
          this.$refs["dataForm1"].clearValidate();
        });
        // 二级章节
      } else if (type === 1) {
        this.resetTemp2(pname, pid);
        this.dialogStatus2 = "create";
        this.dialogFormVisible2 = true;
        this.$nextTick(() => {
          this.$refs["dataForm2"].clearValidate();
        });
        // 跳转到新页面,用于添加具体的二级章节内容
      } else if (type === 2) {
        this.scan(bid);
      }
    },
    append(data) {
      this.handleCreate(data.id, data.id, data.type);
    },

    createData1() {
      this.$refs["dataForm1"].validate((valid) => {
        if (valid) {
          this.$confirm("是否添加?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            add(this.temp1).then((res) => {
              const { msg } = res;
              this.dialogFormVisible1 = false;
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

    // 更新时设置temp
    updateTemp1(name, pname, bid) {
      this.temp1 = {
        bid: bid,
        name: name,
        pname: pname,
        create_by: getUsername(),
        enabled: true,
      };
    },

    updateTemp2(name, pname, bid) {
      this.temp2 = {
        bid: bid,
        name: name,
        pname: pname,
        create_by: getUsername(),
        enabled: true,
      };
    },

    async handleUpdate(name, bid, pid, type) {
      const { pname } = await getNameBybid(pid);
      if (type === 1) {
        this.updateTemp1(name, pname, bid);
        this.dialogStatus1 = "update";
        this.dialogFormVisible1 = true;
        this.$nextTick(() => {
          this.$refs["dataForm1"].clearValidate();
        });
      } else if (type === 2) {
        this.updateTemp2(name, pname, bid);
        this.dialogStatus2 = "update";
        this.dialogFormVisible2 = true;
        this.$nextTick(() => {
          this.$refs["dataForm2"].clearValidate();
        });
      }
    },

    update(data) {
      this.handleUpdate(data.label, data.id, data.pid, data.type);
    },

    updateData1() {
      this.$refs["dataForm1"].validate((valid) => {
        if (valid) {
          this.$confirm("是否更新?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const tempData = Object.assign({}, this.temp1);
            edit(tempData).then((res) => {
              const { msg } = res;
              this.getAll();
              this.dialogFormVisible1 = false;
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

    updateData2() {
      this.$refs["dataForm2"].validate((valid) => {
        if (valid) {
          this.$confirm("是否更新?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const tempData = Object.assign({}, this.temp2);
            edit(tempData).then((res) => {
              const { msg } = res;
              this.getAll();
              this.dialogFormVisible2 = false;
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

    createData2() {
      this.$refs["dataForm2"].validate((valid) => {
        if (valid) {
          this.$confirm("是否添加?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            add(this.temp2).then((res) => {
              const { msg } = res;
              this.dialogFormVisible2 = false;
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

    remove(data) {
      this.handleDelete(data.data.id);
    },
    handleDelete(bid) {
      this.$confirm("该操作将会删除其下所有章节,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(bid).then((res) => {
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
    scan(bid) {
      setBid(bid);
      this.$router.push({ name: "ChapterContent" });
    },
  },
};
</script>
<style scoped>
.el-input {
  width: 300px;
  margin-bottom: 10px;
}
.el-tree::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.el-tree::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #d9d9f3;
}

.el-tree::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #fff7f7;
}
</style>
<style lang="scss" scoped>
.container {
  .el-tree {
    overflow: auto;
    height: 530px;
  }
}
</style>
