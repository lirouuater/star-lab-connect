import os
import requests
import pandas as pd

# --- CONFIGURAÇÃO ---
# Define onde os dados serão salvos.
# Usamos os.path.join para garantir que os caminhos funcionem em qualquer sistema operacional.
DATA_DIR = "data"
RAW_PDF_DIR = os.path.join(DATA_DIR, "raw_pdfs")
METADATA_FILE = os.path.join(DATA_DIR, "metadata.csv")

# --- FONTES DE DADOS ---
# ATUALIZADO NOVAMENTE: Usando um link direto e estável do servidor da NASA (ntrs.nasa.gov)
# para garantir que o download funcione.
publications = [
    {
        "doi": "11.1111/nyas.13325", # DOI do artigo original relacionado ao relatório
        "pdf_url": "https://ntrs.nasa.gov/api/citations/20170005531/downloads/20170005531.pdf",
        "title": "The NASA GeneLab project: A platform for space omics data analysis and collaboration"
    },
    # Você pode adicionar mais dicionários de publicações aqui para baixar mais arquivos.
]

def download_data():
    """
    Função principal para baixar os PDFs e salvar os metadados.
    """
    print("Iniciando o processo de download de dados...")
    
    # Lista para guardar as informações de cada arquivo baixado
    metadata_list = []

    for pub in publications:
        try:
            print(f"Baixando publicação com DOI: {pub['doi']}...")
            
            # Faz a requisição para obter o conteúdo do PDF
            response = requests.get(pub["pdf_url"])
            response.raise_for_status()  # Lança um erro se o download falhar (ex: erro 404)

            # Cria um nome de arquivo seguro, substituindo '/' por '_'
            safe_doi = pub['doi'].replace('/', '_')
            file_name = f"{safe_doi}.pdf"
            file_path = os.path.join(RAW_PDF_DIR, file_name)

            # Salva o conteúdo do PDF no arquivo
            with open(file_path, "wb") as f:
                f.write(response.content)

            print(f"-> Salvo com sucesso em: {file_path}")

            # Adiciona as informações à nossa lista de metadados
            metadata_list.append({
                "doi": pub["doi"],
                "title": pub["title"],
                "local_path": file_path
            })

        except requests.exceptions.RequestException as e:
            print(f"!!! Erro ao baixar {pub['pdf_url']}: {e}")

    # Converte a lista de metadados em um DataFrame do Pandas e salva como CSV
    if metadata_list:
        df = pd.DataFrame(metadata_list)
        df.to_csv(METADATA_FILE, index=False)
        print(f"\nMetadados de {len(metadata_list)} publicações salvos em: {METADATA_FILE}")
    else:
        print("\nNenhuma publicação foi baixada. O arquivo de metadados não foi criado.")

# --- EXECUÇÃO DO SCRIPT ---
# Este bloco garante que a função download_data() só será executada
# quando rodarmos o script diretamente (python ingest.py)
if __name__ == "__main__":
    download_data()