import React from 'react'
import roles from '../attributes/roles'
import Template from './Template'

console.log('role atts',roles);
const Roles = () => {
    return (
        <div>
            <Template {...roles} />
        </div>
    )
}

export default Roles
