import { DraftBlockType } from "draft-js";

export interface QuickListConfig {
	allowNestedLists: boolean;
	maxDepth: number;
	olRegex: RegExp;
	ulChars: string[];
}

export const CONFIG_DEFAULTS: QuickListConfig = {
	allowNestedLists: true,
	maxDepth: 4,
	olRegex: /\d\./,
	ulChars: ["-", "–", "*"],
};

export const BlockTypes: Record<string, DraftBlockType> = {
	UL: "unordered-list-item",
	OL: "ordered-list-item",
	TEXT: "unstyled",
};
