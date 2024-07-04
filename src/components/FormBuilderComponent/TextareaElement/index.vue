<template>
    <component :is="elementLayout" ref="container" v-bind="{...props}">
      <template #element>
        <div :class="classes.inputContainer">
          <ElementAddon v-if="hasAddonBefore" type="before">
            <slot name="addon-before"><component :is="fieldSlots['addon-before']" :el$="el$"/></slot>
          </ElementAddon>
  
          <ElementAddon v-if="hasAddonAfter" type="after">
            <slot name="addon-after"><component :is="fieldSlots['addon-after']" :el$="el$"/></slot>
          </ElementAddon>
  
          <ElementLabelFloating
            v-if="hasFloating && !empty"
            :visible="!empty"
         />
  
          <ElementLoader
            v-show="pending"
         />
  
          <textarea
            :value="model"
            :name="name"
            :id="fieldId"
            :class="classes.input"
            :placeholder="Placeholder"
            :disabled="isDisabled"
            :readonly="readonly"
            :rows="rows"
            v-bind="{
              ...attrs,
              ...aria,
            }"
            :data-autogrow="autogrow || undefined"
            @keydown="handleKeydown"
            @keyup="handleKeyup"
            @keypress="handleKeypress"
            @input="handleInput"
            @blur="handleBlur"
            ref="input"
         />
        </div>
      </template>
  
      <!-- Default element slots -->
      <template v-for="(component, slot) in elementSlots" #[slot]><slot :name="slot" :el$="el$"><component :is="component" :el$="el$"/></slot></template>
    </component>
  </template>

    
    <script>
    import { defineElement, TextareaElement } from "@vueform/vueform"
    import { TextareaElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
    import {ref} from "vue"
    export default defineElement({
        ...TextareaElement, // adding props, mixins, emits
        ...EditorElementTemplate,
        props: {
            ...TextareaElement.props,
            referenceName: {
                type: String,
                default: ""
            }
        },
        setup(props, context) {
            const defaultClasses = ref({
                ...EditorElementTemplate.data().defaultClasses
            })
            const element = TextareaElement.setup(props, context)
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