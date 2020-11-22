const db = require('../../../config/db');

module.exports = {
    all(callback) {
        db.query(`
            SELECT
            *,
            (
                SELECT
                path
                FROM chefsavatar CA
                WHERE CA.chef_id = C.id
            ) AS avatar,
            (
                SELECT
                COUNT(*)
                FROM recipes R
                WHERE R.chef_id = C.id
            ) AS totrecipes
            FROM chefs C
        `, null, function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows);
        });
    },

    async insert(data, user_id) {
        const created_at = new Date();

        return db.query(`
            INSERT INTO chefs
            (
                name,
                avatar_url,
                created_at,
                user_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING ID
        `, [
            data.name,
            data.avatar_url,
            created_at,
            user_id,
        ])
    },

    async find(id, callback) {
        return db.query(`
        SELECT
        C.*,
        (
            SELECT
            path
            FROM chefsavatar CA
            WHERE CA.chef_id = C.id
        ) AS avatar,
        (
            SELECT
            COUNT(*)
            FROM recipes R
            WHERE R.chef_id = C.id
        ) AS totrecipes
        FROM chefs C
        WHERE C.id = $1
        `, [Number(id)]);
    },

    findRecipes(id, callback) {
        db.query(`
        SELECT
        R.*,
        (
            SELECT
            path
            FROM files F
            WHERE R.id = F.recipe_id
            ORDER BY recipe_id ASC
            LIMIT 1
        ) AS path
        FROM recipes R
        WHERE R.chef_id = $1
        `, [Number(id)], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            callback(results.rows);
        });
    },

    async update(data) {
        return db.query(`
            UPDATE chefs
            SET name = ($1)
            WHERE id = $2
        `, [
            data.name,
            data.id,
        ]);
    },

    async delete(id, callback) {
        return db.query(`
            SELECT
            (
                SELECT
                COUNT(*)
                FROM recipes R
                WHERE R.chef_id = C.id
            ) AS totrecipes
            FROM chefs C
            WHERE id = $1
        `, [id], function(err, results) {
            if (err) {
                console.log(err);
                throw 'DATABASE ERROR!';
            };

            if (results.rows[0].totrecipes == 0) {
                    db.query(`
                        DELETE FROM chefs
                        WHERE id = $1
                    `, [id], function(err, results) {
                    if (err) {
                        console.log(err);
                        throw 'DATABASE ERROR!';
                    };

                    callback(true);
                })
            } else {
                callback(false);
            };
        });
    },
};