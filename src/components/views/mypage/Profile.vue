<template>
  <div class="profile">
    <div class="profile-header">
      <div class="profile-image" />
      <div class="profile-age">
        {{ user.age }}세
      </div>
    </div>
    <div class="profile-name">
      {{ user.nickname }}
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
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.profile-header {
  position: relative;
}

.profile-image {
  width: 20vw;
  height: 20vw;
  border-radius: 20vw;
  border: 1px solid lightskyblue;
  background-image: url('~@/assets/userImg.png');
  background-size: cover;
}

.profile-age {
  position: absolute;
  width: 7vw;
  height: 7vw;
  bottom: 0;
  right: 0;
  text-align: center;
  font-size: 3vw;
  font-weight: 900;
  font-family: 'Tmoney';
  letter-spacing: -0.5vw;
  padding-top: 1vw;
  border-radius: 20vw;
  background: orange;
}

.profile-name {
  width: 22vw;
  height: 7vh;
  border-radius: 3vw;
  text-align: center;
  font-size: 2.8vw;
  font-weight: 900;
  letter-spacing: -0.2vw;
  padding-top: 0.5vh;
  margin-top: 2vh;
  color: white;
  background: lightblue;
}
</style>
