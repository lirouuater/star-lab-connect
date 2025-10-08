import pandas as pd
import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin

# --- CONFIGURAÇÕES ---
GITHUB_API_URL = "https://api.github.com/repos/jgalazka/SB_publications/contents/"
DATA_DIR = "data"
PROCESSED_TEXT_DIR = os.path.join(DATA_DIR, "processed_text")
METADATA_FILE = os.path.join(DATA_DIR, "metadata.csv")

def get_csv_download_url_from_github():
    """Usa a API do GitHub para encontrar dinamicamente a URL de download do arquivo CSV."""
    print(f"Consultando a API do GitHub para encontrar o arquivo CSV...")
    try:
        response = requests.get(GITHUB_API_URL)
        response.raise_for_status()
        contents = response.json()
        for item in contents:
            if isinstance(item, dict) and item.get('type') == 'file' and item.get('name', '').endswith('.csv'):
                print(f"Arquivo CSV encontrado: {item['name']}")
                return item.get('download_url')
        return None
    except requests.exceptions.RequestException as e:
        print(f"!!! Erro ao consultar a API do GitHub: {e}")
        return None

def get_publications_from_github_csv(csv_url):
    """Lê o arquivo CSV a partir da URL fornecida."""
    print(f"Acessando o arquivo CSV em: {csv_url}")
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        df = pd.read_csv(csv_url, storage_options=headers)
        df.columns = ['title', 'full_text_url']
        return df.to_dict('records')
    except Exception as e:
        print(f"!!! Erro ao ler o arquivo CSV: {e}")
        return []

def process_publication_page(publication_info, session):
    """
    Tenta múltiplas estratégias para extrair o conteúdo de uma publicação.
    Retorna o caminho do arquivo de texto salvo e o método usado.
    """
    page_url = publication_info['full_text_url']
    try:
        response = session.get(page_url, timeout=20)
        soup = BeautifulSoup(response.content, 'lxml')
        
        # --- Estratégia 1: Extrair texto do HTML ---
        selectors = ['div.j-article-body', 'div.article-text', 'div#article-content', 'article']
        for selector in selectors:
            article_body = soup.select_one(selector)
            if article_body:
                print(f"    -> Estratégia 1 (HTML) bem-sucedida com seletor '{selector}'.")
                full_text = article_body.get_text(separator='\n', strip=True)
                safe_title = "".join(c for c in publication_info['title'] if c.isalnum() or c in (' ', '_')).rstrip()
                filename = f"{safe_title[:50]}.txt"
                filepath = os.path.join(PROCESSED_TEXT_DIR, filename)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(full_text)
                return filepath, "HTML_EXTRACTION"

        # --- Estratégia 2: Encontrar e Baixar PDF ---
        pdf_link_tag = soup.find('a', class_='format-pdf', href=True)
        if pdf_link_tag:
            print("    -> Estratégia 1 falhou. Tentando Estratégia 2 (PDF)...")
            pdf_url = urljoin(page_url, pdf_link_tag['href'])
            pdf_response = session.get(pdf_url, timeout=60) # Maior timeout para PDFs
            safe_title = "".join(c for c in publication_info['title'] if c.isalnum() or c in (' ', '_')).rstrip()
            # Salvamos como .pdf e o process.py cuidará da extração de texto
            filename = f"{safe_title[:50]}.pdf"
            filepath = os.path.join(DATA_DIR, "raw_pdfs", filename) # Salva na pasta de PDFs
            with open(filepath, 'wb') as f:
                f.write(pdf_response.content)
            return filepath, "PDF_DOWNLOAD"

        # --- Estratégia 3: Falha ---
        print("    -> Estratégias 1 e 2 falharam. Não foi possível extrair conteúdo.")
        return None, "FAILED"

    except requests.exceptions.RequestException as e:
        print(f"    -> Erro de conexão ao processar a página: {e}")
        return None, "FAILED"

if __name__ == "__main__":
    print("Iniciando a ingestão em massa com múltiplas estratégias...")
    
    # Garante que as pastas de destino existam
    if not os.path.exists(PROCESSED_TEXT_DIR): os.makedirs(PROCESSED_TEXT_DIR)
    if not os.path.exists(os.path.join(DATA_DIR, "raw_pdfs")): os.makedirs(os.path.join(DATA_DIR, "raw_pdfs"))

    correct_csv_url = get_csv_download_url_from_github()

    if correct_csv_url:
        publication_list = get_publications_from_github_csv(correct_csv_url)
        if publication_list:
            print(f"\nLista de {len(publication_list)} publicações obtida. Iniciando processamento...")
            
            # --- CONTROLE DE EXECUÇÃO ---
            # Para testar, processe apenas os 10 primeiros. Para a execução completa, apague o [:10]
            publications_to_process = publication_list
            
            final_metadata = []
            with requests.Session() as session:
                session.headers.update({'User-Agent': 'Mozilla/5.0'})
                for i, pub_info in enumerate(publications_to_process, 1):
                    print(f"\nProcessando {i}/{len(publications_to_process)}: {pub_info['title'][:70]}...")
                    
                    filepath, method = process_publication_page(pub_info, session)
                    
                    if filepath:
                        final_metadata.append({
                            "title": pub_info['title'],
                            "source_url": pub_info['full_text_url'],
                            "local_path": filepath,
                            "extraction_method": method
                        })
                    time.sleep(1)

            df_final = pd.DataFrame(final_metadata)
            df_final.to_csv(METADATA_FILE, index=False)
            print(f"\n--- Processo Concluído ---")
            print(f"{len(df_final)} de {len(publications_to_process)} publicações foram processadas com sucesso.")
            print(f"Metadados salvos em '{METADATA_FILE}'.")
            print("\nPróximos passos:")
            print("1. Se houver PDFs baixados, rode 'python process.py' para extrair o texto deles.")
            print("2. Rode 'python build_graph.py' para construir o grafo de conhecimento.")