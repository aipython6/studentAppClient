<template>
  <div class="container">
    <Header
      :roles="[user.role]"
      :showInput="false"
      :showSearchType="false"
      :showSearchBtn="false"
      :showDownloadBtn="false"
      @handleCreate="handleCreate"
      />
  </div>
</template>
<script>
import Header from '@/components/Header'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { wxImagesUpload } from '@/utils/url'
import { getUsername, getToken } from '@/utils/auth'
export default {
  components: { Header, Pagination },
  name: 'Link',
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
        update: "更新图片内容",
        create: "新增图片内容",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      timeout: null,
      temp: {
        enabled: 0,
        url: '',
        type: 0,
        content: '',
        create_by: getUsername(),
      },
      list: [],
      listLoading: false,
      rules: {
        content: [
          { required: true, message: "请输入文字内容", trigger: "blur" },
        ],
        create_by: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
        ],
        enabled: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择图片类型", trigger: "blur" },
        ],
        url: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur",
          },
        ],
      },
      headers: { authorization: "", username: "" },
      imageUrl: '',
      upload_url: wxImagesUpload,
      srcList: [],
    };
  },
  methods: {
    handleCreate(val) {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = val;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
  }
};
</script>
<style lang="scss" scoped></style>
