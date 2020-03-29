import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import { option } from './main.js'
import Core from '../../core.js'

export default Object.assign({}, Core, {
  name: 'YjroiChart',
  data () {
    this.chartHandler = option
    return {}
  }
})
