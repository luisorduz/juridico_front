<template>
   <b-container fluid>
    <div>
      <b-modal id="modal-lg" size="lg" title="Agendar Audiencia" @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <input type="hidden" name="hide" v-model="audiencia.agen_prore_id">
          <b-form-group
            label="Nombre"
            label-for="name-input"
            invalid-feedback="Name is required"
          >
            <b-form-input
              id="name-input"
              v-model="audiencia.agen_name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Asignar Abogada/o:" label-for="agen_pro_identificacion">
            <b-form-select plain v-model="audiencia.agen_pro_identificacion" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
              <template v-slot:first>
                <b-form-select-option :value="null">Seleccione</b-form-select-option>
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
              <b-table bordered hover :items="process" :fields="fields" striped responsive>
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
                  <b-button @click="row.toggleDetails">
                    {{ row.detailsShowing ? 'Ocultar' : 'Ver más'}}
                  </b-button>
                  <br>
                  <b-button v-b-modal.modal-lg variant="primary" @click="sendInfo(row.item.prore_id)">
                    Audiencia
                  </b-button>
                </template>

                <template #row-details="row">
                  <b-card>
                    <b>Abogado Asignado:</b>
                    <br>
                    <br>
                    <b-row class="col-md-12">
                      <b-col md="2" class="text-sm-right"><b>Nombre:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.pro_name_first }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.pro_name_first"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-col md="2" class="text-sm-right"><b>Apellido:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.pro_lastname_first }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.pro_lastname_first"
                          v-else
                          class="form-control col-md-1"
                        />
                      <b-col md="2" class="text-sm-right"><b>Identificación:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.pro_identificacion }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.pro_identificacion"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <br>
                    <b-row class="col-md-12">
                      <b-col md="2" class="text-sm-right"><b>Email:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.pro_email }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.pro_email"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <br>
                    <b>Información del Demandante</b>
                    <br>
                    <br>
                    <b-row class="col-md-12">
                      <b-col md="2" class="text-sm-right"><b>Primer Nombre:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_first }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_name_first"
                          v-else
                          class="form-control col-md-2"
                        />
                        <b-col md="2" class="text-sm-right"><b>Segundo Nombre:</b></b-col>
                        <b-col v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_secdon }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_name_secdon"
                          v-else
                          class="form-control col-md-2"
                        />
                        <b-col md="2" class="text-sm-right"><b>Primer Apellido:</b></b-col>
                        <b-col v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_first }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_lastname_first"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <br>
                    <b-row class="col-md-12">
                      <b-col md="2" class="text-sm-right"><b>Segundo Apellido:</b></b-col>
                        <b-col v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_second }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_lastname_second"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-col md="2" class="text-sm-right"><b>Telefono/Celular:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.prore_applicant_phone }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_phone"
                          v-else
                          class="form-control col-md-2"
                        />
                        <b-col md="2" class="text-sm-right"><b>Correo Electronico:</b></b-col>
                        <b-col v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_email"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <br>
                    <b>Información del Demandado</b>
                    <br>
                    <br>
                    <b-row class="col-md-12">
                      <b-col md="2" class="text-sm-right"><b>Primer Nombre:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_first }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_name_first"
                          v-else
                          class="form-control col-md-2"
                        />
                        <b-col md="2" class="text-sm-right"><b>Segundo Nombre:</b></b-col>
                        <b-col v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_second }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_name_second"
                          v-else
                          class="form-control col-md-2"
                        />
                        <b-col md="2" class="text-sm-right"><b>Primer Apellido:</b></b-col>
                        <b-col v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_first }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_lastname_first"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <br>
                    <b-row class="col-md-12">
                      <b-col md="2" class="text-sm-right"><b>Segundo Apellido:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_second }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_lastname_second"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-col md="2" class="text-sm-right"><b>Telefono/Celular:</b></b-col>
                      <b-col v-if="row.item.editable!=0">{{ row.item.prore_defendant_phone }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_phone"
                          v-else
                          class="form-control col-md-2"
                        />
                        <b-col md="2" class="text-sm-right"><b>Correo Electronico:</b></b-col>
                        <b-col v-if="row.item.editable!=0">{{ row.item.prore_defendant_email }}</b-col>
                        <input
                          type="text"
                          v-model="row.item.prore_defendant_email"
                          v-else
                          class="form-control col-md-2"
                        />
                    </b-row>
                    <br>
                    <b-row class="col-md-12">
                      <b-button size="sm" @click="row.toggleDetails">Ocultar Detalles</b-button>
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
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'
export default {
  data () {
    return {
      process: [],
      audiencia: {},
      abogadoOptions: [],
      selectedProce: '',
      fields: [
        { label: 'Num Radicado', key: 'prore_num_radicado', class: 'text-left' },
        { label: 'Fec Ingreso', key: 'prore_fec_ingreso', class: 'text-left' },
        { label: 'Clinica', key: 'cli_name', class: 'text-left' },
        { label: 'Año Siniestro', key: 'prore_year_sinister', class: 'text-left' },
        { label: 'Fec Siniestro', key: 'prore_fec_sinister', class: 'text-left' },
        { label: 'Año Notificación', key: 'prore_year_notify', class: 'text-left' },
        { label: 'Fec Audiencia Conci Preju', key: 'prore_fec_audi_conci_preju', class: 'text-left' },
        { label: 'Fec Aviso Siniestro', key: 'prore_fec_sinies_aviso', class: 'text-left' },
        { label: 'Descripción Siniestro', key: 'prore_sinies_description', class: 'text-left' },
        { label: 'Ver Detalles', key: 'show_details', class: 'text-left' }
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
      axios.get('/process').then(response => {
        this.process = response.data.process
        console.log('processshptaaa: ' + this.process)
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
      console.log('putooo uribismo: ', this.audiencia)
      const token = localStorage.getItem('access_token')
      axios.post('/audiencia/store', this.audiencia, { headers: { 'Authorization': token } }).then(res => {
        console.log('Duque hptaaaa!! ' + res.data)
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
      console.log('putooo item: ' + item)
      this.audiencia.agen_prore_id = item
    }
  }
}
</script>
