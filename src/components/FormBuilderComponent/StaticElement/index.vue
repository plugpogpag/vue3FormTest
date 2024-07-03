<template>
	<component v-if="wrap" :is="elementLayout" ref="container">
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
					<div v-if="allowHtml">
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
						<component
							:is="tag"
							v-html="labelCustom"
							v-bind="attrs"
							v-else
							@click="editModeElementText"
						></component>
					</div>

					<div v-else>
						<component :is="tag" v-bind="attrs">{{ resolvedContent }}</component>
					</div>
				</div>
			</template>

			<!-- If content is component -->
			<component v-else-if="resolvedContent" :is="componentContent" :el$="el$" />

			<!-- If content is a slot -->
			<slot v-else :el$="el$"><component :is="slotContent" :el$="el$" /></slot>
		</template>

		<!-- Default element slots -->
		<template v-for="(component, slot) in elementSlots" #[slot]>
			<slot :name="slot" :el$="el$"><component :is="component" :el$="el$" /></slot>
		</template>
	</component>

	<div v-else-if="content && isHtml" :class="classes.content" v-html="resolvedContent"></div>

	<component v-else-if="content" :is="componentContent" ref="container" />

	<div v-else :class="classes.container" ref="container">
		<slot :el$="el$"><component :is="slotContent" :el$="el$" /></slot>
	</div>
</template>

<script>
import { ref, inject, watch, computed } from "vue"
import { defineElement, StaticElement } from "@vueform/vueform"
import { StaticElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { NInput } from "naive-ui"
import { debounce } from "lodash"
export default defineElement({
	...StaticElement, // adding props, mixins, emits
	...EditorElementTemplate, // adding data, computed, methods
	components: {
		...StaticElement.components,
		NInput
	},
	setup(props, context) {
		const el$ = inject("el$")
		const update = inject("update")
		const labelForm = inject("labelForm")
		const titleValue = ref(props.content)
		const isLoading = ref(false)
		const element = StaticElement.setup(props, context)
		const active = ref(false)
		const inputTextElement = ref(null)
		function updateInput(value) {
			titleValue.value = value
			isLoading.value = true
			updateLabelValue(value)
		}
		function extractLabels(text) {
			const regex = /\[\[\s*(.*?)\s*\]\]/g
			const matches = []
			let match

			while ((match = regex.exec(text)) !== null) {
				matches.push(match[1]) // Capture the name inside the brackets
			}

			return matches
		}
		const updateLabelValue = debounce(value => {
			titleValue.value = value
			update.updateValue("content", `${el$.value.fieldId}.${props.name}`, value)
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
				const labels = extractLabels(props.content)
				console.log("labels", labels)
				if (props.content) {
					if (labels.length > 0) {
						labels.map(label => {
							labelForm.updateLabelForm("content", el$.value.fieldId, label, "data")
						})
					} else {
						labelForm.updateLabelForm("content", el$.value.fieldId, null, props.content)
					}
				}
			},
			{ immediate: true, deep: true }
		)
		const labelCustom = computed({
			get() {
				if (!titleValue.value) {
					return titleValue.value
				} else {
					const labels = extractLabels(titleValue.value)
					if (labels.length > 0) {
						const labelArray = labels?.map(label => {
							if (label) {
								return labelForm.LabelFormValue.value.json[`${el$.value.fieldId}.content.${label}`] || ""
							}
						})
						return labelArray.join("")
					}
					return titleValue.value
				}
			},
			set(value) {
				titleValue.value = value
			}
		})
		function inputBlurHandle() {
			active.value = false
		}
		return {
			...element,
			...defaultClasses,
			titleValue,
			updateInput,
			active,
			editModeElementText,
			inputTextElement,
			inputBlurHandle,
			isLoading,
			labelCustom
		}
	}
})
</script>




