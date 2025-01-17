<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div class="action-bar" :style="{'text-align': 'left'}">
        <span class="bar-btn" @click="refresh">
          <i class="el-icon-refresh" />
          Refresh
        </span>
        <span ref="copyBtn" class="bar-btn copy-json-btn">
          <i class="el-icon-document-copy" />
          Copy JSON
        </span>
        <span class="bar-btn" @click="exportJsonFile">
          <i class="el-icon-download" />
          Export JSON file
        </span>
        <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
          <i class="el-icon-circle-close" />
          Close
        </span>
      </div>
      <div id="editorJson" class="json-editor" />
    </el-drawer>
  </div>
</template>

<script>
import { beautifierConf } from '@/utils/index'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'

let beautifier
let monaco

export default {
  components: {},
  props: {
    jsonStr: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    const clipboard = new ClipboardJS('.copy-json-btn', {
      text: trigger => {
        this.$notify({
          title: 'Success',
          message: 'The code has been copied to the cutting board, which can be pasted.',
          type: 'success'
        })
        return this.beautifierJson
      }
    })
    clipboard.on('error', e => {
      this.$message.error('Code copy failed')
    })
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    onOpen() {
      loadBeautifier(btf => {
        beautifier = btf
        this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js)

        loadMonaco(val => {
          monaco = val
          this.setEditorValue('editorJson', this.beautifierJson)
        })
      })
    },
    onClose() {},
    setEditorValue(id, codeStr) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(codeStr)
      } else {
        this.jsonEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'json',
          automaticLayout: true
        })
        // ctrl + s 刷新
        this.jsonEditor.onKeyDown(e => {
          if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
            this.refresh()
          }
        })
      }
    },
    exportJsonFile() {
      this.$prompt('file name:', 'Export file', {
        inputValue: `${+new Date()}.json`,
        closeOnClickModal: false,
        inputPlaceholder: 'Please enter the file name'
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.json`
        const codeStr = this.jsonEditor.getValue()
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, value)
      })
    },
    refresh() {
      try {
        this.$emit('refresh', JSON.parse(this.jsonEditor.getValue()))
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: 'JSON format error, please check',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

::v-deep .el-drawer__header {
  display: none;
}
@include action-bar;

.json-editor{
  height: calc(100vh - 33px);
}
</style>
