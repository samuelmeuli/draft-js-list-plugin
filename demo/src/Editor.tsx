import "draft-js/dist/Draft.css";

import { DraftEditorCommand, DraftHandleValue, EditorState, RichUtils } from "draft-js";
import PluginEditor from "draft-js-plugins-editor";
import React, { Component, ReactElement } from "react";

import createQuickListPlugin from "../../src/index";

const quickListPlugin = createQuickListPlugin();
const plugins = [quickListPlugin];

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
		return (
			<PluginEditor
				editorState={editorState}
				handleKeyCommand={this.handleKeyCommand}
				onChange={this.onChange}
				plugins={plugins}
			/>
		);
	};
}
