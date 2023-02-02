<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" dark v-bind="attrs" v-on="on">
          ルームを新規作成
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">新規作成</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="ルーム名*"
                  required
                  v-model="name"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  truncate-length="15"
                  label="ルーム画像*"
                  accept="image/jpeg,image/jpg,image/png"
                  v-model="file"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="onSubmit"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";
export default {
  data: () => ({
    dialog: false,
    name: "",
    file: null,
  }),
  methods: {
    async onSubmit() {
      this.dialog = false;
      let thumbnailUrl = "";
      if (this.file) {
        const filePath = `/room/${this.file.name}`;
        await firebase
          .storage()
          .ref()
          .child(filePath)
          .put(this.file)
          .then(async (snapshot) => {
            thumbnailUrl = await snapshot.ref.getDownloadURL();
            console.log("thumbnail", thumbnailUrl);
          });
      }
      const roomRef = firebase.firestore().collection("rooms");
      await roomRef
        .add({
          name: this.name,
          thumbnailUrl: thumbnailUrl,
          createdAt: firebase.firestore.Timestamp.now(),
        })
        .then((res) => {
          console.log(res);
          this.dialog = false;
          this.$router.go({path: this.$router.currentRoute.path, force: true})
        });
    },
    async getRooms() {
      
    },
  },
};
</script>
