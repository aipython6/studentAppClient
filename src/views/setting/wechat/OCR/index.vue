<template>
  <div class="container">
    <span>当前学习时间: {{ study_time }}</span>
  </div>
</template>
<script>
import moment from 'moment'
let timer_id = -1
let sec_count = 0
let my_start = 0
export default {
  name: 'OCR',
  data() {
    return {
      study_time: '',
      hours: '',
      minutes: '',
      seconds: ''
    };
  },
  mounted() {
    // enter_time = new Date()
    this.start()
  },
  destroyed() {
    // out_time = new Date()
    // stay_time = out_time.getTime() - enter_time.getTime()
  },
  methods: {
    start() {
      if (my_start === 1) {
        return
      }
      my_start = 1
      timer_id = setInterval(() => {
        sec_count ++
        const time = moment.duration(sec_count, 'seconds')
        let hours = time.hours()
        let minutes = time.minutes()
        let seconds = time.seconds()
        this.study_time = moment({ h: hours, m: minutes, s: seconds }).format('HH:mm:ss')
      },1000)
    }
  }
};
</script>
<style lang="scss" scoped></style>
