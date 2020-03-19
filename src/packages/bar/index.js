import 'echarts/lib/chart/bar'
import { bar } from './main.js'
import Core from '../../core.js'
export default Object.assign({}, Core, {
  name: 'VeBar',
  data () {
    this.chartHandler = bar
    return {}
  }
})
