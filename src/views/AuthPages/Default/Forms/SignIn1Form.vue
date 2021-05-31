<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <ValidationProvider vid="email" name="E-mail" rules="required|email" v-slot="{ errors }">
        <div class="form-group ">
          <label for="emailInput">Correo electrónico</label>
          <input type="email" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="emailInput" aria-describedby="emailHelp"
                 v-model="user.usr_email" placeholder="Correo" required>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="password" name="Password" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="passwordInput">Contraseña</label>
          <router-link to="/auth/password-reset1" class="float-right">
            ¿Olvidó la contraseña?
          </router-link>
          <input type="password"  :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="passwordInput"
                 v-model="user.usr_password" placeholder="Contraseña" required>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="d-inline-block w-100">
        <div class="custom-control custom-checkbox d-inline-block mt-2 pt-1">
          <input type="checkbox" class="custom-control-input" :id="formType">
          <label class="custom-control-label" :for="formType">Recuerdame</label>
        </div>
        <button type="submit" class="btn btn-primary float-right">Iniciar Sesión</button>
      </div>
      <!--<div class="sign-info">
          <span class="dark-color d-inline-block line-height-2">
            No tienes una cuenta?
            <router-link to="/dark/auth/sign-up1" class="iq-waves-effect pr-4" v-if="$route.meta.dark">
              Registrate
            </router-link>
            <router-link to="/auth/sign-up1" class="iq-waves-effect pr-4" v-else>
              Registrate
            </router-link>
          </span>
        <social-login-form></social-login-form>
      </div>-->
    </form>
  </ValidationObserver>
</template>

<script>
import Vue from 'vue'
// import SocialLoginForm from './SocialLoginForm'
import { mapGetters } from 'vuex'
import axios from 'axios'
import auth from '@/logic/auth'

export default {
  name: 'SignIn1Form',
  // components: { SocialLoginForm },
  props: ['formType', 'email', 'password'],
  data: () => ({
    user: {
      usr_email: '',
      usr_password: ''
    }
  }),
  mounted () {
    this.user.usr_email = this.$props.email
    this.user.usr_password = this.$props.password
    this.user.nombre_completo = ''
    this.user.id = ''
  },
  computed: {
    ...mapGetters({
      stateUsers: 'Setting/usersState'
    })
  },
  methods: {
    onSubmit () {
      // this.handleLogin()
      this.login()
    },
    handleLogin () {
      axios.get('/sanctum/csrf-cookie').then(response => {
        console.log(response)
        this.login()
      })
    },
    login () {
      axios.post('/login', this.user).then(res => {
        console.log(res.data)
        if (res.data.status_code === 200) {
          // this.user.nombre_completo = res.data.nombre_completo
          // this.user.id = res.data.user_id
          const token = res.data.token
          localStorage.setItem('access_token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          auth.setUserLogged(res.data.user)
          this.$router.push({ name: 'dashboard.home-1' })
        } else {
          Vue.swal('Credenciales no validas')
        }
      })
    }
  }
}
</script>
