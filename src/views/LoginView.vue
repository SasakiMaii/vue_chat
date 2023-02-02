<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle class="login-subtitle"
          >ユーザ情報をご入力ください</v-card-subtitle
        >
        <v-btn to="/signup" color="light-blue" text>新規登録はこちら</v-btn>
        <v-form ref="form" v-model="valid" lazy-validation>
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

          <v-btn color="success" class="login-btn" :disabled="isValid" @click="submit">
            LOGIN
          </v-btn>
          <v-btn> CLEAR </v-btn>
          <v-alert dense text type="success" class="success-msg" v-if="message">{{ message }}</v-alert>
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
import firebase from 'firebase';

export default {
  data: () => ({
    valid: true,
    name: "",
    passRules: [
      (v) => !!v || "パスワードを入力してください",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください",
      (v) => /.+@.+\..+/.test(v) || "メールアドレスが不正です",
    ],
    password: "",
    message:"",
    errorMessage:"",
  }),
  mounted() {
    if (localStorage.message) {
      this.message = localStorage.message;
      localStorage.message = "";
    }},
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
    submit(){
      firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(res=>{
        console.log('success')
        console.log(res)
        console.log(res.user)

        const auth={
          displayName:res.user.displayName,
          email:res.user.email,
          uid:res.user.uid,
          refreshToken:res.user.refreshToken,
          photoURL:res.user.photoURL
        }
        console.log(auth)
        sessionStorage.setItem('user',JSON.stringify(auth))
        this.$router.push('/')
      }).catch(err=>{
        console.log(err,'エラー')
        this.errorMessage='ログインに失敗しました'
      })
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

.success-msg{
  margin-top: 20px;
}
.err-msg {
  margin-top: 20px;
}
</style>
