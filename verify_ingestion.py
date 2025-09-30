import pandas as pd
import requests
import os

# API do GitHub, a fonte da verdade para encontrar a URL
GITHUB_API_URL = "https://api.github.com/repos/jgalazka/SB_publications/contents/"
# Arquivo de metadados local com os nossos sucessos
METADATA_FILE = os.path.join("data", "metadata.csv")

def get_csv_download_url_from_github():
    """
    Usa a API do GitHub para encontrar dinamicamente a URL de download do arquivo CSV.
    (Esta é a mesma função do nosso script de ingestão bem-sucedido)
    """
    print("Consultando a API do GitHub para encontrar a URL do CSV original...")
    try:
        response = requests.get(GITHUB_API_URL)
        response.raise_for_status()
        contents = response.json()
        for item in contents:
            if isinstance(item, dict) and item.get('type') == 'file' and item.get('name', '').endswith('.csv'):
                csv_url = item.get('download_url')
                print(f"URL do CSV encontrada.")
                return csv_url
        print("!!! Nenhum arquivo .csv encontrado na pasta do repositório.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"!!! Erro ao consultar a API do GitHub: {e}")
        return None

def find_missing_publications():
    """
    Compara o CSV original do GitHub com nossos metadados locais para encontrar
    as publicações que falharam na ingestão.
    """
    try:
        # Primeiro, descobre a URL correta do CSV
        original_csv_url = get_csv_download_url_from_github()
        if not original_csv_url:
            print("Não foi possível continuar a verificação sem a URL do CSV original.")
            return

        print("Lendo o CSV original do GitHub...")
        headers = {'User-Agent': 'Mozilla/5.0'}
        df_original = pd.read_csv(original_csv_url, storage_options=headers)
        # Garante que os nomes das colunas sejam os mesmos que usamos no script de ingestão
        df_original.columns = ['title', 'full_text_url']
        
        print("Lendo o arquivo de metadados local...")
        df_success = pd.read_csv(METADATA_FILE)
        
        # Compara usando a coluna 'title', que é comum a ambos os arquivos
        successful_titles = df_success['title'].tolist()
        missing_df = df_original[~df_original['title'].isin(successful_titles)]
        
        print(f"\n--- Análise de Ingestão Concluída ---")
        print(f"Total de publicações na lista original: {len(df_original)}")
        print(f"Total de publicações processadas com sucesso: {len(df_success)}")
        print(f"Total de falhas: {len(missing_df)}")

        if not missing_df.empty:
            print("\n--- Publicações que Falharam na Ingestão ---")
            for index, row in missing_df.iterrows():
                print(f"- Título: {row['title']}")
                print(f"  Link: {row['full_text_url']}")

    except FileNotFoundError:
        print(f"!!! Erro: O arquivo '{METADATA_FILE}' não foi encontrado. Execute o ingest_from_github.py primeiro.")
    except Exception as e:
        print(f"!!! Um erro inesperado ocorreu: {e}")

if __name__ == "__main__":
    find_missing_publications()