"""API kecil untuk menerima pesan dari form kontak portofolio.

Jalankan:  uvicorn main:app --reload   (dari folder backend)
"""
import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

FILE_PESAN = Path(__file__).with_name("pesan.json")

app = FastAPI(title="API Kontak Portofolio")
app.add_middleware(
    CORSMiddleware,
    # Tambahkan alamat websitemu yang sudah online, contoh: https://username.github.io
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


class Pesan(BaseModel):
    nama: str = Field(min_length=2, max_length=80)
    email: str = Field(pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$", max_length=120)
    pesan: str = Field(min_length=10, max_length=2000)


def baca_semua() -> list:
    if FILE_PESAN.exists():
        return json.loads(FILE_PESAN.read_text(encoding="utf-8"))
    return []


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/pesan", status_code=201)
def kirim_pesan(data: Pesan):
    semua = baca_semua()
    semua.append({**data.model_dump(), "waktu": datetime.now(timezone.utc).isoformat()})
    FILE_PESAN.write_text(json.dumps(semua, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"pesan": "Pesan diterima"}
