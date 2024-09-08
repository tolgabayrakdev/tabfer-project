from fastapi import Request
import logging
import time
import os

# Logging klasörünün yolunu belirleyin
log_directory = os.path.join(os.path.dirname(__file__), "../logs")
os.makedirs(log_directory, exist_ok=True)

# Log dosyasının yolunu belirleyin
log_file_path = os.path.join(log_directory, "app.log")

# Logging konfigürasyonunu güncelleyin
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename=log_file_path,
    filemode="a",
)
logger = logging.getLogger(__name__)


async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    status_code = response.status_code
    logger.info(
        f"{request.method} {request.url.path} completed in {process_time:.4f}s with status code {status_code}"
    )

    return response
