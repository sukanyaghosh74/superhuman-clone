import base64
from cryptography.fernet import Fernet
from app.utils.config import settings

# Derive a valid Fernet key from a 32-byte string
secret = settings.TOKEN_ENCRYPTION_KEY.encode("utf-8")
fernet_key = base64.urlsafe_b64encode(secret[:32])
fernet = Fernet(fernet_key)

def encrypt_token(token: str) -> str:
    return fernet.encrypt(token.encode("utf-8")).decode("utf-8")

def decrypt_token(token: str) -> str:
    return fernet.decrypt(token.encode("utf-8")).decode("utf-8")
