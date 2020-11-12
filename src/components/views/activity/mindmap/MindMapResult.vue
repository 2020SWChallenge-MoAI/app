<template>
  <canvas id="mindmap-result-canvas" />
</template>

<script>

export default {
  props: ['work'],
  data() {
    return {
      activity: null,
      canvas: null,
      ctx: [],
      bookImg: new Image(),
      leaf1Img: new Image(),
      leaf2Img: new Image(),
      scale: 1.0,
      padding: { x: 0, y: 0 },
      lightPos: { x: 0, y: 0 },
    };
  },
  watch: {
    async work() {
      await this.loadWork();
    },
  },
  created() {
    // eslint-disable-next-line global-require
    this.leaf1Img.src = require('../../../../assets/img/views/activity/mindmap/grape-leaf1.png');
    // eslint-disable-next-line global-require
    this.leaf2Img.src = require('../../../../assets/img/views/activity/mindmap/grape-leaf2.png');
  },
  async mounted() {
    this.canvas = document.querySelector('#mindmap-result-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx[0].scale(0.2, 0.2);
    this.ctx[0].scale(1, 1);

    this.loadWork();
  },
  methods: {
    initSetting(changeX, changeY) {
      const paddingX = changeX + this.padding.x;
      const paddingY = changeY + this.padding.y;

      // 나무 템플릿
      if (this.activity.templateType === 1) {
        const width = this.activity.nodes[0].x;
        const height = this.activity.nodes[0].y;

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
        const width = this.activity.nodes[0].x;
        const height = this.activity.nodes[0].y;

        this.padding.x = this.activity.nodes[0].x - (this.canvas.width / 2) / 0.2;
        // eslint-disable-next-line max-len
        this.padding.y = this.activity.nodes[0].y * 0.75 - this.canvas.height / (0.4 * 0.75);
        const paddingX = this.padding.x;
        const paddingY = this.padding.y;

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
      let fontsize = size / 3;
      let linesize = 1;
      let textLength = 0;
      if (text !== undefined) {
        textLength = this.getTextLength(text);
        if (textLength > 12) fontsize /= 2;
        else if (textLength > 8) fontsize = size / (textLength / 2 - 1);
        linesize = Math.floor(textLength / 16) + 1;
        if (textLength % 16 === 0) linesize -= 1;
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
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 15 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            // eslint-disable-next-line
            this.ctx[0].fillText(text, x - (fontsize / 2) * ((textLength - 2) / 2), y + fontsize / 4);
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
    async loadWork() {
      this.activity = JSON.parse(this.work.content);
      await this.loadBookCover();
      this.reDrawAll();
    },
    async loadBookCover() {
      this.bookImg.src = await this.$store.getters.book(this.work.bid).thumbnail;
    },
    getTextLength(str) {
      let len = 0;
      for (let i = 0; i < str.length; i += 1) {
        if (escape(str.charAt(i)).length === 6) {
          len += 1;
        }
        len += 1;
      }
      return len;
    },
  },
};
</script>

<style scoped>
#mindmap-result-canvas {
    width: 100%;
    height: 100%;
}
</style>
