# Modificações no Site da Pizza - Seleção de Região Client-Side

## Resumo das Alterações

A funcionalidade de pop-up de seleção de região foi completamente reescrita para ser totalmente client-side, eliminando a dependência de servidor e tornando-a compatível com hospedagem no GitHub Pages.

## Arquivos Modificados/Criados

### 1. `estados_cidades.json`
- **Novo arquivo** contendo todos os estados e cidades do Brasil
- Dados obtidos da API do IBGE (https://servicodados.ibge.gov.br/api/v1/localidades/)
- Formato JSON otimizado para carregamento rápido
- Tamanho: ~500KB (compatível com GitHub Pages)

### 2. `js/region-selector.js`
- **Novo arquivo** com a implementação completa da funcionalidade
- Classe `RegionSelector` que gerencia todo o processo
- Funcionalidades incluídas:
  - Modal responsivo com seleção de estado e cidade
  - Armazenamento no localStorage para persistência
  - Atualização automática da interface
  - Fallback para dados básicos em caso de erro
  - Detecção automática de geolocalização (opcional)

### 3. `index.html`
- **Modificado**: Adicionada referência ao script `region-selector.js`
- Linha adicionada: `<script src="js/region-selector.js"></script>`

## Funcionalidades Implementadas

### ✅ Seleção de Região
- Pop-up modal responsivo que aparece automaticamente
- Dropdown de estados populado com todos os 27 estados brasileiros
- Dropdown de cidades que se atualiza dinamicamente baseado no estado selecionado
- Validação de seleção antes de permitir confirmação

### ✅ Persistência de Dados
- Região selecionada salva no localStorage do navegador
- Carregamento automático da região salva em visitas futuras
- Não exibe o pop-up novamente se já houver região selecionada

### ✅ Atualização da Interface
- Atualização automática de todos os elementos com ID `localCidade` e `localEstado`
- Disparo de evento customizado `regionSelected` para integração com outros scripts
- Elementos clicáveis para reabrir o seletor de região

### ✅ Design Responsivo
- Modal adaptável para desktop e mobile
- Estilos CSS integrados no próprio script
- Interface consistente com o design do site

### ✅ Tratamento de Erros
- Fallback com dados de estados principais em caso de falha no carregamento
- Logs de erro no console para debugging
- Graceful degradation se o arquivo JSON não carregar

## Compatibilidade

### ✅ GitHub Pages
- Totalmente client-side, sem dependências de servidor
- Arquivos estáticos apenas (HTML, CSS, JS, JSON)
- Sem necessidade de processamento server-side

### ✅ Navegadores
- Compatível com todos os navegadores modernos
- Usa APIs padrão (fetch, localStorage, DOM)
- Fallbacks para funcionalidades não suportadas

## Como Usar

1. **Primeira visita**: O pop-up aparece automaticamente
2. **Seleção**: Usuário escolhe estado e depois cidade
3. **Confirmação**: Clica em "Confirmar" para salvar
4. **Próximas visitas**: Região é carregada automaticamente
5. **Alteração**: Clica na região exibida para alterar

## Estrutura de Dados

```json
[
  {
    "uf": "SP",
    "nomeEstado": "São Paulo",
    "cidades": ["São Paulo", "Campinas", "Santos", ...]
  },
  ...
]
```

## Eventos Customizados

```javascript
// Escutar quando uma região é selecionada
window.addEventListener('regionSelected', function(event) {
  console.log('Nova região:', event.detail);
  // event.detail contém: { state, stateUF, city }
});
```

## Métodos Públicos

```javascript
// Abrir o seletor de região manualmente
window.regionSelector.openRegionSelector();

// Atualizar a exibição da localização
window.regionSelector.updateLocationDisplay();
```

## Vantagens da Nova Implementação

1. **Zero dependência de servidor** - Funciona em qualquer hospedagem estática
2. **Performance melhorada** - Carregamento local dos dados
3. **Offline-friendly** - Funciona mesmo sem conexão após primeiro carregamento
4. **Manutenção simplificada** - Código organizado e documentado
5. **Escalabilidade** - Fácil de expandir com novas funcionalidades
6. **SEO-friendly** - Não bloqueia indexação por ser client-side

## Próximos Passos Sugeridos

1. **Integração com analytics** - Rastrear seleções de região
2. **Geolocalização avançada** - Usar serviços de geocoding reverso
3. **Cache inteligente** - Implementar service worker para cache offline
4. **Personalização** - Permitir customização de cores e textos
5. **A/B Testing** - Testar diferentes layouts do modal

## Suporte

O código está totalmente documentado e pode ser facilmente modificado ou expandido conforme necessário. Todos os arquivos são compatíveis com GitHub Pages e não requerem configuração adicional.

