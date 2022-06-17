<template>
  <div>
    <div id="show-overlay"></div>
    <Loader />
    <div class="wrapper">
      <!-- Sidebar  -->
      <SideBarStyle1
        :items="verticalMenu"
        :horizontal="horizontal"
        :logo="logo"
        @toggle="sidebarMini"
      />
      <div
        id="content-page"
        class="content-page"
        :class="horizontal ? 'ml-0' : ''"
      >
        <!-- TOP Nav Bar -->
        <NavBarStyle1
          title="Dashboard"
          @toggle="sidebarMini"
          :logo="logo"
          :horizontal="horizontal"
          :items="horizontalMenu"
        >
          <template slot="responsiveRight">
            <ul class="navbar-nav ml-auto navbar-list">
              <!--<li class="nav-item">
                <a class="search-toggle iq-waves-effect language-title" href="#"><img :src="selectedLang.image" alt="img-flaf" class="img-fluid mr-1" style="height: 16px; width: 16px;" /> {{ selectedLang.title }} <i class="ri-arrow-down-s-line"></i></a>
                <div class="iq-sub-dropdown">
                  <a class="iq-sub-card" href="javascript:void(0)" v-for="(lang, i) in langsOptions" :key="`Lang${i}`" @click="langChange(lang)">
                    <img :src="lang.image" alt="img-flaf" class="img-fluid mr-2" />{{ lang.title }}
                  </a>
                </div>
              </li>-->
              <!--<li class="nav-item iq-full-screen">
                <a href="#" class="iq-waves-effect" id="btnFullscreen"><i class="ri-fullscreen-line"></i></a>
              </li>-->
              <li class="nav-item">
                <a href="#" class="search-toggle iq-waves-effect">
                  <i class="ri-notification-3-fill"></i>
                  <span class="bg-danger dots"></span>
                </a>
                <div class="iq-sub-dropdown">
                  <div class="iq-card shadow-none m-0">
                    <div class="iq-card-body p-0">
                      <div class="bg-primary p-3">
                        <h5 class="mb-0 text-white">
                          {{ $t('nav.allNotifications')
                          }}<small class="badge badge-light float-right pt-1">{{
                            cantidadNotificaciones
                          }}</small>
                        </h5>
                      </div>
                      <a
                        v-for="(notification, index) in notificationes"
                        :key="index"
                        href="#"
                        class="iq-sub-card"
                        :style="
                          !notification.not_leida
                            ? 'background-color: #f1f2f1;'
                            : ''
                        "
                        @click="readNotification(notification)"
                      >
                        <div class="media align-items-center">
                          <div class="media-body ml-3">
                            <h6 class="mb-0">
                              {{
                                notification.not_titulo.substring(0, 30) + '...'
                              }}
                            </h6>
                            <small class="float-right font-size-12">{{
                              formatDate(notification.created_at)
                            }}</small>
                            <p class="mb-0">
                              {{
                                notification.not_descripcion.length > 40
                                  ? notification.not_descripcion.substring(
                                      0,
                                      40
                                    ) + '...'
                                  : notification.not_descripcion
                              }}
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
              <li class="nav-item">
                <!--<a href="#" class="search-toggle iq-waves-effect">
                  <i class="ri-mail-open-fill"></i>
                  <span class="bg-primary count-mail"></span>
                </a>
                <div class="iq-sub-dropdown">
                  <div class="iq-card shadow-none m-0">
                    <div class="iq-card-body p-0 ">
                      <div class="bg-primary p-3">
                        <h5 class="mb-0 text-white">{{ $t('nav.allMessages') }}<small class="badge  badge-light float-right pt-1">5</small></h5>
                      </div>
                      <a href="#" class="iq-sub-card" v-for="(item,index) in message" :key="index">
                        <div class="media align-items-center">
                          <div class="">
                            <img class="avatar-40 rounded" :src="item.image" alt="img">
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ item.name }}</h6>
                            <small class="float-left font-size-12">{{ item.date }}</small>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>-->
              </li>
            </ul>
          </template>
          <template slot="right">
            <ul class="navbar-list">
              <li>
                <a
                  href="#"
                  class="search-toggle iq-waves-effect d-flex align-items-center"
                >
                  <img
                    :src="userProfile"
                    class="img-fluid rounded mr-3"
                    alt="user"
                  />
                  <div class="caption">
                    <h6 class="mb-0 line-height">
                      {{ userLogged.usr_name_first }}
                      {{ userLogged.usr_lastname_first }}
                    </h6>
                    <span class="font-size-12"
                      >{{ /*$t('nav.user.available')*/ }} Disponible</span
                    >
                  </div>
                </a>
                <div class="iq-sub-dropdown iq-dropdown">
                  <div class="iq-card shadow-none m-0">
                    <div class="iq-card-body p-0">
                      <div class="bg-primary p-3">
                        <h5 class="mb-0 text-white line-height">
                          Hola {{ userLogged.usr_name_first }}
                          {{ userLogged.usr_lastname_first }}
                        </h5>
                        <span class="text-white font-size-12"
                          >{{ /*$t('nav.user.available')*/ }}Disponible</span
                        >
                      </div>
                      <!--<a href="#" class="iq-sub-card iq-bg-primary-hover">
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-primary">
                            <i class="ri-file-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ $t('nav.user.profileTitle') }}</h6>
                            <p class="mb-0 font-size-12">{{ $t('nav.user.profileSub') }}</p>
                          </div>
                        </div>
                      </a>
                      <a href="#" class="iq-sub-card iq-bg-primary-success-hover">
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-success">
                            <i class="ri-profile-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ $t('nav.user.profileEditTitle') }}</h6>
                            <p class="mb-0 font-size-12">{{ $t('nav.user.profileEditSub') }}</p>
                          </div>
                        </div>
                      </a>
                      <a href="#" class="iq-sub-card iq-bg-primary-danger-hover">
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-danger">
                            <i class="ri-account-box-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ $t('nav.user.accountSettingTitle') }}</h6>
                            <p class="mb-0 font-size-12">{{ $t('nav.user.accountSettingSub') }}</p>
                          </div>
                        </div>
                      </a>-->
                      <a
                        href="#"
                        v-b-modal.modal-prevent-closing
                        class="iq-sub-card iq-bg-primary-secondary-hover"
                      >
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-secondary">
                            <i class="ri-lock-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0">
                              {{ /*$t('nav.user.privacySettingTitle')*/ }}
                              Cambiar contraseña
                            </h6>
                            <!--<p class="mb-0 font-size-12">{{ $t('nav.user.privacySettingSub')}}</p>-->
                          </div>
                        </div>
                      </a>
                      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                        <b-modal
                          id="modal-prevent-closing"
                          ref="modal"
                          title="Cambiar contraseña"
                          @ok="handleOk"
                        >
                          <!--<form ref="form" @submit.stop.prevent="handleSubmit">-->
                          <form ref="form" @submit.stop.prevent="handleSubmit">
                            <ValidationProvider
                              name="Password"
                              rules="confirmed:repeat_password|required"
                              v-slot="{ errors }"
                            >
                              <b-form-group
                                class="col-md-12"
                                label="Nueva contraseña"
                                label-for="pass"
                              >
                                <b-form-input
                                  required
                                  v-model="newPassword"
                                  type="password"
                                  placeholder="Contraseña"
                                  :class="
                                    errors.length > 0 ? ' is-invalid' : ''
                                  "
                                ></b-form-input>
                                <div class="invalid-feedback">
                                  <span>{{ errors[0] }}</span>
                                </div>
                              </b-form-group>
                            </ValidationProvider>
                            <ValidationProvider
                              vid="repeat_password"
                              name="Repetir contraseña"
                              rules="confirmed:repeat_password|required"
                              v-slot="{ errors }"
                            >
                              <b-form-group
                                class="col-md-12"
                                label="Repetir contraseña"
                                label-for="rpass"
                              >
                                <b-form-input
                                  v-model="newPassword2"
                                  type="password"
                                  placeholder="Repeat Password"
                                  :class="
                                    errors.length > 0 ? ' is-invalid' : ''
                                  "
                                ></b-form-input>
                                <div class="invalid-feedback">
                                  <span>{{ errors[0] }}</span>
                                </div>
                              </b-form-group>
                            </ValidationProvider>
                          </form>
                        </b-modal>
                      </ValidationObserver>
                      <div class="d-inline-block w-100 text-center p-3">
                        <a
                          class="iq-bg-danger iq-sign-btn"
                          href="javascript:void(0)"
                          @click="logout"
                          role="button"
                          >{{ /*$t('nav.user.signout')*/ }}Cerrar Sesión<i
                            class="ri-login-box-line ml-2"
                          ></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </NavBarStyle1>
        <!-- TOP Nav Bar END -->
        <transition
          name="router-anim"
          :enter-active-class="`animated ${animated.enter}`"
          mode="out-in"
          :leave-active-class="`animated ${animated.exit}`"
        >
          <router-view />
        </transition>
        <FooterStyle1>
          <template v-slot:left>
            <li class="list-inline-item">
              <a href="#">Políticas de privacidad</a>
            </li>
            <li class="list-inline-item">
              <a href="#">Términos y condiciones</a>
            </li>
          </template>
          <template v-slot:right>
            Copyright 2021 <a href="#">Juridico App V 1.0.1</a> Todos los
            derechos reservados.
          </template>
        </FooterStyle1>
      </div>
    </div>
  </div>
</template>
<script>
import auth from '@/logic/auth'
import Loader from '../components/xray/loader/Loader'
import SideBarStyle1 from '../components/xray/sidebars/SideBarStyle1'
import NavBarStyle1 from '../components/xray/navbars/NavBarStyle1'
import SideBarItems from '../FackApi/json/SideBar'
import HorizontalItems from '../FackApi/json/HorizontalMenu'
import profileMen from '../assets/images/user/09.jpg'
import profileWomen from '../assets/images/user/15.jpg'
import loader from '../assets/images/logo.png'
import { xray } from '../config/pluginInit'
import { Users } from '../FackApi/api/chat'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import Vue from 'vue'
import moment from 'moment'
export default {
  name: 'Layout1',
  components: {
    Loader,
    SideBarStyle1,
    NavBarStyle1
  },
  mounted () {
    this.updateRadio()
    this.definirAvatarPerfil()
    this.getNotifications()
  },
  computed: {
    ...mapGetters({
      selectedLang: 'Setting/langState',
      langsOptions: 'Setting/langOptionState',
      colors: 'Setting/colorState'
    }),
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  watch: {},
  // sidebarTicket
  data () {
    return {
      newPassword: '',
      newPassword2: '',
      horizontal: false,
      mini: false,
      darkMode: false,
      animated: { enter: 'zoomIn', exit: 'zoomOut' },
      animateClass: [
        { value: { enter: 'zoomIn', exit: 'zoomOut' }, text: 'Zoom' },
        { value: { enter: 'fadeInUp', exit: 'fadeOutDown' }, text: 'Fade' },
        {
          value: { enter: 'slideInLeft', exit: 'slideOutRight' },
          text: 'Slide'
        },
        {
          value: { enter: 'rotateInDownLeft', exit: 'rotateOutDownLeft' },
          text: 'Roll'
        }
      ],
      horizontalMenu: HorizontalItems,
      verticalMenu: SideBarItems,
      userProfile: '',
      userProfileMen: profileMen,
      userProfileWomen: profileWomen,
      logo: loader,
      usersList: Users,
      modelValidations: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          min: 5
        }
      },
      notificationes: [],
      cantidadNotificaciones: ''
    }
  },
  methods: {
    updateRadio () {
      this.horizontal = this.$store.getters['Setting/horizontalMenuState']
      this.mini = this.$store.getters['Setting/miniSidebarState']
    },
    sidebarHorizontal () {
      this.$store.dispatch('Setting/horizontalMenuAction')
      this.updateRadio()
    },
    sidebarMini () {
      xray.triggerSet()
      this.$store.dispatch('Setting/miniSidebarAction')
      this.updateRadio()
    },
    rtlChange () {
      if (this.rtl) {
        this.rtlRemove()
      } else {
        this.rtlAdd()
      }
    },
    changeColor (code) {
      document.documentElement.style.setProperty('--iq-primary', code.primary)
      document.documentElement.style.setProperty(
        '--iq-primary-light',
        code.primaryLight
      )
      if (this.darkMode) {
        document.documentElement.style.setProperty(
          '--iq-bg-dark-color',
          code.bodyBgDark
        )
      } else {
        document.documentElement.style.setProperty(
          '--iq-bg-light-color',
          code.bodyBgLight
        )
      }
    },
    reset () {
      this.changeColor({
        primary: '#827af3',
        primaryLight: '#b47af3',
        bodyBgLight: '#efeefd',
        bodyBgDark: '#1d203f'
      })
      this.animated = { enter: 'zoomIn', exit: 'zoomOut' }
      this.light()
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      if (
        this.newPassword !== '' &&
        this.newPassword2 !== '' &&
        this.newPassword === this.newPassword2
      ) {
        this.cambiarPassword()
      }
    },
    cambiarPassword () {
      if (this.userLogged.usr_id !== undefined) {
        axios
          .post('/users/update/' + this.userLogged.usr_id, {
            newPassword: this.newPassword
          })
          .then((res) => {
            this.$nextTick(() => {
              this.$bvModal.hide('modal-prevent-closing')
            })
            if (res.data.status_code === 200) {
              this.newPassword = ''
              this.newPassword2 = ''
              Vue.swal(res.data.message)
            } else {
              Vue.swal(res.data.message)
            }
          })
      }
    },
    definirAvatarPerfil () {
      if (this.userLogged.usr_gender === '1') {
        this.userProfile = this.userProfileWomen
      } else {
        this.userProfile = this.userProfileMen
      }
    },
    logout () {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      this.$router.push({ name: 'auth1.sign-in1' })
    },
    langChange (lang) {
      this.langChangeState(lang)
      this.$i18n.locale = lang.value
      document.getElementsByClassName('iq-show')[0].classList.remove('iq-show')
      if (lang.value === 'ar') {
        this.rtlAdd(lang)
      } else {
        this.rtlRemove(lang)
      }
    },
    ...mapActions({
      langChangeState: 'Setting/setLangAction',
      rtlAdd: 'Setting/setRtlAction',
      rtlRemove: 'Setting/removeRtlAction'
    }),
    getNotifications () {
      axios.get('/notificaciones/' + this.userLogged.usr_id).then((res) => {
        if (res.status === 200) {
          this.notificationes = res.data.notificaciones
          this.cantidadNotificaciones = res.data.notificaciones.length
        }
      })
    },
    formatDate (fecha) {
      return moment(fecha).fromNow()
    },
    readNotification (item) {
      axios.get('/notificacion-leida/' + item.not_id).then((res) => {
        if (res.status === 200) {
          window.location.replace(item.not_url)
        } else {
          Vue.swal(res.data.message)
        }
      })
    }
  }
}
</script>
<style>
@import url('../assets/css/custom.css');
</style>
