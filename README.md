# Quill Local Drafts
This is a simple local drafts plugin for the Quill Rich Text editor.

# Getting Started
You can download the distribution as-is (see `dist/`) and copy it over, or you can use NPM.

Example (NPM):
```js
import { Quill } from 'quill';
import { QuillLocalDraft } from 'quill-local-draft'

Quill.register({    
    'modules/localDraft' : QuillLocalDraft
})

myQuill = new Quill( ... , {
    modules: {
        localDraft: {
            id: 'something_unique',
        }
    }
});

draftModule = myQuill.getModule('localDraft').init(); // see notes on why this is needed
```

# Notes
Drafts are saved via local storage as stringified Delta. The `.init()` method inside the module is invoked because of how Quill (at the time of writing) doesn't fire a consistent event on initialization.