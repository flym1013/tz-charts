import 'echarts/lib/chart/pie'
import { option } from './main.js'
import Core from '../../core.js'

export default Object.assign({}, Core, {
  name: 'CjzqChart',
  data () {
    this.chartHandler = option
    return {}
  }
})
