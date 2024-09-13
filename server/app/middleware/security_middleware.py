from fastapi import Request, HTTPException
from app.util.security_rule import SecurityRule
import os
import logging

# Logging klasörünün yolunu belirleyin
log_directory = os.path.join(os.path.dirname(__file__), "../logs")
os.makedirs(log_directory, exist_ok=True)

# Log dosyasının yolunu belirleyin
log_file_path = os.path.join(log_directory, "security.log")

# Logging konfigürasyonunu güncelleyin
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename=log_file_path,
    filemode="a",
)
logger = logging.getLogger(__name__)

async def security_middleware(request: Request, call_next):
    # İstek gövdesini oku
    body = await request.body()
    body_str = body.decode("utf-8")
    
    # SQL Injection Tespiti
    if SecurityRule.detect_sql_injection(body_str):
        logger.warning(f"SQL Injection attempt detected: {body_str}")
        raise HTTPException(status_code=400, detail="Potential SQL Injection detected")
    
    # XSS Tespiti
    if SecurityRule.detect_xss(body_str):
        logger.warning(f"XSS attempt detected: {body_str}")
        raise HTTPException(status_code=400, detail="Potential XSS attack detected")
    
    # Path Traversal Tespiti
    if SecurityRule.detect_path_traversal(body_str):
        logger.warning(f"Path Traversal attempt detected: {body_str}")
        raise HTTPException(status_code=400, detail="Potential Path Traversal attack detected")

    # Command Injection Tespiti
    if SecurityRule.detect_command_injection(body_str):
        logger.warning(f"Command Injection attempt detected: {body_str}")
        raise HTTPException(status_code=400, detail="Potential Command Injection attack detected")

    # İsteği işle ve yanıtı al
    response = await call_next(request)

    return response
