<template>
  <div id="login-page">
    <p class="sign-in">Log In To Your Account</p>
    <b-tabs content-class="mt-3" align="center">
      <b-tab title="Client" active variant="danger">
        <form class="sign-in-form" id="email">
            <input type='email' v-model="email" placeholder='Email'>
        </form>
        <form class="sign-in-form" id="password">
            <input type='password' v-model="password" placeholder='Password'>
        </form>
        <a href='/signup'><p class="sign-up"><u>Do not have an account?</u></p></a>
        <b-row>
          <b-col cols = "12" class = "sign-in-btn-container">
            <button class="sign-in-btn" @click="signInClient">Sign In</button>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="Handyman">
        <form class="sign-in-form" id="email">
            <input type='email' v-model="email" placeholder='Email'>
        </form>
        <form class="sign-in-form" id="password">
            <input type='password' v-model="password" placeholder='Password'>
        </form>
        <a href='/signup'><p class="sign-up"><u>Do not have an account?</u></p></a>
        <b-row>
          <b-col cols = "12" class = "sign-in-btn-container">
            <button class="sign-in-btn" @click="signInHandy">Sign In</button>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
    <b-modal id="field-empty" title="Incomplete">
          <p class="my-4">Please fill in all fields</p>
    </b-modal>
    <b-modal id="wrong-details" title="Wrong Password">
          <p class="my-4">Invalid Username or Password.</p>
    </b-modal>
  </div>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'SignInBox',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signInClient() {
      if (this.email === '' || this.password === '') {
        this.$bvToast.toast('Please try again.', {
          title: 'Some fields are empty',
          variant: 'warning',
          solid: true
        })
      } else {
        const auth = { email: this.email, password: this.password }
        Api.post('/auth/signin/clients', auth)
          .then(response => {
            if (response.status === 200) {
              localStorage.setItem('token', response.data.token)
              localStorage.setItem('user', response.data)
            }
            this.$router.push(`/account/${response.data._id}`)
          })
          .catch((err) => {
            if (err.response.status === 401 || err.response.status === 404) {
              this.$bvToast.toast('Please try again.', {
                title: 'Username or Password is incorrect.',
                variant: 'danger',
                solid: true
              })
            } else {
              console.log(err)
            }
          })
      }
    },
    signInHandy() {
      if (this.email === '' || this.password === '') {
        this.$bvToast.toast('Please try again.', {
          title: 'Some fields are empty',
          variant: 'warning',
          solid: true
        })
      } else {
        const auth = { email: this.email, password: this.password }
        Api.post('/auth/signin/handymen', auth)
          .then(response => {
            if (response.status === 200) {
              localStorage.setItem('token', JSON.stringify(response.data.token))
              localStorage.setItem('user', JSON.stringify(response.data))
            }
            this.$router.push(`/account/${response.data._id}`)
          })
          .catch((err) => {
            if (err.response.status === 401 || err.response.status === 404) {
              this.$bvToast.toast('Please try again', {
                title: 'Username or Password is incorrect.',
                variant: 'danger',
                solid: true
              })
            } else {
              console.log(err)
            }
          })
      }
    }
  }
}
</script>

<style scoped>
div#login-page {
  width: 100%;
  height: 100%;
}

.sign-in {
    font-size: 30px;
}

.information-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    min-height: 400px;
}

.sign-in-form {
    min-height: 35px;
    border-radius: 10px;
    margin: 10px;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    border: 0.5px solid grey;
    color: black;
    margin-bottom: 20px;
}

.right-container {
    background-color: rgba(100, 0, 0, 0.4);
}

.sign-in-btn {
    border-radius: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border: 0.5px solid grey;
    color: black;
    background-color: white;
    flex-shrink: 1;
}

.sign-in-btn:hover {
    border-radius: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 40px;
    padding-right: 40px;
    border: none;
    color: black;
    background-color:rgba(247, 233, 118, 0.5);
}

input {
  text-align: left;
  padding-top:10px;
  padding-bottom: 10px;
}

.sign-in-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

}
</style>
