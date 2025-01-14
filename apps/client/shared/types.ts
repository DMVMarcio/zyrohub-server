import type { WorkerId, WorkerResponse } from '@zyrohub/toolkit';

export enum ToolTagEnum {
	DEV,
	CREATORS,
	MISC
}

export type ToolTagType = keyof typeof ToolTagEnum;
export const ToolTagsId = Object.keys(ToolTagEnum) as ToolTagType[];

export interface ITool {
	id: string;
	icon: string;
	tags: ToolTagEnum[];
	needs_connection?: boolean;
}

export type TaskStatus = 'pending' | 'queued' | 'running' | 'finished' | 'error';

export interface TaskProgress {
	percentage: number;
	message?: string;
}

export interface Task<T extends WorkerId> {
	id?: string;
	request_id?: string;
	worker_id: T;
	status: TaskStatus;
	error?: string;
	progress: TaskProgress;
	position?: number;
	initial_position?: number;
	data?: WorkerResponse<T>;
}
