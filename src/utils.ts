import { EditorState, RichUtils } from "draft-js";

import { BlockTypes } from "./types";

const OL_REGEX = /\d\./;
const UL_CHARS = ["-", "–", "*"];

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
export function shouldEnterOl(line: string): boolean {
	return OL_REGEX.test(line);
}

/**
 * Determine whether the start of the paragraph indicates that it is part of an unordered list
 */
export function shouldEnterUl(line: string): boolean {
	return UL_CHARS.includes(line[0]);
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
