import "./demo.css";
import Quill from "quill";
import { QuillLocalDraft, LocalDraftOptions } from "../QuillLocalDraft";

Quill.register({
    "modules/localDraft": QuillLocalDraft,
});

const localDraftOptions = {
    id: "demo",
};

const divElem = document.getElementById("quill");
const quill = new Quill(divElem, {
    theme: "snow",
    modules: {
        localDraft: localDraftOptions,
    },
});
quill.getModule("localDraft").init(); // Necessary, unfortunately.

window.quillDemo = quill;
