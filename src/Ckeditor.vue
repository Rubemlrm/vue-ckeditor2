<template>
  <div class="ckeditor">
    <textarea
      :name="name"
      :id="id"
      :value="value"
      :types="types"
      :config="config"
      :read-only="readOnly"
    >
    </textarea>
  </div>
</template>

<script>
  let inc = new Date().getTime()

  export default {
    name: 'vue-ckeditor',
    props: {
      name: {
        type: String,
        default: () => `editor-${++inc}`
      },
      value: {
        type: String
      },
      id: {
        type: String,
        default: () => `editor-${inc}`
      },
      types: {
        type: String,
        default: () => `classic`
      },
      config: {
        type: Object,
        default: () => {}
      },
      readOnly: {
        type: Boolean,
        default: () => true
      }
    },
    data() {
      return {
        destroyed: false,
        mergedConfig: {},
        defaultConfigOptions: {
          toolbar: [
            { name: 'clipboard', items: ['Undo', 'Redo'] },
            {
              name: 'basicstyles',
              items: [
                'Bold',
                'Italic',
                'Underline',
                'Strike',
                'RemoveFormat',
                'CopyFormatting'
              ]
            },
            {
              name: 'align',
              items: [
                'JustifyLeft',
                'JustifyCenter',
                'JustifyRight',
                'JustifyBlock'
              ]
            },
            {
              name: 'paragraph',
              items: [
                'NumberedList',
                'BulletedList',
                '-',
                'Outdent',
                'Indent',
                '-',
                'Blockquote'
              ]
            }
          ],
          fontSize_defaultLabel: '12px',
          autoParagraph: false,
          allowedContent: false,
          customConfig: '',
          disallowedContent: 'img{width,height,float}',
          extraAllowedContent: 'img[width,height,align]',
          height: 300,
          bodyClass: 'document-editor',
          format_tags: 'p;h1;h2;h3;pre',
          removeDialogTabs: 'image:advanced;link:advanced',
          stylesSet: [
            /* Inline Styles */
            {
              name: 'Marker',
              element: 'span',
              attributes: { class: 'marker' }
            },
            { name: 'Cited Work', element: 'cite' },
            { name: 'Inline Quotation', element: 'q' },
            /* Object Styles */
            {
              name: 'Special Container',
              element: 'div',
              styles: {
                padding: '5px 10px',
                background: '#eee',
                border: '1px solid #ccc'
              }
            },
            {
              name: 'Compact table',
              element: 'table',
              attributes: {
                cellpadding: '5',
                cellspacing: '0',
                border: '1',
                bordercolor: '#ccc'
              },
              styles: {
                'border-collapse': 'collapse'
              }
            },
            {
              name: 'Borderless Table',
              element: 'table',
              styles: {
                'border-style': 'hidden',
                'background-color': '#E6E6FA'
              }
            },
            {
              name: 'Square Bulleted List',
              element: 'ul',
              styles: { 'list-style-type': 'square' }
            }
          ]
        }
      }
    },
    computed: {
      instance() {
        return CKEDITOR.instances[this.id]
      }
    },
    watch: {
      value(val) {
        try {
          if (this.instance) {
            this.update(val)
          }
        } catch (e) {}
      },
      readOnly(value) {
        try {
          if (this.instance) {
            this.instance.setReadOnly(value)
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    mounted() {
      Object.extend = function(defaultOptions, userOptions) {
        for (var property in userOptions) {
          if (
            userOptions.hasOwnProperty(property) &&
            Array.isArray(userOptions[property])
          ) {
            for (var index in userOptions[property]) {
              for (var index2 in defaultOptions[property]) {
                if (
                  defaultOptions[property][index2]['name'] ==
                  userOptions[property][index]['name']
                ) {
                  defaultOptions[property][index2] = userOptions[property][index]
                }
              }
            }
          } else if (
            userOptions.hasOwnProperty(property) &&
            typeof userOptions[property] === 'object'
          ) {
            Object.extend(defaultOptions[property], userOptions[property])
          } else if (userOptions.hasOwnProperty(property)) {
            defaultOptions[property] = userOptions[property]
          }
        }
        return defaultOptions
      }
      this.mergedConfig = Object.extend(this.defaultConfigOptions, this.config)
      this.create()
    },
    beforeDestroy() {
      this.destroy()
    },
    methods: {
      create() {
        if (typeof CKEDITOR === 'undefined') {
          console.log('CKEDITOR is missing (http://ckeditor.com/)')
        } else {
          if (this.types === 'inline') {
            CKEDITOR.inline(this.id, this.mergedConfig)
          } else {
            CKEDITOR.replace(this.id, this.mergedConfig)
          }
          this.instance.setData(this.value)
          this.instance.on('instanceReady', () => {
            this.instance.setData(this.value)
          })
          this.instance.on('change', this.onChange)
          this.instance.on('blur', this.onBlur)
          this.instance.on('focus', this.onFocus)
        }
        CKEDITOR.on('instanceReady', event => {
          event.editor.setReadOnly(this.readOnly)
        })
      },
      update(val) {
        let html = this.instance.getData()
        if (html !== val) {
          this.instance.setData(val, { internal: false })
        }
      },
      destroy() {
        if (!this.destroyed) {
          this.instance.focusManager.blur(true)
          this.instance.removeAllListeners()
          this.instance.destroy()
          this.destroyed = true
        }
      },
      onChange() {
        let html = this.instance.getData()
        this.$emit('change', html)
      },
      onBlur() {
        this.$emit('blur', this.instance)
      },
      onFocus() {
        this.$emit('focus', this.instance)
      }
    }
  }
</script>
<style>
  .ckeditor::after {
    content: '';
    display: table;
    clear: both;
  }
</style>