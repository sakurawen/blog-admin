import React from 'react';

const NeteaseMuisc: React.FC<{ aid: string; type: number }> = ({
	aid,
	type,
}) => {
	return (
		<iframe
			title='music'
			frameBorder='no'
			marginWidth={0}
			marginHeight={0}
			width='100%'
			height='110'
			src={`//music.163.com/outchain/player?type=${type}&id=${aid}&auto=0&height=90`}
		></iframe>
	);
};

export default NeteaseMuisc;
