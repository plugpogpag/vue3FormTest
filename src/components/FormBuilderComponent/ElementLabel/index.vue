<template>
	<!-- If label is a component -->

	<label v-if="label && isLabelComponent" :class="classes.container" :for="name" :id="id">
		If label is a component
		<span :class="classes.wrapper"><component v-if="isLabelComponent" :is="label" /></span>

		<ElementInfo><slot name="info" /></ElementInfo>
	</label>

	<!-- If label is HTML -->
	<label v-else-if="label" :class="classes.container" :for="name" :id="id">
		<!-- If label is HTML -->
		<n-input v-model:value="labelValue" type="text" placeholder="Basic Input" :on-update:value="updateInput" v-if="active" />
		<span :class="classes.wrapper" v-html="label" @click="active = true" v-else ></span>

		<ElementInfo><slot name="info" /></ElementInfo>
	</label>

	<!-- If label is a slot -->
	<label v-else-if="isSlot" :class="classes.container" :for="name" :id="id">
		If label is a slot
		<span :class="classes.wrapper">
			<slot />
		</span>
		<ElementInfo><slot name="info" /></ElementInfo>
	</label>

	<!-- If labels are forced but has no value -->
	<label v-else-if="hasLabel" :class="classes.container" :for="name" :id="id" />
</template>
  
<script>
import { ref, inject, watch, toRefs } from "vue"
import { ElementLabel } from "@vueform/vueform"
import { ElementLabel as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { NInput } from "naive-ui"
import { debounce } from "lodash"
export default {
	...ElementLabel,
	...EditorElementTemplate,
	components: {
		...ElementLabel.components,
		NInput,
	},
	name: "ElementLabel",
	setup(props, context) {
		const el$ = inject("el$")
		const form$ = inject("form$")
		const config$ = inject("config$")
		const label = inject("label")
		// if (el$.value.fieldId==="label") {
		// 	console.log({ form$: form$.value, el$: el$.value, config$: config$.value })
		// }
		const labelValue = ref(el$.value.label)
        function updateInput(value){
            labelValue.value = value
            updateLabelValue(value)
        }
		const updateLabelValue = debounce(value => {
			labelValue.value = value
			label.updateLabelValue(el$.value.fieldId, value)
            active.value = false
		}, 500)
		// function updateLabelValue(value) {
		// 	// console.log(value)
		// 	// label.updateLabelValue(value)
		// 	// context.emit("updateLabel", labelValue.value)
		//     labelValue.value = value
		// 	debounce(() => {
		// 		label.updateLabelValue(el$.value.fieldId, value)
		// 	}, 500)
		// }
		// console.log(test.value)
		// test.value.$set('label')
		// const label  = test.value.label
		// if(label){
		//     label.update("test")
		// }
		// const labelReactive = toRefs(test.value.el$, "Label")
		// labelReactive.value.update("test")
		// console.log(labelReactive)
		// watch(() => test.value.el$.label, (newVal, oldVal) => {
		//     console.log(newVal)
		// })
		// console.log(test.value.el$.label))
		// test.value.el$.$set("label", "test")
		///wathcing the form data
		// onMounted(() => {
		//     console.log(test.value.data)
		// })
		const element = ElementLabel.setup(props, context)
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
        const active = ref(false)
		return {
			// labelReactive:labelReactive.value,
			updateLabelValue,
			labelValue,
            updateInput,
            active,
			...element,
			...defaultClasses

		}
	}
}
</script>
  <style lang="scss">
</style>