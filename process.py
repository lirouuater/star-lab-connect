import os
import pandas as pd
import PyPDF2

# --- CONFIGURAÇÃO ---
# Apontamos para os mesmos arquivos e pastas que o script anterior
DATA_DIR = "data"
PROCESSED_TEXT_DIR = os.path.join(DATA_DIR, "processed_text")
METADATA_FILE = os.path.join(DATA_DIR, "metadata.csv")

def extract_text_from_pdfs():
    """
    Lê os PDFs listados no metadata.csv, extrai o texto e salva em arquivos .txt.
    """
    print("Iniciando processo de extração de texto dos PDFs...")

    try:
        # Carrega nosso "índice" de arquivos baixados
        df = pd.read_csv(METADATA_FILE)
    except FileNotFoundError:
        print(f"!!! Erro: Arquivo de metadados '{METADATA_FILE}' não encontrado.")
        print("!!! Por favor, execute o script 'ingest.py' primeiro.")
        return # Encerra a função se o arquivo não existir

    # Lista para armazenar o caminho dos novos arquivos de texto
    processed_text_paths = []

    # Itera sobre cada linha do nosso arquivo CSV (cada publicação)
    for index, row in df.iterrows():
        pdf_path = row["local_path"]
        doi = row["doi"]
        safe_doi = doi.replace('/', '_') # Usa o mesmo formato de nome do ingest.py

        print(f"-> Processando arquivo: {pdf_path}")
        
        try:
            full_text = ""
            # Abre o arquivo PDF em modo de leitura binária ('rb')
            with open(pdf_path, "rb") as file:
                reader = PyPDF2.PdfReader(file)
                # Extrai o texto de cada página e junta tudo
                for page in reader.pages:
                    full_text += page.extract_text() + "\n"
            
            # Define o nome e o caminho para o novo arquivo .txt
            text_filename = f"{safe_doi}.txt"
            text_filepath = os.path.join(PROCESSED_TEXT_DIR, text_filename)
            
            # Salva o texto extraído no arquivo .txt
            with open(text_filepath, "w", encoding="utf-8") as f:
                f.write(full_text)
            
            print(f"   - Texto extraído com sucesso para: {text_filepath}")
            processed_text_paths.append(text_filepath)

        except Exception as e:
            print(f"   !!! Erro ao processar o arquivo {pdf_path}: {e}")
            processed_text_paths.append(None) # Adiciona None em caso de erro

    # Adiciona a nova coluna com os caminhos dos arquivos de texto ao nosso DataFrame
    df["processed_text_path"] = processed_text_paths
    
    # Salva o CSV atualizado, sobrescrevendo o antigo
    df.to_csv(METADATA_FILE, index=False)
    print(f"\nArquivo de metadados '{METADATA_FILE}' foi atualizado com os caminhos dos textos.")

# --- EXECUÇÃO DO SCRIPT ---
if __name__ == "__main__":
    extract_text_from_pdfs()