import { getAll } from "../../db/actions";
import DB from "../../db/database";
import modules from "@/modules";
import md5 from "md5";
import { fakeData } from "../../db/fakedata";

export async function getCollectionDocuments(params) {
    const rows = await new DB(params.filter.type).getCollectionDocuments(params)
    // const rows = await getAll(params)
    let data = []
    rows.map(r=>data.push({...r, key:r._id}))
    return {data:data,total:data.length,success:true};
}
export async function getAllData(collection) {
    return await (await new DB(collection).getAllData()).filter(r=>r.type === collection)
  }
export async function getDocument(id,collection) {
    return await new DB(collection).getDocument(id)
  }
export async function saveDocument(data,type) {
    return await new DB(data.type).saveDocument(data)
  }
  export async function deleteDocument(data) {
    return await new DB(data.type).deleteDocument(data)
  }

  export async function bulkDeleteDocuments(rows) {
      
    return rows.map(async row=> await new DB(row.type).deleteDocument(row))
  }
  export const init = async() =>{
    let permissions = []
    _.forOwn(modules,(value,key)=>permissions.push({module:value.collection, create:true, update:true,delete:true}))
    new DB('roles').saveDocument({name:"Super Administrator",permission:permissions,type:'roles'})
    .then(r=>new DB('users').saveDocument({name:'Super User', type:'users', username:'root',password:md5(md5('12345678')),role:r._id}))
    .then(()=>fakeData())
  }

export const login = async(params)=>{
    const  users = await new DB("users").getAllData()
    const user = users.find(x => (x.email === params.username || x.username === params.username || x.phone === params.username) && x.password === md5(md5(params.password)));
    if (!user){ 
        const email = users.find(x=>(x.email === params.username || x.username === params.username || x.phone === params.username));
        if (email) { 
        return {state:'error',message:'Wrong password for provided Email.'}
    }else{
            return {state:'error',message:'This Email is not registered'}
    }
    }else{
    return {state:'success',user:user}
    }
}