import { DraftHandleValue, EditorState, RichUtils } from "draft-js";
import { EditorPlugin, PluginFunctions } from "draft-js-plugins-editor";
import { KeyboardEvent } from "react";

import { BlockTypes, CONFIG_DEFAULTS, ListPluginConfig } from "./types";
import { shouldEnterOl, shouldEnterUl, startList } from "./utils";

const createListPlugin = (config?: Partial<ListPluginConfig>): EditorPlugin => {
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
				// Get editor content
				const content = editorState.getCurrentContent();

				// Get currently selected block
				const selection = editorState.getSelection();
				const blockKey = selection.getStartKey();
				const block = content.getBlockForKey(blockKey);

				// Exit if already in a list
				if (block.getType() !== BlockTypes.TEXT) {
					return "not-handled";
				}

				// Get current position of cursor in block
				const cursorPos = selection.getStartOffset();

				// Get block text
				const text = `${block.getText()} `;

				// Calculate position of first space character in block
				const firstSpacePos = text.indexOf(" ");

				// If the typed space is the first one in the block: Check if list needs to be inserted
				if (cursorPos === firstSpacePos) {
					if (shouldEnterUl(text, ulChars)) {
						// Start unordered list
						const updatedState = startList(
							editorState,
							content,
							blockKey,
							firstSpacePos,
							BlockTypes.UL,
						);
						setEditorState(updatedState);
						return "handled";
					}
					if (shouldEnterOl(text, olRegex)) {
						// Start ordered list
						const updatedState = startList(
							editorState,
							content,
							blockKey,
							firstSpacePos,
							BlockTypes.OL,
						);
						setEditorState(updatedState);
						return "handled";
					}
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

export default createListPlugin;
