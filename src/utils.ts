import { EditorState, RichUtils } from "draft-js";

import { BlockTypes } from "./types";

/**
 * Return the text in the block where the cursor is currently placed
 */
export function getCurrentParagraph(editorState: EditorState): string {
	// Get editor content
	const content = editorState.getCurrentContent();

	// Get currently selected block
	const selection = editorState.getSelection();
	const blockKey = selection.getStartKey();
	const block = content.getBlockForKey(blockKey);

	// Return text in currently selected block
	return block.getText();
}

/**
 * Determine whether the start of the paragraph indicates that it is part of an ordered list
 */
export function shouldEnterOl(line: string, olRegex: RegExp): boolean {
	return olRegex.test(line);
}

/**
 * Determine whether the start of the paragraph indicates that it is part of an unordered list
 */
export function shouldEnterUl(line: string, ulChars: string[]): boolean {
	return ulChars.includes(line[0]);
}

/**
 * Determine whether the content of the current block indicates that the current list should be
 * exited
 */
export function shouldExitList(editorState: EditorState): boolean {
	const blockType = RichUtils.getCurrentBlockType(editorState);
	const blockIsList = blockType === BlockTypes.OL || blockType === BlockTypes.UL;

	// Exit list if currently in list and line is empty
	return blockIsList && getCurrentParagraph(editorState) === "";
}
