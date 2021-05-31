<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Creación de Usuario</h4>
              </template>
              <template v-slot:body>
                <div class="new-user-info">
                  <b-row>
                    <b-form-group class="col-md-6" label="Primer Nombre:" label-for="usr_name_first">
                      <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="user.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Nombre invalido</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="usr_name_first">
                      <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="user.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Segundo Nombre invalido</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Primer Apellido:" label-for="usr_lastname_first">
                      <ValidationProvider name="Primer Apellido" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="user.usr_lastname_first" type="text" placeholder="Primer Apellido" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Primer Apellido invalido</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Segundo Apellido:" label-for="usr_lastname_first">
                      <ValidationProvider name="Segundo Apellido" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="user.usr_lastname_last" type="text" placeholder="Segundo Apellido" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Segundo Apellido invalido</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                  </b-row>
                  <hr>
                  <b-row>
                  <b-form-group class="col-md-6" label="Fecha de Nacimiento" label-for="usr_birthday">
                    <ValidationProvider name="Fecha de nacimiento" rules="required" v-slot="{ errors }">
                      <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>Fecha de nacimiento invalida</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Nombre de Usuario:" label-for="uname">
                    <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_username" type="text" placeholder="Nombre de Usuario" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>Nombre de Usuario invalido</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Correo Electronico:" label-for="uname">
                    <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>Correo electrónico invalido</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Perfil de Usuario:" label-for="selectuserrole">
                    <ValidationProvider name="Perfil de Usuario" rules="required" v-slot="{ errors }">
                      <b-form-select plain v-model="user.usr_role_id" :options="roles" id="selectuserrole" :class="(errors.length > 0 ? ' is-invalid' : '')">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>Seleccione un perfil</b-form-select-option>
                        </template>
                      </b-form-select>
                      <div class="invalid-feedback">
                        <span>Debe de seleccionar una opción</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Tipo de identificación:" label-for="selectypeid">
                    <b-form-select plain v-model="user.usr_identification_type" :options="ids" id="selectypeid">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione un tipo de id</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Identificación:" label-for="mobno">
                    <ValidationProvider name="Identificación" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_identification" type="text" placeholder="Identificación" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                </b-row>
                <b-button variant="primary" type="submit">Agregar Usuario</b-button>
              </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        </form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>

</template>
<script>
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  name: 'AddUser',
  mounted () {
    xray.index()
  },
  data () {
    return {
      user: {
        usr_name_first: '',
        usr_lastname_first: '',
        usr_name_last: '',
        usr_lastname_last: '',
        usr_identification_type: 1,
        usr_identification: '',
        usr_birthday: '',
        usr_username: '',
        usr_password: '123456',
        usr_email: '',
        profile_image: require('../../assets/images/user/11.png'),
        city: '',
        usr_role_id: '',
        usr_accept_terms: 1
      },
      roles: [
        { text: 'Administrador', value: 1 },
        { text: 'Abogado', value: 2 }
      ],
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 }
      ],
      users: []
    }
  },
  computed: {
    fullName: function () {
      return this.user.usr_name_first + ' ' + this.user.usr_lastname_first
    }
  },
  methods: {
    previewImage: function (event) {
      const input = event.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.user.profile_image = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    onSubmit () {
      this.addUser()
    },
    addUser () {
      console.log('weee', this.user.usr_email)
      axios.post('/register', this.user).then(res => {
        console.log(res.data.credentials)
        if (res.data.status_code === 200) {
          Vue.swal('Usuario agregado correctamente')
          this.$router.push({ name: 'doctor.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    }
  }
}
</script>
