<template>
  <div class="login bg" @keydown.stop="keydownFn">
    <div class="mock">
      <div class="content">
        <p class="title">事件管理平台</p>
        <div id="form-content">
          <Input prefix="ios-contact" v-model="userName" size="large" placeholder="请输入用户名"/>
          <Input prefix="md-lock" v-model="password" size="large" placeholder="请输入用户名"/>
          <Button type="primary" @click="loginConfirm" size="large">登录</Button>
          <p class="error-msg">{{errMessage}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import login from './login.js';
  export default {
    ...login
  };
</script>

<style lang="stylus" src="./login.styl" scoped></style>


