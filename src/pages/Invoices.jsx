import React, { useEffect, useState } from 'react';
import Template from './Template';
import invoices from '../attributes/invoices'

const Invoices = () => {
	const [derived, setDerived] = useState({collection:'invoices',singular:'',moduleColumns:[]})
	useEffect(() => {
		invoices().then(x=>setDerived(x))
	}, [])

	console.log(derived.moduleColumns);

	return (
		<div>
			<Template {...derived} />
		</div>
	);
};
export default Invoices;
