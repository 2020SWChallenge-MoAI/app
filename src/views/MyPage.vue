<template>
  <sub-layout title="마이페이지" tooltip="나의 활동 기록을 살펴보자!" :recent-books="false">
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
        <transition name="slide-up" mode="out-in">
          <div v-bind:key="activityIdIndex">
            {{ activity.bookname }}
          </div>
        </transition>
      </div>
      <transition name="fade" mode="out-in">
        <div v-bind:key="activityIdIndex" id="mypage-activity-left-date">
          {{ activity.date }}
        </div>
      </transition>

      <v-icon
        id="mypage-activity-left-arrow"
        @click="activityBefore" x-large
      > mdi-arrow-left-drop-circle </v-icon>

      <transition name="fade">
        <div v-if="!showNextActivity" id="mypage-activity-cover" />
      </transition>

      <div id="mypage-activity" v-if="activityType !== 0">
        <writing-result :work="otherActivity" v-if="activityType === 3" />
        <quiz-game-result :work="otherActivity" v-if="activityType === 1" />
      </div>
      <canvas id="mypage-activity" v-show="activityType === 0" />

      <v-icon
        id="mypage-activity-right-arrow"
        @click="activityNext" x-large
      > mdi-arrow-right-drop-circle </v-icon>
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

export default {
  components: {
    Profile,
    ResultTable,
    WritingResult,
    QuizGameResult,
  },
  data() {
    return {
      user: {},
      month: new Date().getMonth() + 1,
      activityIdIndex: 0,
      slide: '',

      canvas: document.getElementById(''),
      ctx: [],
      scale: 0.5,

      activity: {
        nodes: [],
        edges: [],
        templateType: -1,
        date: '',
        bookname: '',
      },
      otherActivity: {},
      activityType: 0,
      padding: { x: 0, y: 0 },
      activityIdList: [],

      showNextActivity: true,

      lightPos: { x: 0, y: 0 },
      bookImg: new Image(),
      leaf1Img: new Image(),
      leaf2Img: new Image(),
    };
  },
  created() {
    axios.get('/api/user').then(({ data }) => {
      this.user = data;
    });
  },
  async mounted() {
    this.canvas = document.getElementById('mypage-activity');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx[0].scale(0.2, 0.2);
    this.ctx[0].scale(1, 1);

    // eslint-disable-next-line
    this.leaf1Img.src = require('../assets/mindmap/grape-leaf1.png');
    // eslint-disable-next-line
    this.leaf2Img.src = require('../assets/mindmap/grape-leaf2.png');

    axios.get('/api/user/work', {
    }).then((res) => {
      this.activityIdList = res.data.wids;
      // eslint-disable-next-line
      axios.get('/api/user/work/' + this.activityIdList[0], {
      }).then((res1) => {
        this.activityType = res.data.type;
        if (this.activityType !== 0) {
          this.otherActivity = res.data;
          return;
        }

        // eslint-disable-next-line
        const content = JSON.parse(res1.data.content);
        const data = {
          // eslint-disable-next-line
          nodes: content.nodes, edges: content.edges, templateType: content.templateType, date: moment(new Date(res1.data.created_at)).format("yyyy-MM-DD HH:mm:ss"), bookname: content.bookTitle, bid: content.bookId,
        };
        this.activity = data;

        // eslint-disable-next-line
        this.bookImg.src = '/api/book/' + this.activity.bid + '/cover';

        setTimeout(() => {
          this.reDrawAll();
        }, 100);
      }).catch((err1) => {
        console.warn('ERROR!!!!: ', err1);
      });
    }).catch((err) => {
      console.warn('ERROR!!!!: ', err);
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

    reDrawAll() {
      this.ctx[0].clearRect(0, 0, 100000, 100000);
      this.ctx[0].beginPath();

      if (this.activity.templateType === 1) {
        this.padding.x = this.activity.nodes[0].x - (this.canvas.width / 2) / 0.2;
        // eslint-disable-next-line max-len
        this.padding.y = this.activity.nodes[0].y * 0.75 - this.canvas.height / (0.4 * 0.75);

        this.canvas.style.background = '#FFFDF2';

        // edge 먼저 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.activity.edges.length; i++) {
          // eslint-disable-next-line max-len
          const from = this.activity.nodes.find((element) => element.id === this.activity.edges[i].from);
          // eslint-disable-next-line max-len
          const to = this.activity.nodes.find((element) => element.id === this.activity.edges[i].to);
          // eslint-disable-next-line max-len
          this.drawEdge(from.x - this.padding.x, from.y - this.padding.y, to.x - this.padding.x, to.y - this.padding.y);
        }

        // 템플릿 그리기
        this.initSetting(0, 0);

        // node 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.activity.nodes.length; i++) {
          // eslint-disable-next-line max-len
          this.makeNode(this.activity.nodes[i].x - this.padding.x, this.activity.nodes[i].y - this.padding.y, this.activity.nodes[i].size, this.activity.nodes[i].type, this.activity.nodes[i].label);
        }
      } else if (this.activity.templateType === 2) {
        this.padding.x = this.activity.nodes[0].x - this.canvas.width / (0.2 * 2);
        this.padding.y = this.activity.nodes[0].y * 0.75 - this.canvas.height;

        this.lightPos.x = this.activity.nodes[0].x - this.padding.x;
        this.lightPos.y = -100 - this.padding.y;

        this.initSetting(0, 0);

        // edge 먼저 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.activity.edges.length; i++) {
          // eslint-disable-next-line
          const from = this.activity.nodes.find((element) => element.id === this.activity.edges[i].from);
          // eslint-disable-next-line
          const to = this.activity.nodes.find((element) => element.id === this.activity.edges[i].to);
          // eslint-disable-next-line max-len
          this.drawEdge(from.x - this.padding.x, from.y - this.padding.y, to.x - this.padding.x, to.y - this.padding.y);
        }

        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, this.activity.nodes[0].x - this.padding.x - 75, 0 - this.padding.y, 150, 200);

        // node 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.activity.nodes.length; i++) {
          // eslint-disable-next-line max-len
          this.makeNode(this.activity.nodes[i].x - this.padding.x, this.activity.nodes[i].y - this.padding.y, this.activity.nodes[i].size, this.activity.nodes[i].type, this.activity.nodes[i].label);
        }
      }
    },

    getPosition(event) {
      const touches = event.changedTouches;
      const x = (touches[0].clientX - this.canvas.offsetLeft);
      const y = (touches[0].clientY - this.canvas.offsetTop);
      const bound = this.canvas.getBoundingClientRect();
      return { X: (x - bound.left) / this.scale, Y: (y - bound.top) / this.scale };
    },

    makeNode(x, y, size, type, text) {
      let fontsize = size / 4;
      let linesize = 1;
      if (text !== undefined) {
        if (text.length > 8) fontsize /= 2;
        else if (text.length > 5) fontsize = size / (text.length - 1);
        linesize = Math.floor(text.length / 10) + 1;
        if (text.length % 10 === 0) linesize -= 1;
      }

      if (this.activity.templateType === 1) {
        if (type === 0) {
          // 나뭇잎1 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size / 2, y - size * 0.9, x - size * 1.2, y - size * 0.7, x - size * 0.8, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.2, y + size * 0.6, x, y + size * 0.8, x + size / 4, y + size * 0.4);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.8, y + size * 0.6, x + size * 0.9, y + size / 8, x + size * 0.75, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size, y - size * 0.8, x, y - size * 0.8, x, y - size * 0.6);
          this.ctx[0].fill();
          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        } else if (type === 1) {
          // 나뭇잎2 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x, y - size / 2);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size / 4, y - size * 0.9, x - size, y - size * 0.6, x - size * 0.8, y - size * 0.2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.3, y + size / 4, x - size / 2, y + size * 0.8, x - size / 4, y + size / 2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size / 2, y + size * 0.9, x + size * 1, y + size * 0.3, x + size * 0.75, y - 5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size, y - size / 2, x + size * 0.2, y - size * 0.9, x, y - size / 2);
          this.ctx[0].fill();
          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        } else if (type === 2) {
          // 나뭇잎3 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x + size * 0.2, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x, y - size * 0.8, x - size * 0.4, y - size * 0.8, x - size * 0.5, y - size * 0.6);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1, y - size * 0.7, x - size * 1.2, y, x - size * 0.7, y + size * 0.1);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.9, y + size * 0.6, x - size * 0.2, y + size * 0.8, x, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.7, y + size * 0.7, x + size * 0.9, y + size * 0.2, x + size * 0.7, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 1.1, y - size * 0.3, x + size * 0.35, y - size * 0.9, x + size * 0.2, y - size * 0.6);
          this.ctx[0].fill();
          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        } else if (type === 3) {
          // 나뭇잎4 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x + size * 0.3, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.1, y - size * 0.75, x - size * 0.2, y - size * 0.75, x - size * 0.4, y - size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.8, y - size * 0.7, x - size * 1, y - size * 0.2, x - size * 0.7, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.1, y + size * 0.4, x - size * 0.3, y + size * 0.8, x - size * 0.1, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.15, y + size * 0.65, x + size * 0.3, y + size * 0.55, x + size * 0.4, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.9, y + size * 0.7, x + size * 1.2, y, x + size * 0.8, y - size * 0.1);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 1.0, y - size * 0.8, x + size * 0.2, y - size * 0.7, x + size * 0.3, y - size * 0.6);
          this.ctx[0].fill();
          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2 - 0.2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        }
      } else if (this.activity.templateType === 2) {
        // eslint-disable-next-line
        var lightRad = Math.atan2(y - this.lightPos.y, this.lightPos.x - x);
        const r = size * 0.8;
        if (type === 0) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#7159BA';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.15, -size * 0.1, -size * 0.075, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.075, -size * 0.05, size * 0.15, 0, size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.15, size * 0.1, size * 0.075, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.075, size * 0.05, -size * 0.15, 0, -size * 0.15);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            this.ctx[0].shadowColor = 'transparent';
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        } else if (type === 1) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#AC92EB';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.18, -size * 0.1, -size * 0.15, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.15, -size * 0.05, size * 0.18, 0, size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.18, size * 0.1, size * 0.15, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.15, size * 0.05, -size * 0.18, 0, -size * 0.18);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            this.ctx[0].shadowColor = 'transparent';
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        } else if (type === 2) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#B8AAD1';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.18, -size * 0.1, -size * 0.15, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.15, -size * 0.05, size * 0.18, 0, size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.18, size * 0.1, size * 0.15, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.15, size * 0.05, -size * 0.18, 0, -size * 0.18);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            this.ctx[0].shadowColor = 'transparent';
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        } else if (type === 3) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#784DFF';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.15, -size * 0.1, -size * 0.075, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.075, -size * 0.05, size * 0.15, 0, size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.15, size * 0.1, size * 0.075, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.075, size * 0.05, -size * 0.15, 0, -size * 0.15);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            this.ctx[0].shadowColor = 'transparent';
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = 'white';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        }
      }
    },

    drawEdge(x1, y1, x2, y2) {
      if (this.activity.templateType === 1) {
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#baad93';
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      } else if (this.activity.templateType === 2) {
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#9A8653';
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      }
    },

    drawCloud(x, y, paddingX, paddingY) {
      const width = 389;
      const height = 207.5;

      // 구름 그리기
      this.ctx[0].fillStyle = '#e5f6ff';
      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(width - paddingX - x, height - 165 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width - 40 - paddingX - x, height - 240 - paddingY - y, width - 165 - paddingX - x, height - 240 - paddingY - y, width - 190 - paddingX - x, height - 140 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width - 270 - paddingX - x, height - 150 - paddingY - y, width - 315 - paddingX - x, height - 65 - paddingY - y, width - 250 - paddingX - x, height - 15 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width - 190 - paddingX - x, height - 10 - paddingY - y, width + 0 - paddingX - x, height - 10 - paddingY - y, width + 90 - paddingX - x, height - 15 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 140 - paddingX - x, height - 30 - paddingY - y, width + 140 - paddingX - x, height - 90 - paddingY - y, width + 65 - paddingX - x, height - 110 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 50 - paddingX - x, height - 170 - paddingY - y, width - paddingX - x, height - 170 - paddingY - y, width - 0 - paddingX - x, height - 165 - paddingY - y);
      this.ctx[0].fill();

      this.ctx[0].fillStyle = '#caedff';
      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(width - paddingX - x, height - 165 - paddingY - y + 30);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width - 40 - paddingX - x, height - 240 - paddingY - y + 30, width - 165 - paddingX - x, height - 240 - paddingY - y + 30, width - 190 - paddingX - x, height - 140 - paddingY - y + 30);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width - 270 - paddingX - x, height - 150 - paddingY - y + 30, width - 315 - paddingX - x, height - 65 - paddingY - y + 30, width - 250 - paddingX - x, height - 15 - paddingY - y + 30);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width - 190 - paddingX - x, height - 10 - paddingY - y + 30, width + 0 - paddingX - x, height - 10 - paddingY - y + 30, width + 90 - paddingX - x, height - 15 - paddingY - y + 30);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 140 - paddingX - x, height - 30 - paddingY - y + 30, width + 140 - paddingX - x, height - 90 - paddingY - y + 30, width + 65 - paddingX - x, height - 110 - paddingY - y + 30);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 50 - paddingX - x, height - 170 - paddingY - y + 30, width - paddingX - x, height - 170 - paddingY - y + 30, width - 0 - paddingX - x, height - 165 - paddingY - y + 30);
      this.ctx[0].fill();

      // 옆 작은 구름
      this.ctx[0].fillStyle = '#ebf7f7';
      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(width + 65 - paddingX - x, height - 110 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 30 - paddingX - x, height - 140 - paddingY - y, width - 10 - paddingX - x, height - 80 - paddingY - y, width + 40 - paddingX - x, height - 60 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 45 - paddingX - x, height - 25 - paddingY - y, width + 85 - paddingX - x, height - 30 - paddingY - y, width + 100 - paddingX - x, height - 40 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 120 - paddingX - x, height - 30 - paddingY - y, width + 140 - paddingX - x, height - 30 - paddingY - y, width + 160 - paddingX - x, height - 45 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 230 - paddingX - x, height + 0 - paddingY - y, width + 280 - paddingX - x, height - 120 - paddingY - y, width + 180 - paddingX - x, height - 120 - paddingY - y);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 170 - paddingX - x, height - 170 - paddingY - y, width + 80 - paddingX - x, height - 170 - paddingY - y, width + 65 - paddingX - x, height - 110 - paddingY - y);
      this.ctx[0].fill();

      this.ctx[0].fillStyle = '#e1f6fb';
      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(width + 65 - paddingX - x - 10, height - 110 - paddingY - y + 20);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 30 - paddingX - x + 10, height - 140 - paddingY - y + 20, width - 10 - paddingX - x + 10, height - 80 - paddingY - y + 20, width + 40 - paddingX - x + 10, height - 60 - paddingY - y + 20);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 45 - paddingX - x + 10, height - 25 - paddingY - y + 20, width + 85 - paddingX - x + 10, height - 30 - paddingY - y + 20, width + 100 - paddingX - x + 10, height - 40 - paddingY - y + 20);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 120 - paddingX - x + 10, height - 30 - paddingY - y + 20, width + 140 - paddingX - x + 10, height - 30 - paddingY - y + 20, width + 160 - paddingX - x + 10, height - 45 - paddingY - y + 20);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 230 - paddingX - x + 10, height + 0 - paddingY - y + 20, width + 280 - paddingX - x + 10, height - 120 - paddingY - y + 20, width + 180 - paddingX - x + 10, height - 120 - paddingY - y + 20);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(width + 170 - paddingX - x + 10, height - 170 - paddingY - y + 20, width + 80 - paddingX - x + 10, height - 170 - paddingY - y + 20, width + 65 - paddingX - x + 10, height - 110 - paddingY - y + 20);
      this.ctx[0].fill();
    },

    activityBefore() {
      if (this.activityIdIndex > 0) {
        this.activityIdIndex -= 1;
        setTimeout(() => {
          this.showNextActivity = false;
        }, 100);
        setTimeout(() => {
          this.showNextActivity = true;
        }, 900);
      } else {
        this.activityIdIndex = 0;
      }

      // eslint-disable-next-line
      axios.get('/api/user/work/' + this.activityIdList[this.activityIdIndex], {
      }).then((res) => {
        this.activityType = res.data.type;
        if (this.activityType !== 0) {
          this.otherActivity = res.data;
          return;
        }

        // eslint-disable-next-line
        const content = JSON.parse(res.data.content);
        const data = {
          // eslint-disable-next-line
          nodes: content.nodes, edges: content.edges, templateType: content.templateType, date: moment(new Date(res.data.created_at)).format("yyyy-MM-DD HH:mm:ss"), bookname: content.bookTitle, bid: content.bookId,
        };
        this.activity = data;
        // eslint-disable-next-line
        this.bookImg.src = '/api/book/' + this.activity.bid + '/cover';

        setTimeout(() => {
          this.reDrawAll();
        }, 100);
      }).catch((err1) => {
        console.warn('ERROR!!!!: ', err1);
      });
    },

    activityNext() {
      if (this.activityIdIndex < this.activityIdList.length - 1) {
        this.activityIdIndex += 1;
        setTimeout(() => {
          this.showNextActivity = false;
        });
        setTimeout(() => {
          this.showNextActivity = true;
        }, 900);
      } else {
        this.activityIdIndex = this.activityIdList.length - 1;
      }

      // eslint-disable-next-line
      axios.get('/api/user/work/' + this.activityIdList[this.activityIdIndex], {
      }).then((res) => {
        this.activityType = res.data.type;
        if (this.activityType !== 0) {
          this.otherActivity = res.data;
          return;
        }

        // eslint-disable-next-line
        const content = JSON.parse(res.data.content);
        const data = {
          // eslint-disable-next-line
          nodes: content.nodes, edges: content.edges, templateType: content.templateType, date: moment(new Date(res.data.created_at)).format("yyyy-MM-DD HH:mm:ss"), bookname: content.bookTitle, bid: content.bookId,
        };
        this.activity = data;
        // eslint-disable-next-line
        this.bookImg.src = '/api/book/' + this.activity.bid + '/cover';

        setTimeout(() => {
          this.reDrawAll();
        }, 100);
      }).catch((err1) => {
        console.warn('ERROR!!!!: ', err1);
      });
    },

    drawGrape(paddingX, paddingY) {
      const r = 100;
      const width = this.activity.nodes[0].x;

      this.ctx[0].fillStyle = 'rgba(172, 146, 235, 0.08)';
      for (let j = 0; j < 7; j += 1) {
        this.ctx[0].beginPath();
        // eslint-disable-next-line
        this.ctx[0].arc(width - 150 * (3 - j) - paddingX, -paddingY, r, 0, Math.PI * 2);
        this.ctx[0].fill();
      }

      for (let i = 0; i < 2; i += 1) {
        for (let j = 0; j < 8; j += 1) {
          this.ctx[0].beginPath();
          // eslint-disable-next-line
          this.ctx[0].arc(width - 150 * (3 - j) - 75 - paddingX, 150 * (i + 1) - paddingY, r, 0, Math.PI * 2);
          this.ctx[0].fill();
        }
      }

      for (let i = 7; i > 1; i -= 1) {
        for (let j = 0; j < i; j += 1) {
          this.ctx[0].beginPath();
          // eslint-disable-next-line
          this.ctx[0].arc(width - 150 * (i / 2 - j) + 75 - paddingX, 150 * (10 - i) - paddingY, r, 0, Math.PI * 2);
          this.ctx[0].fill();
        }
      }
    },
  },
};
</script>

<style scoped>
.top {
  width: 100%;
  height: 40vh;
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
@-moz-keyframes fadein {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@-webkit-keyframes fadein {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@-o-keyframes fadein {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
