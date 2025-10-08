from fastapi import FastAPI, HTTPException
from neo4j import GraphDatabase
from pydantic import BaseModel
from typing import List, Dict, Any
import pandas as pd
from transformers import pipeline
import os
import google.generativeai as genai
import spacy

# --- CARREGAMENTO DE MODELOS E CONFIGURAÇÕES ---
print("Carregando modelos de IA...")
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
nlp = spacy.load("en_core_web_sm") # Carregamos o spaCy para extração de palavras-chave
print("Modelos carregados com sucesso.")

# --- CONFIGURAÇÃO DA API DO GOOGLE GEMINI ---
try:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("A variável de ambiente GOOGLE_API_KEY não foi definida.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro-latest')
    print("Cliente da API do Google Gemini configurado com sucesso.")
except Exception as e:
    print(f"!!! Erro ao configurar a API do Google: {e}")
    model = None

# --- CONFIGURAÇÃO NEO4J ---
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "password")
METADATA_FILE = "data/metadata.csv"

app = FastAPI(
    title="Space Biology Knowledge Engine API",
    description="API com a assistente de IA Dra. Aris, agora com busca no grafo de conhecimento (RAG).",
    version="1.0.0", # Versão 1.0 - Funcionalidade principal completa!
)

# --- MODELOS DE DADOS ---
class ChatRequest(BaseModel): question: str
class ChatResponse(BaseModel): answer: str

def get_db_driver(): return GraphDatabase.driver(URI, auth=AUTH)

# --- FUNÇÕES DE LÓGICA RAG ---

def extract_keywords(text: str) -> List[str]:
    """Usa spaCy para extrair substantivos e entidades da pergunta do usuário."""
    doc = nlp(text.lower())
    keywords = set([token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN"]])
    # Adicionamos as entidades também, para pegar nomes como "ISS"
    for ent in doc.ents:
        keywords.add(ent.text)
    
    # Mapeamento simples para sinônimos comuns em nosso contexto
    if "mice" in keywords or "mouse" in keywords:
        keywords.add("rodent")
        
    print(f"Palavras-chave extraídas: {list(keywords)}")
    return list(keywords)

def find_relevant_publications(keywords: List[str]) -> List[str]:
    """Consulta o Neo4j para encontrar publicações que mencionam as palavras-chave."""
    if not keywords:
        return []

    # Constrói a consulta Cypher dinamicamente
    match_clauses = []
    for i, keyword in enumerate(keywords):
        match_clauses.append(f"MATCH (p)-[:MENTIONS]->(e{i}) WHERE toLower(e{i}.name) CONTAINS '{keyword.lower()}'")
    
    query = "\n".join(match_clauses) + "\nRETURN DISTINCT p.title AS title LIMIT 5"
    print(f"Executando consulta no grafo:\n{query}")

    try:
        with get_db_driver().session() as session:
            results = session.run(query)
            titles = [record["title"] for record in results]
            print(f"Publicações encontradas no grafo: {titles}")
            return titles
    except Exception as e:
        print(f"!!! Erro ao consultar o grafo: {e}")
        return []

# --- ENDPOINTS DA API ---

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao motor de conhecimento de Biologia Espacial!"}

@app.post("/chat", response_model=ChatResponse)
def chat_with_dr_aris(request: ChatRequest):
    """
    Endpoint de chat com a Dra. Aris, agora com lógica RAG.
    """
    if not model:
        raise HTTPException(status_code=500, detail="A API do Google Gemini não foi configurada.")

    user_question = request.question
    print(f"Pergunta recebida para a Dra. Aris: {user_question}")

    # --- INÍCIO DA LÓGICA RAG ---
    # Passo 1: Extrair palavras-chave da pergunta
    keywords = extract_keywords(user_question)
    
    # Passo 2: Buscar publicações relevantes no grafo
    relevant_titles = find_relevant_publications(keywords)
    
    # Passo 3: Construir o contexto para a IA
    if relevant_titles:
        context_facts = "Encontrei os seguintes artigos em nossa base de conhecimento que parecem relevantes: " + "; ".join(f"'{title}'" for title in relevant_titles) + "."
    else:
        context_facts = "Não encontrei artigos específicos sobre todos esses termos em nossa base de dados, mas tentarei responder com meu conhecimento geral."
    # --- FIM DA LÓGICA RAG ---

    full_prompt = f"""
    Sua persona: Você é a Dra. Aris, uma cientista social e comunicadora científica amigável. Responda de forma calorosa e educativa, baseando-se nos fatos do contexto fornecidos. Mantenha as respostas concisas.

    Fatos do Contexto: {context_facts}

    Pergunta do Usuário: "{user_question}"
    """

    try:
        response = model.generate_content(full_prompt)
        return ChatResponse(answer=response.text)
    except Exception as e:
        detailed_error = f"Erro do tipo {type(e).__name__}: {e}"
        raise HTTPException(status_code=500, detail=detailed_error)

# Outros endpoints como /analytics/* podem ser adicionados aqui

