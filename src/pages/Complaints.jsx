import React, { useEffect, useState } from 'react';
import Template from './Template';
import complaints from '@/attributes/complaints';

const index = () => {
	const [derived, setDerived] = useState({collection:'complaints',singular:'',moduleColumns:[]})
	useEffect(() => {
		complaints().then(x=>setDerived(x))
	}, [])

	console.log(derived.moduleColumns);

	return (
		<div>
			<Template {...derived} />
		</div>
	);
};
export default index;
