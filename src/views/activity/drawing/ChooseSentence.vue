<template>
  <sub-layout title="그림그리기" :tooltip="tooltip">
    <template v-slot:left>
    </template>

    <div v-show="currentState == 1" style="height: 100%; width: 100%;">
      <div class="drawing-recommend" id="drawing-recommend1" v-ripple>
      </div>

      <div class="drawing-recommend" id="drawing-recommend2" v-ripple>
      </div>

      <div class="drawing-recommend" id="drawing-recommend3" v-ripple>
      </div>
    </div>

    <div v-show="currentState == -1">
      책을 선택해줘!
    </div>

    <div id="sentence-loading" v-show="currentState == 0" />

  </sub-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tooltip: '그림으로 그리고 싶은 문장을 선택해보자!',
      currentState: 0,
      mainSentence: [],
      doubleTabTimer: 0,
      clickedSentenceId: '',
      selectedSentence: '',
      sentenceIndex: 0,
    };
  },

  mounted() {
    if (this.book !== null) {
      this.currentState = 0;
      // eslint-disable-next-line
      axios.get('/api/book/' + this.book.bid + '/main-sentence')
        .then((res) => {
          this.mainSentence = res.data.main_sentences;
          this.currentState = 1;

          const recommends = document.querySelectorAll('.drawing-recommend');
          recommends.forEach((recommend) => {
            recommend.addEventListener('click', this.changeRecommend);
            const r = recommend;
            r.innerHTML = this.mainSentence[this.sentenceIndex];
            this.sentenceIndex += 1;
          }, true);
        }).catch((err) => {
          console.error(err);
        });
    } else {
      this.tooltip = '그림을 그릴 책을 선택해보자!';
      this.currentState = -1;
    }
  },

  methods: {
    changeRecommend(event) {
      if (this.doubleTabTimer && event.target.id === this.clickedSentenceId) {
        // 페이지 이동
        this.$router.push({
          name: 'Drawing',
          params: { sentence: this.selectedSentence, bid: this.book.bid },
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

  computed: {
    book() {
      return this.$store.getters.getCurrentBook;
    },
  },

  watch: {
    book() {
      this.currentState = 0;
      if (this.book !== null) {
        // eslint-disable-next-line
        axios.get('/api/book/' + this.book.bid + '/main-sentence')
          .then((res) => {
            this.mainSentence = res.data.main_sentences;
            this.sentenceIndex = 0;
            this.currentState = 1;

            const recommends = document.querySelectorAll('.drawing-recommend');
            recommends.forEach((recommend) => {
              recommend.addEventListener('click', this.changeRecommend);
              const r = recommend;
              r.innerHTML = this.mainSentence[this.sentenceIndex];
              this.sentenceIndex += 1;
            }, true);
          }).catch((err) => {
            console.error(err);
          });
      } else {
        this.tooltip = '그림을 그릴 책을 선택해보자!';
        this.currentState = -1;
      }
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

#sentence-loading {
  position: absolute;
  top: calc(50% - 5vw);
  left: calc(50% - 5vw);
  width: 10vw;
  height: 10vw;
  border: 10px solid rgba(255,174,0,.3);
  border-radius: 50%;
  border-top-color: #FFAE00;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
</style>
