<template>
  <b-modal id="modal-terminar-proceso" size="lg" title="Terminar proceso" hide-footer>
    <form ref="form">
      <input type="hidden" name="agen_prore_id" v-model="proceeding.proce_prore_id">
      <p v-if="errors.length">
        <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <b-row>
        <b-col md="12">
          <h4>Número de radicado: {{num_radicado}}</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col md="4">
          <b-form-group label="Abogada/o*" label-for="agen_pro_id">
            <b-form-select plain v-model="proceeding.proce_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>Seleccione abogado</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Fecha de terminación*" label-for="proce_fecha_ingreso">
            <b-form-input id="proce_fecha_ingreso" v-model="proceeding.proce_fecha_ingreso" type="date" ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-form-textarea v-model="proceeding.proce_descripcion" type="text" placeholder="Descripción de la actuación*"></b-form-textarea>
        </b-col>
      </b-row>
      <div class="text-right pt-1">
        <b-button class="sm-3 mr-1" variant="secondary" @click="cancelado">Cancelar</b-button>
        <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarActuacion">{{ textoGuardarActuacion }}</b-button>
      </div>
    </form>
  </b-modal>
</template>
<script>
import { xray } from '../../../config/pluginInit.js'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'ModalTerminarProceso',
  props: ['prore_id', 'usr_id', 'num_radicado'],
  mounted () {
    xray.index()
    this.fetchOptionsAbogados()
  },
  data () {
    return {
      errors: [],
      error: {},
      abogadoOptions: [],
      botonGuardarModal: '',
      textoGuardarActuacion: 'Terminar Proceso',
      proceeding: {
        proce_id: null,
        proce_prore_id: null,
        proce_pro_id: null,
        proce_sta_id: 16,
        proce_fecha_ingreso: null,
        proce_fecha_actualizacion: null,
        proce_descripcion: null,
        proce_fecha_siguiente_audiencia: null,
        proce_hora_siguiente_audiencia: null
      }
    }
  },
  methods: {
    fetchOptionsAbogados () {
      axios.get('/professionals/fetchOld').then(response => {
        this.abogadoOptions = response.data.professionals
      })
    },
    cancelado () {
      this.$bvModal.hide('modal-terminar-proceso')
    },
    guardarActuacion (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.checkFormActuacion()) {
        let _this = this
        this.botonGuardarModal = 'disabled'
        this.textoGuardarActuacion = 'Guardando actuación...'
        if (this.usr_id != null && this.usr_id !== '') {
          this.proceeding.proce_user_id = this.usr_id
        }
        this.proceeding.proce_prore_id = _this.prore_id
        axios.post('/proceedings/store', { formulario_proceeding: this.proceeding, links: [] }).then(res => {
          this.textoGuardarActuacion = 'Guardar'
          this.botonGuardarModal = ''
          if (res.data.status_code === 200) {
            Vue.swal(res.data.message)
            this.$bvModal.hide('modal-terminar-proceso')
            this.limpiarModalActuacion()
          } else {
            Vue.swal(res.data.message)
          }
        })
          .catch((err) => {
            this.textoGuardarActuacion = 'Guardar'
            this.botonGuardarModal = ''
            Vue.swal('Ups, ocurrió un error ' + err)
          })
      } else {
        return false
      }
    },
    checkFormActuacion () {
      if (this.proceeding.proce_pro_id && this.proceeding.proce_sta_id && this.proceeding.proce_fecha_ingreso && this.proceeding.proce_descripcion) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.proceeding.proce_pro_id) {
        this.errors.push('El abogado es obligatorio.')
      }
      if (!this.proceeding.proce_sta_id) {
        this.errors.push('La etapa del proceso es obligatoria.')
      }
      if (!this.proceeding.proce_fecha_ingreso) {
        this.errors.push('La fecha de ingreso es obligatoria.')
      }
      if (!this.proceeding.proce_descripcion) {
        this.errors.push('La descripción es obligatoria.')
      }
    },
    limpiarModalActuacion () {
      this.proceeding.proce_prore_id = null
      this.proceeding.proce_pro_id = null
      this.proceeding.proce_sta_id = null
      this.proceeding.proce_fecha_ingreso = null
      this.proceeding.proce_fecha_actualizacion = null
      this.proceeding.proce_descripcion = null
      this.proceeding.proce_fecha_siguiente_audiencia = null
      this.proceeding.proce_hora_siguiente_audiencia = null
    }
  }
}
</script>