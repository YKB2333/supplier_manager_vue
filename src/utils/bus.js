const VUE_BUS = (Vue) => {
  const Bus = new Vue({
    methods: {
      emit(e, ...args) {
        this.$emit(e, ...args)
      },
      on(e, callback) {
        this.$on(e, callback)
      },
      off(e, callback) {
        this.$off(e, callback)
      }
    }
  })
  Vue.prototype.$bus = Bus
}

export default VUE_BUS