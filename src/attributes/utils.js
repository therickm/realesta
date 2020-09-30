import { query, queryOne, getOccupancyOptions } from "@/pages/Template/service";
import occupations from "./occupations";
import { Select } from "antd";



export const options = (type, formatArry) => {
    return query({ params: {}, sorter: {}, filter: { type: type } })
        .then(
            ({ data }) => {
                let options = {}
                data.map(record => options[`${record._id}`] = { text: formatArry.map((e) => record[e] ? record[e] : e) })
                return options
            }
        )
}

export const occupancyOptions=()=>{
    const x = getOccupancyOptions()
    // .then(
    //     ({data})=>
            
    //         data.map(record =>queryOne(record.unit).then(
    //             cUnit=>
    //             queryOne(record.tenant).then(
    //                 cTenant =>({ key: record._id, text: `${cTenant.sur_name?cTenant.sur_name:''} ${cTenant.first_name?cTenant.first_name:''} ${cTenant.middle_name?cTenant.middle_name:''} - ${cUnit.code}` })
                    
    //             )
    //         )
    //         )
    // )
    console.log(x,'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    return x
}
