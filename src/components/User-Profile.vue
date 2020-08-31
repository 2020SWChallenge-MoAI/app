<template>
  <div id="userProfile">
    <img
      id="userImg"
      :src="data_imgURL"
    >
    <span id="userInfo">
      <span id="userName">{{ data_userName }}</span><br>
      <span id="userID">{{ data_userID }}</span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // eslint-disable-next-line global-require
      data_imgURL: require('../assets/logo.svg'),
      data_userName: 'Name',
      data_userID: 'ID',
    };
  },

};
</script>

<style scoped>
#userProfile {
    display: flex;
    align-items: center;
    width: fit-content;
    height: fit-content;
}
#userImg {
    object-fit: cover;
    width: 4em;
    height: 4em;
    border-radius: 70%;
    overflow: hidden;
    vertical-align: middle;
}
#userInfo {
    margin-left: 2em;
}
#userName {
    font-size: 1.2em;
    font-weight: bold;
}
#userID {
    font-size: 0.8em;
    margin-left: 1em;
}
</style>
