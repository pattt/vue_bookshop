#!/bin/bash

rm -rf www
mkdir www
cd $_
git clone https://github.com/aleksandr-tkachuk/BookShop.git .

sed -i .htaccess.bk '/RewriteBase/d' ./.htaccess 
cd ..
sed -i config.bk -f configfix.sed ./www/config/config.php
rm ./www/database/bookShop_dump.sql ./www/database/pg_db.sql
