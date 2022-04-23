<template>
  <b-container fluid>
    <section>
      <div class="py-5" v-if="prore_id !== undefined && loading">
        <b-progress :max="max" height="2rem">
          <b-progress-bar :progress_total="progress_total" variant="success" :style="{width: progress_total + '%'}">
            <span><b>{{ progress_total }}%</b></span>
          </b-progress-bar>
        </b-progress>
      </div>
      <div v-else>
        <!-- INICIAL DE MODAL DE ACTUACIÓN -->
        <div>
          <b-modal id="modal-nueva-actuacion" size="lg" title="Agregar actuación" hide-footer>
            <form ref="form">
              <p v-if="errors.length">
                <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>
              <b-row>
                <b-col md="4">
                  <b-form-group label="Asignar Abogada/o*" label-for="agen_pro_id">
                    <!-- <b-form-select plain v-model="proceeding.proce_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione abogado</b-form-select-option>
                      </template>
                    </b-form-select> -->
                    <v-select
                      v-model="proceeding.proce_pro_id"
                     :options="abogadoOptions"
                     :reduce="label => label.code"
                     label="label" id="proce_pro_id"
                     >
                      <span slot="no-options">No hay abogados.</span>
                    </v-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Tipo de actuación*" label-for="proce_sta_id">
                    <!-- <b-form-select plain v-model="proceeding.proce_sta_id" :options="statusProcessOptions" id="proce_sta_id">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione un estado</b-form-select-option>
                      </template>
                    </b-form-select> -->
                    <v-select
                      v-model="proceeding.proce_sta_id"
                     :options="statusProcessOptions"
                     :reduce="label => label.code"
                     label="label" id="proce_sta_id"
                     >
                      <span slot="no-options">No hay estados.</span>
                    </v-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Fecha de ingreso*" label-for="proce_fecha_ingreso">
                    <b-form-input id="proce_fecha_ingreso" v-model="proceeding.proce_fecha_ingreso" type="date" ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="4">
                  <b-form-group label="Fecha de siguiente audiencia" label-for="proce_fecha_siguiente_audiencia">
                    <b-form-input id="proce_fecha_siguiente_audiencia" v-model="proceeding.proce_fecha_siguiente_audiencia" type="date"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Hora de siguiente audiencia" label-for="proce_hora_siguiente_audiencia">
                    <b-form-input id="proce_hora_siguiente_audiencia" v-model="proceeding.proce_hora_siguiente_audiencia" type="time"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-textarea v-model="proceeding.proce_descripcion" type="text" placeholder="Descripción de la actuación*"></b-form-textarea>
                </b-col>
              </b-row>
              <b-row>
                <b-col col-auto>
                  <b-form-group  label="Nombre del link" label-for="link_proce_id">
                    <b-form-input v-model="nuevoLinkProceeding.link_name" type="text" placeholder="Página de Google"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col col-auto>
                  <b-form-group  label="URL del link" label-for="imp_nombres">
                    <b-form-input v-model="nuevoLinkProceeding.link_url" type="text" placeholder="www.google.com.co"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col class="text-left col-auto">
                  <b-form-group  label=" " label-for="link_proce_id">
                    <a style="pointer-events:all;" href="#" @click="agregarLinkProceeding"><i class="ri-add-circle-line" style="font-size: 40px;color: green;"></i></a>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <div v-if="linksProceeding !== undefined && linksProceeding !==''">
                    <b-table :items="linksProceeding" :fields="columnasLinkActuacion" stacked="md" small>
                      <template #cell(name)="row">
                        {{ row.value.first }} {{ row.value.last }}
                      </template>
                      <template #cell(actions)="row">
                        <b-button size="sm" variant="danger" @click="deleteLinkProceeding(row.index)" :class="estadoBotonEliminarLinkProceeding"> Remover </b-button>
                      </template>
                    </b-table>
                    <hr>
                  </div>
                </b-col>
              </b-row>
              <div class="text-right pt-1">
                <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-nueva-actuacion')">Cancelar</b-button>
                <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarActuacion">{{ textoGuardarModal }}</b-button>
              </div>
            </form>
          </b-modal>
        </div>
        <!-- FIN MODAL DE NUEVA ACTUACIÓN -->
        <ModalTerminarProceso :num_radicado="process.prore_num_radicado" :usr_id="userLogged.usr_id" :prore_id="proceeding.proce_prore_id" v-if="mostrarModalTerminarProceso" />
        <!-- INICIO DE MODAL DE AGREGAR IMPLICADO -->
        <div>
          <b-modal id="modal-nuevo-implicated" size="lg" title="Agregar/Editar involucrado" hide-footer>
            <form ref="form">
              <p v-if="errors.length">
                <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>
              <b-row>
                <b-col md="3">
                  <b-form-group label="Tipo de identificación" label-for="imp_tipo_identificacion">
                    <b-form-select plain v-model="nuevoImplicated.imp_tipo_identificacion" :options="tipoIdentificacionOptions" id="imp_tipo_identificacion">
                      <template v-slot:first>
                        <b-form-select-option :value="null">Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Identificación" label-for="imp_identificacion">
                    <b-form-input v-model="nuevoImplicated.imp_identificacion" type="text" placeholder="Identificación"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Nombres/Razón social*" label-for="imp_nombres">
                    <b-form-input v-model="nuevoImplicated.imp_nombres" type="text" placeholder="Nombres"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Apellidos" label-for="imp_apellidos">
                    <b-form-input v-model="nuevoImplicated.imp_apellidos" type="text" placeholder="Apellidos"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="4">
                  <b-form-group label="Rango de edad" label-for="imp_rango_edad">
                    <b-form-select plain v-model="nuevoImplicated.imp_rango_edad" :options="rangoEdadOptions" id="imp_rango_edad">
                      <template v-slot:first>
                        <b-form-select-option :value="null">Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Genero" label-for="imp_genero_id">
                    <b-form-select plain v-model="nuevoImplicated.imp_genero_id" :options="generoOptions" id="imp_genero_id">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Dirección de residencia" label-for="imp_direccion">
                    <b-form-input id="imp_direccion" v-model="nuevoImplicated.imp_direccion" type="text"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Perfil*" label-for="imp_profile_id">
                    <!-- <b-form-select plain v-model="nuevoImplicated.imp_profile_id" :options="profilesOptions" id="imp_profile_id">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select> -->
                    <v-select v-model="nuevoImplicated.imp_profile_id" :options="profilesOptions" :reduce="label => label.code" label="label" id="imp_profile_id">
                      <span slot="no-options">No hay perfiles.</span>
                    </v-select>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Teléfonos" label-for="imp_telefonos">
                    <b-form-input v-model="nuevoImplicated.imp_telefonos" type="text" placeholder="Ej 3176669800, 3110910092"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Correos" label-for="imp_emails">
                    <b-form-input v-model="nuevoImplicated.imp_emails" type="text" placeholder="Ej hola@example.com, prueba@example.com" ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <div class="form-check col-12 m-3">
                  <b-form-checkbox class="form-check-input" type="checkbox" v-model="nuevoImplicated.imp_principal" id="flexCheckChecked">Involucrado principal</b-form-checkbox>
                </div>
              </b-row>
              <div class="text-right pt-1">
                <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-nuevo-implicated')">Cancelar</b-button>
                <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarImplicated">{{ textoGuardarModal }}</b-button>
              </div>
            </form>
          </b-modal>
        </div>
        <!-- FIN MODAL DE NUEVO IMPLICADO -->
        <b-row>
          <b-col lg="12">
            <iq-card body-class="p-0">
              <template v-slot:body>
                <div class="iq-edit-list">
                  <tab-nav :pills="true" class="iq-edit-profile d-flex">
                    <tab-nav-items class="col-auto p-0" :active="true" href="#personal-information" title="Info proceso" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#involucrados" title="Involucrados" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#actuaciones" title="Actuaciones" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#costos-cuantias" title="Costos/Cuantías" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#poliza" title="Poliza" />
                    <!-- <tab-nav-items class="col-auto p-0" :active="false" href="#comentarios" title="Comentarios" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#notas" title="Notas" /> -->
                    <tab-nav-items class="col-auto p-0" :active="false" href="#links" title="Documentos del proceso" />
                  </tab-nav>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="12" class="pagina-detalle-proceso">
            <div class="iq-edit-list-data">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="personal-information" >
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Información del proceso
                        <span v-if="process.profile != null">
                          <span v-if="process.prore_profile_id == 7" class='text-success'>(ROL DE CLÍNICA - {{ process.profile.prof_name }})</span>
                          <span v-else-if="process.prore_profile_id == 8" class='text-danger'>(ROL DE CLÍNICA: {{ process.profile.prof_name }})</span>
                          <span v-else class='text-warning'>(ROL DE CLÍNICA - {{ process.profile.prof_name }})</span>
                        </span>
                      </h4>
                    </template>
                    <template v-slot:headerAction>
                      <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
                      <b-button variant="primary" :class="estadoBotonActualizarProceso" @click="editarProceso">{{ textoEditarProceso }}</b-button>
                      <b-button variant="danger" v-if="process.prore_estado != 1" :class="estadoBotonTerminarProceso" class="ml-3" v-b-modal.modal-terminar-proceso @click="verModalTerminarProceso(prore_id)">Terminar Proceso</b-button>
                    </template>
                    <template v-slot:body>
                      <div v-if="implicateds != null">
                        <b-row class="col-md-12 pt-2">
                          <h4 class="card-title">
                            <span v-if="process.prore_profile_id == 7"><strong>Demandado(s):</strong></span>
                            <span v-else-if="process.prore_profile_id == 8"><strong>Demandante(s):</strong></span>
                            <span v-else><strong>Demandante(s):</strong></span>
                          </h4>
                          <b-row class="col-md-12 pt-2">
                            <span v-for="(implicate, index) in implicateds" :key="index">
                              <p class="pr-3">
                                <span v-if="process.prore_profile_id == 7">
                                  <b-card-text class="my-0 pt-1 text-upper" v-if="implicate.imp_profile_id == 8">
                                    <span v-b-tooltip.hover title="Principal" class="bg-danger p-1" style="background-color: #089bab; color: white; border-radius:4px" v-if="implicate.imp_principal">
                                      <i class="fas fa-user" style="color:red"></i>
                                      {{implicate.imp_nombres + " " + implicate.imp_apellidos}}
                                    </span>
                                    <span v-else>
                                      <i class="fas fa-user"></i>
                                      {{implicate.imp_nombres + " " + implicate.imp_apellidos}}
                                    </span>
                                  </b-card-text>
                                </span>
                                <span v-else-if="process.prore_profile_id == 8">
                                  <b-card-text class="my-0 pt-1 text-uppercase" v-if="implicate.imp_profile_id == 7 || implicate.imp_profile_id == 6">
                                    <span v-b-tooltip.hover title="Principal" class="p-1" style="background-color: #089bab; color: white; border-radius:4px" v-if="implicate.imp_principal">
                                      <i class="fas fa-user" style="color:white"></i>
                                      {{implicate.imp_nombres + " " + implicate.imp_apellidos}}
                                    </span>
                                    <span v-else>
                                      <i class="fas fa-user"></i>
                                      {{implicate.imp_nombres + " " + implicate.imp_apellidos}}
                                    </span>
                                  </b-card-text>
                                </span>
                                <span v-else>
                                  <b-card-text class="my-0 pt-1 text-uppercase" v-if="implicate.imp_profile_id == 7 || implicate.imp_profile_id == 6">
                                    <span v-b-tooltip.hover title="Principal" class="p-1" style="background-color: #089bab; color: white; border-radius:4px" v-if="implicate.imp_principal">
                                      <i class="fas fa-user" style="color:white"></i>
                                      {{implicate.imp_nombres + " " + implicate.imp_apellidos}}
                                    </span>
                                    <span v-else>
                                      <i class="fas fa-user"></i>
                                      {{implicate.imp_nombres + " " + implicate.imp_apellidos}}
                                    </span>
                                  </b-card-text>
                                </span>
                              </p>
                            </span>
                          </b-row>
                        </b-row>
                      </div>
                      <hr>
                      <div v-if="!editando">
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="my-0 pr-3"><b>Etapa procesal: </b><span v-if="process.proceedings != null && process.proceedings[0] != null">{{ process.proceedings[0].status_process.estado_proceso }}</span></b-card-text>
                          <b-card-text class="my-0 pr-3" v-if="process.proceedings != null && process.proceedings[0] != null && process.proceedings[0].status_process.sta_id ===  16"><b>Fecha terminación: </b><span >{{ process.proceedings[0].proce_fecha_ingreso }}</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>ID Litigando: </b><span v-if="process.prore_litigando_id != null">{{ process.prore_litigando_id }} </span><span class="text-danger" v-if="process.prore_litigando_id == null">Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3"><b>Número de Radicado:</b> <span v-if="process.prore_num_radicado != null">{{ process.prore_num_radicado }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3"><b>Riesgo NIIF:</b> <span v-if="process.prore_risk_id != null">{{ process.riesgo.risk_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b>Abogado Líder:</b>
                        <b-row class="col-md-12 pt-1" v-if="process.professional != null">
                          <b-card-text class="pr-3 my-0"><b>Nombre: </b>{{ process.professional.pro_name_first }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Apellido: </b>{{ process.professional.pro_lastname_first }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Identificación: </b>{{ process.professional.pro_identificacion }}</b-card-text>
                          <b-card-text class="my-0"><b>Correo electrónico: </b>{{ process.professional.pro_email }}</b-card-text>
                        </b-row>
                        <hr>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Tipo de proceso: </b><span v-if="process.tipo_proceso != null">{{ process.tipo_proceso.typro_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Juzgado: </b><span v-if="process.juzgado != null">{{ process.juzgado.court_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="my-0 pr-3"><b>Número radicado: </b><span v-if="process.prore_num_radicado != null">{{ process.prore_num_radicado }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Proceso Ejecutivo:</b> <span v-if="process.prore_proceso_ejecutivo != null">{{ process.prore_proceso_ejecutivo }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Ejecutante:</b> <span v-if="process.prore_ejecutante != null">{{ process.prore_ejecutante }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Medida Cautelar:</b> <span v-if="process.prore_medida_cautelar != null">{{ process.prore_medida_cautelar }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Ciudad:</b> <span v-if="process.ciudad != null">{{ process.ciudad.city_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha ingreso: </b>{{ process.prore_fec_ingreso }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Clinica:</b> <span v-if="process.clinica != null">{{ process.clinica.cli_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha siniestro: </b>{{ process.prore_fec_sinister }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Fecha aviso:</b> {{ process.prore_fec_sinies_aviso }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha de notificación IPS:</b> {{ process.prore_fec_recibo_notify }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Colaborador de IPS:</b> {{ process.prore_colaborador_ips }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Año de notificación: </b>{{ process.prore_year_notify }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha notificación prejudicial: </b>{{ process.prore_fec_noti_preju }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha notificación prejudicial:</b> {{ process.prore_fec_audi_conci_preju }}</b-card-text>
                        </b-row>
                        <hr>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text><b>Descripción del siniestro: </b>{{ process.prore_sinies_description }}</b-card-text>
                        </b-row>
                        <hr>
                        <b style="text-decoration:underline;">Conclusiones:</b>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Sentencia Final: </b><span v-if="process.prore_sentencia_final != null">{{ formatPrice(process.prore_sentencia_final) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Valor De La Sentencia Final: </b><span v-if="process.prore_val_sentencia_final != null">{{ formatPrice(process.prore_val_sentencia_final) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Discriminar Valor De La Condena:</b> <span v-if="process.prore_discriminar_val_condena != null">{{ formatPrice(process.prore_discriminar_val_condena) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Costas De La Sentencia: </b><span v-if="process.prore_costas_sentencia != null">{{ formatPrice(process.prore_costas_sentencia) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Costas Procesales Primera Instancia: </b><span v-if="process.prore_costas_procesales_primera_instancia != null">{{ formatPrice(process.prore_costas_procesales_primera_instancia) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Costas Procesales Segunda Instancia:</b> <span v-if="process.prore_costas_procesales_segunda_instancia != null">{{ formatPrice(process.prore_costas_procesales_segunda_instancia) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Total Costas: </b><span v-if="process.prore_total_costas != null">{{ formatPrice(process.prore_total_costas) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                      </div>
                      <div v-else>
                        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                          <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                          <b-row>
                            <b-form-group v-if="profileProcessOptions != null" class="col-md-6" label="Actuación en el proceso*" label-for="prore_profile_id">
                              <ValidationProvider name="Actuación en el proceso" rules="required" v-slot="{ errors }">
                                <v-select v-model="process.prore_profile_id" :options="profileProcessOptions" :reduce="label => label.code" label="label" id="prore_profile_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay perfiles.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Número de radicado*" label-for="prore_num_radicado">
                              <ValidationProvider name="Número de radicado" rules="required" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_num_radicado" type="number" placeholder="9387183671" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Identificador de litigando*" label-for="prore_litigando_id">
                              <ValidationProvider name="Identificador de litigando" rules="required" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_litigando_id" type="number" placeholder="9387183671" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de Ingreso a Juridico*" label-for="prore_fec_ingreso_jur">
                              <ValidationProvider name="Fecha de Ingreso a Juridico" rules="required" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_fec_ingreso_jur" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha Traslado Decreto 806" label-for="prore_fec_ingreso">
                              <ValidationProvider name="Fecha Traslado Decreto 806">
                                <b-form-input v-model="process.prore_fec_ingreso" type="date"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="clinicaOptions != null" class="col-md-6" label="Clinica/IPS*" label-for="prore_defendant_clin">
                              <ValidationProvider name="Clinica/IPS" rules="required" v-slot="{ errors }">
                                <v-select v-model="process.prore_defendant_clin" :options="clinicaOptions" :reduce="label => label.code" label="label" id="prore_profile_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay clinicas.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha del Siniestro*" label-for="prore_fec_sinister">
                              <ValidationProvider name="Fecha del Siniestro" rules="required" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_fec_sinister" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                </b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="years != null" class="col-md-6" label="Año de notificación*" label-for="prore_year_notify">
                              <ValidationProvider name="Year de notificación" rules="required" v-slot="{ errors }">
                                <v-select v-model="process.prore_year_notify" :options="years" :reduce="label => label.code" label="label" id="prore_year_notify" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay años.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="years != null" class="col-md-6" label="Año del proceso*" label-for="prore_process_year">
                              <ValidationProvider name="Year del proceso" rules="required" v-slot="{ errors }">
                                <v-select v-model="process.prore_process_year" :options="years" :reduce="label => label.code" label="label" id="prore_process_year" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay años.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de notificación prejudicial" label-for="prore_fec_noti_preju">
                              <ValidationProvider name="Fecha de notificación prejudicial">
                                <b-form-input v-model="process.prore_fec_noti_preju" type="date"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de la audiencia de conciliación prejudicial*" label-for="prore_fec_audi_conci_preju">
                              <ValidationProvider name="Fecha de la audiencia de conciliación prejudicial" rules="required" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_fec_audi_conci_preju" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                </b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha aviso del siniestro" label-for="prore_fec_sinies_aviso">
                              <ValidationProvider name="Fecha de notificación prejudicial">
                                <b-form-input v-model="process.prore_fec_sinies_aviso" type="date"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Descripción del siniestro*" label-for="prore_sinies_description">
                              <ValidationProvider name="Descripción del siniestro" rules="required" v-slot="{ errors }">
                                <b-form-textarea v-model="process.prore_sinies_description" type="text" placeholder="Descripción" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-textarea>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Patología" label-for="prore_pathology">
                              <ValidationProvider name="Patología" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_pathology" type="text" placeholder="Patología..." :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de recibo de notificación IPS" label-for="prore_fec_recibo_notify">
                              <ValidationProvider name="Fecha de notificación prejudicial">
                                <b-form-input v-model="process.prore_fec_recibo_notify" type="date"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Colaborador de IPS que recibe notificación" label-for="prore_responsable">
                              <ValidationProvider name="Colaborador de IPS que recibe notificación" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_responsable" type="text" placeholder="Nombre completo colaborador" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de Ingreso a Clínica*" label-for="prore_fec_ingreso_cli">
                              <ValidationProvider name="Fecha de Ingreso a Clínica" rules="required" v-slot="{ errors }">
                                <b-form-input v-model="process.prore_fec_ingreso_cli" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                </b-form-input>
                                <div class="invalid-feedback">
                                  <span>Por favor verifique la información</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="citiesOptions != null" class="col-md-6" label="Ciudad*" label-for="prore_city_id">
                              <ValidationProvider name="Ciudad" rules="required" v-slot="{ errors }">
                                <v-select v-model="process.prore_city_id" :options="citiesOptions" :reduce="label => label.code" label="label" id="prore_city_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay ciudades.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="especialidadesOptions != null" class="col-md-6" label="Especialidad" label-for="prore_propse_id">
                              <ValidationProvider name="Especialidad" v-slot="{ errors }">
                                <v-select v-model="process.prore_propse_id" :options="especialidadesOptions" :reduce="label => label.code" label="label" id="prore_city_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay ciudades.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="statusProcessOptions != null" class="col-md-6" label="Estado del proceso*" label-for="prore_status_process_id">
                              <ValidationProvider name="Estado del proceso" rules="required" v-slot="{ errors }">
                                <v-select v-model="process.prore_status_process_id" :options="statusProcessOptions" :reduce="label => label.code" label="label" id="prore_status_process_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay estados.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="risksOptions != null" class="col-md-6" label="Riesgo NIIF" label-for="prore_risk_id">
                              <ValidationProvider name="Riesgo NIIF" v-slot="{ errors }">
                                <v-select v-model="process.prore_risk_id" :options="risksOptions" :reduce="label => label.code" label="label" id="prore_risk_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay riesgos.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="typeProcessOptions != null" class="col-md-6" label="Tipo de Proceso" label-for="prore_typro_id">
                              <ValidationProvider name="Tipo de Proceso" v-slot="{ errors }">
                                <v-select v-model="process.prore_typro_id" :options="typeProcessOptions" :reduce="label => label.code" label="label" id="prore_typro_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay tipos de procesos.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group v-if="typeProcessOptions != null" class="col-md-6" label="Juzgado" label-for="prore_court_id">
                              <ValidationProvider name="Juzgado" v-slot="{ errors }">
                                <v-select v-model="process.prore_court_id" :options="courtsOptions" :reduce="label => label.code" label="label" id="prore_court_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                  <span slot="no-options">No hay juzgados.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una opción</span>
                                </div>
                              </ValidationProvider>
                              <b-card-text class="texto-tipo-boton text-dark" v-b-modal.modal-crear-juzagado>Crear juzgado</b-card-text>
                            </b-form-group>
                            <b-modal
                              id="modal-crear-juzagado"
                              ref="modal"
                              title="Agregar juzgado"
                              hide-footer
                            >
                              <form ref="form">
                                <b-form-group
                                  label="Nombre del juzgado"
                                  label-for="name-input"
                                >
                                  <b-form-input
                                    id="name-input"
                                    v-model="nuevo_court.name"
                                  ></b-form-input>
                                </b-form-group>
                                <b-form-group label="Teléfono del juzgado">
                                  <b-form-input v-model="nuevo_court.telefono" type="text" placeholder="ej: 3015456561"></b-form-input>
                                </b-form-group>
                                <b-form-group label="Correo del juzgado">
                                  <b-form-input v-model="nuevo_court.email" type="email" placeholder="info@example.com"></b-form-input>
                                </b-form-group>
                                <div class="text-right pt-1">
                                  <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-crear-juzagado')">Cancelar</b-button>
                                  <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarJuzgado">{{ textoGuardarModal }}</b-button>
                                </div>
                              </form>
                            </b-modal>
                            <b-form-group class="col-md-6" label="Proceso Ejecutivo" label-for="prore_proceso_ejecutivo">
                              <b-form-input v-model="process.prore_proceso_ejecutivo" type="text" placeholder="Proceso Ejecutivo"></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Ejecutante" label-for="prore_ejecutante">
                              <b-form-input v-model="process.prore_ejecutante" type="text" placeholder="Ejecutante"></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Sentencia Final" label-for="prore_sentencia_final">
                              <b-form-select plain v-model="process.prore_sentencia_final" id="prore_sentencia_final">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                  <b-form-select-option :value="'Ninguna'">Ninguna</b-form-select-option>
                                  <b-form-select-option :value="'A Favor'" >A Favor</b-form-select-option>
                                  <b-form-select-option :value="'En Contra'">En Contra</b-form-select-option>
                                </template>
                              </b-form-select>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Valor De La Sentencia Final" label-for="prore_val_sentencia_final">
                              <b-form-input id="prore_val_sentencia_final" v-model="process.prore_val_sentencia_final" type="number" placeholder="$"></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Discriminar Valor De La Condena" label-for="prore_discriminar_val_condena">
                              <b-form-input id="prore_discriminar_val_condena" v-model="process.prore_discriminar_val_condena" type="number" placeholder="$"></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Costas De La Sentencia" label-for="prore_costas_sentencia">
                              <b-form-input id="prore_costas_sentencia" v-model="process.prore_costas_sentencia" type="number" placeholder="$"></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Costas Procesales Primera Instancia" label-for="prore_costas_procesales_primera_instancia">
                              <b-form-input id="prore_costas_procesales_primera_instancia" v-model="process.prore_costas_procesales_primera_instancia" type="number" placeholder="$"></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Costas Procesales Segunda Instancia" label-for="prore_costas_procesales_segunda_instancia">
                                <b-form-input id="prore_costas_procesales_segunda_instancia" v-model="process.prore_costas_procesales_segunda_instancia" type="number" placeholder="$"></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Total Costas" label-for="prore_total_costas">
                              <b-form-input id="prore_total_costas" v-model="process.prore_total_costas" type="number" placeholder="$"></b-form-input>
                            </b-form-group>
                          </b-row>
                          </form>
                        </ValidationObserver>
                      </div>
                    </template>
                    <template v-slot:footer>
                      <div class="text-right">
                        <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
                        <b-button variant="primary" :disabled="process.prore_estado == 1" :class="estadoBotonActualizarProceso" @click="editarProceso">{{ textoEditarProceso }}</b-button>
                      </div>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="involucrados">
                  <iq-card :key="implicatedKey">
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Involucrados en el proceso</h4>
                    </template>
                    <template v-slot:headerAction>
                      <button class="btn btn-primary" @click="agregarImplicated"><i class="ri-add-line mr-2" ></i>Añadir nuevo involucrado</button>
                    </template>
                    <template v-slot:body>
                      <b-row class="col-md-12" v-for="(implicate, index) in implicateds" :key="index">
                        <b-row class="col-md-12 pt-1">
                          <h6><b class="text-black" style="text-decoration:underline;">{{ implicate.profile.prof_name }}</b><button class="btn btn-link pt-0" @click="editImplicated(index)"><i class="ri-edit-2-fill"></i>Editar</button> <button @click="deleteImplicated(implicate)" class="btn btn-link pt-0 px-0 text-danger"><i class="ri-delete-bin-6-fill"></i>Eliminar</button></h6><span v-if="implicate.imp_principal" class="mx-2 px-2" style="color: white; background-color: #089bab; border-radius: 3px; max-height:25px">PRINCIPAL</span>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="px-2 my-0"><b>Tipo identificación: </b>{{ tipoIdentificacion(implicate.imp_tipo_identificacion) }}</b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Identificación: </b>{{ implicate.imp_identificacion }}</b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Nombres: </b>{{ implicate.imp_nombres }}</b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Apellidos: </b>{{ implicate.imp_apellidos }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="px-2 my-0"><b>Edad o rango de edad: </b><span v-if="implicate.imp_edad > 0">{{ implicate.imp_edad }}</span><span v-else>{{ implicate.imp_rango_edad }}</span></b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Genero: </b>{{ generoInvolucrado(implicate.imp_genero_id) }}</b-card-text>
                          <b-card-text class="px-2 my-0"><b>Dirección: </b>{{ implicate.imp_direccion }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="px-2 my-0"><b>Teléfonos: </b>{{ implicate.imp_telefonos }}</b-card-text>
                          <b-card-text class="pl-3 my-0"><b>Emails: </b>{{ implicate.imp_emails }}</b-card-text>
                          <b-card-text class="pl-3 my-0"><b>ID Proceso: </b>{{ implicate.imp_process_request_id }}</b-card-text>
                        </b-row>
                      </b-row>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="actuaciones">
                  <iq-card :key="proceedingKey">
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Actuaciones</h4>
                    </template>
                    <template v-slot:headerAction>
                      <button class="btn btn-primary" :disabled="process.prore_estado == 1" @click="agregarActuacion"><i class="ri-add-line mr-2" ></i>Agregar actuación</button>
                    </template>
                    <template v-slot:body>
                      <ul class="iq-timeline">
                        <li class="col-md-12" v-for="(proceeding, index) in proceedings" :key="index">
                          <div class="timeline-dots border-primary" v-if="index == 0" :class="'border-primary'"></div>
                          <div class="timeline-dots border-primary" v-else :class="'border-warning'"></div>
                          <h6 class="float-left mb-1 font-weight-bolder">{{ proceeding.status_process.estado_proceso }}<button class="btn btn-link pt-0" @click="editProceeding(index)"><i class="ri-edit-2-fill"></i>Editar</button> <button @click="deleteProceeding(proceeding.proce_id)" class="btn btn-link pt-0 px-0 text-danger"><i class="ri-delete-bin-6-fill"></i>Eliminar</button></h6>
                          <!--<b-row class="col-md-12 pl-0 pt-1">
                            <h6><b class="text-black" style="text-decoration:underline;">{{ proceeding.status_process.sta_name }}</b> <button class="btn btn-link" @click="editProceeding(index)"><i class="ri-edit-2-fill"></i>Editar</button> <button class="btn btn-link px-0 text-danger"><i class="ri-edit-2-fill"></i>Eliminar</button></h6>
                          </b-row>-->
                          <b-row class="col-md-12 pt-1">
                            <b-card-text class="my-0"><b>Abogado: </b><span v-if="proceeding.professional != null">{{ proceeding.professional.pro_name_first }} {{ proceeding.professional.pro_lastname_first }}</span></b-card-text>
                            <b-card-text class="pl-3 my-0"><b>Fecha de registro: </b>{{ proceeding.proce_fecha_ingreso }}</b-card-text>
                            <b-card-text v-if="proceeding.status_process.sta_id != 16" class="pl-3 my-0"><b>Fecha sig. audiencia: </b>{{ proceeding.proce_fecha_siguiente_audiencia }}</b-card-text>
                            <b-card-text v-if="proceeding.status_process.sta_id != 16" class="my-0"><b>Hora sig. audiencia: </b>{{ proceeding.proce_hora_siguiente_audiencia }}</b-card-text>
                          </b-row>
                          <b-row class="col-md-12 pt-1">
                            <b-card-text><b>Descripción actuación: </b>{{ proceeding.proce_descripcion }}</b-card-text>
                          </b-row>
                          <b-row class="col-md-12 pt-1">
                            <b>Links </b>
                            <b-card-text class="pl-1" v-for="(link_proceeding, index_link) in proceeding.links" :key="index_link">
                              <a v-bind:href="link_proceeding.link_url" target="_blank">{{ link_proceeding.link_name }}</a><span v-if="(index_link+1) < proceeding.links.length">,</span>
                            </b-card-text>
                          </b-row>
                        </li>
                      </ul>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="costos-cuantias">
                  <iq-card v-if="process.prore_typro_id != 11 && process.prore_typro_id != 8 && process.prore_typro_id != 10">
                    <CostosCuantiasProcesoMedico :prore_id="prore_id" :usr_id="userLogged.usr_id"/>
                  </iq-card>
                  <iq-card v-else-if="process.prore_typro_id == 11">
                    <CostosCuantiasProcesoLaboral :prore_id="prore_id" :editando="editando" :usr_id="userLogged.usr_id"/>
                  </iq-card>
                  <iq-card v-else>
                    <CostosCuantiasProcesoEjecutivo :prore_id="prore_id" :editando="editando" :usr_id="userLogged.usr_id"/>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="poliza">
                  <iq-card :key="polizasKey">
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Datos de la poliza</h4>
                    </template>
                    <template v-slot:headerAction>
                      <b-button variant="primary" @click="asociarPoliza">Asociar Poliza</b-button>
                    </template>
                    <template v-slot:body>
                      <b-row class="col-md-12 pt-1">
                        <b-modal
                          :no-close-on-backdrop="nocloseonbackdrop"
                          id="modal-asociar-poliza"
                          ref="modal"
                          title="Asociar Poliza"
                          hide-footer
                        >
                          <form ref="form">
                            <b-form-group
                              label="Aseguradora"
                              label-for="aseguradora"
                            >
                              <v-select
                                @input="buscarPolizas($event)"
                                :options="aseguradorasOptions"
                                :reduce="label => label.code"
                                label="label" id="aseguradora_relacionar"
                              >
                                <span slot="no-options">No hay aseguradoras.</span>
                              </v-select>
                            </b-form-group>
                            <b-form-group
                              label="Poliza"
                              label-for="poliza_relacion"
                            >
                              <v-select
                                v-model="poliza_relacion"
                                :options="polizasOptions"
                                :reduce="label => label.code"
                                label="label" id="poliza_relacion"
                              >
                                <span slot="no-options">No hay polizas.</span>
                              </v-select>
                            </b-form-group>
                            <div class="text-right pt-1">
                              <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-asociar-poliza')">Cancelar</b-button>
                              <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="relacionarPoliza">{{ textoGuardarModal }}</b-button>
                            </div>
                          </form>
                        </b-modal>
                        <ul class="iq-timeline">
                          <li class="col-md-12" v-for="(poliza, index) in polizas" :key="index">
                            <div class="timeline-dots border-primary border-primary"></div>
                            <h6 class="float-left mb-1 font-weight-bolder text-primary" @click="irPoliza(poliza.pol_id)" style="text-decoration:underline;cursor:pointer">{{ poliza.pol_numero }} - {{ poliza.aseguradora.ase_name }}</h6><button class="btn btn-link pt-0 disabled" @click="editPolizaAsociada(index)"><i class="ri-edit-2-fill"></i>Editar</button> <a @click="deletePolizaAsociada(poliza.pol_id)" class="btn btn-link pt-0 px-0 text-danger"><i class="ri-delete-bin-6-fill"></i>Eliminar</a>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="pr-3 my-0"><b>Tomador: </b>{{ poliza.clinica.cli_name }}</b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Fecha inicio vigencia: </b><span v-if="poliza.pol_fecha_inicio != null">{{ poliza.pol_fecha_inicio }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Fecha fin vigencia: </b><span v-if="poliza.pol_fecha_fin != null">{{ poliza.pol_fecha_fin }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                            </b-row>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="pr-3 my-0"><b>Total asegurado: </b><span v-if="poliza.pol_total_asegurado != null">{{ formatPrice(poliza.pol_total_asegurado) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Cobertura actual: </b><span v-if="poliza.pol_cobertura_actual != null">{{ formatPrice(poliza.pol_cobertura_actual) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                            </b-row>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="my-0 pr-3"><b>Deducible: </b><span v-if="poliza.pol_deducible != null">{{ poliza.pol_deducible }}%</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="my-0 pr-3"><b>Deducible Mínimo: </b><span v-if="poliza.pol_deducible_minimo != null">{{ formatPrice(poliza.pol_deducible_minimo) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Provisiones Constituidas:</b> <span v-if="poliza.pol_provisiones != null">{{ formatPrice(poliza.pol_provisiones) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Estado:</b> <span v-if="poliza.pol_estado">Poliza Activa</span><span class="text-danger" v-else>Poliza Inactiva</span></b-card-text>
                            </b-row>
                          </li>
                        </ul>
                      </b-row>
                    </template>
                  </iq-card>
                </tab-content-item>
                <!-- <tab-content-item :active="false" id="comentarios">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Comentarios</h4>
                    </template>
                    <template v-slot:body>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="notas">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Notas</h4>
                    </template>
                    <template v-slot:body>
                    </template>
                  </iq-card>
                </tab-content-item> -->
                <tab-content-item :active="false" id="links">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Documentos del proceso</h4>
                    </template>
                    <template v-slot:headerAction>
                      <b-button variant="primary" @click="agregarLink"><i class="fas fa-plus-circle"></i>Agregar</b-button>
                    </template>
                    <template v-slot:body>
                      <b-table bordered hover foot-clone :items="links" :fields="columnasLinks" :key="tableLinkKey" stacked="md" small >
                        <template v-slot:cell(link_name)="row">
                          <span v-if="!row.item.editable" style="word-break: break-all;"><a :href="row.item.link_url" target="_blank">{{ row.item.link_name }}</a></span>
                          <input type="text" v-model="row.item.link_name" v-else class="form-control">
                        </template>
                        <template v-slot:cell(link_url)="row">
                            <a style="word-break: break-all;" v-bind:href="row.item.link_url" target="_blank" v-if="!row.item.editable">{{ row.item.link_url }}</a>
                            <input type="text" v-model="row.item.link_url" v-else class="form-control">
                        </template>
                        <template #cell(actions)="row">
                          <!--<b-button class="mr-1" size="sm" variant="primary" @click="editLink(row.index)" :class="estadoBotonEliminarLinkProceeding"> Editar </b-button>
                          <b-button size="sm" variant="danger" @click="deleteLink(row.index)" :class="estadoBotonEliminarLinkProceeding"> Remover </b-button>-->
                          <b-button variant=" iq-bg-success mr-1 mb-1" size="sm" @click="editLink(row.item)" v-if="!row.item.editable"><i class="ri-ball-pen-fill m-0"></i></b-button>
                          <b-button variant=" iq-bg-success mr-1 mb-1" size="sm" @click="submitLink(row.item)" v-else>Ok</b-button>
                          <b-button variant=" iq-bg-info mr-1 mb-1" size="sm" v-if="row.item.editable" @click="cancelEditLink(row.item)">Cancelar</b-button>
                          <b-button variant=" iq-bg-danger" size="sm" @click="removeLink(row.item)"><i class="ri-delete-bin-line m-0"></i></b-button>
                        </template>
                      </b-table>
                    </template>
                  </iq-card>
                </tab-content-item>
              </tab-content>
            </div>
          </b-col>
        </b-row>
      </div>
    </section>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import { required } from 'vuelidate/lib/validators'
import Vue from 'vue'
import axios from 'axios'
import auth from '@/logic/auth'
import iqCard from '../../components/xray/cards/iq-card.vue'

export default {
  components: { iqCard },
  name: 'ProfileEdit',
  mounted () {
    xray.index()
    this.getProcess()
    this.barraCargando()
    setTimeout(() => {
      this.getTypeNotifications()
      this.getEstadosProceso()
      this.fetchOptionsAbogados()
      this.fetchProfiles()
      this.fetchProfileProcessOptions()
      setTimeout(() => {
        this.fetchEspecialidades()
        this.fetchOptionsClinicas()
        this.fetchCourts()
        this.fetchRisks()
        this.fetchTypeProcess()
        this.fetchCity()
      }, 800)
    }, 500)
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    },
    years () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 1995 }, (value, index) => 2000 + index)
    }
  },
  data () {
    return {
      nocloseonbackdrop: true,
      estadoBotonActualizarProceso: '',
      textoEditarProceso: 'Editar Proceso',
      user_id: null,
      estadoBotonEliminarLinkProceeding: '',
      intentos: 0,
      prore_id: this.$route.params.prore_id,
      editando: false,
      estadoBotonTerminarProceso: '',
      mostrarModalTerminarProceso: false,
      implicateds: [],
      process: [],
      loading: true,
      progress_total: 4,
      max: 100,
      botonGuardarModal: '',
      textoGuardarModal: 'Guardar',
      errors: [],
      validationRules: [
        {
          prore_num_radicado: { required },
          prore_fec_ingreso_jur: { required },
          prore_defendant_clin: { required },
          prore_year_sinister: { required },
          prore_fec_sinister: { required },
          prore_year_notify: { required },
          prore_process_year: { required },
          prore_fec_audi_conci_preju: { required },
          prore_sinies_description: { required },
          prore_fec_ingreso_cli: { required },
          prore_city_id: { required },
          prore_litigando_id: { required }
        }
      ],
      proceeding: {
        proce_id: null,
        proce_prore_id: null,
        proce_pro_id: null,
        proce_sta_id: null,
        proce_fecha_ingreso: null,
        proce_descripcion: null,
        proce_fecha_siguiente_audiencia: null,
        proce_hora_siguiente_audiencia: null
      },
      nuevoLinkProceeding: {
        link_name: null,
        link_url: null
      },
      nuevoLink: {
        link_name: '',
        link_url: '',
        link_prore_id: this.$route.params.prore_id
      },
      proceedingKey: 1,
      tableLinkKey: 1,
      implicatedKey: 1,
      agenda: {
        agen_name: '',
        agen_pro_id: '',
        agen_start_date: '',
        agen_end_date: '',
        sch_start_hour: '',
        sch_end_hour: '',
        agen_type_eve_id: '',
        agen_type_not_id: ''
      },
      proceedings: [],
      statusProcessOptions: [],
      linksProceeding: [],
      columnasLinkActuacion: [
        { key: 'link_name', label: 'Nombre', class: 'text-center' },
        { key: 'link_url', label: 'URL', class: 'text-center' },
        { key: 'actions', label: 'Acciones', class: 'text-center' }
      ],
      columnasLinks: [
        { key: 'link_name', label: 'Nombre', class: 'text-left' },
        { key: 'link_url', label: 'URL', class: 'text-left' },
        { key: 'actions', label: 'Acciones', class: 'text-center' }
      ],
      typeNotificationsOptions: [],
      abogadoOptions: [],
      tipoIdentificacionOptions: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 },
        { text: 'NIT', value: 4 }
      ],
      links: [],
      nuevoImplicated: {
        imp_tipo_identificacion: '',
        imp_identificacion: '',
        imp_nombres: '',
        imp_apellidos: '',
        imp_direccion: '',
        imp_rango_edad: '',
        imp_telefonos: '',
        imp_emails: '',
        imp_profile_id: '',
        imp_genero_id: '',
        imp_principal: false,
        imp_process_request_id: this.$route.params.prore_id
      },
      generoOptions: [
        {
          text: 'No aplica',
          value: null
        },
        {
          text: 'Masculino',
          value: 2
        },
        {
          text: 'Femenino',
          value: 1
        }
      ],
      rangoEdadOptions: [
        {
          text: '0-18 años',
          value: '0-18 años'
        },
        {
          text: '19- 60 años',
          value: '19- 60 años'
        },
        {
          text: '+ 60 años',
          value: '+ 60 años'
        },
        {
          text: 'No aplica',
          value: 'No aplica'
        }
      ],
      year: null,
      clinicaOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      especialidadesOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      typeProcessOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      courtsOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      risksOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      citiesOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      profilesOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      aseguradorasOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      polizasOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      nuevo_court: {
        name: '',
        telefono: '',
        email: ''
      },
      errores: {},
      profileProcessOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      polizasKey: 0,
      poliza_relacion: '',
      polizas: []
    }
  },
  methods: {
    barraCargando () {
      this.transformarBoolean(this.$route.params.editar)
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    fetchProfileProcessOptions () {
      axios.get('/profiles/fetch-profiles-process-requests').then(response => {
        this.profileProcessOptions = response.data.profiles
        this.intentos = 0
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchProfileProcessOptions()
          }
          this.intentos++
        })
    },
    fetchCity () {
      axios.get('/cities/fetch').then(response => {
        this.citiesOptions = response.data.cities
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchCity()
          }
          this.intentos++
        })
    },
    fetchEspecialidades () {
      axios.get('/especialidades/fetch').then(response => {
        this.especialidadesOptions = response.data.especialidades
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchEspecialidades()
          }
          this.intentos++
        })
    },
    fetchOptionsClinicas () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/clinicas/' + this.userLogged.usr_id).then(response => {
          this.clinicaOptions = response.data.clinicas
          this.intentos = 0
          this.errores = {}
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos !== 2) {
              this.fetchOptionsClinicas()
            }
            this.intentos++
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    fetchCourts () {
      axios.get('/courts/fetch').then(response => {
        this.courtsOptions = response.data.courts
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchCourts()
          }
          this.intentos++
        })
    },
    fetchRisks () {
      axios.get('/risks/fetch').then(response => {
        this.risksOptions = response.data.risks
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchRisks()
          }
          this.intentos++
        })
    },
    fetchTypeProcess () {
      axios.get('/typeProcess/fetch').then(response => {
        this.typeProcessOptions = response.data.type_process
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchTypeProcess()
          }
          this.intentos++
        })
    },
    fetchAseguradoras () {
      axios.get('/aseguradoras/fetch-aseguradoras').then(response => {
        this.aseguradorasOptions = response.data.aseguradoras
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchAseguradoras()
          }
          this.intentos++
        })
    },
    getTypeNotifications () {
      axios.get('/type_notifications/fetchTypeNotifications').then(response => {
        this.typeNotificationsOptions = response.data.type_notifications
        if (this.typeNotificationsOptions != null && this.typeNotificationsOptions[0] !== undefined) {
          this.intentos = 0
          this.agenda.agen_type_not_id = this.typeNotificationsOptions[0].value
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.getTypeNotifications()
          }
          this.intentos++
        })
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetch').then(response => {
        this.intentos = 0
        this.abogadoOptions = response.data.professionals
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchOptionsAbogados()
          }
          this.intentos++
        })
    },
    getEstadosProceso () {
      axios.get('/statusProcess/fetch').then(response => {
        this.statusProcessOptions = response.data.status_process
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          this.getEstadosProceso()
        })
    },
    cancelarEdicionProceso () {
      this.textoEditarProceso = 'Editar Proceso'
      this.editando = false
    },
    editarProceso () {
      // this.$router.push({ path: `/process/process-edit/` + this.prore_id })
      if (this.editando) {
        this.guardarProceso()
        this.estadoBotonActualizarProceso = 'disabled'
        this.textoEditarProceso = 'Actualizando Proceso...'
        this.estadoBotonActualizarCuantias = 'disabled'
        this.textoEditarCuantias = 'Actualizando...'
      } else {
        if (this.profileProcessOptions[0] === '' || this.profileProcessOptions[0] == null) {
          this.fetchProfileProcessOptions()
        }
        this.textoEditarProceso = 'Actualizar Proceso'
        this.editando = true
      }
    },
    guardarProceso () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.process.prore_user_id = this.userLogged.usr_id
      }
      axios.post('/process/updateInfoProceso/' + this.prore_id, this.process).then(res => {
        this.textoEditarProceso = 'Editar Proceso'
        this.estadoBotonActualizarProceso = ''
        this.estadoBotonActualizarCuantias = ''
        this.textoEditarCuantias = 'Editar Costos/Cuantías'
        if (res.data.status_code === 200) {
          setTimeout(() => {
            if (res.data.process != null) {
              this.process = res.data.process[0]
              this.textoEditarProceso = 'Editar Proceso'
              this.editando = false
              Vue.swal('Proceso actualizado correctamente')
            } else {
              this.editando = false
              Vue.swal('Ocurrió un errro tratando de obtener el proceso')
            }
          }, 1000)
        } else {
          this.textoEditarProceso = 'Guardar Proceso'
          Vue.swal('Error tratando de actualizar proceso. ' + res.data.message)
        }
      })
        .catch(error => {
          this.errores = error
          if (this.intentos < 2) {
            this.guardarProceso()
            this.intentos++
          } else {
            Vue.swal('Error tratando de actualizar proceso. ' + error)
            this.textoEditarProceso = 'Editar Proceso'
            this.estadoBotonActualizarProceso = ''
          }
        })
    },
    agregarLinkProceeding () {
      if (this.nuevoLinkProceeding.link_name === null || this.nuevoLinkProceeding.link_url === null) {
        Vue.swal('Por favor ingrese información del link')
        return false
      } else {
        this.linksProceeding.push({ link_name: this.nuevoLinkProceeding.link_name, link_url: this.nuevoLinkProceeding.link_url })
        this.limpiarNuevoLinkProceeding()
      }
    },
    getProcess () {
      if (this.prore_id != null) {
        axios.get('/process/show/' + this.prore_id).then(res => {
          setTimeout(() => {
            if (res.data.process != null) {
              this.process = res.data.process[0]
              this.implicateds = this.process.implicateds
              this.links = this.process.links
              this.proceedings = this.process.proceedings
              this.tableLinkKey++
              this.polizas = this.process.polizas
            } else {
              Vue.swal('Ocurrió un error tratando de obtener los datos del proceso')
            }
          }, 1000)
        })
          .catch(this.errored = true)
          .finally(setTimeout(() => {
            this.loading = false
          }, 3500))
      }
    },
    guardarActuacion (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.checkFormActuacion()) {
        this.proceeding.proce_prore_id = this.prore_id
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando...'
        if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
          this.proceeding.proce_user_id = this.userLogged.usr_id
        }
        if (this.proceeding.proce_id != null) {
          axios.post('/proceedings/update/' + this.proceeding.proce_id, { formulario_proceeding: this.proceeding, links: this.linksProceeding }).then(res => {
            this.textoGuardarModal = 'Guardar'
            this.botonGuardarModal = ''
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              this.$bvModal.hide('modal-nueva-actuacion')
              this.limpiarModalActuacion()
              this.getProceedings()
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              this.textoGuardarModal = 'Guardar'
              this.botonGuardarModal = ''
              Vue.swal('Ups, ocurrió un error ' + err)
            })
        } else {
          axios.post('/proceedings/store', { formulario_proceeding: this.proceeding, links: this.linksProceeding }).then(res => {
            this.textoGuardarModal = 'Guardar'
            this.botonGuardarModal = ''
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              this.$bvModal.hide('modal-nueva-actuacion')
              this.limpiarModalActuacion()
              this.getProceedings()
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              this.textoGuardarModal = 'Guardar'
              this.botonGuardarModal = ''
              Vue.swal('Ups, ocurrió un error ' + err)
            })
        }
      } else {
        return false
      }
    },
    getProceedings () {
      axios.get('/proceedings/getProceedingsProcessRequest/' + this.prore_id).then(response => {
        this.proceedingKey++
        this.intentos = 0
        this.proceedings = response.data.proceedings
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.getProceedings()
          }
          this.intentos++
        })
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
    verModalTerminarProceso (proreId, numRadicado) {
      this.proceeding.proce_prore_id = proreId
      this.$bvModal.show('modal-terminar-proceso')
      this.mostrarModalTerminarProceso = true
    },
    agregarActuacion () {
      this.limpiarModalActuacion()
      this.$bvModal.show('modal-nueva-actuacion')
    },
    cancelado () {
      this.$bvModal.hide('modal-nueva-actuacion')
    },
    limpiarModalActuacion () {
      this.proceeding.proce_id = null
      this.proceeding.proce_prore_id = null
      this.proceeding.proce_pro_id = null
      this.proceeding.proce_sta_id = null
      this.proceeding.proce_fecha_ingreso = null
      this.proceeding.proce_descripcion = null
      this.proceeding.proce_fecha_siguiente_audiencia = null
      this.proceeding.proce_hora_siguiente_audiencia = null
    },
    deleteLinkProceeding (proceedingLinkId) {
      this.estadoBotonEliminarLinkProceeding = 'disabled'
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este link?', {
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
          this.estadoBotonEliminarLinkProceeding = ''
          if (value) {
            this.linksProceeding.splice(proceedingLinkId, 1)
          }
        })
        .catch(err => {
          this.estadoBotonEliminarLinkProceeding = ''
          Vue.swal(err)
        })
    },
    limpiarNuevoLinkProceeding () {
      this.nuevoLinkProceeding.link_name = null
      this.nuevoLinkProceeding.link_url = null
    },
    editProceeding (llave) {
      this.proceeding.proce_id = this.proceedings[llave].proce_id
      this.proceeding.proce_pro_id = this.proceedings[llave].proce_pro_id
      this.proceeding.proce_sta_id = this.proceedings[llave].proce_sta_id
      this.proceeding.proce_fecha_ingreso = this.proceedings[llave].proce_fecha_ingreso
      this.proceeding.proce_descripcion = this.proceedings[llave].proce_descripcion
      this.proceeding.proce_fecha_siguiente_audiencia = this.proceedings[llave].proce_fecha_siguiente_audiencia
      this.proceeding.proce_hora_siguiente_audiencia = this.proceedings[llave].proce_hora_siguiente_audiencia
      this.linksProceeding = this.proceedings[llave].links
      this.$bvModal.show('modal-nueva-actuacion')
    },
    deleteProceeding (proceId) {
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar esta actuación?', {
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
            this.confirmDeleteProceeding(proceId)
          }
        })
        .catch(err => {
          Vue.swal(err)
        })
    },
    confirmDeleteProceeding (proceId) {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.user_id = this.userLogged.usr_id
      }
      axios.post('/proceedings/delete/' + proceId + '/' + this.user_id).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal(res.data.message)
          this.getProceedings()
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          Vue.swal('Algo salio mal ' + err)
        })
    },
    defaultLink () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.user_id = this.userLogged.usr_id
      }
      return {
        link_name: null,
        link_url: null,
        link_prore_id: this.prore_id,
        link_user_id: this.user_id,
        editable: false
      }
    },
    agregarLink () {
      let obj = this.defaultLink()
      this.links.push(obj)
    },
    cancelEditLink (linkFor) {
      var linkIndex = this.links.indexOf(linkFor)
      var linkEdit = { ...this.links[linkIndex], ...{ editable: false } }
      this.links.splice(linkIndex, 1, linkEdit)
    },
    editLink (linkFor) {
      var linkIndex = this.links.indexOf(linkFor)
      var linkEdit = { ...this.links[linkIndex], ...{ editable: true } }
      this.links.splice(linkIndex, 1, linkEdit)
    },
    submitLink (linkFor) {
      if (this.checkFormLink(linkFor)) {
        linkFor.editable = false
        if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
          this.user_id = this.userLogged.usr_id
        }
        if (linkFor.link_id != null) {
          axios.post('/links/update/' + linkFor.link_id + '/' + this.user_id, linkFor).then(res => {
            if (res.data.status_code === 200) {
              var linkIndex = this.links.indexOf(linkFor)
              var linkEdit = { ...this.links[linkIndex], ...{ editable: false, link_id: res.data.link.link_id, link_url: res.data.link.link_url } }
              this.links.splice(linkIndex, 1, linkEdit)
              Vue.swal(res.data.message)
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              Vue.swal('Algo salio mal ' + err)
            })
        } else {
          axios.post('/links/store', linkFor).then(res => {
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              var linkIndex = this.links.indexOf(linkFor)
              var linkEdit = { ...this.links[linkIndex], ...{ editable: false, link_id: res.data.link.link_id, link_url: res.data.link.link_url } }
              this.links.splice(linkIndex, 1, linkEdit)
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              Vue.swal('Algo salio mal ' + err)
            })
        }
      } else {
        return false
      }
    },
    removeLink (linkFor) {
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este link?', {
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
            this.confirmacionEliminacionLink(linkFor)
          }
        })
        .catch(err => {
          this.estadoBotonEliminarLinkProceeding = ''
          Vue.swal(err)
        })
    },
    confirmacionEliminacionLink (linkFor) {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.user_id = this.userLogged.usr_id
      }
      if (linkFor.link_id != null) {
        axios.post('/links/delete/' + linkFor.link_id + '/' + this.user_id).then(res => {
          if (res.data.status_code === 200) {
            var linkIndex = this.links.indexOf(linkFor)
            this.links.splice(linkIndex, 1)
            Vue.swal(res.data.message)
          } else {
            Vue.swal(res.data.message)
          }
        })
          .catch((err) => {
            Vue.swal('Algo salio mal ' + err)
          })
      } else {
        var linkIndex = this.links.indexOf(linkFor)
        this.links.splice(linkIndex, 1)
      }
    },
    getImplicateds () {
      axios.get('/implicateds/get-implicateds-process/' + this.prore_id).then(response => {
        this.implicatedKey++
        this.intentos = 0
        this.implicateds = response.data.implicateds
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.getImplicateds()
          }
          this.intentos++
        })
    },
    agregarImplicated () {
      this.limpiarModalImplicated()
      this.$bvModal.show('modal-nuevo-implicated')
    },
    deletePolizaAsociada (polId) {
      this.$swal.fire({
        icon: 'warning',
        title: '¿Eliminar póliza del proceso?',
        text: 'Esta acción no se podrá revertir. Se desligará la póliza de este proceso',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar póliza',
        confirmButtonColor: '#f7505a',
        customClass: 'sweetalert-btns',
        showCloseButton: true
      }).then((result) => {
        if (result.value) {
          axios.post('/process/remove-police-process/' + this.prore_id + '/' + polId).then(response => {
            Vue.swal(response.data.message)
            this.obtenerPolizas()
          })
            .catch((err) => {
              this.errores = err
              Vue.swal('Ups, sucedió un error')
            })
        }
      })
    },
    limpiarModalImplicated () {
      this.nuevoImplicated.imp_id = null
      this.nuevoImplicated.imp_tipo_identificacion = ''
      this.nuevoImplicated.imp_identificacion = ''
      this.nuevoImplicated.imp_nombres = ''
      this.nuevoImplicated.imp_direccion = ''
      this.nuevoImplicated.imp_apellidos = ''
      this.nuevoImplicated.imp_telefonos = ''
      this.nuevoImplicated.imp_emails = ''
      this.nuevoImplicated.imp_profile_id = ''
      this.nuevoImplicated.imp_principal = false
    },
    guardarImplicated () {
      if (this.checkFormImplicated()) {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando...'
        if (this.nuevoImplicated.imp_id != null) {
          this.ejecutarActualizacionImplicated()
        } else {
          this.ejecutarCreacionImplicated()
        }
      } else {
        return false
      }
    },
    ejecutarCreacionImplicated () {
      axios.post('/implicateds/store', this.nuevoImplicated).then(res => {
        if (res.data.status_code === 200) {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          this.getImplicateds()
          this.$bvModal.hide('modal-nuevo-implicated')
          this.limpiarModalImplicated()
          Vue.swal(res.data.message)
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Algo salio mal ' + err)
        })
    },
    ejecutarActualizacionImplicated () {
      axios.post('/implicateds/update/' + this.nuevoImplicated.imp_id + '/' + this.obtenerIdUsuario(), this.nuevoImplicated).then(res => {
        if (res.data.status_code === 200) {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          this.$bvModal.hide('modal-nuevo-implicated')
          this.getImplicateds()
          this.limpiarModalImplicated()
          Vue.swal(res.data.message)
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Algo salio mal ' + err)
        })
    },
    checkFormImplicated () {
      if (this.nuevoImplicated.imp_nombres && this.nuevoImplicated.imp_profile_id) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.nuevoImplicated.imp_nombres) {
        this.errors.push('El nombre es obligatorio.')
      }
      if (!this.nuevoImplicated.imp_profile_id) {
        this.errors.push('El perfil es obligatorio.')
      }
    },
    checkFormLink (linkFor) {
      if (linkFor.link_name && linkFor.link_url) {
        return true
      } else {
        Vue.swal('Por favor ingrese el nombre y la url del link')
        return false
      }
    },
    fetchProfiles () {
      // solo trae los perfiles que no tengan que ver con la plataforma
      axios.get('/profiles/fetchExterns').then(response => {
        this.profilesOptions = response.data.profiles
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchProfiles()
          }
          this.intentos++
        })
    },
    editImplicated (implicatedIndex) {
      this.nuevoImplicated.imp_id = this.implicateds[implicatedIndex].imp_id
      this.nuevoImplicated.imp_tipo_identificacion = this.implicateds[implicatedIndex].imp_tipo_identificacion
      this.nuevoImplicated.imp_identificacion = this.implicateds[implicatedIndex].imp_identificacion
      this.nuevoImplicated.imp_nombres = this.implicateds[implicatedIndex].imp_nombres
      this.nuevoImplicated.imp_apellidos = this.implicateds[implicatedIndex].imp_apellidos
      this.nuevoImplicated.imp_direccion = this.implicateds[implicatedIndex].imp_direccion
      this.nuevoImplicated.imp_telefonos = this.implicateds[implicatedIndex].imp_telefonos
      this.nuevoImplicated.imp_emails = this.implicateds[implicatedIndex].imp_emails
      this.nuevoImplicated.imp_profile_id = this.implicateds[implicatedIndex].imp_profile_id
      this.nuevoImplicated.imp_rango_edad = this.implicateds[implicatedIndex].imp_rango_edad
      this.nuevoImplicated.imp_genero_id = this.implicateds[implicatedIndex].imp_genero_id
      this.nuevoImplicated.imp_principal = this.implicateds[implicatedIndex].imp_principal
      this.$bvModal.show('modal-nuevo-implicated')
    },
    deleteImplicated (implicated) {
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este involucrado?', {
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
            this.confirmacionEliminacionImplicated(implicated)
          }
        })
        .catch(err => {
          this.estadoBotonEliminarLinkProceeding = ''
          Vue.swal(err)
        })
    },
    confirmacionEliminacionImplicated (implicated) {
      axios.post('/implicateds/delete/' + implicated.imp_id + '/' + this.obtenerIdUsuario()).then(res => {
        if (res.data.status_code === 200) {
          this.getImplicateds()
          Vue.swal(res.data.message)
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          Vue.swal('Algo salio mal ' + err)
        })
    },
    obtenerIdUsuario () {
      var userId = null
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        userId = this.userLogged.usr_id
      }
      return userId
    },
    generoInvolucrado (generoId) {
      if (generoId === 1) {
        return 'Femenino'
      } else if (generoId === 2) {
        return 'Masculino'
      } else {
        return 'Sin asignar'
      }
    },
    guardarJuzgado (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      if (this.nuevo_court.name === '' || this.nuevo_court.name === null || this.nuevo_court.telefono === '' || this.nuevo_court.telefono === null) {
        Vue.swal('Por favor complete los datos.')
      } else {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando'
        this.handleSubmit()
      }
    },
    handleSubmit () {
      axios.post('/courts/store', this.nuevo_court).then(res => {
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-crear-juzagado')
        })
        if (res.data.status_code === 200) {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          this.nuevo_court.name = ''
          this.nuevo_court.telefono = ''
          this.nuevo_court.email = ''
          this.process.prore_court_id = res.data.court_id
          Vue.swal('Juzgado agregado correctamente')
          this.fetchCourts()
        } else {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Datos no validos')
        }
      })
    },
    buscarPolizas (aseguradoraId) {
      axios.get('/policy/obtener-polizas-aseguradora/' + aseguradoraId).then(response => {
        this.polizasOptions = response.data.polizas
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.buscarPolizas(aseguradoraId)
          }
          this.intentos++
        })
    },
    asociarPoliza () {
      if (this.aseguradorasOptions.length < 2) {
        this.fetchAseguradoras()
      }
      this.$bvModal.show('modal-asociar-poliza')
    },
    relacionarPoliza () {
      if (this.poliza_relacion === '' || this.poliza_relacion === null) {
        Vue.swal('Por favor complete los datos.')
      } else {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando'
        this.guardarAsociacionPoliza()
      }
    },
    guardarAsociacionPoliza () {
      axios.post('/process/asociar-poliza/' + this.prore_id + '/' + this.poliza_relacion + '/' + this.obtenerIdUsuario())
        .then(res => {
          // Hide the modal manually
          if (res.data.status_code === 200) {
            this.$bvModal.hide('modal-asociar-poliza')
            this.botonGuardarModal = ''
            this.textoGuardarModal = 'Guardar'
            this.poliza_relacion = ''
            Vue.swal(res.data.message)
            this.obtenerPolizas()
          } else {
            this.botonGuardarModal = ''
            this.textoGuardarModal = 'Guardar'
            Vue.swal(res.data.message)
          }
        })
        .catch((err) => {
          this.errores = err
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Ups, sucedió un error')
        })
    },
    obtenerPolizas () {
      axios.get('/process/obtener-polizas/' + this.prore_id).then(response => {
        this.polizas = response.data.polizas
        this.intentos = 0
        this.errores = {}
        this.polizasKey++
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.obtenerPolizas(this.prore_i)
          }
          this.intentos++
        })
    },
    irPoliza (polizaId) {
      let editar = false
      this.$router.push({ path: `/policies/policy-show/${polizaId}/${editar}` })
    },
    transformarBoolean (edicion) {
      if (edicion === 'true') {
        this.fetchProfileProcessOptions()
        this.editando = true
      } else {
        this.editando = false
      }
    },
    tipoIdentificacion (tipoIdentificacionId) {
      if (tipoIdentificacionId === 1) {
        return 'C.C'
      } else if (tipoIdentificacionId === 2) {
        return 'T.I'
      } else if (tipoIdentificacionId === 3) {
        return 'C.C'
      } else if (tipoIdentificacionId === 4) {
        return 'NIT '
      }
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    totalPerjuiciosMateriales () {
      let valLucCesante = this.process.prore_val_luc_cesante > 0 ? this.process.prore_val_luc_cesante : 0
      let valDanoEmergente = this.process.prore_val_dano_emergente > 0 ? this.process.prore_val_dano_emergente : 0
      this.process.prore_total_perjuicios_materiales = parseInt(valLucCesante) + parseInt(valDanoEmergente)
      this.cuantiaPretensiones()
    },
    totalPerjuiciosInmateriales () {
      let valDanoMoral = this.process.prore_val_dano_moral > 0 ? this.process.prore_val_dano_moral : 0
      let valDanoVida = this.process.prore_val_dano_vida > 0 ? this.process.prore_val_dano_vida : 0
      this.process.prore_total_perjuicios_inmateriales = parseInt(valDanoMoral) + parseInt(valDanoVida)
      this.cuantiaPretensiones()
    },
    cuantiaPretensiones () {
      this.process.prore_cuantia_pretenciones = this.process.prore_total_perjuicios_materiales + this.process.prore_total_perjuicios_inmateriales
    },
    totalCoberturaActualPoliza () {
      let valTotalAsegurado = this.process.prore_val_total_asegurado > 0 ? this.process.prore_val_total_asegurado : 0
      let valAfectadoPoliza = this.process.prore_val_afectado_poliza > 0 ? this.process.prore_val_afectado_poliza : 0
      this.process.prore_val_cobertura_poliza = parseInt(valTotalAsegurado) - parseInt(valAfectadoPoliza)
    }
  }
}
</script>
