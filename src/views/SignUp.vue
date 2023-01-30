<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-title">SignUp</v-card-title>
        <v-card-subtitle class="login-subtitle"
          >ユーザ情報をご入力ください</v-card-subtitle
        >
        <v-btn to="/login" color="light-blue" text>ログイン画面はこちら</v-btn>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="UserName"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :counter="10"
            label="Password"
            type="password"
          ></v-text-field>

          <v-btn
            color="success"
            class="login-btn"
            :disabled="isValid"
            @click="submit"
          >
            SignUp
          </v-btn>
          <v-btn> CLEAR </v-btn>
          <v-alert
            dense
            outlined
            type="error"
            class="err-msg"
            v-if="errorMessage"
          >
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "名前を入力してください",
      (v) => (v && v.length <= 10) || "名前は10文字以内で入力してください",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください",
      (v) => /.+@.+\..+/.test(v) || "メールアドレスが不正です",
    ],
    password: "",
    errorMessage: "",
    message: "",
  }),
  computed: {
    isValid() {
      return !this.valid;
    },
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    submit() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((res) => {
          console.log("success", res);
          localStorage.message = "新規作成に成功しました";
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          this.errorMessage = "ユーザの新規登録に失敗しました";
        });
    },
  },
};
</script>

<style scoped>
.login-form {
  margin: 50px;
  padding: 30px;
}
.login-box {
  width: 50%;
  margin: 0 auto;
  padding: 30px;
}

.login-title {
  display: inline;
  padding-bottom: 30px;
}
.login-subtitle {
  margin-top: 20px;
}

.login-btn {
  margin: 20px;
}

.err-msg {
  margin-top: 20px;
}
</style>
