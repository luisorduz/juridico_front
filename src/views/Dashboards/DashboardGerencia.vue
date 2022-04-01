<template>
  <b-container fluid>
    <b-row v-if="loading">
      <b-col class="py-5" lg="12">
        <b-progress :max="max" height="2rem">
          <b-progress-bar :progress_total="progress_total" variant="success" :style="{width: progress_total + '%'}">
            <span><b>{{ progress_total }}%</b></span>
          </b-progress-bar>
        </b-progress>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col lg="12">
        <b-row>
          <b-col md="6" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="bg-primary rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon iq-bg-primary">
                    <i class="fas fa-gavel"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter text-white">{{
                        procesosAbiertos + procesosCerrados
                      }}</span>
                    </h2>
                    <h5 class="text-white">Total procesos</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              style="background-color: #47A9A1"
              body-class="rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon" style="background-color:#fff">
                    <i class="fas fa-folder-open" style="color: #47A9A1"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter text-white">{{
                        procesosAbiertos }}</span>
                    </h2>
                    <h5 class="text-white">Procesos Abiertos</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="bg-danger rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon iq-bg-danger">
                    <i class="ri-book-2-fill"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter text-white">{{
                        procesosCerrados }}</span>
                    </h2>
                    <h5 class="text-white">Procesos cerrados</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" lg="6">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="iq-bg-warning rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-warning">
                    <i class="fas fa-coins"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{
                        formatoEnMillones(formatPrice(totalPretensiones))
                      }}</span>
                    </h2>
                    <h5 class="">Total pretensiones</h5>
                    <small>en millones</small>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="6">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="iq-bg-info rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-info">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{
                        formatoEnMillones(formatPrice(totalEstimacionesPretensiones))
                      }}</span>
                    </h2>
                    <h5 class="">Total estimación pretensiones</h5>
                    <small>en millones</small>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </b-col>
      <b-col lg="12" :key="graficaProcesosPorClinicaKey">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Bienvenidos a Juridico App</h4>
          </template>
          <b-row>
            <b-col lg="6">
              <b-col sm="4" md="6" class="ml-3 p-2 my-1">
                <b-form-group
                  label="Clínica"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    multiple
                    v-model="clinicasIds"
                    :options="clinicaOptions"
                    @input="cambioClinica()"
                    :reduce="label => label.code"
                    label="label"
                    id="clinica_id"
                    :class="(errors.length > 0 ? ' is-invalid' : '') + 'ml-1' "
                    >
                    <span slot="no-options">No hay clínicas.</span>
                  </v-select>
                </b-form-group>
              </b-col>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos activos por clínica</h4>
                </template>
                <template v-slot:body>
                  <GraficaProcesosPorClinica ref='chartClinicas' :clinicasIds="clinicasIds" element="patient"/>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <GraficaInformacionPorRiesgo element="riesgo" :clinicasIds="clinicasIds"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <GraficaExitoPretensiones :clinicasIds="clinicasIds"/>
            </b-col>
            <b-col lg="6">
              <GraficaExitoEstimaciones :clinicasIds="clinicasIds"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos activos por especialidad</h4>
                </template>
                <template v-slot:body>
                  <GraficaProcesosPorEspecialidad ref='chartEspecialidad' element="especialidad" :clinicasIds="clinicasIds"/>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos por estados</h4>
                </template>
                <template>
                  <GraficaProcesosPorEstados ref='chartEstados' element="estados" :clinicasIds="clinicasIds"/>
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos por aseguradora</h4>
                </template>
                <template v-slot:body>
                  <GraficaProcesosPorAseguradora ref='chartAseguradora' element="aseguradoraa" :clinicasIds="clinicasIds"/>
                </template>
              </iq-card>
            </b-col>
          </b-row>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'

export default {
  name: 'DashboardGerencia',
  mounted () {
    xray.index()
    this.barraCargando()
    this.obtenerTotalEstimacionesPretensiones()
    this.obtenerTotalPretensiones()
    this.fetchClinicaOptions()
    setTimeout(() => {
      this.obtenerCantidadProcesosAbiertos()
      this.obtenerCantidadProcesosCerrados()
    }, 800)
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  data: function () {
    return {
      graficaProcesosPorClinicaKey: 0,
      errors: [],
      clinicasIds: null,
      clinicaOptions: [],
      procesosAbiertos: '',
      procesosCerrados: '',
      totalEstimacionesPretensiones: '',
      totalPretensiones: '',
      progress_total: 4,
      max: 100,
      loading: true,
      intentos: 0,
      errores: {}
    }
  },
  methods: {
    fetchClinicaOptions: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/clinicas/obtener-clinicas/' + this.userLogged.usr_id).then(response => {
          this.clinicaOptions = response.data.clinicas
          if (this.clinicaOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
            if (this.clinicaOptions.length === 1) {
              this.clinicaId = this.clinicaOptions[0].code
            } else {
              this.clinicaOptions.push({ code: 0, label: 'Todos' })
              this.clinicasIds = 0
            }
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchClinicaOptions()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    cambioClinica () {
      if (this.clinicasIds.length === 0) {
        this.clinicasIds = 0
      }
      if (this.clinicasIds[0] === 0) {
        this.clinicasIds.shift()
      }
      this.obtenerCantidadProcesosAbiertos()
      this.obtenerCantidadProcesosCerrados()
      setTimeout(() => {
        this.obtenerTotalEstimacionesPretensiones()
        this.obtenerTotalPretensiones()
        this.graficaProcesosPorClinicaKey++
      }, 800)
    },
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    obtenerTotalEstimacionesPretensiones: function () {
      axios.get('/process/obtenerTotalEstimacionesPretensiones/' + this.userLogged.usr_id + '/' + this.clinicasIds).then(res => {
        if (res.data.status_code === 200) {
          this.totalEstimacionesPretensiones = res.data.estimaciones_pretensiones
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerTotalPretensiones: function () {
      axios.get('/process/obtenerTotalPretensiones/' + this.userLogged.usr_id + '/' + this.clinicasIds).then(res => {
        if (res.data.status_code === 200) {
          this.totalPretensiones = res.data.pretensiones
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadProcesosAbiertos: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerCantidadProcesosAbiertos/' + this.userLogged.usr_id + '/' + this.clinicasIds).then(res => {
          if (res.data.status_code === 200) {
            this.procesosAbiertos = res.data.cantidad_procesos_abiertos
          } else {
            alert('Datos no validos')
          }
        })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    obtenerCantidadProcesosCerrados: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerCantidadProcesosCerrados/' + this.userLogged.usr_id + '/' + this.clinicasIds).then(res => {
          if (res.data.status_code === 200) {
            this.procesosCerrados = res.data.cantidad_procesos_cerrados
            this.loading = false
          } else {
            alert('Datos no validos')
          }
        })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatoEnMillones (value) {
      let val = value.toString()
      val = val.slice(0, -8)
      return val
    }
  }
}
</script>

<style>
.iq-card-body {
  flex: unset;
}
</style>
