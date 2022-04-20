import React from 'react';
import { compiler } from 'markdown-to-jsx';
import overrideConfig from './config';

type ArticleProps = {
	children: string;
};

/**
 * 文章
 * @param props
 * @returns
 */
const Article: React.FC<ArticleProps> = (props) => {
	const { children } = props;
	return (
		<div>
			{compiler(children, {
				wrapper: 'article',
				forceWrapper: true,
				forceBlock: true,
				overrides: overrideConfig,
			})}
		</div>
	);
};

export default Article;
