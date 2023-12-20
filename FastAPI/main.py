from typing import List  # Add this import at the top of your main.py file
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, engine
from models import RecipeModel, User

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:8000",  # Add your frontend development server's address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/recipes/", response_model=list[RecipeModel])
def read_recipes(db: Session = Depends(get_db)):
    recipes = db.query(RecipeModel).all()
    return recipes

@app.post("/recipes/", response_model=RecipeModel)
def create_recipe(recipe: RecipeModel, db: Session = Depends(get_db)):
    db_recipe = RecipeModel(**recipe.dict())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@app.put("/recipes/{recipe_id}", response_model=RecipeModel)
def update_recipe(recipe_id: int, updated_recipe: RecipeModel, db: Session = Depends(get_db)):
    db_recipe = db.query(RecipeModel).filter(RecipeModel.id == recipe_id).first()
    if db_recipe:
        for field, value in updated_recipe.dict().items():
            setattr(db_recipe, field, value)
        db.commit()
        db.refresh(db_recipe)
        return db_recipe
    raise HTTPException(status_code=404, detail="Recipe not found")

@app.delete("/recipes/{recipe_id}", response_model=RecipeModel)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = db.query(RecipeModel).filter(RecipeModel.id == recipe_id).first()
    if db_recipe:
        db.delete(db_recipe)
        db.commit()
        return db_recipe
    raise HTTPException(status_code=404, detail="Recipe not found")

