import XLSX from 'xlsx';
import { db } from '../server/db';
import { products } from '../shared/schema';

async function importProducts() {
  try {
    const workbook = XLSX.readFile('attached_assets/tabela de valores_1760702151126.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`📊 Total de linhas na planilha: ${data.length}`);

    const productsToImport = data.slice(1).map((row: any) => {
      const codigo = row['Sem Categoria'];
      const categoria = row['__EMPTY'];
      const descricao = row['__EMPTY_1'];
      const unidade = row['__EMPTY_2'];
      const valorMinimo = row['__EMPTY_3'];
      const valorPadrao = row['__EMPTY_4'];

      if (!descricao || !valorPadrao) {
        return null;
      }

      let type = 'service';
      let pricePerM2 = null;
      let fixedPrice = null;

      if (unidade === 'M²' || unidade === 'M2') {
        type = 'm2';
        pricePerM2 = valorPadrao.toString();
      } else if (unidade === 'UN' || unidade === 'UNIDADE') {
        type = 'fixed';
        fixedPrice = valorPadrao.toString();
      } else {
        type = 'service';
        fixedPrice = valorPadrao.toString();
      }

      return {
        name: descricao.trim(),
        description: codigo ? `Código: ${codigo} | Unidade: ${unidade}` : `Unidade: ${unidade}`,
        pricePerM2,
        fixedPrice,
        type,
        category: categoria?.toLowerCase().trim() || 'outros',
        productionTime: null,
      };
    }).filter(Boolean);

    console.log(`✅ Produtos válidos para importar: ${productsToImport.length}`);

    let imported = 0;
    for (const product of productsToImport) {
      try {
        await db.insert(products).values(product);
        imported++;
        if (imported % 50 === 0) {
          console.log(`📦 Importados: ${imported}/${productsToImport.length}`);
        }
      } catch (error) {
        console.error(`❌ Erro ao importar produto "${product.name}":`, error);
      }
    }

    console.log(`\n🎉 Importação concluída! ${imported} produtos importados com sucesso.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na importação:', error);
    process.exit(1);
  }
}

importProducts();
