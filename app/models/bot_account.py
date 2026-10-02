from app.extensions import db
from app.utils import utcnow


class BotAccount(db.Model):
    __tablename__ = "bot_accounts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    platform = db.Column(db.String(16), nullable=False)
    external_id = db.Column(db.String(16), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    __table_args__ = (db.UniqueConstraint("platform", "external_id", "user_id"),)

    user = db.relationship("User", back_populates="bot_accounts")
