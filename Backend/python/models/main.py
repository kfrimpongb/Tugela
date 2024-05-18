from fastapi import FastAPI
from Backend.python.api.routes.routes import router

app = FastAPI()

# Include the router from routes.py
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081, reload=True)
