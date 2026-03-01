import os
from fastapi import HTTPException, status
from app.core.logger import get_logger

logger = get_logger(__name__)

def admin_auth(password: str):
    expected = os.getenv("ADMIN_PASSWORD")

    logger.info("Admin auth attempt")
    logger.debug(f"Received password: {password}")
    logger.debug(f"Expected password: {expected}")

    if not expected:
        logger.error("ADMIN_PASSWORD not set in environment")

    if password != expected:
        logger.warning("Invalid admin password attempt")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )

    logger.info("Admin authentication successful")