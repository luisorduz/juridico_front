<template>
   <b-container fluid>
    <div>
      <b-modal id="modal-lg" size="lg" title="Agendar Audiencia" @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <input type="hidden" name="hide" v-model="audiencia.aud_prore_id">
          <b-form-group
            label="Nombre"
            label-for="name-input"
            invalid-feedback="El nombre es obligatorio"
          >
            <b-form-input
              id="name-input"
              v-model="audiencia.aud_name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Asignar Abogada/o:" label-for="agen_pro_id">
            <b-form-select plain v-model="audiencia.aud_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>Seleccione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group label="Fecha de Inicio" label-for="agen_start_date">
            <b-form-input id="exampleInputdate" v-model="audiencia.agen_start_date" type="date" value="2019-12-18"></b-form-input>
          </b-form-group>
          <b-form-group label="Fecha Final" label-for="agen_end_date">
            <b-form-input id="exampleInputdate" v-model="audiencia.agen_end_date" type="date" value="2019-12-18"></b-form-input>
          </b-form-group>
          <b-form-group label="Hora de Audiencia" label-for="hora_udiencia">
            <b-form-input id="hora_udiencia" v-model="audiencia.sch_start_hour" type="time" value="13:45"></b-form-input>
          </b-form-group>
      </form>
      </b-modal>
    </div>
    <div>
      <iq-card>
        <template v-slot:headerTitle>
          <h4 class="card-title">Litigios/Solicitudes</h4>
        </template>
        <template v-slot:body>
          <b-row>
            <b-col md="12" class="table-responsive">
              <b-table hover striped responsive bordered :items="process" :fields="fields" >
                <template v-slot:cell(prore_num_radicado)="data">
                  <span v-if="data.item.editable!=0">{{
                    data.item.prore_num_radicado
                  }}</span>
                  <input
                    type="text"
                    v-model="data.item.prore_num_radicado"
                    v-else
                    class="form-control"
                  />
                </template>
                <template v-slot:cell(cli_name)="data">
                  <span v-if="data.item.editable!=0">{{
                    data.item.cli_name
                  }}</span>
                  <input
                    type="text"
                    v-model="data.item.cli_name"
                    v-else
                    class="form-control"
                  />
                </template>
                <template v-slot:cell(prore_pac_age)="data">
                  <span v-if="data.item.editable!=0">{{
                    data.item.prore_pac_age
                  }}</span>
                  <input
                    type="text"
                    v-model="data.item.prore_pac_age"
                    v-else
                    class="form-control"
                  />
                </template>
                <template #cell(show_details)="row">
                  <b-button class="mr-2" size="sm" @click="row.toggleDetails">
                    {{ row.detailsShowing ? 'Ocultar' : 'Detalles'}}
                  </b-button>
                  <b-button size="sm" v-b-modal.modal-lg variant="primary" @click="sendInfo(row.item.prore_id)">
                    Audiencia
                  </b-button>
                </template>

                <template #row-details="row">
                  <b-card>
                    <b>Abogado Asignado:</b>
                    <b-row class="col-md-12 pt-1">
                      <b-card-text class="px-1"><b>Nombre:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.pro_name_first }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.pro_name_first"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Apellido:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.pro_lastname_first }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.pro_lastname_first"
                          v-else
                          class="form-control col-md-1"
                        />
                      <b-card-text class="pl-5"><b>Identificación:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.pro_identificacion }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.pro_identificacion"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Correo electrónico:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.pro_email }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.pro_email"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <hr>
                    <b>Información del proceso:</b>
                    <b-row class="col-md-12 pt-1">
                      <b-card-text class="px-1"><b>Fecha de ingreso al cuadro:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_fec_ingreso }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_fec_ingreso"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Clinica:</b></b-card-text>
                      <b-card-text class="px-1">{{ row.item.cli_name }}</b-card-text>
                      <b-card-text class="pl-5"><b>Fecha del siniestro:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_fec_sinister }}</b-card-text>
                        <input
                          type="date"
                          v-model="row.item.prore_fec_sinister"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="px-1"><b>Año de notificación:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_year_notify }}</b-card-text>
                        <input
                          type="date"
                          v-model="row.item.prore_year_notify"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="px-1"><b>Fecha notificación prejudicial:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_fec_noti_preju }}</b-card-text>
                        <input
                          type="date"
                          v-model="row.item.prore_fec_noti_preju"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Descripción del siniestro:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_sinies_description }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_sinies_description"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <hr>
                    <b>Información del Demandante</b>
                    <b-row class="col-md-12 pt-1">
                      <b-card-text class="px-1"><b>Primer Nombre:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_first }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_name_first"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Segundo Nombre:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_secdon }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_name_secdon"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Primer Apellido:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_first }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_lastname_first"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Segundo Apellido:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_second }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_lastname_second"
                          v-else
                          class="form-control col-md-2"
                        />
                        <b-card-text class="px-1"><b>Telefono/Celular:</b></b-card-text>
                        <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_applicant_phone }}</b-card-text>
                          <input
                            type="text"
                            v-model="row.item.prore_applicant_phone"
                            v-else
                            class="form-control col-md-2"
                          />
                        <b-card-text class="px-1"><b>Correo Electrónico:</b></b-card-text>
                        <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                          <input
                            type="text"
                            v-model="row.item.prore_applicant_email"
                            v-else
                            class="form-control col-md-2"
                          />
                    </b-row>
                    <hr>
                    <b>Información del Demandado</b>
                    <b-row class="col-md-12 pt-1">
                      <b-card-text class="px-1"><b>Primer Nombre:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_first }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_name_first"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-5"><b>Segundo Nombre:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_second }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_name_second"
                          v-else
                          class="form-control col-md-2"
                        />

                      <b-card-text class="pl-5"><b>Primer Apellido:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_first }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_lastname_first"
                          v-else
                          class="form-control col-md-2"
                        />

                      <b-card-text class="pl-5"><b>Segundo Apellido:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_second }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_lastname_second"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="px-1"><b>Teléfono/Celular:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_defendant_phone }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_phone"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="px-1"><b>Correo Electrónico:</b></b-card-text>
                      <b-card-text class="px-1" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_email"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <br>
                    <b-row class="col-md-12">
                      <b-button class="mr-2" size="sm" @click="row.toggleDetails">Ocultar Detalles</b-button>
                      <b-button variant="primary" size="sm" @click="edit(row.item.prore_id)">Editar Proceso</b-button>
                    </b-row>
                  </b-card>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </template>
      </iq-card>
    </div>
  </b-container>
</template>

<script>
import auth from '@/logic/auth'
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  data () {
    return {
      user_id: '',
      process: [],
      audiencia: {},
      abogadoOptions: [],
      selectedProce: '',
      fields: [
        { label: 'Num Radicado', key: 'prore_num_radicado', class: 'text-left' },
        { label: 'Fec Ingreso', key: 'prore_fec_ingreso', class: 'text-left' },
        { label: 'Clinica', key: 'cli_name', class: 'text-left' },
        { label: 'Fec Siniestro', key: 'prore_fec_sinister', class: 'text-left' },
        { label: 'Año Notificación', key: 'prore_year_notify', class: 'text-left' },
        { label: 'Fec Audiencia', key: 'prore_fec_audi_conci_preju', class: 'text-left' },
        { label: 'Ver Detalles', key: 'show_details', class: 'text-center' }
      ],
      items: [
        { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        {
          isActive: false,
          age: 89,
          first_name: 'Geneva',
          last_name: 'Wilson',
          _showDetails: true
        },
        { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
    }
  },
  mounted () {
    xray.index()
    this.getProcess()
    this.fetchOptionsAbogados()
  },
  methods: {
    getProcess () {
      var user = JSON.parse(auth.getUserLogged())
      this.user_id = user.usr_id
      console.log('ahora por acá ' + this.user_id)
      axios.get('/process/' + this.user_id).then(response => {
        this.process = response.data.process
        console.log('processs: ' + this.process)
      })
    },
    edit (item) {
      this.$router.push({ path: `/process/process-edit/${item}` })
    },
    handleOk (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit () {
      console.log('audiencia: ', this.audiencia)
      const token = localStorage.getItem('access_token')
      axios.post('/audience/store', this.audiencia, { headers: { 'Authorization': token } }).then(res => {
        console.log('respuesta!! ' + res.data)
        if (res.data.status_code === 200) {
          Vue.swal('Audiencia agendada al proceso correctamente')
          this.$bvModal.hide('modal-lg')
          this.$router.push({ name: 'process.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetch').then(response => {
        console.log('response.data.professionals: ' + response.data.professionals)
        this.abogadoOptions = response.data.professionals
      })
      console.log('this.abogadoOptions: ' + this.abogadoOptions)
    },
    sendInfo (item) {
      console.log('item: ' + item)
      this.audiencia.aud_prore_id = item
    }
  }
}
</script>
