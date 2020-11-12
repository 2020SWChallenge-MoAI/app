<template>
  <sub-layout title="생각펼치기" :tooltip="tooltip">
    <template v-slot:left>
    </template>

    <div v-show="!ifBookExist" id="no-book-text">
      <img src="../../../assets/noBooks.png" id="no-book-img" />
      책이 선택되지 않았어! <br>
      생각펼치기 할 책을 선택해보자!
    </div>

    <!-- 캔버스 -->
    <canvas id="center-canvas" v-show="ifBookExist" />

    <!-- TODO: Implementation -->

    <!-- 템플릿 선택 -->
    <div id="center-template" v-show="ifBookExist">
      <div id="choose-background">
        <div id="choose-img" />
        <div id="choose-space" />
        <div id="choose-dotline">
          <div id="choose-dot" />
          <div id="choose-dot1" />
          <div id="choose-dot" />
          <div id="choose-dot1" />
          <div id="choose-dot" />
          <div id="choose-dot1" />
          <div id="choose-dot" />
          <div id="choose-dot1" />
          <div id="choose-dot" />
          <div id="choose-dot1" />
          <div id="choose-dot" />
        </div>
      </div>

      <div class="choose-template" id="template1" style="left: 13vw;" v-ripple />
      <div class="choose-template" id="template2" style="left: 28vw;" v-ripple />
      <div class="choose-template" id="template3" style="left: 43vw;" v-ripple />
      <div class="choose-template" id="template-change" style="left: 58vw;" v-ripple />
    </div>
  </sub-layout>
</template>

<script>
export default {
  data() {
    return {
      tooltip: '원하는 템플릿을 골라보자!',
      ifBookExist: true,
      aiHelp: false,
      canvas: document.getElementById(''),
      ctx: [],
      template: -1,
      clickedTemplate: '',

      leaf1Img: new Image(),
      leaf2Img: new Image(),
      scale: 1,

      nodes: [],
      edges: [],
    };
  },

  async mounted() {
    this.canvas = document.getElementById('center-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.ctx[0].scale(0.6, 0.6);
    this.ctx[0].scale(1, 1);
    this.scale = 0.6;

    // eslint-disable-next-line
    this.leaf1Img.src = require('../../../assets/img/views/activity/mindmap/grape-leaf1.png');
    // eslint-disable-next-line
    this.leaf2Img.src = require('../../../assets/img/views/activity/mindmap/grape-leaf2.png');

    const templates = document.querySelectorAll('.choose-template');

    templates.forEach((template) => {
      template.addEventListener('click', this.changeToTemplate);
    });

    if (this.book == null) this.ifBookExist = false;
  },

  methods: {
    changeToTemplate(event) {
      this.ctx[0].clearRect(0, 0, 100000, 100000);

      if (event.target.id === this.clickedTemplate) {
        if (this.$store.getters.currentBook === null) {
          this.$store.dispatch('showMessage', {
            mode: 'error',
            message: '생각펼치기를 할 책을 골라봐!',
          });
          this.drawTemplate(this.template);
        } else {
          // 페이지 이동
          this.$router.push({
            name: 'MindMap',
            params: {
              template: this.template,
              bookId: (this.$store.getters.currentBook).bid,
              thumbnail: (this.$store.getters.currentBook).thumbnail,
            },
          });
        }
        // 페이지 이동
        this.$router.push({
          name: 'MindMap',
          params: {
            template: this.template,
            bookId: (this.$store.getters.currentBook).bid,
          },
        });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (event.target.id === 'template1') {
          this.template = 1;
          this.drawTemplate(1);
          this.templateBorderClear();
          const template = document.querySelector('#template1');
          template.style.border = '5px solid #FFAE00';
          this.clickedTemplate = 'template1';
        } else if (event.target.id === 'template2') {
          this.template = 2;
          this.drawTemplate(2);
          this.templateBorderClear();
          const template = document.querySelector('#template2');
          template.style.border = '5px solid #FFAE00';
          this.clickedTemplate = 'template2';
        } else if (event.target.id === 'template3') {
          this.template = 3;
          this.drawTemplate(3);
          this.templateBorderClear();
          const template = document.querySelector('#template3');
          template.style.border = '5px solid #FFAE00';
          this.clickedTemplate = 'template2';
        } else if (event.target.id === 'template-change') {
          this.templateBorderClear();
          const template = document.querySelector('#template-change');
          template.style.border = '5px solid #FFAE00';
          this.clickedTemplate = 'template-change';
        }
      }
    },

    makeNode(x, y, size, type, text, template) {
      if (template === 1) {
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
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + size / 4 + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          this.ctx[0].fillText(text, x - (size / 4) * (text.length / 2), y);
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
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + size / 4 + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          this.ctx[0].fillText(text, x - (size / 4) * (text.length / 2), y);
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
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + size / 4 + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          this.ctx[0].fillText(text, x - (size / 4) * (text.length / 2), y);
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
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + size / 4 + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          this.ctx[0].fillText(text, x - (size / 4) * (text.length / 2), y);
        }
      } else if (template === 2) {
        // eslint-disable-next-line
        var lightRad = Math.atan2(y + 50, this.canvas.width / (2 * this.scale) - x);
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
        }
      }
    },

    drawEdge(x1, y1, x2, y2, template) {
      if (template === 1) {
        this.ctx[0].strokeStyle = '#baad93';
        this.ctx[0].lineWidth = 12;
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      } else if (template === 2) {
        this.ctx[0].strokeStyle = '#baad93';
        this.ctx[0].lineWidth = 12;
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      }
    },

    drawTemplate(template) {
      if (template === 1) {
        const width = this.canvas.width / (2 * this.scale);
        const height = this.canvas.height / (2 * this.scale);

        // 땅 그리기
        this.ctx[0].fillStyle = '#44A508';
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(0, height * 2);
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width - width * 0.7, height * 1.5, width + width * 0.7, height * 1.5, width * 2, height * 2);
        this.ctx[0].closePath();
        this.ctx[0].fill();

        // edge 줄기 미리 그리기
        this.drawEdge(width, height, width - 280, height - 100, template);
        this.drawEdge(width, height, width + 240, height - 100, template);
        this.drawEdge(width, height, width - 280, height + 100, template);
        this.drawEdge(width, height, width + 240, height + 100, template);

        this.drawEdge(width - 280, height - 100, width - 320, height - 250, template);
        this.drawEdge(width - 280, height - 100, width - 480, height - 120, template);
        this.drawEdge(width + 240, height - 100, width + 320, height - 250, template);
        this.drawEdge(width + 240, height - 100, width + 480, height - 120, template);
        this.drawEdge(width + 240, height - 100, width + 80, height - 250, template);
        this.drawEdge(width + 240, height + 100, width + 430, height + 50, template);
        this.drawEdge(width + 240, height + 100, width + 440, height + 180, template);
        this.drawEdge(width + 430, height + 50, width + 600, height, template);
        this.drawEdge(width + 430, height + 50, width + 570, height + 100, template);
        this.drawEdge(width - 260, height + 100, width - 480, height + 100, template);

        // 템플릿(나무) 그리기
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(width, height - 80);
        this.ctx[0].strokeStyle = '#7ed221';
        this.ctx[0].fillStyle = '#7ed221';
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width - 250, height - 200, width - 250, height + 180, width, height + 120);
        this.ctx[0].moveTo(width - 5, height + 120);
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width + 200, height + 180, width + 200, height - 150, width - 5, height - 80);
        this.ctx[0].fill();

        // 나무 줄기 그리기
        this.ctx[0].beginPath();
        this.ctx[0].fillStyle = '#836d4b';
        const treeLength = (height * 0.35) / this.scale;
        // eslint-disable-next-line
        this.ctx[0].fillRect(width - 20, this.canvas.height * (0.4 / this.scale) + 160, 40, treeLength);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].arc(this.canvas.width * (0.5 / this.scale), this.canvas.height * (0.4 / this.scale) + 30, 130, Math.PI * 0.25, Math.PI * 0.75);
        this.ctx[0].stroke();

        this.makeNode(width - 280, height - 100, 100, 0, '', template);
        this.makeNode(width + 240, height - 100, 100, 1, '', template);
        this.makeNode(width - 280, height + 100, 100, 2, '', template);
        this.makeNode(width + 240, height + 100, 100, 3, '', template);
        this.makeNode(width - 320, height - 250, 80, 2, '', template);
        this.makeNode(width - 480, height - 120, 70, 3, '', template);
        this.makeNode(width + 320, height - 250, 80, 1, '', template);
        this.makeNode(width + 480, height - 120, 85, 0, '', template);
        this.makeNode(width + 80, height - 250, 65, 0, '', template);
        this.makeNode(width + 430, height + 50, 80, 2, '', template);
        this.makeNode(width + 440, height + 180, 70, 1, '', template);
        this.makeNode(width + 600, height, 50, 1, '', template);
        this.makeNode(width + 570, height + 100, 50, 1, '', template);
        this.makeNode(width - 480, height + 100, 70, 1, '', template);
      } else if (template === 2) {
        const width = this.canvas.width / (2 * this.scale);
        const height = this.canvas.height / (2 * this.scale);

        this.ctx[0].drawImage(this.leaf1Img, width - 450, height - 550, 700, 600);
        this.ctx[0].drawImage(this.leaf2Img, width - 150, height - 550, 700, 600);

        this.nodes.push({
          id: 1, x: width - 350, y: height - 200, size: 100, type: 0,
        });
        this.nodes.push({
          id: 2, x: width - 150, y: height - 50, size: 100, type: 1,
        });
        this.nodes.push({
          id: 3, x: width + 150, y: height - 70, size: 100, type: 2,
        });
        this.nodes.push({
          id: 4, x: width + 400, y: height - 160, size: 100, type: 3,
        });
        this.nodes.push({
          id: 11, x: width - 550, y: height - 120, size: 80, type: 2,
        });
        this.nodes.push({
          id: 12, x: width - 400, y: height - 20, size: 75, type: 3,
        });
        this.nodes.push({
          id: 21, x: width - 100, y: height + 150, size: 70, type: 3,
        });
        this.nodes.push({
          id: 22, x: width - 300, y: height + 130, size: 85, type: 2,
        });
        this.nodes.push({
          id: 31, x: width + 200, y: height + 130, size: 90, type: 1,
        });
        this.nodes.push({
          id: 32, x: width, y: height + 50, size: 40, type: 0,
        });
        this.nodes.push({
          id: 41, x: width + 380, y: height + 60, size: 90, type: 2,
        });
        this.nodes.push({
          id: 42, x: width + 550, y: height - 60, size: 65, type: 1,
        });
        this.nodes.push({
          id: 421, x: width + 600, y: height + 80, size: 50, type: 3,
        });
        this.nodes.push({
          id: 121, x: width - 600, y: height + 180, size: 120, type: 1,
        });
        this.nodes.push({
          id: 321, x: width + 500, y: height + 350, size: 160, type: 2,
        });
        this.nodes.push({
          id: 221, x: width + 80, y: height + 300, size: 80, type: 2,
        });
        this.nodes.push({
          id: 2211, x: width - 400, y: height + 350, size: 100, type: 0,
        });

        this.edges.push({
          from: 1, to: 11,
        });
        this.edges.push({
          from: 1, to: 12,
        });
        this.edges.push({
          from: 2, to: 21,
        });
        this.edges.push({
          from: 2, to: 22,
        });
        this.edges.push({
          from: 3, to: 31,
        });
        this.edges.push({
          from: 3, to: 32,
        });
        this.edges.push({
          from: 4, to: 41,
        });
        this.edges.push({
          from: 4, to: 42,
        });
        this.edges.push({
          from: 42, to: 421,
        });
        this.edges.push({
          from: 22, to: 121,
        });
        this.edges.push({
          from: 321, to: 31,
        });
        this.edges.push({
          from: 221, to: 21,
        });
        this.edges.push({
          from: 2211, to: 22,
        });

        for (let i = 0; i < this.edges.length; i += 1) {
          const node1 = this.nodes.find((element) => element.id === this.edges[i].from);
          const node2 = this.nodes.find((element) => element.id === this.edges[i].to);
          this.drawEdge(node1.x, node1.y, node2.x, node2.y, template);
        }

        for (let i = 0; i < this.nodes.length; i += 1) {
          // eslint-disable-next-line
          this.makeNode(this.nodes[i].x, this.nodes[i].y, this.nodes[i].size, this.nodes[i].type, '', template);
        }
      }
    },

    templateBorderClear() {
      const templates = document.querySelectorAll('.choose-template');
      templates.forEach((template) => {
        const t = template;
        t.style.border = '5px solid #F0EBD7';
      });
    },

  },

  computed: {
    book() {
      return this.$store.getters.currentBook;
    },
  },

  watch: {
    template() {
      if (this.template !== -1) this.tooltip = this.book.title;
    },

    book() {
      this.tooltip = this.book.title;
      if (this.book == null) this.ifBookExist = false;
      else this.ifBookExist = true;
    },
  },
};
</script>

<style scoped>
#center-canvas {
  position: absolute;
  width: 95%;
  height: 60%;
  background: #F0EBD7;
  z-index: 5;
  border-radius: 1vw;
  top: 8%;
  left: 2.5%;
}

#center-template {
  position: absolute;
  width: 95%;
  height: 22%;
  background: lightgray;
  border-radius: 1vw;
  z-index: 15;
  top: 74%;
  left: 2.5%;
}
#choose-img {
  position: absolute;
  background-image: url('../../../assets/choose.svg');
  background-size: cover;
  background-position: center;
  width: 90%;
  height: 100%;
  z-index: 18;
  margin-left: 10%;
  display: inline-block
}
#choose-background {
  position: absolute;
  width: 12vw;
  height: 100%;
  border-radius: 1vw;
  background: #FFAE00;
  display: inline-block
}
#choose-space {
  position: absolute;
  width: 1.5vw;
  height: 100%;
  left: 10.5vw;
  background: #FFAE00;
  display: inline-block
}
#choose-dotline {
  position: absolute;
  width: 0.5vw;
  height: 100%;
  left: 12vw;
}
#choose-dot {
  width: 100%;
  height: 10%;
  background: #8BA9A3;
}
#choose-dot1 {
  width: 100%;
  height: 8%;
  background: lightgray;
}
.choose-template {
  position: absolute;
  display: inline-block;
  width: 14vw;
  height: 95%;
  border: 5px solid #F0EBD7;
  border-radius: 1vw;
  background: #F0EBD7;
  top: 2.5%;
}

#template1 {
  background-image: url('../../../assets/img/views/activity/mindmap/tree.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
#template2 {
  background-image: url('../../../assets/img/views/activity/mindmap/grape.png');
  background-position: center;
  background-size: contain;
  background-repeat : no-repeat;
}

#no-book-text {
  text-align: center;
  font-size: 2vw;
  margin-top: calc(40% + 15vw);
}

#no-book-img {
  position: absolute;
  width: 30vw;
  height: 30vw;
  top: calc(40% - 15vw);
  left: calc(50% - 15vw);
}
</style>
