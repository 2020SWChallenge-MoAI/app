<template>
  <sub-layout title="마인드맵" tooltip="원하는 템플릿을 골라보자!">
    <template v-slot:left>
    </template>

    <!-- 캔버스 -->
    <canvas id="center-canvas" />

    <!-- TODO: Implementation -->

    <!-- 템플릿 선택 -->
    <div id="center-template">
      <div id="choose-background">
        <div id="choose-img" />
        <div id="choose-space" />
        <div id="choose-dotline">
          <div id="choose-dot" />
          <div id="choose-dot" />
          <div id="choose-dot" />
          <div id="choose-dot" />
          <div id="choose-dot" />
          <div id="choose-dot" />
          <div id="choose-dot" />
        </div>
      </div>

      <div class="choose-template" id="template1" style="left: 13vw;" />
      <div class="choose-template" id="template2" style="left: 28vw;" />
      <div class="choose-template" id="template3" style="left: 43vw;" />
      <div class="choose-template" id="template-change" style="left: 58vw;">
        <div id="choose-more-img" />
      </div>
    </div>
  </sub-layout>
</template>

<script>
export default {
  data() {
    return {
      aiHelp: false,
      canvas: document.getElementById(''),
      ctx: [],
      doubleTabTimer: false,
      template: 1,
    };
  },

  mounted() {
    this.canvas = document.getElementById('center-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    const templates = document.querySelectorAll('.choose-template');

    templates.forEach((template) => {
      template.addEventListener('click', this.changeToTemplate);
    });
  },

  methods: {
    changeToTemplate(event) {
      this.ctx[0].clearRect(0, 0, 100000, 100000);

      if (this.doubleTabTimer) {
        // 페이지 이동
        this.$router.push({
          name: 'MindMap',
          params: { template: this.template },
        });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (event.target.id === 'template1') {
          this.template = 1;
          this.drawTemplate(1);
          this.templateBorderClear();
          const template = document.querySelector('#template1');
          template.style.border = '5px solid #FFAE00';
        } else if (event.target.id === 'template2') {
          this.template = 2;
          this.drawTemplate(2);
          this.templateBorderClear();
          const template = document.querySelector('#template2');
          template.style.border = '5px solid #FFAE00';
        } else if (event.target.id === 'template3') {
          this.template = 3;
          this.drawTemplate(3);
          this.templateBorderClear();
          const template = document.querySelector('#template3');
          template.style.border = '5px solid #FFAE00';
        } else if (event.target.id === 'template-change') {
          this.templateBorderClear();
          const template = document.querySelector('#template-change');
          template.style.border = '5px solid #FFAE00';
        }
      }

      this.doubleTabTimer = true;
      setTimeout(() => {
        this.doubleTabTimer = false;
      }, 200);
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

    drawTemplate(template) {
      if (template === 1) {
        // edge 줄기 미리 그리기
        this.ctx[0].strokeStyle = '#baad93';
        this.ctx[0].lineWidth = 12;
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx[0].lineTo(120, 120);
        this.ctx[0].stroke();

        this.ctx[0].beginPath();
        this.ctx[0].moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx[0].lineTo(this.canvas.width - 120, 120);
        this.ctx[0].stroke();

        this.ctx[0].beginPath();
        this.ctx[0].moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx[0].lineTo(120, this.canvas.height - 120);
        this.ctx[0].stroke();

        this.ctx[0].beginPath();
        this.ctx[0].moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx[0].lineTo(this.canvas.width - 120, this.canvas.height - 120);
        this.ctx[0].stroke();

        // 템플릿(나무) 그리기
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(this.canvas.width / 2, this.canvas.height / 2 - 80);
        this.ctx[0].strokeStyle = '#7ed221';
        this.ctx[0].fillStyle = '#7ed221';
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(this.canvas.width / 2 - 250, this.canvas.height / 2 - 200, this.canvas.width / 2 - 250, this.canvas.height / 2 + 180, this.canvas.width / 2, this.canvas.height / 2 + 120);
        this.ctx[0].moveTo(this.canvas.width / 2 - 5, this.canvas.height / 2 + 120);
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(this.canvas.width / 2 + 200, this.canvas.height / 2 + 180, this.canvas.width / 2 + 200, this.canvas.height / 2 - 150, this.canvas.width / 2 - 5, this.canvas.height / 2 - 80);
        this.ctx[0].fill();

        // 나무 줄기 그리기
        this.ctx[0].beginPath();
        this.ctx[0].fillStyle = '#836d4b';
        this.ctx[0].fillRect(this.canvas.width / 2 - 20, this.canvas.height - 110, 40, 120);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].arc(this.canvas.width * 0.5, this.canvas.height * 0.4, 130, Math.PI * 0.25, Math.PI * 0.75);
        this.ctx[0].stroke();

        this.makeNode(120, 120, 80, 0, '');
        this.makeNode(this.canvas.width - 120, 120, 80, 1, '');
        this.makeNode(120, this.canvas.height - 120, 80, 2, '');
        this.makeNode(this.canvas.width - 120, this.canvas.height - 120, 80, 3, '');
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
  width: 14vw;
  height: 14vw;
  z-index: 18;
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
  height: 1.9vh;
  background: #8BA9A3;
  margin-bottom: 0.93vh;
}
.choose-template {
  position: absolute;
  display: inline-block;
  width: 14vw;
  height: 18vh;
  border: 5px solid #F0EBD7;
  border-radius: 1vw;
  background: #F0EBD7;
  top: 0.3vw;
}
#choose-more-img {
  position: absolute;
  width: 14vw;
  height: 12vh;
  background-image: url('../../../assets/choose-more.svg');
  background-size: cover;
  top: 1.5vw;
}
</style>
