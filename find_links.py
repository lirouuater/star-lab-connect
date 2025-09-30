import requests
from bs4 import BeautifulSoup
import sys
from urllib.parse import urljoin, quote

# URL base do sistema de busca da NSLSL
BASE_SEARCH_URL = "https://extapps.ksc.nasa.gov/NSLSL/Search/Index?searchType=simple&searchCriteria="

def find_publication_links(search_term):
    """
    Constrói uma URL de busca a partir de um termo, visita a página 
    e extrai os links diretos para os PDFs.
    """
    # Codifica o termo de busca para ser seguro para URLs (ex: substitui espaços por %20)
    encoded_term = quote(search_term)
    search_url = BASE_SEARCH_URL + encoded_term
    
    print(f"Buscando por '{search_term}'...")
    print(f"URL de busca construída: {search_url}")
    
    try:
        # 1. Busca o conteúdo da página de resultados
        response = requests.get(search_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'lxml')

        # 2. Encontra os links para as páginas de detalhes de cada publicação
        detail_links = []
        for heading in soup.find_all('h4', class_='media-heading'):
            link_tag = heading.find('a', href=True)
            if link_tag:
                full_url = urljoin(search_url, link_tag['href'])
                detail_links.append(full_url)
        
        if not detail_links:
            print("Nenhum link de publicação encontrado na página de busca.")
            return []

        print(f"\nEncontrados {len(detail_links)} links de publicações. Verificando cada um em busca de PDFs...")
        
        pdf_links = []
        # 3. Visita cada página de detalhes para encontrar o link do PDF
        for i, detail_url in enumerate(detail_links, 1):
            # Usamos end='\r' para criar uma linha de progresso que se atualiza
            print(f"  - Verificando link {i}/{len(detail_links)}...", end='\r')
            try:
                detail_response = requests.get(detail_url)
                detail_soup = BeautifulSoup(detail_response.content, 'lxml')
                
                pdf_tag = detail_soup.find('a', string=lambda text: text and 'full text' in text.lower())
                
                if pdf_tag and pdf_tag.get('href') and pdf_tag['href'].lower().endswith('.pdf'):
                    pdf_links.append(pdf_tag['href'])
            except requests.exceptions.RequestException:
                continue
        
        # Limpa a linha de progresso
        print(" " * 50, end='\r') 
        return pdf_links

    except requests.exceptions.RequestException as e:
        print(f"!!! Erro ao acessar a URL: {e}")
        return []

if __name__ == "__main__":
    # Pega todos os argumentos passados depois de 'python find_links.py' e junta em uma string
    if len(sys.argv) > 1:
        search_query = " ".join(sys.argv[1:])
        found_links = find_publication_links(search_query)
        
        print("\n--- Links de PDF Encontrados ---")
        if found_links:
            for link in found_links:
                print(link)
        else:
            print("Nenhum link direto de PDF foi encontrado para esta busca.")
    else:
        print("Uso: python find_links.py <TERMO_DE_BUSCA>")
        print("Exemplo:")
        print("python find_links.py microgravity plants")