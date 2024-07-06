<template>
    <component :is="elementLayout" :multiple="true" ref="container"  v-bind="{...$props,parentName:props?.name}">
      <template #element>
        <div :class="classes.wrapper" role="group" :aria-labelledby="labelId">
          <slot>
            <component :is="component(element)"
              v-for="(element, name) in children"
              v-bind="element"
              :name="name"
              :key="name"
           />
          </slot>
        </div>
      </template>
  
      <!-- Default element slots -->
      <template v-for="(component, slot) in elementSlots" #[slot]><slot :name="slot" :el$="el$"><component :is="component" :el$="el$" v-bind="{...$props,parentName:props?.name}" /></slot></template>
      </component>
  </template>

  <script>
  import { defineElement, GroupElement } from "@vueform/vueform"
  import { GroupElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
  import {ref} from "vue"
  export default defineElement({
      ...GroupElement, // adding props, mixins, emits
      ...EditorElementTemplate,
      props: {
          ...GroupElement.props,
          referenceName: {
              type: String,
              default: ""
          }
      },
      setup(props, context) {
          const defaultClasses = ref({
              ...EditorElementTemplate.data().defaultClasses
          })
          const element = GroupElement.setup(props, context)
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