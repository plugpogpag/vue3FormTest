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
		<n-input
			v-model:value="labelValue"
			type="text"
			placeholder="Basic Input"
			:on-update:value="updateInput"
			v-if="active"
			ref="inputTextElement"
			@blur="inputBlurHandle"
			:loading="isLoading"
		/>
		<span :class="classes.wrapper" v-html="label" @click="editModeElementText" v-else></span>

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
import { ref, inject, watch } from "vue"
import { ElementLabel } from "@vueform/vueform"
import { ElementLabel as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { NInput } from "naive-ui"
import { debounce } from "lodash"
export default {
	...ElementLabel,
	...EditorElementTemplate,
	components: {
		...ElementLabel.components,
		NInput
	},
	name: "ElementLabel",
	setup(props, context) {
		const el$ = inject("el$")
		const update = inject("update")
		const isLoading = ref(false)
		const labelValue = ref(el$.value.label)
		function updateInput(value) {
			labelValue.value = value
			isLoading.value = true
			updateLabelValue(value)
		}
		const updateLabelValue = debounce(value => {
			labelValue.value = value
			update.updateValue("label", el$.value.fieldId, value)
			isLoading.value = false
		}, 500)
		const element = ElementLabel.setup(props, context)
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
		const active = ref(false)
		const inputTextElement = ref(null)
		function editModeElementText(e) {
			e.preventDefault()
			labelValue.value = el$.value.label
			active.value = true
		}
		watch(inputTextElement, inputElement => {
			if (inputElement) inputElement.focus()
		})
		function inputBlurHandle() {
			active.value = false
		}
		return {
			// labelReactive:labelReactive.value,
			updateLabelValue,
			labelValue,
			updateInput,
			active,
			editModeElementText,
			inputTextElement,
			inputBlurHandle,
			isLoading,
			...element,
			...defaultClasses
		}
	}
}
</script>
  <style lang="scss">
</style>