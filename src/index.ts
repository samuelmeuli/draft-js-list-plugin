import { DraftEditorCommand, DraftHandleValue, EditorState, RichUtils } from "draft-js";
import { EditorPlugin, PluginFunctions } from "draft-js-plugins-editor";
import { KeyboardEvent } from "react";

import { BlockTypes } from "./types";
import { getCurrentParagraph, shouldEnterOl, shouldEnterUl, shouldExitList } from "./utils";

const createQuickListPlugin = (): EditorPlugin => ({
	/**
	 * Handle space key presses
	 */
	handleBeforeInput(
		chars: string,
		editorState: EditorState,
		_eventTimeStamp: number,
		{ setEditorState }: PluginFunctions,
	): DraftHandleValue {
		// On space press: Start list if necessary
		if (chars === " ") {
			const line = `${getCurrentParagraph(editorState)} `;
			// TODO: Exit if not the first space
			if (shouldEnterUl(line)) {
				// Enter unordered list
				// TODO: Remove everything up to space
				const updatedState = RichUtils.toggleBlockType(editorState, BlockTypes.UL);
				setEditorState(updatedState);
			} else if (shouldEnterOl(line)) {
				// Enter ordered list
				// TODO: Remove everything up to space
				const updatedState = RichUtils.toggleBlockType(editorState, BlockTypes.OL);
				setEditorState(updatedState);
			}
		}
		return "not-handled";
	},

	/**
	 * Handle enter key presses
	 */
	handleReturn(
		_evt: KeyboardEvent,
		editorState: EditorState,
		{ setEditorState }: PluginFunctions,
	): DraftHandleValue {
		// On enter press: Exit list if necessary
		if (shouldExitList(editorState)) {
			// Exit list
			// TODO: Consider decrementing indentation by 1 instead
			const updatedState = RichUtils.toggleBlockType(editorState, BlockTypes.TEXT);
			setEditorState(updatedState);
		}
		return "not-handled";
	},

	/**
	 * Handle backspace key presses
	 */
	handleKeyCommand(
		command: DraftEditorCommand,
		editorState: EditorState,
		_eventTimeStamp: number,
		{ setEditorState }: PluginFunctions,
	): DraftHandleValue {
		// On backspace press: Exit list if necessary
		if (command === "backspace") {
			if (shouldExitList(editorState)) {
				// Exit list
				// TODO: Consider decrementing indentation by 1 instead
				const updatedState = RichUtils.toggleBlockType(editorState, BlockTypes.TEXT);
				setEditorState(updatedState);
			}
		}
		return "not-handled";
	},
});

export default createQuickListPlugin;
