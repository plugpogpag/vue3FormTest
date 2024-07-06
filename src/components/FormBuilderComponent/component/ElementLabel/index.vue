<template>
	<!-- If label is a component -->
	<label v-if="label && isLabelComponent" :class="classes.container" :for="name" :id="id">
		<span :class="classes.wrapper"><component v-if="isLabelComponent" :is="labelCustom" /></span>
		<ElementInfo><slot name="info" /></ElementInfo>
	</label>

	<!-- If label is HTML -->
	<label v-else-if="labelCustom" :class="classes.container" :for="name" :id="id">
		<template v-if="isDevMode">
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
			<div v-else class="flex justify-center items-center gap-2">
				<span :class="classes.wrapper" v-html="labelCustom" @click="editModeElementText"></span>
				<n-icon
					class="text-sm cursor-pointer"
					:color="referenceName ? '#63e2b7' : '#ffffff'"
					@click="isModalReferenceName = true"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="icon">
						<title>notebook--reference</title>
						<polygon points="4 20 4 22 7.586 22 2 27.586 3.414 29 9 23.414 9 27 11 27 11 20 4 20" />
						<rect x="19" y="10" width="7" height="2" />
						<rect x="19" y="15" width="7" height="2" />
						<rect x="19" y="20" width="7" height="2" />
						<path
							d="M28,5H4A2.002,2.002,0,0,0,2,7V17H4V7H15V27H28a2.002,2.002,0,0,0,2-2V7A2.002,2.002,0,0,0,28,5ZM17,25V7H28l.0015,18Z"
						/>
						<rect
							id="_Transparent_Rectangle_"
							data-name="&lt;Transparent Rectangle&gt;"
							fill="none"
							width="32"
							height="32"
						/>
					</svg>
				</n-icon>
			</div>
			<n-modal v-model:show="isModalReferenceName">
				<n-card
					style="width: 450px"
					title="Reference Name"
					:bordered="false"
					size="huge"
					role="dialog"
					aria-modal="true"
					content-class="flex flex-col items-end justify-center gap-4"
				>
					<n-input v-model:value="referenceNameValue" />
					<n-button type="primary" @click="onSubmitForm">OK</n-button>
				</n-card>
			</n-modal>
		</template>
		<template v-else>
			<span :class="classes.wrapper" v-html="labelCustom"></span>
			<ElementInfo><slot name="info" /></ElementInfo>
		</template>
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
import { NInput, NIcon, NModal, NCard, NButton } from "naive-ui"
import { debounce } from "lodash"
import { ref, watch } from "vue"
export default {
	...ElementLabel,
	...EditorElementTemplate,
	components: {
		...ElementLabel.components,
		NInput,
		NIcon,
		NModal,
		NCard,
		NButton
	},
	props: {
		...ElementLabel.props,
		referenceName: {
			type: String,
			default: ""
		}
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
			...EditorElementTemplate.data(),
			isModalReferenceName: false,
			referenceNameValue: "",
			isDevMode: import.meta.env.VITE_DEV_MODE
		}
	},
	computed: {
		...ElementLabel.computed,
		...EditorElementTemplate.computed,
		labelCustom: {
			get() {
				const result = this.label?.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
					if (
						this.labelForm?.LabelFormValue?.value?.json[`${this?.el$?.name}.${p1}`] &&
						this.labelForm?.LabelFormValue?.value?.json
					) {
						const check = /\[\[(.*?)\]\]/.test(
							this.labelForm.LabelFormValue.value.json[`${this.el$.name}.${p1}`]
						)
						if (check) {
							return this.replaceListTextWithObject(
								this.labelForm.LabelFormValue.value.json[`${this.el$.name}.${p1}`],
								this.labelForm.LabelFormValue.value.json
							)
						} else return this.labelForm.LabelFormValue.value.json[`${this.el$.name}.${p1}`]
					}
					return match
				})
				return result
			},
			set(value) {
				this.labelCustomData = value
			}
		},
		watchMultipleValue: {
			get() {
				return { label: this.label, referenceName: this.referenceName }
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
		onSubmitForm(e) {
			e.preventDefault()
			this.update.updateValue("", this.el$.fieldId, { referenceName: this.referenceNameValue })
			this.isModalReferenceName = false
		},
		replaceListTextWithObject(keyName, object) {
			const result = keyName.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
				const check = /\[\[(.*?)\]\]/.test(object[`${this.el$.name}.${p1}`])
				if (check) {
					return replaceListTextWithObject(match, object)
				} else {
					if (this.referenceName) {
						return object[`${this.referenceName}.${p1}`] ? object[`${this.referenceName}.${p1}`] : match
					}
					return object[`${this.el$.name}.${p1}`] ? object[`${this.el$.name}.${p1}`] : match
				}
			})
			return result
		}
	},
	watch: {
		watchMultipleValue: {
			handler(val) {
				this.labelCustomData = val.label
				this.referenceNameValue = val.referenceName
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