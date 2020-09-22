<template>
  <body>
    <canvas
      id="jsCanvas"
      class="canvas"
    />
    <div class="controls">
      <div class="controls__range">
        <input
          id="jsRange"
          type="range"
          name=""
          min="0.1"
          max="10.0"
          value="5.0"
          step="0.1"
        >
      </div>
      <div class="controls__btns">
        <button id="jsPen">연필</button>
        <button id="jsSave">저장</button>
        <button id="jsReset">리셋</button>
        <button id="jsUndo">undo</button>
      </div>
      <div
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
      commandHistory: [],
      brushSize: 2.5,
      toggle: true,
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
      this.canvas.addEventListener('mousewheel', (e) => {
        if (e.deltaY < 0) this.scale = Math.min(this.scale + 0.1, 3);
        else this.scale = Math.max(this.scale - 0.1, 0.1);
        console.log(this.scale);
        this.reDraw();
      });

      const colors = document.querySelectorAll('.jsColor');
      const range = document.querySelector('#jsRange');
      range.value = 2.5;
      const resetBtn = document.querySelector('#jsReset');
      const undoBtn = document.querySelector('#jsUndo');
      const penBtn = document.querySelector('#jsPen');
      this.ctx[0].lineWidth = 2.5;
      colors.forEach((color) => {
        color.addEventListener('click', this.handleColorClick);
      });
      if (range) {
        range.addEventListener('input', this.handleRangeChange);
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

      this.nodes.push({
        id: 1, label: '흥부와 놀부', T: this.canvas.height + 50, B: this.canvas.height + 50, L: this.canvas.width / 2 - 50, R: this.canvas.width / 2 + 50,
      });

      this.initSetting();
    };
  },

  methods: {
    initSetting() {
      this.ctx[0].scale(1, 1);
      this.ctx[0].strokeStyle = 'black';
      this.ctx[0].fillStyle = 'black';

      const range = document.querySelector('#jsRange');
      range.value = 2.5;
      this.brushSize = 2.5;
      this.ctx[0].lineWidth = 2.5;

      this.ctx[0].beginPath();
      this.ctx[0].arc(this.canvas.width / 2, this.canvas.height / 2, 50, 0, Math.PI * 2);
      this.ctx[0].stroke();
      const bookText = '흥부와 놀부';
      this.ctx[0].font = '10px Calibri';
      const labelLength = bookText.length;
      // eslint-disable-next-line max-len
      this.ctx[0].fillText(bookText, this.canvas.width / 2 - labelLength * 4, this.canvas.height / 2);
    },

    reDraw() {
      this.ctx.shift();
      this.canvas = document.getElementById('canvas');
      this.ctx.push(this.canvas.getContext('2d'));

      this.ctx[0].save();
      this.ctx[0].clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx[0].setTransform(1, 0, 0, 1, 0, 0);
      // eslint-disable-next-line max-len
      this.ctx[0].translate(-((this.canvas.clientWidth * this.scale - this.canvas.clientWidth) / 2), -((this.canvas.clientHeight * this.scale - this.canvas.clientHeight) / 2));
      this.ctx[0].scale(this.scale, this.scale);
      this.ctx[0].restore();
    },

    startDraw(event) {
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
        x: coors.X, y: coors.Y, size: this.brushSize, color: this.strokeColor, mode: 'lineStart',
      });
    },

    draw(event) {
      const coors = this.getPosition(event);
      this.ctx[0].lineTo(coors.X, coors.Y);
      this.pos.X = coors.X;
      this.pos.Y = coors.Y;
      this.ctx[0].stroke();
      if (coors.X > this.maxPos.R) this.maxPos.R = coors.X;
      else if (coors.X < this.maxPos.L) this.maxPos.L = coors.X;
      if (coors.Y > this.maxPos.T) this.maxPos.T = coors.Y;
      else if (coors.Y < this.maxPos.B) this.maxPos.B = coors.Y;
      this.commandHistory.push({
        x: coors.X, y: coors.Y, size: this.brushSize, color: this.strokeColor, mode: 'line',
      });
    },

    finishDraw(event) {
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
          if ((this.nodes[i].T + 100 > this.startPos.y && this.nodes[i].B - 100 < this.startPos.y) && (this.nodes[i].L - 100 < this.startPos.x && this.nodes[i].R + 100 > this.startPos.x)) {
            edgeFrom = this.nodes[i].id;
          }
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
          if ((this.nodes[i].T + 100 > coors.Y && this.nodes[i].B - 100 < coors.Y) && (this.nodes[i].L - 100 < coors.X && this.nodes[i].R + 100 > coors.X)) {
            edgeTo = this.nodes[i].id;
          }
        }

        if (edgeFrom === -1 || edgeTo === -1) {
          this.commandHistory.push({
            x: coors.X, y: coors.Y, size: this.brushSize, color: this.strokeColor, mode: 'lineFinish',
          });
        } else {
          const newid = new Date().getTime();
          this.edges.push({ id: newid, from: edgeFrom, to: edgeTo });
          this.commandHistory.push({
            x: coors.X, y: coors.Y, size: this.brushSize, color: this.strokeColor, mode: 'edge', id: newid,
          });
        }
      } else {
        const inputLabel = prompt('단어를 입력하세요.');
        this.ctx[0].font = '10px Calibri';
        const labelLength = inputLabel.length;
        this.ctx[0].strokeStyle = 'black';
        this.ctx[0].fillStyle = 'black';
        // eslint-disable-next-line max-len
        this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 5, (this.maxPos.T + this.maxPos.B) / 2);
        this.commandHistory.push({
          x: (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 5, y: (this.maxPos.T + this.maxPos.B) / 2, color: 'black', mode: 'text', text: inputLabel,
        });
        this.ctx[0].strokeStyle = this.strokeColor;
        const newid = new Date().getTime();
        this.nodes.push({
          // eslint-disable-next-line max-len
          id: newid, label: inputLabel, T: this.maxPos.T, B: this.maxPos.B, L: this.maxPos.L, R: this.maxPos.R,
        });
        this.commandHistory.push({
          x: coors.X, y: coors.Y, size: this.brushSize, color: this.strokeColor, mode: 'node', id: newid,
        });
      }
      this.startPos.x = -1;
      this.startPos.y = -1;
      this.maxPos.T = -1;
      this.maxPos.B = -1;
      this.maxPos.L = -1;
      this.maxPos.R = -1;
      console.log('nodes: ', this.nodes);
      console.log('edges: ', this.edges);
    },

    getPosition(event) {
      const touches = event.changedTouches;
      const x = (touches[0].clientX - this.canvas.offsetLeft);
      const y = (touches[0].clientY - this.canvas.offsetTop);
      return { X: x, Y: y };
    },

    handleColorClick(event) {
      const color = event.target.style.backgroundColor;
      this.strokeColor = color;
      this.ctx[0].strokeStyle = color;
      this.ctx[0].fillStyle = color;
    },

    handleRangeChange(event) {
      const size = event.target.value;
      this.ctx[0].lineWidth = size;
      this.brushSize = size;
    },

    handlePenClick() {
    },

    handleResetClick() {
      this.ctx[0].clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.nodes.length = 1;
      this.edges.length = 0;
      this.commandHistory.length = 0;
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
      }

      this.reDrawAll();
    },

    reDrawAll() {
      // eslint-disable-next-line no-var
      var i = 0;
      this.ctx[0].clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.initSetting();

      // eslint-disable-next-line no-plusplus
      for (i; i < this.commandHistory.length; i++) {
        const point = this.commandHistory[i];

        this.ctx[0].lineWidth = point.size;
        this.ctx[0].strokeStyle = point.color;

        if (point.mode === 'lineStart') {
          this.ctx[0].beginPath();
          this.ctx[0].moveTo(point.x, point.y);
        } else if (point.mode === 'line') {
          this.ctx[0].lineTo(point.x, point.y);
        } else if (point.mode === 'node' || point.mode === 'edge') {
          this.ctx[0].stroke();
        } else if (point.mode === 'text') {
          this.ctx[0].fillText(point.text, point.x, point.y);
        } else if (point.mode === 'lineFinish') {
          this.ctx[0].stroke();
        }
      }
      this.ctx[0].stroke();
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

.canvas {
  width: 80%;
  height: 80%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 6px 6px 5px grey;
}

.controls .controls__colors {
  display: flex;
}
.controls__colors .controls__color {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 5px;
  cursor: pointer;
  box-shadow: 3px 3px 5px grey;
}

.jscolor {
  color: transparent;
  font-size: 0;
  line-height: 0;

  width: 50px;
  height: 50px;
  border-radius: 25px;
  border-width: 0px;
  margin-right: 5px;
  cursor: pointer;
  box-shadow: 3px 3px 5px grey;
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
</style>
