<template>
  <div class="box" :style="{ background: bgColor }"></div>
</template>
<script>
export default {
  name: 'bgColor',
  props: {
    bgColor: {
      type: String,
      default: () => {
        return "#845EC2"
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
    height: 40px;
    width: 40px;
    border-radius: 5px;
  }
</style>