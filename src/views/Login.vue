<template>
  <auth-layout>
    <template v-slot:buttons>
      <v-btn rounded x-large dark color="light-green" @click="login">로그인</v-btn>
      <v-btn rounded x-large dark color="light-green" @click="signup">회원가입</v-btn>
    </template>
    <img id="logo" src="img/logo.svg" />
    <v-form v-model="valid" ref="form" lazy-validation autocomplete="off">
      <v-text-field
        rounded
        filled
        color="light-green"
        v-model="id"
        label="아이디"
        :rules="rules"
      />
      <v-text-field
        rounded
        filled
        color="light-green"
        v-model="pw"
        label="비밀번호"
        type="password"
        :rules="rules"
      />
    </v-form>
    <v-snackbar rounded="pill" type="error" v-model="loginErrorAlert">
      <v-icon>mdi-alert-circle</v-icon> 로그인 정보가 일치하지 않아요!
    </v-snackbar>
  </auth-layout>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      loginErrorAlert: false,
      id: '',
      pw: '',
      rules: [(v) => !!v || '입력해 주세요!'],
    };
  },
  methods: {
    login() {
      this.$refs.form.validate();
      if (this.valid) {
        this.$store
          .dispatch('login', { id: this.id, pw: this.pw })
          .then(() => {
            this.$router.push('main');
          })
          .catch(() => {
            this.loginErrorAlert = true;
          });
      }
    },
    signup() {
      this.$router.push('signup');
    },
  },
};
</script>

<style scoped>
#logo {
  max-width: 34vw;
  max-height: 34vh;
}
</style>
