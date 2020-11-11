<template>
  <sub-layout
    title="마이페이지"
    tooltip="나의 활동 기록을 살펴보자!"
    :recent-books="false"
  >
    <div class="top">
      <profile :user="user" />
      <result-table
        :month="month"
        @prev="month -= 1"
        @next="month += 1"
      />
    </div>
    <div class="bottom">
      <div id="mypage-activity-left-bookname">
        <transition
          name="slide-up"
          mode="out-in"
        >
          <div :key="widIndex">
            {{ book.title }}
          </div>
        </transition>
      </div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          id="mypage-activity-left-date"
          :key="widIndex"
        >
          {{ work.date }}
        </div>
      </transition>

      <v-btn
        id="mypage-activity-left-arrow"
        icon
        color="#668d8d"
        x-large
        :disabled="isStart"
        @click="prevWork"
      >
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
      </v-btn>

      <transition
        :name="slideDirection"
        mode="out-in"
      >
        <div
          id="mypage-activity"
          :key="widIndex"
        >
          <mind-map-result
            v-if="work.type === 0"
            :work="work"
          />
          <quiz-game-result
            v-if="work.type === 1"
            :work="work"
          />
          <drawing-result
            v-if="work.type === 2"
            :work="work"
          />
          <writing-result
            v-if="work.type === 3"
            :work="work"
          />
        </div>
      </transition>
      <v-btn
        id="mypage-activity-right-arrow"
        icon
        color="#668d8d"
        x-large
        :disabled="isEnd"
        @click="nextWork"
      >
        <v-icon>mdi-arrow-right-drop-circle</v-icon>
      </v-btn>
    </div>
  </sub-layout>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

import Profile from '../components/views/mypage/Profile.vue';
import ResultTable from '../components/views/mypage/ResultTable.vue';

import WritingResult from '../components/views/activity/writing/WritingResult.vue';
import QuizGameResult from '../components/views/activity/quiz-game/QuizGameResult.vue';
import MindMapResult from '../components/views/activity/mindmap/MindMapResult.vue';
import DrawingResult from '../components/views/activity/drawing/DrawingResult.vue';

export default {
  components: {
    Profile,
    ResultTable,
    MindMapResult,
    QuizGameResult,
    WritingResult,
    DrawingResult,
  },
  data() {
    return {
      user: {},
      month: new Date().getMonth() + 1,
      wids: [],
      widIndex: 0,
      work: {},
      showWork: false,
      slideDirection: 'slide-left',
    };
  },
  computed: {
    isStart() {
      return this.widIndex === 0;
    },
    isEnd() {
      return this.widIndex === (this.wids.length - 1);
    },
    book() {
      if (!Object.keys(this.work).length) return {};
      return this.$store.getters.book(this.work.bid);
    },
  },
  async created() {
    const { data } = await axios.get('/api/user');
    this.user = data;
    this.wids = data.wids;

    this.loadWork();
  },
  methods: {
    prevWork() {
      this.slideDirection = 'slide-left';
      if (this.isStart) return;
      this.widIndex -= 1;
      this.loadWork();
    },
    nextWork() {
      this.slideDirection = 'slide-right';
      if (this.isEnd) return;
      this.widIndex += 1;
      this.loadWork();
    },
    async loadWork() {
      if (!this.wids.length) return;
      const { data } = await axios.get(`/api/user/work/${this.wids[this.widIndex]}`);
      this.work = {
        bid: data.bid,
        type: data.type,
        content: data.content,
        date: moment(data.created_at).format('yyyy-MM-DD HH:mm:ss'),
      };
    },
  },
};
</script>

<style scoped>
.top {
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: space-between;
}

.bottom {
  width: 100%;
  height: 49%;
  margin-top: 1%;
}

#mypage-activity-left-bookname {
  position: absolute;
  width: 23vw;
  height: 7vh;
  border-radius: 3vw;
  font-size: 2vw;
  text-align: center;
  padding-top: 0.6vh;
  letter-spacing: -0.2vw;
  line-height: 6vh;
  word-spacing: 0.8vw;

  top: 50vh;
  left: 5vw;
  background: lightsalmon;
  z-index: 2;
  overflow: hidden;
}

#mypage-activity-left-date {
  position: absolute;
  font-size: 2vw;
  letter-spacing: -0.4vw;
  word-spacing: 0.8vw;
  top: 58vh;
  left: 8vw;
}

#mypage-activity-left-arrow {
  position: absolute;
  top: 78vh;
  left: 20vw;
}

#mypage-activity-right-arrow {
  position: absolute;
  top: 78vh;
  left: 71vw;
}

#mypage-activity {
  position: absolute;
  top: 46vh;
  left: 26vw;
  width: 44vw;
  height: 38vh;
  border: 2px solid gray;
  background: #fffdf2;
  z-index: 10;
  overflow: hidden;
}

#mypage-activity-cover {
  position: absolute;
  top: 46vh;
  left: 26vw;
  width: 44vw;
  height: 38vh;
  border: 2px solid gray;
  background: rgba(255, 253, 242, 1);
  z-index: 15;

  animation: fadein 1s;
  -moz-animation: fadein 1s;
  -webkit-animation: fadein 1s;
  -o-animation: fadein 1s;
}

.slide-left-enter-active {
  transition: all .3s ease;
}
.slide-left-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-left-enter {
  transform: translateX(-30px);
  opacity: 0;
}
 .slide-left-leave-to {
  transform: translateX(+30px);
  opacity: 0;
 }

 .slide-right-enter-active {
  transition: all .3s ease;
}
.slide-right-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-right-enter {
  transform: translateX(+30px);
  opacity: 0;
}
 .slide-right-leave-to {
  transform: translateX(-30px);
  opacity: 0;
 }

.slide-up { transition: all 0.35s; }
.slide-up-enter-active { transition: all 0.35s ease; }
.slide-up-leave-active { transition: all 0.35s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-up-enter, .slide-up-leave-active { opacity: 0; transform: translateY(10px); }

.fade-enter-active, .fade-leave-active { transition: opacity 1s; }
.fade-enter, .fade-leave-to { opacity: 0; }

@keyframes fadein {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
