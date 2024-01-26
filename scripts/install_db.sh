echo "updating Repositories. Please wait..."

sudo apt update
sudo apt upgrade

echo "adding MongoDB to the packages. Please wait..."

curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \sudo gpg -o /etc/apt/trusted.gpg.d//mongodb-server-6.0.gpg \--dearmor
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

echo "Repositories. Please wait..."

sudo apt install mongodb-org
sudo systemctl start mongod
sudo systemctl enable --now mongod

echo "Database Installed!"