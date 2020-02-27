import "draft-js/dist/Draft.css";

import { DraftEditorCommand, DraftHandleValue, EditorState, RichUtils } from "draft-js";
import PluginEditor from "draft-js-plugins-editor";
import React, { ReactElement, useState } from "react";

import createListPlugin from "../../src/index";

const listPlugin = createListPlugin();
const plugins = [listPlugin];

export default function Editor(): ReactElement {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const handleKeyCommand = (
		command: DraftEditorCommand,
		oldState: EditorState,
	): DraftHandleValue => {
		const newState = RichUtils.handleKeyCommand(oldState, command);
		if (newState) {
			setEditorState(newState);
			return "handled";
		}
		return "not-handled";
	};

	// Determine whether placeholder should be displayed (to avoid overlap with lists)
	const blockType = RichUtils.getCurrentBlockType(editorState);
	const isOl = blockType === "ordered-list-item";
	const isUl = blockType === "unordered-list-item";
	const placeholderIsVisible = !isOl && !isUl;

	return (
		<PluginEditor
			editorState={editorState}
			handleKeyCommand={handleKeyCommand}
			onChange={setEditorState}
			placeholder={placeholderIsVisible ? "Start typing…" : ""}
			plugins={plugins}
		/>
	);
}
