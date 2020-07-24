<template>
    <div class="pageContainer">
        <div v-for="article of articles" :style="setZindex(article)"
        :key="article.id" :class="{pageClicked: article.clicked, cover: !article.clicked}" @click="pageClick(article.id)">
            <figure class="front"> {{ article.text }} </figure>
            <figure class="back">{{ article.text }}</figure>
        </div>

        {{ book.content }}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['bookId'],
    data() {
        return {
            articles: [
                {id: 1, text:"1111111111111111111111", clicked: false,},
                {id: 2, text:"2222222222222222222222", clicked: false,},
                {id: 3, text:"3333333333333333333333", clicked: false,},
                {id: 4, text:"4444444444444444444444", clicked: false,},
            ],
            book: {},
        }
    },
    methods: {
        pageClick(id) {
            this.articles[id - 1].clicked = !this.articles[id - 1].clicked;
            this.polling = setInterval(() => {
                this.page1reset()
                console.log('test')
            }, 1000);
        },
        page1reset() {
            
            clearInterval(this.polling)
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
        console.log(this.bookId)
        axios
            .get('/api/books/'+this.bookId, {
            })
            .then(res => {
                this.book = res.data;
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
  background-color: #34b58c;
  transform: rotateY(0deg);
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1s ease-in;
}

.pageClicked {
  width: 60%;
  height: 100%;
  position: absolute;
  background-color: #34b58c;
  transform: rotateY(-180deg);
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1s ease-in;
}

figure {
  margin: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

figure.front {
  background: red;
  position: absolute;;
}

figure.back {
  background: green;
  transform: rotateY(180deg);
  position: absolute;;
}

figure.another {
    background: purple;
}
</style>