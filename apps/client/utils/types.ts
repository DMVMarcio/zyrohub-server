export enum ToolTagEnum {
	DEV,
	CREATORS
}

export type ToolTagType = keyof typeof ToolTagEnum;
export const ToolTagsId = Object.keys(ToolTagEnum) as ToolTagType[];

export interface ITool {
	id: string;
	icon: string;
	tags: ToolTagEnum[];
}