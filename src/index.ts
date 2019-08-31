import { DraftEditorCommand, DraftHandleValue, EditorState, RichUtils } from "draft-js";
import { EditorPlugin, PluginFunctions } from "draft-js-plugins-editor";
import { KeyboardEvent } from "react";

import { BlockTypes, CONFIG_DEFAULTS, QuickListConfig } from "./types";
import { getCurrentParagraph, shouldEnterOl, shouldEnterUl, shouldExitList } from "./utils";

const createQuickListPlugin = (config?: Partial<QuickListConfig>): EditorPlugin => {
	const { allowNestedLists, maxDepth, olRegex, ulChars } = {
		...CONFIG_DEFAULTS,
		...config,
	};

	// Parameter validation
	if (maxDepth < 1) {
		throw Error(`maxDepth cannot be ${maxDepth} (must be a positive integer)`);
	}
	ulChars.forEach(char => {
		if (char.length !== 1) {
			throw Error(`ulChar "${char}" must be exactly one character long`);
		}
	});

	const plugin: EditorPlugin = {
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
				if (shouldEnterUl(line, ulChars)) {
					// Enter unordered list
					// TODO: Remove everything up to space
					const updatedState = RichUtils.toggleBlockType(editorState, BlockTypes.UL);
					setEditorState(updatedState);
					return "handled";
				}
				if (shouldEnterOl(line, olRegex)) {
					// Enter ordered list
					// TODO: Remove everything up to space
					const updatedState = RichUtils.toggleBlockType(editorState, BlockTypes.OL);
					setEditorState(updatedState);
					return "handled";
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
				return "handled";
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
					return "handled";
				}
			}
			return "not-handled";
		},
	};

	// Handle tab and shift+tab presses if nested lists are allowed
	if (allowNestedLists) {
		plugin.onTab = (
			e: KeyboardEvent,
			{ getEditorState, setEditorState }: PluginFunctions,
		): void => {
			const editorState = getEditorState();
			const updatedState = RichUtils.onTab(e, editorState, maxDepth);
			setEditorState(updatedState);
		};
	}

	return plugin;
};

export default createQuickListPlugin;
