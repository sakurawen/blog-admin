import { RenderElementProps } from 'slate-react';
import Element from '../components/element';

const renderElement = (props: RenderElementProps) => {
	return (
		<div className=''>
			<Element {...props} />
		</div>
	);
};

export default renderElement;
