<template>
  <div :style="{'background-image': `url(${require('../../assets/images/login/juridico-prueba.jpg')})`, 'background-attachment' : 'fixed','background-repeat': 'no-repeat','background-size': 'cover'}">
    <Loader />
    <div class="login-background">
      <b-container >
        <b-row>
          <b-col col lg="6">
            <div :style="topleft">
              <a class="sign-in-logo mb-5" href="#"><img :src="logo" class="img-fluid" alt="logo"></a>
            </div>
            <div :style="bottomleft">
              <h4 class="mb-1 text-white" :style="'font-family: Quatro;'" >Crea tus litigios de manera fácil y digitaliza la información</h4>
              </div>
            </b-col>
             <b-col col lg="6">
                <div class="sign-in-from">
                  <router-view></router-view>
                </div>
              </b-col>
          </b-row>
      </b-container>
    </div>
  </div>
</template>
<script>
import Loader from '../../components/xray/loader/Loader'
import logo from '../../assets/images/logo-nueva.png'
import { xray } from '../../config/pluginInit'
import bgImage from '../../assets/images/login/2.png'
export default {
  name: 'AuthLayout1',
  components: {
    Loader
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      slickOptions: {
        slidesToShow: 1,
        arrows: false,
        dots: false
      },
      logo: logo,
      bgImageURL: bgImage,
      bottomleft: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        margin: '30px'
      },
      topleft: {
        position: 'fixed',
        top: 0,
        left: 0,
        margin: '30px'
      }
    }
  }
}
</script>
