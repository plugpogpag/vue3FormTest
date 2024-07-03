<template>
	<!-- If label is a component -->
	<label v-if="label && isLabelComponent" :class="classes.container" :for="name" :id="id">
		<span :class="classes.wrapper"><component v-if="isLabelComponent" :is="labelCustom" /></span>
		<ElementInfo><slot name="info" /></ElementInfo>
	</label>

	<!-- If label is HTML -->
	<label v-else-if="labelCustom" :class="classes.container" :for="name" :id="id">
		<n-input
			v-model:value="labelCustomData"
			type="text"
			placeholder="Basic Input"
			:on-update:value="handleValueChange"
			v-if="active"
			ref="inputTextElement"
			@blur="inputBlurHandle"
			:loading="isLoading"
		/>
		<span :class="classes.wrapper" v-html="labelCustom" @click="editModeElementText" v-else></span>
		<ElementInfo><slot name="info" /></ElementInfo>
	</label>

	<!-- If label is a slot -->
	<label v-else-if="isSlot" :class="classes.container" :for="name" :id="id">
		<span :class="classes.wrapper"><slot /></span>
		<ElementInfo><slot name="info" /></ElementInfo>
	</label>

	<!-- If labels are forced but has no value -->
	<label v-else-if="hasLabel" :class="classes.container" :for="name" :id="id" />
</template>
  
<script>
import { ElementLabel } from "@vueform/vueform"
import { ElementLabel as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { NInput } from "naive-ui"
import { debounce } from "lodash"
import { ref, watch } from "vue"
export default {
	...ElementLabel,
	...EditorElementTemplate,
	components: {
		...ElementLabel.components,
		NInput
	},
	name: "ElementLabel",
	inject: ["update", "el$", "labelForm"],
	data() {
		return {
			merge: true,
			defaultClasses: {
				container: "",
				wrapper: ""
			},
			labelCustomData: null,
			isLoading: false,

			active: false,
			...EditorElementTemplate.data()
		}
	},
	computed: {
		...ElementLabel.computed,
		...EditorElementTemplate.computed,
		labelCustom: {
			get() {
				if (!this.labelCustomData) {
					return this.labelCustomData
				} else {
					const labels = this.extractLabels(this.labelCustomData)
					if (labels.length > 0) {
						const labelArray = labels?.map(label => {
							if (label) {
								return this.labelForm.LabelFormValue.value.json[`${this.el$.fieldId}.label.${label}`] || ""
							}
						})
						return labelArray.join("")
					}
					return this.labelCustomData
				}
			},
			set(value) {
				this.labelCustomData = value
			}
		}
	},
	methods: {
		...ElementLabel.methods,
		...EditorElementTemplate.methods,
		delaySave: debounce(function (value) {
			this.update.updateValue("label", this.el$.fieldId, value)
			this.isLoading = false
		}, 500),
		handleValueChange(value) {
			this.labelCustom = value
			this.isLoading = true
			this.delaySave(value)
		},
		editModeElementText(e) {
			e.preventDefault()
			this.active = true
		},
		inputBlurHandle(e) {
			e.preventDefault()
			this.active = false
		},
		extractLabels(text) {
			const regex = /\[\[\s*(.*?)\s*\]\]/g
			const matches = []
			let match

			while ((match = regex.exec(text)) !== null) {
				matches.push(match[1]) // Capture the name inside the brackets
			}

			return matches
		}
	},
	watch: {
		label: {
			handler(val) {
				this.labelCustomData = val
				// if this.labelCustomData is have data and value this.labelCustomData is [[test]] or [[test]][[test2]][[test3]] show array of all bucket array
				const labels = this.extractLabels(this.labelCustomData)
				if (this.labelCustomData) {
					if (labels.length > 0) {
						labels.map(label => {
							this.labelForm.updateLabelForm("label",this.el$.fieldId,label, "data") 
						})
					} else {
						this.labelForm.updateLabelForm("label",this.el$.fieldId,null,  this.labelCustomData) 
					}
				}
			},
			immediate: true,
			deep: true
		}
	},
	setup(props, context) {
		const element = ElementLabel.setup(props, context)
		const inputTextElement = ref(null)
		watch(inputTextElement, inputElement => {
			if (inputElement) inputElement.focus()
		})
		return {
			inputTextElement,
			...element
		}
	}
}
</script>
  <style lang="scss">
</style>