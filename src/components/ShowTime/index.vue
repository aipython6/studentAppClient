<template>
  <!-- 显示时间的组件 -->
  <div class="time">
    <span class="weather">
      <span>今天是{{ date }}</span>
      <span>{{ week }}</span>
      <span style="color: #b553f2">(当前时间{{ showtime }})</span>
      <span style="margin: 0 10px 0 20px">{{ weather.temp }}</span>
      <span>{{ weather.text }}</span>
      <img
      :src="weather.src"
      width="30"
      height="30"
      />
    </span>
  </div>
</template>
<script>
import moment from "moment";
import getWeek from "@/utils/getWeek";
import { mapGetters } from "vuex";
export default {
  name: "ShowTime",
  data() {
    return {
      date: undefined,
      week: undefined,
      showtime: "",
    };
  },
  computed: {
    ...mapGetters(["weather"]),
  },
  mounted() {
    this.getDate();
    this.start();
  },
  methods: {
    // 当前时间
    start() {
      setInterval(() => {
        const date = new Date();
        let time = moment(date, "seconds");
        const hours = time.hours();
        const minutes = time.minutes();
        const seconds = time.seconds();
        this.showtime = moment({ h: hours, m: minutes, s: seconds }).format(
          "HH:mm:ss"
        );
        time++;
      }, 1000);
    },
    getDate() {
      this.date = moment().format("YYYY年MM月DD日");
      this.week = getWeek(moment().day());
    },
  },
};
</script>
<style lang="scss" scoped>
.time {
  position: absolute;
  right: 90px;
  font-size: 14px;
  float: left;
  color: #909399;
  .weather {
    position: relative;
    right: 10px;
    span {
      &::nth-child(2) {
        margin-right: 5px;
      }
    }
    img {
      position: relative;
      top: 10px;
    }
  }
}
</style>
