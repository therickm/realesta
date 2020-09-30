import { getData } from '../../db/actions';
import modules from "../modules";
import { getAllData } from './template';

export async function propertiesStatistics(){
    const allProperties = await getAllData(modules.PROPERTIES.collection)
    const allUnits = await getAllData(modules.UNITS.collection)
    const occupancy = await getAllData(modules.OCCUPATION.collection).then(z=>z.filter(h=>!h.dateOut))
    
    const allOccupiedUnits = allUnits.filter((el) => {
        return occupancy.some((f) => {
          return f.unit === el._id;
        });
      });

    const totalRent = allUnits.reduce((p,c)=>p+c.rent,0)
    const occupiedRent=allOccupiedUnits.reduce((p,c)=>p+c.rent,0)

    return{
        totalProperties:allProperties.length, 
        totalUnits:allUnits.length,
        occupiedUnits:allOccupiedUnits.length,
        totalRent:totalRent,
        occupiedRent:occupiedRent,
        aManagementPercentage:(allProperties.reduce((p,c)=>p+c.management_percentage,0))/allProperties.length
    }
}