import React from 'react';

type ImageProps = {
	src: string;
	alt: string;
	className: string;
};

/**
 * 文章图片
 * @param props
 * @returns
 */
const Image = (props: ImageProps) => {
	const { className, src, alt } = props;
	return (
		<img
			src={src}
			onContextMenu={(e) => e.preventDefault()}
			onDragStart={(e) => e.preventDefault()}
			className={className + ' select-none'}
			alt={alt}
		/>
	);
};

export default Image;
