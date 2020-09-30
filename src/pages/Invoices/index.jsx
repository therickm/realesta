import React, { useEffect, useState } from 'react';
import invoices from '@/attributes/invoices';
import Page from '../Template/Page';

const Invoices = () => {
	const [derived, setDerived] = useState({collection:'invoices',singular:'',moduleColumns:[]})
	useEffect(() => {
		invoices().then(x=>setDerived(x))
	}, [])

	return (
		<div>
			<Page {...derived} />
		</div>
	);
};
export default Invoices;
