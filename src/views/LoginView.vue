<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle class="login-subtitle">ユーザ情報をご入力ください</v-card-subtitle>
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
      
          <v-btn color="success" class="login-btn" :disabled="isValid">
            LOGIN
          </v-btn>
          <v-btn>
            CLEAR
          </v-btn>
        </v-form>
      </v-card>
    </div>
</v-app>
</template>

<script>
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
    password:""
  }),
  computed:{
    isValid(){
      return !this.valid
    }
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
  },
};
</script>

<style scoped>
.login-form{
  margin: 50px;
  padding: 30px;
}
.login-box{
  width: 50%;
  margin: 0 auto;
  padding: 30px;
}

.login-title{
  display: inline;
  padding-bottom: 30px;
}
.login-subtitle{
  margin-top: 20px;
}

.login-btn{
  margin: 20px;
}

</style>
