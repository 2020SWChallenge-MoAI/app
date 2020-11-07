<template>
  <sub-layout title="그림그리기" :tooltip="tooltip">
    <template v-slot:left>
    </template>

    <div id="sentence-group" v-show="currentState == 1">
      <div
        v-for="(sentence, index) in mainSentence"
        v-bind:key="index"
        class="drawing-recommend"
        :id="'drawing-recommend' + (index + 1)"
        @click="changeRecommend"
        v-ripple
      >
        {{ sentence }}
      </div>
    </div>

    <div v-show="currentState == -1" id="no-book-text">
      <img src="../../../assets/noBooks.png" id="no-book-img" />
      선택할 책이 없어. 책을 읽고 와야해!
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
      slide: '',
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
        this.recommendStyleClear();
        const rid = event.target.id;
        // eslint-disable-next-line
        const recommend = document.querySelector('#' + rid);
        this.selectedSentence = recommend.innerText;
        recommend.style.border = '5px solid #FFAE00';
        recommend.style.background = 'rgba(255, 174, 0, 0.2)';
        this.clickedSentenceId = rid;
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
      return this.$store.getters.currentBook;
    },
  },

  watch: {
    book() {
      this.currentState = 0;
      if (this.book !== null) {
        this.tooltip = this.book.title;
        // eslint-disable-next-line
        axios.get('/api/book/' + this.book.bid + '/main-sentence')
          .then((res) => {
            this.recommendStyleClear();
            this.clickedSentenceId = '';
            this.doubleTabTimer = false;
            this.mainSentence = res.data.main_sentences;
            this.sentenceIndex = 0;
            this.currentState = 1;
          }).catch((err) => {
            console.error(err);
          });
      } else {
        this.tooltip = '그림을 그릴 책을 선택해보자!';
        this.currentState = -1;
      }
    },

    clickedSentenceId() {
      if (this.clickedSentenceId !== '') this.tooltip = this.book.title;
      else this.tooltip = '그림을 그릴 책을 선택해보자!';
    },
  },
};
</script>

<style scoped>
#sentence-group {
  height: 78vh;
  width: 100%;
  overflow-y: scroll;
}

.drawing-recommend {
  width: 90%;
  margin-left: 5%;
  margin-top: 3%;
  margin-bottom: 1%;

  font-size: 2.5vh;
  color: black;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  line-height: 5vh;
  padding-left: 5vh;
  padding-right: 5vh;
  padding-top: 2vh;
  padding-bottom: 2vh;

  border-radius: 1vw;
  border: 5px solid rgba(156, 138, 108, 0.85);
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

#no-book-text {
  text-align: center;
  font-size: 2vw;
  margin-top: calc(40% + 15vw);
}

#no-book-img {
  position: absolute;
  width: 30vw;
  height: 30vw;
  top: calc(40% - 15vw);
  left: calc(50% - 15vw);
}

#recommend-btn {
  position: absolute;
  top: calc(100% - 8vw);
  left: 0;
  width: 100%;
  height: 7vw;
  padding-left: 3vw;
  padding-right: 3vw;
}

#drawing-next {
  width: 5vw;
  height: 8vw;
  display: inline-block;
  float: right;
  text-align: center;
  font-size: 1.5vw;
  border-radius: 1vw;
}
#drawing-next-img {
  width: 5vw;
  height: 5vw;
}

#drawing-before {
  width: 5vw;
  height: 8vw;
  display: inline-block;
  float: left;
  text-align: center;
  font-size: 1.5vw;
  border-radius: 1vw;
}
#drawing-before-img {
  width: 5vw;
  height: 5vw;
}

.slide-left-enter-active {
  transition: all .3s ease;
}
.slide-left-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-left-enter {
  transform: translateX(-30px);
  opacity: 0;
}
 .slide-left-leave-to {
  transform: translateX(+30px);
  opacity: 0;
 }

 .slide-right-enter-active {
  transition: all .3s ease;
}
.slide-right-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-right-enter {
  transform: translateX(+30px);
  opacity: 0;
}
 .slide-right-leave-to {
  transform: translateX(-30px);
  opacity: 0;
 }

</style>
