<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar color="indigo">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            accept="image/jpeg,image/jpg,image/png"
            @change="updateIcon"
          />
          <v-icon dark @click="changeIcon" v-if="!photoUrl">
            mdi-account-circle
          </v-icon>
          <img :src="photoUrl" alt="" v-if="photoUrl" @click="changeIcon" />
        </v-avatar>

        <div class="username" >{{ name }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text, to] in links"
          :key="icon"
          :to="to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-icon><v-icon color="blue">mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
    this.photoUrl = this.auth.photoURL;
    firebase.auth().onAuthStateChanged((user) => {
        console.log("user", user);
        this.name = user.displayName;
      });
  },
  data: () => ({
    photoUrl: "",
    auth: null,
    drawer: null,
    links: [
      ["mdi-account-voice", "トークルーム", "/"],
      ["mdi-cog", "設定", "/setting"],
    ],
    name:'',
  }),
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then((res) => {
          console.log(res);
          localStorage.message = "ログアウトに成功しました";
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeIcon() {
      this.$refs.fileInput.click();
    },
    updateIcon() {
      const user = this.getAuth();
      if (!user) {
        sessionStorage.removeItem("user");
        this.$router.push("/login");
      }
      const file = this.$refs.fileInput.files[0];

      console.log(file);
      const filePath = `/user/${file.name}`;
      firebase
        .storage()
        .ref()
        .child(filePath)
        .put(file)
        .then(async (snapShot) => {
          const photoUrl = await snapShot.ref.getDownloadURL();
          console.log(photoUrl);
          return firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              user.updateProfile({ photoURL: photoUrl });
              this.auth.photoURL = photoUrl;
              sessionStorage.setItem("user", JSON.stringify(this.auth));
              this.photoUrl = photoUrl;
            }
          });
        });
    },
    getAuth() {
      return firebase.auth().onAuthStateChanged((user) => {
        return user;
      });
    },
  },
};
</script>
