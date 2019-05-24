<template>
  <h1>LOGIN....</h1>
</template>
<script>
  export default {
    mounted () {
      const url = window.location.href
      if (url.indexOf('access_token') !== -1) {
        let arr1 = url.split('#')[1].split('&')
        const params = {}
        for (let i = 0; i < arr1.length; i++) {
          let keyArr = arr1[i].split('=')
          params[keyArr[0]] = keyArr[1]
        }
        console.log(params)

        if (params['access_token']) {
          localStorage.setItem('token', params['access_token'])
          this.$router.push('/dashboard/projects')
        } else {
          this.login()
        }
      } else {
        this.login()
      }
    },
    methods: {
      login () {
        window.location.href = `http://sso.jinuo.me/auth/realms/JinuoPrivateNetwork/protocol/openid-connect/auth?response_type=token&client_id=mocker&redirect_uri=${window.location.href}`
      }
    }
  }
</script>
