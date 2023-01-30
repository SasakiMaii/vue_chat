<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col v-for="card in cards" :key="card" cols="12">
            <v-card>
              <v-subheader>{{ card }}</v-subheader>

              <!--  eslint-disable  -->
              <v-list two-line>
                <template v-for="data in messages">
                  <v-list-item>
                    <v-list-item-avatar color="grey darken-1">
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <!-- <v-list-item-title>Message {{ n }}</v-list-item-title> -->

                      <v-list-item-subtitle class="message">
                        {{ data.message }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider
                    v-if="n !== 6"
                    :key="`divider-${n}`"
                    inset
                  ></v-divider>
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
        class="mr-4"
        type="submit"
        :disabled="invalid"
        @click="submit"
      >
        送信
      </v-btn>
      <v-btn @click="clear">
        クリア
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
export default {
  created() {
    this.user_id = this.$route.query.user_id;
    console.log(this.user_id);
  },
  data: () => ({
    messages:[
      {message:"message1"},
      {message:"message2"},
      {message:"message3"},
      {message:"message4"},
  ],
    body:"",
    user_id: "",
    cards: ["Today"],
    drawer: null,
    links: [
      ["mdi-inbox-arrow-down", "Inbox"],
      ["mdi-send", "Send"],
      ["mdi-delete", "Trash"],
      ["mdi-alert-octagon", "Spam"],
    ],
  }),
  computed:{
    //変更を検知して実行
    invalid(){
      if(!this.body){
        return true;
      }
      return false;
    },
  },
  methods:{
    clear(){
      this.body="";
    },
    submit(){
      this.messages.unshift({message:this.body});
      this.body="";
    },
  }
};
</script>

<style scoped>
.message {
  text-align: left;
}
</style>
