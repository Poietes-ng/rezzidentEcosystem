import json
import logging
from datetime import UTC, datetime


class StructuredFormatter(logging.Formatter):
    """JSON structured log formatter for production observability."""

    def format(self, record):
        log_entry = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "filename": record.filename,
            "line": record.lineno,
        }
        if record.exc_info and record.exc_info[0] is not None:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)


# Configure the logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d: %(message)s",
    handlers=[logging.FileHandler("logs/app_logs.log"), logging.StreamHandler()],
)

app_logger = logging.getLogger("rezzident")
