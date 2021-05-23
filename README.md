# Quill Local Drafts

This is a simple local drafts plugin for the Quill Rich Text editor. See the [demo](https://jsfiddle.net/awderh/pogL3ca2/12/) here. This module utilizes the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), however, you could easily extend the class to use sessionStorage or something else.

# Highlights

-   Automatic saving: throttled to 1s (default) between keystrokes
-   Automatic loading - if a conflict occurs between current editor contents (e.g., those via an HTML initial load by Quill), the user is warned. You may choose to extend the UI for this.

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

```ts
export interface LocalDraftOptions {
    id: string;
    prefix?: string;
    saveDelay?: number;
    displaySave?: boolean;
    saveFormat?: string;
    bindInitial?: boolean;
}
```

Defaults are:

```ts
export const DEFAULT_OPTIONS: LocalDraftOptions = {
    id: "",
    prefix: "quill_local_draft",
    saveDelay: 1000,
    displaySave: true,
    bindInitial: true,
};
```

-   `id`: A unique identifier for setting/getting editor contents.
-   `prefix`: The final ID used in the storage API is `${prefix}_${id}`
-   `saveDelay`: Time (ms) between saves. Saves are triggered per keystroke and [throttled](https://www.npmjs.com/package/throttle-debounce).
-   `displaySave`: (Not impl.) Placeholder for future UI
-   `bindInitial`: (Potential change in future rev) Allows you to disable the first bind.

# Notes

Drafts are saved via local storage as stringified Delta. The `.init()` method inside the module is invoked because of how Quill (at the time of writing) doesn't fire a consistent event on initialization.

Per my testing, ~37kB worth of text (like a blog post) takes `~1ms` to save into localStorage.
