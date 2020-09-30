import React, { useEffect, useState } from 'react';
import expenses from '@/attributes/expenses';
import Page from '../Template/Page';

const Expenses = () => {
	const [derived, setDerived] = useState({collection:'expenses',singular:'',moduleColumns:[]})
	useEffect(() => {
		expenses().then(x=>setDerived(x))
	}, [])

	return (
		<div>
			<Page {...derived} />
		</div>
	);
};
export default Expenses;
