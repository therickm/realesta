import React, { useEffect, useState } from 'react';
import Template from './Template';
import receipts from '../attributes/receipts'

const Receipts = () => {
	const [derived, setDerived] = useState({collection:'receipts',singular:'',moduleColumns:[]})
	useEffect(() => {
		receipts().then(x=>setDerived(x))
	}, [])

	console.log(derived.moduleColumns);

	return (
		<div>
			<Template {...derived} />
		</div>
	);
};
export default Receipts;
