<template>
  <div>
    <div v-if="casosAbogado.length > 0" :id="element"></div>
    <div v-else>
      <h4 class="col-12 text-center">No hay Casos asiganados a los abogados</h4>
    </div>
  </div>
</template>
<script>
import ApexCharts from 'apexcharts'

export default {
  name: 'GraficaCasosPorAbogado',
  props: {
    element: String,
    casosAbogado: Array
  },
  data () {
    return {
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
        colors: ['#08a9ab'],
        plotOptions: {
          bar: {
            borderRadius: 5,
            dataLabels: {
              position: 'top'
            },
            columnWidth: '80%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true,
          position: 'top',
          style: {
            colors: ['#08a9ab']
          },
          offsetY: -25
        },
        stroke: {
          width: 2
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
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
    this.crearGrafico()
  },
  methods: {
    crearGrafico () {
      const selector = '#' + this.element
      const abogados = []
      const cantidad = []

      for (let caso of this.casosAbogado) {
        cantidad.push(caso.cantidad)
        abogados.push(caso.abogados)
      }
      const max = Math.max(...cantidad)
      this.chartOptions.yaxis.max = max + 2

      this.chartOptions.xaxis.categories = abogados
      this.chartOptions.series[0].data = cantidad
      const chart = new ApexCharts(
        document.querySelector(selector),
        this.chartOptions
      )

      chart.render()
    }
  }
}
</script>
