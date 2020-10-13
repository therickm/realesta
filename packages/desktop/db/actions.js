import { assign, has } from 'lodash';
import db from './db'
import md5 from 'md5'
import modules from '@/modules';
import _ from 'lodash'
import { fakeData } from './fakedata';

  export async function getAll(rq) {
    const {filter} = rq

  try {
    // Check indexes
    await db.createIndex({
      index: { fields: ['type'] },
    });
    await db.createIndex({
      index: { fields: ['createdAt'] },
    });

    Object.keys(filter).map(async f=>
      await db.createIndex({
        index: { fields: [f] },
      })
      )

     const data = await db.find({
      selector: {
        // organization: localStorage.getItem('organization'),
        createdAt: { $gte: null },
        ...filter
      },
      sort: [{ createdAt: 'desc' }],
    });

    console.log({selector: {
      // organization: localStorage.getItem('organization'),
      createdAt: { $gte: null },
      ...filter
    },
    sort: [{ createdAt: 'desc' }],});



  const { current = 1, pageSize = 10 } = rq;
  console.log(rq);
  // const params = parse(realUrl, true).query;
  let dataSource = [...data.docs].slice((current - 1) * pageSize, current * pageSize);
  const sorter = rq.sorter;

  

  if (sorter) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach(key => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }

          return;
        }

        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }

  // if (rq.filter) {
  //   const filter = rq.filter;

  //   console.log(filter);

  //   if (Object.keys(filter).length > 0) {
  //     dataSource = dataSource.filter(item =>
  //       Object.keys(filter).some(key => {
  //         if (!filter[key]) {
  //           return true;
  //         }

  //         if (filter[key].includes(`${item[key]}`)) {
  //           return true;
  //         }

  //         return false;
  //       }),
  //     );
  //   }
  // }

  console.log(data, Object.keys(rq.filter));

  rq.filter && Object.keys(rq.filter).map(key=>
  dataSource = dataSource.filter(data=>data[key] && data[key].includes(rq.filter[key] || ''))
  )

  // if (rq.name) {
  //   dataSource = dataSource.filter(data => data.name.includes(rq.name || ''));
  // }
  // if (rq.desc) {
  //   dataSource = dataSource.filter(data => data.desc.includes(rq.desc || ''));
  // } 

  return dataSource

  } catch (error) {
    console.log(error);
  }
    
}

export async function getData(type) {
  try {
    // Check indexes
    await db.createIndex({
      index: { fields: ['type'] },
    });
    await db.createIndex({
      index: { fields: ['createdAt'] },
    });

     return await db.find({
      selector: {
        // organization: localStorage.getItem('organization'),
        createdAt: { $gte: null },
        type:type
      },
      sort: [{ createdAt: 'desc' }],
    });

  } catch (error) {
    console.log(error);
  }
    
}
export async function save(body) {


  try {
    if (has(body, '_id')) {
      const original = await db.get(body._id);
      const response = await db.put(
        assign(original, body, {
          updatedAt: new Date(),
          updatedBy:localStorage.getItem('user')
        })
      );
      return await db.get(response.id);
    } else {
      const response = await db.post(
        assign(body, {
          // state: 'draft',
          // organization: localStorage.getItem('organization'),
          _id:Date.now().toString(36).toUpperCase(),
          createdAt: new Date(),
          entrant:localStorage.getItem('user')
        })
      );
      return await db.get(response.id);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getImage(data) {
  const { id } = data;
  console.log(data);
  try {
  return await db.getAttachment(id, 'image');
} catch (error) {
  console.log(error);
}
}

export async function setImage(body) {
  const { _id, _rev } = body;
  try {
    const response = await db.putAttachment(_id, 'image', _rev, body.file, 'text/plain'  );
    return await db.getAttachment(response.id, 'image');
  } catch (error) {
    console.log(error);
  }
}


export async function details(id) {
  try {
    return await db.get(id,{attachments: true});
  } catch (error) {
    console.log(error);
  }
}

export async function remove(data) {
  try {
    return db.remove(data._id, data._rev);
  } catch (error) {
    console.log(error);
  }
}

export async function login(data){
  try{
    
    await db.createIndex({
      index: { fields: ['type'] },
    });
    await db.createIndex({
      index: { fields: ['username'] },
    });
    // await db.createIndex({
    //   index: { fields: ['email'] },
    // });
    // await db.createIndex({
    //   index: { fields: ['phone'] },
    // });
    await db.createIndex({
      index: { fields: ['password'] },
    });

    console.log(data);

     const user = await db.find({
      selector: {
        // organization: localStorage.getItem('organization'),
        password:md5(md5(data.password)),
        type:'users',
        // createdAt: { $gte: null },
        $or: [ { username: data.username }, { email: data.username }, { phone: data.username } ]
      },
      // sort: [{ createdAt: 'desc' }],
    });

    console.log(data,user.docs,user.docs[0]);
    return user.docs[0];
    
  }catch(e)
  {
    console.log(e)
  }
}

export const init = async() =>{
  let permissions = []
  _.forOwn(modules,(value,key)=>permissions.push({module:value.collection, create:true, update:true,delete:true}))
  save({name:"Super Administrator",permission:permissions,type:'roles'})
  .then(r=>save({name:'Super User', type:'users', username:'root',password:md5(md5('12345678')),role:r._id}))
  .then(()=>fakeData())
}

export const bulkAdd = async (data)=>db.bulkDocs(data)













