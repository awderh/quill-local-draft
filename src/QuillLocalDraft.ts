/**
 * For custom types, extend this plugin and override @see getContents ..
 */

import { Quill, TextChangeHandler } from 'quill';
import { throttle } from 'throttle-debounce';

export interface LocalDraftOptions {
    id: string,
    prefix?: string,
    saveDelay?: number,
    displaySave?: boolean,
    saveFormat?: string,
    bindInitial?: boolean,
}

export const DEFAULT_OPTIONS: LocalDraftOptions = {
    id: '',
    prefix: 'quill_local_draft',
    saveDelay: 1000,
    displaySave: true,
    bindInitial: true
}

export class QuillLocalDraft {
    private quill: Quill;
    private options: LocalDraftOptions;
    private listener: throttle<TextChangeHandler> | TextChangeHandler;
    private initialized: boolean;

    constructor(quill: Quill, options: LocalDraftOptions) {
        this.quill = quill;
        this.options = this.applyOptions(options);

        /*
        Quill start's up with a DOM load and then overwrites the editor, so we can't load the draft just yet.
        Unfortunately, there's no reliable hook either... the text editor change event
        doesn't get called unless there's predefined HTML content. So we rely on application-specific
        initialization.
        */
        this.initialized = false;
        if (this.options.bindInitial)
            this.bindInitialListener();
    }

    public init() {
        if (this.initialized)
            return;

        this.initialized = true;
        this.unbindListener();
        this.loadDraft();
        this.bindListener();
    }

    private bindInitialListener() {
        if (this.initialized)
            return this.bindListener();

        this.unbindListener();

        const listener = () => this.init();
        this.listener = listener;

        this.quill.once('text-change', this.listener);
    }

    private bindListener() {
        this.unbindListener();

        const listener = () => this.saveDraft();
        this.listener = this.options.saveDelay ? throttle(this.options.saveDelay, listener) : listener;

        this.quill.on('text-change', this.listener);
    }

    private unbindListener() {
        if (!this.listener)
            return;

        this.quill.off('text-change', this.listener);
    }

    protected applyOptions(options: LocalDraftOptions): LocalDraftOptions {
        return {
            ...DEFAULT_OPTIONS,
            ...options
        };
    }

    protected get id() {
        return (this.options.prefix ?? '') + '_' + this.options.id;
    }

    protected getContents(): string {
        return JSON.stringify(this.quill.getContents());
    }

    protected setContents(contents: string) {
        let deserialized = null;
        try {
            deserialized = JSON.parse(contents);
        } catch (e) {
            console.error("Could not parse local draft Delta.");
            return;
        }
        if (deserialized)
            this.quill.setContents(deserialized);
    }

    public getDraft(): string {
        const id = this.id;
        let draft = '';
        try {
            draft = localStorage.getItem(id) ?? '';
        } catch (e) {
            // ?
        }
        return draft;
    }

    public setDraft(content: string = ''): void {
        const id = this.id;

        try {
            localStorage.setItem(id, content);
        } catch (e) {
            if (e instanceof DOMException && e.code == e.QUOTA_EXCEEDED_ERR) {
                console.error("Could not save local draft", e)
            } else {
                throw (e);
            }
        }
    }

    public saveDraft(): void {
        const contents = this.getContents();
        this.setDraft(contents);
    }

    private _loadDraft(): void {
        const draft = this.getDraft();
        this.setContents(draft);
    }

    private editorIsEmpty(): boolean {
        return this.quill.getText().trim().length == 0;
    }

    public loadDraft() {
        if (!this.editorIsEmpty()) {
            if (!window.confirm("There is a local saved draft for this notebook,"
                + " but loading it would reset the editor. Do you still want to load the draft?"))
                // can they not undo the draft load?
                return false;
        }
        return this._loadDraft();
    }
}

export default QuillLocalDraft;