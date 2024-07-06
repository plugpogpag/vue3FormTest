
import en from '@vueform/vueform/locales/en'
import vueform from '@vueform/vueform/dist/vueform'
import { defineConfig } from '@vueform/vueform'

// You might place these anywhere else in your project
import '@vueform/vueform/dist/vueform.css';
import CheckboxElement from './src/components/FormBuilderComponent/component/CheckboxElement/index.vue'
import CheckboxgroupElement from './src/components/FormBuilderComponent/component/CheckboxgroupElement/index.vue'
import ElementLabel from './src/components/FormBuilderComponent/component/ElementLabel/index.vue'
import RadioElement from './src/components/FormBuilderComponent/component/RadioElement/index.vue'
import ElementLayout from './src/components/FormBuilderComponent/component/ElementLayout/index.vue'
import RadiogroupElement from './src/components/FormBuilderComponent/component/RadiogroupElement/index.vue'
import SelectElement from './src/components/FormBuilderComponent/component/SelectElement/index.vue'
import StaticElement from './src/components/FormBuilderComponent/component/StaticElement/index.vue'
import TextareaElement from './src/components/FormBuilderComponent/component/TextareaElement/index.vue'
import TextElement from './src/components/FormBuilderComponent/component/TextElement/index.vue'
import GroupElement from './src/components/FormBuilderComponent/component/GroupElement/index.vue'

//no use in production
import CheckboxgroupElementTemplate from './src/components/FormBuilderComponent/template/CheckboxgroupElement/index.vue'
import CheckboxgroupElement_tabs from './src/components/FormBuilderComponent/template/CheckboxgroupElement_tabs/index.vue'
import CheckboxgroupElement_blocks from './src/components/FormBuilderComponent/template/CheckboxgroupElement_blocks/index.vue'
import RadiogroupElementTemplate from './src/components/FormBuilderComponent/template/RadiogroupElement_tabs/index.vue'
import RadiogroupElement_tabs from './src/components/FormBuilderComponent/template/RadiogroupElement_tabs/index.vue'
import RadiogroupElement_blocks from './src/components/FormBuilderComponent/template/RadiogroupElement_blocks/index.vue'

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
  templates: {
    CheckboxgroupElementTemplate,
    CheckboxgroupElement_tabs,
    CheckboxgroupElement_blocks,
    RadiogroupElementTemplate,
    RadiogroupElement_tabs,
    RadiogroupElement_blocks
  },
})