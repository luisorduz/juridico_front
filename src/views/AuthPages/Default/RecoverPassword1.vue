<template>
  <div>
    <h1 class="mb-0" style="color:white">Restablecer Contraseña</h1>
    <p style="color:white">Ingrese su dirección de correo electrónico y le enviaremos un correo electrónico con instrucciones para restablecer su contraseña.</p>
    <div class='notificacion' v-if="correoEnviado">
        <i class='float-right fas fa-times cerrar' v-on:click="correoEnviado=false"></i>
        <p>Se ha enviado un correo para restablecer su contraseña. Si no lo encuentra en el inbox principal, por favor verifique en la carpeta de spam.</p>
    </div>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <ValidationProvider type="email" vid="email" name="Correo electrónico" rules="required" v-slot="{ errors }">
          <div class="form-group">
            <div class="form-group">
              <label for="name" style="color:white">Correo electrónico</label>
              <input type="email" v-model="email" :class="'form-control mb-0 input-sing' +(errors.length > 0 ? ' is-invalid' : '')"
                    id="name" aria-describedby="emailHelp" placeholder="Correo electrónico registrado">
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </div>
          </div>
        </ValidationProvider>
        <div class="d-inline-block w-100">
          <button type="submit" class="btn btn-primary float-right" :class="estado">{{ texto }}</button>
          <b-button @click="cancelar" class="float-right iq-bg-danger mr-3" variant="none" size="lg" >Cancelar</b-button>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'RecoverPassword1',
  data: () => ({
    email: '',
    texto: 'Restablecer Contraseña',
    estado: '',
    correoEnviado: false
  }),
  methods: {
    onSubmit () {
      this.texto = 'Enviando correo...'
      this.estado = 'disabled'
      axios.post('/recuperarPassword', { 'email': this.email }).then(res => {
        if (res.data.status_code === 200) {
          this.estado = ''
          this.texto = 'Restablecer Contraseña'
          Vue.swal(res.data.message)
          this.correoEnviado = true
        } else {
          this.texto = 'Restablecer Contraseña'
          this.estado = ''
          Vue.swal(res.data.message)
        }
      })
    },
    cancelar () {
      this.$router.push({ path: `/auth/sign-in1` })
    }
  }
}
</script>
