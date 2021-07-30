<template>
  <b-container fluid>
    <!--<span v-if="proc_id != null && process != null" v-show="true">{{proc_id}}</span>-->
    <!--{{process}}-->
    <!--<section v-if="errored && proc_id !== undefined">
      <p>Lo sentimos, no es posible obtener la información en este momento, por favor intente nuevamente mas tarde</p>
    </section>-->
    <section>
      <div class="py-5" v-if="proc_id !== undefined && loading">
        <!--<b-progress height="2rem" show-progress :progress_total="progress_total" variant="success" striped :animated="animate"><h5 v-if="progress_total > 0">Cargando...</h5></b-progress>-->
        <b-progress :max="max" height="2rem">
          <b-progress-bar :progress_total="progress_total" variant="success" :style="{width: progress_total + '%'}">
            <span><b>{{ progress_total }}%</b></span>
          </b-progress-bar>
        </b-progress>
      </div>
      <div v-else>
        <form-wizard @onComplete="onSubmit">
          <tab-content title="Información General" :selected="true" >
            <b-container fluid>
              <b-row>
                <b-col md="12">
                  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                      <b-row>
                        <b-col lg="12">
                          <iq-card>
                            <template v-slot:headerTitle>
                              <h4 class="card-title">Campos marcados con * son obligatorios</h4>
                            </template>
                            <template v-slot:body>
                              <div class="new-process">
                                <b-row>
                                  <b-form-group class="col-md-6" label="Número del proceso*" label-for="prore_num_proceso">
                                    <div v-if="proc_id != null && formData.prore_num_proceso != null">
                                      <span class='text' >{{formData.prore_num_proceso}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_num_proceso == null">
                                      <b-form-input id="prore_num_proceso" v-model="formData.prore_num_proceso" type="text" :class="hasError('prore_num_proceso') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_num_proceso')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_num_proceso.required">Por favor escribe el número del proceso.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de Ingreso*" label-for="prore_fec_ingreso">
                                    <div v-if="proc_id != null && formData.prore_fec_ingreso != null">
                                      <span class='text' >{{formData.prore_fec_ingreso}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_ingreso == null">
                                      <b-form-input id="prore_fec_ingreso" v-model="formData.prore_fec_ingreso" type="date" :class="hasError('prore_fec_ingreso') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_ingreso')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_ingreso.required">Por favor elige una fecha.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Clinica/IPS*" label-for="prore_defendant_clin">
                                    <div v-if="proc_id != null && formData.prore_defendant_clin != null">
                                      <span class='text'>{{formData.cli_name}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_defendant_clin == null">
                                      <b-form-select plain v-model="formData.prore_defendant_clin" :options="clinicaOptions" @search="fetchOptionsClinicas" id="prore_defendant_clin" :class="hasError('prore_defendant_clin') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione una clinica</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_defendant_clin')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_defendant_clin.required">Por favor elige una clinica.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Año del Siniestro*" label-for="prore_year_sinister">
                                    <div v-if="proc_id != null && formData.prore_year_sinister != null">
                                      <span class='text'>{{formData.prore_year_sinister}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_year_sinister == null">
                                      <b-form-select plain v-model="formData.prore_year_sinister" :options="years" id="prore_year_sinister" :class="hasError('prore_year_sinister') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_year_sinister')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_year_sinister.required">Por favor seleccione el año del siniestro.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha del Siniestro*" label-for="prore_fec_sinister">
                                    <div v-if="proc_id != null && formData.prore_fec_sinister != null">
                                      <span class='text'>{{formData.prore_fec_sinister}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_sinister == null">
                                      <b-form-input id="prore_fec_sinister" v-model="formData.prore_fec_sinister" type="date" :format="{ year }" :class="hasError('prore_fec_sinister') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_sinister')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_sinister.required">Por favor seleccione la fecha del siniestro.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Año de notificación*" label-for="prore_year_notify">
                                    <div v-if="proc_id != null && formData.prore_year_notify != null">
                                      <span class='text'>{{formData.prore_year_notify}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_year_notify == null">
                                      <b-form-select plain v-model="formData.prore_year_notify" :options="years" id="selectyearnotify" :class="hasError('prore_year_notify') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_year_notify')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_year_notify.required">Por favor seleccione el año de notificación.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Año del proceso*" label-for="prore_process_year">
                                    <div v-if="proc_id != null && formData.prore_process_year != null">
                                      <span class='text'>{{formData.prore_process_year}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_sinister == null">
                                      <b-form-select plain v-model="formData.prore_process_year" :options="years" id="selectyearnotify" :class="hasError('prore_process_year') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_process_year')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_process_year.required">Por favor seleccione el año del proceso.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de notificación prejudicial*" label-for="prore_fec_noti_preju">
                                    <div v-if="proc_id != null && formData.prore_fec_noti_preju != null">
                                      <span class='text'>{{formData.prore_fec_noti_preju}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_noti_preju == null">
                                      <b-form-input id="exampleInputdate" v-model="formData.prore_fec_noti_preju" type="date" :class="hasError('prore_fec_noti_preju') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_noti_preju')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_noti_preju.required">Por favor elige una fecha.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de la audiencia de conciliación prejudicial*" label-for="prore_fec_audi_conci_preju">
                                    <div v-if="proc_id != null && formData.prore_fec_audi_conci_preju != null">
                                      <span class='text'>{{formData.prore_fec_audi_conci_preju}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_audi_conci_preju == null">
                                      <b-form-input id="exampleInputdate" v-model="formData.prore_fec_audi_conci_preju" type="date" :class="hasError('prore_fec_audi_conci_preju') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_audi_conci_preju')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_audi_conci_preju.required">Por favor elige una fecha.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha aviso del siniestro*" label-for="prore_fec_sinies_aviso">
                                    <div v-if="proc_id != null && formData.prore_fec_sinies_aviso != null">
                                      <span class='text'>{{formData.prore_fec_sinies_aviso}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_sinies_aviso == null">
                                      <b-form-input id="exampleInputdate" v-model="formData.prore_fec_sinies_aviso" type="date" :class="hasError('prore_fec_sinies_aviso') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_sinies_aviso')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_sinies_aviso.required">Por favor elige una fecha.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Descripción del siniestro*" label-for="prore_sinies_description">
                                    <div v-if="proc_id != null && formData.prore_sinies_description != null">
                                      <span class='text'>{{formData.prore_sinies_description}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_sinies_description == null">
                                      <b-form-textarea v-model="formData.prore_sinies_description" type="text" placeholder="Descripción" :class="hasError('prore_sinies_description') ? 'is-invalid' : ''"></b-form-textarea>
                                      <div v-if="hasError('prore_sinies_description')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_sinies_description.required">Por favor deja una descripción del siniestro.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Patología" label-for="patologia">
                                    <div v-if="proc_id != null && formData.prore_pathology != null">
                                      <span class='text'>{{formData.prore_pathology}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_pathology == null">
                                      <b-form-input type="text" v-model="formData.prore_pathology" placeholder="Patología" :class="hasError('prore_pathology') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_pathology')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_pathology.required">Por favor escriba una patología.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de recibo de notificación IPS*" label-for="prore_fec_recibo_notify">
                                    <div v-if="proc_id != null && formData.prore_fec_recibo_notify">
                                      <span class='text'>{{formData.prore_fec_recibo_notify}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_recibo_notify == null">
                                      <b-form-input id="exampleInputdate" v-model="formData.prore_fec_recibo_notify" type="date" :class="hasError('prore_fec_recibo_notify') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_recibo_notify')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_recibo_notify.required">Por favor elige una fecha.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Colaborador de IPS que recibe notificación*" label-for="prore_fec_recibo_notify">
                                    <div v-if="proc_id != null && formData.prore_colaborador_ips != null">
                                      <span class='text'>{{formData.prore_colaborador_ips}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_colaborador_ips == null">
                                      <b-form-input type="text" v-model="formData.prore_colaborador_ips" placeholder="Nombre completo colaborador" :class="hasError('prore_colaborador_ips') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_colaborador_ips')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_colaborador_ips.required">Por favor escriba un nombre.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de Ingreso a Juridico*" label-for="prore_fec_ingreso_jur">
                                    <div v-if="proc_id != null && formData.prore_fec_ingreso_jur != null">
                                      <span class='text'>{{formData.prore_fec_ingreso_jur}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_ingreso_jur == null">
                                      <b-form-input id="prore_fec_ingreso_jur" v-model="formData.prore_fec_ingreso_jur" type="date" :class="hasError('prore_fec_ingreso_jur') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_ingreso_jur')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_ingreso_jur.required">Por favor elige una fecha.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de Ingreso a Clínica*" label-for="prore_fec_ingreso_cli">
                                    <div v-if="proc_id != null && formData.prore_fec_ingreso_cli != null">
                                      <span class='text'>{{formData.prore_fec_ingreso_cli}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_fec_ingreso_cli == null">
                                      <b-form-input id="prore_fec_ingreso_cli" v-model="formData.prore_fec_ingreso_cli" type="date" :class="hasError('prore_fec_ingreso_cli') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_ingreso_cli')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_ingreso_cli.required">Por favor elige una fecha.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Departamento*" label-for="department_id">
                                    <div v-if="proc_id != null && formData.department_id != null">
                                      <span class='text'>{{formData.department_name}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.department_id == null">
                                      <b-form-select plain v-model="formData.department_id" :options="departmentsOptions" @change="fetchCity" id="select_department" :class="hasError('department_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione un departamento</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('department_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.department_id.required">Por favor elige un departamento.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Ciudad*" label-for="prore_city_id">
                                    <div v-if="proc_id != null && formData.prore_city_id != null">
                                      <span class='text'>{{formData.city_name}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_city_id == null">
                                      <b-form-select plain v-model="formData.prore_city_id" :options="citiesOptions" id="select_city" :class="hasError('prore_city_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione una Ciudad</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_city_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_city_id.required">Por favor elige una ciudad.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Especialidad" label-for="selectuserrole">
                                    <div v-if="proc_id != null && formData.prore_propse_id != null">
                                      <span class='text'>{{formData.spe_name}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_propse_id == null">
                                      <b-form-select plain v-model="formData.prore_propse_id" :options="especialidadesOptions" id="select_especialidad" :class="hasError('prore_propse_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione una especialidad</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_propse_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_propse_id.required">Por favor elige una opción.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Asignar Abogada/o" label-for="prore_pro_id">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{ formData.pro_name_first }} {{ formData.pro_lastname_first }}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_pro_id == null">
                                      <b-form-select plain v-model="formData.prore_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole" :class="hasError('prore_pro_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null">Seleccione un abogado</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_pro_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_pro_id.required">Por favor elige una opción.</div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Estado del proceso" label-for="selectuserrole">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{ formData.sta_name }} {{ formData.pro_lastname_first }}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null">
                                      <b-form-select plain v-model="formData.prore_status_process_id" :options="statusProcessOptions" @search="fetchEstadosProceso" id="selectuserrole" :class="hasError('prore_status_process_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null">Seleccione un estado</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_status_process_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_status_process_id.required">Por favor elige una clinica.</div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Riesgo NIIF" label-for="risk_id">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{ formData.risk_name }}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null">
                                      <b-form-select plain v-model="formData.prore_risk_id" :options="risksOptions" @search="fetchRisks" id="risk_id" :class="hasError('prore_risk_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null">Seleccione el riesgo NIIF</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_risk_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_risk_id.required">Por favor elige una opción.</div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Identificador de litigando*" label-for="prore_litigando_id">
                                    <div v-if="proc_id != null">
                                      <span class='text' >{{ formData.prore_litigando_id }}</span>
                                    </div>
                                    <div v-if="proc_id == null">
                                      <b-form-input v-model="formData.prore_litigando_id" id="prore_litigando_id" type="number" :class="hasError('prore_litigando_id') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_litigando_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_litigando_id.required">Por favor escribe el ID de litigando.</div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                </b-row>
                              </div>
                            </template>
                          </iq-card>
                        </b-col>
                      </b-row>
                    </form>
                  </ValidationObserver>
                </b-col>
              </b-row>
            </b-container>
          </tab-content>
          <tab-content title="Partes del Proceso">
            <b-container fluid>
              <b-row>
                <b-col md="12">
                  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                      <b-row>
                        <b-col lg="12">
                          <iq-card>
                            <template v-slot:headerTitle>
                              <h4 class="card-title">Campos marcados con * son obligatorios</h4>
                            </template>
                            <template v-slot:body>
                              <h4 class="card-title">Información de los involucrados:</h4>
                              <div class="new-user-info">
                                <b-row>
                                  <div v-if="implicated !== undefined && implicated !==''" class="col-md-12">
                                    <b-table
                                      :items="implicated"
                                      :fields="fields"
                                      stacked="md"
                                      show-empty
                                      small
                                    >
                                      <template #cell(name)="row">
                                        {{ row.value.first }} {{ row.value.last }}
                                      </template>
                                      <template #cell(actions)="row">
                                        <b-button size="sm" v-b-modal.modal-lg variant="danger" @click="deleteImplicated(row.index)"> Remover </b-button>
                                      </template>
                                    </b-table>
                                    <hr>
                                  </div>
                                  <b-form-group class="col-md-3" label="Tipo identificación" label-for="imp_tipo_identificacion">
                                    <b-form-select plain v-model="nuevoImplicated.imp_tipo_identificacion" :options="ids" id="imp_profile_id">
                                      <template v-slot:first>
                                        <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                      </template>
                                    </b-form-select>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Identificación" label-for="imp_identificacion">
                                    <b-form-input v-model="nuevoImplicated.imp_identificacion" type="text" placeholder="Identificación"></b-form-input>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Nombres*" label-for="imp_nombres">
                                    <b-form-input v-model="nuevoImplicated.imp_nombres" type="text" placeholder="Nombres"></b-form-input>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Apellidos*" label-for="imp_apellidos">
                                    <b-form-input v-model="nuevoImplicated.imp_apellidos" type="text" placeholder="Apellidos"></b-form-input>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Genero" label-for="imp_genero_id">
                                    <b-form-select plain v-model="nuevoImplicated.imp_genero_id" :options="generoOptions" id="imp_genero_id">
                                      <template v-slot:first>
                                        <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                      </template>
                                    </b-form-select>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Perfil*" label-for="imp_profile_id">
                                    <b-form-select plain v-model="nuevoImplicated.imp_profile_id" :options="profilesOptions" id="imp_profile_id">
                                      <template v-slot:first>
                                        <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                      </template>
                                    </b-form-select>
                                  </b-form-group>
                                    <b-form-group class="col-md-3" label="Edad" label-for="imp_edad">
                                    <b-form-input v-model="nuevoImplicated.imp_edad" type="number" placeholder="Ej: 18"></b-form-input>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Dirección" label-for="imp_direccion">
                                    <b-form-input v-model="nuevoImplicated.imp_direccion" type="text" placeholder="Ej: calle 36 #101-22"></b-form-input>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Teléfonos" label-for="imp_telefonos">
                                    <b-form-input v-model="nuevoImplicated.imp_telefonos" type="text" placeholder="Ej 3176669800, 3110910092" :class="hasError('imp_telefonos') ? 'is-invalid' : ''"></b-form-input>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Correos" label-for="imp_emails">
                                    <b-form-input v-model="nuevoImplicated.imp_emails" type="text" placeholder="Ej hola@example.com, prueba@example.com" :class="hasError('imp_emails') ? 'is-invalid' : ''"></b-form-input>
                                  </b-form-group>
                                  <div class="col-md-1 pt-4">
                                    <b-button class="mt-3 mr-1" size="sm" variant="primary" @click="agregarImplicated"> Agregar </b-button>
                                  </div>
                                </b-row>
                              </div>
                            </template>
                          </iq-card>
                        </b-col>
                      </b-row>
                    </form>
                  </ValidationObserver>
                </b-col>
              </b-row>
            </b-container>
          </tab-content>
          <tab-content title="Proceso Judicial">
            <b-container fluid>
              <b-row>
                <b-col md="12">
                  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                      <b-row>
                        <b-col lg="12">
                          <iq-card>
                            <template v-slot:headerTitle>
                              <h4 class="card-title">Campos marcados con * son obligatorios</h4>
                            </template>
                            <template v-slot:body>
                              <div class="new-user-info">
                                <b-row>
                                  <b-form-group class="col-md-6" label="Tipo de Proceso" label-for="prore_typro_id">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.typro_name}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_warranty_phone == null">
                                      <b-form-select plain v-model="formData.prore_typro_id" :options="typeProcessOptions" id="prore_typro_id" :class="hasError('prore_typro_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null">Seleccione un tipo de Proceso</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_typro_id')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_typro_id.required">Por favor elige una opción.</div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Juzgado" label-for="prore_court_id">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.court_name}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_court_id == null">
                                      <b-form-select plain v-model="formData.prore_court_id" :options="courtsOptions" id="selectuserrole" :class="hasError('prore_court_id') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null">Seleccione un juzgado</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                    <b-card-text class="texto-tipo-boton text-dark" v-b-modal.modal-crear-juzaga>Crear juzgado</b-card-text>
                                  </b-form-group>
                                  <b-modal
                                    id="modal-crear-juzaga"
                                    ref="modal"
                                    title="Agregar juzgado"
                                    @ok="handleOk"
                                  >
                                    <form ref="form" @submit.stop.prevent="handleSubmit">
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
                                        <b-form-input v-model="nuevo_court.telefono" type="number" placeholder="ej: 3015456561"></b-form-input>
                                      </b-form-group>
                                      <b-form-group label="Correo del juzgado">
                                        <b-form-input v-model="nuevo_court.email" type="email" placeholder="info@example.com"></b-form-input>
                                      </b-form-group>
                                    </form>
                                  </b-modal>
                                  <b-form-group class="col-md-6" label="Número de Radicado" label-for="prore_num_radicado">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_num_radicado}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_num_radicado == null">
                                      <b-form-input id="prore_num_radicado" v-model="formData.prore_num_radicado" type="text" :class="hasError('prore_num_radicado') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_num_radicado')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_num_radicado.required">Por favor escriba el número radicado.</div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Objeto del Litigio" label-for="prore_objeto_litigio">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_objeto_litigio}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_objeto_litigio == null">
                                      <b-form-input v-model="formData.prore_objeto_litigio" type="text" placeholder="Objeto"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <template>
                                    <b-form-group class="col-md-6" label="Proceso Ejecutivo" label-for="prore_proceso_ejecutivo">
                                      <div v-if="proc_id != null">
                                        <span class='text'>{{formData.prore_proceso_ejecutivo}}</span>
                                      </div>
                                      <div v-else>
                                        <b-form-input v-model="formData.prore_proceso_ejecutivo" type="text" placeholder="Proceso Ejecutivo" :class="hasError('prore_proceso_ejecutivo') ? 'is-invalid' : ''"></b-form-input>
                                        <div v-if="hasError('prore_proceso_ejecutivo')" class="invalid-feedback">
                                          <div class="error" v-if="!$v.formData.prore_proceso_ejecutivo.required">Por favor escriba el proceso ejecutivo.
                                          </div>
                                        </div>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Ejecutante" label-for="prore_ejecutante">
                                      <div v-if="proc_id != null">
                                        <span class='text'>{{formData.prore_ejecutante}}</span>
                                      </div>
                                      <div v-else>
                                        <b-form-input v-model="formData.prore_ejecutante" type="text" placeholder="Ejecutante" :class="hasError('prore_ejecutante') ? 'is-invalid' : ''"></b-form-input>
                                        <div v-if="hasError('prore_ejecutante')" class="invalid-feedback">
                                          <div class="error" v-if="!$v.formData.prore_ejecutante.required">Por favor escriba el ejecutante.
                                          </div>
                                        </div>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Medida Cautelar" label-for="prore_medida_cautelar">
                                      <div v-if="proc_id != null">
                                        <span class='text'>{{formData.prore_medida_cautelar}}</span>
                                      </div>
                                      <div v-else>
                                        <b-form-input id="prore_medida_cautelar" type="text" placeholder="Medida cautelas" v-model="formData.prore_medida_cautelar" :class="hasError('prore_medida_cautelar') ? 'is-invalid' : ''"></b-form-input>
                                        <div v-if="hasError('prore_medida_cautelar')" class="invalid-feedback">
                                          <div class="error" v-if="!$v.formData.prore_medida_cautelar.required">Por favor escriba la medida cautelar.
                                          </div>
                                        </div>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Pretensiones/Capital/Interes/Honorarios" label-for="prore_pretenciones_cap_int_hon">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_pretenciones_cap_int_hon}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_pretenciones_cap_int_hon == null">
                                        <b-form-input v-model="formData.prore_pretenciones_cap_int_hon" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                  </template>
                                  <template>
                                    <b-form-group class="col-md-6" label="Pretensiones Laborales" label-for="prore_pretenciones_laborales">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_pretenciones_laborales}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_pretenciones_laborales == null">
                                        <b-form-input v-model="formData.prore_pretenciones_laborales" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Prestaciones Sociales" label-for="prore_prestaciones_sociales">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_prestaciones_sociales}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_prestaciones_sociales == null">
                                        <b-form-input v-model="formData.prore_prestaciones_sociales" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Pretensiones por Vacaciones" label-for="prore_pretenciones_vacaciones">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_pretenciones_vacaciones}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_pretenciones_vacaciones == null">
                                        <b-form-input id="prore_pretenciones_vacaciones" v-model="formData.prore_pretenciones_vacaciones" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Pretensiones por Indemnización" label-for="prore_pretenciones_indemnizacion">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_pretenciones_indemnizacion}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_pretenciones_indemnizacion == null">
                                        <b-form-input v-model="formData.prore_pretenciones_indemnizacion" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Pago de Seguridad Social en Salud" label-for="prore_pago_seguridad_social_sa">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_pago_seguridad_social_sa}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_pago_seguridad_social_sa == null">
                                        <b-form-input v-model="formData.prore_pago_seguridad_social_sa" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Salarios dejados de Percibir" label-for="prore_salario_dejados_percibir">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_salario_dejados_percibir}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_salario_dejados_percibir == null">
                                        <b-form-input id="prore_salario_dejados_percibir" v-model="formData.prore_salario_dejados_percibir" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Otros" label-for="prore_otros_valores">
                                      <div v-if="!editing && proc_id != null">
                                        <span class='text' @click="enableEditing">{{formData.prore_otros_valores}}</span>
                                      </div>
                                      <div v-if="editing || proc_id == null || formData.prore_otros_valores == null">
                                          <b-form-input v-model="formData.prore_otros_valores" type="number" placeholder="$"></b-form-input>
                                      </div>
                                      <div v-if="editing && proc_id != null">
                                        <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                        <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                      </div>
                                    </b-form-group>
                                  </template>
                                  <b-form-group class="col-md-6" label="Valor Lucro Cesante" label-for="prore_val_luc_cesante">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_val_luc_cesante}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input v-model="formData.prore_val_luc_cesante" type="number" placeholder="$" :class="hasError('prore_val_luc_cesante') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_val_luc_cesante')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_val_luc_cesante.required">Por favor escriba valor de lucro cesante.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Valor Daño Emergente" label-for="prore_val_dano_emergente">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_val_dano_emergente}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input v-model="formData.prore_val_dano_emergente" type="number" placeholder="$" :class="hasError('prore_val_dano_emergente') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_val_dano_emergente')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_val_dano_emergente.required">Por favor escriba valor de daño emergente.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Total Perjuicios Materiales" label-for="prore_total_perjuicios_materiales">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text'>{{formData.prore_total_perjuicios_materiales}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_total_perjuicios_materiales == null">
                                      <b-form-input id="prore_total_perjuicios_materiales" v-model="formData.prore_total_perjuicios_materiales" type="number" placeholder="$" :class="hasError('prore_total_perjuicios_materiales') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_total_perjuicios_materiales')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_total_perjuicios_materiales.required">Por favor escriba el total de perjuicios materiales.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Estimado Del Monto A Pagar Por Perjuicios Materiales" label-for="prore_estimacion_pago_perju">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_estimacion_pago_perju_materiales}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_estimacion_pago_perju_materiales" v-model="formData.prore_estimacion_pago_perju_materiales" type="number" placeholder="$" :class="hasError('prore_estimacion_pago_perju_materiales') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_estimacion_pago_perju_materiales')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_estimacion_pago_perju_materiales.required">Por favor escriba el estimado del monto a pagar por perjuiciosos materiales.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Valor Que Cubre La Poliza Por Perjuicios Materiales" label-for="prore_val_cubre_poliza_perjuicios_mat">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='number' @click="enableEditing">{{formData.prore_val_cubre_poliza_perjuicios_mat}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_val_cubre_poliza_perjuicios_mat == null">
                                      <b-form-input id="prore_val_cubre_poliza_perjuicios_mat" v-model="formData.prore_val_cubre_poliza_perjuicios_mat" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Valor Daño Moral" label-for="prore_val_dano_moral">
                                    <div v-if="proc_id != null">
                                      <span class='number'>{{formData.prore_val_dano_moral}}</span>
                                    </div>
                                    <div v-if="proc_id == null || formData.prore_val_dano_moral == null">
                                      <b-form-input v-model="formData.prore_val_dano_moral" type="number" placeholder="$" :class="hasError('prore_val_dano_moral') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_val_dano_moral')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_val_dano_moral.required">Por favor escriba el valor en daño moral.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Daño a la Vida ó Prejuicios Fisiologicos y Otros" label-for="prore_val_dano_vida">
                                    <div v-if="proc_id != null">
                                      <span class='number'>{{formData.prore_val_dano_vida}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input v-model="formData.prore_val_dano_vida" type="number" placeholder="$" :class="hasError('prore_val_dano_vida') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_val_dano_vida')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_val_dano_vida.required">Por favor escriba el valor de daño a la vida o perjuicios.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Total Perjuicios Inmateriales" label-for="prore_total_perjuicios_inmateriales">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='number' @click="enableEditing">{{formData.prore_total_perjuicios_inmateriales}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_total_perjuicios_inmateriales == null">
                                      <b-form-input v-model="formData.prore_total_perjuicios_inmateriales" type="number" placeholder="$" :class="hasError('prore_total_perjuicios_inmateriales') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_total_perjuicios_inmateriales')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_total_perjuicios_inmateriales.required">Por favor escriba el total de perjuicios inmateriales.
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Estimado Del Monto A Pagar Por Perjuicios Inmateriales" label-for="prore_estimacion_pago_perju_inmateriales">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_estimacion_pago_perju_inmateriales}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_estimacion_pago_perju_inmateriales == null">
                                      <b-form-input id="prore_estimacion_pago_perju_inmateriales" v-model="formData.prore_estimacion_pago_perju_inmateriales" type="number" placeholder="$" :class="hasError('prore_estimacion_pago_perju_inmateriales') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_estimacion_pago_perju_inmateriales')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_estimacion_pago_perju_inmateriales.required">Por favor escriba el estimado de perjuicios inmateriales.
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Valor que Cube la Poliza Prejuicios Inmateriales" label-for="prore_val_cubre_poliza_perjuicios_inmat">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_val_cubre_poliza_perjuicios_inmat}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_val_cubre_poliza_perjuicios_inmat == null">
                                      <b-form-input id="prore_val_cubre_poliza_perjuicios_inmat" v-model="formData.prore_val_cubre_poliza_perjuicios_inmat" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Cuantía de las Pretensiones" label-for="prore_cuantia_pretenciones">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_cuantia_pretenciones}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_cuantia_pretenciones == null">
                                      <b-form-input id="prore_cuantia_pretenciones" v-model="formData.prore_cuantia_pretenciones" type="number" placeholder="$" :class="hasError('prore_cuantia_pretenciones') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_cuantia_pretenciones')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_cuantia_pretenciones.required">Por favor escriba la cuantía de las pretensiones.
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Valor a Provisionar" label-for="prore_valor_provisionar">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_valor_provisionar}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_valor_provisionar == null">
                                      <b-form-input id="prore_valor_provisionar" v-model="formData.prore_valor_provisionar" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Aseguradora" label-for="prore_aseguradora_id">
                                    <b-form-select plain v-model="formData.prore_aseguradora_id" :options="aseguradorasOptions" id="prore_aseguradora_id" :class="hasError('prore_aseguradora_id') ? 'is-invalid' : ''">
                                      <template v-slot:first>
                                        <b-form-select-option :value="null" disabled>Seleccione una Aseguradora</b-form-select-option>
                                      </template>
                                    </b-form-select>
                                    <div v-if="hasError('prore_aseguradora_id')" class="invalid-feedback">
                                      <div class="error" v-if="!$v.formData.prore_aseguradora_id.required">Por elige una opción.</div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Número de Poliza" label-for="prore_num_poliza">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_num_poliza}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_num_poliza == null">
                                      <b-form-input id="prore_num_poliza" v-model="formData.prore_num_poliza" type="number" placeholder="Número póliza" :class="hasError('prore_num_poliza') ? 'is-invalid' : ''"></b-form-input>
                                        <div v-if="hasError('prore_num_poliza')" class="invalid-feedback">
                                          <div class="error" v-if="!$v.formData.prore_num_poliza.required">
                                            Por favor escriba el número de poliza.
                                          </div>
                                        </div>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Monto Total Asegurado" label-for="prore_val_total_asegurado">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_val_total_asegurado}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_val_total_asegurado == null">
                                      <b-form-input id="prore_val_total_asegurado" v-model="formData.prore_val_total_asegurado" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Si La Poliza Fue Afectada Por Que Valor" label-for="prore_val_afectado_poliza">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_val_afectado_poliza}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_val_afectado_poliza == null">
                                      <b-form-input id="prore_val_afectado_poliza" v-model="formData.prore_val_afectado_poliza" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Deducible" label-for="prore_deducible">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_deducible}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_deducible == null">
                                      <b-form-input id="prore_deducible" v-model="formData.prore_deducible" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Cobertura Actual Poliza" label-for="prore_val_cobertura_poliza">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_val_cobertura_poliza}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_val_cobertura_poliza == null">
                                      <b-form-input id="prore_val_cobertura_poliza" v-model="formData.prore_val_cobertura_poliza" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Provisiones Constituidas" label-for="prore_val_provisiones_constituidas">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_val_provisiones_constituidas}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_val_provisiones_constituidas == null">
                                      <b-form-input id="prore_val_provisiones_constituidas" v-model="formData.prore_val_provisiones_constituidas" type="number" placeholder="$"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Prescritas" label-for="prore_prescritas">
                                    <div v-if="proc_id != null">
                                      <span class='text' v-if="formData.prore_prescritas == 1">Sí</span>
                                      <span class='text' v-else>No</span>
                                    </div>
                                    <div v-else>
                                      <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="formData.prore_prescritas" value="1">Prescritas</b-form-checkbox>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha Sentencia Primera Instancia" label-for="prore_fec_sentencia_primera_instancia">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_fec_sentencia_primera_instancia}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_fec_sentencia_primera_instancia" v-model="formData.prore_fec_sentencia_primera_instancia" type="date" :class="hasError('prore_fec_sentencia_primera_instancia') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_sentencia_primera_instancia')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_sentencia_primera_instancia.required">
                                          Por favor elija una fecha.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de Consulta" label-for="prore_fec_consulta">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_fec_consulta}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_fec_consulta" v-model="formData.prore_fec_consulta" type="date" :class="hasError('prore_fec_consulta') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_consulta')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_consulta.required">
                                          Por favor elija una fecha.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de Sentencia Segunda Instancia" label-for="prore_fec_sentencia_segunda_instancia">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_fec_sentencia_segunda_instancia}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_fec_sentencia_segunda_instancia" v-model="formData.prore_fec_sentencia_segunda_instancia" type="date" :class="hasError('prore_fec_sentencia_segunda_instancia') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_fec_sentencia_segunda_instancia')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_fec_sentencia_segunda_instancia.required">
                                          Por favor elija una fecha.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Fecha de Casación" label-for="prore_fec_casacion">
                                    <div v-if="!editing && proc_id != null">
                                      <span class='text' @click="enableEditing">{{formData.prore_fec_casacion}}</span>
                                    </div>
                                    <div v-if="editing || proc_id == null || formData.prore_fec_casacion == null">
                                      <b-form-input id="prore_fec_casacion" v-model="formData.prore_fec_casacion" type="date"></b-form-input>
                                    </div>
                                    <div v-if="editing && proc_id != null">
                                      <b-button class="mt-1 mr-1" size="sm" @click="disableEditing"> Cancelar </b-button>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="saveEdit"> Guardar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Sentencia Final" label-for="prore_sentencia_final">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_sentencia_final}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-select plain v-model="formData.prore_sentencia_final" id="prore_sentencia_final" :class="hasError('prore_sentencia_final') ? 'is-invalid' : ''">
                                        <template v-slot:first>
                                          <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                          <b-form-select-option :value="'Ninguna'">Ninguna</b-form-select-option>
                                          <b-form-select-option :value="'A Favor'" >A Favor</b-form-select-option>
                                          <b-form-select-option :value="'En Contra'">En Contra</b-form-select-option>
                                        </template>
                                      </b-form-select>
                                      <div v-if="hasError('prore_sentencia_final')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_sentencia_final.required">
                                          Por favor elija una opción.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Valor De La Sentencia Final" label-for="prore_val_sentencia_final">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_val_sentencia_final}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_val_sentencia_final" v-model="formData.prore_val_sentencia_final" type="number" placeholder="$" :class="hasError('prore_val_sentencia_final') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_val_sentencia_final')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_val_sentencia_final.required">
                                          Por favor escriba un valor.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Discriminar Valor De La Condena" label-for="prore_discriminar_val_condena">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_discriminar_val_condena}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_discriminar_val_condena" v-model="formData.prore_discriminar_val_condena" type="number" placeholder="$" :class="hasError('prore_discriminar_val_condena') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_discriminar_val_condena')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_discriminar_val_condena.required">
                                          Por favor escriba un valor.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Costas De La Sentencia" label-for="prore_costas_sentencia">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_costas_sentencia}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_costas_sentencia" v-model="formData.prore_costas_sentencia" type="number" placeholder="$" :class="hasError('prore_costas_sentencia') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_costas_sentencia')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_costas_sentencia.required">
                                          Por favor escriba un valor.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Costas Procesales Primera Instancia" label-for="prore_costas_procesales_primera_instancia">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_costas_procesales_primera_instancia}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_costas_procesales_primera_instancia" v-model="formData.prore_costas_procesales_primera_instancia" type="number" placeholder="$" :class="hasError('prore_costas_procesales_primera_instancia') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_costas_procesales_primera_instancia')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_costas_procesales_primera_instancia.required">
                                          Por favor escriba un valor.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Costas Procesales Segunda Instancia" label-for="prore_costas_procesales_segunda_instancia">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_costas_procesales_segunda_instancia}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_costas_procesales_segunda_instancia" v-model="formData.prore_costas_procesales_segunda_instancia" type="number" placeholder="$" :class="hasError('prore_costas_procesales_segunda_instancia') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_costas_procesales_segunda_instancia')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_costas_procesales_segunda_instancia.required">
                                          Por favor escriba un valor.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Total Costas" label-for="prore_total_costas">
                                    <div v-if="proc_id != null">
                                      <span class='text'>{{formData.prore_total_costas}}</span>
                                    </div>
                                    <div v-else>
                                      <b-form-input id="prore_total_costas" v-model="formData.prore_total_costas" type="number" placeholder="$" :class="hasError('prore_total_costas') ? 'is-invalid' : ''"></b-form-input>
                                      <div v-if="hasError('prore_total_costas')" class="invalid-feedback">
                                        <div class="error" v-if="!$v.formData.prore_total_costas.required">
                                          Por favor escriba un valor.
                                        </div>
                                      </div>
                                    </div>
                                  </b-form-group>
                                </b-row>
                              </div>
                            </template>
                          </iq-card>
                        </b-col>
                      </b-row>
                    </form>
                  </ValidationObserver>
                </b-col>
              </b-row>
            </b-container>
          </tab-content>
          <tab-content title="Seguimiento">
            <b-container fluid>
              <b-row>
                <b-col md="12">
                  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                      <b-row>
                        <b-col lg="12">
                          <iq-card>
                            <template v-slot:body>
                              <div class="new-user-info">
                                <b-row>
                                  <b-form-group class="col-md-6" label="Nombre del link" label-for="prore_link_documentacion">
                                    <div>
                                      <b-form-input type="text" v-model="nuevoLink.link_name" placeholder="ej: Resultado primera audiencia"></b-form-input>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-6" label="Link de sharepoint" label-for="prore_link_documentacion">
                                    <div>
                                      <b-form-input type="text" v-model="nuevoLink.link_url" placeholder="ej: https://gospedale.sharepoint.com/:u:/r/sites/msteams_1da9eb/Shared%20Documents/General/CRISTHIAN%20CASTRO/AppReport/Sqls-Necesarios/incident_report.sql?csf=1" ></b-form-input>
                                    </div>
                                    <div>
                                      <b-button class="mt-1 mr-1" size="sm" variant="primary" @click="agregarLink"> Agregar </b-button>
                                    </div>
                                  </b-form-group>
                                  <b-form-group class="col-md-12" label="Links guardados" label-for="prore_link_documentacion">
                                    <div v-for="(link, index) in links" :key="index">
                                      <span>
                                        <a v-bind:href="link.link_url" target="_blank">Link #{{ index }}: {{ link.link_name }}</a>
                                      </span>
                                      <span> <a class="pl-2" href="javascript:void(0)" @click="eliminarLink(index)"><i class="ri-close-circle-line text-danger" style="font-size:17px;"></i></a></span>
                                    </div>
                                  </b-form-group>
                                </b-row>
                              </div>
                            </template>
                          </iq-card>
                        </b-col>
                      </b-row>
                    </form>
                  </ValidationObserver>
                </b-col>
              </b-row>
            </b-container>
          </tab-content>
        </form-wizard>
      </div>
    </section>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import { required } from 'vuelidate/lib/validators'
// import { ValidationObserver } from 'vee-validate'
// import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { FormWizard, TabContent, ValidationHelper } from 'vue-step-wizard'
import 'vue-step-wizard/dist/vue-step-wizard.css'
import IqCard from '../../components/xray/cards/iq-card.vue'
import auth from '@/logic/auth'

export default {
  name: 'AddUser',
  components: {
    FormWizard, TabContent, IqCard
  },
  mixins: [ ValidationHelper ],
  props: ['formType', 'email', 'password'],
  mounted () {
    xray.index()
    this.ejecutarConsultas()
  },
  data () {
    return {
      year: null,
      progress_total: 4,
      max: 100,
      nextTab: 'JEJE',
      loading: true,
      errored: false,
      animate: true,
      genderPaciente: 'N/A',
      links: [],
      nuevoLink: {
        link_name: '',
        link_url: '',
        link_user_id: ''
      },
      implicated: [],
      nuevoImplicated: {
        imp_tipo_identificacion: '',
        imp_identificacion: '',
        imp_nombres: '',
        imp_apellidos: '',
        imp_direccion: '',
        imp_edad: '',
        imp_genero_id: '',
        imp_telefonos: '',
        imp_emails: '',
        imp_profile_id: ''
      },
      fields: [
        { key: 'imp_nombres', label: 'Nombres', class: 'text-center' },
        { key: 'imp_apellidos', label: 'Apellidos', class: 'text-center' },
        { key: 'imp_telefonos', label: 'Teléfonos', class: 'text-center' },
        { key: 'imp_emails', label: 'Correos', class: 'text-center' },
        {
          key: 'imp_profile_id',
          label: 'Perfil',
          formatter: (value, key, item) => {
            // profileId = 4 Firma de abogados; 5 = Paciente;
            // 6 = Abogado demandante; 7 = Demandante; 8 = Demandado; 9 = Llamado en garantía
            if (value === 4) {
              return 'Firma de abogados'
            } else if (value === 5) {
              return 'Paciente'
            } else if (value === 6) {
              return 'Abogado demandante'
            } else if (value === 7) {
              return 'Demandante'
            } else if (value === 8) {
              return 'Demandado'
            } else if (value === 9) {
              return 'Llamado en garantía'
            }
          },
          class: 'text-center'
        },
        { key: 'actions', label: 'Acciones', class: 'text-center' }
      ],
      validationRules: [
        {
          prore_num_proceso: { required },
          prore_fec_ingreso: { required },
          prore_defendant_clin: { required },
          prore_year_sinister: { required },
          prore_fec_sinister: { required },
          prore_year_notify: { required },
          prore_process_year: { required },
          prore_fec_noti_preju: { required },
          prore_fec_audi_conci_preju: { required },
          prore_fec_sinies_aviso: { required },
          prore_sinies_description: { required },
          prore_fec_recibo_notify: { required },
          prore_colaborador_ips: { required },
          prore_fec_ingreso_jur: { required },
          prore_fec_ingreso_cli: { required },
          prore_city_id: { required },
          prore_litigando_id: { required }
        }
      ],
      formData: {
        prore_fec_ingreso: '',
        prore_responsable: '',
        prore_colaborador_ips: '',
        prore_num_proceso: '',
        prore_year_sinister: '',
        prore_fec_sinister: '',
        prore_year_notify: '',
        prore_diffence_year: '',
        prore_process_year: '',
        prore_pro_id: '',
        prore_propse_id: '',
        prore_defendant_clin: '',
        prore_court_id: '',
        prore_typro_id: '',
        prore_status_process_id: '',
        prore_litigando_id: '',
        prore_ase_id: '',
        prore_city_id: '',
        prore_objeto_litigio: '',
        prore_proceso_ejecutivo: '',
        prore_ejecutante: '',
        prore_medida_cautelar: '',
        prore_pretenciones_cap_int_hon: '',
        prore_pretenciones_laborales: '',
        prore_prestaciones_sociales: '',
        prore_pretenciones_vacaciones: '',
        prore_pretenciones_indemnizacion: '',
        prore_pago_seguridad_social_sa: '',
        prore_salario_dejados_percibir: '',
        prore_otros_valores: '',
        prore_num_radicado: '',
        prore_pathology: '',
        prore_risk_id: '',
        prore_val_luc_cesante: '',
        prore_val_dano_emergente: '',
        prore_total_perjuicios_materiales: '',
        prore_estimacion_pago_perju_materiales: '',
        prore_val_cubre_poliza_perjuicios_mat: '',
        prore_val_dano_moral: '',
        prore_val_dano_vida: '',
        prore_total_perjuicios_inmateriales: '',
        prore_estimacion_pago_perju_inmateriales: '',
        prore_val_cubre_poliza_perjuicios_inmat: '',
        prore_cuantia_pretenciones: '',
        prore_valor_provisionar: '',
        prore_aseguradora_id: '',
        prore_num_poliza: '',
        prore_val_total_asegurado: '',
        prore_val_afectado_poliza: '',
        prore_val_cobertura_poliza: '',
        prore_deducible: '',
        prore_val_provisiones_constituidas: '',
        prore_prescritas: '',
        prore_fec_sentencia_primera_instancia: '',
        prore_fec_consulta: '',
        prore_fec_sentencia_segunda_instancia: '',
        prore_fec_casacion: '',
        prore_sentencia_final: '',
        prore_val_sentencia_final: '',
        prore_discriminar_val_condena: '',
        prore_costas_sentencia: '',
        prore_costas_procesales_primera_instancia: '',
        prore_costas_procesales_segunda_instancia: '',
        prore_total_costas: '',
        prore_observation: '',
        prore_fec_noti_preju: '',
        prore_fec_audi_conci_preju: '',
        prore_fec_sinies_aviso: '',
        prore_fec_recibo_notify: '',
        prore_fec_ingreso_jur: '',
        prore_fec_ingreso_cli: '',
        prore_sinies_description: '',
        prore_estado: '',
        file1: '',
        prore_link_documentacion: '',
        prore_user_id: ''
      },
      proc: {},
      process: [],
      procTemp: {},
      editing: false,
      clinicaOptions: [],
      abogadoOptions: [],
      proc_id: this.$route.params.id,
      especialidadesOptions: {},
      typeProcessOptions: {},
      courtsOptions: {},
      risksOptions: {},
      nuevo_court: {
        name: '',
        telefono: '',
        email: ''
      },
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 },
        { text: 'NIT', value: 4 }
      ],
      aseguradorasOptions: {},
      departmentsOptions: {},
      citiesOptions: {},
      profilesOptions: {},
      statusProcessOptions: {},
      stateActive: {
        genero: 'active',
        number: 'two',
        colorDisabled: 'five',
        color: 'danger'
      },
      generoOptions: [
        {
          text: 'Masculino',
          value: 2
        },
        {
          text: 'Femenino',
          value: 1
        }
      ],
      users: [],
      errores: {},
      intentos: 0
    }
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    },
    fullNameUser: function () {
      return this.user.usr_name_first + ' ' + this.user.usr_lastname_first
    },
    years () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 1995 }, (value, index) => 2000 + index)
    }
  },
  methods: {
    ejecutarConsultas () {
      setTimeout(() => {
        this.fetchOptionsClinicas()
        this.fetchOptionsAbogados()
        setTimeout(() => {
          this.fetchEstadosProceso()
          this.fetchAseguradoras()
          setTimeout(() => {
            this.fetchEspecialidades()
            this.fetchTypeProcess()
            setTimeout(() => {
              this.fetchDepartments()
              this.fetchCourts()
              this.fetchProfiles()
              setTimeout(() => {
                this.fetchRisks()
                this.barraCargando()
              }, 500)
            }, 500)
          }, 500)
        }, 500)
      }, 500)
    },
    fetchEstadosProceso () {
      axios.get('/statusProcess/fetch').then(response => {
        this.statusProcessOptions = response.data.status_process
      })
    },
    fetchAseguradoras () {
      axios.get('/aseguradoras/fetch').then(response => {
        this.aseguradorasOptions = response.data.aseguradoras
      })
    },
    fetchEspecialidades () {
      axios.get('/especialidades/fetch').then(response => {
        this.especialidadesOptions = response.data.especialidades
      })
    },
    fetchTypeProcess () {
      axios.get('/typeProcess/fetch').then(response => {
        this.typeProcessOptions = response.data.type_process
      })
    },
    fetchDepartments () {
      axios.get('/departments/fetch').then(response => {
        this.departmentsOptions = response.data.departments
      })
    },
    fetchCity () {
      axios.get('/cities/fetch/' + this.formData.department_id).then(response => {
        this.citiesOptions = response.data.cities
        this.errores = {}
        this.intentos = 0
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchCity()
          }
          this.intentos++
        })
    },
    fetchCourts () {
      axios.get('/courts/fetch').then(response => {
        this.courtsOptions = response.data.courts
        this.errores = {}
        this.intentos = 0
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
      })
    },
    fetchProfiles () {
      // solo trae los perfiles que no tengan que ver con la plataforma
      axios.get('/profiles/fetchExterns').then(response => {
        this.profilesOptions = response.data.profiles
      })
    },
    validateStep (ref) {
      alert('This is called before switchind tabs')
      return this.$refs[ref].validate()
    },
    previewImage: function (event) {
      const input = event.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = e => {
          this.user.profile_image = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    onSubmit () {
      this.addProcess()
    },
    addProcess () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.formData.prore_user_id = this.userLogged.usr_id
      }
      const toke = localStorage.getItem('access_token')
      axios.post('/process/store', { formulario: this.formData, links: this.links, implicated: this.implicated }, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal('Proceso agregado correctamente')
          this.$router.push({ name: 'process.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    updateProcess () {
      if (this.proc_id != null) {
        const toke = localStorage.getItem('access_token')
        axios.post('/process/update/' + this.proc_id, this.formData, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
          if (res.data.status_code === 200) {
            Vue.swal('Proceso actualizado correctamente')
          } else {
            Vue.swal('Error tratando de actualizar proceso. ' + res.data.message)
          }
        })
      }
    },
    enableEditing () {
      this.editing = true
    },
    disableEditing () {
      this.editing = false
    },
    saveEdit () {
      this.disableEditing()
      this.updateProcess()
    },
    fetchOptionsClinicas () {
      axios.get('/clinicas').then(response => {
        this.clinicaOptions = response.data.clinicas
      })
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetch').then(response => {
        this.abogadoOptions = response.data.professionals
      })
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      if (this.nuevo_court.name === '' || this.nuevo_court.name === null || this.nuevo_court.telefono === '' || this.nuevo_court.telefono === null) {
        Vue.swal('Por favor complete los datos.')
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit () {
      const toke = localStorage.getItem('access_token')
      axios.post('/courts/store', this.nuevo_court, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-crear-juzaga')
        })
        if (res.data.status_code === 200) {
          this.nuevo_court.name = ''
          this.nuevo_court.telefono = ''
          this.nuevo_court.email = ''
          Vue.swal('Juzgado agregado correctamente')
          this.fetchCourts()
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    agregarLink () {
      if (this.nuevoLink.link_name === '' || this.nuevoLink.link_name === undefined) {
        Vue.swal('Por favor escribir el nombre del link')
        return false
      }
      if (this.nuevoLink.link_url === '' || this.nuevoLink.link_url === undefined) {
        Vue.swal('Por favor escribir el link')
        return false
      }
      this.links.push({ link_name: this.nuevoLink.link_name, link_url: this.nuevoLink.link_url, link_user_id: this.userLogged.usr_id })
    },
    eliminarLink (linkId) {
      this.links.splice(linkId, 1)
    },
    agregarImplicated () {
      if (this.nuevoImplicated.imp_nombres === '' || this.nuevoImplicated.imp_nombres === undefined) {
        Vue.swal('Por favor escribir los nombres')
        return false
      }
      if (this.nuevoImplicated.imp_apellidos === '' || this.nuevoImplicated.imp_apellidos === undefined) {
        Vue.swal('Por favor escribir los apellidos')
        return false
      }
      if (this.nuevoImplicated.imp_profile_id === '' || this.nuevoImplicated.imp_profile_id === undefined) {
        Vue.swal('Por favor seleccionar la relación en el proceso')
        return false
      }
      this.implicated.push({ imp_tipo_identificacion: this.nuevoImplicated.imp_tipo_identificacion, imp_identificacion: this.nuevoImplicated.imp_identificacion, imp_nombres: this.nuevoImplicated.imp_nombres, imp_apellidos: this.nuevoImplicated.imp_apellidos, imp_telefonos: this.nuevoImplicated.imp_telefonos, imp_emails: this.nuevoImplicated.imp_emails, imp_profile_id: this.nuevoImplicated.imp_profile_id, imp_direccion: this.nuevoImplicated.imp_direccion, imp_edad: this.nuevoImplicated.imp_edad, imp_genero_id: this.nuevoImplicated.imp_genero_id })
      this.limpiarNuevoImplicated()
    },
    deleteImplicated (implicatedId) {
      this.implicated.splice(implicatedId, 1)
    },
    limpiarNuevoImplicated () {
      this.nuevoImplicated.imp_tipo_identificacion = ''
      this.nuevoImplicated.imp_identificacion = ''
      this.nuevoImplicated.imp_nombres = ''
      this.nuevoImplicated.imp_apellidos = ''
      this.nuevoImplicated.imp_telefonos = ''
      this.nuevoImplicated.imp_direccion = ''
      this.nuevoImplicated.imp_genero_id = ''
      this.nuevoImplicated.imp_edad = ''
      this.nuevoImplicated.imp_emails = ''
      this.nuevoImplicated.imp_profile_id = ''
    }
  }
}
</script>
