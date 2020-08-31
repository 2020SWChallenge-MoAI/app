<template>
  <ul id="scrollArea">
    <li
      v-for="category in categoryList"
      id="categoryContainer"
      :key="category.name"
    >
      <img
        id="categoryImg"
        :src="category.url"
      >
      <p id="categoryName">
        {{ category.name }}
      </p>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [
        // eslint-disable-next-line global-require
        { name: '과학', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '수학', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '영어', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '역사', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '컴퓨터', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '여행', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '인문', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '사회', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '지리', url: require('../assets/logo.svg') },
        // eslint-disable-next-line global-require
        { name: '소설', url: require('../assets/logo.svg') },
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
#categoryContainer {
    width: 18em;
    height: fit-content;
    text-align: center;
    display:inline-block;
    margin: 4em;
}
#categoryImg {
    width: 20em;
    height: 18em;
    object-fit: cover;
    overflow: hidden;
    vertical-align: middle;
    border-radius: 10%;
}
#categoryName {
    font-size: 1.4em;
    margin-top: 2em;
}
#scrollArea li {
    list-style: none;
}
</style>
