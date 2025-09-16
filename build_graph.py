import spacy
import pandas as pd
import os
from neo4j import GraphDatabase

# --- CONFIGURAÇÃO NEO4J ---
# Endereço do seu banco de dados Neo4j (geralmente este é o padrão)
URI = "bolt://localhost:7687"
# Usuário é 'neo4j' por padrão. Coloque a senha que você definiu no Neo4j Desktop.
AUTH = ("neo4j", "password")

# --- CONFIGURAÇÃO DO PROJETO ---
DATA_DIR = "data"
METADATA_FILE = os.path.join(DATA_DIR, "metadata.csv")
nlp = spacy.load("en_core_web_sm")

def build_knowledge_graph(driver):
    """
    Processa os textos, extrai entidades e popula o grafo no Neo4j.
    """
    print("Iniciando a construção do Grafo de Conhecimento...")
    df = pd.read_csv(METADATA_FILE)
    df.dropna(subset=['processed_text_path'], inplace=True)

    with driver.session() as session:
        # Limpa o banco de dados para começar do zero a cada execução
        print("Limpando banco de dados antigo...")
        session.run("MATCH (n) DETACH DELETE n")

        for index, row in df.iterrows():
            doi = row["doi"]
            title = row["title"]
            text_path = row["processed_text_path"]
            
            print(f"\n-> Processando publicação: {title[:30]}...")

            # 1. Cria o nó principal para a Publicação
            session.run("MERGE (p:Publication {doi: $doi, title: $title})", doi=doi, title=title)
            
            with open(text_path, "r", encoding="utf-8") as f:
                text = f.read()
            
            nlp.max_length = len(text) + 100
            doc = nlp(text)

            # 2. Itera sobre as entidades e cria nós e relações
            for ent in doc.ents:
                # Mapeia a etiqueta do spaCy para uma etiqueta do Grafo
                label = ""
                if ent.label_ == "ORG":
                    label = "Organization"
                elif ent.label_ == "PERSON":
                    label = "Person"
                elif ent.label_ == "GPE":
                    label = "Location"
                
                # Só cria nós para as categorias que mapeamos
                if label:
                    # Cria o nó da entidade (MERGE evita duplicatas)
                    session.run(f"MERGE (e:{label} {{name: $name}})", name=ent.text)
                    
                    # Cria a relação entre a Publicação e a Entidade
                    session.run("""
                        MATCH (p:Publication {doi: $doi})
                        MATCH (e:%s {name: $name})
                        MERGE (p)-[:MENTIONS]->(e)
                    """ % label, doi=doi, name=ent.text)

            print(f"   - Nós e relações criados para a publicação com DOI: {doi}")

if __name__ == "__main__":
    try:
        # Tenta conectar ao banco de dados
        with GraphDatabase.driver(URI, auth=AUTH) as driver:
            driver.verify_connectivity()
            print("Conexão com Neo4j estabelecida com sucesso.")
            build_knowledge_graph(driver)
            print("\nGrafo de Conhecimento construído!")
    except Exception as e:
        print(f"!!! Erro ao conectar ou construir o grafo: {e}")
        print("!!! Verifique se o Neo4j Desktop está rodando e se a senha está correta.")