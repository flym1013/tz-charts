import 'echarts/lib/chart/funnel'
import { option } from './main.js'
import Core from '../../core.js'

export default Object.assign({}, Core, {
  name: 'LlsjldChart',
  data () {
    this.chartHandler = option
    return {}
  }
})
