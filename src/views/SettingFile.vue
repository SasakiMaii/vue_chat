<template>
  <v-app id="inspire">
    <SideBar />
    <v-app-bar app shrink-on-scroll>
      <v-toolbar-title>設定</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-card
        class="overflow-hidden container"
        color="blue-grey lighten-2"
        dark
      >
        <v-toolbar flat color="blue-grey">
          <v-icon>mdi-account</v-icon>
          <v-toolbar-title class="font-weight-light">
            ユーザー情報
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-grey darken-3"
            fab
            small
            @click="isEditing = !isEditing"
          >
            <v-icon v-if="isEditing"> mdi-close </v-icon>
            <v-icon v-else> mdi-pencil </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            :disabled="!isEditing"
            color="white"
            label="名前"
            v-model="name"
          ></v-text-field>
          <v-text-field
            :disabled="!isEditing"
            color="white"
            label="メールアドレス"
            v-model="email"
          ></v-text-field>
        </v-card-text>
        <!-- <v-divider></v-divider> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!isEditing" color="success" @click="save">
            ユーザ情報を変更
          </v-btn>
        </v-card-actions>
        <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
          ユーザ情報の変更が完了しました。
        </v-snackbar>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
import SideBar from "@/components/layouts/SideBar.vue";
export default {
  components: {
    SideBar,
  },
  data: () => ({
    rooms: [],
    name: "",
    email: "",
    hasSaved: false,
    isEditing: null,
    model: null,
  }),
  mounted() {
    this.getRooms();
    this.getUser();
  },
  methods: {
    async getRooms() {
      this.rooms = [];
      const roomRef = firebase.firestore().collection("rooms");
      const snapShot = await roomRef.get();

      snapShot.forEach((doc) => {
        // const data={
        //   name:doc.data().name,
        //   thumbnailUrl:doc.data().createdAt
        // }
        const data = { ...doc.data() };
        data.id = doc.id;
        // console.log(data);
        this.rooms.push(data);
      });
    },
    async getUser() {
      firebase.auth().onAuthStateChanged((user) => {
        // console.log(user.displayName, user.email);
        // console.log("user", user);
        this.name = user.displayName;
        this.email = user.email;
      });
    },
    customFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.abbr.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    async save() {
      const user = firebase.auth().currentUser;
      this.isEditing = !this.isEditing;
      this.hasSaved = true;
      await user
        .updateEmail(this.email)
        .then((res) => {
          console.log("OK",res)
        })
        .catch((error) => {
          console.log('error',error)
        });
     await user.updateProfile({
        displayName:this.name
      })
      console.log(user)
      this.$router.go({path: this.$router.currentRoute.path, force: true})
    },
  },
};
</script>

<style scoped>
.container {
  width: 70%;
}
</style>
