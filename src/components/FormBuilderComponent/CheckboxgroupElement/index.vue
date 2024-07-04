<template>
	<component :is="elementLayout" ref="container" v-bind="{ ...props }">
		<template #element>
			<div :class="classes.wrapper" :aria-labelledby="labelId" role="group">
				<CheckboxgroupCheckbox
					v-for="(item, index, key) in resolvedOptions"
					:items="resolvedOptions"
					:index="index"
					:item="item"
					:value="item.value"
					:key="key"
					:attrs="aria"
				>
					<template #default="scope">
						<slot name="checkbox" v-bind="scope" :el$="el$">
							<component :is="fieldSlots.checkbox" v-bind="scope" :el$="el$" />
						</slot>
					</template>
				</CheckboxgroupCheckbox>
			</div>
		</template>

		<!-- Default element slots -->
		<template v-for="(component, slot) in elementSlots" #[slot]>
			<slot :name="slot" :el$="el$"><component :is="component" :el$="el$" /></slot>
		</template>
	</component>
</template>
  <script>
import { defineElement, CheckboxgroupElement } from "@vueform/vueform"
import { CheckboxgroupElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { ref } from "vue"
export default defineElement({
	...CheckboxgroupElement, // adding props, mixins, emits
	...EditorElementTemplate,
	props: {
		...CheckboxgroupElement.props,
		referenceName: {
			type: String,
			default: ""
		}
	},
	setup(props, context) {
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
		const element = CheckboxgroupElement.setup(props, context)
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