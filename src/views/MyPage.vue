<template>
  <sub-layout
    title="마이페이지"
    tooltip="나의 활동 기록을 살펴보자!"
    :recent-books="false"
    :scrollable="true"
  >
    <div class="mypage">
      <v-row class="top">
        <v-col class="col-3">
          <profile
            class="profile"
            :user="user"
          />
        </v-col>
        <v-col class="col-9">
          <result-table
            class="result-table"
            :month="month"
            @prev="month -= 1"
            @next="month += 1"
          />
        </v-col>
      </v-row>
      <div class="bottom">
        <div class="activity-book-info">
          <transition
            :name="slideDirection"
            mode="out-in"
          >
            <div :key="widIndex">
              <div class="activity-book-title">
                {{ book.title }}
              </div>
              <div class="activity-work-date">
                {{ work.date }}
              </div>
            </div>
          </transition>
        </div>
        <v-btn
          class="activity-content-prev"
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
            :key="widIndex"
            class="activity-content"
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
          class="activity-content-next"
          icon
          color="#668d8d"
          x-large
          :disabled="isEnd"
          @click="nextWork"
        >
          <v-icon>mdi-arrow-right-drop-circle</v-icon>
        </v-btn>
      </div>
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
      month: moment().month() + 1,
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

<style lang="scss" scoped>
.mypage {
  padding: 2vw;
}

.top {
  .profile {
    height: 100%;
    width: 100%;
  }

  .result-table {
    height: 100%;
    width: 100%;
  }
}

.bottom {
  width: 100%;
  margin-top: 1%;
  position: relative;

  .activity-book-info {
    position: absolute;
    clear: both;
    width: 23vw;
    border-radius: 2vw;
    font-size: 2vw;
    text-align: center;
    padding: 1vh;
    letter-spacing: -0.2vw;
    line-height: 6vh;
    word-spacing: 0.8vw;

    top: 0;
    left: 0;
    background: lightsalmon;
    z-index: 2;

    .activity-work-date {
      background: white;
      padding: 1vh;
      font-size: 3vh;
      border-radius: 2vw;
    }
  }

  .activity-content-prev {
    position: absolute;
    top: 28vh;
    left: 15vw;
  }

  .activity-content-next {
    position: absolute;
    top: 28vh;
    right: 0;
  }

  .activity-content {
    position: absolute;
    top: 0;
    left: 21vw;
    width: 44vw;
    height: 38vh;
    border: 2px solid gray;
    background: #fffdf2;
    z-index: 10;
    overflow: hidden;
  }
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
