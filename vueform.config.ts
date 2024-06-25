
import en from '@vueform/vueform/locales/en'
import vueform from '@vueform/vueform/dist/vueform'
import { defineConfig } from '@vueform/vueform'

// You might place these anywhere else in your project
import '@vueform/vueform/dist/vueform.css';
import ElementLabel from './src/components/FormBuilderComponent/ElementLabel/index.vue'
import StaticElement from './src/components/FormBuilderComponent/StaticElement/index.vue'
export default defineConfig({
  theme: vueform,
  locales: { en },
  locale: 'en',
  elements:[ElementLabel,StaticElement],
})