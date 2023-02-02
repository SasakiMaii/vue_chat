<template>
  <v-app id="inspire">
    <SideBar />
    <v-app-bar app shrink-on-scroll>
      <v-toolbar-title>トークルーム</v-toolbar-title>
      <CreateRoom/>
      <v-spacer></v-spacer>
      
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="room in rooms" :key="room.id" cols="4">
            <router-link :to="{ path: '/chat', query: { room_id: room.id } }">
              <v-avatar size="128" >
                <img
        src="https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqG8spqmAR9mtgZFFDZC7jXRU1K3qSP3F4LaDz0x3FBI2Z9XvDgXwAFjKXS3pknzQm-a7b0BnTdLCbzPjAtE2nF7gNmHJv2cf0zgWS172JaTmFfq3ZkviQ5He3fo6cz_NzXVuIuaQQbJkz2g8o-eRzHRv2zlppCROy_f0gOilWhRIblWlf_jL68TogjX69WtCDdCd4y1kKNRyNbHnUY3o2wCIU0EG80NKeHGlpMmkhC6Pe/x507441258.1.jpg"
        alt="John" v-if="!room.thumbnailUrl">
      <img :src="room.thumbnailUrl" alt="" v-if="room.thumbnailUrl">
    </v-avatar>
    <p>{{ room.name }}</p>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
import SideBar from "@/components/layouts/SideBar.vue";
import CreateRoom from "@/components/modal/CreateRoom.vue";
export default {
  components: {
    SideBar,
    CreateRoom
  },
  data: () => ({
    rooms: [],
  }),
  mounted() {
    this.getRooms();
  },
  methods: {
    async getRooms() {
      this.rooms = [];
      const roomRef = firebase.firestore().collection("rooms");
      const snapShot = await roomRef.get();

      snapShot.forEach((doc) => {
        const data={...doc.data()}
        data.id=doc.id
        console.log(data,'data');
        this.rooms.push(data);
      });
    },
  },
};
</script>
