from fastapi import FastAPI, HTTPException
from neo4j import GraphDatabase
from pydantic import BaseModel
from typing import List, Dict, Any

# --- CONFIGURAÇÃO NEO4J ---
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "password") # Use a mesma senha do seu Neo4j Desktop

# Cria a instância da nossa API
app = FastAPI(
    title="Space Biology Knowledge Engine API",
    description="API para servir dados do nosso grafo de conhecimento da NASA.",
    version="0.1.0",
)

# --- MODELOS DE DADOS (Pydantic) ---
# Isso ajuda a FastAPI a validar e formatar os dados de saída
class Node(BaseModel):
    id: int
    label: str
    properties: Dict[str, Any]

class Relationship(BaseModel):
    id: int
    type: str
    start_node: int
    end_node: int
    properties: Dict[str, Any]

class GraphData(BaseModel):
    nodes: List[Node]
    relationships: List[Relationship]


# --- LÓGICA DE CONEXÃO COM O BANCO DE DADOS ---
def get_db_driver():
    """Retorna uma instância do driver do Neo4j."""
    return GraphDatabase.driver(URI, auth=AUTH)

# --- ENDPOINTS DA API ---

@app.get("/")
def read_root():
    """Endpoint inicial da API."""
    return {"message": "Bem-vindo ao motor de conhecimento de Biologia Espacial!"}

# LINHA CORRIGIDA ABAIXO
@app.get("/graph/publication/{doi:path}", response_model=GraphData)
def get_publication_graph(doi: str):
    """
    Busca no Neo4j a publicação pelo DOI e retorna o subgrafo de todas as
    entidades diretamente conectadas a ela.
    """
    query = """
    MATCH (p:Publication {doi: $doi})-[r:MENTIONS]->(e)
    RETURN p, r, e
    """
    
    nodes = []
    relationships = []
    node_ids = set() # Para evitar adicionar o mesmo nó duas vezes

    try:
        with get_db_driver().session() as session:
            results = session.run(query, doi=doi)
            
            for record in results:
                pub_node = record["p"]
                rel = record["r"]
                entity_node = record["e"]

                # Adiciona o nó da publicação se ainda não foi adicionado
                if pub_node.id not in node_ids:
                    nodes.append(Node(id=pub_node.id, label=list(pub_node.labels)[0], properties=dict(pub_node)))
                    node_ids.add(pub_node.id)

                # Adiciona o nó da entidade se ainda não foi adicionado
                if entity_node.id not in node_ids:
                    nodes.append(Node(id=entity_node.id, label=list(entity_node.labels)[0], properties=dict(entity_node)))
                    node_ids.add(entity_node.id)
                
                # Adiciona a relação
                relationships.append(Relationship(
                    id=rel.id,
                    type=rel.type,
                    start_node=rel.start_node.id,
                    end_node=rel.end_node.id,
                    properties=dict(rel)
                ))

        if not nodes:
            raise HTTPException(status_code=404, detail="Publicação não encontrada no grafo.")

        return GraphData(nodes=nodes, relationships=relationships)

    except Exception as e:
        # Em caso de erro, retorna um erro HTTP 500
        raise HTTPException(status_code=500, detail=str(e))