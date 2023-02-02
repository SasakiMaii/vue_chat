<template>
  <v-app id="inspire">
    <SideBar />
    <v-main>
      <h1>{{ room ? room.name : "" }}</h1>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col v-for="card in cards" :key="card" cols="12">
            <v-btn class="return-btn" @click="returnBtn">前の画面に戻る</v-btn>
            <v-btn @click="deleteBtn" class="talkdel-btn"
              >このトークルームを削除</v-btn
            >
            <v-card>
              <v-subheader>{{ card }}</v-subheader>

              <!--  eslint-disable  -->
              <v-list two-line>
                <template v-for="data in messages">
                  <v-list-item>
                    <v-list-item-avatar color="grey darken-1">
                      <v-img :src="data.photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <!-- <v-list-item-title>Message {{ data }}</v-list-item-title> -->

                      <v-list-item-subtitle class="message">
                        {{ data.message }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <!-- <div v-for="chat in chatId"> -->
                    <v-btn
                      color="accent"
                      elevation="2"
                      rounded
                      small
                      v-if="data.name === auth.displayName"
                      @click="messagedeleteBtn(data.id)"
                      >削除</v-btn
                    >
                    <!-- </div> -->
                  </v-list-item>

                  <v-divider v-if="data !== 6" inset></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-textarea
        v-model="body"
        class="mx-2"
        label="メッセージを送信する"
        rows="3"
        prepend-icon="mdi-comment"
        auto-grow
      ></v-textarea>
      <v-btn
        class="mr-4 submit-btn"
        type="submit"
        :disabled="invalid"
        @click="submit"
      >
        送信
      </v-btn>
      <v-btn @click="clear" class="clear-btn"> クリア </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";
import SideBar from "@/components/layouts/SideBar";

export default {
  components: {
    SideBar,
  },
  async created() {
    this.roomId = this.$route.query.room_id;
    console.log("roomId", this.roomId);
    // console.log("chatId", this.chatId);

    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    const roomDoc = await roomRef.get();
    if (!roomDoc.exists) {
      await this.$router.push("/");
    }
    this.room = roomDoc.data();
    console.log("room", this.room);

    // const snapshot = await roomRef.collection('messages').orderBy("createdAt", "asc").get()
    // snapshot.docs.map(doc => {
    //   console.log(doc.data())
    //   this.messages.push(doc.data())
    // })

    // const chatRef = firebase.firestore().collection("chats")
    // console.log("chatRef", chatRef)
    // const snapshot = await chatRef.get()
    // console.log("snapshot", snapshot)
    //
    // snapshot.forEach(doc => {
    //   console.log(doc.data())
    //   this.messages.push(doc.data())
    // })
  },
  async mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
    console.log("auth", this.auth);

    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    roomRef
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          // this.messages.id = change.doc.id ;
          // console.log("new message", change.doc.data());
          // this.messages.push(change.doc.data());
          const data = { ...change.doc.data(), id: change.doc.id };
          console.log("new message", data);
          this.messages.push(data);
        });
      });
  },
  data: () => ({
    messages: [],
    body: "",
    roomId: "",
    chatId: [],
    room: null,
    cards: [""],
    drawer: null,
    deletebtn: false,
    chats: [],
    links: [
      ["mdi-inbox-arrow-down", "Inbox"],
      ["mdi-send", "Send"],
      ["mdi-delete", "Trash"],
      ["mdi-alert-octagon", "Spam"],
    ],
    data: [],
    auth: null,
  }),
  computed: {
    invalid() {
      // console.log("invalid call", this.body);
      if (!this.body) {
        return true;
      }
      return false;
    },
  },
  methods: {
    clear() {
      // console.log("clear call.");
      this.body = "";
    },
    submit() {
      // console.log("submit call.", this.body);
      // this.messages.push({
      //   message: this.body,
      //   name: this.auth.displayName,
      //   photoURL: this.auth.photoURL,
      //   createdAt: firebase.firestore.Timestamp.now(),
      // });
      const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
      if (!this.body || !this.body.match(/\S/g)) {
        this.body = "";
        return;
      }
      roomRef
        .collection("messages")
        .add({
          message: this.body,
          name: this.auth.displayName,
          photoURL: this.auth.photoURL,
          createdAt: firebase.firestore.Timestamp.now(),
        })
        .then((result) => {
          console.log("success", result);
          this.body = "";
        })
        .catch((error) => {
          console.log("fail", error);
          alert("メッセージの送信に失敗しました");
        });
    },
    returnBtn() {
      this.$router.push("/");
    },
    async deleteBtn() {
      firebase
        .firestore()
        .collection("rooms")
        .doc(this.roomId)
        .delete()
        .then((res) => {
          // console.log("compreted!");
          console.log(res, "成功");
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
    async messagedeleteBtn(id) {
      console.log(id);
      firebase
        .firestore()
        .collection("rooms")
        .doc(this.roomId)
        .collection("messages")
        .doc(id)
        .delete()
        .then((res) => {
          console.log(res, "成功");
          this.$router.go({
            path: this.$router.currentRoute.path,
            force: true,
          });
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
  },
};
</script>

<!-- console.log(data.name ,'dataname')
console.log(this.auth.displayName,'displayname') -->
<style scoped>
.message {
  text-align: left;
  margin: 10px;
}

.return-btn {
  margin-right: 20px;
  margin-bottom: 50px;
}

.clear-btn {
  margin-bottom: 50px;
}

.submit-btn {
  margin-bottom: 50px;
}
.talkdel-btn {
  margin-bottom: 50px;
}
</style>
