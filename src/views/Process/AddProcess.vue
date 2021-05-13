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
                                                                <span class='text' @click="enableEditing">{{proc.prore_fec_ingreso}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_fec_ingreso == null">
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_ingreso" type="date" value="2019-12-18"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Clinica/IPS:" label-for="selectuserrole">
                                                            <b-form-select plain v-model="proc.prore_defendant_clin" :options="clinicaOptions" @search="fetchOptionsClinicas" id="selectuserrole">
                                                                <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Año del Siniestro" label-for="exampleInputNumber1">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_year_sinister}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_year_sinister == null">
                                                                <b-form-input id="exampleInputNumber1" v-model="proc.prore_year_sinister" type="number" value="2356"></b-form-input>
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
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_sinister" type="date" value="2019-12-18"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Año de Notificación" label-for="prore_year_notify">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_year_notify}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_year_notify == null">
                                                                <b-form-input id="exampleInputNumber1" v-model="proc.prore_year_notify" type="number" value="2356"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA DE NOTIFICACION PREJUDICIAL" label-for="prore_fec_noti_preju">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_fec_noti_preju}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_fec_noti_preju == null">
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_noti_preju" type="date" value="2019-12-18"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA DE LA AUDIENCIA DE CONCILIACIÓN PREJUDICIAL" label-for="prore_fec_audi_conci_preju">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_fec_audi_conci_preju}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_fec_audi_conci_preju == null">
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_audi_conci_preju" type="date" value="2019-12-18"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA AVISO DEL  SINIESTRO" label-for="prore_fec_sinies_aviso">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_fec_sinies_aviso}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_fec_sinies_aviso == null">
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_sinies_aviso" type="date" value="2019-12-18"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="DESCRIPCIÓN  DEL SINIESTRO" label-for="prore_sinies_description">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_sinies_description}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_sinies_description == null">
                                                                <b-form-textarea v-model="proc.prore_sinies_description" type="text" placeholder="Descripción"></b-form-textarea>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA DE RECIBIDO DE NOTIFICACION IPS" label-for="prore_fec_recibo_notify">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_fec_recibo_notify}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_fec_recibo_notify == null">
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_recibo_notify" type="date" value="2019-12-18"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="COLABORADOR DE IPS QUE RECIBE NOTIFICACION:" label-for="prore_fec_recibo_notify">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_cola_name_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_fec_ingreso == null">
                                                                <b-form-input type="text" v-model="proc.prore_cola_name_first" placeholder="Primer Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Fecha de Inggreso a Juridico" label-for="prore_fec_ingreso_jur">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_fec_ingreso_jur}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_fec_ingreso_jur == null">
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_ingreso_jur" type="date" value="2019-12-18"></b-form-input>
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
                                                                <b-form-input id="exampleInputdate" v-model="proc.prore_fec_ingreso_cli" type="date" value="2019-12-18"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Ciudad:" label-for="selectuserrole">
                                                            <b-form-select plain v-model="proc.prore_pac_city_id" :options="city" id="selectuserrole">
                                                                <template v-slot:first>
                                                                    <b-form-select-option :value="null">Seleccione una Ciudad</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Nombre Paciente:" label-for="prore_pac_name_first">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_pac_name_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_pac_name_first == null">
                                                                <b-form-input v-model="proc.prore_pac_name_first" type="text" placeholder="Primer Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre Paciente:" label-for="prore_pac_name_secdon">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_pac_name_second}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_pac_name_second == null">
                                                                <b-form-input v-model="proc.prore_pac_name_second" type="text" placeholder="Segundo Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio Paciente:" label-for="prore_pac_lastname_first">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_pac_lastname_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_pac_lastname_first == null">
                                                                <b-form-input v-model="proc.prore_pac_lastname_first" type="text" placeholder="Primer Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio Paciente:" label-for="prore_pac_lastname_second">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_pac_lastname_second}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_pac_lastname_second == null">
                                                                <b-form-input v-model="proc.prore_pac_lastname_second" type="text" placeholder="Segundo Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="GENERO DEL PACIENTE:" label-for="usr_lastname_first">
                                                            <template v-for="(item,index) in state">
                                                            <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                                            </template>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="EDAD DEL PACIENTE" label-for="prore_pac_age">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_pac_age}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_pac_age == null">
                                                                <b-form-input v-model="proc.prore_pac_age" id="exampleInputNumber1" type="number" value="30"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Especialidad:" label-for="selectuserrole">
                                                            <b-form-select plain v-model="proc.prore_prospe_id" :options="roles" id="selectuserrole">
                                                                <template v-slot:first>
                                                                    <b-form-select-option :value="null">Seleccione una especialidad</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Asignar Abogada/o:" label-for="prore_pro_identificacion">
                                                            <b-form-select plain v-model="proc.prore_pro_identificacion" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
                                                                <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
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
                                                        <b-form-group class="col-md-6" label="Primer Nombre:" label-for="prore_applicant_name_first">
                                                            <div v-if="!editing && proc_id != null && process[0].prore_applicant_name_first != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_name_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id != null">
                                                                <b-form-input v-model="procTemp.prore_applicant_name_first" type="text" placeholder="Primer TempNombre"></b-form-input>
                                                            </div>
                                                            <div v-else>
                                                                <b-form-input v-model="proc.prore_applicant_name_first" type="text" placeholder="Primer Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="prore_applicant_name_secdon">
                                                            <div v-if="!editing && proc_id != null && process[0].prore_applicant_name_secdon != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_name_secdon}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id != null">
                                                                <b-form-input v-model="procTemp.prore_applicant_name_secdon" type="text" placeholder="Segundo Nombre"></b-form-input>
                                                            </div>
                                                            <div v-else>
                                                                <b-form-input v-model="proc.prore_applicant_name_secdon" type="text" placeholder="Segundo Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio:" label-for="prore_applicant_lastname_first">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_lastname_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_applicant_lastname_first == null">
                                                                <b-form-input v-model="proc.prore_applicant_lastname_first" type="text" placeholder="Primer Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio:" label-for="prore_applicant_lastname_second">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_lastname_second}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_applicant_lastname_second == null">
                                                                <b-form-input v-model="proc.prore_applicant_lastname_second" type="text" placeholder="Segundo Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                    </b-row>
                                                    <hr>
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Telefono/Celular:" label-for="prore_applicant_phone">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_phone}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_applicant_phone == null">
                                                                <b-form-input v-model="proc.prore_applicant_phone" type="number" placeholder="301545656"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Correo Electronico:" label-for="prore_applicant_email">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_applicant_email}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_applicant_email == null">
                                                                <b-form-input v-model="proc.prore_applicant_email" type="text" placeholder="Correo Electronico"></b-form-input>
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
                                                        <b-form-group class="col-md-6" label="Primer Nombre:" label-for="prore_defendant_name_first">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_defendant_name_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_defendant_name_first == null">
                                                                <b-form-input v-model="proc.prore_defendant_name_first" type="text" placeholder="Primer Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="prore_defendant_name_second">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_defendant_name_second}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_defendant_name_second == null">
                                                                <b-form-input v-model="proc.prore_defendant_name_second" type="text" placeholder="Segundo Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio:" label-for="prore_defendant_lastname_first">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_defendant_lastname_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_defendant_lastname_first == null">
                                                                <b-form-input v-model="proc.prore_defendant_lastname_first" type="text" placeholder="Primer Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio:" label-for="prore_defendant_lastname_second">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_defendant_lastname_second}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_defendant_lastname_second == null">
                                                                <b-form-input v-model="proc.prore_defendant_lastname_second" type="text" placeholder="Segundo Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                    </b-row>
                                                    <hr>
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Telefono/Celular:" label-for="prore_defendant_phone">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_defendant_phone}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_defendant_phone == null">
                                                                <b-form-input v-model="proc.prore_defendant_phone" type="number" placeholder="301545656"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Correo Electronico:" label-for="prore_defendant_email">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_defendant_email}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_defendant_email == null">
                                                                <b-form-input v-model="proc.prore_defendant_email" type="text" placeholder="Correo Electronico"></b-form-input>
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
                                                        <b-form-group class="col-md-6" label="Primer Nombre:" label-for="prore_warranty_name_first">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_warranty_name_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_warranty_name_first == null">
                                                                <b-form-input v-model="proc.prore_warranty_name_first" type="text" placeholder="Primer Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="prore_warranty_name_second">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_warranty_name_second}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_warranty_name_second == null">
                                                                <b-form-input v-model="proc.prore_warranty_name_second" type="text" placeholder="Segundo Nombre"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio:" label-for="prore_warranty_lastname_first">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_warranty_lastname_first}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_warranty_lastname_first == null">
                                                                <b-form-input v-model="proc.prore_warranty_lastname_first" type="text" placeholder="Primer Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio:" label-for="prore_warranty_lastname_second">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_warranty_lastname_second}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_warranty_lastname_second == null">
                                                                <b-form-input v-model="proc.prore_warranty_lastname_second" type="text" placeholder="Segundo Apelldio"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                    </b-row>
                                                    <hr>
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Telefono/Celular:" label-for="prore_warranty_phone">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_warranty_phone}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_warranty_phone == null">
                                                                <b-form-input v-model="proc.prore_warranty_phone" type="number" placeholder="301545656"></b-form-input>
                                                            </div>
                                                            <div v-if="editing && proc_id != null">
                                                                <b-button @click="disableEditing"> Cancelar </b-button>
                                                                <b-button variant="primary" @click="saveEdit"> Guardar </b-button>
                                                            </div>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Correo Electronico:" label-for="prore_warranty_email">
                                                            <div v-if="!editing && proc_id != null">
                                                                <span class='text' @click="enableEditing">{{process[0].prore_warranty_email}}</span>
                                                            </div>
                                                            <div v-if="editing || proc_id == null || process[0].prore_warranty_email == null">
                                                                <b-form-input v-model="proc.prore_warranty_email" type="text" placeholder="Correo Electronico"></b-form-input>
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
                                                    <b-form-group class="col-md-6" label="Tipo de Proceso:" label-for="prore_typro_id">
                                                        <b-form-select plain v-model="proc.prore_typro_id" :options="roles" id="selectuserrole">
                                                            <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione un tipo de Proceso</b-form-select-option>
                                                            </template>
                                                        </b-form-select>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Juzgado:" label-for="prore_court_id">
                                                        <ValidationProvider name="Juzgado" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.prore_court_id" type="text" placeholder="Segundo Nombre"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Telefono/Celular Juzgado:" label-for="uname">
                                                        <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_username" type="number" placeholder="301545656"></b-form-input>
                                                        <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                        </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Correo Electronico Juzgado:" label-for="uname">
                                                        <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_email" type="text" placeholder="Correo Electronico"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Número de Radicado" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="ej: 3154545"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Objeto del Litigio:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Objeto"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <template>
                                                        <b-form-group class="col-md-6" label="Proceso Ejecutivo:" label-for="prore_proceso_ejecu">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.prore_proceso_ejecu" type="text" placeholder="Proceso Ejecutivo"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Ejecuntante:" label-for="prore_ejecutante">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.prore_ejecutante" type="text" placeholder="Segundo Nombre"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Medida Cuatelar" label-for="exampleInputNumber1">
                                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Prestaciones/Capital/Interes/Honorarios:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                    </template>
                                                    <template>
                                                        <b-form-group class="col-md-6" label="Pretensiones Laborales:" label-for="prore_prestacion_labo">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.prore_prestacion_labo" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Prestaciones Sociales:" label-for="prore_prestacion_soc">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.prore_prestacion_soc" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Pretensiones por Vacaciones" label-for="prore_prestacion_vac">
                                                            <b-form-input id="exampleInputNumber1" v-model="proc.prore_prestacion_vac" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Pretensiones por Indemnización:" label-for="prore_prestacion_inde">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.prore_prestacion_inde" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Pago de Seguridad Social en Salud:" label-for="prore_pag_seg_soc_salud">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.prore_pag_seg_soc_salud" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Salarios dejados de Percibir" label-for="prore_salario_lost">
                                                            <b-form-input id="exampleInputNumber1" v-model="proc.prore_salario_lost" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Otros:" label-for="prore_otros_vals">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.prore_otros_vals" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                    </template>
                                                    <b-form-group class="col-md-6" label="Val Lucro Cesante:" label-for="prore_val_luc_cesa">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.prore_val_luc_cesa" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val daño Emergente:" label-for="prore_val_dano_emerge">
                                                        <b-form-input v-model="proc.prore_val_dano_emerge" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Total Prejuicios Materiales" label-for="prore_total_prej_mate">
                                                        <b-form-input id="exampleInputNumber1" v-model="proc.prore_total_prej_mate" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Valor daño Moral:" label-for="prore_val_dano_moral">
                                                        <b-form-input v-model="proc.prore_val_dano_moral" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Daño a la Vida ó Prejuicios Fisiologicos y Otros:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Total Prejuicios Inmateriales" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Estimación del monto a pagar Prejuicios Inmateriales:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val que Cube la Poliza Prejuicios Inmateriales:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Cuenta de las Prentensiones" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Riesgo Nif:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Valor a Provisionar" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Aseguradora:" label-for="selectuserrole">
                                                        <b-form-select plain v-model="proc.usr_role_id" :options="city" id="selectuserrole">
                                                            <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione una Aseguradora</b-form-select-option>
                                                            </template>
                                                        </b-form-select>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Número de Poliza:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Monto Total Asegurado:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val Afectación de Poliza:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Deducible" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Cobertura Actual Poliza:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Provisiones Constituidas:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Prescritas" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha Sentencia Primera Instancia" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha de Consulta" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha Sentencia Segunda Instancia" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha de Casación" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Sentencia Final:" label-for="usr_lastname_first">
                                                        <template v-for="(item,index) in state">
                                                        <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                                        </template>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val Sentencia Final:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Disicriminar Valor de la Condena:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Costos de la Sentencia:" label-for="usr_name_first">
                                                    <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_name_first" type="numner" placeholder="Primer Nombre"></b-form-input>
                                                        <div class="invalid-feedback">
                                                        <span>{{ errors[0] }}</span>
                                                        </div>
                                                    </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Costos Procesales Primera Instancia:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Costos Procesales Segunda Instancia:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Total Costos:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
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
                                                    <b-form-group class="col-md-6" label="Descripción de la Actuación" label-for="prore_sinies_description">
                                                        <div v-if="!editing && proc_id != null">
                                                            <span class='text' @click="enableEditing">{{process[0].prore_sinies_description}}</span>
                                                        </div>
                                                        <div v-if="editing || proc_id == null || process[0].prore_sinies_description == null">
                                                            <b-form-textarea v-model="proc.prore_sinies_description" type="text" placeholder="Descripción"></b-form-textarea>
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
    </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import { FormWizard, TabContent } from 'vue-step-wizard'
import 'vue-step-wizard/dist/vue-step-wizard.css'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  name: 'AddUser',
  components: {
    FormWizard, TabContent
  },
  props: ['formType', 'email', 'password'],
  mounted () {
    xray.index()
    this.fetchOptionsClinicas()
    this.fetchOptionsAbogados()
    this.getProcess()
  },
  data () {
    return {
      proc: {},
      process: [],
      procTemp: {},
      editing: false,
      clinicaOptions: [],
      abogadoOptions: [],
      proc_id: this.$route.params.id,
      roles: [
        { text: 'ANESTESIOLOGÍA', value: 1 },
        { text: 'CARDIOLOGÍA', value: 2 },
        { text: 'CIRUGÍA DE CABEZA Y CUELLO', value: 3 },
        { text: 'CIRUGIA GENERAL', value: 4 },
        { text: 'CIRUGÍA MAXILOFACIAL', value: 5 },
        { text: 'CIRUGÍA PEDIÁTRICA', value: 6 },
        { text: 'CIRUGÍA PLASTICA', value: 7 },
        { text: 'CIRUGÍA TORÁCICA', value: 8 },
        { text: 'CIRUGÍA VASCULAR', value: 9 }
      ],
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 }
      ],
      city: [
        { value: 1, text: 'Armenia' },
        { value: 2, text: 'Barranquilla' },
        { value: 3, text: 'Bello' },
        { value: 4, text: 'B/tura' },
        { value: 5, text: 'Cali' },
        { value: 6, text: 'Cartagena' },
        { value: 7, text: 'Ibagué' },
        { value: 8, text: 'Itagüí' },
        { value: 9, text: 'Manizales' },
        { value: 10, text: 'Medellín' },
        { value: 11, text: 'Pereira' },
        { value: 12, text: 'Popayán' },
        { value: 13, text: 'Santa Martha' },
        { value: 14, text: 'Bogotá' }
      ],
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
    fullName: function () {
      return this.user.usr_name_first + ' ' + this.user.usr_lastname_first
    }
  },
  methods: {
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
      console.log('localStorage.getItem: ' + localStorage.getItem('access_token'))
      const toke = localStorage.getItem('access_token')
      axios.post('/process/store', this.proc, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        console.log('Duque hptaaaa!! ' + res.data)
        if (res.data.status_code === 200) {
          Vue.swal('Proceso agregado correctamente')
          this.$router.push({ name: 'process.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    getProcess () {
      console.log('this.proc_id: ' + this.proc_id)
      if (this.proc_id != null) {
        axios.get('/process/edit/' + this.proc_id).then(response => {
          this.process = response.data.process
          this.proc = this.process[0]
          console.log('processshptaaarrrrrrr: ' + this.process)
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
      console.log('antes prore_fec_ingreso proc process: ' + this.proc.prore_fec_ingreso + ' - ' + this.process[0].prore_fec_ingreso)
      console.log('despues prore_fec_ingreso proc process: ' + this.proc.prore_fec_ingreso + ' - ' + this.process[0].prore_fec_ingreso)
    },
    fetchOptionsClinicas () {
      axios.get('/clinicas').then(response => {
        console.log('response.data.clinicas: ' + response.data.clinicas)
        this.clinicaOptions = response.data.clinicas
      })
      console.log('this.clinicaOptions: ' + this.clinicaOptions)
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetch').then(response => {
        console.log('response.data.professionals: ' + response.data.professionals)
        this.abogadoOptions = response.data.professionals
      })
      console.log('this.abogadoOptions: ' + this.abogadoOptions)
    }
  }
}
</script>
