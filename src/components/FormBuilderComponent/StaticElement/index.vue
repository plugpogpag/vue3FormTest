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
						<n-input v-model:value="titleValue" type="text" placeholder="Basic Input" :on-update:value="updateInput" v-if="active" />
						<component :is="tag"  v-html="titleValue" v-bind="attrs" v-else @click="active=true"></component>
						
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
import { ref,inject } from "vue"
import { defineElement, StaticElement } from "@vueform/vueform"
import { StaticElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { NInput } from "naive-ui"
import { debounce } from "lodash"
export default defineElement({
	...StaticElement, // adding props, mixins, emits
	...EditorElementTemplate, // adding data, computed, methods
	components: {
		...StaticElement.components,
		NInput,
	},
	setup(props, context) {
		const el$ = inject("el$")
		const update = inject("update")
		const titleValue = ref(props.content)
		const element = StaticElement.setup(props, context)
		const active = ref(false)
		function updateInput(value){
            titleValue.value = value
            updateLabelValue(value)
        }
		const updateLabelValue = debounce(value => {
			titleValue.value = value
			update.updateValue('content',`${el$.value.fieldId}.${props.name}`, value)
            active.value = false
		}, 500)
		const defaultClasses = ref({
			...EditorElementTemplate.data().defaultClasses
		})
		return {
			...element,
			...defaultClasses,
			titleValue,
			updateInput,
			active
		}
	}
})
</script>




