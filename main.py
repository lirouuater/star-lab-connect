from fastapi import FastAPI, HTTPException
from neo4j import GraphDatabase
from pydantic import BaseModel
from typing import List, Dict, Any
import pandas as pd
from transformers import pipeline

# --- CARREGAMENTO DO MODELO DE IA (FEITO APENAS UMA VEZ) ---
print("Carregando modelo de sumarização... Isso pode levar um momento.")
# Usamos um modelo eficiente e bem conceituado para resumos
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
print("Modelo carregado com sucesso.")

# --- CONFIGURAÇÃO NEO4J ---
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "password")
METADATA_FILE = "data/metadata.csv"

app = FastAPI(
    title="Space Biology Knowledge Engine API",
    description="API para servir dados e análises do nosso grafo de conhecimento.",
    version="0.3.0",
)

# --- MODELOS DE DADOS ---
class TopItem(BaseModel):
    name: str
    count: int

class SummaryResponse(BaseModel):
    title: str
    summary: str

# (Outros modelos de dados como Node, Relationship, etc. podem ser adicionados aqui se necessário)

def get_db_driver():
    return GraphDatabase.driver(URI, auth=AUTH)

# --- ENDPOINTS DA API ---

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao motor de conhecimento de Biologia Espacial!"}

# --- ENDPOINTS DE BIBLIOMETRIA E ANÁLISE ---

@app.get("/analytics/top-organizations", response_model=List[TopItem])
def get_top_organizations():
    """Retorna as 10 organizações mais mencionadas nos artigos."""
    # (Este código não muda)
    query = "MATCH (o:Organization)<-[:MENTIONS]-(p:Publication) RETURN o.name AS name, count(p) AS count ORDER BY count DESC LIMIT 10"
    with get_db_driver().session() as session:
        results = session.run(query)
        return [TopItem(**record) for record in results]

@app.get("/analytics/top-authors", response_model=List[TopItem])
def get_top_authors():
    """Retorna os 10 autores mais mencionados nos artigos."""
    # (Este código não muda)
    query = "MATCH (a:Author)<-[:MENTIONS]-(p:Publication) RETURN a.name AS name, count(p) AS count ORDER BY count DESC LIMIT 10"
    with get_db_driver().session() as session:
        results = session.run(query)
        return [TopItem(**record) for record in results]

@app.get("/analytics/summarize/{title:path}", response_model=SummaryResponse)
def get_summary(title: str):
    """
    Gera um resumo automático para um artigo específico com base no título.
    """
    try:
        df = pd.read_csv(METADATA_FILE)
        # Encontra a linha correspondente ao título
        article_row = df[df['title'] == title]
        if article_row.empty:
            raise HTTPException(status_code=404, detail="Artigo não encontrado no metadata.")
        
        text_path = article_row.iloc[0]['local_path']
        
        with open(text_path, 'r', encoding='utf-8') as f:
            # Lemos apenas os primeiros 3000 caracteres para um resumo rápido e eficiente
            text_to_summarize = f.read(3000)

        # Gera o resumo usando o modelo carregado
        summary_result = summarizer(text_to_summarize, max_length=150, min_length=40, do_sample=False)
        
        return SummaryResponse(title=title, summary=summary_result[0]['summary_text'])

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Arquivo de texto para '{title}' não encontrado.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# O endpoint /graph/publication/{title} pode ser adicionado aqui se desejado