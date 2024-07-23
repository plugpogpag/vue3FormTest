<template>
	<component
		:is="elementLayout"
		ref="container"
		v-bind="{ referenceName: props?.referenceName, parentName: props?.name }"
	>
		<template #element>
			<div :class="classes.inputContainer" class="relative">
				<ElementAddon v-if="hasAddonBefore" type="before">
					<slot name="addon-before"><component :is="fieldSlots['addon-before']" :el$="el$" /></slot>
				</ElementAddon>
				<ElementAddon v-if="hasAddonAfter" type="after">
					<slot name="addon-after"><component :is="fieldSlots['addon-after']" :el$="el$" /></slot>
				</ElementAddon>
				<ElementLabelFloating v-if="hasFloating && !empty" :visible="!empty" />
				<ElementLoader v-if="isLoading" />
				<!-- add tailwind class  absolute x center and right -20px-->

				<div class="top-[-4px] right-0 absolute z-10" v-if="!isDisabled && isDevMode">
					<n-icon
						class="text-sm cursor-pointer"
						:color="formValue.rules ? '#dc2626' : '#ffffff'"
						@click="isModalRequired = true"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4 0a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V4a4 4 0 00-4-4H4zm0 4.75A.75.75 0 014.75 4h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 014 4.75zm9.78 5.72a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-1.25-1.25a.75.75 0 111.06-1.06l.72.72 1.72-1.72a.75.75 0 011.06 0zM4 8a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 014 8zm0 3.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z"
							/>
						</svg>
					</n-icon>
					<n-modal v-model:show="isModalRequired">
						<n-card
							style="width: 450px"
							title="required"
							:bordered="false"
							size="huge"
							role="dialog"
							aria-modal="true"
						>
							<n-form>
								<n-form-item label="Required">
									<n-switch
										v-model:value="formValue.rules"
										checked-value="required"
										unchecked-value=""
									/>
								</n-form-item>
								<n-form-item label="Select Input Type ">
									<n-radio-group v-model:value="formValue.inputType" name="radiogroup">
										<n-space>
											<n-radio
												v-for="song in listTypeInputText"
												:key="song.value"
												:value="song.value"
												:label="song.label"
											/>
										</n-space>
									</n-radio-group>
								</n-form-item>
								<n-form-item label="Message">
									<n-input v-model:value="formValue.messages.required" />
								</n-form-item>
							</n-form>
							<n-button type="primary" @click="onSubmitForm">OK</n-button>
						</n-card>
					</n-modal>
				</div>

				<input
					:value="model"
					:type="inputType"
					:name="name"
					:id="fieldId"
					:class="classes.input"
					:placeholder="Placeholder"
					:autocomplete="autocomplete"
					:disabled="isDisabled"
					:readonly="readonly"
					v-bind="{
						...attrs,
						...aria
					}"
					@keydown="handleKeydown"
					@keyup="handleKeyup"
					@keypress="handleKeypress"
					@input="handleInput"
					@select="handleInput"
					@blur="handleBlur"
					ref="input"
				/>
			</div>
		</template>
		<!-- Default element slots -->
		<template v-for="(component, slot) in elementSlots" #[slot]>
			<slot :name="slot" :el$="el$">
				<component :is="component" :el$="el$" />
			</slot>
		</template>
	</component>
</template>
  
  <script>
import { defineElement, TextElement } from "@vueform/vueform"
import { TextElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { ref, reactive, inject, watch } from "vue"
import { NIcon, NModal, NCard, NForm, NFormItem, NButton, NSwitch, NInput ,NRadioGroup,NRadio,NSpace} from "naive-ui"
export default defineElement({
	...TextElement, // adding props, mixins, emits
	...EditorElementTemplate,
	props: {
		...TextElement.props,
		referenceName: {
			type: String,
			default: ""
		}
	},
	components: {
		...TextElement.components,
		NIcon,
		NModal,
		NCard,
		NForm,
		NFormItem,
		NButton,
		NSwitch,
		NInput,
		NRadioGroup,
		NRadio,
		NSpace
	},
	setup(props, context) {
		const isDevMode = import.meta.env.VITE_DEV_MODE
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
		const element = TextElement.setup(props, context)
		const update = inject("update")
		const el$ = inject("el$")
		const isModalRequired = ref(false)
		const DEFAULT_VALUE = {
			rules: "required",
			messages: {
				required: "required"
			},
			inputType: null
		}
		const formValue = reactive(DEFAULT_VALUE)
		watch(
			props,
			() => {
				const { rules, messages,inputType } = props
				Object.assign(formValue, { rules, messages, inputType})
			},
			{ deep: true, immediate: true }
		)
		function onSubmitForm(e) {
			e.preventDefault()
			const key = [el$?.value?.fieldId || "", props.name].filter(Boolean).join(".")
			update.updateValue("", key, formValue)
			isModalRequired.value = false
		}
		const listTypeInputText = [
			{ value: "text", label: "Text" },
			{ value: "number", label: "Number" }
		]
		return {
			...element,
			defaultClasses,
			props,
			isModalRequired,
			onSubmitForm,
			formValue,
			isDevMode,
			listTypeInputText,
		}
	}
})
</script>