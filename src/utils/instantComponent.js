import Vue from "vue"
import store from '@/store'

export default function (compt, propsData) {
  let comptConstr = Vue.extend(compt)
  let instant = new comptConstr({
    propsData: propsData
  })
  instant.$mount()
  return instant
}
