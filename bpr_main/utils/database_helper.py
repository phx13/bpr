# 数据库帮助类
class DatabaseHelper:
    # 创建表方法
    @staticmethod
    def create_table(db, table):
        # print(db.Model.metadata.tables)
        print(db.get_binds())
        print(db.get_engine())
        print(db.get_tables_for_bind())
        # db.create_all(bind_key=table)
        db.create_all()

