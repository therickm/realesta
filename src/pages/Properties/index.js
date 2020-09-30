import React, { useEffect, useState } from 'react';
import Template from '../Template';

import properties from '../../attributes/properties'
import { Link } from 'umi';
import { Divider } from 'antd';
const index = () => {

	const LinkToUnits = (props) =>{
	console.log(props);
	return<><Link to={`/properties/${props._id}`}>Units</Link><Divider type="vertical" /></>
	}

	const [derivedProperties, setDerivedProperties] = useState({collection:'properties',singular:'',moduleColumns:[]})
	useEffect(() => {
	properties().then(x=>setDerivedProperties(x))
	}, [])

	return (
		<div>
			<Template {...derivedProperties} moreActions={[LinkToUnits,]}/>
		</div>
	);
};

export default index;
