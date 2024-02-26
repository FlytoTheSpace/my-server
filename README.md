# Node.js Installation
This Web Server is built with Node.js so it's Highly Recommended to install Node.js from The Official Source [Install](https://nodejs.dev/) or consider following this tutorial for extra Explaination: [Tutorial](https://www.youtube.com/watch?v=bc3_FL9zWWs&t=265s)
# Setup: Server

## Running Script for Basic Setup
run **setup_server.sh** to Automatically setup The Basics

```bash
bash ./scripts/setup_server.sh
```

## Manual Setup
### (skip this if you used setup script)
install **node_modules**

```bash
npm install
```
create folders for user Generated Content
```bash
mkdir uploads
mkdir uploads/pdfs
mkdir client/static/public
mkdir client/static/uploads
mkdir client/static/uploads/profile
```
add Cloud if you want (*Optional*)
```bash
mkdir cloud
```

add Environment variables
```bash
mv .env.dist .env
```
edit Environment variables (*optional*) (*Recommended for Security*)
```bash
nano .env
```

## Database Setup
### Installing with MongoDB
Official Site: [Source](https://www.mongodb.com/try/download/community)

Run this Script for Automatic Setup or Stick around
```bash
bash ./scripts/ubuntu_install_db.sh
```
Tutorials

[Windows](https://www.youtube.com/watch?v=gB6WLkSrtJk)

[Linux (Ubuntu)](https://www.youtube.com/watch?v=HSIh8UswVVY)

### Ubuntu Edition:

update Repositories (*optional*)
```bash
sudo apt update
sudo apt upgrade
```
add MongoDB to the packages
```bash
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \sudo gpg -o /etc/apt/trusted.gpg.d//mongodb-server-6.0.gpg \--dearmor

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```
Install MongoDB
```
sudo apt install mongodb-org
```
Enable MongoD Service
```bash
sudo systemctl start mongod
```
Check Status (*Optional*)
```bash
sudo systemctl status mongod
```
Automatically Launch of MongoD (*Optional*)
```bash
sudo systemctl enable --now mongod
```
now The Database Service is Install let's set it up

### **Setting up Databases**

(This has to be done Manually)
open up MongoDB Shell

**Linux (All Distributions)**: 
```bash
mongosh
```
**Windows**: 
```bash
mongo
```
Create Database
```
use mydatabase;
```
Create Required Collections
```
db.createCollection('accounts');
db.createCollection('userData');
```

# Running The Server

### Run The Server
```bash
npm start
```
by Default The Server will listen on Port: **5500**

Quick Access after Running:

http://locahost:5500

http://127.0.0.1:5500

Go to "bin" folder to The Control Panel of The Server