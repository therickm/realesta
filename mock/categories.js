import { getAll, save, remove, setImage, getImage } from "../db/actions";

export default {
    'GET  /api/db': async (req, res) => {
        const {query} =req
        const rows = await getAll(query)
        let data = []

        rows.map(r=>data.push({...r, key:r._id}))
        res.status(200).send({data:data});
      },
    'POST /api/db': async (req, res) => {
        res.send(await save(req));
    },

    'POST /api/db/delete': async (req, res) => {
        res.send(await remove(req.body));
    },
    'POST /api/db/bulk-delete': async (req, res) => {
        
        // const toArray = Object.keys(req.body).map(key => ({ key, value: req.body[key] }));
        const done = await req.body.rows.map(row=>remove(row))
        res.send(done);
    },
    'POST /api/db/image': async (req, res) => {
        res.send(await setImage(req));
    },
    'GET /api/db/image': async ({query}, res) => {
        res.send(await getImage(query));
    },

}