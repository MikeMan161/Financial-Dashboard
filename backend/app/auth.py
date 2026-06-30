"""
This file provides utility functions for authentication
password hashing/verification, creating/verifying JWT tokens.
"""
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from pathlib import Path
import bcrypt
from jose import jwt, JWTError
import os

load_dotenv(Path(__file__).parent.parent / ".env")

def hash_password(password: str) -> str:
    """Hashes a plain text password using bcrypt before storing in database."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    """Verifies a plain text password against a stored bcrypt hash."""
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    

def create_access_token(data: dict) -> str:
    """creates a signed JWT token with expiration from the provided payload"""
    to_encode = data.copy() #avoid mutating the original data dict
    expire = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))

def verify_token(token):
    """decodes and validates a JWT token. Returns payload dict or none if invalid"""
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        return payload
    except JWTError:
        return None