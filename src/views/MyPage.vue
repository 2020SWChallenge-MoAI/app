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

export default {
  components: {
    Profile,
    ResultTable,
    MindMapResult,
    QuizGameResult,
    WritingResult,
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

  async mounted() {
    this.canvas = document.getElementById('mypage-activity');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx[0].scale(0.2, 0.2);
    this.ctx[0].scale(1, 1);

    // eslint-disable-next-line
    this.leaf1Img.src = require('../assets/img/views/activity/mindmap/grape-leaf1.png');
    // eslint-disable-next-line
    this.leaf2Img.src = require('../assets/img/views/activity/mindmap/grape-leaf2.png');

    axios.get('/api/user/work', {
    }).then((res) => {
      this.activityIdList = res.data.wids;
      // eslint-disable-next-line
      axios.get('/api/user/work/' + this.activityIdList[0], {
      }).then((res1) => {
        // eslint-disable-next-line
        const content = JSON.parse(res1.data.content);
        const data = {
          // eslint-disable-next-line
          nodes: content.nodes, edges: content.edges, templateType: content.templateType, date: moment(new Date(res1.data.created_at)).format("yyyy-MM-DD HH:mm:ss"), bookname: content.bookTitle, bid: res1.data.bid, type: res1.data.type,
        };
        this.activity = data;
        console.log(res1);

        // eslint-disable-next-line
        this.bookImg.src = '/api/book/' + res1.data.bid + '/cover';

        if (this.activity.type === 0) {
          setTimeout(() => {
            this.reDrawAll();
          }, 100);
        } else {
          this.showNextActivity = false;
          this.ctx[0].clearRect(0, 0, 100000, 100000);
        }
      }).catch((err1) => {
        console.warn('ERROR!!!!: ', err1);
      });
    }).catch((err) => {
      console.warn('ERROR!!!!: ', err);
    });

    axios.get('/api/user', {}).then((res) => {
      this.userName = res.data.nickname;
      this.userAge = res.data.age;
    });
  },

  methods: {
    initSetting(changeX, changeY) {
      const paddingX = changeX + this.padding.x;
      const paddingY = changeY + this.padding.y;

      // 나무 템플릿
      if (this.activity.templateType === 1) {
        const width = this.activity.nodes[0].x;
        const height = this.activity.nodes[0].y;

        // 땅 그리기
        this.ctx[0].fillStyle = '#44A508';
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(width - 1500 - paddingX, height + 1000 - paddingY);
        this.ctx[0].lineTo(width - 1500 - paddingX, height + 400 - paddingY);
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width - 500 - paddingX, height + 100 - paddingY, width + 500 - paddingX, height + 100 - paddingY, width + 1500 - paddingX, height + 400 - paddingY);
        this.ctx[0].lineTo(width + 1500 - paddingX, height + 1000 - paddingY);
        this.ctx[0].closePath();
        this.ctx[0].fill();

        // 구름 1 그리기
        this.drawCloud(400, 300, paddingX, paddingY);

        // 구름 2 그리기
        this.drawCloud(-400, 600, paddingX, paddingY);

        // 템플릿(나무) 그리기
        this.ctx[0].beginPath();
        // eslint-disable-next-line max-len
        this.ctx[0].moveTo(width - paddingX, height - 80 - paddingY);
        this.ctx[0].strokeStyle = '#7ed221';
        this.ctx[0].fillStyle = '#7ed221';
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width - 250 - paddingX, height - 200 - paddingY, width - 250 - paddingX, height + 180 - paddingY, width - paddingX, height + 120 - paddingY);
        // eslint-disable-next-line max-len
        this.ctx[0].moveTo(width - 5 - paddingX, height + 120 - paddingY);
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width + 200 - paddingX, height + 180 - paddingY, width + 200 - paddingX, height - 150 - paddingY, width - 5 - paddingX, height - 80 - paddingY);
        this.ctx[0].fill();

        // 나무 줄기 그리기
        this.ctx[0].beginPath();
        this.ctx[0].fillStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].fillRect(width - 20 - paddingX, height * 0.9 - paddingY + height / 3, 40, 120);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].arc(width - paddingX, height * 0.9 - paddingY, height / 3, Math.PI * 0.25, Math.PI * 0.75);
        this.ctx[0].stroke();

        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, width - 80 - paddingX, height - 150 - paddingY, 150, 200);
        // 우주배경 템플릿
      } else if (this.activity.templateType === 2) {
        // 배경 포도 그리기
        this.drawGrape(paddingX, paddingY);

        const width = this.activity.nodes[0].x;
        // const height = this.activity.nodes[0].y;

        // 줄기 그리기
        this.ctx[0].beginPath();
        this.ctx[0].strokeStyle = '#7b6b42';
        this.ctx[0].lineWidth = 40;
        this.ctx[0].moveTo(-width - paddingX - 450, 0 - paddingY - 200);
        // eslint-disable-next-line
        this.ctx[0].bezierCurveTo(- paddingX - 450, 0 - paddingY - 500, width * 3 - paddingX - 500, 0 - paddingY - 250,  width - paddingX + 50, 0 - paddingY - 50);
        // eslint-disable-next-line
        this.ctx[0].bezierCurveTo(- paddingX, 0 - paddingY - 250, width * 2 - paddingX, 0 - paddingY - 500,  width * 3 - paddingX + 450, 0 - paddingY - 200);
        this.ctx[0].stroke();

        // 잎2
        // eslint-disable-next-line
        this.ctx[0].drawImage(this.leaf1Img, width - paddingX - 450, 0 - paddingY - 300, 700, 600);

        // 잎2
        // eslint-disable-next-line
        this.ctx[0].drawImage(this.leaf2Img, width - paddingX - 150, 0 - paddingY - 300, 700, 600);

        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, width - paddingX - 75, 0 - paddingY, 150, 200);
      }
    },

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
