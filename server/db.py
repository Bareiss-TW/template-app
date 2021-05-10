#!/usr/bin/python
# -*- coding: UTF-8 -*-

from corelib.databaselib.db_operation import DB_PG2
 
# db = DB(r"(localDB)\BareissLocalDB", r"BareissAdmin", r"BaAdmin")
db = DB_PG2(r"PostgreSQL 12", "tech_plan", r"BareissAdmin", r"BaAdmin")

if __name__=="__main__":
    db = DB_PG2(r"postgre122s", "tech_plan", r"BareissAdmin", r"BaAdmin")
    print(db.connect())
    db.close()