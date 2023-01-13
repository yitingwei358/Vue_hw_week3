import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  data() {
    return {
      api: "https://vue3-course-api.hexschool.io/v2",
      path: "j437437",
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const url = `${this.api}/admin/signin`;
      axios
        .post(url, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          alert(res.data.message);
          window.location = "products.html";
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
}).mount("#app");
