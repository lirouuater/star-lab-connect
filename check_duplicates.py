import pandas as pd

METADATA_FILE = "data/metadata.csv"

def verify_duplicates():
    """
    Lê o arquivo de metadados e verifica a existência de títulos duplicados.
    """
    print(f"Verificando o arquivo '{METADATA_FILE}' por duplicatas...")

    try:
        df = pd.read_csv(METADATA_FILE)

        # Encontra as linhas que são duplicadas com base na coluna 'title'
        duplicates = df[df.duplicated(subset=['title'], keep=False)]

        # Conta quantos títulos únicos estão duplicados
        num_unique_duplicates = duplicates['title'].nunique()

        print(f"\n--- Análise de Duplicatas ---")
        print(f"Total de linhas no arquivo: {len(df)}")
        print(f"Número de títulos únicos que aparecem mais de uma vez: {num_unique_duplicates}")
        print(f"Número total de linhas duplicadas: {len(duplicates)}")

        if not duplicates.empty:
            print("\n--- Títulos Duplicados Encontrados ---")
            # Ordena para ver as duplicatas juntas
            print(duplicates.sort_values(by='title'))
        else:
            print("\nNenhuma duplicata encontrada.")

    except FileNotFoundError:
        print(f"!!! Erro: O arquivo '{METADATA_FILE}' não foi encontrado.")
    except Exception as e:
        print(f"!!! Um erro inesperado ocorreu: {e}")

if __name__ == "__main__":
    verify_duplicates()