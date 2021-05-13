<template>
  <VueFullCalendar defaultView="dayGridMonth"
                   :header="header"
                   :plugins="calendarPlugins"
                   :events="calendarEvents"
                   :selectable="true"
                    @select="handleSelect"
                    @clickDate="handleDateClick"
                   time-zone="UTC"
  />
</template>
<script>
import VueFullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import Vue from 'vue'
export default {
  name: 'FullCalendar',
  props: {
    // eslint-disable-next-line vue/require-valid-default-prop
    calendarEvents: { type: Array, default: [] },
    header: { type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default () {
        return {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }
      }
    }
  },
  data () {
    return {
      calendarPlugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        listPlugin
      ]
    }
  },
  components: {
    VueFullCalendar // make the <VueFullCalendar> tag available
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    handleDateClick (e) {
      console.log('handleDateClick: ' + this.calendarEvents)
    },
    handleSelect (e) {
      console.log('handleSelect: ' + Object.values(this.calendarEvents))
      console.log('this.calendarEvents: ' + this.calendarEvents[0])
      console.log('handleSelect: ' + Object.keys(e))
      Vue.swal('Audiencia agendada al proceso correctamente')
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
