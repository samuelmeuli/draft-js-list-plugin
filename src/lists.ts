import {
	ContentState,
	DraftBlockType,
	EditorState,
	Modifier,
	RichUtils,
	SelectionState,
} from "draft-js";

/**
 * Determine whether the start of the paragraph indicates that it is part of an ordered list
 */
export function shouldEnterOl(text: string, olRegex: RegExp): boolean {
	return olRegex.test(text);
}

/**
 * Determine whether the start of the paragraph indicates that it is part of an unordered list
 */
export function shouldEnterUl(text: string, ulChars: string[]): boolean {
	return ulChars.includes(text[0]);
}

/**
 * Start a list of the desired type and remove the characters which were typed for starting the list
 */
export function startList(
	editorState: EditorState,
	content: ContentState,
	blockKey: string,
	firstSpacePos: number,
	blockType: DraftBlockType,
): EditorState {
	const selectionToRemove = new SelectionState({
		anchorKey: blockKey,
		anchorOffset: 0,
		focusKey: blockKey,
		focusOffset: firstSpacePos + 1,
	});
	const updatedContent = Modifier.removeRange(content, selectionToRemove, "backward");
	let updatedState = EditorState.push(editorState, updatedContent, "change-block-type");
	updatedState = EditorState.forceSelection(updatedState, updatedContent.getSelectionAfter());
	updatedState = RichUtils.toggleBlockType(updatedState, blockType);
	return updatedState;
}
