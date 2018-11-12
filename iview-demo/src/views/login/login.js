import {mapActions} from 'vuex';
import {setCookie} from 'common/js/cookie.js';

export default {
  data () {
    return {
      userName: '',
      password: '',
      errMessage: ''
    };
  },
  created () {
  },
  methods: {
    ...mapActions([
      'saveLoginUser'
    ]),
    loginConfirm () { // 登录事件
      this._confirmLogin();
    },
    keydownFn (event) {
      if (event.keyCode === 13) {
        this._confirmLogin();
      }
    },
    _confirmLogin () {
      if (!this.userName || !this.password) {
        this.errMessage = '请输入用户名密码';
      } else if (this.userName === 'admin' && this.password === '123456') { // 判断用户名密码是否为空
        this.errMessage = '';
        setCookie('loginUser', JSON.stringify({userName: this.userName, password: this.password}, 30));
        this.saveLoginUser({userName: this.userName, password: this.password});
        if (this.$route.query.redirect) { // 跳转到指定链接
          this.$router.push({path: this.$route.query.redirect});
        } else {
          this.$router.push({path: '/eventList'});
        }
      } else {
        this.errMessage = '用户名密码错误';
      }
    }
  }
};
