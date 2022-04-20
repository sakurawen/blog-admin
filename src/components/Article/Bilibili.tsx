import React from 'react';

const Bilibili: React.FC<{ bv: string }> = (props) => {
	const { bv } = props;
	if (!bv) {
		return null;
	}
	return (
		<iframe
			src={`//player.bilibili.com/player.html?bvid=${bv}&danmaku=0`}
			scrolling='no'
			className='aspect-video w-full'
			title='biliVideo'
			frameBorder='no'
			allowFullScreen={true}
		></iframe>
	);
};

export default Bilibili;
