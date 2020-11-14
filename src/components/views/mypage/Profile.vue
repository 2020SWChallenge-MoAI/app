<template>
  <div class="profile">
    <div class="profile-name">
      {{ user.nickname }}
    </div>
    <div class="profile-header">
      <div class="profile-image-wrapper">
        <img
          src="@/assets/userImg.png"
          class="profile-image"
        >
        <div class="profile-age">
          {{ user.age }}세
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user'],
};
</script>

<style scoped>
.profile {
  display: flex;
  flex-flow: column-reverse;
  justify-content: space-between;
  align-items: center;
}

.profile-header {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
}

.profile-image-wrapper {
  position: relative;
  width: auto;
  height: 100%;
  display: flex;
  justify-content: center;
}

.profile-image {
  border-radius: 100%;
  width: auto;
  height: 100%;
}

.profile-age {
  position: absolute;
  width: 8vh;
  height: 8vh;
  bottom: 0;
  right: 0;
  text-align: center;
  font-size: 3vh;
  font-weight: 900;
  font-family: 'Tmoney';
  border-radius: 100%;
  background: orange;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-name {
  width: 100%;
  border-radius: 3vw;
  text-align: center;
  font-size: 2.8vw;
  font-weight: 900;
  padding-top: 0.5vh;
  margin-top: 2vh;
  color: white;
  background: lightblue;
}
</style>
