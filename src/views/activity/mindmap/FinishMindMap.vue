<template>
  <sub-layout title="생각펼치기" :tooltip="tooltip">
    <template v-slot:left>
      <left-menu-button icon="mdi-bookmark-check-outline" text="제출하기" id="canvas-submit" />
    </template>

    <!-- 캔버스 -->
    <canvas id="center-canvas" />

    <finish-overlay
      v-show="submitted"
      :success="true"
      message="좋았어!"
    >
      <overlay-button
        text="활동 마치기"
        @click.native="$router.replace('/')"
      />
    </finish-overlay>

    <!-- TODO: Implementation -->
  </sub-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tooltip: '떠오르는 단어를 적어 커다란 나무를 완성해보자!',
      canvas: document.getElementById(''),
      ctx: [],
      templateType: this.$route.params.template,
      scale: 0.5,
      canvasScale: 1,
      padding: { x: 0, y: 0 },
      startPos: { x: -1, y: -1 },

      nodes: this.$route.params.nodes,

      edges: this.$route.params.edges,

      lightPos: { x: 0, y: 0 },

      touchmode: 'drag',

      bookImg: new Image(),
      leaf1Img: new Image(),
      leaf2Img: new Image(),
      submitted: false,

      pinch: {
        x1: -1, y1: 0, x2: 0, y2: 0,
      },
      beforeMode: '',
      ifOneFinger: true,
    };
  },

  async mounted() {
    this.canvas = document.getElementById('center-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.changedTouches.length === 2) {
        this.pinchStart(e);
      } else this.startDraw(e);
    }, false);
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.changedTouches.length === 2) {
        this.pinchMove(e);
        this.touchmode = 'pinch';
      } else this.draw(e);
    }, false);
    // eslint-disable-next-line no-unused-vars
    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 2) {
        this.pinchFinish(e);
        this.touchmode = 'drag';

        this.startPos.x = -1;
        this.startPos.y = -1;
      } else this.finishDraw(e);
    }, false);

    const submitBtn = document.querySelector('#canvas-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', this.submitBtnClicked);
    }

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    if (this.templateType === 1) {
      this.ctx[0].scale(0.5, 0.5);
      this.ctx[0].scale(1, 1);
      this.padding.x = this.canvas.width / 2 - this.canvas.width / (0.5 * 2);
      this.padding.y = this.canvas.height / 1.1 - this.canvas.height / (0.5 * 1.1);
    } else if (this.templateType === 2) {
      this.ctx[0].scale(0.4, 0.4);
      this.ctx[0].scale(1, 1);
      this.scale = 0.4;
      this.padding.x = this.canvas.width / 2 - this.canvas.width / (0.4 * 2);
      this.padding.y = -this.canvas.height * 0.6;
    }

    this.bookImg.src = this.$route.params.thumbnail;
    // eslint-disable-next-line
    this.leaf1Img.src = require('../../../assets/img/views/activity/mindmap/grape-leaf1.png');
    // eslint-disable-next-line
    this.leaf2Img.src = require('../../../assets/img/views/activity/mindmap/grape-leaf2.png');

    setTimeout(() => {
      this.reDrawAll(this.padding.x, this.padding.y);
    }, 100);
  },

  methods: {
    pinchStart(event) {
      event.preventDefault();
      const touch1 = event.changedTouches[0];
      const touch2 = event.changedTouches[1];

      this.pinch.x1 = touch1.clientX;
      this.pinch.y1 = touch1.clientY;
      this.pinch.x2 = touch2.clientX;
      this.pinch.y2 = touch2.clientY;

      // 한손가락 종료 오류 대비를 위함
      const coors = this.getPosition(event);
      this.startPos.x = coors.X;
      this.startPos.y = coors.Y;
      this.beforeMode = 'pinch';
    },

    pinchMove(event) {
      event.preventDefault();
      const touch1 = event.changedTouches[0];
      const touch2 = event.changedTouches[1];

      if (this.pinch.x1 === -1) {
        this.pinch.x1 = touch1.clientX;
        this.pinch.y1 = touch1.clientY;
        this.pinch.x2 = touch2.clientX;
        this.pinch.y2 = touch2.clientY;
      }

      // eslint-disable-next-line
      const zoomSize = (Math.sqrt((touch1.clientX - this.pinch.x1) ** 2 + (touch1.clientY - this.pinch.y1) ** 2 + Math.sqrt((touch2.clientX - this.pinch.x2) ** 2 + (touch2.clientY - this.pinch.y2) ** 2))) / 2;
      // eslint-disable-next-line
      const zoomCenter = { x: (this.pinch.x1 + this.pinch.x2) / 2, y: (this.pinch.y1 + this.pinch.y2) / 2 };
      // eslint-disable-next-line
      const size1 = Math.sqrt((this.pinch.x1 - this.pinch.x2) ** 2 + (this.pinch.y1 - this.pinch.y2) ** 2);
      // eslint-disable-next-line
      const size2 = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);
      const zoomRatio = size2 / size1;

      this.ctx[0].scale(zoomRatio, zoomRatio);
      this.ctx[0].scale(1, 1);
      this.scale *= zoomRatio;

      const moveX = zoomCenter.x / zoomRatio - zoomCenter.x;
      const moveY = zoomCenter.y / zoomRatio - zoomCenter.y;
      this.padding.x -= moveX;
      this.padding.y -= moveY;

      this.pinch.x1 = touch1.clientX;
      this.pinch.y1 = touch1.clientY;
      this.pinch.x2 = touch2.clientX;
      this.pinch.y2 = touch2.clientY;
      this.reDrawAll(this.padding.x, this.padding.y);
      this.beforeMode = 'pinch';
    },

    pinchFinish(event) {
      event.preventDefault();
      const touch1 = event.changedTouches[0];
      const touch2 = event.changedTouches[1];

      // eslint-disable-next-line
      const zoomSize = (Math.sqrt((touch1.clientX - this.pinch.x1) ** 2 + (touch1.clientY - this.pinch.y1) ** 2) + Math.sqrt((touch2.clientX - this.pinch.x2) ** 2 + (touch2.clientY - this.pinch.y2) ** 2)) / 2;
      // eslint-disable-next-line
      // const zoomCenter = { x: (touch1.clientX + touch2.clientX) / 2, y: (touch1.clientY + touch2.clientY) / 2 };
      // eslint-disable-next-line
      const size1 = Math.sqrt((this.pinch.x1 - this.pinch.x2) ** 2 + (this.pinch.y1 - this.pinch.y2) ** 2);
      // eslint-disable-next-line
      const size2 = Math.sqrt((touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2);
      const zoomRatio = size2 / size1;

      this.ctx[0].scale(zoomRatio, zoomRatio);
      this.ctx[0].scale(1, 1);
      this.scale *= zoomRatio;

      this.pinch.x1 = -1;
      this.pinch.y1 = 0;
      this.pinch.x2 = 0;
      this.pinch.y2 = 0;
      this.reDrawAll(this.padding.x, this.padding.y);
      this.beforeMode = 'pinch';
      this.ifOneFinger = true;
    },

    initSetting(changeX, changeY) {
      const paddingX = changeX + this.padding.x;
      const paddingY = changeY + this.padding.y;

      // 나무 템플릿
      if (this.templateType === 1) {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;

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
        this.ctx[0].fillRect(width - 20 - paddingX, height * 0.9 - paddingY + 140, 40, 160);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].arc(width - paddingX, height * 0.9 - paddingY, 140, Math.PI * 0.25, Math.PI * 0.75);
        this.ctx[0].stroke();

        // 책 이미지 넣기
        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, width - 80 - paddingX, height - 150 - paddingY, 150, 200);
        // 우주배경 템플릿
      } else if (this.templateType === 2) {
        // 배경 포도 그리기
        this.drawGrape(paddingX, paddingY);

        const width = this.canvas.width / 2;
        // const height = this.canvas.height / 2;

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

    startDraw(event) {
      if (this.beforeMode === 'pinch') this.beforeMode = 'drag';
      if (this.startPos.x === -1) this.ifOneFinger = true;
      else this.ifOneFinger = false;

      if (this.ifOneFinger === true) {
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
      }
    },

    draw(event) {
      if (this.beforeMode !== 'pinch' && this.ifOneFinger === true) {
        const coors = this.getPosition(event);
        const changeX = this.startPos.x - coors.X;
        const changeY = this.startPos.y - coors.Y;

        this.ctx[0].clearRect(0, 0, 100000, 100000);
        this.ctx[0].beginPath();

        this.reDrawAll(this.padding.x + changeX, this.padding.y + changeY);
      }
    },

    finishDraw(event) {
      if (this.touchmode === 'drag') {
        if (this.beforeMode !== 'pinch' && this.ifOneFinger === true) {
          const coors = this.getPosition(event);
          this.padding.x += this.startPos.x - coors.X;
          this.padding.y += this.startPos.y - coors.Y;
          this.startPos.x = -1;
          this.startPos.y = -1;
        } else this.ifOneFinger = true;
      } else if (this.touchmode === 'pinch') {
        this.beforeMode = 'pinch';
        this.touchmode = 'drag';

        this.pinch.x1 = -1;
        this.pinch.y1 = 0;
        this.pinch.x2 = 0;
        this.pinch.y2 = 0;

        this.startPos.x = -1;
        this.startPos.y = -1;
      }
    },

    reDrawAll(paddingX, paddingY) {
      this.ctx[0].clearRect(0, 0, 100000, 100000);
      this.ctx[0].beginPath();

      if (this.templateType === 1) {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;
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

        // edge 먼저 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.edges.length; i++) {
          let from = this.nodes.find((element) => element.id === this.edges[i].from);
          let to = this.nodes.find((element) => element.id === this.edges[i].to);
          if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
          else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
          // eslint-disable-next-line max-len
          this.drawEdge(from.x - paddingX, from.y - paddingY, to.x - paddingX, to.y - paddingY);
        }

        // 템플릿 그리기
        this.initSetting(paddingX - this.padding.x, paddingY - this.padding.y);

        // node 그리기
        // image 노드 먼저 그리기
        for (let i = 0; i < this.nodes.length; i += 1) {
          if (this.nodes[i].type === 43) {
            // eslint-disable-next-line
            this.makeNode(this.nodes[i].x - paddingX, this.nodes[i].y - paddingY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
          }
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i].type !== 43) {
            // eslint-disable-next-line max-len
            this.makeNode(this.nodes[i].x - paddingX, this.nodes[i].y - paddingY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
          }
        }
      } else if (this.templateType === 2) {
        this.lightPos.x = this.canvas.width / 2 - paddingX;
        this.lightPos.y = -100 - paddingY;
        // 템플릿 그리기
        this.initSetting(paddingX - this.padding.x, paddingY - this.padding.y);

        // edge 먼저 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.edges.length; i++) {
          let from = this.nodes.find((element) => element.id === this.edges[i].from);
          let to = this.nodes.find((element) => element.id === this.edges[i].to);
          if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
          else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
          // eslint-disable-next-line max-len
          this.drawEdge(from.x - paddingX, from.y - paddingY, to.x - paddingX, to.y - paddingY);
        }

        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, this.canvas.width / 2 - paddingX - 75, 0 - paddingY, 150, 200);

        // node 그리기
        // image 노드 먼저 그리기
        for (let i = 0; i < this.nodes.length; i += 1) {
          if (this.nodes[i].type === 43) {
            // eslint-disable-next-line
            this.makeNode(this.nodes[i].x - paddingX, this.nodes[i].y - paddingY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
          }
        }
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i].type !== 43) {
            // eslint-disable-next-line max-len
            this.makeNode(this.nodes[i].x - paddingX, this.nodes[i].y - paddingY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
          }
        }
      }
    },

    getPosition(event) {
      event.preventDefault();
      const touches = event.changedTouches;
      const x = (touches[0].clientX - this.canvas.offsetLeft);
      const y = (touches[0].clientY - this.canvas.offsetTop);
      const bound = this.canvas.getBoundingClientRect();
      return { X: (x - bound.left) / this.scale, Y: (y - bound.top) / this.scale };
    },

    makeNode(x, y, size, type, text) {
      let fontsize = size / 3;
      let linesize = 1;
      let textLength = 0;
      if (text !== undefined && type !== 43) {
        textLength = this.getTextLength(text);
        if (textLength > 12) fontsize /= 2;
        else if (textLength > 8) fontsize = size / (textLength / 2 - 1);
        linesize = Math.floor(textLength / 16) + 1;
        if (textLength % 16 === 0) linesize -= 1;
      }

      if (this.templateType === 1) {
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            // eslint-disable-next-line
            this.ctx[0].fillText(text, x - (fontsize / 2) * ((textLength - 1) / 2), y + fontsize / 4);
          }
        } else if (type === 43) {
          // 사진 노드 그리기
          const image = new Image();
          image.src = text;

          this.ctx[0].drawImage(image, x - size * 0.84, y - size * 0.6, size * 1.6, size * 1.2);
          // 테두리 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].strokeStyle = '#fffdf2';
          this.ctx[0].lineWidth = size / 3.3;
          this.ctx[0].lineCap = 'round';

          this.ctx[0].moveTo(x, y - size / 2);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size / 4, y - size * 0.9, x - size, y - size * 0.6, x - size * 0.8, y - size * 0.2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.3, y + size / 4, x - size / 2, y + size * 0.8, x - size / 4, y + size / 2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size / 2, y + size * 0.9, x + size * 1, y + size * 0.3, x + size * 0.75, y - 5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size, y - size / 2, x + size * 0.2, y - size * 0.9, x, y - size / 2);
          this.ctx[0].stroke();
        }
      } else if (this.templateType === 2) {
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
          this.ctx[0].shadowBlur = 0;
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
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
          this.ctx[0].shadowBlur = 0;
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
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
          this.ctx[0].shadowBlur = 0;
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
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
          this.ctx[0].shadowBlur = 0;
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

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 16 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        } else if (type === 43) {
          // 사진 노드 그리기
          const image = new Image();
          image.src = text;

          this.ctx[0].drawImage(image, x - size, y - size * 0.8, size * 2, size * 1.6);
          // 테두리 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].strokeStyle = '#fffdf2';
          this.ctx[0].lineWidth = size / 3.3;
          this.ctx[0].lineCap = 'round';

          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size * 1.2, 0, Math.PI * 2);
          this.ctx[0].stroke();

          this.ctx[0].fillStyle = 'white';
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

    drawEdge(x1, y1, x2, y2) {
      if (this.templateType === 1) {
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#baad93';
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      } else if (this.templateType === 2) {
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#9A8653';
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      }
    },

    drawCloud(x, y, paddingX, paddingY) {
      const width = this.canvas.width / 2;
      const height = this.canvas.height / 2;

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

    submitBtnClicked() {
      const data = {
        // eslint-disable-next-line
        nodes: this.nodes,
        edges: this.edges,
        templateType: this.templateType,
      };
      console.log(this.$route.params.bookId, data);

      axios.post('/api/user/work/save', {
        bid: this.$route.params.bookId,
        type: 0,
        content: JSON.stringify(data),
      }).then(() => {
        this.submitted = true;
      }).catch((err) => {
        console.warn('ERROR!!!!: ', err);
      });
    },

    drawGrape(paddingX, paddingY) {
      const r = 100;
      const width = this.canvas.width / 2;

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

    getTextLength(str) {
      let len = 0;
      for (let i = 0; i < str.length; i += 1) {
        if (escape(str.charAt(i)).length === 6) {
          len += 1;
        }
        len += 1;
        if (len % 10 === 9 && i < str.length - 1) {
          if (escape(str.charAt(i)).length === 6) {
            len += 1;
          }
        }
      }
      return len;
    },

  },
};
</script>

<style>
#center-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fffdf2;
  z-index: 5;
  border-radius: 1vw;
  top: 0;
  left: 0;
}
</style>
