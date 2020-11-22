const db = require('../../../config/db');
const utils = require('../../lib/utils')

module.exports = {
    all(callback) {
        db.query('SELECT * FROM recipes ORDER BY created_at DESC', null, function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR';
            };

            callback(results.rows);
        });
    },

    async allFromId(id) {
        const results = await db.query(`
                SELECT
                *
                FROM recipes
                WHERE user_id = $1
            `, [id]);

        return results.rows;
    },

    chefOptions(callback) {
        db.query(`
            SELECT
            id,
            name
            FROM chefs
        `, null, function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows);
        });
    },

    async insert(data) {
        const query = `
            INSERT INTO recipes
            (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at,
                user_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            )
            RETURNING id
        `;
        
        const values = [
            Number(data.chef_id) || null,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            utils.dateToIso(data.created_at),
            data.user_id,
        ];
        
        let results = await db.query(query, values)
        
        return results.rows[0];
    },

    async find(id) {
        return db.query(`
            SELECT
            R.*,
            COALESCE((
                SELECT
                C.name
                FROM chefs C
                WHERE C.id = R.chef_id
            ),
            (
                SELECT
                U.name
                FROM users U
                WHERE U.id = R.user_id
            )) AS author
            FROM recipes R
            WHERE id = $1
            ORDER BY created_at DESC
        `, [id]);
    },

    findBy(bodyQuery, callback) {
        let query = `
        `
        let filterQuery = `
        `
        let totalQuery = `SELECT COUNT(*) FROM recipes R`

        let orderQuery = `
        OFFSET $1 LIMIT $2
        `

        if (bodyQuery.filter) {
            filterQuery = `
            WHERE R.title ILIKE '%${bodyQuery.filter}%'
            OR R.ingredients[1] ILIKE '%${bodyQuery.filter}%'
            `

            totalQuery = `${totalQuery}${filterQuery}`

            orderQuery = `ORDER BY updated_at DESC ${orderQuery}` 
        };

        query = `
            SELECT
            R.*,
            (
                SELECT
                path
                FROM files F
                WHERE F.recipe_id = R.id
                ORDER BY F.id ASC
                LIMIT 1
            ) AS path,
            (
                ${totalQuery}
            ) AS total
            FROM recipes R
            ${filterQuery}${orderQuery}`

        db.query(query, [bodyQuery.offset, bodyQuery.limit], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows);
        });
    },

    update(data, callback) {
        db.query(`
            UPDATE recipes
            SET chef_id = ($1),
            title = ($2),
            ingredients = ($3),
            preparation = ($4),
            information = ($5)
            WHERE id = $6
        `, [
            Number(data.chef_id) || null,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            Number(data.id),
        ], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(Number(data.id));
        });
    },

    delete(id, callback) {
        db.query(`
            DELETE FROM recipes
            WHERE id = $1
        `, [Number(id)], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback();
        });
    },
};