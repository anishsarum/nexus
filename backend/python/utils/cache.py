import redis.asyncio as redis
import json
import numpy as np
import pandas as pd

redis_client = redis.Redis(host='redis', port=6379, db=0)

def to_jsonable(obj):
    if isinstance(obj, pd.DataFrame):
        return obj.to_dict(orient="records")
    elif isinstance(obj, pd.Series):
        return obj.to_dict()
    elif isinstance(obj, np.generic):
        return obj.item()
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {str(k): to_jsonable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [to_jsonable(v) for v in obj]
    else:
        return obj

async def get_or_set_cache(key, fetch_func, expire=300):
    cached = await redis_client.get(key)
    if cached:
        return json.loads(cached.decode("utf-8"))
    result = await fetch_func()
    result_jsonable = to_jsonable(result)
    await redis_client.setex(key, expire, json.dumps(result_jsonable))
    return result_jsonable
