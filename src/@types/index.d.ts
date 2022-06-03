import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = {
	type: 'paragraph' | 'code' | 'h1' | string;
	children: CustomText[];
};
type CustomText = { text: string; [key: string]: any };
declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

export type EditorRef = {
	content: string;
	title: srting;
};

export type ServiceResponse<T = any> = {
	code: number;
	data: T;
	msg: string;
};

/**
 * 文章
 */
export type Article = {
	id: number;
	uid: number;
	group_id: number;
	tag_id: number;
	article_key: string;
	node_key: string;
	title: string;
	content: string;
	create_time: Date;
	update_time?: Date;
	delete_time?: Date;
	deleted: number;
};

export type Node = {
	id: number;
	u_account: string;
	name: string;
	node_key: string;
};

/**
 * 用户
 */
export type User = {
	id: number;
	username: string;
	account: string;
	role: number;
};

export type ArticleSaveResp = {
	u_account: string;
	title: string;
	content: string;
	article_key: string;
  node_key:string
	tag: string;
	create_time: Date;
};

export type Pageable = {
	rules: {
		[key: string]: any;
	};
	conditions: {
		[key: string]: any;
	};
	page: {
		size: number;
		number: number;
		order_by: string;
	};
};

export type Page<T = any> = {
	rows: T;
	total: number;
	count: number;
};

export type STSToken = {
	Credentials: {
		AccessKeyId: string;
		AccessKeySecret: string;
		SecurityToken: string;
	};
};
