<template>
  <sub-layout title="그림그리기" tooltip="그림으로 그리고 싶은 문장을 선택해보자!">
    <template v-slot:left>
      <!-- 왼쪽 버튼은 이렇게 입력 -->
      <left-menu-button icon="mdi-help" text="테스트" />
    </template>

    <div class="drawing-recommend" id="drawing-recommend1" v-ripple>
    </div>
    <hr id="drawing-recommend1-line1">
    <hr id="drawing-recommend1-line2">

    <div class="drawing-recommend" id="drawing-recommend2" v-ripple>
    </div>
    <hr id="drawing-recommend2-line1">
    <hr id="drawing-recommend2-line2">

    <div class="drawing-recommend" id="drawing-recommend3" v-ripple>
    </div>
    <hr id="drawing-recommend3-line1">
    <hr id="drawing-recommend3-line2">

  </sub-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      mainSentence: [],
      doubleTabTimer: 0,
      clickedSentenceId: '',
      selectedSentence: '',
      bookId: 3,
      sentenceIndex: 0,
    };
  },

  mounted() {
    // eslint-disable-next-line
    axios.get('/api/book/' + this.bookId + '/main-sentence')
      .then((res) => {
        this.mainSentence = res.data.main_sentences;

        const recommends = document.querySelectorAll('.drawing-recommend');
        recommends.forEach((recommend) => {
          recommend.addEventListener('click', this.changeRecommend);
          const r = recommend;
          r.innerHTML = this.mainSentence[this.sentenceIndex];
          this.sentenceIndex += 1;
        }, true);
      }).catch((err) => {
        console.warn('ERROR!!!!: ', err);
      });
  },

  methods: {
    changeRecommend(event) {
      if (this.doubleTabTimer && event.target.id === this.clickedSentenceId) {
        // 페이지 이동
        this.$router.push({
          name: 'Drawing',
          params: { sentence: this.selectedSentence },
        });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (event.target.id === 'drawing-recommend1') {
          this.recommendStyleClear();
          const sentence = document.querySelector('#drawing-recommend1');
          this.selectedSentence = this.mainSentence[this.sentenceIndex - 3];
          sentence.style.border = '5px solid #FFAE00';
          sentence.style.background = 'rgba(255, 174, 0, 0.2)';
          this.clickedSentenceId = 'drawing-recommend1';
        } else if (event.target.id === 'drawing-recommend2') {
          this.recommendStyleClear();
          const sentence = document.querySelector('#drawing-recommend2');
          this.selectedSentence = this.mainSentence[this.sentenceIndex - 2];
          sentence.style.border = '5px solid #FFAE00';
          sentence.style.background = 'rgba(255, 174, 0, 0.2)';
          this.clickedSentenceId = 'drawing-recommend2';
        } else if (event.target.id === 'drawing-recommend3') {
          this.recommendStyleClear();
          const sentence = document.querySelector('#drawing-recommend3');
          this.selectedSentence = this.mainSentence[this.sentenceIndex - 1];
          sentence.style.border = '5px solid #FFAE00';
          sentence.style.background = 'rgba(255, 174, 0, 0.2)';
          this.clickedSentenceId = 'drawing-recommend3';
        }
      }

      this.doubleTabTimer = true;
      setTimeout(() => {
        this.doubleTabTimer = false;
      }, 200);
    },
    recommendStyleClear() {
      const recommends = document.querySelectorAll('.drawing-recommend');
      recommends.forEach((recommend) => {
        const t = recommend;
        t.style.border = '5px solid rgba(156, 138, 108, 0.85)';
        t.style.background = '#fffdf2';
      });
    },
  },
};
</script>

<style scoped>
.drawing-recommend {
  width: 90%;
  height: 25%;
  margin-left: 5%;
  margin-top: 3%;
  margin-bottom: 1%;

  font-size: 1.7vh;
  color: black;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  line-height: 9vh;
  padding-left: 5vh;
  padding-right: 5vh;

  border-radius: 1vw;
  border: 5px solid rgba(156, 138, 108, 0.85);
}

#drawing-recommend1-line1 {
  position: absolute;
  top: 16vh;
  left: 7vw;
  width: 62vw;
  height: 3px;
  border: 0;
  background: rgba(156, 138, 108, 0.85);
}
#drawing-recommend1-line2 {
  position: absolute;
  top: 25vh;
  left: 7vw;
  width: 62vw;
  height: 3px;
  border: 0;
  background: rgba(156, 138, 108, 0.85);
}

#drawing-recommend2-line1 {
  position: absolute;
  top: 41vh;
  left: 7vw;
  width: 62vw;
  height: 3px;
  border: 0;
  background: rgba(156, 138, 108, 0.85);
}
#drawing-recommend2-line2 {
  position: absolute;
  top: 50vh;
  left: 7vw;
  width: 62vw;
  height: 3px;
  border: 0;
  background: rgba(156, 138, 108, 0.85);
}

#drawing-recommend3-line1 {
  position: absolute;
  top: 65vh;
  left: 7vw;
  width: 62vw;
  height: 3px;
  border: 0;
  background: rgba(156, 138, 108, 0.85);
}
#drawing-recommend3-line2 {
  position: absolute;
  top: 74vh;
  left: 7vw;
  width: 62vw;
  height: 3px;
  border: 0;
  background: rgba(156, 138, 108, 0.85);
}
</style>
