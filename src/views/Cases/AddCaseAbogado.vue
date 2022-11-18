<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <form class="mt-4" @submit.prevent="handleSubmit(onSubmit)">
            <b-row>
              <b-col lg="12">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">Guardar Caso</h4>
                    <p>Campos marcados con * son obligatorios</p>
                  </template>
                  <template v-slot:body>
                    <b-row>
                      <b-col lg="12">
                        <b-row>
                          <b-form-group
                            class="col-md-5"
                            label="Cliente*"
                            label-for="clinica_id"
                          >
                            <ValidationProvider
                              name="clinicas"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.clinica_id"
                                :options="clinicasOptions"
                                :reduce="(label) => label.code"
                                @input="getClientesClinica"
                                label="label"
                                id="clinica_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay clinicas.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar una clinicas</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group
                            class="col-md-5"
                            label="Solicitante*"
                            label-for="user_id"
                          >
                            <ValidationProvider
                              name="Cliente"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.user_id"
                                :options="clientesOptions"
                                :reduce="(label) => label.code"
                                @input="getUserClinicas"
                                label="label"
                                id="user_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Clientes.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un cliente</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                        </b-row>
                        <b-row>
                          <b-form-group
                            class="col-md-5"
                            label="Tipo de servicio*"
                            label-for="servicio_id"
                          >
                            <ValidationProvider
                              name="Servicio"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.servicio_id"
                                :options="serviciosOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="servicio_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Servicios.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un Servicio</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group
                            class="col-md-5"
                            label="Medio Solicitud*"
                            label-for="medio_id"
                          >
                            <ValidationProvider
                              name="Medios"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.medio_id"
                                :options="mediosOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="medio_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Medio.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un medio</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                        </b-row>
                        <b-row>
                          <b-form-group
                            class="col-md-5"
                            label="Actividad*"
                            label-for="actividad_id"
                          >
                            <ValidationProvider
                              name="Actividad"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="actividad_id"
                                :options="actividadesOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="actividad_id"
                                @input="getSubactividades"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Actividad.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar una Actividad</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group
                            class="col-md-5"
                            label="Tipo*"
                            label-for="subactividad_id"
                          >
                            <ValidationProvider
                              name="Tipo"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                @input="getTiempoAns"
                                v-model="caso.subactividad_id"
                                :options="subactividadOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="subactividad_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options"
                                  >No hay Tipos de Actividad.</span
                                >
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un Tipo</span>
                              </div>
                            </ValidationProvider>
                            <p
                              :key="fechaSolucionKey"
                              class="text-left"
                              v-if="fechaSolucion !== null"
                            >
                              Fecha apróximada de solución o respuesta:
                              {{ fechaSolucion }}
                            </p>
                          </b-form-group>
                        </b-row>
                        <b-row>
                          <b-form-group class="col-md-5" label="Proceso" label-for="ans_caso_prore_id">
                                    <v-select v-model="caso.ans_caso_prore_id" :options="processOptions" :reduce="label => label.code" label="label" id="ans_caso_prore_id">
                                      <span slot="no-options">No hay procesos.</span>
                                    </v-select>
                           </b-form-group>
                        </b-row>
                      </b-col>
                      <b-col lg="10">
                        <b-form-group
                          label="Descripción*"
                          label-for="textarea-decription"
                        >
                          <b-form-textarea
                            class="col-md-6"
                            id="textarea-decription"
                            v-model="caso.case_description"
                            rows="3"
                            :state="
                              caso.case_description.length <= 250 &&
                              caso.case_description.length >= 5
                            "
                            :required="true"
                          ></b-form-textarea>
                        </b-form-group>
                        <div
                          v-for="(casefile, index) in caseFiles"
                          :key="index"
                        >
                          <b-form-group>
                            <b-form-file
                              class="col-md-5"
                              v-model="casefile.file"
                              :name="`file-${index}`"
                              placeholder="Añadir archivo"
                            ></b-form-file>
                            <b-button
                              size="sm"
                              variant="danger"
                              style="margin-left: 10px"
                              v-b-tooltip.hover
                              title="Quitar archivo"
                              @click="removeFile(index)"
                              ><em class="fa fa-times"></em
                            ></b-button>
                          </b-form-group>
                        </div>
                        <b-form-group
                          ><b-button
                            size="sm"
                            variant="success"
                            v-b-tooltip.hover
                            title="Adjuntar otro archivo"
                            @click="addFile"
                            ><em class="fa fa-plus"></em> </b-button
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
                </iq-card>
              </b-col>
            </b-row>
          </form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import auth from '@/logic/auth'
export default {
  name: 'AddCaseAbogado',
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Guardar Caso',
      actividad_id: '',
      caso: {
        user_id: '',
        servicio_id: '',
        clinica_id: '',
        abogado_id: '',
        medio_id: '',
        subactividad_id: '',
        case_title: '',
        case_description: '',
        ans_caso_prore_id: ''
      },
      clientesOptions: [],
      serviciosOptions: [],
      clinicasOptions: [],
      abogadosOptions: [],
      actividadesOptions: [],
      subactividadOptions: [],
      mediosOptions: [],
      fechaSolucion: null,
      processOptions: [],
      fechaSolucionKey: 0,
      caseFiles: [
        {
          file: null
        }
      ]
    }
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    xray.index()
    this.getActividades()
    this.getServicios()
    this.getUserClinicas()
    setTimeout(() => {
      this.getMediosSolicitud()
      this.fetchProcessOptions()
    }, 500)
  },
  methods: {
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.status === 200) {
          this.clinicasOptions = res.data.clinicas
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    getActividades () {
      axios.get('/actividades/fetch').then((response) => {
        this.actividadesOptions = response.data.actividades
      })
    },
    getSubactividades () {
      axios
        .get('/subactividades/fetch/' + this.actividad_id)
        .then((response) => {
          this.subactividadOptions = response.data.subactividades
        })
    },
    getClientes () {
      axios.get('/clientes/fetch').then((response) => {
        this.clientesOptions = response.data.clientes
      })
    },
    getMediosSolicitud () {
      axios.get('/medios-solicitud/fetch').then((response) => {
        this.mediosOptions = response.data.medios
      })
    },
    getServicios () {
      axios.get('/servicios/fetch').then((response) => {
        this.serviciosOptions = response.data.servicios
      })
    },
    getClientesClinica () {
      axios.get('/clinica/getcliente/' + this.caso.clinica_id).then((res) => {
        if (res.status === 200) {
          this.clientesOptions = res.data.users
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    getTiempoAns () {
      axios
        .get('/subactividades/getTiempoAns/' + this.caso.subactividad_id)
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
    fetchProcessOptions () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerProcesosParaLista/' + this.userLogged.usr_id).then(response => {
          this.processOptions = response.data.process
          if (this.processOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchProcessOptions()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.guardarCaso()
    },
    addFile () {
      this.caseFiles.push({
        file: null
      })
    },
    removeFile (index) {
      this.caseFiles.splice(index, 1)
    },
    guardarCaso () {
      this.textoBoton = 'Guardando...'

      const data = new FormData()

      data.append('case_description', this.caso.case_description)
      data.append('user_id', this.caso.user_id)
      data.append('clinica_id', this.caso.clinica_id)
      data.append('servicio_id', this.caso.servicio_id)
      if (this.userLogged.hasOwnProperty('pro_id')) {
        data.append('profesional_id', this.userLogged.pro_id)
      }
      data.append('subactividad_id', this.caso.subactividad_id)
      data.append('medio_id', this.caso.medio_id)
      data.append('ans_caso_prore_id', this.caso.ans_caso_prore_id)

      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
          index++
        }
      }

      data.append('cantidad_archivos', index)

      axios.post('/casos-abogado/create', data).then((res) => {
        if (res.status === 200) {
          Vue.swal(res.data.message)
          this.$router.push({ path: `/cases/cases-show/${res.data.caso_id}` })
        } else {
          this.estadoBoton = ''
          this.textoGuardar = 'Guardar'
          Vue.swal(res.data.message)
        }
      })
    }
  }
}
</script>
