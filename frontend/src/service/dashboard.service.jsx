
const API_URL = import.meta.env.VITE_LOCAL_API_URL;

async function request(endpoint) {
  if (!API_URL) {
    throw new Error("Configure VITE_LOCAL_API_URL no arquivo .env");
  }

  const token = localStorage.getItem("token");

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao backend. Verifique se o servidor está ativo.",
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Erro ao consultar ${endpoint}`,
    );
  }

  return result;
}

function extrairLista(response, chaves = []) {
  if (Array.isArray(response)) {
    return response;
  }

  for (const chave of chaves) {
    if (Array.isArray(response?.[chave])) {
      return response[chave];
    }
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function extrairObjeto(response) {
  return response?.data ?? response?.estatisticas ?? response;
}

function numero(valor) {
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : 0;
}

function dataValida(valor) {
  if (!valor) return null;

  const data = new Date(valor);

  return Number.isNaN(data.getTime()) ? null : data;
}

function formatarData(valor) {
  const data = dataValida(valor);

  if (!data) return "Data não informada";

  return data.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

function mapearLivros(response) {
  return extrairLista(response, ["livros"]).map((livro) => ({
    ...livro,
    quantidade: numero(livro.quantidade),
    disponiveis: numero(
      livro.disponiveis ??
      livro.quantidadeDisponivel ??
      livro.quantidadeDisponivelAtual ??
      livro.disponivel,
    ),
  }));
}

function mapearEmprestimos(response) {
  return extrairLista(response, ["emprestimos"]).map((emprestimo) => ({
    ...emprestimo,
    dataPrevista: emprestimo.dataPrevista,
  }));
}

function calcularEstatisticasLivros(livros) {
  const exemplares = livros.reduce(
    (total, livro) => total + livro.quantidade,
    0,
  );

  const disponiveis = livros.reduce(
    (total, livro) => total + livro.disponiveis,
    0,
  );

  return {
    titulos: livros.length,
    exemplares: disponiveis,
    totalExemplares: exemplares,
  };
}

function calcularEstatisticasEmprestimos(emprestimos) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ativos = emprestimos.filter((emprestimo) => {
    return (
      emprestimo.dataDevolucao == null &&
      emprestimo.devolvidoEm == null &&
      emprestimo.status !== "DEVOLVIDO" &&
      emprestimo.status !== "CONCLUIDO"
    );
  });

  const atrasados = ativos.filter((emprestimo) => {
    const prevista = dataValida(emprestimo.dataPrevista);

    return prevista && prevista < hoje;
  });

  const devolucoes = ativos
    .map((emprestimo) => {
      const livro = emprestimo.livro ?? {};

      return {
        titulo: livro.titulo ?? emprestimo.titulo ?? "Livro sem título",
        isbn: livro.isbn ?? emprestimo.isbn ?? "Não informado",
        data: formatarData(emprestimo.dataPrevista),
        dataOrdenacao: dataValida(emprestimo.dataPrevista),
      };
    })
    .filter((emprestimo) => emprestimo.dataOrdenacao)
    .sort((a, b) => a.dataOrdenacao - b.dataOrdenacao)
    .slice(0, 5)
    .map(({ titulo, isbn, data }) => ({ titulo, isbn, data }));

  return {
    emprestimos: ativos.length,
    atrasos: atrasados.length,
    devolucoes,
  };
}

function mapearArvore(response) {
  const arvore = extrairObjeto(response);

  return {
    nos: numero(arvore.nos ?? arvore.totalNos ?? arvore.quantidadeNos),
    altura: numero(arvore.altura),
    alturaNegra: numero(arvore.alturaNegra),
    raiz: arvore.raiz?.isbn ?? arvore.raiz ?? "-",
  };
}

export async function getDashboardData() {
  const [livrosResponse, emprestimosResponse, arvoreResponse] =
    await Promise.all([
      request("/book"),
      request("/loan"),
      request("/tree/estatisticas"),
    ]);

  const livros = mapearLivros(livrosResponse);
  const emprestimos = mapearEmprestimos(emprestimosResponse);

  return {
    ...calcularEstatisticasLivros(livros),
    ...calcularEstatisticasEmprestimos(emprestimos),
    arvore: mapearArvore(arvoreResponse),
  };
}
