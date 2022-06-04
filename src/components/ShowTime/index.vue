<template>
  <!-- 显示时间的组件 -->
  <div class="time">
    <span>今天是{{ date }}</span>
    <span>{{ week }}</span>
    <span style="color: #b553f2">(当前时间{{ showtime }})</span>
  </div>
</template>
<script>
import moment from "moment";
import getWeek from "@/utils/getWeek";
import axios from "axios";
export default {
  name: "ShowTime",
  data() {
    return {
      date: undefined,
      week: undefined,
      showtime: "",
      weather: "",
    };
  },
  mounted() {
    this.getDate();
    this.start();
    // this.getWeather();
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
    getWeather() {
      const location = "101250401";
      const key = "b4e661a4527649d7b5ddee0bb95cdfa5";
      axios
        .get({
          url: "https://devapi.qweather.com/v7/weather/now",
          params: { location: location, key: key },
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.time {
  position: absolute;
  right: 100px;
  font-size: 14px;
  float: left;
  color: #909399;
}
</style>
