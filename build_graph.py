import spacy
import pandas as pd
import os
from neo4j import GraphDatabase

# --- CONFIGURAÇÃO NEO4J ---
URI = "bolt://localhost:7687"
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
    try:
        df = pd.read_csv(METADATA_FILE)
        df.dropna(subset=['local_path'], inplace=True)
    except FileNotFoundError:
        print(f"!!! Erro: Arquivo '{METADATA_FILE}' não encontrado. Rode o script de ingestão primeiro.")
        return
    except pd.errors.EmptyDataError:
        print(f"!!! Erro: Arquivo '{METADATA_FILE}' está vazio. O script de ingestão não conseguiu extrair dados.")
        return

    with driver.session() as session:
        print("Limpando banco de dados antigo...")
        session.run("MATCH (n) DETACH DELETE n")

        for index, row in df.iterrows():
            title = row["title"]
            source_url = row["source_url"]
            text_path = row["local_path"]
            
            if not text_path.endswith('.txt'):
                print(f"Pulando arquivo não processado: {text_path}")
                continue
            
            print(f"\n-> Processando publicação: {title[:30]}...")

            session.run("MERGE (p:Publication {title: $title, source_url: $source_url})", title=title, source_url=source_url)
            
            with open(text_path, "r", encoding="utf-8") as f:
                text = f.read()
            
            nlp.max_length = len(text) + 100
            doc = nlp(text)

            for ent in doc.ents:
                label = ""
                # MUDANÇA AQUI: Adicionamos a etiqueta :Author
                if ent.label_ == "ORG": label = "Organization"
                elif ent.label_ == "PERSON": label = "Person:Author" # Nós de pessoa também são Autores
                elif ent.label_ == "GPE": label = "Location"
                
                if label:
                    # O nome do nó será apenas a primeira parte da etiqueta (ex: "Person")
                    node_label = label.split(':')[0]
                    session.run(f"MERGE (e:{label} {{name: $name}})", name=ent.text)
                    session.run(f"""
                        MATCH (p:Publication {{title: $title}})
                        MATCH (e:{node_label} {{name: $name}})
                        MERGE (p)-[:MENTIONS]->(e)
                    """, title=title, name=ent.text)
            
            print(f"   - Nós e relações criados para a publicação.")

if __name__ == "__main__":
    try:
        with GraphDatabase.driver(URI, auth=AUTH) as driver:
            driver.verify_connectivity()
            print("Conexão com Neo4j estabelecida com sucesso.")
            build_knowledge_graph(driver)
            print("\nGrafo de Conhecimento construído!")
    except Exception as e:
        print(f"!!! Erro ao conectar ou construir o grafo: {e}")
        print("!!! Verifique se o Neo4j Desktop está rodando e se a senha está correta.")