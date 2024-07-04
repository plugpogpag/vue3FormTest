<template>
    <component :is="elementLayout" ref="container" v-bind="{...props}">
      <template #element>
        <div :class="classes.wrapper" :aria-labelledby="labelId" role="radiogroup"> 
          <RadiogroupRadio
            v-for="(item, index, key) in resolvedOptions"
            :items="resolvedOptions"
            :index="index"
            :item="item"
            :value="item.value"
            :key="key"
            :attrs="aria"
          >
            <template #default="scope">
              <slot name="radio" v-bind="scope" :el$="el$">
                <component :is="fieldSlots.radio" v-bind="scope" :el$="el$"/>
              </slot>
            </template>
          </RadiogroupRadio>
        </div>
      </template>
  
      <!-- Default element slots -->
      <template v-for="(component, slot) in elementSlots" #[slot]><slot :name="slot" :el$="el$"><component :is="component" :el$="el$"/></slot></template>
    </component>
  </template>
  
  <!-- <script>
    export default {
      name: 'RadiogroupElement',
      data() {
        return {
          merge: true,
          defaultClasses: {
            container: '',
            wrapper: '',
          }
        }
      }
    }
  </script> -->
  <script>
  import { defineElement, RadiogroupElement } from "@vueform/vueform"
  import { RadiogroupElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
  import {ref} from "vue"
  export default defineElement({
      ...RadiogroupElement, // adding props, mixins, emits
      ...EditorElementTemplate,
      props: {
          ...RadiogroupElement.props,
          referenceName: {
              type: String,
              default: ""
          }
      },
      setup(props, context) {
          const defaultClasses = ref({
              ...EditorElementTemplate.data().defaultClasses
          })
          const element = RadiogroupElement.setup(props, context)
          return {
              ...element,
              defaultClasses,
              props
          }
      }
  })
  </script>
  <style lang="scss">
  </style>