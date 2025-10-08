import spacy
import pandas as pd
import os

# --- CONFIGURAÇÃO ---
DATA_DIR = "data"
METADATA_FILE = os.path.join(DATA_DIR, "metadata.csv")

# Carrega o modelo de linguagem pré-treinado do spaCy.
# Este é o "cérebro" da IA que sabe como identificar entidades em inglês.
print("Carregando modelo de IA (spaCy)...")
nlp = spacy.load("en_core_web_sm")
print("Modelo carregado com sucesso.")

def analyze_texts():
    """
    Lê os arquivos de texto processados e extrai entidades nomeadas (NER).
    """
    print("\nIniciando análise de texto para extração de entidades...")

    try:
        df = pd.read_csv(METADATA_FILE)
    except FileNotFoundError:
        print(f"!!! Erro: Arquivo de metadados '{METADATA_FILE}' não encontrado.")
        return

    # Filtra as linhas que não foram processadas corretamente no passo anterior
    df.dropna(subset=['processed_text_path'], inplace=True)

    # Itera sobre cada publicação que possui um arquivo de texto
    for index, row in df.iterrows():
        text_path = row["processed_text_path"]
        print(f"\n-> Analisando o texto de: {text_path}")

        try:
            # Lê o conteúdo do arquivo .txt
            with open(text_path, "r", encoding="utf-8") as f:
                text = f.read()

            # O spaCy processa o texto e encontra as entidades
            # Aumentamos o limite de caracteres que o spaCy pode processar de uma vez
            nlp.max_length = len(text) + 100
            doc = nlp(text)

            # Dicionário para agrupar as entidades encontradas por categoria
            entities = {}
            for ent in doc.ents:
                # ent.label_ é a categoria (ex: ORG)
                # ent.text é o texto da entidade (ex: NASA)
                if ent.label_ not in entities:
                    entities[ent.label_] = set() # Usamos set para evitar duplicatas
                entities[ent.label_].add(ent.text)

            # Imprime um resumo bonito das entidades encontradas
            print("   --- Entidades encontradas ---")
            if not entities:
                print("   Nenhuma entidade encontrada pelo modelo.")
            else:
                for label, items in entities.items():
                    # Mostra a categoria e até 10 exemplos
                    print(f"   - {label}: {list(items)[:10]}")

        except Exception as e:
            print(f"   !!! Erro ao analisar o arquivo {text_path}: {e}")
    
    print("\nAnálise concluída.")


# --- EXECUÇÃO DO SCRIPT ---
if __name__ == "__main__":
    analyze_texts()