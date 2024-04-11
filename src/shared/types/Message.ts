import { MessageType } from '$shared/enums/messageType.js';

export type Message<TData = undefined> = {
	type: MessageType;
	data: TData;
};
