import { RenderElementProps } from 'slate-react';
import Element from '../components/element';

const renderElement = (props: RenderElementProps) => {
	if (props.element.type === 'code') {
		return (
			<div className='code-code'>
				<Element {...props} />
			</div>
		);
	}

	return (
		<div className=''>
			<Element {...props} />
		</div>
	);
};

export default renderElement;
