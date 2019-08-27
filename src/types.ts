import { DraftBlockType } from "draft-js";

export const BlockTypes: Record<string, DraftBlockType> = {
	UL: "unordered-list-item",
	OL: "ordered-list-item",
	TEXT: "unstyled",
};
