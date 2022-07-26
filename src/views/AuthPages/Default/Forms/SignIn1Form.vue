<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <ValidationProvider vid="email" name="E-mail" rules="required|email" v-slot="{ errors }">
        <div class="form-group ">
          <p style="color:white"><strong>Correo electrónico</strong></p>
          <input type="email" :class="'form-control mb-0 input-sing' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="emailInput" aria-describedby="emailHelp"
                 v-model="user.usr_email" placeholder="Correo" required>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="password" name="Password" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <p style="color:white"><strong>Contraseña</strong></p>
          <input type="password"  :class="'form-control mb-0 input-sing' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="passwordInput"
                 v-model="user.usr_password" placeholder="Contraseña" required>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="d-flex justify-content-between ml-4">
        <b-form-checkbox class="form-check-input col-6" type="checkbox" v-model="recordarme" id="flexCheckChecked" ><p style="color:white"><strong>Recordarme</strong></p></b-form-checkbox>
        <router-link to="/auth/password-reset1" class="pt-1">
            ¿Olvidaste tu contraseña?
        </router-link>
      </div>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary mt-3" :class="estado">{{ texto }}</button>
      </div>
      <!-- <div class="sign-info d-flex justify-content-center">
        <span class="dark-color d-inline-block line-height-2">
          ¿No tienes cuenta?
          <router-link to="/dark/auth/sign-up1" class="iq-waves-effect pr-4" v-if="$route.meta.dark">
            Crear una cuenta
          </router-link>
          <router-link to="/auth/sign-up1" class="iq-waves-effect pr-4" v-else>
            Crear una cuenta
          </router-link>
        </span>
      </div> -->
    </form>
  </ValidationObserver>
</template>

<script>
import Vue from 'vue'
// import SocialLoginForm from './SocialLoginForm'
import { mapGetters } from 'vuex'
import axios from 'axios'
import auth from '@/logic/auth'
import { Base64 } from 'js-base64'

export default {
  name: 'SignIn1Form',
  // components: { SocialLoginForm },
  props: ['formType', 'email', 'password'],
  data: () => ({
    user: {
      usr_email: '',
      usr_password: ''
    },
    recordarme: false,
    texto: 'Iniciar Sesión',
    estado: '',
    intentos: '',
    perfilAdministrativo: [1, 2],
    perfilCliente: 11,
    errores: []
  }),
  mounted () {
    const email = this.getCookie('email-jur')
    const password = this.getCookie('pass-jur')
    if (email && password) {
      this.user.usr_email = email
      this.user.usr_password = Base64.decode(password)
      this.recordarme = true
    } else {
      this.user.usr_email = this.$props.email
      this.user.usr_password = this.$props.password
    }
    this.user.nombre_completo = ''
    this.user.id = ''
  },
  computed: {
    ...mapGetters({
      stateUsers: 'Setting/usersState'
    })
  },
  methods: {
    getCookie (key) {
      if (document.cookie.length > 0) {
        let start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          let end = document.cookie.indexOf(';', start)
          if (end === -1) {
            end = document.cookie.length
            return Base64.decode(document.cookie.substring(start, end))
          } else {
            return document.cookie.substring(start, end)
          }
        }
      }
      return ''
    },
    setCookie (cName, value) {
      document.cookie = cName + '=' + value + ';expires=Fri, 31 Dec 9999 23:59:59 GMT'
    },
    onSubmit () {
      // this.handleLogin()
      this.login()
      this.texto = 'Iniciando sesión...'
      this.estado = 'disabled'
    },
    handleLogin () {
      axios.get('/sanctum/csrf-cookie').then(response => {
        this.login()
      })
    },
    login () {
      axios.post('/login', this.user).then(res => {
        if (res.data.status_code === 200) {
          const token = res.data.token
          if (this.recordarme) {
            this.setCookie('email-jur', this.user.usr_email)
            const password = Base64.encode(this.user.usr_password)
            this.setCookie('pass-jur', password)
          } else {
            this.setCookie('email-jur', '')
            this.setCookie('pass-jur', '')
          }
          localStorage.setItem('access_token', token)
          const redirect = localStorage.getItem('redirect')
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          auth.setUserLogged(res.data.user)
          if (redirect) {
            localStorage.removeItem('redirect')
            this.$router.push({ path: redirect })
          } else if (this.perfilAdministrativo.includes(res.data.user.user_profile)) {
            this.$router.push({ name: 'process.list' })
          } else if (this.perfilCliente === res.data.user.user_profile) {
            this.$router.push({ name: 'cases.mylist' })
          } else {
            this.$router.push({ name: 'dashboard.home-2' })
          }
        } else {
          this.texto = 'Iniciar Sesión'
          this.estado = ''
          Vue.swal('Credenciales no validas')
        }
      })
        .catch((err) => {
          this.texto = 'Iniciar Sesión'
          this.estado = ''
          this.errores = err
          Vue.swal('Ups, ocurrió un error, intente más tarde')
        })
    }
  }
}
</script>
