const db = require('../../../config/db');
const fs = require('fs');

module.exports = {
    async create({filename, path, chef_id}) {
        const query = `
            INSERT INTO chefsavatar
            (
                filename,
                path,
                chef_id
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
        `;

        const values = [
            filename,
            path,
            chef_id
        ];

        return db.query(query, values);
    },

    async find(chef_id) {
        return db.query(`
            SELECT
            *
            FROM chefsavatar
            WHERE chef_id = $1
        `, [
            chef_id
        ]);
    },

    async update({filename, path, chef_id}) {
        let result = await db.query(`
            SELECT
            path
            FROM chefsavatar
            WHERE chef_id = $1
        `, [
            chef_id
        ]);

        const filepath = result.rows[0].path;

        fs.unlinkSync(filepath);
        
        return db.query(`
            UPDATE chefsavatar
            SET filename = '${filename}',
            path = '${path}'
            WHERE chef_id = $1
        `, [
            chef_id
        ]);
    },

    async delete(chef_id) {
        let result = await db.query(`
            SELECT
            path,
            (
                SELECT
                COUNT(*)
                FROM recipes R
                WHERE R.chef_id = CA.chef_id
            ) AS totRecipes
            FROM chefsavatar CA
            WHERE chef_id = $1
        `, [
            chef_id
        ]); 

        const recipes = result.rows[0].totrecipes;
        if (recipes == 0) {
            const filepath = result.rows[0].path;

            fs.unlinkSync(filepath)
            
            return db.query(`
                DELETE FROM chefsavatar
                WHERE chef_id = $1
            `, [
                chef_id
            ]);
        } else {
            return false;
        };
    },
};