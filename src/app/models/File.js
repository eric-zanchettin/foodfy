const db = require('../../../config/db');
const fs = require('fs');

module.exports = {
    async create({filename, path, recipe_id}) {
        const query = `
            INSERT INTO files
            (
                name,
                path,
                recipe_id
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
            recipe_id
        ];
        
        return db.query(query, values);
    },

    async show(id) {
      const query = `
        SELECT
        *
        FROM files
        WHERE recipe_id = $1
      `

      const values = [
          id
      ];

      return db.query(query, values)
    },

    async delete(id) {
        const result = await db.query(`
            SELECT * FROM files
            WHERE id = $1
        `, [id]);

        const file = result.rows[0];

        fs.unlinkSync(file.path);

        return db.query(`
            DELETE FROM files
            WHERE id = $1
        `, [id]);
    },

    async deleteAllRecipeFiles(recipe_id) {
        const result = await db.query(`
            SELECT * FROM files
            WHERE recipe_id = $1
        `, [recipe_id]);

        result.rows.forEach(file => {
            fs.unlinkSync(file.path);
        });

        return db.query(`
            DELETE FROM files
            WHERE recipe_id = $1
        `, [recipe_id])
    }
};