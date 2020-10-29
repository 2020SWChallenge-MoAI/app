<template>
  <sub-layout title="마인드맵" tooltip="떠오르는 단어를 적어 커다란 나무를 완성해보자!">
    <template v-slot:left>
      <left-menu-button icon="mdi-magnify-plus" text="확대" id="canvas-zoomin" />
      <left-menu-button icon="mdi-magnify-minus" text="축소" id="canvas-zoomout" />
      <left-menu-button icon="mdi-bookmark-check-outline" text="제출하기" id="canvas-submit" />
    </template>

    <!-- 캔버스 -->
    <canvas id="center-canvas" />

    <!-- TODO: Implementation -->
  </sub-layout>
</template>

<script>
export default {
  data() {
    return {
      canvas: document.getElementById(''),
      ctx: [],
      templateType: 1,
      scale: 0.5,
      canvasScale: 1,
      padding: { x: 0, y: 0 },
      startPos: { x: -1, y: -1 },

      nodes: this.$route.params.nodes,

      edges: this.$route.params.edges,
    };
  },

  mounted() {
    this.canvas = document.getElementById('center-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.canvas.addEventListener('touchstart', (e) => {
      this.startDraw(e);
    }, false);
    this.canvas.addEventListener('touchmove', (e) => {
      this.draw(e);
    }, false);
    // eslint-disable-next-line no-unused-vars
    this.canvas.addEventListener('touchend', (e) => {
      this.finishDraw(e);
    }, false);

    const submitBtn = document.querySelector('#canvas-submit');
    const zoomin = document.querySelector('#canvas-zoomin');
    const zoomout = document.querySelector('#canvas-zoomout');
    if (submitBtn) {
      submitBtn.addEventListener('click', this.submitBtnClicked);
    }
    if (zoomin) {
      zoomin.addEventListener('click', this.zoomin);
    }
    if (zoomout) {
      zoomout.addEventListener('click', this.zoomout);
    }

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx[0].scale(0.5, 0.5);
    this.ctx[0].scale(1, 1);
    this.padding.x = -388;
    this.padding.y = -727;

    this.reDrawAll();
  },

  methods: {
    initSetting(changeX, changeY) {
      const paddingX = changeX + this.padding.x;
      const paddingY = changeY + this.padding.y;

      // 나무 템플릿
      if (this.templateType === 1) {
        const width = 389;
        const height = 207.5;

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
        this.ctx[0].fillRect(width - 20 - paddingX, height * 2 - 120 - paddingY, 40, 120);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].arc(width * 2 * 0.5 - paddingX, height * 2 * 0.4 - paddingY, 130, Math.PI * 0.25, Math.PI * 0.75);
        this.ctx[0].stroke();

        // 책 이미지 넣기
        const bookImg = new Image();
        // eslint-disable-next-line
        bookImg.src = require('../../../assets/left-book-menu/book3.png');
        // eslint-disable-next-line
        this.ctx[0].drawImage(bookImg, width - 80 - paddingX, height - 150 - paddingY, 150, 200);
        // 우주배경 템플릿
      } else if (this.templateType === 2) {
        this.canvas.style.background = '#777777';
      }
    },

    startDraw(event) {
      this.selectedNode = -1;
      const coors = this.getPosition(event);
      this.startPos.x = coors.X;
      this.startPos.y = coors.Y;
    },

    draw(event) {
      const coors = this.getPosition(event);
      const changeX = this.startPos.x - coors.X;
      const changeY = this.startPos.y - coors.Y;

      this.ctx[0].clearRect(0, 0, 100000, 100000);
      this.ctx[0].beginPath();

      // edge 먼저 그리기
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.edges.length; i++) {
        let from = this.nodes.find((element) => element.id === this.edges[i].from);
        let to = this.nodes.find((element) => element.id === this.edges[i].to);
        if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
        else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
        // eslint-disable-next-line max-len
        this.drawEdge(from.x - this.padding.x - changeX, from.y - this.padding.y - changeY, to.x - this.padding.x - changeX, to.y - this.padding.y - changeY);
      }

      // 템플릿 그리기
      this.initSetting(changeX, changeY);

      // node 그리기
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.nodes.length; i++) {
        // eslint-disable-next-line max-len
        this.makeNode(this.nodes[i].x - this.padding.x - changeX, this.nodes[i].y - this.padding.y - changeY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
      }
    },

    finishDraw(event) {
      const coors = this.getPosition(event);
      this.padding.x += this.startPos.x - coors.X;
      this.padding.y += this.startPos.y - coors.Y;
    },

    reDrawAll() {
      this.ctx[0].clearRect(0, 0, 100000, 100000);
      this.ctx[0].beginPath();

      // edge 먼저 그리기
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.edges.length; i++) {
        let from = this.nodes.find((element) => element.id === this.edges[i].from);
        let to = this.nodes.find((element) => element.id === this.edges[i].to);
        if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
        else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
        // eslint-disable-next-line max-len
        this.drawEdge(from.x - this.padding.x, from.y - this.padding.y, to.x - this.padding.x, to.y - this.padding.y);
      }

      // 템플릿 그리기
      this.initSetting(0, 0);

      // node 그리기
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.nodes.length; i++) {
        // eslint-disable-next-line max-len
        this.makeNode(this.nodes[i].x - this.padding.x, this.nodes[i].y - this.padding.y, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
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
      } else if (this.templateType === 2) {
        if (type === 0) {
          this.ctx[0].fillStyle = '#736993';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].beginPath();
          this.ctx[0].strokeStyle = '#c5a863';
          this.ctx[0].lineWidth = size * 0.15;
          this.ctx[0].lineCap = 'round';
          this.ctx[0].moveTo(x - size * 0.9, y + size / 2);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.8, y + size * 2, x + size * 2, y - size * 0.9, x + size * 0.7, y - size * 0.7);
          this.ctx[0].stroke();

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
          const gradient = this.ctx[0].createLinearGradient(x, y - size, x, y + size);
          gradient.addColorStop(0, '#f2e7bf');
          gradient.addColorStop(0.3, '#cca978');
          gradient.addColorStop(0.4, '#f2e7bf');
          gradient.addColorStop(0.5, '#f2e7bf');
          gradient.addColorStop(0.8, '#cca978');
          gradient.addColorStop(1, '#f2e7bf');

          this.ctx[0].beginPath();
          this.ctx[0].fillStyle = gradient;
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].beginPath();
          this.ctx[0].strokeStyle = '#c5a863';
          this.ctx[0].lineWidth = size * 0.05;
          this.ctx[0].lineCap = 'round';
          // eslint-disable-next-line max-len
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].stroke();

          let textloc = ((linesize - 1) / 2) * -1;
          for (let i = 0; i < linesize; i += 1) {
            this.ctx[0].beginPath();
            // eslint-disable-next-line prefer-template
            this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
            this.ctx[0].fillStyle = '#5e453e';
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
            textloc += 1;
          }
        } else if (type === 3) {
          this.ctx[0].fillStyle = 'yellow';
          this.ctx[0].strokeStyle = 'yellow';

          this.ctx[0].beginPath();
          this.ctx[0].moveTo(x + size * 0.1, y - size * 1.2);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.1, y - size * 0.7, x - size * 0.7, y - size * 0.5, x - size * 0.9, y - size * 0.5);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.8, y - size * 0.5, x - size * 0.4, y + size * 0.1, x - size * 0.55, y + size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.2, y + size * 0.4, x + size * 0.5, y + size * 0.4, x + size * 0.85, y + size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.8, y + size * 0.3, x + size * 0.8, y - size * 0.2, x + size * 1.1, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.5, y - size * 0.7, x + size * 0.3, y - size * 0.9, x + size * 0.1, y - size * 1.2);

          this.ctx[0].stroke();
          this.ctx[0].fill();
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
      }
    },

    zoomin() {
      if (this.canvasScale < 3) {
        this.canvasScale += 0.1;
        this.scale *= 1.1;
        this.ctx[0].scale(1.1, 1.1);
        this.reDrawAll();
      }
    },

    zoomout() {
      if (this.canvasScale > 0.1) {
        this.canvasScale -= 0.1;
        this.scale *= 0.9;
        this.ctx[0].scale(0.9, 0.9);
        this.reDrawAll();
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

    submitBtnClicked() {
      this.$router.replace({
        name: 'Main',
      });
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
