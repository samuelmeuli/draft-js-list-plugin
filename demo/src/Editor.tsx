import "draft-js/dist/Draft.css";

import { DraftEditorCommand, DraftHandleValue, EditorState, RichUtils } from "draft-js";
import PluginEditor from "draft-js-plugins-editor";
import React, { Component, ReactElement } from "react";

import createListPlugin from "../../src/index";

const listPlugin = createListPlugin();
const plugins = [listPlugin];

interface State {
	editorState: EditorState;
}

export default class Editor extends Component<{}, State> {
	state: Readonly<State> = {
		editorState: EditorState.createEmpty(),
	};

	onChange = (editorState: EditorState): void => {
		this.setState({ editorState });
	};

	handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return "handled";
		}
		return "not-handled";
	};

	render = (): ReactElement => {
		const { editorState } = this.state;

		// Determine whether placeholder should be displayed (to avoid overlap with lists)
		const blockType = RichUtils.getCurrentBlockType(editorState);
		const isOl = blockType === "ordered-list-item";
		const isUl = blockType === "unordered-list-item";
		const placeholderIsVisible = !isOl && !isUl;

		return (
			<PluginEditor
				editorState={editorState}
				handleKeyCommand={this.handleKeyCommand}
				onChange={this.onChange}
				placeholder={placeholderIsVisible ? "Start typing…" : ""}
				plugins={plugins}
			/>
		);
	};
}
