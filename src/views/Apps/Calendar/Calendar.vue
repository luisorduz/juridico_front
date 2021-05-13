<template>
  <b-container fluid>
    <b-row>
      <b-col md="3">
        <iq-card class="calender-small">
          <template v-slot:body>
            <flat-pickr :config="config" value="" class="d-none"/>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title ">Classification</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#"><i class="fa fa-plus  mr-0" aria-hidden="true" /></a>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 job-classification">
              <li class=""><i class="ri-check-line bg-danger" />Meeting</li>
              <li class=""><i class="ri-check-line bg-success" />Business travel</li>
              <li class=""><i class="ri-check-line bg-warning" />Personal Work</li>
              <li class=""><i class="ri-check-line bg-info" />Team Project</li>
            </ul>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Today's Schedule</h4>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 today-schedule">
              <li class="d-flex">
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-primary" /></div>
                <div class="schedule-text"> <span>Web Design</span>
                  <span>09:00 to 12:00</span></div>
              </li>
              <li class="d-flex">
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-success" /></div>
                <div class="schedule-text"> <span>Participate in Design</span>
                  <span>09:00 to 12:00</span></div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
      <b-col md="9">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Book Appointment</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#" class="btn btn-primary"><i class="ri-add-line mr-2"></i>Book Appointment</a>
          </template>
          <template v-slot:body>
            <FullCalendar :calendarEvents="events" />
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'
export default {
  name: 'GoogleCalendar',
  components: { },
  data () {
    return {
      config: {
        dateFormat: 'Y-m-d',
        inline: true
      },
      events: [],
      events2: [
        {
          title: 'All Day Event',
          start: '2021-05-07',
          color: '#fc9919'
        },
        {
          title: 'Long Event',
          start: '2021-05-20',
          end: '2021-05-25',
          color: '#ffc107' // override!
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2021-05-09T16:00:00',
          color: '#17a2b8'
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2021-05-10T16:00:00',
          color: '#17a2b8'
        },
        {
          title: 'Conference',
          start: '2021-05-12',
          end: '2021-05-15',
          color: '#27e3f4' // override!
        },
        {
          title: 'Meeting',
          start: '2021-05-15T10:30:00',
          end: '2021-05-16T12:30:00',
          color: '#0084ff'
        },
        {
          title: 'Lunch',
          start: '2021-05-09T12:00:00',
          color: '#777D74'
        },
        {
          title: 'Meeting',
          start: '2021-05-11T14:30:00',
          color: '#0084ff'
        },
        {
          title: 'Birthday Party',
          start: '2021-05-12T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Meeting',
          start: '2021-05-13T14:30:00',
          color: '#0084ff'
        },
        {
          title: 'Birthday Party',
          start: '2021-05-14T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2020-01-25'
        },
        {
          title: 'Birthday Party',
          start: '2021-05-15T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2021-05-18'
        },
        {
          title: 'Meeting',
          start: '2020-01-12T14:30:00',
          color: '#0084ff'
        },
        {
          title: 'Birthday Party',
          start: '2021-05-20T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2021-05-21'
        },
        {
          title: 'All Day Event',
          start: '2021-05-22',
          color: '#fc9919'
        },
        {
          title: 'Long Event',
          start: '2021-05-23',
          end: '2020-02-10',
          color: '#ffc107' // override!
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2021-05-24T16:00:00',
          color: '#17a2b8'
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2021-05-25T16:00:00',
          color: '#17a2b8'
        }
      ]
    }
  },
  mounted () {
    xray.index()
    this.getAgendas()
  },
  computed: {
  },
  methods: {
    getAgendas () {
      axios.get('/audiencias').then(response => {
        console.log('response.data.audiencias: ' + response.data.audiencias)
        this.events = response.data.audiencias
      })
      console.log('this.events: ' + this.events)
    }
  }
}
</script>
