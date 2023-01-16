import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      api: "https://vue3-course-api.hexschool.io/v2",
      path: "j437437",
      products: [],
      isNew: false,
      // tempProduct 裡為什麼要另外設一個 imagesUrl: []
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    checkAdmin() {
      const url = `${this.api}/api/user/check`;
      axios
        .post(url)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "login.html";
        });
    },
    getData() {
      const url = `${this.api}/api/${this.path}/admin/products/all`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Bootstrap5 互動視窗 Modal
    openModal(effect, item) {
      // 建立新的產品時先清空 tempProduct 內的資料，避免上一筆沒儲存的資料仍顯示出來
      // 用展開的語法來複製，如果直接寫 this.tempProduct = item，就會直接動到原本的展品資料
      if (effect === "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (effect === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (effect === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    deleteItem() {
      const url = `${this.api}/api/${this.path}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          //成功後關掉互動視窗，並重新取得資料
          delProductModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateItem() {
      // 因為這邊的url會重新賦值，所以用let沒有用const
      let url = `${this.api}/api/${this.path}/admin/product`;
      let http = "post";
      if (!this.isNew) {
        http = "put";
        url = `${this.api}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      }

      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    //取出token並讓axios默認帶入
    //記得test2要改為cookie裡的token名稱!!
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();

    //打開 productModal，{ keyboard: false } 讓按下 esc 時視窗不會關掉
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      { keyboard: false }
    );

    //打開 delProductModal
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      { keyboard: false }
    );
  },
}).mount("#app");
