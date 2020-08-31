<template>
  <ul id="scrollArea">
    <li
      v-for="book in bookList"
      id="bookContainer"
      :key="book.bid"
    >
      <img
        id="bookImg"
        :src="book.url"
      >
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      bookList: [
        // eslint-disable-next-line global-require
        { bid: 1, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 2, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 3, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 4, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 5, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 6, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 7, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 8, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 9, url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { bid: 10, url: require('../assets/logo.svg') },
      ],

    };
  },
};
</script>

<style scoped>
#scrollArea {
    width: 100%;
    height: 30em;
    overflow-x: scroll;
    white-space: nowrap;
}
#bookContainer {
    width: 14em;
    height: fit-content;
    text-align: center;
    display:inline-block;
    margin: 4em;
}
#bookImg {
    width: 12em;
    height: 18em;
    object-fit: cover;
    overflow: hidden;
    vertical-align: middle;
    border-radius: 10%;
}
#scrollArea li {
    list-style: none;
}
</style>
