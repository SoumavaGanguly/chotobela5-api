import os
from fastapi import HTTPException, status

def admin_auth(password: str):
    if password != os.getenv("ADMIN_PASSWORD"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )