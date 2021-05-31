<template>
  <b-container fluid>
    <span v-if="proc_id != null" v-show="true">{{process[0].prore_id}}</span>
    {{process[0]}}
    <form-wizard @onComplete="onSubmit">
      <tab-content title="Información General" :selected="true">
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
                            <b-form-group class="col-md-6" label="Fecha de Ingreso" label-for="prore_fec_ingreso">
                              <div v-if="!editing && proc_id != null && process[0].prore_fec_ingreso != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_ingreso}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_ingreso == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_ingreso" type="date" :class="hasError('prore_fec_ingreso') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_ingreso')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_ingreso.required">Por favor elige una fecha.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Clinica/IPS" label-for="selectuserrole">
                              <b-form-select plain v-model="formData.prore_defendant_clin" :options="clinicaOptions" @search="fetchOptionsClinicas" id="selectuserrole" :class="hasError('prore_defendant_clin') ? 'is-invalid' : ''">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una clinica</b-form-select-option>
                                </template>
                              </b-form-select>
                              <div v-if="hasError('prore_defendant_clin')" class="invalid-feedback">
                                <div class="error" v-if="!$v.formData.prore_defendant_clin.required">Por favor elige una clinica.</div>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Año del Siniestro" label-for="exampleInputNumber1">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_year_sinister}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_year_sinister == null">
                                <!--<b-form-input id="exampleInputNumber1" v-model="formData.prore_year_sinister" type="number" :class="hasError('prore_year_sinister') ? 'is-invalid' : ''"></b-form-input>-->
                                <b-form-select plain v-model="formData.prore_year_sinister" :options="years" id="selectyearsinister" :class="hasError('prore_year_sinister') ? 'is-invalid' : ''">
                                  <template v-slot:first>
                                    <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                  </template>
                                </b-form-select>
                                <div v-if="hasError('prore_year_sinister')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_year_sinister.required">Por favor seleccione el año del siniestro.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha del Siniestro" label-for="prore_fec_sinister">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_sinister}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_sinister == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_sinister" type="date" :format="{ year }" :class="hasError('prore_fec_sinister') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_sinister')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_sinister.required">Por favor seleccione la fecha del siniestro.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Año de notificación" label-for="prore_year_notify">
                              <b-form-select plain v-model="formData.prore_year_notify" :options="years" id="selectyearnotify" :class="hasError('prore_year_notify') ? 'is-invalid' : ''">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                </template>
                              </b-form-select>
                              <div v-if="hasError('prore_year_notify')" class="invalid-feedback">
                                <div class="error" v-if="!$v.formData.prore_year_notify.required">Por favor seleccione el año de notificación.</div>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de notificación prejudicial" label-for="prore_fec_noti_preju">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_noti_preju}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_noti_preju == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_noti_preju" type="date" :class="hasError('prore_fec_noti_preju') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_noti_preju')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_noti_preju.required">Por favor elige una fecha.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de la audiencia de conciliación prejudicial" label-for="prore_fec_audi_conci_preju">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_audi_conci_preju}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_audi_conci_preju == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_audi_conci_preju" type="date" :class="hasError('prore_fec_audi_conci_preju') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_audi_conci_preju')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_audi_conci_preju.required">Por favor elige una fecha.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha aviso del siniestro" label-for="prore_fec_sinies_aviso">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_sinies_aviso}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_sinies_aviso == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_sinies_aviso" type="date" :class="hasError('prore_fec_sinies_aviso') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_sinies_aviso')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_sinies_aviso.required">Por favor elige una fecha.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Descripción del siniestro" label-for="prore_sinies_description">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_sinies_description}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_sinies_description == null">
                                <b-form-textarea v-model="formData.prore_sinies_description" type="text" placeholder="Descripción" :class="hasError('prore_sinies_description') ? 'is-invalid' : ''"></b-form-textarea>
                                <div v-if="hasError('prore_sinies_description')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_sinies_description.required">Por favor deja una descripción del siniestro.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de recibo de notificación IPS" label-for="prore_fec_recibo_notify">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_recibo_notify}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_recibo_notify == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_recibo_notify" type="date" :class="hasError('prore_fec_recibo_notify') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_recibo_notify')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_recibo_notify.required">Por favor elige una fecha.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Colaborador de IPS que recibe notificación" label-for="prore_fec_recibo_notify">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_colaborador_ips}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_colaborador_ips == null">
                                <b-form-input type="text" v-model="formData.prore_colaborador_ips" placeholder="Nombre completo colaborador" :class="hasError('prore_colaborador_ips') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_colaborador_ips')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_colaborador_ips.required">Por favor escriba un nombre.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de Ingreso a Juridico" label-for="prore_fec_ingreso_jur">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_ingreso_jur}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_ingreso_jur == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_ingreso_jur" type="date" :class="hasError('prore_fec_ingreso_jur') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_ingreso_jur')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_ingreso_jur.required">Por favor elige una fecha.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Fecha de Ingreso a Clínica" label-for="prore_fec_ingreso_cli">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_fec_ingreso_cli}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_fec_ingreso_cli == null">
                                <b-form-input id="exampleInputdate" v-model="formData.prore_fec_ingreso_cli" type="date" :class="hasError('prore_fec_ingreso_cli') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_fec_ingreso_cli')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_fec_ingreso_cli.required">Por favor elige una fecha.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Ciudad" label-for="prore_city_id">
                              <b-form-select plain v-model="formData.prore_city_id" :options="citiesOptions" id="select_city" :class="hasError('prore_city_id') ? 'is-invalid' : ''">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una Ciudad</b-form-select-option>
                                </template>
                              </b-form-select>
                              <div v-if="hasError('prore_city_id')" class="invalid-feedback">
                                <div class="error" v-if="!$v.formData.prore_city_id.required">Por favor elige una fecha.</div>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Primer Nombre Paciente" label-for="prore_pac_name_first">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_pac_name_first}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_pac_name_first == null">
                                <b-form-input v-model="formData.prore_pac_name_first" type="text" placeholder="Primer Nombre" :class="hasError('prore_pac_name_first') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_pac_name_first')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_pac_name_first.required">Por favor escriba el primer nombre del paciente.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Segundo Nombre Paciente" label-for="prore_pac_name_secdon">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_pac_name_second}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_pac_name_second == null">
                                <b-form-input v-model="formData.prore_pac_name_second" type="text" placeholder="Segundo Nombre"></b-form-input>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Primer Apellido Paciente" label-for="prore_pac_lastname_first">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_pac_lastname_first}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_pac_lastname_first == null">
                                <b-form-input v-model="formData.prore_pac_lastname_first" type="text" placeholder="Primer Apellido" :class="hasError('prore_pac_lastname_first') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_pac_lastname_first')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_pac_lastname_first.required">Por favor escriba el primer apellido del paciente.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Segundo Apellido Paciente" label-for="prore_pac_lastname_second">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_pac_lastname_second}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_pac_lastname_second == null">
                                <b-form-input v-model="formData.prore_pac_lastname_second" type="text" placeholder="Segundo Apellido"></b-form-input>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Genero del paciente" label-for="usr_lastname_first">
                              <template v-for="(item,index) in state">
                                <b-form-radio inline v-model="formData.prore_pac_gender" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled" :class="hasError('prore_pac_gender') ? 'is-invalid' : ''">{{ item.label }}</b-form-radio>
                              </template>
                              <div v-if="hasError('prore_pac_gender')" class="invalid-feedback">
                                <div class="error" v-if="!$v.formData.prore_pac_gender.required">Por favor elige un género.</div>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Edad del paciente" label-for="prore_pac_age">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_pac_age}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_pac_age == null">
                                <b-form-input v-model="formData.prore_pac_age" id="exampleInputNumber1" type="number" :class="hasError('prore_pac_age') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_pac_age')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_pac_age.required">Por favor escriba la edad del paciente.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Especialidad" label-for="selectuserrole">
                              <b-form-select plain v-model="formData.prore_propse_id" :options="especialidadesOptions" id="select_especialidad" :class="hasError('prore_propse_id') ? 'is-invalid' : ''">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una especialidad</b-form-select-option>
                                </template>
                              </b-form-select>
                              <div v-if="hasError('prore_propse_id')" class="invalid-feedback">
                                <div class="error" v-if="!$v.formData.prore_propse_id.required">Por favor elige una opción.</div>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Asignar Abogada/o" label-for="prore_pro_id">
                              <b-form-select plain v-model="formData.prore_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole" :class="hasError('prore_pro_id') ? 'is-invalid' : ''">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione un abogado</b-form-select-option>
                                </template>
                              </b-form-select>
                              <div v-if="hasError('prore_pro_id')" class="invalid-feedback">
                                <div class="error" v-if="!$v.formData.prore_pro_id.required">Por favor elige una opción.</div>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Estado del proceso" label-for="selectuserrole">
                              <b-form-select plain v-model="formData.prore_status_process_id" :options="statusProcessOptions" @search="fetchEstadosProceso" id="selectuserrole" :class="hasError('prore_status_process_id') ? 'is-invalid' : ''">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione un estado</b-form-select-option>
                                </template>
                              </b-form-select>
                              <div v-if="hasError('prore_status_process_id')" class="invalid-feedback">
                                <div class="error" v-if="!$v.formData.prore_status_process_id.required">Por favor elige una clinica.</div>
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
                      <template v-slot:body>
                        <h4 class="card-title">Información del Demandante:</h4>
                        <div class="new-user-info">
                          <b-row>
                            <b-form-group class="col-md-6" label="Primer Nombre" label-for="prore_applicant_name_first">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_name_first}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_applicant_name_first == null">
                                <b-form-input v-model="formData.prore_applicant_name_first" type="text" placeholder="Primer Nombre" :class="hasError('prore_applicant_name_first') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_applicant_name_first')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_applicant_name_first.required">Por favor escriba el nombre del demandante.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Segundo Nombre" label-for="prore_applicant_name_secdon">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_name_secdon}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_applicant_name_secdon == null">
                                <b-form-input v-model="formData.prore_applicant_name_secdon" type="text" placeholder="Segundo Nombre"></b-form-input>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Primer Apellido" label-for="prore_applicant_lastname_first">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_lastname_first}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_applicant_lastname_first == null">
                                <b-form-input v-model="formData.prore_applicant_lastname_first" type="text" placeholder="Primer Apellido" :class="hasError('prore_applicant_lastname_first') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_applicant_lastname_first')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_applicant_lastname_first.required">Por favor escriba el primer apellido del demandante.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Segundo Apellido" label-for="prore_applicant_lastname_second">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_lastname_second}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_applicant_lastname_second == null">
                                <b-form-input v-model="formData.prore_applicant_lastname_second" type="text" placeholder="Segundo Apellido"></b-form-input>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                          </b-row>
                          <hr>
                          <b-row>
                            <b-form-group class="col-md-6" label="Telefono/Celular" label-for="prore_applicant_phone">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_phone}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_applicant_phone == null">
                                <b-form-input v-model="formData.prore_applicant_phone" type="number" placeholder="3015456561" :class="hasError('prore_applicant_phone') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_applicant_phone')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_applicant_phone.required">Por favor escriba el número del demandante.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Correo Electronico" label-for="prore_applicant_email">
                              <div v-if="!editing && proc_id != null">
                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_email}}</span>
                              </div>
                              <div v-if="editing || proc_id == null || process[0].prore_applicant_email == null">
                                <b-form-input v-model="formData.prore_applicant_email" type="email" placeholder="Correo Electronico" :class="hasError('prore_applicant_email') ? 'is-invalid' : ''"></b-form-input>
                                <div v-if="hasError('prore_applicant_email')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_applicant_email.required">Por favor escriba el número del demandante.</div>
                                </div>
                              </div>
                              <div v-if="editing && proc_id != null">
                                <b-button @click="disableEditing"> Cancelar </b-button>
                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                              </div>
                            </b-form-group>
                          </b-row>
                        </div>
                        <h4 class="card-title">Información del Demandado:</h4>
                          <div class="new-user-info">
                            <b-row>
                              <b-form-group class="col-md-6" label="Primer Nombre" label-for="prore_defendant_name_first">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_defendant_name_first}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_defendant_name_first == null">
                                  <b-form-input v-model="formData.prore_defendant_name_first" type="text" placeholder="Primer Nombre" :class="hasError('prore_defendant_name_first') ? 'is-invalid' : ''"></b-form-input>
                                  <div v-if="hasError('prore_defendant_name_first')" class="invalid-feedback">
                                    <div class="error" v-if="!$v.formData.prore_defendant_name_first.required">Por favor escriba el primer nombre del demandado.</div>
                                  </div>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Segundo Nombre" label-for="prore_defendant_name_second">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_defendant_name_second}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_defendant_name_second == null">
                                  <b-form-input v-model="formData.prore_defendant_name_second" type="text" placeholder="Segundo Nombre"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Primer Apellido" label-for="prore_defendant_lastname_first">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_defendant_lastname_first}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_defendant_lastname_first == null">
                                  <b-form-input v-model="formData.prore_defendant_lastname_first" type="text" placeholder="Primer Apellido" :class="hasError('prore_defendant_lastname_first') ? 'is-invalid' : ''"></b-form-input>
                                  <div v-if="hasError('prore_defendant_lastname_first')" class="invalid-feedback">
                                    <div class="error" v-if="!$v.formData.prore_defendant_lastname_first.required">Por favor escriba el primer apellido del demandado.</div>
                                  </div>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Segundo Apellido" label-for="prore_defendant_lastname_second">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_defendant_lastname_second}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_defendant_lastname_second == null">
                                  <b-form-input v-model="formData.prore_defendant_lastname_second" type="text" placeholder="Segundo Apellido"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                            </b-row>
                            <hr>
                            <b-row>
                              <b-form-group class="col-md-6" label="Telefono/Celular" label-for="prore_defendant_phone">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_defendant_phone}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_defendant_phone == null">
                                  <b-form-input v-model="formData.prore_defendant_phone" type="number" placeholder="3015456561" :class="hasError('prore_defendant_phone') ? 'is-invalid' : ''"></b-form-input>
                                  <div v-if="hasError('prore_defendant_phone')" class="invalid-feedback">
                                    <div class="error" v-if="!$v.formData.prore_defendant_phone.required">Por favor escriba el número de celular del demandado.</div>
                                  </div>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Correo Electronico" label-for="prore_defendant_email">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_defendant_email}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_defendant_email == null">
                                  <b-form-input v-model="formData.prore_defendant_email" type="email" placeholder="Correo Electronico" :class="hasError('prore_defendant_email') ? 'is-invalid' : ''"></b-form-input>
                                  <div v-if="hasError('prore_defendant_email')" class="invalid-feedback">
                                    <div class="error" v-if="!$v.formData.prore_defendant_email.required">Por favor escriba el correo electr´pnico del demandado.</div>
                                  </div>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                            </b-row>
                          </div>
                          <h4 class="card-title">LLamado en Garantía:</h4>
                          <div class="new-user-info">
                            <b-row>
                              <b-form-group class="col-md-6" label="Primer Nombre" label-for="prore_warranty_name_first">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_warranty_name_first}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_warranty_name_first == null">
                                  <b-form-input v-model="formData.prore_warranty_name_first" type="text" placeholder="Primer Nombre"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Segundo Nombre" label-for="prore_warranty_name_second">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_warranty_name_second}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_warranty_name_second == null">
                                  <b-form-input v-model="formData.prore_warranty_name_second" type="text" placeholder="Segundo Nombre"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Primer Apellido" label-for="prore_warranty_lastname_first">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_warranty_lastname_first}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_warranty_lastname_first == null">
                                  <b-form-input v-model="formData.prore_warranty_lastname_first" type="text" placeholder="Primer Apellido"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Segundo Apellido" label-for="prore_warranty_lastname_second">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_warranty_lastname_second}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_warranty_lastname_second == null">
                                  <b-form-input v-model="formData.prore_warranty_lastname_second" type="text" placeholder="Segundo Apellido"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                            </b-row>
                            <hr>
                            <b-row>
                              <b-form-group class="col-md-6" label="Telefono/Celular" label-for="prore_warranty_phone">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_warranty_phone}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_warranty_phone == null">
                                  <b-form-input v-model="formData.prore_warranty_phone" type="number" placeholder="3015456561"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Correo Electronico" label-for="prore_warranty_email">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_warranty_email}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_warranty_email == null">
                                  <b-form-input v-model="formData.prore_warranty_email" type="text" placeholder="Correo Electronico"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
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
      <tab-content title="Proceso Judicial">
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
                              <b-form-group class="col-md-6" label="Tipo de Proceso" label-for="prore_typro_id">
                                <b-form-select plain v-model="formData.prore_typro_id" :options="typeProcessOptions" id="selectuserrole" :class="hasError('prore_typro_id') ? 'is-invalid' : ''">
                                  <template v-slot:first>
                                    <b-form-select-option :value="null" disabled>Seleccione un tipo de Proceso</b-form-select-option>
                                  </template>
                                </b-form-select>
                                <div v-if="hasError('prore_typro_id')" class="invalid-feedback">
                                  <div class="error" v-if="!$v.formData.prore_typro_id.required">Por favor elige una opción.</div>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Juzgado" label-for="prore_court_id">
                                <!--<div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_court_id}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_court_id == null">
                                  <b-form-input v-model="formData.prore_court_id" type="text" placeholder="Nombre del juzgado"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>-->
                                <b-form-select plain v-model="formData.prore_court_id" :options="courtsOptions" id="selectuserrole" :class="hasError('prore_court_id') ? 'is-invalid' : ''">
                                  <template v-slot:first>
                                    <b-form-select-option :value="null" disabled>Seleccione un juzgado</b-form-select-option>
                                  </template>
                                </b-form-select>
                                <b-card-text class="texto-tipo-boton text-dark" v-b-modal.modal-prevent-closing>Crear juzgado</b-card-text>
                              </b-form-group>
                              <b-modal
                                id="modal-prevent-closing"
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
                                    <b-form-input v-model="nuevo_court.telefono" type="number" placeholder="3015456561"></b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Correo del juzgado">
                                    <b-form-input v-model="nuevo_court.email" type="email" placeholder="info@example.com"></b-form-input>
                                  </b-form-group>
                                </form>
                              </b-modal>
                              <b-form-group class="col-md-6" label="Número de Radicado" label-for="exampleInputNumber1">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_num_radicado}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_num_radicado == null">
                                  <b-form-input id="exampleInputNumber1" v-model="formData.prore_num_radicado" type="number" :class="hasError('prore_num_radicado') ? 'is-invalid' : ''"></b-form-input>
                                  <div v-if="hasError('prore_num_radicado')" class="invalid-feedback">
                                    <div class="error" v-if="!$v.formData.prore_num_radicado.required">Por favor escriba el número radicado.</div>
                                  </div>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Objeto del Litigio" label-for="prore_objeto_litigio">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_objeto_litigio}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_objeto_litigio == null">
                                  <b-form-input v-model="formData.prore_objeto_litigio" type="text" placeholder="Objeto"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <template>
                                <b-form-group class="col-md-6" label="Proceso Ejecutivo" label-for="prore_proceso_ejecutivo">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_proceso_ejecutivo}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_proceso_ejecutivo == null">
                                    <b-form-input v-model="formData.prore_proceso_ejecutivo" type="text" placeholder="Proceso Ejecutivo"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Ejecuntante" label-for="prore_ejecutante">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_ejecutante}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_ejecutante == null">
                                    <b-form-input v-model="formData.prore_ejecutante" type="text" placeholder="Ejecutante"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Medida Cuatelar" label-for="prore_medida_cautelar">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_medida_cautelar}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_medida_cautelar == null">
                                    <b-form-input id="exampleInputNumber1" type="text" placeholder="Medida cautelas" v-model="formData.prore_medida_cautelar"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Pretenciones/Capital/Interes/Honorarios" label-for="prore_pretenciones_cap_int_hon">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_pretenciones_cap_int_hon}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_pretenciones_cap_int_hon == null">
                                    <b-form-input v-model="formData.prore_pretenciones_cap_int_hon" type="number" placeholder="Pretenciones/Capital/Interes/Honorarios"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                              </template>
                              <template>
                                <b-form-group class="col-md-6" label="Pretensiones Laborales" label-for="prore_pretenciones_laborales">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_pretenciones_laborales}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_pretenciones_laborales == null">
                                    <b-form-input v-model="formData.prore_pretenciones_laborales" type="number" placeholder="Pretenciones laborales"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Prestaciones Sociales" label-for="prore_prestaciones_sociales">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_prestaciones_sociales}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_prestaciones_sociales == null">
                                    <b-form-input v-model="formData.prore_prestaciones_sociales" type="number" placeholder="Prestaciones sociales"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Pretensiones por Vacaciones" label-for="prore_pretenciones_vacaciones">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_pretenciones_vacaciones}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_pretenciones_vacaciones == null">
                                    <b-form-input id="exampleInputNumber1" v-model="formData.prore_pretenciones_vacaciones" type="number"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Pretensiones por Indemnización" label-for="prore_pretenciones_indemnizacion">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_pretenciones_indemnizacion}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_pretenciones_indemnizacion == null">
                                    <b-form-input v-model="formData.prore_pretenciones_indemnizacion" type="number" placeholder="Pretensiones por Indemnización"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Pago de Seguridad Social en Salud" label-for="prore_pago_seguridad_social_sa">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_pago_seguridad_social_sa}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_pago_seguridad_social_sa == null">
                                    <b-form-input v-model="formData.prore_pago_seguridad_social_sa" type="number" placeholder="Pago de Seguridad Social en Salud"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Salarios dejados de Percibir" label-for="prore_salario_dejados_percibir">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_salario_dejados_percibir}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_salario_dejados_percibir == null">
                                    <b-form-input id="exampleInputNumber1" v-model="formData.prore_salario_dejados_percibir" type="number" placeholder="Salarios dejados de Percibir"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                                <b-form-group class="col-md-6" label="Otros" label-for="prore_otros_valores">
                                  <div v-if="!editing && proc_id != null">
                                    <span class='text' @click="enableEditing">{{process[0].prore_otros_valores}}</span>
                                  </div>
                                  <div v-if="editing || proc_id == null || process[0].prore_otros_valores == null">
                                      <b-form-input v-model="formData.prore_otros_valores" type="number" placeholder="Otros valores"></b-form-input>
                                  </div>
                                  <div v-if="editing && proc_id != null">
                                    <b-button @click="disableEditing"> Cancelar </b-button>
                                    <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                  </div>
                                </b-form-group>
                              </template>
                              <b-form-group class="col-md-6" label="Valor Lucro Cesante" label-for="prore_val_luc_cesante">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_luc_cesante}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_luc_cesante == null">
                                  <b-form-input v-model="formData.prore_val_luc_cesante" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Valor daño Emergente" label-for="prore_val_dano_emergente">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_dano_emergente}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_dano_emergente == null">
                                  <b-form-input v-model="formData.prore_val_dano_emergente" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Total Perjuicios Materiales" label-for="prore_total_perjuicios_materiales">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_total_perjuicios_materiales}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_total_perjuicios_materiales == null">
                                  <b-form-input id="prore_total_perjuicios_materiales" v-model="formData.prore_total_perjuicios_materiales" type="number"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Estimado Del Monto A Pagar Por Perjuicios Materiales" label-for="prore_estimacion_pago_perju">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_estimacion_pago_perju_materiales}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_estimacion_pago_perju_materiales == null">
                                  <b-form-input id="prore_estimacion_pago_perju_materiales" v-model="formData.prore_estimacion_pago_perju_materiales" type="number"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Valor Que Cubre La Poliza Por Perjuicios Materiales" label-for="prore_val_cubre_poliza_perjuicios_mat">
                                <div v-if="!editing && proc_id != null">
                                  <span class='number' @click="enableEditing">{{process[0].prore_val_cubre_poliza_perjuicios_mat}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_cubre_poliza_perjuicios_mat == null">
                                  <b-form-input id="prore_val_cubre_poliza_perjuicios_mat" v-model="formData.prore_val_cubre_poliza_perjuicios_mat" type="number"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Valor Daño Moral" label-for="prore_val_dano_moral">
                                <div v-if="!editing && proc_id != null">
                                  <span class='number' @click="enableEditing">{{process[0].prore_val_dano_moral}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_dano_moral == null">
                                  <b-form-input v-model="formData.prore_val_dano_moral" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Daño a la Vida ó Prejuicios Fisiologicos y Otros" label-for="prore_val_dano_vida">
                                <div v-if="!editing && proc_id != null">
                                  <span class='number' @click="enableEditing">{{process[0].prore_val_dano_vida}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_dano_vida == null">
                                  <b-form-input v-model="formData.prore_val_dano_vida" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Total Perjuicios Inmateriales" label-for="prore_total_perjuicios_inmateriales">
                                <div v-if="!editing && proc_id != null">
                                  <span class='number' @click="enableEditing">{{process[0].prore_total_perjuicios_inmateriales}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_total_perjuicios_inmateriales == null">
                                  <b-form-input v-model="formData.prore_total_perjuicios_inmateriales" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Estimado Del Monto A Pagar Por Perjuicios Inmateriales" label-for="prore_estimacion_pago_perju_inmateriales">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_estimacion_pago_perju_inmateriales}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_estimacion_pago_perju_inmateriales == null">
                                  <b-form-input id="prore_estimacion_pago_perju_inmateriales" v-model="formData.prore_estimacion_pago_perju_inmateriales" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Valor que Cube la Poliza Prejuicios Inmateriales" label-for="prore_val_cubre_poliza_perjuicios_inmat">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_cubre_poliza_perjuicios_inmat}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_cubre_poliza_perjuicios_inmat == null">
                                  <b-form-input id="prore_val_cubre_poliza_perjuicios_inmat" v-model="formData.prore_val_cubre_poliza_perjuicios_inmat" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Cuantía de las Pretensiones" label-for="prore_cuantia_pretenciones">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_cuantia_pretenciones}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_cuantia_pretenciones == null">
                                  <b-form-input id="prore_cuantia_pretenciones" v-model="formData.prore_cuantia_pretenciones" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Riesgo Nif" label-for="prore_riesgo_niif">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_riesgo_niif}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_riesgo_niif == null">
                                  <b-form-input id="prore_riesgo_niif" v-model="formData.prore_riesgo_niif" type="text" placeholder="Riesgo Niif"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Valor a Provisionar" label-for="prore_valor_provisionar">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_valor_provisionar}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_valor_provisionar == null">
                                  <b-form-input id="prore_valor_provisionar" v-model="formData.prore_valor_provisionar" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Aseguradora" label-for="prore_aseguradora_id">
                                <b-form-select plain v-model="formData.prore_aseguradora_id" :options="aseguradorasOptions" id="prore_aseguradora_id" :class="hasError('prore_applicant_lastname_first') ? 'is-invalid' : ''">
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
                                  <span class='text' @click="enableEditing">{{process[0].prore_num_poliza}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_num_poliza == null">
                                  <b-form-input id="prore_num_poliza" v-model="formData.prore_num_poliza" type="number" placeholder="Número póliza"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Monto Total Asegurado" label-for="prore_val_total_asegurado">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_total_asegurado}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_total_asegurado == null">
                                  <b-form-input id="prore_val_total_asegurado" v-model="formData.prore_val_total_asegurado" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Si La Poliza Fue Afectada Por Que Valor" label-for="prore_val_afectado_poliza">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_afectado_poliza}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_afectado_poliza == null">
                                  <b-form-input id="prore_val_afectado_poliza" v-model="formData.prore_val_afectado_poliza" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Deducible" label-for="prore_deducible">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_deducible}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_deducible == null">
                                  <b-form-input id="prore_deducible" v-model="formData.prore_deducible" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Cobertura Actual Poliza" label-for="prore_val_cobertura_poliza">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_cobertura_poliza}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_cobertura_poliza == null">
                                  <b-form-input id="prore_val_cobertura_poliza" v-model="formData.prore_val_cobertura_poliza" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Provisiones Constituidas" label-for="prore_val_provisiones_constituidas">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_provisiones_constituidas}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_provisiones_constituidas == null">
                                  <b-form-input id="prore_val_provisiones_constituidas" v-model="formData.prore_val_provisiones_constituidas" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Prescritas" label-for="prore_prescritas">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_prescritas}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_prescritas == null">
                                  <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="formData.prore_prescritas" value="1">Prescritas</b-form-checkbox>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Fecha Sentencia Primera Instancia" label-for="prore_fec_sentencia_primera_instancia">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_fec_sentencia_primera_instancia}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_fec_sentencia_primera_instancia == null">
                                  <b-form-input id="prore_fec_sentencia_primera_instancia" v-model="formData.prore_fec_sentencia_primera_instancia" type="date"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Fecha de Consulta" label-for="prore_fec_consulta">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_fec_consulta}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_fec_consulta == null">
                                  <b-form-input id="prore_fec_consulta" v-model="formData.prore_fec_consulta" type="date"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Fecha de Sentencia Segunda Instancia" label-for="prore_fec_sentencia_segunda_instancia">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_fec_sentencia_segunda_instancia}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_fec_sentencia_segunda_instancia == null">
                                  <b-form-input id="prore_fec_sentencia_segunda_instancia" v-model="formData.prore_fec_sentencia_segunda_instancia" type="date"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Fecha de Casación" label-for="prore_fec_casacion">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_fec_casacion}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_fec_casacion == null">
                                  <b-form-input id="prore_fec_casacion" v-model="formData.prore_fec_casacion" type="date"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Sentencia Final" label-for="prore_sentencia_final">
                                <b-form-select plain v-model="formData.prore_sentencia_final" id="prore_sentencia_final">
                                  <template v-slot:first>
                                    <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                    <b-form-select-option :value="'Ninguna'">Ninguna</b-form-select-option>
                                    <b-form-select-option :value="'A Favor'" >A Favor</b-form-select-option>
                                    <b-form-select-option :value="'En Contra'">En Contra</b-form-select-option>
                                  </template>
                                </b-form-select>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Valor De La Sentencia Final" label-for="prore_val_sentencia_final">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_val_sentencia_final}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_val_sentencia_final == null">
                                  <b-form-input id="prore_val_sentencia_final" v-model="formData.prore_val_sentencia_final" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Discriminar Valor De La Condena" label-for="prore_discriminar_val_condena">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_discriminar_val_condena}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_discriminar_val_condena == null">
                                  <b-form-input id="prore_discriminar_val_condena" v-model="formData.prore_discriminar_val_condena" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Costas De La Sentencia" label-for="prore_costas_sentencia">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_costas_sentencia}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_costas_sentencia == null">
                                  <b-form-input id="prore_costas_sentencia" v-model="formData.prore_costas_sentencia" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <!--<b-form-group class="col-md-6" label="Sentencia Final" label-for="usr_lastname_first">
                                  <template v-for="(item,index) in state">
                                  <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                  </template>
                              </b-form-group>-->
                              <b-form-group class="col-md-6" label="Costas Procesales Primera Instancia" label-for="prore_costas_procesales_primera_instancia">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_costas_procesales_primera_instancia}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_costas_procesales_primera_instancia == null">
                                  <b-form-input id="prore_costas_procesales_primera_instancia" v-model="formData.prore_costas_procesales_primera_instancia" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Costas Procesales Segunda Instancia" label-for="prore_costas_procesales_segunda_instancia">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_costas_procesales_segunda_instancia}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_costas_procesales_segunda_instancia == null">
                                  <b-form-input id="prore_costas_procesales_segunda_instancia" v-model="formData.prore_costas_procesales_segunda_instancia" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Total Costas" label-for="prore_total_costas">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_total_costas}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_total_costas == null">
                                  <b-form-input id="prore_total_costas" v-model="formData.prore_total_costas" type="number" placeholder="$"></b-form-input>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
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
                              <b-form-group class="col-md-6" label="Link de sharepoint" label-for="prore_link_documentacion">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_sinies_description}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_sinies_description == null">
                                  <b-form-textarea v-model="formData.prore_sinies_description" type="text" placeholder="Descripción"></b-form-textarea>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <!--<b-form-group class="col-md-6" label="Descripción de la Actuación" label-for="prore_sinies_description">
                                <div v-if="!editing && proc_id != null">
                                  <span class='text' @click="enableEditing">{{process[0].prore_sinies_description}}</span>
                                </div>
                                <div v-if="editing || proc_id == null || process[0].prore_sinies_description == null">
                                  <b-form-textarea v-model="formData.prore_sinies_description" type="text" placeholder="Descripción"></b-form-textarea>
                                </div>
                                <div v-if="editing && proc_id != null">
                                  <b-button @click="disableEditing"> Cancelar </b-button>
                                  <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                </div>
                              </b-form-group>
                              <b-form-group class="col-md-6" label="Seleccione Archivos del Proceso" label-for="prore_sinies_description">
                                <div>
                                  <b-form-file
                                    v-model="file1"
                                    :state="Boolean(file1)"
                                    placeholder="Eliga un archivo"
                                    drop-placeholder="Drop file here..."
                                  ></b-form-file>
                                  <div class="mt-3">Archivo Seleccionado: {{ file1 ? file1.name : '' }}</div>
                                </div>
                              </b-form-group>-->
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
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import { FormWizard, TabContent, ValidationHelper } from 'vue-step-wizard'
// import { required } from 'vuelidate/lib/validators'
// import { ValidationObserver } from 'vee-validate'
// import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'vue-step-wizard/dist/vue-step-wizard.css'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  name: 'AddUser',
  components: {
    FormWizard, TabContent
  },
  mixins: [ ValidationHelper ],
  props: ['formType', 'email', 'password'],
  mounted () {
    xray.index()
    this.fetchOptionsClinicas()
    this.fetchOptionsAbogados()
    this.fetchEstadosProceso()
    this.fetchAseguradoras()
    this.fetchEspecialidades()
    this.fetchTypeProcess()
    this.fetchCity()
    this.fetchCourts()
    this.getProcess()
  },
  data () {
    return {
      year: null,
      formData: {
        prore_fec_ingreso: '',
        prore_responsable: '',
        prore_colaborador_ips: '',
        prore_num_proceso: '',
        prore_year_sinister: '',
        prore_fec_sinister: '',
        prore_year_notify: '',
        prore_diffence_year: '',
        prore_pro_id: '',
        prore_propse_id: '',
        prore_defendant_clin: '',
        prore_defendant_name_first: '',
        prore_defendant_name_second: '',
        prore_defendant_lastname_first: '',
        prore_defendant_lastname_second: '',
        prore_defendant_phone: '',
        prore_defendant_email: '',
        prore_warranty_name_first: '',
        prore_warranty_name_second: '',
        prore_warranty_lastname_first: '',
        prore_warranty_lastname_second: '',
        prore_warranty_phone: '',
        prore_warranty_email: '',
        prore_court_id: '',
        prore_typro_id: '',
        prore_status_process_id: '',
        prore_ase_id: '',
        prore_city_id: '',
        prore_pac_name_first: '',
        prore_pac_name_second: '',
        prore_pac_lastname_first: '',
        prore_pac_lastname_second: '',
        prore_pac_identification_type: '',
        prore_pac_identification_num: '',
        prore_pac_age: '',
        prore_pac_gender: '',
        prore_pac_day_of_birth: '',
        prore_pac_email: '',
        prore_pac_city: '',
        prore_pac_department: '',
        prore_pac_city_id: '',
        prore_pac_department_id: '',
        prore_pac_neighborhood: '',
        prore_pac_comuna: '',
        prore_pac_address: '',
        prore_pac_cell_phone: '',
        prore_pac_phone: '',
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
        prore_pab_name: '',
        prore_specialty_name: '',
        prore_num_radicado: '',
        prore_pathology: '',
        prore_risk: '',
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
        prore_riesgo_niif: '',
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
        prore_applicant_name_first: '',
        prore_applicant_name_secdon: '',
        prore_applicant_lastname_first: '',
        prore_applicant_lastname_second: '',
        prore_applicant_phone: '',
        prore_applicant_email: '',
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
        prore_link_documentacion: ''
      },
      proc: {},
      process: [],
      procTemp: {},
      editing: false,
      clinicaOptions: [],
      etapaOptions: [],
      abogadoOptions: [],
      proc_id: this.$route.params.id,
      especialidadesOptions: {},
      typeProcessOptions: {},
      courtsOptions: {},
      nuevo_court: {
        name: '',
        telefono: '',
        email: ''
      },
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 }
      ],
      aseguradorasOptions: {},
      citiesOptions: {},
      statusProcessOptions: {},
      stateActive: {
        genero: 'active',
        number: 'two',
        colorDisabled: 'five',
        color: 'danger'
      },
      state: [
        {
          name: 'genero',
          label: 'Masculino',
          value: 2,
          disabled: false
        },
        {
          name: 'genero',
          label: 'Femenino',
          value: 1,
          disabled: false
        }
      ],
      users: []
    }
  },
  computed: {
    fullNameUser: function () {
      return this.user.usr_name_first + ' ' + this.user.usr_lastname_first
    },
    years () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 1995 }, (value, index) => 2000 + index)
    }
  },
  methods: {
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
    fetchCity () {
      axios.get('/cities/fetch').then(response => {
        this.citiesOptions = response.data.cities
      })
    },
    fetchCourts () {
      axios.get('/courts/fetch').then(response => {
        this.courtsOptions = response.data.courts
      })
      console.log('PIlle ps ')
      console.log(this.courtsOptions)
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
      const toke = localStorage.getItem('access_token')
      axios.post('/process/store', this.formData, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal('Proceso agregado correctamente')
          this.$router.push({ name: 'process.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    getProcess () {
      if (this.proc_id != null) {
        axios.get('/process/edit/' + this.proc_id).then(response => {
          this.process = response.data.process
          this.proc = this.process[0]
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
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit () {
      const toke = localStorage.getItem('access_token')
      axios.post('/courts/store', this.nuevo_court, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
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
    }
  }
}
</script>
