<template>
    <div class="pageContainer">
        <div v-for="article of articles" :style="setZindex(article)"
        :key="article.id" :class="{pageClicked: article.clicked, cover: !article.clicked}" @click="pageClick(article.id)">
            <div class="outer front"> <div class="inner">{{ article.text }}</div> </div>
            <div class="outer back"> <div class="inner">{{ article.text }}</div> </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['bookId'],
    data() {
        return {
            articles: [
            ],
            book: {},
        }
    },
    methods: {
        pageClick(id) {
            this.articles[id - 1].clicked = !this.articles[id - 1].clicked;
        },
        setZindex(article) {
            if(article.clicked) {
                return {zIndex: article.id};
            } else {
                return {zIndex: 100 - article.id};
            }
        }
    },
    created() {
        axios
            .get('/api/books/'+this.bookId, {
            })
            .then(res => {
                this.book = res.data;
                console.log(this.book)
                var text_list = this.book.content.split('')
                var index = 1
                var sentence = ''
                var i = 1
                this.articles.push({id: 1, text: this.book.title, clicked: false})
                for (i; i < text_list.length + 1; i++) {
                    if (i % 100 == 0 || i == text_list.length) {
                        sentence = sentence + text_list[i - 1]
                        this.articles.push({id: index + 1, text: sentence, clicked: false})
                        sentence = ''
                        index = index + 1
                    }
                    else{
                        sentence = sentence + text_list[i - 1]
                    }
                }
                console.log(this.articles)
            })
            .catch(err => {
                console.log(err)
            })
    }
}
</script>

<style scope>
.pageContainer {
  width: 50%;
  height: 80%;
  position:relative;
  perspective: 2000px;
  margin-left: 50%;
  margin-top: 3%;
}

.cover {
  width: 60%;
  height: 100%;
  position: absolute;
  background-color: rgb(100,200,100);
  transform: rotateY(0deg);
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1s ease-in;
}

.pageClicked {
  width: 60%;
  height: 100%;
  position: absolute;
  background-color: rgb(50,200,100);
  transform: rotateY(-180deg);
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1s ease-in;
}

.outer {
  margin: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  padding: 5%;
  padding-top: 30%;
}

.outer.front {
  border: 1px solid black;
  position: absolute;
  text-align: center;
  opacity: 1.0;
}

.outer.back {
  border: 1px solid black;
  transform: rotateY(180deg);
  position: absolute;
  text-align: center;
  opacity: 1.0;
}
</style>