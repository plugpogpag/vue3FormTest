<template>
	<div className="svelte-jsoneditor-vue" ref="editor"></div>
</template>
  
  <script>
import { JSONEditor } from "vanilla-jsoneditor"

// JSONEditor properties as of version 0.3.60
const propNames = [
	"content",
	"mode",
	"mainMenuBar",
	"navigationBar",
	"statusBar",
	"readOnly",
	"indentation",
	"tabSize",
	"escapeControlCharacters",
	"escapeUnicodeCharacters",
	"validator",
	"onError",
	"onChange",
	"onChangeMode",
	"onClassName",
	"onRenderValue",
	"onRenderMenu",
	"queryLanguages",
	"queryLanguageId",
	"onChangeQueryLanguage",
	"onFocus",
	"onBlur",
]

function pickDefinedProps(object, propNames) {
	const props = {}
	for (const propName of propNames) {
		if (object[propName] !== undefined) {
			props[propName] = object[propName]
		}
	}
	return props
}

export default {
	name: "VueJSONEditor",
	props: propNames,
	mounted() {
        const props= pickDefinedProps(this, propNames)
		this.editor = new JSONEditor({
			target: this.$refs["editor"],
            props,
		})
        // const contentEditor= this.editor.get()
		// this.editor.update({...contentEditor,...content})
		this.editor.expand(true)
		// this.editor.refresh()
	},
  
	updated() {
        const props= pickDefinedProps(this, propNames)
		this.editor.updateProps(props)
        // const contentEditor= this.editor.get()
		// this.editor.update({...contentEditor,...content})
		// this.editor.expand(true)
        this.editor.refresh()
	},
	beforeUnmount() {
		this.editor.destroy()
		this.editor = null
	}
}
</script>
  
  <style scoped>
.svelte-jsoneditor-vue {
	display: flex;
	flex: 1;
}
</style>