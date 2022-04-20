const elementTypes = {
	'*': 'list-item',
	'-': 'list-item',
	'+': 'list-item',
	'>': 'block-quote',
	'#': 'heading-one',
	'##': 'heading-two',
	'###': 'heading-three',
	'####': 'heading-four',
	'#####': 'heading-five',
	'######': 'heading-six',
} as const;

export default elementTypes;
