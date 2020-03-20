import 'echarts/lib/chart/bar'
import { option } from './main.js'
import Core from '../../core.js'

export default Object.assign({}, Core, {
  name: 'BarserChart',
  data () {
    this.chartHandler = option
    return {}
  }
})
