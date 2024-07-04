<template>
	<component :is="elementLayout" ref="container" v-bind="{...props}">
		<template #element>
			<label :class="classes.wrapper">
				<input
					type="radio"
					v-model="value"
					v-bind="aria"
					:value="radioValue"
					:class="classes.input"
					:name="inputName"
					:id="fieldId"
					:disabled="isDisabled"
					ref="input"
				/>

				<!-- If label is HTML -->
				<span v-if="Text" :class="classes.text" v-html="Text" />

				<!-- If label is slot -->
				<span v-else :class="classes.text">
					<slot :el$="el$"><component :is="fieldSlots.default" :el$="el$" /></slot>
				</span>
			</label>
		</template>

		<!-- Default element slots -->
		<template v-for="(component, slot) in elementSlots" #[slot]>
			<slot :name="slot" :el$="el$"><component :is="component" :el$="el$" /></slot>
		</template>
	</component>
</template>

  <script>
import { defineElement, RadioElement } from "@vueform/vueform"
import { RadioElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { ref } from "vue"
export default defineElement({
	...RadioElement, // adding props, mixins, emits
	...EditorElementTemplate,
	props: {
		...RadioElement.props,
		referenceName: {
			type: String,
			default: ""
		}
	},
	setup(props, context) {
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
		const element = RadioElement.setup(props, context)
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