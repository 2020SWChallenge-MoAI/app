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
        <div id="left-menu-book1" />
        <div id="left-menu-book2" />
        <div id="left-menu-book3" />
        <div id="left-menu-more" />
        <div id="left-menu-more-text">...</div>
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
          <div class="choose-template" id="template2" style="left: 28.5vw;" />
          <div class="choose-template" id="template3" style="left: 44vw;" />
          <div class="choose-template" id="tempalte-change" style="left: 59.5vw;">
            <div id="choose-more-img" />
          </div>
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
      if (this.pos.drawable) this.draw(e);
    }, false);
    // eslint-disable-next-line no-unused-vars
    this.canvas.addEventListener('touchend', (e) => {
      this.finishDraw(e);
    }, false);

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
        this.$router.push('/mindmap/start');
      } else {
        // eslint-disable-next-line no-lonely-if
        if (event.target.id === 'template1') {
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
          this.ctx[0].fillRect(this.canvas.width / 2 - 20, this.canvas.height - 120, 40, 120);
          this.ctx[0].lineWidth = 12;
          this.ctx[0].strokeStyle = '#836d4b';
          // eslint-disable-next-line max-len
          this.ctx[0].arc(this.canvas.width * 0.5, this.canvas.height * 0.4, 130, Math.PI * 0.25, Math.PI * 0.75);
          this.ctx[0].stroke();

          this.makeNode(120, 120, 80, 0, '등장인물');
          this.makeNode(this.canvas.width - 120, 120, 80, 1, '줄거리');
          this.makeNode(120, this.canvas.height - 120, 80, 2, '느낀점');
          this.makeNode(this.canvas.width - 120, this.canvas.height - 120, 80, 3, '인상장면');
        }
      }

      this.doubleTabTimer = true;
      setTimeout(() => {
        this.doubleTabTimer = false;
      }, 500);
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
#choose-img {
  position: absolute;
  background-image: url('../../assets/choose.svg');
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
  border-radius: 20px;
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
  height: 1.5vw;
  background: #8BA9A3;
  margin-bottom: 0.72vw;
}
.choose-template {
  position: absolute;
  display: inline-block;
  width: 15vw;
  height: 14vw;
  border-radius: 10px;
  background: #F0EBD7;
  top: 0.3vw;
}
#choose-more-img {
  position: absolute;
  width: 15vw;
  height: 11vw;
  background-image: url('../../assets/choose-more.svg');
  background-size: cover;
  top: 1.5vw;
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
#left-menu-book1 {
  position: relative;
  width: 6vw;
  height: 6vw;
  background: url('../../assets/left-book-menu/book1.png');
  background-size: cover;
  border-radius: 15px;
  margin-left: 1vw;
}
#left-menu-book2 {
  position: relative;
  width: 6vw;
  height: 6vw;
  background: url('../../assets/left-book-menu/book2.png');
  background-size: cover;
  border-radius: 15px;
  margin-top: 1vw;
  margin-left: 1vw;
}
#left-menu-book3 {
  position: relative;
  width: 6vw;
  height: 6vw;
  background: url('../../assets/left-book-menu/book3.png');
  background-size: cover;
  border-radius: 15px;
  margin-top: 1vw;
  margin-left: 1vw;
}
#left-menu-more {
  position: relative;
  width: 4vw;
  height: 4vw;
  background: url('../../assets/left-book-menu/book-more.svg');
  background-size: cover;
  border-radius: 5px;
  transform: rotate(-225deg);
  margin-top: 1vw;
  margin-left: 2vw;
}
#left-menu-more-text {
  position: absolute;
  width: 4vw;
  height: 4vw;
  top: 22.5vw;
  left: 2.8vw;
  font-size: 3vw;
  font-weight: bolder;
  color: white;
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
