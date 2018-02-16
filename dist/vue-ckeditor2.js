(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueCkeditor2 = factory());
}(this, (function () { 'use strict';

(function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=" .ckeditor::after { content: \"\"; display: table; clear: both; } "; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();














var inc = new Date().getTime();

var Ckeditor = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"ckeditor"},[_c('textarea',{attrs:{"name":_vm.name,"id":_vm.id,"types":_vm.types,"config":_vm.config,"read-only":_vm.readOnly},domProps:{"value":_vm.value}})])},staticRenderFns: [],
  name: "vue-ckeditor",
  props: {
    name: {
      type: String,
      default: function () { return ("editor-" + (++inc)); }
    },
    value: {
      type: String
    },
    id: {
      type: String,
      default: function () { return ("editor-" + inc); }
    },
    types: {
      type: String,
      default: function () { return "classic"; }
    },
    config: {
      type: Object,
      default: function () {
        return {
          toolbar: [
            { name: "clipboard", items: ["Undo", "Redo"] },
            {
              name: "basicstyles",
              items: [
                "Bold",
                "Italic",
                "Underline",
                "Strike",
                "RemoveFormat",
                "CopyFormatting"
              ]
            },
            {
              name: "align",
              items: [
                "JustifyLeft",
                "JustifyCenter",
                "JustifyRight",
                "JustifyBlock"
              ]
            },
            {
              name: "paragraph",
              items: [
                "NumberedList",
                "BulletedList",
                "-",
                "Outdent",
                "Indent",
                "-",
                "Blockquote"
              ]
            }
          ],
          fontSize_defaultLabel: "12px",
          autoParagraph: false,
          customConfig: "",
          disallowedContent: "img{width,height,float}",
          extraAllowedContent: "img[width,height,align]",
          height: 300,
          bodyClass: "document-editor",
          format_tags: "p;h1;h2;h3;pre",
          removeDialogTabs: "image:advanced;link:advanced",
          stylesSet: [
            /* Inline Styles */
            {
              name: "Marker",
              element: "span",
              attributes: { class: "marker" }
            },
            { name: "Cited Work", element: "cite" },
            { name: "Inline Quotation", element: "q" },
            /* Object Styles */
            {
              name: "Special Container",
              element: "div",
              styles: {
                padding: "5px 10px",
                background: "#eee",
                border: "1px solid #ccc"
              }
            },
            {
              name: "Compact table",
              element: "table",
              attributes: {
                cellpadding: "5",
                cellspacing: "0",
                border: "1",
                bordercolor: "#ccc"
              },
              styles: {
                "border-collapse": "collapse"
              }
            },
            {
              name: "Borderless Table",
              element: "table",
              styles: {
                "border-style": "hidden",
                "background-color": "#E6E6FA"
              }
            },
            {
              name: "Square Bulleted List",
              element: "ul",
              styles: { "list-style-type": "square" }
            }
          ]
        };
      }
    },
    readOnly: {
      type: Boolean,
      default: function () { return true; }
    }
  },
  data: function data() {
    return { destroyed: false };
  },
  computed: {
    instance: function instance() {
      return CKEDITOR.instances[this.id];
    }
  },
  watch: {
    value: function value(val) {
      try {
        if (this.instance) {
          this.update(val);
        }
      } catch (e) {}
    },
    readOnly: function readOnly(value) {
      try {
        if (this.instance) {
          this.instance.setReadOnly(value);
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted: function mounted() {
    this.create();
  },
  beforeDestroy: function beforeDestroy() {
    this.destroy();
  },
  methods: {
    create: function create() {
      var this$1 = this;

      if (typeof CKEDITOR === "undefined") {
        console.log("CKEDITOR is missing (http://ckeditor.com/)");
      } else {
        if (this.types === "inline") {
          CKEDITOR.inline(this.id, this.config);
        } else {
          CKEDITOR.replace(this.id, this.config);
        }
        this.instance.setData(this.value);
        this.instance.on("instanceReady", function () {
          this$1.instance.setData(this$1.value);
        });
        this.instance.on("change", this.onChange);
        this.instance.on("blur", this.onBlur);
        this.instance.on("focus", this.onFocus);
      }
      CKEDITOR.on("instanceReady", function (event) {
        event.editor.setReadOnly(this$1.readOnly);
      });
    },
    update: function update(val) {
      var html = this.instance.getData();
      if (html !== val) {
        this.instance.setData(val, { internal: false });
      }
    },
    destroy: function destroy() {
      if (!this.destroyed) {
        this.instance.focusManager.blur(true);
        this.instance.removeAllListeners();
        this.instance.destroy();
        this.destroyed = true;
      }
    },
    onChange: function onChange() {
      var html = this.instance.getData();
      this.$emit("change", html);
    },
    onBlur: function onBlur() {
      this.$emit("blur", this.instance);
    },
    onFocus: function onFocus() {
      this.$emit("focus", this.instance);
    }
  }
};

return Ckeditor;

})));
//# sourceMappingURL=vue-ckeditor2.js.map
