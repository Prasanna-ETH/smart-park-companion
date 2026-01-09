import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from dotenv import load_dotenv
from . import models, database
from sqlalchemy.orm import Session

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(database.get_db)):
    """
    Standard dependency to verify the Supabase JWT token and return the User model.
    """
    token = credentials.credentials
    try:
        # Verify token with Supabase Auth
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
             raise HTTPException(status_code=401, detail="Invalid token")
        
        user_id = str(user_response.user.id)
        
        # Look up user in the profiles table
        user = db.query(models.User).filter(models.User.id == user_id).first()
        
        # If user doesn't exist in local profile table (fallback sync)
        if not user:
             role = user_response.user.user_metadata.get('role', 'user')
             full_name = user_response.user.user_metadata.get('full_name', '')
             new_user = models.User(
                 id=user_id,
                 email=user_response.user.email,
                 role=role,
                 full_name=full_name
             )
             db.add(new_user)
             db.commit()
             db.refresh(new_user)
             return new_user
             
        return user

    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_active_owner(current_user: models.User = Depends(get_current_user)):
    """
    Ensures the authenticated user has the 'owner' role.
    """
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Not authorized as Owner")
    return current_user
