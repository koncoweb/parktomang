from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Hardcoded admin credentials
ADMIN_EMAIL = "joni@email.com"
ADMIN_PASSWORD = "joni2#Marjoni"

# Create the main app
app = FastAPI(title="Paroki Tomang API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

class User(BaseModel):
    email: EmailStr
    role: str = "admin"

class SliderItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_base64: str
    link: Optional[str] = None
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MenuItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    icon: str
    route: Optional[str] = None
    link: Optional[str] = None
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return User(email=email, role="admin")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Auth routes
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    # Check hardcoded admin credentials
    if request.email == ADMIN_EMAIL and request.password == ADMIN_PASSWORD:
        access_token = create_access_token(data={"sub": request.email})
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user={"email": request.email, "role": "admin"}
        )
    raise HTTPException(status_code=401, detail="Incorrect email or password")

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Slider routes
@api_router.get("/sliders", response_model=List[SliderItem])
async def get_sliders():
    sliders = await db.sliders.find({"active": True}).sort("order", 1).to_list(100)
    return [SliderItem(**slider) for slider in sliders]

@api_router.post("/sliders", response_model=SliderItem)
async def create_slider(slider: SliderItem, current_user: User = Depends(get_current_user)):
    slider_dict = slider.dict()
    await db.sliders.insert_one(slider_dict)
    return slider

# Menu routes
@api_router.get("/menus", response_model=List[MenuItem])
async def get_menus():
    menus = await db.menus.find({"active": True}).sort("order", 1).to_list(100)
    return [MenuItem(**menu) for menu in menus]

@api_router.post("/menus", response_model=MenuItem)
async def create_menu(menu: MenuItem, current_user: User = Depends(get_current_user)):
    menu_dict = menu.dict()
    await db.menus.insert_one(menu_dict)
    return menu

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
