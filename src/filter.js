export const filter = [
	{
		name: 'multiply', cb: (value) => {
			if (!value) return 0;
			return ((value * 1000) / 10).toFixed(2);
		}
	},
	{
		name: 'divide', cb: (value) => {
			if (!value) return 0;
			return ((value / 1000) * 10).toFixed(2);
		}
	},
	{
		name: 'DateDivide', cb: (value) => {
			return (value / 3600) >> 0;
		}
	},
];
