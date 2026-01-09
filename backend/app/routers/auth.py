from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, schemas, crud, auth, models

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    """
    Returns the current authenticated user details from Supabase token.
    """
    return current_user

# The /login and /register endpoints are now handled by Supabase on the frontend.
# We keep these here as placeholders if we ever need to proxy them.
