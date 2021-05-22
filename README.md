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
    theme : 'snow',
    modules: {
        localDraft: {
            id: 'something_unique',
        }
    }
});

myQuill.getModule('localDraft').init(); // see notes on why this is needed
```

See the `demo/` folder in `src/` for more. You can download the source code and run `npm install` in the root directory, followed by `npm run serve` for a local demo.

# Options
See the class `LocalDraftOptions` in `src/QuillLocalDraft.ts`

# Notes
Drafts are saved via local storage as stringified Delta. The `.init()` method inside the module is invoked because of how Quill (at the time of writing) doesn't fire a consistent event on initialization.