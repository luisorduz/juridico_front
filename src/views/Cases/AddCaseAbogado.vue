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
                        </b-row>
                        <b-row>
                          <b-form-group
                            class="col-md-5"
                            label="Clinica*"
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
                            label="Asignado a *"
                            label-for="abogado_id"
                          >
                            <ValidationProvider
                              name="abogado"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.abogado_id"
                                :options="abogadosOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="abogado_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Abogados.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un abogado</span>
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
                          </b-form-group>
                        </b-row>
                        <b-row>
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
                      </b-col>
                      <b-col lg="10">
                        <b-form-group label="Titulo*" label-for="case_title">
                          <b-form-input
                            class="col-md-6"
                            v-model="caso.case_title"
                            type="text"
                            :required="true"
                          ></b-form-input>
                        </b-form-group>

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
        case_description: ''
      },
      clientesOptions: [],
      serviciosOptions: [],
      clinicasOptions: [],
      abogadosOptions: [],
      actividadesOptions: [],
      subactividadOptions: [],
      mediosOptions: [],
      caseFiles: [
        {
          file: null
        }
      ]
    }
  },
  mounted () {
    xray.index()
    this.getActividades()
    this.getProfesionals()
    this.getClientes()
    this.getServicios()
    this.getMediosSolicitud()
  },
  methods: {
    getUserClinicas () {
      axios.get('/clinicas/' + this.caso.user_id).then((res) => {
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
    getProfesionals () {
      axios.get('/professionals/fetch').then((response) => {
        this.abogadosOptions = response.data.professionals
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

      data.append('case_title', this.caso.case_title)
      data.append('case_description', this.caso.case_description)
      data.append('user_id', this.caso.user_id)
      data.append('clinica_id', this.caso.clinica_id)
      data.append('servicio_id', this.caso.servicio_id)
      data.append('profesional_id', this.caso.abogado_id)
      data.append('subactividad_id', this.caso.subactividad_id)
      data.append('medio_id', this.caso.medio_id)

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
