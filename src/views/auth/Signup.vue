<template>
  <auth-layout>
    <template v-slot:buttons>
      <v-btn
        rounded
        x-large
        dark
        color="grey"
        @click="$router.replace('/login')"
      >
        취소
      </v-btn>
      <v-btn rounded x-large dark color="light-green" @click="signup">
        확인
      </v-btn>
    </template>
    <h1>회원가입</h1>
    <v-form v-model="valid" ref="form">
      <v-text-field
        rounded
        filled
        color="light-green"
        v-model="id"
        label="아이디"
        :rules="rules"
        append-outer-icon="mdi-rename-box"
        @click:append-outer="checkId"
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
      <v-text-field
        rounded
        filled
        color="light-green"
        v-model="nickname"
        label="이름"
        :rules="rules"
      />
      <v-text-field
        rounded
        filled
        color="light-green"
        v-model="email"
        label="이메일"
        type="email"
        :rules="emailRules"
      />
      <v-text-field
        rounded
        filled
        color="light-green"
        v-model="age"
        label="나이"
        type="number"
        :rules="rules"
      />
    </v-form>
    <v-snackbar rounded="pill" type="error" top v-model="signupErrorAlert">
      <v-icon>mdi-alert-circle</v-icon> 가입에 실패했어요!
    </v-snackbar>
    <v-snackbar rounded="pill" type="success" top color="light-green" v-model="checkIdSuccessAlert">
      <v-icon>mdi-check-circle</v-icon> {{ this.id }}: 사용할 수 있는 아이디입니다!
    </v-snackbar>
    <v-snackbar rounded="pill" type="error" top v-model="checkIdErrorAlert">
      <v-icon>mdi-alert-circle</v-icon> {{ this.id }}: 사용할 수 없는 아이디입니다.
    </v-snackbar>
  </auth-layout>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      signupErrorAlert: false,
      checkIdSuccessAlert: false,
      checkIdErrorAlert: false,
      id: '',
      pw: '',
      nickname: '',
      email: '',
      age: null,
      rules: [(v) => !!v || '입력해 주세요!'],
      emailRules: [
        (v) => !!v || '입력해 주세요!',
        (v) => /.+@.+\..+/.test(v) || '유효한 이메일 주소가 아니에요.',
      ],
    };
  },
  methods: {
    signup() {
      this.$refs.form.validate();
      if (this.valid) {
        this.$store
          .dispatch('signup', {
            id: this.id,
            pw: this.pw,
            nickname: this.nickname,
            email: this.email,
            age: this.age,
          })
          .then(() => {
            this.$router.replace('/login');
          })
          .catch(() => {
            this.signupErrorAlert = true;
          });
      }
    },
    checkId() {
      if (this.id) {
        this.$store
          .dispatch('checkId', this.id)
          .then(() => {
            this.checkIdSuccessAlert = true;
          })
          .catch(() => {
            this.checkIdErrorAlert = true;
          });
      }
    },
  },
};
</script>
