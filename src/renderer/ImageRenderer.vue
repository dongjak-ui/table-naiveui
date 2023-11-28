<script setup lang="ts">
import {component as viewer} from 'v-viewer'
import {IImageRenderer} from "@dongjak-public-types/table";
import {api as viewerApi} from "v-viewer"

interface Props {
  renderer: IImageRenderer<any>,
  value:any
}

const props = defineProps<Props>()
const images = computed(() => {
  return (props.value as { [key: string]: string }[])?.map(
      (item) => {
        return {
          src: item[props.renderer.srcField!],
          alt: item[props.renderer.altField!],
        };
      }
  )??[]
})
const isValidate = computed(() => {
  return images.value.length > 0
})
const width = computed(() => {
  return props.renderer.width ?? 50
})
const height = computed(() => {
  return props.renderer.height ?? 50
})
const showImages = () => {
  viewerApi({
    images: images.value,
    options: {
      toolbar: {
        flipHorizontal: 1,
        flipVertical: 1,
        next: 1,
        oneToOne: 1,
        play: 1,
        prev: 1,
        reset: 1,
        rotateLeft: 1,
        rotateRight: 1,
        zoomIn: 1,
        zoomOut: 1,
        // test: {
        //   show: true,
        //   click() {
        //     alert(11)
        //   }
        // }
      }
    }
  })
}
</script>

<template >
  <img
      @click="showImages"
      v-if="isValidate&& props.renderer.throttleMode"
      :width="width"
      :height="height"
      :src="images[0].src"
      :alt="images[0].alt"
  />
  <viewer class="flex col-gap-1px" :images="images" v-else>
    <img
        :width="width"
        :height="height"
        v-for="(image,index) in images"
        :key="index"
        :src="image.src"
        :alt="image.alt"
    />
  </viewer>
</template>

<style>
@import "//unpkg.com/viewerjs/dist/viewer.css";

.viewer-test::before {
  display: flex;
  content: "C";
  font-size: 12px;
  font-weight: bold;
  color: white;
  height: 20px;
  line-height: 0;
  width: 20px;
  align-content: space-around;
  justify-content: center;
  align-items: center;
}
</style>
