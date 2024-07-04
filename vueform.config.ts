
import en from '@vueform/vueform/locales/en'
import vueform from '@vueform/vueform/dist/vueform'
import { defineConfig } from '@vueform/vueform'

// You might place these anywhere else in your project
import '@vueform/vueform/dist/vueform.css';
import CheckboxElement from './src/components/FormBuilderComponent/CheckboxElement/index.vue'
import CheckboxgroupElement from './src/components/FormBuilderComponent/CheckboxgroupElement/index.vue'
import ElementLabel from './src/components/FormBuilderComponent/ElementLabel/index.vue'
import ElementLayout from './src/components/FormBuilderComponent/ElementLayout/index.vue'
import GroupElement from './src/components/FormBuilderComponent/GroupElement/index.vue'
import RadioElement from './src/components/FormBuilderComponent/RadioElement/index.vue'
import RadiogroupElement from './src/components/FormBuilderComponent/RadiogroupElement/index.vue'
import SelectElement from './src/components/FormBuilderComponent/SelectElement/index.vue'
import StaticElement from './src/components/FormBuilderComponent/StaticElement/index.vue'
import TextareaElement from './src/components/FormBuilderComponent/TextareaElement/index.vue'
import TextElement from './src/components/FormBuilderComponent/TextElement/index.vue'

export default defineConfig({
  theme: vueform,
  locales: { en },
  locale: 'en',
  elements: [
    CheckboxElement,
    CheckboxgroupElement,
    ElementLabel,
    ElementLayout,
    GroupElement,
    RadioElement,
    RadiogroupElement,
    SelectElement,
    StaticElement,
    TextareaElement,
    TextElement,
  ],
})