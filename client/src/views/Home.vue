<template>
  <div class='home-page'>
    <Header :userId='userId' :firstName='firstName' :lastName='lastName' :isHandyman='isHandy'/>
    <div id="body">
      <b-row>
        <b-col cols = "12" class = "container">
          <b-container fluid class="content">
              <b-row class = "main-section">
                <b-col cols = "6" class = "chart-section">
                  <p>Current Requests Overview</p>
                  <PieChart v-if="dataloaded" :userId='userId' :isHandyman='isHandy' />
                </b-col>
                <b-col cols = "6" class = "button-section">
                  <p class="title">Welcome {{ firstName }}</p>
                  <b-col cols = "12" class = "inner-section">
                    <p>Welcome to HandyApp! We provide an easy point of connection between handyman and clients for every type of service.
                    </p>
                    <b-button v-if = !isHandy pill variant="primary" @click="clientRedirect">Get Started!</b-button>
                    <b-button v-else pill variant="primary" @click="handyRedirect">See My Requests</b-button>
                  </b-col>
                </b-col>
              </b-row>
          </b-container>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import Header from '../components/ClientHeader.vue'
import PieChart from '../components/Pie.vue'

export default {
  name: 'home',
  data() {
    return {
      dataloaded: false,
      message: 'none',
      userId: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      area: '',
      isHandy: false,
      profession: null
    }
  },
  components: {
    Header,
    PieChart
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    },
    clientRedirect() {
      this.$router.push(`findhandymen/${this.userId}`)
    },
    handyRedirect() {
      this.$router.push(`requests/${this.userId}`)
    }
  },
  created() {
    if (localStorage.getItem('token') === null || localStorage.getItem('user') === null) {
      this.$router.push('/login')
    }
    const searchURL = new URL(window.location).pathname
    const strs = searchURL.split('/')
    const id = strs.at(-1)
    this.userId = id
    Api.get(`/clients/${this.userId}`)
      .then(response => {
        if (response.data === 'No such client exists!') {
          Api.get(`/handymen/${this.userId}`)
            .then(response => {
              this.firstName = response.data.firstName
              this.lastName = response.data.lastName
              this.phoneNumber = response.data.phoneNumber
              this.area = response.data.area
              this.profession = response.data.profession
              this.isHandy = true
              this.dataloaded = true
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.firstName = response.data.firstName
          this.lastName = response.data.lastName
          this.phoneNumber = response.data.phoneNumber
          this.address = response.data.address
          this.isHandy = false
          this.dataloaded = true
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
.content{
display:flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
margin-top: 50px;
padding-bottom: 30px;
background-color: white;
height: 100%;
padding-top: 10px;
margin-left: 10px;
margin-right: 10px;
max-width: 800px;
max-height: 600px;
border-radius: 20px;
}

div#body {
  padding-top: 50px;
  background-image: url('../../assets/electricianpic.jpg');
  background-size: cover;
  height: 1000px;
  width: 100%;
}

.container {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 30px;
}

.main-section {
  height: 100%;
  width: 100%;
}

.button-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}

.inner-section {
  max-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  margin-top: 20px;
}

.chart-section {
  border-right: 1px solid grey;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
</style>
