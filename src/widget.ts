// Copyright (c) Chung Chan
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

// Codemirror
import {EditorView, keymap} from "@codemirror/view"
import {editorSetup} from "./editorsetup"
import {EditorState} from "@codemirror/state"
import {javascript} from "@codemirror/lang-javascript"
import {html} from "@codemirror/lang-html"


export class JSWidgetModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'JSWidgetModel',
      _view_name: 'JSWidgetView',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
      js: '// some code here',
      html: '<!-- some code here -->',
      height: 600,
      width: 600
    }
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };
}

export class JSWidgetView extends DOMWidgetView {

  private widgetContainer: HTMLDivElement;
  private tabContainer: HTMLDivElement;
  private jsTab: HTMLDivElement;
  private htmlTab: HTMLDivElement;
  private editorContainer: HTMLDivElement;
  private jsContainer: HTMLDivElement;
  private htmlContainer: HTMLDivElement;
  private outputContainer: HTMLDivElement;
  private outputIFrame: HTMLIFrameElement;
  private outputDocument: Document;
  private jsScript: HTMLScriptElement;
  private controlContainer: HTMLDivElement;
  private showBtn: HTMLButtonElement;
  private runBtn: HTMLButtonElement;
  // private mathjaxURL: string;
  private jsView: EditorView;
  private htmlView: EditorView;

  render() {
    const runKeys = keymap.of([
      {
          key: "Ctrl-Enter", run: (() => {
            this.run()
            return true;
          }).bind(this),
      },
      {
        key: "Alt-Shift-Enter", run: (() => {
          this.run()
          return true;
        }).bind(this),
      }
    ]);

    this.jsTab = document.createElement('div');
    this.htmlTab = document.createElement('div');
    this.jsTab.innerHTML = "JS";
    this.htmlTab.innerHTML = "HTML";
    this.jsTab.classList.add("active-tab");
    this.tabContainer = document.createElement('div');
    this.tabContainer.className = "tab-container";
    this.jsTab.onclick = (() => {
      this.htmlTab.classList.remove("active-tab");
      this.jsTab.classList.add("active-tab");
      this.htmlContainer.style.display = "none";
      this.jsContainer.style.display = "block";
    }).bind(this);
    this.htmlTab.onclick = (() => {
      this.htmlTab.classList.add("active-tab");
      this.jsTab.classList.remove("active-tab");
      this.htmlContainer.style.display = "block";
      this.jsContainer.style.display = "none";
    }).bind(this);
    this.tabContainer.appendChild(this.jsTab);
    this.tabContainer.appendChild(this.htmlTab);    

    this.jsContainer = document.createElement('div');
    this.jsContainer.className = "js-container";
    this.jsContainer.style.display = 'block';

    this.jsView = new EditorView({
      state: EditorState.create({
        doc: this.model.get('js'),
        extensions: [editorSetup, runKeys, javascript()]
      }),
      parent: this.jsContainer,
    });

    this.htmlContainer = document.createElement('div');
    this.htmlContainer.className = "html-container";
    this.htmlContainer.style.display = 'none';

    this.htmlView = new EditorView({
      state: EditorState.create({
        doc: this.model.get('html'),
        extensions: [editorSetup, runKeys, html()]
      }),
      parent: this.htmlContainer
    });

    this.editorContainer = document.createElement('div');
    this.editorContainer.style.display = 'none';
    this.editorContainer.className = 'editor-container';
    this.editorContainer.appendChild(this.jsContainer);
    this.editorContainer.appendChild(this.htmlContainer);
    
    let key_handler = (event: KeyboardEvent) => {
      // Similar to ipyevents, prevent some JupyterLab cell actions (undo/redo/run...) 
      // by capturing the corresponding shortcut keys while mouse is over the editorContainer.
      // Otherwise, codemirror will not be able to capture those keys for undo/redo/run...
      if (
        ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.code === "KeyZ") ||
        ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.code === "KeyY") ||
        ((event.metaKey || event.ctrlKey) && !event.altKey && event.shiftKey && event.code === "KeyZ") ||
        (!event.metaKey && !event.ctrlKey && !event.altKey && event.shiftKey && event.code === "Enter") ||
        (!event.metaKey && !event.ctrlKey && !event.altKey && event.code === "Tab")
      )
        {
        event.stopImmediatePropagation();
        event.preventDefault();
        let new_event = new KeyboardEvent(event.type, {
          altKey: true,
          code: event.code,
          ctrlKey: event.ctrlKey || event.code === "Tab",
          isComposing: event.isComposing,
          repeat: event.repeat,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          key: event.key
        });
        event.target!.dispatchEvent(new_event);
      }
    }
    
    this.editorContainer.addEventListener('focusin', ((event: Event) => { 
      window.addEventListener("keydown", key_handler, true);
      console.log('in',event)
      // this.editorContainer.focus({preventScroll:true});
    }).bind(this));
    this.editorContainer.addEventListener('focusout', ((event: Event) => { 
      window.removeEventListener("keydown", key_handler, true);
      console.log('out',event)
    }).bind(this));


    this.controlContainer = document.createElement('div');
    this.controlContainer.className = 'control-container';
    this.controlContainer.style.display = 'flex';
    this.showBtn = document.createElement('button');
    this.showBtn.innerText = 'scratch';
    this.showBtn.onclick = this.toggleCode.bind(this);
    this.runBtn = document.createElement('button');
    this.runBtn.innerText = 'run code';
    this.runBtn.title = 'Shift-Enter';
    this.runBtn.onclick = this.run.bind(this);
    this.runBtn.style.display = 'none';

    this.controlContainer.appendChild(this.showBtn);
    this.controlContainer.appendChild(this.runBtn);

    this.outputContainer = document.createElement('div');
    this.outputContainer.className = "output-container";
    this.outputIFrame = document.createElement('iframe');
    this.outputIFrame.height = "100%";
    this.outputIFrame.width = "100%";
    this.outputContainer.appendChild(this.outputIFrame);
    this.setHtml();

    this.widgetContainer = document.createElement('div');
    this.widgetContainer.className = "divewidget";
    this.widgetContainer.appendChild(this.outputContainer);
    this.widgetContainer.appendChild(this.controlContainer);
    this.widgetContainer.appendChild(this.tabContainer);
    this.widgetContainer.appendChild(this.editorContainer);
    this.el.appendChild(this.widgetContainer);

  }

  private run() {
    const html = this.htmlView.state.doc.toString();
    const js = this.jsView.state.doc.toString();
    this.model.set('html', html);
    this.model.set('js', js);
    this.model.save_changes();
  }

  /*
  Update the html in the output IFrame with the model html.
  */
  private setHtml() {
    this.outputIFrame.srcdoc = this.model.get('html');

    this.outputIFrame.onload = (function (this: JSWidgetView) {
      this.outputDocument = this.outputIFrame.contentDocument!;
      this.jsScript = this.outputDocument!.createElement('script');
      this.outputDocument.body.appendChild(this.jsScript);
      this.setJs();
      this.model.on('change:js', this.setJs, this);
      this.model.on('change:html', this.setHtml, this);
    }).bind(this);
  }

  /*
  Update the script element in the output container with the model js.
  */
  private setJs() {
    let script = this.outputDocument.createElement('script');
    script.innerHTML = `(function () {
      ${this.model.get('js')}
    })();`;
    this.outputDocument.body.replaceChild(script, this.jsScript);
    this.jsScript = script;
    this.outputContainer.style.height = (this.model.get('height')<0 ? this.outputDocument.body.scrollHeight : this.model.get('height')) + 'px';
    this.outputContainer.style.width = (this.model.get('width')<0 ? this.outputDocument.body.scrollWidth : this.model.get('width')) + 'px';
  }

  private toggleCode() {
    if (this.editorContainer.style.display == 'block') {
      this.showBtn.innerText = 'scratch';
      this.tabContainer.style.display = 'none';
      this.editorContainer.style.display = 'none';
      this.runBtn.style.display = 'none';
    } else {
      this.showBtn.innerText = 'hide code';
      this.tabContainer.style.display = 'flex';
      this.editorContainer.style.display = 'block';
      this.runBtn.style.display = 'block';
    }
  }

}


export class OPTWidgetModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'JSWidgetModel',
      _view_name: 'JSWidgetView',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
      script: '# some code here',
      height: 600,
      width: 600
    }
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };
}

export class OPTWidgetView extends DOMWidgetView {
  private outputContainer: HTMLDivElement;
  private outputIFrame: HTMLIFrameElement;
  private widgetContainer: HTMLDivElement;

  render() {
    this.outputContainer = document.createElement('div');
    this.outputContainer.className = "output-container";
    this.outputIFrame = document.createElement('iframe');
    this.outputIFrame.height = "100%";
    this.outputIFrame.width = "100%";
    this.outputContainer.appendChild(this.outputIFrame);
    this.setHtml();

    this.widgetContainer = document.createElement('div');
    this.widgetContainer.className = "divewidget";
    this.widgetContainer.appendChild(this.outputContainer);
    this.el.appendChild(this.widgetContainer);
  }

  /*
  Update the script in the output IFrame with the model script.
  */
  private setHtml() {
    this.outputIFrame.src = this.model.get('srcprefix')+encodeURIComponent(this.model.get('script'));
    this.outputContainer.style.height = this.model.get('height') + 'px';
    this.outputContainer.style.width = this.model.get('width') + 'px';
  }  
}