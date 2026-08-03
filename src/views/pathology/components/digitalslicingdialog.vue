<template>
  <div width="60%" height="40%">
    <vxe-modal v-model="visible" show-maximize width="40%" height="45%" :mask="false" :lock-view="false" resize>
      <template #title> 数字切片 </template>
      <div ref="osdContainer" class="osd-viewer"></div>
    </vxe-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import OpenSeadragon from 'openseadragon'

const osdContainer = ref(null)
let viewer = null
const visible = ref(false)

onMounted(() => {
  //   initViewer()
})

const showDialog = (id) => {
  visible.value = true
  nextTick(() => {
    initViewer(id)
  })
}
const getIsVisible = () => {
  return visible.value
}

const initViewer = (id) => {
  if (viewer) {
    viewer.destroy() // 确保销毁旧实例
  }

  viewer = OpenSeadragon({
    element: osdContainer.value,
    tileSources: `${import.meta.env.VITE_API_URL}/storage/${id}.dzi`,
    showNavigator: true,
    prefixUrl: '/seadragonimages/',
  })
}

onBeforeUnmount(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})

defineExpose({
  showDialog,
  getIsVisible,
})
</script>

<style scoped lang="scss">
.osd-viewer {
  width: 100%;
  height: 100%;
}
</style>
