import React from 'react';
import { RenderElementProps } from 'slate-react';
import Element from '../components/element';
import { ViewGridIcon } from '@heroicons/react/outline';

const renderElement = (props: RenderElementProps) => {
	return (
		<div className=''>
			<Element {...props} />
		</div>
	);
};

export default renderElement;
