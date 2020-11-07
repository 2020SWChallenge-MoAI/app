<template>
  <sub-layout title="마인드맵" :tooltip="tooltip">
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

      <div class="choose-template" id="template1" style="left: 13vw;" v-ripple />
      <div class="choose-template" id="template2" style="left: 28vw;" v-ripple />
      <div class="choose-template" id="template3" style="left: 43vw;" v-ripple />
      <div class="choose-template" id="template-change" style="left: 58vw;" v-ripple>
        <div id="choose-more-img" />
      </div>
    </div>
  </sub-layout>
</template>

<script>
export default {
  data() {
    return {
      tooltip: '원하는 템플릿을 골라보자!',
      aiHelp: false,
      canvas: document.getElementById(''),
      ctx: [],
      doubleTabTimer: false,
      template: 1,
      clickedTemplate: '',

      leaf1Img: new Image(),
      leaf2Img: new Image(),
    };
  },

  mounted() {
    this.canvas = document.getElementById('center-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // eslint-disable-next-line
    this.leaf1Img.src = require('../../../assets/mindmap/grape-leaf1.png');
    // eslint-disable-next-line
    this.leaf2Img.src = require('../../../assets/mindmap/grape-leaf2.png');

    const templates = document.querySelectorAll('.choose-template');

    templates.forEach((template) => {
      template.addEventListener('click', this.changeToTemplate);
    });

    this.ctx[0].scale(0.8, 0.8);
    this.ctx[0].scale(1, 1);
  },

  methods: {
    changeToTemplate(event) {
      this.ctx[0].clearRect(0, 0, 100000, 100000);

      if (this.doubleTabTimer && event.target.id === this.clickedTemplate) {
        if (this.$store.getters.getCurrentBook === null) {
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
              bookId: (this.$store.getters.getCurrentBook).bid,
              thumbnail: (this.$store.getters.getCurrentBook).thumbnail,
            },
          });
        }
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

      this.doubleTabTimer = true;
      setTimeout(() => {
        this.doubleTabTimer = false;
      }, 200);
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
        var lightRad = Math.atan2(y + 50, this.canvas.width / 2 - x);
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

    drawTemplate(template) {
      if (template === 1) {
        const width = this.canvas.width / (2 * 0.8);
        const height = this.canvas.height / (2 * 0.8);
        // edge 줄기 미리 그리기
        this.ctx[0].strokeStyle = '#baad93';
        this.ctx[0].lineWidth = 12;
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(width, height);
        this.ctx[0].lineTo(width - 240, height - 100);
        this.ctx[0].stroke();

        this.ctx[0].beginPath();
        this.ctx[0].moveTo(width, height);
        this.ctx[0].lineTo(width + 240, height - 100);
        this.ctx[0].stroke();

        this.ctx[0].beginPath();
        this.ctx[0].moveTo(width, height);
        this.ctx[0].lineTo(width - 240, height + 100);
        this.ctx[0].stroke();

        this.ctx[0].beginPath();
        this.ctx[0].moveTo(width, height);
        this.ctx[0].lineTo(width + 240, height + 100);
        this.ctx[0].stroke();

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
        this.ctx[0].fillRect(width - 20, this.canvas.height * (0.4 / 0.8) + 130, 40, 120);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].arc(this.canvas.width * (0.5 / 0.8), this.canvas.height * (0.4 / 0.8), 130, Math.PI * 0.25, Math.PI * 0.75);
        this.ctx[0].stroke();

        this.makeNode(width - 240, height - 100, 80, 0, '', template);
        this.makeNode(width + 240, height - 100, 80, 1, '', template);
        this.makeNode(width - 240, height + 100, 80, 2, '', template);
        this.makeNode(width + 240, height + 100, 80, 3, '', template);
      } else if (template === 2) {
        const width = this.canvas.width / (2 * 0.8);

        this.ctx[0].drawImage(this.leaf1Img, width - 450, -300, 700, 600);
        this.ctx[0].drawImage(this.leaf2Img, width - 150, -300, 700, 600);

        this.makeNode(width - 320, 120, 80, 0, '', template);
        this.makeNode(width - 150, 300, 80, 1, '', template);
        this.makeNode(width + 120, 250, 80, 2, '', template);
        this.makeNode(width + 300, 150, 80, 3, '', template);
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

#template1 {
  background-image: url('../../../assets/mindmap/tree.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
#template2 {
  background-image: url('../../../assets/mindmap/grape.png');
  background-position: center;
  background-size: contain;
  background-repeat : no-repeat;
}
</style>
