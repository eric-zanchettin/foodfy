DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

-- CHEFS TABLE

CREATE TABLE chefs (
    id SERIAL PRIMARY KEY,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP,
    user_id INT
)

-- FILES TO CHEFS

CREATE TABLE chefsavatar (
    id SERIAL PRIMARY KEY,
    path TEXT,
    chef_id INT,
    filename TEXT,
    CONSTRAINT chefsavatar_chef_id_fkey
        FOREIGN KEY (chef_id)
            REFERENCES chefs(id)
                ON DELETE CASCADE
)

-- USERS INFO TABLE

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    access_token TEXT,
    access_token_expires TEXT,
    is_admin BOOLEAN,
    created_at TIMESTAMP DEFAULT (now()),
    updated_at TIMESTAMP DEFAULT (now()),
    recovery_token TEXT,
    recovery_token_expires TEXT
)

-- RECIPES TABLE

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    chef_id INT,
    title TEXT,
    ingredients TEXT[],
    preparation TEXT[],
    information TEXT,
    created_at TIMESTAMP DEFAULT (now()),
    updated_at TIMESTAMP DEFAULT (now()),
    user_id INT,
    CONSTRAINT recipes_chef_id_fkey
        FOREIGN KEY (chef_id)
            REFERENCES chefs(id)
                ON DELETE CASCADE,
    CONSTRAINT recipes_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES users(id)
                ON DELETE CASCADE
)

-- TABLE TO STORE PATH OF FILES

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name TEXT,
    path TEXT NOT NULL,
    recipe_id INT NOT NULL,
    CONSTRAINT files_recipe_id_fkey
        FOREIGN KEY (recipe_id)
            REFERENCES recipes(id)
                ON DELETE CASCADE
)

-- SESSIONS TABLE TO STORE LOGIN USER INFORMATION

CREATE TABLE session (
	sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)
WITH(OIDS=FALSE);

ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IDX_session_expire ON session(expire);

-- UPDATED AT PROCEDURE

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$

    BEGIN

        NEW.updated_at = NOW();
        RETURN NEW;

    END;

$$ LANGUAGE plpgsql;

-- AUTO UPDATE "UPDATED_AT" TRIGGER recipes

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- AUTO UPDATE "UPDATED_AT" TRIGGER users

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();