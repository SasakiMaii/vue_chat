import Vue from "vue";
import VueRouter from "vue-router";
import ChatBoard from "../views/ChatBoard.vue";
import LoginView from "../views/LoginView.vue";
import SignUp from "../views/SignUp.vue";
import RoomList from "../views/RoomList.vue";
import Setting from "../views/SettingFile.vue";

// import firebase from "firebase";

Vue.use(VueRouter);

const routes = [

  {
    path: "/chat",
    name: "ChatBoard",
    component: ChatBoard,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/",
    name: "RoomList",
    component: RoomList,
  },
  {
    path: "/setting",
    name: "Setting",
    component:Setting,
  },
];

const router = new VueRouter({
  routes,
});


//ページに対して認証が必要かどうか

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
      const user = sessionStorage.getItem('user')
      console.log(JSON.parse(user))
      if (!user) {
          next({
              path: '/login',
              query: {redirect: to.fullPath}
          })
      } else {
          next()
      }

      // firebase.auth().onAuthStateChanged((user) => {
      //     if (!user) {
      //         next({
      //             path: '/login',
      //             query: {redirect: to.fullPath}
      //         })
      //     } else {
      //         next()
      //     }
      //
      // })


  } else {
      next() // next() を常に呼び出すようにしてください!
  }
})

export default router;
