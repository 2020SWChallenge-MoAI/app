<template>
  <body>
    <div class="outFrame">
      <div class="tools">
        <center><div
          id="jsColors"
          class="controls__colors"
        >
          <div
            class="controls__color jsColor"
            style="background-color: #2c2c2c"
          />
          <div
            class="controls__color jsColor"
            style="background-color: white"
          />
          <div
            class="controls__color jsColor"
            style="background-color: #ff3b30"
          />
          <div
            class="controls__color jsColor"
            style="background-color: #ff9500"
          />
          <div
            class="controls__color jsColor"
            style="background-color: #ffcc00"
          />
          <div
            class="controls__color jsColor"
            style="background-color: #4cd963"
          />
          <div
            class="controls__color jsColor"
            style="background-color: #5ac8fa"
          />
          <div
            class="controls__color jsColor"
            style="background-color: #0579FF"
          />
          <div
            class="controls__color jsColor"
            style="background-color: #5856D6"
          />
        </div></center>

        <div class="figures">
          <div class="figure">
            <div id="circle" />
          </div>
          <div class="figure">
            <div id="rectangle" />
          </div>
          <div class="figure">
            <div id="triangle" />
          </div>
        </div>

        <div class="lines">
          <div class="line1">
            <div id="line11" />
          </div>
          <div class="line2">
            <div id="line22" />
          </div>
          <div class="line3">
            <div id="line33" />
          </div>
        </div>

        <div class="materials">
          <div class="materials1">
            <img
              id="pen"
              src="../assets/pen.svg"
              alt="pen"
            >
            <img
              id="drag"
              src="../assets/drag.svg"
              alt="drag"
            >
          </div>
          <div class="materials2">
            <img
              id="zoomin"
              src="../assets/zoomin.svg"
              alt="zoomin"
            >
            <img
              id="zoomout"
              src="../assets/zoomout.svg"
              alt="zoomout"
            >
          </div>
        </div>

        <div class="kits">
          <img
            id="undo"
            src="../assets/undo.svg"
            alt="undo"
          >
          <img
            id="reset"
            src="../assets/reset.svg"
            alt="reset"
          >
          <img
            id="save"
            src="../assets/save.svg"
            alt="save"
          >
        </div>
      </div>
      <canvas
        id="jsCanvas"
        class="canvas"
      />
      <div class="recommends">
        <img
          id="aiImg"
          src="../assets/ai.svg"
        >
        <div id="wordBalloon">
          <span
            v-for="word in words"
            :key="word"
            class="recommend"
          >
            {{ word }}
          </span>
          <button id="nextBtn">다음</button>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  data() {
    return {
      canvas: document.getElementById(''),
      ctx: [],
      scale: 1,
      strokeColor: 'black',
      touchmode: 'pen',
      commandHistory: [],
      brushSize: 2.5,
      padding: { x: 0, y: 0 },
      pos: {
        drawable: false,
        x: -1,
        y: -1,
      },
      startPos: { x: -1, y: -1 },
      maxPos: {
        T: -1, B: -1, L: -1, R: -1,
      },

      nodes: [
      ],

      edges: [
      ],

      words: [
        '흥부', '놀부', '제비', '박',
      ],
      wholeWords: [
        '흥부', '놀부', '제비', '박', '자식',
      ],
      wordDelay: 0,
      wordSelected: '',
      canSelect: true,
    };
  },
  mounted() {
    window.onload = () => {
      this.canvas = document.getElementById('jsCanvas');
      this.ctx.push(this.canvas.getContext('2d'));

      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

      this.canvas.addEventListener('touchstart', (e) => {
        this.startDraw(e);
      }, false);
      this.canvas.addEventListener('touchmove', (e) => {
        if (this.pos.drawable) this.draw(e);
      }, false);
      // eslint-disable-next-line no-unused-vars
      this.canvas.addEventListener('touchend', (e) => {
        this.finishDraw(e);
      }, false);

      const colors = document.querySelectorAll('.jsColor');
      const range1 = document.querySelector('.line1');
      const range2 = document.querySelector('.line2');
      const range3 = document.querySelector('.line3');
      const resetBtn = document.querySelector('#reset');
      const undoBtn = document.querySelector('#undo');
      const penBtn = document.querySelector('#pen');
      const dragBtn = document.querySelector('#drag');
      const paintBtn = document.querySelector('#paint');
      const saveBtn = document.querySelector('#save');
      const zoomIn = document.querySelector('#zoomin');
      const zoomOut = document.querySelector('#zoomout');
      const circleBtn = document.querySelector('#circle');
      const rectangleBtn = document.querySelector('#rectangle');
      const triangleBtn = document.querySelector('#triangle');
      const recommendWords = document.querySelectorAll('.recommend');
      const nextBtn = document.querySelector('#nextBtn');
      this.ctx[0].lineWidth = 2.5;
      colors.forEach((color) => {
        color.addEventListener('click', this.handleColorClick);
      });
      if (range1) {
        range1.addEventListener('click', this.handleRange1);
      }
      if (range2) {
        range2.addEventListener('click', this.handleRange2);
      }
      if (range3) {
        range3.addEventListener('click', this.handleRange3);
      }
      if (resetBtn) {
        resetBtn.addEventListener('click', this.handleResetClick);
      }
      if (undoBtn) {
        undoBtn.addEventListener('click', this.undoClick);
      }
      if (penBtn) {
        penBtn.addEventListener('click', this.handlePenClick);
      }
      if (zoomIn) {
        zoomIn.addEventListener('click', this.zoomIn);
      }
      if (zoomOut) {
        zoomOut.addEventListener('click', this.zoomOut);
      }
      if (dragBtn) {
        dragBtn.addEventListener('click', this.dragClick);
      }
      if (paintBtn) {
        paintBtn.addEventListener('click', this.paintClick);
      }
      if (saveBtn) {
        saveBtn.addEventListener('click', this.saveClick);
      }
      if (circleBtn) {
        circleBtn.addEventListener('click', this.circleClick);
      }
      if (rectangleBtn) {
        rectangleBtn.addEventListener('click', this.rectangleClick);
      }
      if (triangleBtn) {
        triangleBtn.addEventListener('click', this.triangleClick);
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', this.nextClick);
      }
      recommendWords.forEach((word) => {
        // eslint-disable-next-line no-unused-vars
        word.addEventListener('click', (e) => {
          if (this.canSelect) {
          // function check() {
            word.classList.add('recommend-selected');
            this.canSelect = false;
          } else {
            recommendWords.forEach((w) => {
              w.classList.remove('recommend-selected');
            });
            word.classList.add('recommend-selected');
            this.canSelect = false;
          }
          // }
          // this.wordDelay = setTimeout(check, 1000);
          this.touchmode = 'word';
          this.wordSelected = word.innerText;
        }, true);

        // eslint-disable-next-line no-unused-vars
        // word.addEventListener('touchend', (e) => {
        //  clearTimeout(this.wordDelay);
        //  word.classList.remove('recommend-selected');
        // });
      });

      this.nodes.push({
        id: 1, label: '흥부와 놀부', T: this.canvas.height / 2 + 50, B: this.canvas.height / 2 - 50, L: this.canvas.width / 2 - 50, R: this.canvas.width / 2 + 50,
      });
      this.initSetting();
    };
  },

  methods: {
    initSetting() {
      this.ctx[0].scale(1, 1);
      this.ctx[0].strokeStyle = 'black';
      this.ctx[0].fillStyle = 'black';

      this.brushSize = 2.5;
      this.ctx[0].lineWidth = 2.5;

      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].arc(this.canvas.width / 2 - this.padding.x, this.canvas.height / 2 - this.padding.y, 50, 0, Math.PI * 2);
      this.ctx[0].stroke();
      const bookText = '흥부와 놀부';
      this.ctx[0].font = '10px Calibri';
      const labelLength = bookText.length;
      // eslint-disable-next-line max-len
      this.ctx[0].fillText(bookText, this.canvas.width / 2 - labelLength * 4 - this.padding.x, this.canvas.height / 2 - this.padding.y);
    },

    startDraw(event) {
      if (this.touchmode === 'pen') {
        this.ctx[0].beginPath();
        this.pos.drawable = true;
        const coors = this.getPosition(event);
        this.pos.X = coors.X;
        this.pos.Y = coors.Y;
        this.ctx[0].moveTo(this.pos.X, this.pos.Y);
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
        this.pos.drawable = true;
        const coors = this.getPosition(event);
        this.ctx[0].moveTo(this.pos.X, this.pos.Y);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
      } else if (this.touchmode === 'circle') {
        this.pos.drawable = true;
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
        this.maxPos.T = coors.Y;
        this.maxPos.B = coors.Y;
        this.maxPos.L = coors.X;
        this.maxPos.R = coors.X;
      } else if (this.touchmode === 'rectangle') {
        this.pos.drawable = true;
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
        this.maxPos.T = coors.Y;
        this.maxPos.B = coors.Y;
        this.maxPos.L = coors.X;
        this.maxPos.R = coors.X;
      } else if (this.touchmode === 'triangle') {
        this.pos.drawable = true;
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
        this.maxPos.T = coors.Y;
        this.maxPos.B = coors.Y;
        this.maxPos.L = coors.X;
        this.maxPos.R = coors.X;
      }
    },

    draw(event) {
      if (this.touchmode === 'pen') {
        const coors = this.getPosition(event);
        console.log(coors.X, coors.Y);
        this.ctx[0].lineTo(coors.X, coors.Y);
        this.pos.X = coors.X;
        this.pos.Y = coors.Y;
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
        this.pos.X = coors.X;
        this.pos.Y = coors.Y;
        const changeX = this.startPos.x - coors.X;
        const changeY = this.startPos.y - coors.Y;

        let i = 0;
        this.ctx[0].clearRect(0, 0, 100000, 100000);

        this.ctx[0].scale(this.scale, this.scale);
        this.ctx[0].strokeStyle = 'black';
        this.ctx[0].fillStyle = 'black';

        this.brushSize = 2.5;
        this.ctx[0].lineWidth = 2.5;

        this.ctx[0].beginPath();
        // eslint-disable-next-line max-len
        this.ctx[0].arc(this.canvas.width / 2 - changeX - this.padding.x, this.canvas.height / 2 - changeY - this.padding.y, 50, 0, Math.PI * 2);
        this.ctx[0].stroke();
        const bookText = '흥부와 놀부';
        this.ctx[0].font = '10px Calibri';
        const labelLength = bookText.length;
        // eslint-disable-next-line max-len
        this.ctx[0].fillText(bookText, this.canvas.width / 2 - labelLength * 4 - changeX - this.padding.x, this.canvas.height / 2 - changeY - this.padding.y);

        // eslint-disable-next-line no-plusplus
        for (i; i < this.commandHistory.length; i++) {
          const point = this.commandHistory[i];

          this.ctx[0].lineWidth = point.size;
          this.brushSize = point.size;
          this.ctx[0].strokeStyle = point.color;

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
          } else if (point.mode === 'circle') {
            this.ctx[0].beginPath();
            this.ctx[0].lineWidth = point.size;
            // eslint-disable-next-line max-len
            this.ctx[0].arc(point.x - changeX - this.padding.x, point.y - changeY - this.padding.y, point.r, 0, Math.PI * 2);
            this.ctx[0].stroke();
          } else if (point.mode === 'rectangle') {
            this.ctx[0].beginPath();
            this.ctx[0].lineWidth = point.size;
            // eslint-disable-next-line max-len
            this.ctx[0].rect(point.x - changeX - this.padding.x, point.y - changeY - this.padding.y, point.pix1, point.pix2);
            this.ctx[0].stroke();
          } else if (point.mode === 'triangle') {
            this.ctx[0].beginPath();
            this.ctx[0].lineWidth = point.size;
            // eslint-disable-next-line max-len
            this.ctx[0].moveTo((point.x - changeX - this.padding.x + point.x2 - changeX - this.padding.x) / 2, point.y - changeY - this.padding.y);
            // eslint-disable-next-line max-len
            this.ctx[0].lineTo(point.x - changeX - this.padding.x, point.y2 - changeY - this.padding.y);
            // eslint-disable-next-line max-len
            this.ctx[0].lineTo(point.x2 - changeX - this.padding.x, point.y2 - changeY - this.padding.y);
            // eslint-disable-next-line max-len
            this.ctx[0].closePath();
            this.ctx[0].stroke();
          }
        }
        this.ctx[0].stroke();
      } else if (this.touchmode === 'circle') {
        const lineW = this.brushSize;
        this.ctx[0].clearRect(0, 0, 100000, 100000);
        this.reDrawAll();
        const coors = this.getPosition(event);

        const circle = {
          X: Math.round((this.startPos.x + coors.X) / 2),
          Y: Math.round((this.startPos.y + coors.Y) / 2),
          R: Math.round(Math.abs(coors.Y - this.startPos.y) / 2),
        };

        this.ctx[0].beginPath();
        this.ctx[0].lineWidth = lineW;
        this.brushSize = lineW;
        this.ctx[0].strokeStyle = this.strokeColor;
        this.ctx[0].arc(circle.X, circle.Y, circle.R, 0, Math.PI * 2);
        this.ctx[0].stroke();
      } else if (this.touchmode === 'rectangle') {
        const lineW = this.brushSize;
        this.ctx[0].clearRect(0, 0, 100000, 100000);
        this.reDrawAll();
        const coors = this.getPosition(event);

        this.ctx[0].beginPath();
        this.ctx[0].lineWidth = lineW;
        this.brushSize = lineW;
        this.ctx[0].strokeStyle = this.strokeColor;
        // eslint-disable-next-line max-len
        this.ctx[0].rect(this.startPos.x, this.startPos.y, coors.X - this.startPos.x, coors.Y - this.startPos.y);
        this.ctx[0].stroke();
      } else if (this.touchmode === 'triangle') {
        const lineW = this.brushSize;
        this.ctx[0].clearRect(0, 0, 100000, 100000);
        this.reDrawAll();
        const coors = this.getPosition(event);

        this.ctx[0].beginPath();
        this.ctx[0].lineWidth = lineW;
        this.brushSize = lineW;
        this.ctx[0].strokeStyle = this.strokeColor;
        // eslint-disable-next-line max-len
        this.ctx[0].moveTo((coors.X + this.startPos.x) / 2, this.startPos.y);
        this.ctx[0].lineTo(this.startPos.x, coors.Y);
        this.ctx[0].lineTo(coors.X, coors.Y);
        this.ctx[0].lineTo((coors.X + this.startPos.x) / 2, this.startPos.y);
        this.ctx[0].stroke();
      }
    },

    finishDraw(event) {
      if (this.touchmode === 'pen') {
        this.pos.drawable = false;
        this.pos.X = -1;
        this.pos.Y = -1;

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
      } else if (this.touchmode === 'circle') {
        const coors = this.getPosition(event);
        if (this.maxPos.T < coors.Y) this.maxPos.T = coors.Y;
        else if (this.maxPos.B > coors.Y) this.maxPos.B = coors.Y;
        if (this.maxPos.R < coors.X) this.maxPos.R = coors.X;
        else if (this.maxPos.L > coors.X) this.maxPos.L = coors.X;

        this.ctx[0].beginPath();
        const circle = {
          X: Math.round((this.startPos.x + coors.X) / 2),
          Y: Math.round((this.startPos.y + coors.Y) / 2),
          R: Math.round(Math.abs(coors.Y - this.startPos.y) / 2),
        };
        this.ctx[0].strokeStyle = this.strokeColor;
        this.ctx[0].lineWidth = this.brushSize;
        this.ctx[0].arc(circle.X, circle.Y, circle.R, 0, Math.PI * 2);
        this.ctx[0].stroke();

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
            this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 15, (this.maxPos.T + this.maxPos.B) / 2);
            this.commandHistory.push({
              x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 15 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
            });
          } else {
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 40, (this.maxPos.T + this.maxPos.B) / 2);
            this.commandHistory.push({
              x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 40 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
            });
          }
          this.ctx[0].strokeStyle = this.strokeColor;
          const newid = new Date().getTime();
          this.nodes.push({
          // eslint-disable-next-line max-len
            id: newid, label: inputLabel, T: this.maxPos.T + this.padding.y, B: this.maxPos.B + this.padding.y, L: this.maxPos.L + this.padding.x, R: this.maxPos.R + this.padding.x,
          });
          this.commandHistory.push({
            x: circle.X + this.padding.x, y: circle.Y + this.padding.y, r: circle.R, size: this.brushSize, color: this.strokeColor, mode: 'circle', text: 'node',
          });
        } else {
          this.commandHistory.push({
            x: circle.X + this.padding.x, y: circle.Y + this.padding.y, r: circle.R, size: this.brushSize, color: this.strokeColor, mode: 'circle', text: 'empty',
          });
        }
      } else if (this.touchmode === 'rectangle') {
        const coors = this.getPosition(event);
        if (this.maxPos.T < coors.Y) this.maxPos.T = coors.Y;
        else if (this.maxPos.B > coors.Y) this.maxPos.B = coors.Y;
        if (this.maxPos.R < coors.X) this.maxPos.R = coors.X;
        else if (this.maxPos.L > coors.X) this.maxPos.L = coors.X;

        this.ctx[0].beginPath();
        this.ctx[0].strokeStyle = this.strokeColor;
        this.ctx[0].lineWidth = this.brushSize;
        // eslint-disable-next-line max-len
        this.ctx[0].rect(this.startPos.x, this.startPos.y, coors.X - this.startPos.x, coors.Y - this.startPos.y);
        this.ctx[0].stroke();

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
            this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 15, (this.maxPos.T + this.maxPos.B) / 2);
            this.commandHistory.push({
              x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 15 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
            });
          } else {
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 40, (this.maxPos.T + this.maxPos.B) / 2);
            this.commandHistory.push({
              x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 40 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
            });
          }
          this.ctx[0].strokeStyle = this.strokeColor;
          const newid = new Date().getTime();
          this.nodes.push({
          // eslint-disable-next-line max-len
            id: newid, label: inputLabel, T: this.maxPos.T + this.padding.y, B: this.maxPos.B + this.padding.y, L: this.maxPos.L + this.padding.x, R: this.maxPos.R + this.padding.x,
          });
          this.commandHistory.push({
            x: this.startPos.x + this.padding.x, y: this.startPos.y + this.padding.y, pix1: coors.X + this.startPos.x, pix2: coors.Y + this.startPos.y, size: this.brushSize, color: this.strokeColor, mode: 'rectangle', text: 'node',
          });
        } else {
          this.commandHistory.push({
            x: this.startPos.x + this.padding.x, y: this.startPos.y + this.padding.y, pix1: coors.X + this.startPos.x, pix2: coors.Y + this.startPos.y, size: this.brushSize, color: this.strokeColor, mode: 'rectangle', text: 'empty',
          });
        }
      } else if (this.touchmode === 'triangle') {
        const coors = this.getPosition(event);
        if (this.maxPos.T < coors.Y) this.maxPos.T = coors.Y;
        else if (this.maxPos.B > coors.Y) this.maxPos.B = coors.Y;
        if (this.maxPos.R < coors.X) this.maxPos.R = coors.X;
        else if (this.maxPos.L > coors.X) this.maxPos.L = coors.X;

        this.ctx[0].beginPath();
        this.ctx[0].strokeStyle = this.strokeColor;
        this.ctx[0].lineWidth = this.brushSize;
        // eslint-disable-next-line max-len
        this.ctx[0].moveTo((coors.X + this.startPos.x) / 2, this.startPos.y);
        this.ctx[0].lineTo(this.startPos.x, coors.Y);
        this.ctx[0].lineTo(coors.X, coors.Y);
        this.ctx[0].lineTo((coors.X + this.startPos.x) / 2, this.startPos.y);
        this.ctx[0].stroke();

        const inputLabel = prompt('단어를 입력하세요.');
        if (this.maxPos.R - this.maxPos.L < 100) {
          this.ctx[0].font = '10px Calibri';
        } else if (this.maxPos.R - this.maxPos.L >= 100 && this.maxPos.R - this.maxPos.L < 800) {
          this.ctx[0].font = '30px Calibri';
        } else if (this.maxPos.R - this.maxPos.L >= 800 && this.maxPos.R - this.maxPos.L < 1500) {
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
            this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 15, (this.maxPos.T + this.maxPos.B) / 2);
            this.commandHistory.push({
              x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 15 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
            });
          } else {
            // eslint-disable-next-line max-len
            this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 40, (this.maxPos.T + this.maxPos.B) / 2);
            this.commandHistory.push({
              x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 40 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
            });
          }
          this.ctx[0].strokeStyle = this.strokeColor;
          const newid = new Date().getTime();
          this.nodes.push({
          // eslint-disable-next-line max-len
            id: newid, label: inputLabel, T: this.maxPos.T + this.padding.y, B: this.maxPos.B + this.padding.y, L: this.maxPos.L + this.padding.x, R: this.maxPos.R + this.padding.x,
          });
          this.commandHistory.push({
            x: this.startPos.x + this.padding.x, y: this.startPos.y + this.padding.y, x2: coors.X + this.padding.x, y2: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'triangle', text: 'node',
          });
        } else {
          this.commandHistory.push({
            x: this.startPos.x + this.padding.x, y: this.startPos.y + this.padding.y, x2: coors.X + this.padding.x, y2: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'triangle', text: 'empty',
          });
        }
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

    getPosition(event) {
      const touches = event.changedTouches;
      const x = (touches[0].clientX - this.canvas.offsetLeft);
      const y = (touches[0].clientY - this.canvas.offsetTop);
      return { X: x / this.scale, Y: y / this.scale };
    },

    handleColorClick(event) {
      const color = event.target.style.backgroundColor;
      this.strokeColor = color;
      this.ctx[0].strokeStyle = color;
      this.ctx[0].fillStyle = color;
    },

    handleRange1() {
      this.brushSize = 2.5;
      this.ctx[0].lineWidth = 2.5;
      console.log('brush size : ', this.brushSize);
    },
    handleRange2() {
      this.brushSize = 6;
      this.ctx[0].lineWidth = 6;
      console.log('brush size : ', this.brushSize);
    },
    handleRange3() {
      this.brushSize = 10;
      this.ctx[0].lineWidth = 10;
      console.log('brush size : ', this.brushSize);
    },

    handlePenClick() {
      this.touchmode = 'pen';
    },

    handleResetClick() {
      this.ctx[0].clearRect(0, 0, 100000, 100000);
      this.nodes.length = 1;
      this.edges.length = 0;
      this.commandHistory.length = 0;
      this.padding.x = 0;
      this.padding.y = 0;
      this.initSetting();
    },

    undoClick() {
      // eslint-disable-next-line no-var
      var lastPoint = this.commandHistory.pop();
      if (this.commandHistory.length === 0) {
        this.handleResetClick();
        return;
      }
      if (lastPoint.mode === 'edge') {
        const edgeId = lastPoint.id;
        const idx = this.edges.findIndex((item) => item.id === edgeId);
        this.edges.splice(idx, 1);
        while (lastPoint.mode !== 'lineStart') {
          lastPoint = this.commandHistory.pop();
        }
      } else if (lastPoint.mode === 'node') {
        const nodeId = lastPoint.id;
        const idx = this.nodes.findIndex((item) => item.id === nodeId);
        this.nodes.splice(idx, 1);
        while (lastPoint.mode !== 'lineStart') {
          lastPoint = this.commandHistory.pop();
        }
      } else if (lastPoint.mode === 'lineFinish') {
        while (lastPoint.mode !== 'lineStart') {
          lastPoint = this.commandHistory.pop();
        }
      } else if (lastPoint.mode === 'circle') {
        if (lastPoint.text === 'node') {
          const nodeId = lastPoint.id;
          const idx = this.nodes.findIndex((item) => item.id === nodeId);
          this.nodes.splice(idx, 1);
          lastPoint = this.commandHistory.pop();
        }
      } else if (lastPoint.mode === 'rectangle') {
        if (lastPoint.text === 'node') {
          const nodeId = lastPoint.id;
          const idx = this.nodes.findIndex((item) => item.id === nodeId);
          this.nodes.splice(idx, 1);
          lastPoint = this.commandHistory.pop();
        }
      } else if (lastPoint.mode === 'triangle') {
        if (lastPoint.text === 'node') {
          const nodeId = lastPoint.id;
          const idx = this.nodes.findIndex((item) => item.id === nodeId);
          this.nodes.splice(idx, 1);
          lastPoint = this.commandHistory.pop();
        }
      }

      this.reDrawAll();
    },

    reDrawAll() {
      // eslint-disable-next-line no-var
      var i = 0;
      this.ctx[0].clearRect(0, 0, 100000, 100000);

      this.initSetting();

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
        } else if (point.mode === 'circle') {
          this.ctx[0].beginPath();
          this.ctx[0].lineWidth = point.size;
          // eslint-disable-next-line max-len
          this.ctx[0].arc(point.x - this.padding.x, point.y - this.padding.y, point.r, 0, Math.PI * 2);
          this.ctx[0].stroke();
        } else if (point.mode === 'rectangle') {
          this.ctx[0].beginPath();
          this.ctx[0].lineWidth = point.size;
          // eslint-disable-next-line max-len
          this.ctx[0].rect(point.x - this.padding.x, point.y - this.padding.y, point.pix1, point.pix2);
          this.ctx[0].stroke();
        } else if (point.mode === 'triangle') {
          this.ctx[0].beginPath();
          this.ctx[0].lineWidth = point.size;
          // eslint-disable-next-line max-len
          this.ctx[0].moveTo((point.x - this.padding.x + point.x2 - this.padding.x) / 2, point.y - this.padding.y);
          this.ctx[0].lineTo(point.x - this.padding.x, point.y2 - this.padding.y);
          this.ctx[0].lineTo(point.x2 - this.padding.x, point.y2 - this.padding.y);
          // eslint-disable-next-line max-len
          this.ctx[0].closePath();
          this.ctx[0].stroke();
        }
      }
      this.ctx[0].stroke();
    },

    zoomIn() {
      this.scale = Math.min(this.scale + 0.1, 3);
      this.ctx[0].scale(this.scale, this.scale);
      this.scale = 1;
      this.reDrawAll();
    },
    zoomOut() {
      this.scale = Math.max(this.scale - 0.1, 0.1);
      this.ctx[0].scale(this.scale, this.scale);
      this.scale = 1;
      this.reDrawAll();
    },

    dragClick() {
      this.touchmode = 'drag';
    },

    paintClick() {
    },

    saveClick() {
      const imageName = prompt('이미지 이름을 입력하세요');
      if (imageName != null) {
        this.scale = 1;
        this.ctx[0].scale(this.scale, this.scale);
        const clientX = this.canvas.clientWidth;
        const clientY = this.canvas.clientHeight;
        let r = this.commandHistory[0].x;
        let l = this.commandHistory[0].x;
        let t = this.commandHistory[0].y;
        let b = this.commandHistory[0].y;
        let i;
        // eslint-disable-next-line no-plusplus
        for (i = 0; i < this.commandHistory.length; i++) {
          if (this.commandHistory[i].x > r) r = this.commandHistory[i].x;
          else if (this.commandHistory[i].x < l) l = this.commandHistory[i].x;
          if (this.commandHistory[i].y > t) t = this.commandHistory[i].y;
          else if (this.commandHistory[i].y < b) b = this.commandHistory[i].y;
        }
        const wholeX = r - l;
        const wholeY = t - b;
        const ratioX = clientX / wholeX;
        const ratioY = clientY / wholeY;
        const ratio = Math.min(ratioX, ratioY);
        this.padding.x = (clientX / 2) * ratio - clientX / 2;
        this.padding.y = (clientY / 2) * ratio - clientY / 2;
        this.scale = ratio;
        this.ctx[0].scale(this.scale, this.scale);
        this.scale = 1;
        this.reDrawAll();
      }
    },

    circleClick() {
      this.touchmode = 'circle';
    },

    rectangleClick() {
      this.touchmode = 'rectangle';
    },

    triangleClick() {
      this.touchmode = 'triangle';
    },

    nextClick() {
      let i = 0;
      // eslint-disable-next-line no-plusplus
      for (i = 0; i < 4; i++) {
        this.wholeWords.shift();
      }
      // eslint-disable-next-line no-plusplus
      for (i = 0; i < 4; i++) {
        this.words.shift();
        this.words.push(this.wholeWords[i]);
      }
    },
  },
};
</script>

<style scoped>
body {
  background-color: #e6e6fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
}

.outFrame {
  border: 1px solid black;
  width: 95%;
  height: 100%;
  border-radius: 15px;
}

.tools {
  width: 18%;
  height: 85%;
  background-color: white;
  border-radius: 15px;
  display: inline-block;
  box-shadow: 6px 6px 5px grey;
  margin-left: 1%;
  margin-right: 1%;
}

.canvas {
  width: 78%;
  height: 83%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 6px 6px 5px grey;
  margin: 1%;
  margin-left: 0.5%;
}

#jsColors {
  border-bottom: 3px solid black;
  margin-bottom: 12px;
}

.controls__colors .controls__color {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin: 12px;
  box-shadow: 3px 3px 5px grey;
  display: inline-block;
}

.jscolor {
  color: transparent;
  font-size: 0;
  line-height: 0;

  border-radius: 25px;
  border-width: 0px;
  margin-right: 5px;
  cursor: pointer;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls .controls__btns {
  margin-top: 20px;
  margin-bottom: 30px;
}

.controls__btns button:active {
  transform: scale(0.98);
}

.controls__btns button {
  all: unset;
  cursor: pointer;
  background-color: white;
  padding: 5px 0px;
  width: 80px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 3px 3px 3px grey;
  border: 2px solid rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
}

.controls .controls__range {
  margin-top: 20px;
}

.figures {
  border-bottom: 3px solid black;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.figure {
  width: 70px;
  height: 70px;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  margin: 3px;
  margin-bottom: 10px;
  display: inline-block;
  box-shadow: 3px 3px 3px grey;
}
#circle {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: black;
  margin: 9px;
}
#rectangle {
  width: 45px;
  height: 45px;
  background-color: black;
  margin: 12px;
}
#triangle {
  margin-left: 5px;
  margin-top: 10px;
  width: 0px;
  height: 0px;
  border-top: 35px solid none;
  border-bottom: 45px solid black;
  border-right: 30px solid transparent;
  border-left: 30px solid  transparent;
}

.lines {
  border-bottom: 3px solid black;
  margin-bottom: 12px;
}

.line1, .line2, .line3 {
  width: 90%;
  height: 30px;
  background-color: white;
  border: 1px solid black;
  margin-left: 5%;
  margin-bottom: 8%;
  border-radius: 5px;
  box-shadow: 3px 3px 3px grey;
}
#line11 {
  margin-top: 6%;
  margin-left: 10%;
  margin-right: 10%;
  border-bottom: 2px solid black;
}
#line22 {
  margin-top: 6%;
  margin-left: 10%;
  margin-right: 10%;
  border-bottom: 5px solid black;
}
#line33 {
  margin-top: 5%;
  margin-left: 10%;
  margin-right: 10%;
  border-bottom: 8px solid black;
}

.materials1, .materials2 {
  border-bottom: 3px solid black;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}
#pen {
  width: 60px;
  height: 60px;
  margin: 8px;
  margin-left: 20px;
  margin-bottom: 22px;
}
#drag {
  width: 60px;
  height: 60px;
  margin: 8px;
  margin-right: 20px;
  margin-bottom: 22px;
}
#zoomin {
  width: 60px;
  height: 60px;
  margin: 8px;
  margin-right: 20px;
  margin-bottom: 18px;
}
#zoomout {
  width: 60px;
  height: 60px;
  margin: 8px;
  margin-left: 20px;
  margin-bottom: 18px;
}

.kits {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}
#undo {
  width: 50px;
  height: 50px;
  margin: 13px;
}
#reset {
  width: 50px;
  height: 50px;
  margin: 13px;
}
#save {
  width: 50px;
  height: 50px;
  margin: 13px;
}

#aiImg {
  width: 100px;
  height: 100px;
  margin-left: 5%;
}

.recommends {
  display: flex;
  justify-content: center;
  margin: 1%;
}

#wordBalloon {
  width: 75%;
  height: 100px;
  background:pink;
  border-radius: 10px;
  margin-left: 10%;
  display: inline-block;
  padding-top: 1.5em;
}

#wordBalloon:after {
  border-top:0px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid pink;
  content:"";
  position:absolute;
  top:-10px;
  left:200px;
}

.recommend {
  display: inline;
  font-size: 2em;
  margin: 1em;
  border-radius: 10px;
  padding: 0.5em;
  box-shadow: 3px 3px 3px grey;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.recommend-selected {
  border: 1px solid green;
}

#nextBtn {
  border: 1px solid green;
  border-radius: 10px;
  color: white;
  background-color: green;
  font-size: 1.5em;
  padding: 0.5em;
  box-shadow: 3px 3px 3px grey;
  margin-left: 20%;
}
</style>
