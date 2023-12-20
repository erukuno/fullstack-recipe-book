#sqlite tables
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer,String,Text, ForeignKey

class User(Base):
    __tablename__='users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email= Column(String, unique=True, index=True)
    hashed_password= Column(String)

    recipes= relationship("Recipe", back_populates="owner")
    
class RecipeModel(Base):
    __tablename__= "recipes"
    id= Column(Integer, primary_key=True, index=True)
    title= Column(String, index=True)
    description= Column(Text)
    instructions=Column(Text)
    owner_id= Column(Integer, ForeignKey("users.id"))

    owner=relationship("User", back_populates="recipes")