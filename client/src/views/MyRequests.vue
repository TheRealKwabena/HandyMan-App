<template>
    <div class="home-page">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,700,1,0" />
        <b-row>
            <b-col col="12">
                <div class="header-container">
                    <Header :firstName="firstName" :lastName='lastName' :isHandyman="isHandy"/>
                </div>
            </b-col>
        </b-row>
      <b-row>
                <b-container fluid >
                    <div class="main-container" >
                        <b-col cols="12">
                            <Requests :requests="this.requests" :isHandy="isHandy"/>
                        </b-col>
                    </div>
                </b-container>
            </b-row>
    </div>
</template>

<script>
import { Api } from '../Api'
import Requests from '../components/Requests.vue'
import Header from '../components/ClientHeader.vue'
export default {
  name: 'MyRequests',
  data() {
    return {
      requests: [],
      message: '',
      userId: '',
      firstName: '',
      lastName: '',
      isHandy: Boolean
    }
  },
  created() {
    if (localStorage.getItem('token') === null || localStorage.getItem('user') === null) {
      this.$router.push('/login')
    }
    const searchURL = new URL(window.location).pathname
    const strs = searchURL.split('/')
    const id = strs.at(-1)
    console.log(id)
    Api.get(`/clients/${id}/requests`).then(response => {
      this.firstName = response.data.firstName
      this.lastName = response.data.lastName
      this.userId = response.data._id
      this.requests = response.data
      this.isHandy = false
    }).catch(err => {
      if (err.response.status === 500) {
        this.message = err
        console.log(err)
      }
      if (err.response.status === 404) {
        Api.get(`/handymen/${id}/requests`).then(response => {
          this.requests = response.data
          this.isHandy = true
        }).catch(err => {
          this.message = err
        })
      }
    })
  },
  mounted() {
    const searchURL = new URL(window.location).pathname
    const strs = searchURL.split('/')
    const id = strs.at(-1)
    console.log(id)
    this.userId = id
    Api.get(`/clients/${id}`)
      .then(response => {
        if (response.data === 'No such client exists!') {
          Api.get(`/handymen/${id}`)
            .then(response => {
              this.firstName = response.data.firstName
              this.lastName = response.data.lastName
            })
            .catch(error => {
              this.firstname = error
            })
        }
        this.firstName = response.data.firstName
        this.lastName = response.data.lastName
      })
      .catch(error => {
        this.firstname = error
      })
  },
  components: {
    Requests,
    Header
  }
}
</script>

<style scoped>
.home-page {
  align-self: start;
}
.main-container {
display: flex;
background-image: url('../../assets/electricianpic.jpg');
background-size: cover;
min-height: 1000px;
padding-top: 70px;
padding-left: 5px;
padding-right: 5px;
height: 100%;
align-items: flex-start;
}

.title{
font-size: 50px;
}
</style>
