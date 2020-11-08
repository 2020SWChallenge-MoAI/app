<template>
  <sub-layout title="그림그리기" tooltip="그림그리기 설명">
    <template v-slot:left>
      <left-menu-button icon="mdi-check-bold" text="완료" id="drawing-finish" />
      <left-menu-button icon="mdi-pencil" text="연필" id="drawing-pen" />
      <left-menu-button icon="mdi-eraser" text="지우개" id="drawing-eraser" />
      <left-menu-button icon="mdi-backup-restore" text="초기화" id="drawing-rest" />
      <!-- 툴바 -->
      <div v-show="showToolBar" id="drawing-tool-triangle" />
      <div v-show="showToolBar" id="drawing-tool-bar">
        <center><div
          id="jsColors"
          class="controls__colors"
        >
          <div
            class="controls__color jsColor"
            style="background-color: #2c2c2c; border: 3px solid rgba(200, 50, 50, 0.6);"
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

        <div class="lines">
          <div class="line" id="width2" style="border: 3px solid rgba(200, 50, 50, 0.6);">
            <hr id="line1">
          </div>
          <div class="line" id="width5">
            <hr id="line2">
          </div>
          <div class="line" id="width8">
            <hr id="line3">
          </div>
        </div>

      </div>
    </template>
    <!-- TODO: Implementation -->

    <!-- 캔버스 -->
    <canvas id="drawing-canvas" />

    <!-- 줄노트 -->
    <div id="drawing-text">
      {{ mainSentence }}
    </div>

  </sub-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      canvas: document.getElementById(''),
      ctx: [],

      mainSentence: this.$route.params.sentence,
      showToolBar: false,
      strokeColor: 'black',
      scale: 1,
    };
  },

  mounted() {
    this.canvas = document.getElementById('drawing-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.ctx[0].scale(1, 1);
    this.ctx[0].scale(0.1, 0.1);
    this.ctx[0].scale(1, 1);
    this.scale = 0.1;
    this.ctx[0].lineWidth = 20;
    this.ctx[0].strokeStyle = '#2c2c2c';
    this.strokeColor = '#2c2c2c';

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

    const colors = document.querySelectorAll('.jsColor');
    colors.forEach((color) => {
      color.addEventListener('click', this.colorClicked);
    });

    const lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
      line.addEventListener('click', this.lineClicked);
    });

    const pen = document.querySelector('#drawing-pen');
    if (pen) {
      pen.addEventListener('click', this.penBtnClicked);
    }

    const eraser = document.querySelector('#drawing-eraser');
    if (eraser) {
      eraser.addEventListener('click', this.eraserBtnClicked);
    }

    const finish = document.querySelector('#drawing-finish');
    if (finish) {
      finish.addEventListener('click', this.finishBtnClicked);
    }

    const reset = document.querySelector('#drawing-rest');
    if (reset) {
      reset.addEventListener('click', this.resetBtnClicked);
    }
  },

  methods: {
    startDraw(event) {
      this.showToolBar = false;
      this.ctx[0].beginPath();
      const coors = this.getPosition(event);
      this.ctx[0].moveTo(coors.X, coors.Y);
    },

    draw(event) {
      const coors = this.getPosition(event);
      this.ctx[0].lineTo(coors.X, coors.Y);
      this.ctx[0].stroke();
    },

    finishDraw(event) {
      const coors = this.getPosition(event);
      this.ctx[0].lineTo(coors.X, coors.Y);
      this.ctx[0].stroke();
    },

    getPosition(event) {
      const touches = event.changedTouches;
      const x = (touches[0].clientX);
      const y = (touches[0].clientY);
      const bound = this.canvas.getBoundingClientRect();
      return { X: (x - bound.left) / this.scale, Y: (y - bound.top) / this.scale };
    },

    colorClicked(event) {
      this.colorBtnStyleClear();
      const color = event.target;
      color.style.border = '3px solid rgba(200, 50, 50, 0.6)';
      this.ctx[0].strokeStyle = color.style.backgroundColor;
      this.strokeColor = color.style.backgroundColor;
    },

    colorBtnStyleClear() {
      const colors = document.querySelectorAll('.jsColor');
      colors.forEach((color) => {
        const c = color;
        c.style.border = '3px solid rgba(255, 253, 242, 0.6)';
      });
    },

    lineClicked(event) {
      this.lineBtnStyleClear();
      const line = event.target;
      line.style.border = '3px solid rgba(200, 50, 50, 0.6)';
      if (line.id === 'width2' || line.id === 'line1') this.ctx[0].lineWidth = 20;
      else if (line.id === 'width5' || line.id === 'line2') this.ctx[0].lineWidth = 40;
      else if (line.id === 'width8' || line.id === 'line3') this.ctx[0].lineWidth = 70;
    },

    lineBtnStyleClear() {
      const lines = document.querySelectorAll('.line');
      lines.forEach((line) => {
        const l = line;
        l.style.border = '3px solid rgba(255, 253, 242, 0.6)';
      });
    },

    penBtnClicked() {
      const pen = document.querySelector('#drawing-pen');
      pen.style.backgroundColor = '#83b1b1';
      const eraser = document.querySelector('#drawing-eraser');
      eraser.style.backgroundColor = '#83b1b1';
      this.ctx[0].strokeStyle = this.strokeColor;
      this.showToolBar = !this.showToolBar;
    },

    eraserBtnClicked() {
      this.showToolBar = false;
      const eraser = document.querySelector('#drawing-eraser');
      // eslint-disable-next-line
      if (eraser.style.backgroundColor !== 'rgb(36, 177, 161)') {
        this.ctx[0].strokeStyle = 'white';
        eraser.style.backgroundColor = '#24b1a1';
      } else {
        this.ctx[0].strokeStyle = this.strokeColor;
        eraser.style.backgroundColor = '#83b1b1';
      }
    },

    finishBtnClicked() {
      /* eslint-disable */
      const data = {
        sentence: this.$route.params.sentence,
      };

      axios.post('/api/user/work/save', {
        bid: this.$route.params.bid,
        type: 2,
        thumbnail: this.canvas.toDataURL(),
        content: JSON.stringify(data),
      }).then(() => {
        this.$router.replace({
          name: 'Main',
        });
      }).catch((err) => {
        console.warn('ERROR!!!!: ', err);
      });
      /* eslint-disable */
    },

    resetBtnClicked() {
      this.ctx[0].clearRect(0, 0, this.canvas.width / 0.1, this.canvas.height / 0.1);
    },
  },
};
</script>

<style scoped>
#drawing-canvas {
  width: 95%;
  height: calc(60% - 1vh);
  margin-left: 2.5%;
  margin-top: 2.5%;

  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}

#drawing-text {
  width: 92%;
  height: 20vh;
  margin-left: 4%;
  margin-top: 5%;

  font-size: 3vh;
  color: black;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  line-height: 8vh;

  overflow-y: scroll;
  -ms-overflow-style: none;
}
#drawing-text::-webkit-scrollbar {
  display: none;
}

#drawing-tool-triangle {
  position: absolute;
  top: 17vh;
  left: 6.5vw;
  width: 0px;
  height: 0px;
  border-top: 5vh solid transparent;
  opacity: 0.5;
  border-right: 1.5vw solid gray;
  z-index: 20;
  border-bottom: 5vh solid transparent;

  animation: fadein-t 1s;
  -moz-animation: fadein-t 1s;
  -webkit-animation: fadein-t 1s;
  -o-animation: fadein-t 1s;
}

#drawing-tool-bar {
  position: absolute;
  top: 7vw;
  left: 8vw;
  width: 20vw;
  height: 47vh;
  background: gray;
  opacity: 0.6;
  z-index: 20;

  border-radius: 1vw;
  display: inline-block;

  animation: fadein 1s;
  -moz-animation: fadein 1s;
  -webkit-animation: fadein 1s;
  -o-animation: fadein 1s;
}

#jsColors {
  width: 18vw;
  border-bottom: 3px solid black;
  margin-bottom: 1vh;
}
.controls__colors .controls__color {
  width: 6vh;
  height: 6vh;
  border-radius: 30vw;
  margin: 1vh;
  box-shadow: 3px 3px 5px grey;
  display: inline-block;
  border: 3px solid rgba(255, 253, 242, 0.6);
}
.jscolor {
  color: transparent;
  font-size: 0;
  line-height: 0;
  cursor: pointer;
}

.lines {
  height: 18vh;
  margin-top: 2vh;
}

.line {
  width: 90%;
  height: 4vh;
  background-color: white;
  border: 3px solid rgba(255, 253, 242, 0.6);
  margin-left: 5%;
  margin-bottom: 2vh;
  border-radius: 5px;
  box-shadow: 3px 3px 3px gray;
}
#line1 {
  margin-top: calc(2vh - 2.5px);
  margin-left: 10%;
  margin-right: 10%;
  height: 2px;
  background: black;
  border: none !important;
  pointer-events: none;
}
#line2 {
  margin-top: calc(2vh - 4px);
  margin-left: 10%;
  margin-right: 10%;
  height: 5px;
  background: black;
  border: none !important;
  pointer-events: none;
}
#line3 {
  margin-top: calc(2vh - 5.5px);
  margin-left: 10%;
  margin-right: 10%;
  height: 8px;
  background: black;
  border: none !important;
  pointer-events: none;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}
@-moz-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}
@-webkit-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}
@-o-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}

@keyframes fadein-t {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}
@-moz-keyframes fadein-t {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}
@-webkit-keyframes fadein-t {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}
@-o-keyframes fadein-t {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}
</style>
