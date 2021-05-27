<template>
  <div>
    <Tinymce v-model="defaultValue" :height="300" placeholder="Enter text here" />
  </div>
</template>

<script>
import Tinymce from '../index.vue'

export default {
  components: {
    Tinymce
  },
  props: {

  },
  data() {
    return {
      defaultValue: '<p>Configuration documentation：http://tinymce.ax-z.cn</p>'
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>
