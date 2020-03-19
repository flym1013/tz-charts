import 'echarts/extension/bmap/bmap'
import { bmap } from './main'
import Core from '../../core.js'
export default Object.assign({}, Core, {
  name: 'VeBmap',
  data () {
    this.chartHandler = bmap
    return {}
  }
})
