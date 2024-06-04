CREATE DATABASE pong_db;
CREATE ROLE user WITH LOGIN PASSWORD 'password_very_strong2';
GRANT ALL PRIVILEGES ON DATABASE pong_db TO user;
GRANT CREATE ON SCHEMA public To user;
ALTER USER user WITH SUPERUSER;
