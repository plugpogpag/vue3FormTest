<template>
	<component
		v-if="wrap"
		:is="elementLayout"
		ref="container"
		v-bind="{ referenceName: props?.referenceName, parentName: props?.name }"
	>
		<template #element>
			<!-- If content is HTML -->
			<template v-if="isHtml && (resolvedContent || ['img', 'hr'].indexOf(tag) !== -1)">
				<div v-if="!tag && allowHtml" :class="classes.content" v-html="resolvedContent" v-bind="attrs"></div>
				<div v-if="!tag && !allowHtml" :class="classes.content" v-bind="attrs">{{ content }}</div>

				<div v-if="tag === 'a'" :class="classes.tag">
					<a v-if="allowHtml" :href="href" :target="target" v-bind="attrs" v-html="resolvedContent"></a>
					<a v-else :href="href" :target="target" v-bind="attrs">{{ resolvedContent }}</a>
				</div>

				<div v-else-if="tag === 'hr'" :class="classes.tag">
					<hr v-bind="attrs" />
				</div>

				<div v-else-if="tag === 'img'" :class="classes.tag">
					<a v-if="href" :href="href" :target="target">
						<img :src="src" :alt="alt" :title="title" :width="width" :height="height" v-bind="attrs" />
					</a>
					<img v-else :src="src" :alt="alt" :title="title" :width="width" :height="height" v-bind="attrs" />
				</div>
				<div v-else :class="classes.tag">
					<template v-if="isDevMode">
						<template v-if="allowHtml">
							<n-input
								v-model:value="titleValue"
								type="text"
								placeholder="Basic Input"
								:on-update:value="updateInput"
								v-if="active"
								ref="inputTextElement"
								@blur="inputBlurHandle"
								:loading="isLoading"
							/>
							<div v-else class="flex items-center gap-2">
								<component
									:is="tag"
									v-html="labelCustom"
									v-bind="attrs"
									@click="editModeElementText"
								></component>
								<n-tooltip trigger="hover">
									<template #trigger>
										<n-icon
											class="text-sm cursor-pointer"
											:color="referenceName ? '#63e2b7' : '#ffffff'"
											@click="isModalReferenceName = true"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="icon">
												<title>notebook--reference</title>
												<polygon
													points="4 20 4 22 7.586 22 2 27.586 3.414 29 9 23.414 9 27 11 27 11 20 4 20"
												/>
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
									</template>
									<span v-if="referenceName">{{ referenceName }}</span>
									<span v-else>{{ name }}</span>
								</n-tooltip>

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
							</div>
						</template>
						<template v-else>
							<component :is="tag" v-bind="attrs">{{ resolvedContent }}</component>
						</template>
					</template>
					<template v-else>
						<component :is="tag" v-if="allowHtml" v-html="labelCustom" v-bind="attrs"></component>
						<component :is="tag" v-else v-bind="attrs">{{ resolvedContent }}</component>
					</template>
				</div>
			</template>

			<!-- If content is component -->
			<component
				v-else-if="resolvedContent"
				:is="componentContent"
				:el$="el$"
				v-bind="{ referenceName: props?.referenceName, parentName: props?.name }"
			/>

			<!-- If content is a slot -->
			<slot v-else :el$="el$">
				<component
					:is="slotContent"
					:el$="el$"
					v-bind="{ referenceName: props?.referenceName, parentName: props?.name }"
				/>
			</slot>
		</template>

		<!-- Default element slots -->
		<template v-for="(component, slot) in elementSlots" #[slot]>
			<slot :name="slot" :el$="el$">
				<component
					:is="component"
					:el$="el$"
					v-bind="{ referenceName: props?.referenceName, parentName: props?.name }"
				/>
			</slot>
		</template>
	</component>

	<div v-else-if="content && isHtml" :class="classes.content" v-html="resolvedContent"></div>

	<component
		v-else-if="content"
		:is="componentContent"
		ref="container"
		v-bind="{ referenceName: props?.referenceName, parentName: props?.name }"
	/>

	<div v-else :class="classes.container" ref="container">
		<slot :el$="el$">
			<component
				:is="slotContent"
				:el$="el$"
				v-bind="{ referenceName: props?.referenceName, parentName: props?.name }"
			/>
		</slot>
	</div>
</template>

<script>
import { ref, inject, watch, computed, onMounted } from "vue"
import { defineElement, StaticElement } from "@vueform/vueform"
import { StaticElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { NInput, NIcon, NModal, NCard, NButton, NTooltip } from "naive-ui"
import { debounce } from "lodash"
export default defineElement({
	...StaticElement, // adding props, mixins, emits
	...EditorElementTemplate, // adding data, computed, methods
	props: {
		...StaticElement.props,
		referenceName: {
			type: String,
			default: ""
		}
	},
	components: {
		...StaticElement.components,
		NInput,
		NIcon,
		NModal,
		NCard,
		NButton,
		NTooltip
	},
	setup(props, context) {
		const isDevMode = import.meta.env.VITE_DEV_MODE
		const el$ = inject("el$")
		const update = inject("update")
		const labelForm = inject("labelForm")
		const titleValue = ref(props.content)
		const isLoading = ref(false)
		const element = StaticElement.setup(props, context)
		const active = ref(false)
		const inputTextElement = ref(null)
		const isModalReferenceName = ref(false)
		const referenceNameValue = ref("")
		function updateInput(value) {
			titleValue.value = value
			isLoading.value = true
			updateLabelValue(value)
		}
		const updateLabelValue = debounce(value => {
			const key = [el$?.value?.fieldId || "", props.name].filter(Boolean).join(".")
			update.updateValue("content", key, value)
			isLoading.value = false
		}, 500)
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
		function editModeElementText(e) {
			e.preventDefault()
			active.value = true
		}
		watch(inputTextElement, inputElement => {
			if (inputElement) inputElement.focus()
		})
		watch(
			props,
			() => {
				titleValue.value = props.content
				referenceNameValue.value = props.referenceName
			},
			{ immediate: true, deep: true }
		)
		const labelCustom = computed({
			get() {
				const result = props.content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
					if (labelForm?.LabelFormValue?.value) {
						if (props.referenceName) {
							return labelForm?.LabelFormValue.value[`${props.referenceName}.${p1}`] || false
								? labelForm?.LabelFormValue.value[`${props.referenceName}.${p1}`]
								: match
						} else {
							return labelForm?.LabelFormValue.value[`${props.name}.${p1}`] || false
								? labelForm?.LabelFormValue.value[`${props.name}.${p1}`]
								: match
						}
					}
					return match
				})
				return result
			},
			set(value) {
				titleValue.value = value
			}
		})
		function inputBlurHandle() {
			active.value = false
		}
		function onSubmitForm(e) {
			e.preventDefault()
			const key = [el$?.value?.fieldId || "", props.name].filter(Boolean).join(".")
			update.updateValue("", key, { referenceName: referenceNameValue.value })
			isModalReferenceName.value = false
		}
		return {
			...element,
			defaultClasses,
			titleValue,
			updateInput,
			active,
			editModeElementText,
			inputTextElement,
			inputBlurHandle,
			isLoading,
			labelCustom,
			props,
			isModalReferenceName,
			onSubmitForm,
			referenceNameValue,
			isDevMode
		}
	}
})
</script>




