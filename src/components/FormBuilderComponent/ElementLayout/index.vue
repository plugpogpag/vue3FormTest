<template>
	<!-- If label is a component -->
	<div :class="classes.container" v-show="visible">
		<div :class="classes.outerWrapper">
			<ElementLabel v-bind="{...$props}">
				<template #default><slot name="label" /></template>
				<template #info><slot name="info" /></template>
			</ElementLabel>

			<div :class="classes.innerContainer">
				<div :class="classes.innerWrapperBefore">
					<ElementText type="before"  v-bind="{...$props}"><slot name="before" /></ElementText>
				</div>
				<div :class="classes.innerWrapper">
					<slot name="element"  v-bind="{...$props}"/>
				</div>
				<div :class="classes.innerWrapperAfter">
					<ElementText type="between"><slot name="between"  v-bind="{...$props}"/></ElementText>
					<ElementDescription><slot name="description"  v-bind="{...$props}"/></ElementDescription>
					<ElementError v-bind="{...$props}" />
					<ElementMessage  v-bind="{...$props}"/>
					<ElementText type="after"><slot name="after"  v-bind="{...$props}"/></ElementText>
				</div>
			</div>
		</div>
	</div>
</template>
  
<script>
import { ElementLayout } from "@vueform/vueform"
import { ElementLayout as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import {ref} from "vue" 
export default {
	...ElementLayout,
	...EditorElementTemplate,
	name: "ElementLayout",
	props: {
		referenceName: {
			type: String,
			default: ""
		}
	},
	data() {
		return {}
	},
	setup(props, context) {
		const element = ElementLayout.setup(props, context)
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})

		return {
			...element,
			defaultClasses
		}
	}
}
</script>
  <style lang="scss">
</style>