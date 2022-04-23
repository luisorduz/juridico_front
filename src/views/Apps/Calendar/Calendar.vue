<template>
  <b-container fluid>
    <b-row>
      <b-col md="3">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Programa de hoy</h4>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 today-schedule">
              <li class="d-flex" v-for='event in eventsToday' :key='event.id'>
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill" v-bind:style="{ color: event.color }" /></div>
                <div class="schedule-text"> <span>{{ event.title }}</span>
                  <span> {{ event.start_date }} </span>
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title ">Usuarios</h4>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 job-classification">
              <li v-for="usuario in usuarios" :key="usuario.usr_id">
                <i class="ri-check-line" v-bind:style="{ background: usuario.usr_color }" />{{ usuario.usr_name_first }} {{ usuario.usr_lastname_first }}
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
      <b-col md="9">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Crear evento</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#" class="btn btn-primary" @click="newEvent"><i class="ri-add-line mr-2" ></i>Crear evento</a>
          </template>
          <template v-slot:body>
            <Fullcalendar
                :height="750"
                :plugins="calendarPlugins"
                :header="{
                    center: 'title',
                    right: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek',
                    left: 'prev today next'
                }"
                :buttonText="{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    list: 'Lista'
                }"
                :weekends="false"
                :selectable="true"
                :editable="true"
                :events="events"
                @select="handleSelect"
                @eventClick="handleEventClick"
                @eventResize="updateEvent"
                @eventDrop="updateEvent"
                @eventRender="renderEvent"
            />
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      id="modal-audience"
      ref="modal"
      v-bind:title="title_modal_text"
      hide-footer
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <input type="hidden" name="hide" v-model="formData.sch_id">
        <b-row>
          <b-col md="12">
            <b-form-group class="sm-6" label="Tipo de evento" label-for="agen_type_eve_id">
              <b-form-select v-model="formData.agen_type_eve_id" id="selectuserrole" :options="typeEventsOptions">
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group
          label="Nombre del evento"
          label-for="name-input"
        >
          <b-form-input
            id="name-input"
            v-model="formData.agen_name"
            placeholder="Presentar pruebas"
          ></b-form-input>
        </b-form-group>
        <b-row>
          <b-col md="12">
            <b-form-group  class="sm-6" label="Radicado del Proceso - ID Litigando" label-for="agen_prore_id">

              <v-select v-model="formData.agen_prore_id" :options="processOpenedOptions" :reduce="label => label.value"  label="text" id="selectuserrole" >
                          <span slot="no-options">No se ha encontrado</span>
                        </v-select>

            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group label="Abogado/a" label-for="agen_pro_id">
              <b-form-select v-model="formData.agen_pro_id" :options="abogadoOptions" @search="abogadoOptions" id="selectuserrole" >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>Seleccione un profesional</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Fecha de Inicio" label-for="agen_start_date">
          <b-form-input id="exampleInputdate" @change="calcularFechaFinal" v-model="formData.agen_start_date" type="date"></b-form-input>
        </b-form-group>
        <b-form-group label="Duración del evento (días)" label-for="duracion">
          <b-form-input id="duracion" @keyup="calcularFechaFinal" v-model="formData.duracion" type="number"></b-form-input>
        </b-form-group>
        <b-form-group label="Fecha Final" label-for="agen_end_date">
          <b-form-input id="exampleInputdate" v-model="formData.agen_end_date" type="date"></b-form-input>
        </b-form-group>
        <b-row>
          <b-col md="12">
            <b-form-group class="sm-6" label="Notificar desde" label-for="agen_type_not_id">
              <b-form-select v-model="formData.agen_type_not_id" id="selectuserrole" :options="typeNotificationsOptions">
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Hora de inicio" label-for="sch_start_hour">
          <b-form-input id="sch_start_hour" v-model="formData.sch_start_hour" type="time"></b-form-input>
        </b-form-group>
        <b-form-group label="Hora de finalización" label-for="sch_end_hour">
          <b-form-input id="sch_start_end" v-model="formData.sch_end_hour" type="time"></b-form-input>
        </b-form-group>
      </form>
      <div class="text-right">
        <b-button v-if="formData.sch_id !== ''" class="sm-3 mr-1" variant="danger" :class="botonEliminarModal" @click="eliminarEvento(formData.sch_id)">Eliminar evento</b-button>
        <b-button class="sm-3 mr-1" variant="secondary" @click="cancelado">Cancelar</b-button>
        <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="handleOk">Guardar</b-button>
      </div>
    </b-modal>
  </b-container>
  <!--<modals-container />-->
</template>
<script>
import Fullcalendar from '@fullcalendar/vue'
import DayGridPlugin from '@fullcalendar/daygrid'
import TimeGridPlugin from '@fullcalendar/timegrid'
import InteractionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'
import auth from '@/logic/auth'

import { xray } from '../../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
export default {
  data: () => ({
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ],
    config: {
      dateFormat: 'Y-m-d',
      inline: true
    },
    botonEliminarModal: '',
    botonGuardarModal: '',
    typeNotificationsOptions: [],
    typeEventsOptions: [],
    eventsToday: [],
    events: [],
    title_modal_text: 'Crear evento',
    processOpenedOptions: [],
    abogadoOptions: [],
    tiposTiempo: [
      { text: 'Minutos', value: 1 },
      { text: 'Horas', value: 2 },
      { text: 'Días', value: 3 }
    ],
    formData: {
      sch_id: '',
      agen_name: '',
      agen_prore_id: '',
      agen_pro_id: '',
      agen_start_date: '',
      agen_end_date: '',
      sch_start_hour: '',
      sch_end_hour: '',
      agen_type_eve_id: '',
      agen_type_not_id: '',
      duracion: ''
    },
    usuarios: []
  }),
  mounted () {
    xray.index()
    this.getAgendas()
    this.fetchOptionsAbogados()
    this.fetchProcessOpened()
    this.getUsuariosActivos()
    setTimeout(() => {
      this.getTypeNotifications()
      this.getTypeEvents()
    }, 500)
  },
  components: { Fullcalendar },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  methods: {
    getAgendas () {
      axios.get('/agenda').then(response => {
        this.events = Object.keys(response.data.audiencias).map((key) => {
          return response.data.audiencias[key]
        })
        this.getAgendaHoy()
      })
    },
    getAgendaHoy () {
      axios.get('/agenda/obtenerEventosHoy').then(response => {
        this.eventsToday = Object.keys(response.data.audiencias_hoy).map((key) => {
          return response.data.audiencias_hoy[key]
        })
      })
    },
    getTypeNotifications () {
      axios.get('/type_notifications/fetchTypeNotifications').then(response => {
        this.typeNotificationsOptions = response.data.type_notifications
        if (this.typeNotificationsOptions[0] !== undefined) {
          this.formData.agen_type_not_id = this.typeNotificationsOptions[0].value
        }
      })
    },
    getTypeEvents () {
      axios.get('/type_events/fetchTypeEvents').then(response => {
        this.typeEventsOptions = response.data.type_events
        if (this.typeEventsOptions[0] !== undefined) {
          this.formData.agen_type_eve_id = this.typeEventsOptions[0].value
        }
      })
    },
    eliminarEvento (eventoId) {
      this.botonEliminarModal = 'disabled'
      this.botonGuardarModal = 'disabled'
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este evento?', {
        title: 'Por favor confirmar acción',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Confirmar',
        cancelTitle: 'Cancelar',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            this.confirmarEliminacion(eventoId)
          } else {
            this.botonEliminarModal = ''
            this.botonGuardarModal = ''
          }
        })
        .catch(err => {
          this.botonEliminarModal = ''
          this.botonGuardarModal = ''
          Vue.swal(err)
        })
    },
    confirmarEliminacion (eventoId) {
      axios.post('/agenda/deleteSchedule/' + eventoId).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal(res.data.message)
          this.getAgendas()
          this.limpiarModal()
          this.$bvModal.hide('modal-audience')
        } else {
          Vue.swal(res.data.message)
        }
        this.botonEliminarModal = ''
        this.botonGuardarModal = ''
      })
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      if (this.formData.agen_name !== '' && this.formData.agen_prore_id && this.formData.agen_pro_id !== '' &&
      this.formData.agen_start_date !== '' && this.formData.agen_end_date !== '' && this.formData.sch_start_hour !== '' && this.formData.sch_end_hour) {
        if (this.formData.agen_start_date > this.formData.agen_end_date) {
          Vue.swal('La fecha de inicio no puede ser mayor a la fecha de finalización')
        } else if (this.formData.sch_start_hour > this.formData.sch_end_hour) {
          Vue.swal('La hora de inicio no puede ser mayor a la hora de finalización')
        } else {
          this.botonGuardarModal = 'disabled'
          // Trigger submit handler
          this.handleSubmit()
        }
      } else {
        Vue.swal('Por favor completa todo el formulario')
      }
    },
    handleSubmit () {
      if (this.formData.sch_id > 0) {
        axios.post('/agenda/updateSchedule/' + this.formData.sch_id, this.formData).then(res => {
          // Hide the modal manually
          this.$nextTick(() => {
            this.$bvModal.hide('modal-audience')
          })
          if (res.data.status_code === 200) {
            Vue.swal('Evento modificado correctamente')
            this.getAgendas()
            this.limpiarModal()
          } else {
            Vue.swal('Datos no validos')
          }
          this.botonGuardarModal = ''
        })
      } else {
        axios.post('/agenda/store', this.formData).then(res => {
          // Hide the modal manually
          this.$nextTick(() => {
            this.$bvModal.hide('modal-audience')
          })
          if (res.data.status_code === 200) {
            Vue.swal('Evento creado correctamente')
            this.getAgendas()
            this.limpiarModal()
          } else {
            Vue.swal('Datos no validos')
          }
          this.botonGuardarModal = ''
        })
      }
    },
    cancelado () {
      this.$bvModal.hide('modal-audience')
      this.limpiarModal()
    },
    limpiarModal () {
      this.formData.agen_name = ''
      this.formData.agen_prore_id = ''
      this.formData.agen_pro_id = ''
      this.formData.agen_start_date = ''
      this.formData.agen_end_date = ''
      this.formData.duracion = ''
      this.formData.sch_start_hour = ''
      this.formData.sch_id = ''
      this.formData.sch_end_hour = ''
      this.title_modal_text = 'Crear evento'
    },
    newEvent () {
      this.limpiarModal()
      this.formData.agen_type_not_id = 1
      this.formData.agen_type_eve_id = 1
      this.$bvModal.show('modal-audience')
    },
    renderEvent (arg) {
    },
    updateEvent (arg) {
      this.formData.sch_id = arg.event.id
      var hourStart = this.formatHour(arg.event.start)
      var hourEnd = ''
      if (arg.event.end !== null && arg.event.end !== undefined) {
        hourEnd = this.formatHour(arg.event.end)
      } else {
        hourEnd = arg.event.extendedProps.end_hour
      }
      this.formData.agen_name = arg.event.title
      this.formData.agen_pro_id = arg.event.extendedProps.agen_pro_id
      this.formData.agen_prore_id = arg.event.extendedProps.agen_prore_id
      this.formData.agen_start_date = this.formatDate(arg.event.start)
      this.formData.agen_end_date = this.formatDate(arg.event.end)
      this.formData.sch_start_hour = hourStart
      this.formData.sch_end_hour = hourEnd
      this.formData.agen_type_eve_id = arg.event.extendedProps.agen_type_eve_id
      this.formData.agen_type_not_id = arg.event.extendedProps.agen_type_not_id
      this.handleSubmit()
    },
    handleSelect (arg) {
      this.limpiarModal()
      var hourStart = this.formatHour(arg.start)
      var hourEnd = this.formatHour(arg.end)
      this.formData.agen_start_date = this.formatDate(arg.start)
      this.formData.agen_end_date = this.formatDate(arg.end)
      this.formData.sch_start_hour = hourStart
      this.formData.sch_end_hour = hourEnd
      this.$bvModal.show('modal-audience')
    },
    handleEventClick (arg) {
      this.formData.sch_id = arg.event.id
      this.title_modal_text = 'Editar evento #' + this.formData.sch_id
      this.formData.agen_name = arg.event.title
      this.formData.agen_prore_id = arg.event.extendedProps.agen_prore_id
      this.formData.agen_pro_id = arg.event.extendedProps.agen_pro_id
      this.formData.agen_start_date = arg.event.extendedProps.agen_start_date
      this.formData.agen_end_date = arg.event.extendedProps.agen_end_date
      this.formData.sch_start_hour = arg.event.extendedProps.hour
      this.formData.sch_end_hour = arg.event.extendedProps.end_hour
      this.formData.agen_type_eve_id = arg.event.extendedProps.agen_type_eve_id
      this.formData.agen_type_not_id = arg.event.extendedProps.agen_type_not_id
      this.$bvModal.show('modal-audience')
    },
    fetchProcessOpened () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/fetchProcessOpened/' + this.userLogged.usr_id).then(response => {
          this.processOpenedOptions = response.data.process
        })
      }
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetchOld').then(response => {
        this.abogadoOptions = response.data.professionals
      })
    },
    getUsuariosActivos () {
      axios.get('/users/abogadosActivos').then(response => {
        this.usuarios = response.data.usuarios
      })
    },
    formatDate (date) {
      if (date !== null) {
        // YYYY-MM-DD
        var options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        let string = date.toLocaleDateString('en-US', options).split('/')
        // create array of values returned by `.toLocaleDateString()`,
        // delimited by `/`
        // `y` : year
        var y = string.splice(-1)[0]
        // set `y` as item at index `0` of `d`
        string.splice(0, 0, y)
        // join items within `d` with dash character `"-"`
        var dateFinal = string.join('-')
        return dateFinal
      }
      return null
    },
    formatHour (dateTime) {
      if (dateTime !== null) {
        return this.addZero(dateTime.getHours()) + ':' + this.addZero(dateTime.getMinutes())
      }
      return null
    },
    addZero (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    calcularFechaFinal () {
      let duracion = this.formData.duracion
      let fechaInicial = this.formData.agen_start_date
      if (duracion !== '' && fechaInicial !== '') {
        axios.get('/agenda/obtener-fecha-final/' + fechaInicial + '/' + duracion)
          .then((res) => {
            if (res.data.status_code === 200) {
              this.formData.agen_end_date = res.data.fecha_final
            }
          })
          .catch((err) => {
            Vue.swal('Ups, ocurrió un error ' + err)
          })
      }
    }
  }
}
</script>

<style lang='scss'>
  .fc-event, .fc-event:hover{
    color: #ffffff !important;
  }
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';
  @import '~@fullcalendar/timegrid/main.css';
  @import '~@fullcalendar/list/main.min.css';
</style>
