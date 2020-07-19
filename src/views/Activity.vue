<template>
  <div>
    <v-container class="d-flex justify-center mb-6">
        <v-col cols="12">
          <v-row>
            <v-card
              id="book_list"
              v-for="book in books"
              :key="book.id"
              :book_id="book.id"
              :title="book.title"
              class="ma-6 pa-14"
              outlined
              width=240px
              height="200px"
              :click="ser"
            >
              {{ book.id }}
            </v-card>
          </v-row>
        </v-col>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      books: [
        { id: 1, title: "신데렐라" },
        { id: 2, title: "백설공주" },
        { id: 3, title: "흥부와 놀부" },
        { id: 4, title: "홍길동전" },
        { id: 5, title: "토끼와 거북이" },
        { id: 6, title: "파브르 위인전" },
        { id: 7, title: "삼국지" },
        { id: 8, title: "마음의 소리" },
        { id: 9, title: "집이 없어" },
        { id: 10, title: "신의 탑" },
      ]
    }
  },

  methods: {
    test(e) {
      alert(e);
    },
  },
}
</script>

<style>
#book_list{
  text-align: center;
  border:1px solid black
}
</style>