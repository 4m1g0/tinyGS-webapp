<template>
  <div class="hexview">

    <pre class="hexdump">{{ content }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    raw: ArrayBuffer,
  },
  data() {
    return {
      hex: true,
      windowWidth: window.innerWidth,
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  computed: {
    content() {
      if (this.raw && this.raw.byteLength)
        return this.hex ? this.hexdump : new TextDecoder('utf8').decode(this.raw)
      else
        return '(empty)'
    },
    hexdump() {
      let dump
      let lineLen
      if (this.windowWidth > 1290) {
        dump = '      0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F 0123456789ABCDEF'
        lineLen = 16
      }
      else {
        dump = '      0  1  2  3  4  5  6  7  8 012345678'
        lineLen = 9
      }
      

      let view = new DataView(this.raw)
      for (let i = 0; i < this.raw.byteLength; i += lineLen) {
        dump += `\n${('0000' + i.toString(16).toUpperCase()).slice(-4)} `
        for (let j = 0; j < lineLen; j++) {
          let ch = i + j > this.raw.byteLength - 1 ?
            '  ' :
            (0 + view.getUint8(i + j).toString(16).toUpperCase()).slice(-2)
          dump += `${ch} `
        }
        dump += String.fromCharCode.apply(null,
          new Uint8Array(this.raw.slice(i, i + lineLen)))
          .replace(/[^\x20-\x7E]/g, '.')
      }
      return dump
    },
  }
}
</script>

<style>
.hexview {
  overflow: auto;
}

</style>