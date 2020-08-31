<template>
  <div>
    <UserProfile />
    <ButtonText />
    <ButtonHome />
    <ButtonBack />
    <BookCategory />
    <BookCover />
  </div>
</template>

<script>
import UserProfile from '../../components/User-Profile.vue';
import ButtonText from '../../components/Button-Text.vue';
import ButtonHome from '../../components/Button-Home.vue';
import ButtonBack from '../../components/Button-Back.vue';
import BookCategory from '../../components/Book-Category.vue';
import BookCover from '../../components/Book-Cover.vue';

export default {
  components: {
    UserProfile, ButtonText, ButtonHome, ButtonBack, BookCategory, BookCover,
  },

};
</script>

<style>

</style>
