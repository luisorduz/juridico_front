<template>
  <div>
    <b-row>
      <b-col lg="2">
        <b-form-input
          id="fechaInicio"
          v-model="fechaInicio"
          type="date"
        ></b-form-input>
      </b-col>
      <b-col lg="2">
        <b-form-input
          id="fechaFin"
          v-model="fechaFin"
          type="date"
        ></b-form-input>
      </b-col>
      <b-col sm="4" md="4" class="my-1">
        <b-form-group
          label="Clinica ss"
          label-cols-sm="2"
          label-cols-md="2"
          label-cols-lg="2"
          label-align-sm="left"
          label-size="sm"
          class="mb-0"
        >
          <v-select
            v-model="clinica_id"
            :options="clinicasUser"
            :reduce="(label) => label.code"
            label="label"
            id="clinica_select"
          >
            <span slot="no-options">No hay Clinicas.</span>
          </v-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row style="margin-top:10px;">
         <b-col sm="4" md="4" class="my-1">
                <b-form-group
                  label="Actividad"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="actividad_id"
                    :options="actividades"
                    :reduce="(label) => label.code"
                    label="label"
                    id="clinica_select"
                    @input="getSubactividades($event, false)"
                  >
                    <span slot="no-options">No hay Actividades.</span>
                  </v-select>
                </b-form-group>
              </b-col>
               <b-col sm="4" md="4" class="my-1">
                <b-form-group
                  label="Subactividad"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="4"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                  :key="selectKey"
                >
                  <v-select
                    v-model="subactividad_id"
                    :options="subactividadesOptions"
                    :reduce="(label) => label.code"
                    label="label"
                    id="clinica_select"
                  >
                    <span slot="no-options">No hay Subactividades.</span>
                  </v-select>
                </b-form-group>
              </b-col>
              <b-col lg="2">
            <b-button variant="primary" @click="getDataGrafico" >Filtrar</b-button>
        </b-col>
    </b-row>
    <b-alert v-model="showSubactividadAlert" variant="danger" dismissible>
      ¡¡Error!! No seleccionaste una Subactividad
    </b-alert>
    <div v-if="loadingGraph" class="text-center">
      <b-spinner variant="primary" type="grow" label="Loading..."></b-spinner>
    </div>
    <div :id="element"></div>
  </div>
</template>
<script>
import ApexCharts from 'apexcharts'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'GraficoTotalSubactividad',
  props: {
    element: String,
    actividades: Array,
    actividad_id: Number,
    clinicasUser: Array
  },
  data () {
    return {
      fechaInicio: moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD'),
      fechaFin: moment(new Date()).format('YYYY-MM-DD'),
      meses: [],
      cantidad: [],
      clinica_id: '0',
      clinicasOptions: [],
      subactividad_id: 5,
      subactividadesOptions: [],
      selectKey: 1,
      loadingGraph: true,
      chart: null,
      showSubactividadAlert: false,
      chartOptions: {
        series: [
          {
            name: 'Num. de Casos',
            data: []
          }
        ],
        chart: {
          height: 500,
          type: 'bar'
        },
        colors: ['#0880ab'],
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top'
            },
            borderRadius: 5,
            columnWidth: '80%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true,
          position: 'top',
          style: {
            colors: ['#089bab']
          },
          offsetY: -25
        },
        stroke: {
          width: 2
        },
        grid: {
          row: {
            colors: ['#fff', '#cccccc']
          }
        },
        xaxis: {
          type: 'category',
          labels: {
            rotateAlways: true,
            minHeight: 150,
            maxHeight: 1000,
            trim: true
          },
          categories: [],
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Número de Casos'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        }
      }
    }
  },
  mounted () {
    this.getDataGrafico()
    this.getSubactividades(null, true)
  },
  computed: {
    chartData: function () {
      return this.data
    }
  },
  methods: {
    crearGrafico () {
      const selector = '#' + this.element
      const max = Math.max(...this.cantidad)
      this.chartOptions.yaxis.max = max + 2

      this.chartOptions.xaxis.categories = this.meses
      this.chartOptions.series[0].data = this.cantidad
      this.chart = new ApexCharts(
        document.querySelector(selector),
        this.chartOptions
      )
      this.chart.render()
    },
    getDataGrafico () {
      this.loadingGraph = true
      if (this.actividad_id !== '0' && this.subactividad_id === null) {
        this.showSubactividadAlert = true
        this.loadingGraph = false
      } else {
        this.showSubactividadAlert = false
        const dataSend = {
          fecha_inicio: this.fechaInicio,
          fecha_fin: this.fechaFin,
          clinica_id: this.clinica_id,
          subactividad_id: this.subactividad_id
        }
        axios
          .post('/casos-cantidad/subactividad', dataSend)
          .then((res) => {
            if (res.status === 200) {
              this.meses = res.data.meses
              this.cantidad = res.data.cantidad
              this.loadingGraph = false
              if (this.chart != null && this.chart !== undefined) {
                this.updateGrafico()
              } else {
                this.crearGrafico()
              }
              this.intentos = 0
              this.errors = {}
              this.selectKey++
            }
          })
          .catch((err) => {
            this.errors = err
            if (this.intentos < 2) {
              this.getDataGrafico()
              this.intentos++
            }
          })
      }
    },
    updateGrafico () {
      const max = Math.max(...this.cantidad)

      this.chart.updateOptions({
        xaxis: {
          categories: this.meses
        },
        series: [{
          data: this.cantidad
        }],
        yaxis: {
          max: max + 2,
          title: {
            text: 'Número de Casos'
          }
        }
      })
    },
    getSubactividades (e, firstTime = false) {
      if (!firstTime) {
        this.subactividad_id = null
      }
      if (this.actividad_id !== '0') {
        axios
          .get('/subactividades/fetch/' + this.actividad_id)
          .then((response) => {
            this.subactividadesOptions = response.data.subactividades
          })
      }
    }
  }
}
</script>
