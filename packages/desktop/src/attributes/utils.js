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

export const occupancyOptions = () => {
    const x = getOccupancyOptions()
    return x
}
