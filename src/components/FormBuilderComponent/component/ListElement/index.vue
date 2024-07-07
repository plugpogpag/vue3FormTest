<template>
	<component :is="elementLayout" ref="container" v-bind="{ ...$props }">
		<template #element>
			<!-- Sorting container -->
			<div :class="classes.list" role="list" :aria-labelledby="labelId" ref="list">
				<div
					v-for="(val, i) in value"
					:key="i"
					:class="classes.listItem"
					role="listitem"
					:data-id="`${path}-${i}`"
				>
					<slot :index="i">
						<component
							:is="component(prototype)"
							v-if="prototype.type"
							v-bind="prototype"
							:name="i"
							:key="i"
						/>
					</slot>

					<!-- Sort handle -->
					<span v-if="hasSort" :class="classes.handle" data-handle>
						<span :class="classes.handleIcon"></span>
					</span>

					<!-- Remove button -->
					<div
						v-if="hasRemove"
						:aria-roledescription="form$.translations.vueform.a11y.list.remove"
						:class="classes.remove"
						:id="`${path}-${i}-remove-button`"
						@click.prevent="handleRemove(i)"
						@keypress.space.enter="handleRemove(i)"
						role="button"
						tabindex="0"
					>
						<span :class="classes.removeIcon"></span>
					</div>
				</div>
			</div>

			<!-- Add button -->
			<div class="w-full flex justify-center items-center">
				<div
					v-if="hasAdd"
					:class="classes.add"
					class="!p-2 !rounded-full"
					:id="`${fieldId}-add-button`"
					@click.prevent="handleAdd"
					@keypress.enter.space="handleAdd"
					role="button"
					tabindex="0"
				>
					<n-icon size="40px">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							fill="#fffff"
							version="1.1"
							id="Capa_1"
							viewBox="0 0 490 490"
							xml:space="preserve"
						>
							<g>
								<g>
									<g>
										<path
											d="M227.8,174.1v53.7h-53.7c-9.5,0-17.2,7.7-17.2,17.2s7.7,17.2,17.2,17.2h53.7v53.7c0,9.5,7.7,17.2,17.2,17.2     s17.1-7.7,17.1-17.2v-53.7h53.7c9.5,0,17.2-7.7,17.2-17.2s-7.7-17.2-17.2-17.2h-53.7v-53.7c0-9.5-7.7-17.2-17.1-17.2     S227.8,164.6,227.8,174.1z"
										/>
										<path
											d="M71.7,71.7C25.5,118,0,179.5,0,245s25.5,127,71.8,173.3C118,464.5,179.6,490,245,490s127-25.5,173.3-71.8     C464.5,372,490,310.4,490,245s-25.5-127-71.8-173.3C372,25.5,310.5,0,245,0C179.6,0,118,25.5,71.7,71.7z M455.7,245     c0,56.3-21.9,109.2-61.7,149s-92.7,61.7-149,61.7S135.8,433.8,96,394s-61.7-92.7-61.7-149S56.2,135.8,96,96s92.7-61.7,149-61.7     S354.2,56.2,394,96S455.7,188.7,455.7,245z"
										/>
									</g>
								</g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
							</g>
						</svg>
					</n-icon>
					<!-- <h3 v-html="addLabel"></h3> -->
				</div>
			</div>
		</template>

		<!-- Default element slots -->
		<template v-for="(component, slot) in elementSlots" #[slot]>
			<slot :name="slot" :el$="el$"><component :is="component" :el$="el$" /></slot>
		</template>
	</component>
</template>
  
  <script>
import { defineElement, ListElement } from "@vueform/vueform"
import { ListElement as EditorElementTemplate } from "@vueform/vueform/dist/vueform"
import { ref, reactive, inject, watch } from "vue"
import { NIcon } from "naive-ui"
export default {
	...ListElement, // adding props, mixins, emits
	...EditorElementTemplate,
	components: {
		...ListElement.components,
		NIcon
	},
	name: "ListElement"
}
</script>
  
  <style lang="scss">
</style>