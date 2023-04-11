from sqlalchemy import MetaData, Table, func

from bpr_main import db


class BoardModel(db.Model):
    __tablename__ = 'board'
    __table__ = Table(__tablename__, MetaData(bind=db.engine), autoload=True)
    """
    id: int
    account_id: int
    type: int, {0: formative, 1:summative, 2:feedback(assessment), 3:feedback(question) 4: collection}
    event: varchar
    target_id: int, (include assessment_id and question_id, and aat id is 0)
    credit: int
    time: datetime
    """

    @staticmethod
    def get_board_by_id(id):
        return db.session.query(BoardModel).get(id)
