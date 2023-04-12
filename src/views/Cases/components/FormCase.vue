<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <form class="mt-4" @submit.prevent="handleSubmit(onSubmit)">
            <template>
              <b-row
                class="justify-content-center text-center align-items-center"
              >
                <b-col lg="10">
                  <b-row>
                    <b-col v-if="clinicasUser.length > 1" xs="12">
                      <b-form-group label="Clinica*" label-for="user_id">
                        <v-select
                          v-model="caseClinicaId"
                          :options="clinicasUser"
                          :reduce="(label) => label.code"
                          label="label"
                          id="user_id"
                        >
                          <span slot="no-options">No hay Clinicas.</span>
                        </v-select>
                      </b-form-group>
                    </b-col>
                    <b-col xs="6">
                      <label for="textarea-decription">Asunto*
                        <b-badge
                          variant="info"
                          style="margin-left: 5px"
                          v-b-tooltip.hover
                          title="En este campo da un titulo que englobe tu solicitud. Máximo 100 caracteres."
                        >
                          <em class="fa fa-info"></em>
                        </b-badge>
                      </label>
                      <b-form-group label-for="case_title">
                        <b-form-input
                          v-model="caseTitle"
                          type="text"
                          :required="true"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col xs="6">
                      <b-form-group
                        class="col-md-12"
                        label="Actividad*"
                        label-for="act_id"
                      >
                        <ValidationProvider
                          name="Actividad"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-select
                            v-model="caseActividadId"
                            :options="actividadesOptions"
                            :reduce="(label) => label.code"
                            label="label"
                            id="act_id"
                            @input="getSubactividades"
                            :class="errors.length > 0 ? ' is-invalid' : ''"
                          >
                          <span slot="no-options">No hay Actividades.</span>
                          </v-select>
                          <div class="invalid-feedback">
                            <span>Debe de seleccionar una Actividad</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                  </b-row>
                  <b-row v-if="!esCliente()">
                    <b-col xs="12">
                      <b-form-group
                        label="Fecha de solicitud*"
                        label-for="case_title">
                        <ValidationProvider
                          name="Solicitud"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <datetime
                            class="form-control datetime-formulario"
                            type="datetime"
                            v-model="caseFechaSolicitud" use12-hour
                            :class="errors.length > 0 ? ' is-invalid' : ''"
                          >
                          </datetime>
                          <div class="invalid-feedback">
                            <span>Debe de seleccionar una fecha</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col xs="10" style="margin-bottom: 25px">
                      <label for="textarea-decription">
                        Descripción del asunto*
                        <b-badge
                          variant="info"
                          style="margin-left: 5px"
                          v-b-tooltip.hover
                          title="En este campo detalla la solicitud que requiere que realice nuestro equipo de abogados"
                          ><em class="fa fa-info"></em></b-badge
                      ></label>
                      <b-form-textarea
                        id="textarea-decription"
                        v-model="caseDescription"
                        placeholder="Por favor escribe el detalle de tu solicitud..."
                        rows="3"
                        :state="
                          caseDescription.length <= 500 &&
                          caseDescription.length >= 5
                        "
                        :required="true"
                      ></b-form-textarea>
                    </b-col>
                  </b-row>
                  <div v-if="onEdit" class="text-left" style="margin: 20px">
                    <b-list-group
                      v-for="(archivo, index) in archivosCaso"
                      :key="archivo.arch_casos_id + index"
                    >
                      <b-list-group-item v-if="archivo.deleted_at !== null">
                        <span
                          style="text-decoration: underline; cursor: pointer"
                          @click="
                            descargarArchivoCaso(
                              archivo.arch_casos_nombre,
                              archivo.arch_casos_id
                            )
                          "
                          v-b-tooltip.hover
                          title="Descargar archivo"
                          >{{ archivo.arch_casos_nombre }}
                        </span>
                        <b-badge
                          variant="danger"
                          style="margin-left: 5px"
                          v-b-tooltip.hover
                          title="Quitar archivo"
                          @click="
                            eliminarArchivo('caso', archivo.arch_casos_id)
                          "
                          ><em class="fa fa-times"></em
                        ></b-badge>
                      </b-list-group-item>
                    </b-list-group>
                    <b-list-group
                      style="margin-top: 10px"
                      v-for="(archivo, index) in archivosSeguimiento"
                      :key="archivo.arch_seg_id + index"
                    >
                      <b-list-group-item>
                        <span
                          style="text-decoration: underline; cursor: pointer"
                          @click="
                            descargarArchivoSeguimiento(
                              archivo.arch_seg_nombre,
                              archivo.arch_seg_id
                            )
                          "
                          v-b-tooltip.hover
                          title="Descargar archivo"
                          >{{ archivo.arch_seg_nombre }}
                        </span>
                        <b-badge
                          variant="danger"
                          style="margin-left: 5px"
                          v-b-tooltip.hover
                          title="Quitar archivo"
                          @click="
                            eliminarArchivo('segumiento', archivo.arch_seg_id)
                          "
                          ><em class="fa fa-times"></em
                        ></b-badge>
                      </b-list-group-item>
                    </b-list-group>
                  </div>
                  <b-row v-for="(casefile, index) in caseFiles" :key="index">
                    <b-col xs="12">
                      <b-form-group>
                        <b-row>
                          <b-col xs="8">
                            <b-form-file
                              v-model="casefile.file"
                              :name="`file-${index}`"
                              placeholder="Añadir archivo"
                            ></b-form-file>
                          </b-col>
                          <b-col xs="5">
                            <b-form-datepicker
                              placeholder="Fecha de Recepción"
                              style="height: 35px;"
                              :id="`exampleInputdate-${index}`"
                              class="fecha-archivo-caso"
                              :date-format-options="{
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                weekday: 'short'
                              }"
                              v-model="casefile.date"
                              locale="es"
                            ></b-form-datepicker>
                          </b-col>
                          <b-button
                            size="sm"
                            variant="danger"
                            style="margin-left: 10px; height: 30px"
                            v-b-tooltip.hover
                            title="Quitar archivo"
                            @click="removeFile(index)"
                            ><em class="fa fa-times"></em
                          ></b-button>
                        </b-row>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-form-group
                    ><b-button
                      size="sm"
                      variant="success"
                      v-b-tooltip.hover
                      title="Adjuntar otro archivo"
                      @click="addFile"
                      ><em class="fa fa-plus"></em> Agregar fila</b-button
                  ></b-form-group>
                  <b-form-group>
                    <b-button
                      variant="primary"
                      type="submit"
                      :class="estadoBoton"
                      >{{ textoBoton }}</b-button
                    >
                  </b-form-group>
                </b-col>
              </b-row>
            </template>
          </form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'
import { Datetime } from 'vue-datetime'
import fileDownload from 'js-file-download'
import Swal from 'sweetalert2/dist/sweetalert2.js'
export default {
  name: 'FormCase',
  props: {
    case_id: Number,
    case_title: String,
    case_description: String,
    case_clinica_id: Number,
    act_id: Number,
    case_actividad_id: Number,
    case_subactividad_id: Number,
    case_fecha_solicitud: String,
    onEdit: Boolean,
    reloadFunciont: Function,
    archivosCaso: Array,
    archivosSeguimiento: Array
  },
  components: {
    datetime: Datetime
  },
  data () {
    return {
      clinicasUser: [],
      actividadesOptions: [],
      caseTitle: '',
      caseDescription: '',
      caseClinicaId: null,
      caseActividadId: null,
      subactividad_id: null,
      caseFechaSolicitud: null,
      actividad_id: '',
      subactividadesOptions: [],
      textoBoton: 'Guardar Caso',
      estadoBoton: '',
      caseFiles: [
        {
          file: null,
          date: null
        }
      ],
      intentos: 0,
      fechaSolucion: null,
      fechaSolucionKey: 0,
      validData: true
    }
  },
  computed: {
    userLogged () {
      if (auth.getUserLogged() !== undefined) {
        return JSON.parse(auth.getUserLogged())
      } else {
        return null
      }
    }
  },
  mounted () {
    this.getActividades()
    this.getUserClinicas()
    this.caseTitle = this.case_title
    this.caseDescription = this.case_description
    this.caseClinicaId = this.case_clinica_id
    this.caseActividadId = this.case_actividad_id
    if (this.caseActividadId !== undefined) {
      this.getSubactividades()
    }
    this.subactividad_id = this.case_subactividad_id
    this.caseFechaSolicitud = (this.case_fecha_solicitud !== undefined && this.case_fecha_solicitud !== null) ? this.case_fecha_solicitud.replace(' ', 'T') : ''
  },
  methods: {
    addFile () {
      this.caseFiles.push({
        file: null,
        date: null
      })
    },
    removeFile (index) {
      this.caseFiles.splice(index, 1)
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.textoBoton = 'Guardando...'
      if (this.onEdit) {
        this.actualizarCaso()
      } else {
        this.crearCaso()
      }
    },
    actualizarCaso () {
      const data = new FormData()

      data.append('case_title', this.caseTitle)
      data.append('case_description', this.caseDescription)
      data.append('case_clinica_id', this.caseClinicaId)
      data.append('case_subactividad_id', this.subactividad_id)
      data.append('case_fecha_solicitud', this.caseFechaSolicitud)

      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          if (casefile.date != null) {
            data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
            data.append('file_date-' + index, casefile.date)
            index++
          } else {
            this.validData = false
            Vue.swal('Debes subir archivos con fecha de recepción')
          }
        }
      }

      data.append('cantidad_archivos', index)
      if (this.validData) {
        axios.post('/casos/update/' + this.case_id, data).then((res) => {
          this.reloadFunciont()
          Vue.swal(res.data.message)
          this.estadoBoton = ''
          this.textoBoton = 'Guardar Caso'
          this.validData = true
        })
          .catch((e) => {
            Vue.swal('Error al tratar de actualizar el caso.')
            this.estadoBoton = ''
            this.textoBoton = 'Guardar Caso'
            this.validData = true
          })
      } else {
        this.estadoBoton = ''
        this.textoBoton = 'Guardar Caso'
        this.validData = true
      }
    },
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.data.success === 200) {
          if (res.data.clinicas.length > 1) {
            for (let clinica of res.data.clinicas) {
              this.clinicasUser.push(clinica)
            }
          } else {
            this.caseClinicaId = res.data.clinicas[0].code
          }
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    crearCaso () {
      const data = new FormData()

      data.append('case_title', this.caseTitle)
      data.append('case_description', this.caseDescription)
      data.append('user_id', this.userLogged.usr_id)
      data.append('clinica_id', this.caseClinicaId)
      data.append('subactividad_id', this.subactividad_id)
      data.append('case_fecha_solicitud', this.caseFechaSolicitud)

      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          if (casefile.date != null) {
            data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
            data.append('file_date-' + index, casefile.date)
            index++
          } else {
            this.validData = false
            Vue.swal('Debes subir archivos con fecha de recepción')
          }
        }
      }

      data.append('cantidad_archivos', index)

      if (this.validData) {
        axios.post('/casos/create', data).then((res) => {
          if (res.status === 200) {
            this.$router.push({ path: `/cases/cases-show/${res.data.caso_id}` })
          }
          Vue.swal(res.data.message)
        })
      } else {
        this.estadoBoton = ''
        this.textoBoton = 'Guardar Caso'
        this.validData = true
      }
    },
    getActividades () {
      axios.get('/actividades/fetch').then((response) => {
        this.actividadesOptions = response.data.actividades
      })
    },
    getSubactividades () {
      this.subactividad_id = ''
      this.fechaSolucion = null
      this.fechaSolucionKey++
      axios
        .get('/subactividades/fetch/' + this.caseActividadId)
        .then((response) => {
          this.subactividadesOptions = response.data.subactividades
        })
    },
    getTiempoAns () {
      axios
        .get('/subactividades/getTiempoAns/' + this.subactividad_id)
        .then((res) => {
          this.fechaSolucion = res.data.fechaSolucion
        })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getTiempoAns()
            this.intentos++
          }
        })
    },
    descargarArchivoCaso (filename, id) {
      axios({
        url: '/casos/descargar-archivo/' + id,
        method: 'GET',
        responseType: 'blob'
      })
        .then((response) => {
          if (response.data != null) {
            fileDownload(response.data, filename)
          } else {
            Vue.swal('No se encontró archivo')
          }
        })
        .catch((err) => {
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    descargarArchivoSeguimiento (filename, id) {
      axios({
        url: '/seguimiento/descargar-archivo/' + id,
        method: 'GET',
        responseType: 'blob'
      })
        .then((response) => {
          if (response.data != null) {
            fileDownload(response.data, filename)
          } else {
            Vue.swal('No se encontró archivo')
          }
        })
        .catch((err) => {
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    eliminarArchivo (tipo, archivoId) {
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este Archivo?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get(
              '/archivo-' +
                tipo +
                '/delete/' +
                archivoId +
                '/' +
                this.userLogged.usr_id
            )
            .then((res) => {
              if (res.status === 200) {
                this.loading = true
                this.reloadFunciont()
              }
              Vue.swal(res.data.message)
            })
            .catch((err) => {
              Vue.swal(
                'Ups sucedió un error tratando de consulta la información. ' +
                  err
              )
            })
        }
      })
    },
    esCliente () {
      if (this.userLogged.user_profile === 11) {
        return true
      }
      return false
    },
    redimensionCliente () {
      if (this.userLogged.user_profile === 11) {
        return '12'
      }
      return '6'
    }
  }
}
</script>
