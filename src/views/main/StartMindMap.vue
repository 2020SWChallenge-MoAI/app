<template>
  <div id="main">
    <div id="background-forest" />

    <div id="first">
      <div style="position: relative; margin-top: 10%; height: 1vw;" />
      <div id="left-btn" >
        <div id="btn-back-img" />
        <span id="btn-string" >뒤로가기</span>
      </div>
      <div id="left-btn" >
        <div id="btn-save-img" />
        <span id="btn-string" >저장</span>
      </div>
      <div id="left-btn" >
        <div id="btn-reset-img" />
        <span id="btn-string" >초기화</span>
      </div>
      <div id="left-btn" >
        <div id="btn-share-img" />
        <span id="btn-string" >공유하기</span>
      </div>

      <div id="left-menu">
        <div style="width: 1vw; height: 2vw;" />
        <div id="left-menu-pen" />
        <div id="left-menu-move" />
        <div id="left-menu-zoomin" />
        <div id="left-menu-zoomout" />
      </div>
    </div>

    <div id="second">

      <div id="center-box">

        <div id="center-tab">
          생각펼치기
        </div>

        <div id="center-comment">
          떠오르는 단어를 적어 커다란 나무를 완성해보자!
        </div>

        <div id="center-note">
          <div id="punch-holes">
            <div id="holes" style="left: 0vw;" />
            <div id="holes" style="left: 6vw;" />
            <div id="holes" style="left: 12vw;" />
            <div id="holes" style="left: 18vw;" />
            <div id="holes" style="left: 24vw;" />
            <div id="holes" style="left: 30vw;" />
            <div id="holes" style="left: 36vw;" />
            <div id="holes" style="left: 42vw;" />
            <div id="holes" style="left: 48vw;" />
            <div id="holes" style="left: 54vw;" />
            <div id="holes" style="left: 60vw;" />
          </div>

          <canvas id="center-canvas" />
        </div>

        <div id="center-template">
        </div>
      </div>

    </div>

    <div id="third">
      <div id="menu-text">
        MENU
      </div>
      <div id="right-menu">
        <div id="menu-ai" />
        <div id="menu-mindmap" />
        <div id="menu-activity" />
        <div id="menu-quiz" />
        <div id="menu-filtering" />
        <div id="menu-mypage" />
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  data() {
    return {
      canvas: document.getElementById(''),
      ctx: [],
      doubleTabTimer: false,
      scale: 1,
      canvasScale: 1,
      touchmode: 'pen',
      commandHistory: [],
      padding: { x: 0, y: 0 },
      startPos: { x: -1, y: -1 },
      maxPos: {
        T: -1, B: -1, L: -1, R: -1,
      },

      nodes: [
      ],

      edges: [
      ],

      words: [
      ],

      wordSelected: '',
      canSelect: true,
      wordIndex: 0,
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

    const penBtn = document.querySelector('#left-menu-pen');
    const dragBtn = document.querySelector('#left-menu-move');
    const zoomin = document.querySelector('#left-menu-zoomin');
    const zoomout = document.querySelector('#left-menu-zoomout');

    if (penBtn) {
      penBtn.addEventListener('click', this.penBtnClicked);
    }
    if (dragBtn) {
      dragBtn.addEventListener('click', this.dragBtnClicked);
    }
    if (zoomin) {
      zoomin.addEventListener('click', this.zoominClicked);
    }
    if (zoomout) {
      zoomout.addEventListener('click', this.zoomoutClicked);
    }

    this.initSetting(0, 0);
  },

  methods: {
    initSetting(changeX, changeY) {
      const paddingX = changeX + this.padding.x;
      const paddingY = changeY + this.padding.y;
      // edge 줄기 미리 그리기
      this.ctx[0].strokeStyle = '#baad93';
      this.ctx[0].lineWidth = 12;
      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - paddingX, this.canvas.height / 2 - paddingY);
      this.ctx[0].lineTo(120 - paddingX, 120 - paddingY);
      this.ctx[0].stroke();

      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - paddingX, this.canvas.height / 2 - paddingY);
      this.ctx[0].lineTo(this.canvas.width - 120 - paddingX, 120 - paddingY);
      this.ctx[0].stroke();

      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - paddingX, this.canvas.height / 2 - paddingY);
      this.ctx[0].lineTo(120 - paddingX, this.canvas.height - 120 - paddingY);
      this.ctx[0].stroke();

      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - paddingX, this.canvas.height / 2 - paddingY);
      // eslint-disable-next-line max-len
      this.ctx[0].lineTo(this.canvas.width - 120 - paddingX, this.canvas.height - 120 - paddingY);
      this.ctx[0].stroke();

      // 템플릿(나무) 그리기
      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - paddingX, this.canvas.height / 2 - 80 - paddingY);
      this.ctx[0].strokeStyle = '#7ed221';
      this.ctx[0].fillStyle = '#7ed221';
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(this.canvas.width / 2 - 250 - paddingX, this.canvas.height / 2 - 200 - paddingY, this.canvas.width / 2 - 250 - paddingX, this.canvas.height / 2 + 180 - paddingY, this.canvas.width / 2 - paddingX, this.canvas.height / 2 + 120 - paddingY);
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - 5 - paddingX, this.canvas.height / 2 + 120 - paddingY);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(this.canvas.width / 2 + 200 - paddingX, this.canvas.height / 2 + 180 - paddingY, this.canvas.width / 2 + 200 - paddingX, this.canvas.height / 2 - 150 - paddingY, this.canvas.width / 2 - 5 - paddingX, this.canvas.height / 2 - 80 - paddingY);
      this.ctx[0].fill();

      // 나무 줄기 그리기
      this.ctx[0].beginPath();
      this.ctx[0].fillStyle = '#836d4b';
      // eslint-disable-next-line max-len
      this.ctx[0].fillRect(this.canvas.width / 2 - 20 - paddingX, this.canvas.height - 120 - paddingY, 40, 120);
      this.ctx[0].lineWidth = 12;
      this.ctx[0].strokeStyle = '#836d4b';
      // eslint-disable-next-line max-len
      this.ctx[0].arc(this.canvas.width * 0.5 - paddingX, this.canvas.height * 0.4 - paddingY, 130, Math.PI * 0.25, Math.PI * 0.75);
      this.ctx[0].stroke();

      this.makeNode(120 - paddingX, 120 - paddingY, 80, 0, '등장인물');
      this.makeNode(this.canvas.width - 120 - paddingX, 120 - paddingY, 80, 1, '줄거리');
      this.makeNode(120 - paddingX, this.canvas.height - 120 - paddingY, 80, 2, '느낀점');
      this.makeNode(this.canvas.width - 120 - paddingX, this.canvas.height - 120 - paddingY, 80, 3, '인상장면');
    },

    startDraw(event) {
      if (this.touchmode === 'pen') {
        this.ctx[0].beginPath();
        const coors = this.getPosition(event);
        this.ctx[0].moveTo(coors.X, coors.Y);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
        this.maxPos.T = coors.Y;
        this.maxPos.B = coors.Y;
        this.maxPos.L = coors.X;
        this.maxPos.R = coors.X;
        // eslint-disable-next-line max-len
        this.commandHistory.push({
          x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'lineStart',
        });
      } else if (this.touchmode === 'drag') {
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
      }
    },

    draw(event) {
      if (this.touchmode === 'pen') {
        const coors = this.getPosition(event);
        this.ctx[0].lineTo(coors.X, coors.Y);
        this.ctx[0].stroke();

        if (coors.X > this.maxPos.R) this.maxPos.R = coors.X;
        else if (coors.X < this.maxPos.L) this.maxPos.L = coors.X;
        if (coors.Y > this.maxPos.T) this.maxPos.T = coors.Y;
        else if (coors.Y < this.maxPos.B) this.maxPos.B = coors.Y;
        this.commandHistory.push({
          x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'line',
        });
      } else if (this.touchmode === 'drag') {
        const coors = this.getPosition(event);
        const changeX = this.startPos.x - coors.X;
        const changeY = this.startPos.y - coors.Y;

        let i = 0;
        this.ctx[0].clearRect(0, 0, 100000, 100000);

        this.initSetting(changeX, changeY);

        // eslint-disable-next-line no-plusplus
        for (i; i < this.commandHistory.length; i++) {
          const point = this.commandHistory[i];

          if (point.mode === 'lineStart') {
            this.ctx[0].beginPath();
            // eslint-disable-next-line max-len
            this.ctx[0].moveTo(point.x - changeX - this.padding.x, point.y - changeY - this.padding.y);
          } else if (point.mode === 'line') {
            // eslint-disable-next-line max-len
            this.ctx[0].lineTo(point.x - changeX - this.padding.x, point.y - changeY - this.padding.y);
          } else if (point.mode === 'node' || point.mode === 'edge') {
            this.ctx[0].stroke();
          } else if (point.mode === 'text') {
            this.ctx[0].font = point.font;
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(point.text, point.x - changeX - this.padding.x, point.y - changeY - this.padding.y);
          } else if (point.mode === 'lineFinish') {
            this.ctx[0].stroke();
          }
        }
        this.ctx[0].stroke();
      }
    },

    finishDraw(event) {
      if (this.touchmode === 'pen') {
        const coors = this.getPosition(event);
        // eslint-disable-next-line max-len
        const thresh = (this.startPos.x - coors.X) * (this.startPos.x - coors.X) + (this.startPos.y - coors.Y) * (this.startPos.y - coors.Y);

        if (thresh > 800) {
          let edgeFrom = -1;
          let edgeTo = -1;
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
            if ((this.nodes[i].T + 100 > this.startPos.y + this.padding.y && this.nodes[i].B - 100 < this.startPos.y + this.padding.y) && (this.nodes[i].L - 100 < this.startPos.x + this.padding.x && this.nodes[i].R + 100 > this.startPos.x + this.padding.x)) {
              edgeFrom = this.nodes[i].id;
            }
          }

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
            if ((this.nodes[i].T + 100 > coors.Y + this.padding.y && this.nodes[i].B - 100 < coors.Y + this.padding.y) && (this.nodes[i].L - 100 < coors.X + this.padding.x && this.nodes[i].R + 100 > coors.X + this.padding.x)) {
              edgeTo = this.nodes[i].id;
            }
          }
          console.log(edgeFrom, edgeTo);

          if (edgeFrom === -1 || edgeTo === -1) {
            this.commandHistory.push({
              x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'lineFinish',
            });
          } else {
            const newid = new Date().getTime();
            this.edges.push({ id: newid, from: edgeFrom, to: edgeTo });
            this.commandHistory.push({
              x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'edge', id: newid,
            });
          }
        } else {
          const inputLabel = prompt('단어를 입력하세요.');
          if (this.maxPos.R - this.maxPos.L < 100) {
            this.ctx[0].font = '10px Calibri';
          } else if (this.maxPos.R - this.maxPos.L >= 100 && this.maxPos.R - this.maxPos.L < 400) {
            this.ctx[0].font = '30px Calibri';
          } else if (this.maxPos.R - this.maxPos.L >= 400 && this.maxPos.R - this.maxPos.L < 1000) {
            this.ctx[0].font = '80px Calibri';
          }
          if (inputLabel != null) {
            const labelLength = inputLabel.length;
            this.ctx[0].strokeStyle = 'black';
            this.ctx[0].fillStyle = 'black';
            if (this.ctx[0].font === '10px Calibri') {
            // eslint-disable-next-line max-len
              this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 5, (this.maxPos.T + this.maxPos.B) / 2);
              this.commandHistory.push({
                x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 5 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
              });
            } else if (this.ctx[0].font === '30px Calibri') {
            // eslint-disable-next-line max-len
              this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 10, (this.maxPos.T + this.maxPos.B) / 2);
              this.commandHistory.push({
                x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 10 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
              });
            } else {
            // eslint-disable-next-line max-len
              this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 20, (this.maxPos.T + this.maxPos.B) / 2);
              this.commandHistory.push({
                x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 20 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
              });
            }
            this.ctx[0].strokeStyle = this.strokeColor;
            const newid = new Date().getTime();
            this.nodes.push({
            // eslint-disable-next-line max-len
              id: newid, label: inputLabel, T: this.maxPos.T + this.padding.y, B: this.maxPos.B + this.padding.y, L: this.maxPos.L + this.padding.x, R: this.maxPos.R + this.padding.x,
            });
            this.commandHistory.push({
              x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'node', id: newid,
            });
          } else {
            this.commandHistory.push({
              x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'lineFinish',
            });
          }
        }
        this.startPos.x = -1;
        this.startPos.y = -1;
        this.maxPos.T = -1;
        this.maxPos.B = -1;
        this.maxPos.L = -1;
        this.maxPos.R = -1;
        console.log('nodes: ', this.nodes);
        console.log('edges: ', this.edges);
      } else if (this.touchmode === 'drag') {
        const coors = this.getPosition(event);
        this.padding.x += this.startPos.x - coors.X;
        this.padding.y += this.startPos.y - coors.Y;
      } else if (this.touchmode === 'word') {
        const coors = this.getPosition(event);

        this.ctx[0].beginPath();
        this.ctx[0].strokeStyle = this.strokeColor;
        this.ctx[0].lineWidth = this.brushSize;
        // eslint-disable-next-line max-len
        this.ctx[0].arc(coors.X, coors.Y, 50, 0, Math.PI * 2);
        this.ctx[0].stroke();

        const inputLabel = this.wordSelected;
        console.log(inputLabel);
        this.ctx[0].font = '15px Calibri';

        if (inputLabel != null) {
          const labelLength = inputLabel.length;
          this.ctx[0].strokeStyle = 'black';
          this.ctx[0].fillStyle = 'black';
          // eslint-disable-next-line max-len
          this.ctx[0].fillText(inputLabel, coors.X - labelLength * 5, coors.Y);
          this.commandHistory.push({
            x: coors.X - labelLength * 5 + this.padding.x, y: coors.Y + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
          });
          this.ctx[0].strokeStyle = this.strokeColor;
          const newid = new Date().getTime();
          this.nodes.push({
          // eslint-disable-next-line max-len
            id: newid, label: inputLabel, T: coors.Y + 50 + this.padding.y, B: coors.Y - 50 + this.padding.y, L: coors.X - 50 + this.padding.x, R: coors.X + 50 + this.padding.x,
          });
          this.commandHistory.push({
            x: coors.X + this.padding.x, y: coors.Y + this.padding.y, r: 50, size: this.brushSize, color: this.strokeColor, mode: 'circle', text: 'node',
          });
        } else {
          this.commandHistory.push({
            x: coors.X + this.padding.x, y: coors.Y + this.padding.y, r: 50, size: this.brushSize, color: this.strokeColor, mode: 'circle', text: 'empty',
          });
        }
        const recommendWords = document.querySelectorAll('.recommend');
        recommendWords.forEach((word) => {
          if (word.innerText === this.wordSelected) {
            word.classList.remove('recommend-selected');
          }
        }, true);
        this.wordSelected = '';
        this.touchmode = '';
        this.canSelect = true;
      }
    },

    reDrawAll() {
      let i = 0;
      this.ctx[0].clearRect(0, 0, 100000, 100000);

      this.initSetting(0, 0);

      // eslint-disable-next-line no-plusplus
      for (i; i < this.commandHistory.length; i++) {
        const point = this.commandHistory[i];

        this.ctx[0].lineWidth = point.size;
        this.ctx[0].strokeStyle = point.color;

        if (point.mode === 'lineStart') {
          this.ctx[0].beginPath();
          this.ctx[0].moveTo(point.x - this.padding.x, point.y - this.padding.y);
        } else if (point.mode === 'line') {
          this.ctx[0].lineTo(point.x - this.padding.x, point.y - this.padding.y);
        } else if (point.mode === 'node' || point.mode === 'edge') {
          this.ctx[0].stroke();
        } else if (point.mode === 'text') {
          this.ctx[0].font = point.font;
          this.ctx[0].fillText(point.text, point.x - this.padding.x, point.y - this.padding.y);
        } else if (point.mode === 'lineFinish') {
          this.ctx[0].stroke();
        }
      }
      this.ctx[0].stroke();
    },

    getPosition(event) {
      const touches = event.changedTouches;
      const x = (touches[0].clientX - this.canvas.offsetLeft);
      const y = (touches[0].clientY - this.canvas.offsetTop);
      const bound = this.canvas.getBoundingClientRect();
      return { X: (x - bound.left) / this.scale, Y: (y - bound.top) / this.scale };
    },

    makeNode(x, y, size, type, text) {
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
    },

    penBtnClicked() {
      this.touchmode = 'pen';
    },

    dragBtnClicked() {
      this.touchmode = 'drag';
    },

    zoominClicked() {
      if (this.canvasScale < 3) {
        this.canvasScale += 0.1;
        this.scale *= 1.1;
        this.ctx[0].scale(1.1, 1.1);
        this.reDrawAll();
      }
    },

    zoomoutClicked() {
      if (this.canvasScale > 0.1) {
        this.canvasScale -= 0.1;
        this.scale *= 0.9;
        this.ctx[0].scale(0.9, 0.9);
        this.reDrawAll();
      }
    },
  },

};
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #A6D6CD 0%, rgba(166, 214, 205, 0) 100%);
}

#first {
  width: 10%;
  height: 100%;
  display: inline-block;
}

#second {
  width: 80%;
  height: 100%;
  display: inline-block;
}

#third {
  width: 10%;
  height: 100%;
  display: inline-block;
}

#background-forest {
  background-image: url('../../assets/background-forest.svg');
  background-size: cover;
  width: 100%;
  height: 50%;
  position: absolute;
  top: 50%;
  z-index: 1;
}

#center-box {
  position: relative;
  width: 100%;
  height: 90%;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 20px;
  z-index: 10;
  margin-top: 5%;
}

#center-tab {
  position: absolute;
  background: #EE8F89;
  border-radius: 15px;
  width: 18vw;
  height: 6vw;
  z-index: 12;
  left: 8vw;
  top: 2vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: bold;
  font-size: 2.5vw;
  line-height: 30px;
  letter-spacing: 0.1vw;
  text-align: center;
  padding-top: 1vw;

  color: #FFFFFF;
}

#center-comment {
  position: absolute;
  width: 45vw;
  height: 3.5vw;
  left: 32vw;
  top: 2.2vw;
  z-index: 12;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: bold;
  font-size: 1.5vw;
  line-height: 20px;
  letter-spacing: 0.1vw;

  color: #000000;

  padding-left: 3vw;
  padding-top: 0.8vw;
}

#center-template {
  position: relative;
  width: 95%;
  height: 22%;
  background: #FFFDF2;
  border-radius: 20px;
  z-index: 15;
  top: 74%;
  left: 2.5%;
}

#center-note {
  position: absolute;
  width: 95%;
  height: 60%;
  background: #FFFDF2;
  border-radius: 20px;
  z-index: 15;
  top: 10%;
  left: 2.5%;
}

#punch-holes {
  position: absolute;
  width: 65vw;
  height: 3vw;
  top: 2vw;
  left: 6vw;
  z-index: 20;
}

#holes {
  position: absolute;
  width: 3vw;
  height: 3vw;
  background: #D2EADE;
  border-radius: 3vw;
  z-index: 20;
}

#center-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #FFFDF2;
  z-index: 15;
  border-radius: 20px;
}

#left-btn {
  position: relative;
  width: 6vw;
  height: 6vw;
  background: rgba(107, 152, 159, 0.6);
  border-radius: 15px;
  margin-left: 20%;
  margin-top: 20%;
  z-index: 10;
}
#btn-back-img {
  position: relative;
  width: 5.5vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-back.svg');
  background-size: cover;
}
#btn-save-img {
  position: relative;
  width: 6vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-save.svg');
  background-size: cover;
}
#btn-reset-img {
  position: relative;
  width: 6vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-reset.svg');
  background-size: cover;
}
#btn-share-img {
  position: relative;
  width: 6vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-share.svg');
  background-size: cover;
}
#btn-string {
  position: absolute;
  width: 5vw;
  height: 3vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: normal;
  font-size: 0.5em;
  line-height: 12px;

  text-align: center;
  letter-spacing: 0.1em;

  text-align: center;
  margin-left: 0.5vw;

  color: #FFFFFF;
}
#left-menu {
  position: relative;
  width: 8vw;
  height: 30vw;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 15px;
  margin-left: 10%;
  z-index: 10;
  margin-top: 50%;
}
#left-menu-pen {
  position: relative;
  width: 5vw;
  height: 5vw;
  background: url('../../assets/pen.svg');
  background-size: cover;
  border-radius: 15px;
  margin-left: 1.5vw;
}
#left-menu-move {
  position: relative;
  width: 5vw;
  height: 5vw;
  background: url('../../assets/drag.svg');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 1.5vw;
}
#left-menu-zoomin {
  position: relative;
  width: 5vw;
  height: 5vw;
  background: url('../../assets/zoomin.svg');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 1.5vw;
}
#left-menu-zoomout {
  position: relative;
  width: 5.5vw;
  height: 5.5vw;
  background: url('../../assets/zoomout.svg');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 1.25vw;
}

#top-bar {
  position: absolute;
  margin-top: calc(8% - 3.5vw);
  margin-left: 2%;
}

#right-menu {
  position: absolute;
  width: 8%;
  height: 75%;
  z-index: 10;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 10px;
  margin-left: 1%;
  margin-top: 12%;
}
#menu-text {
  position: absolute;
  width: 6vw;
  height: 2vw;
  margin-left: 1.8vw;
  margin-top: 9vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: bold;
  font-size: 2vw;
  line-height: 20px;
  /* identical to box height */

  text-align: center;

  color: #FFFFFF;
}
#menu-ai {
  position: relative;
  width: 6vw;
  height: 8vw;
  background-image: url('../../assets/right-menu/ai.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-mindmap {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/mindmap.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 3vw;
}
#menu-activity {
  position: relative;
  width: 6vw;
  height: 7.7vw;
  background-image: url('../../assets/right-menu/activity.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-quiz {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/quiz.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-filtering {
  position: relative;
  width: 6.4vw;
  height: 7.6vw;
  background-image: url('../../assets/right-menu/filtering.svg');
  background-size: cover;
  margin-left: 0.8vw;
  margin-top: 1vw;
}
#menu-mypage {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/mypage.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
</style>
