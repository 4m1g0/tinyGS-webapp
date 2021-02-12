import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import SatelliteIcon from '@/Icons/SatelliteIcon.vue'
import StationIcon from '@/Icons/StationIcon.vue'
import SatelliteIconDark from '@/Icons/SatelliteIconDark.vue'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        values: {
            satellite: {
                component: SatelliteIcon
            },
            satelliteDark: {
                component: SatelliteIconDark
            },
            station: {
                component: StationIcon
            }
        }
    }
});
