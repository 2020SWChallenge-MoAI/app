<template>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      >
      <meta
        http-equiv="X-UA-Compatible"
        content="ie=edge"
      >
      <title>Paint JS</title>
    </head>
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
            min="0.1"
            max="5.0"
            value="2.5"
            step="0.1"
          >
        </div>
        <div class="controls__btns">
          <button id="jsMode">
            Fill
          </button>
          <button id="jsSave">
            Save
          </button>
        </div>
        <div
          id="jsColors"
          class="controls__colors"
        >
          <div class="controls__color jsColor" style="background-color: #2c2c2c"></div>
          <div class="controls__color jsColor" style="background-color: white"></div>
          <div class="controls__color jsColor" style="background-color: #ff3b30"></div>
          <div class="controls__color jsColor" style="background-color: #ff9500"></div>
          <div class="controls__color jsColor" style="background-color: #ffcc00"></div>
          <div class="controls__color jsColor" style="background-color: #4cd963"></div>
          <div class="controls__color jsColor" style="background-color: #5ac8fa"></div>
          <div class="controls__color jsColor" style="background-color: #0579ff"></div>
          <div class="controls__color jsColor" style="background-color: #5856d6"></div>
        </div>
      </div>
    </body>
  </html>
</template>

<script>
export default {
  data() {
    return {
      canvas: document.getElementById('jsCanvas'),
      ctx: this.canvas.getContext('2d'),
      colors: document.getElementsByClassName('jsColor'),
      range: document.getElementById('jsRange'),
      mode: document.getElementById('jsMode'),
      initial_color: '@2c2c2c',
      canvas_size: 700,
      painting: false,
      filling: false,
    };
  },

  beforeMount() {
    if (this.canvas) {
      this.canvas.addEventListener('mousemove', this.onMouseMove);
      this.canvas.addEventListener('mousedown', this.startPainting);
      this.canvas.addEventListener('mouseup', this.stopPainting);
      this.canvas.addEventListener('mouseleave', this.stopPainting);
      this.canvas.addEventListener('click', this.handleCanvasClick);
      this.canvas.addEventListener('contextmenu', this.handleCM);
    }

    if (this.range) {
      this.range.addEventListener('input', this.handleRangeChange);
    }

    if (this.mode) {
      this.mode.addEventListener('click', this.handleModeClick);
    }

    if (this.saveBtn) {
      this.saveBtn.addEventListener('click', this.handleSaveClick);
    }
  },

  methods: {
    stopPainting() {
      this.painting = false;
    },
    startPainting() {
      this.painting = true;
    },
    onMouseMove(event) {
      const x = event.offsetX;
      const y = event.offsetY;
      if (!this.painting) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
      }
    },
    handleColorClick(event) {
      const color = event.target.style.backgroundColor;
      this.ctx.strokeStyle = color;
      this.fillStyle = color;
    },
    handleRangeChange(event) {
      const size = event.target.value;
      this.ctx.lineWidth = size;
    },
    handleModeClick() {
      if (this.filling === true) {
        this.filling = false;
        this.mode.innerText = 'Fill';
      } else {
        this.filling = true;
        this.mode.innerText = 'Paint';
      }
    },
    handleCanvasClick() {
      if (this.filling) {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    },
    handleCM(event) {
      event.preventDefault();
    },
  },

};
</script>

<style>
body {
    background-color: aliceblue;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0px;
}

.canvas {
    width: 700px;
    height: 700px;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.controls {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.controls .controls__colors {
    display: flex; /* 가로 */
}

.controls .controls__btns {
    margin-bottom: 30px;
}

.controls__btns button {
    all: unset;
    cursor: pointer;
    background-color: white;
    padding: 5px 0px;
    width: 80px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.7);
    text-transform: uppercase;
    font-weight: 800;
    font-size: 12px;
}

.controls__btns button:active {
    transform: scale(0.98);
}

.controls__colors .controls__color {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.controls .controls__range {
    margin-bottom: 30px;
}
</style>
