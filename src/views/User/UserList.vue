<template>
  <b-container fluid>
    <div>
      <iq-card>
        <template v-slot:headerTitle>
          <h4 class="card-title">Usuarios</h4>
        </template>
        <template v-slot:body>
          <b-table :items="abogados" :fields="columns" striped responsive>
            <template v-slot:cell(pro_name_first)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.pro_name_first
              }}</span>
              <input
                type="text"
                v-model="data.item.pro_name_first"
                v-else
                class="form-control"
              />
            </template>
            <template v-slot:cell(pro_lastname_first)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.pro_lastname_first
              }}</span>
              <input
                type="text"
                v-model="data.item.pro_lastname_first"
                v-else
                class="form-control"
              />
            </template>
            <template v-slot:cell(pro_identificacion)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.pro_identificacion
              }}</span>
              <input
                type="text"
                v-model="data.item.pro_identificacion"
                v-else
                class="form-control"
              />
            </template>
            <template v-slot:cell(pro_email)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.pro_email
              }}</span>
              <input
                type="text"
                v-model="data.item.pro_email"
                v-else
                class="form-control"
              />
            </template>
            <template #cell(show_details)="row">
              <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                {{ row.detailsShowing ? 'Ocultar' : 'Ver'}} Procesos Juridicos
              </b-button>
            </template>

            <template #row-details="row">
              <b-card>
                <br>
                <br>
                <b>Procesos Juridicos Asignados:</b>
                <br>
                <br>
                <b-row class="col-md-12">
                  <b-col class="col-md-2"><b>Número de Radicado:</b></b-col>
                    <span v-if="row.item.editable!=0">{{
                      row.item.prore_num_radicado
                    }}</span>
                    <input
                      type="text"
                      v-model="row.item.prore_num_radicado"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-button size="sm" @click="row.toggleDetails">Ocultar Procesos Juridicos</b-button>
              </b-card>
            </template>
          </b-table>
        </template>
      </iq-card>
    </div>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import 'datatables.net'
import 'datatables.net-bs4'
axios.defaults.baseURL = 'http://localhost:8000/api'
export default {
  name: 'UserList',
  data () {
    return {
      abogados: [],
      user: {},
      columns: [
        { label: 'Nombre', key: 'pro_name_first', class: 'text-left' },
        { label: 'Apellido', key: 'pro_name_las', class: 'text-left' },
        {
          label: 'Identificación',
          key: 'pro_identificacion',
          class: 'text-left'
        },
        { label: 'Correo electronico', key: 'pro_email', class: 'text-left' },
        { label: 'Ver Procesos', key: 'show_details', class: 'text-left' }
      ],
      rows: [
        {
          id: 1,
          usr_username: 'Tiger Nixon',
          usr_identification: 'System Architect',
          usr_email: 'wa@wa.com'
        },
        {
          id: 2,
          usr_username: 'Garrett Winters',
          usr_identification: 'Accountant',
          usr_email: 'wa@wa.com'
        },
        {
          id: 3,
          usr_username: 'Ashton Cox',
          usr_identification: 'Junior Technical Author',
          usr_email: 'wa@wa.com'
        }
      ]
    }
  },
  mounted () {
    xray.index()
    this.getUsers()
  },
  methods: {
    add () {
      let obj = this.default()
      this.rows.push(obj)
    },
    default () {
      return {
        id: this.rows.length,
        name: '',
        position: '',
        office: '',
        age: '',
        start_date: '2011/04/25',
        salary: '$0',
        editable: false
      }
    },
    edit (item) {
      item.editable = 1
    },
    submit (item) {
      item.editable = 0
      console.log('putooo usr_username: ' + item)
      console.log('weeeusr_id: ', item.usr_id)
      this.user.usr_username = item.usr_username
      this.user.usr_email = item.usr_email
      axios.put('/users/update/' + item.usr_id, this.user).then(res => {
        console.log(res.data.credentials)
        if (res.data.status_code === 200) {
          this.$router.push({ name: 'doctor.list' })
        } else {
          alert('Datos no validos')
        }
      })
    },
    remove (item) {
      let index = this.rows.indexOf(item)
      this.rows.splice(index, 1)
    },
    getUsers () {
      axios.get('/professionals').then(response => {
        console.log('this.abogados: ' + this.abogados)
        this.abogados = response.data.professionals
      })
    }
  },
  firestore () {
    return {}
  },
  components: {},
  beforeMount () {},
  method: {},
  computed: {}
}
</script>
