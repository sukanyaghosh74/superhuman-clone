from sqlalchemy import Column, String, Integer, JSON, Index
from app.db.session import Base

class CachedMessage(Base):
    __tablename__ = 'cached_messages'
    id = Column(String, primary_key=True)
    thread_id = Column(String, index=True)
    snippet = Column(String)
    labels = Column(JSON)
    updated_at = Column(Integer, index=True)

Index('ix_cached_messages_snippet', CachedMessage.snippet)

class Contact(Base):
    __tablename__ = 'contacts'
    email = Column(String, primary_key=True)
    name = Column(String)
    score = Column(Integer, default=0, index=True)
