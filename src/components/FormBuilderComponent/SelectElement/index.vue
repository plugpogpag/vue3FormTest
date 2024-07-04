<template>
	<component :is="elementLayout" ref="container" v-bind="{...props}">
		<template #element>
			<ElementLabelFloating v-if="hasFloating && !empty" :visible="!empty" />

			<!-- Native select -->
			<div v-if="isNative" :class="classes.inputWrapper">
				<select
					v-model="value"
					:class="classes.input"
					:name="name"
					:id="fieldId"
					:disabled="isDisabled"
					v-bind="{
						...attrs,
						...aria
					}"
					ref="input"
				>
					<option v-for="(option, index) in resolvedOptions" :value="option.value" :key="index">
						{{ option.label }}
					</option>
				</select>
				<span v-if="placeholder && empty && !isDisabled && type == 'select'" :class="classes.inputPlaceholder">
					{{ placeholder }}
				</span>
				<span :class="classes.inputCaret"></span>
			</div>
			<!-- @vueform/multiselect copmonent -->
			<Multiselect
				v-else
				v-bind="fieldOptions"
				v-model="value"
				:classes="classes.select"
				:id="fieldId"
				:name="name"
				:options="resolvedOptions"
				:disabled="isDisabled"
				:placeholder="Placeholder"
				:attrs="attrs"
				:aria="aria"
				:locale="form$.locale$"
				@select="handleSelect"
				@deselect="handleDeselect"
				@search-change="handleSearchChange"
				@tag="handleTag"
				@open="handleOpen"
				@close="handleClose"
				@clear="handleClear"
				@paste="handlePaste"
				ref="input"
			>
				<template
					v-for="(slotName, slotKey) in {
						option: 'option',
						noresults: 'no-results',
						nooptions: 'no-options',
						afterlist: 'after-list',
						beforelist: 'before-list',
						placeholder: 'placeholder',
						grouplabel: 'group-label',
						caret: 'caret',
						clear: 'clear',
						spinner: 'spinner',
						default: 'default'
					}"
					#[slotKey]="props"
				>
					<slot :name="slotName" v-bind="props" :el$="el$">
						<component :is="fieldSlots[slotName]" v-bind="props" :el$="el$" />
					</slot>
				</template>

				<template v-if="fieldOptions.mode == 'single'" #singlelabel="{ value }">
					<slot name="single-label" :value="value" :el$="el$">
						<component :is="fieldSlots['single-label']" :value="value" :el$="el$" />
					</slot>
				</template>
			</Multiselect>
		</template>

		<!-- Default element slots -->
		<template v-for="(component, slot) in elementSlots" #[slot]>
			<slot :name="slot" :el$="el$"><component :is="component" :el$="el$" /></slot>
		</template>
	</component>
</template>
  
    <script>
import { defineElement, SelectElement } from "@vueform/vueform"
import { SelectElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { ref } from "vue"
export default defineElement({
	...SelectElement, // adding props, mixins, emits
	...EditorElementTemplate,
	props: {
		...SelectElement.props,
		referenceName: {
			type: String,
			default: ""
		}
	},
	setup(props, context) {
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
		const element = SelectElement.setup(props, context)
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