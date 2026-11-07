# Fauna e Flora de Portugal

Guia de campo da fauna e flora de Portugal por zonas, em português e inglês.
Publicado em `https://miguelacm.github.io/faunaeflora/`.

O site é compilado automaticamente pelo **GitHub Pages com Jekyll**: não há nenhum
passo de build manual. Basta editar ou acrescentar ficheiros e fazer commit.

## Estrutura

```
_config.yml              (na raiz do repositório) aponta o Jekyll para esta pasta
faunaeflora/
  index.html             entrada: escolha de língua
  pt/ , en/              páginas fixas (início, zonas, espécies, birdwatching, sobre)
  _zonas/pt|en/          uma página por zona            → /pt/zonas/<nome>/  · /en/zones/<nome>/
  _especies/pt|en/       uma ficha por espécie           → /pt/especies/<nome>/ · /en/species/<nome>/
  _guias/pt|en/          guias (birdwatching, etc.)      → /pt/guias/<nome>/  · /en/guides/<nome>/
  _data/
    especies.yml         dados neutros de cada espécie (nome científico, grupo, meses, zonas…)
    zonas.yml            dados neutros de cada zona (coordenadas do mapa, fontes)
    grupos.yml           grupos (aves, morcegos, …) e a sua ordem
    i18n.yml             textos da interface em cada língua
  _layouts/              modelos: base, zona, especie, guia
  _includes/             peças reutilizáveis (cartões, barra de meses, ilustrações SVG…)
  assets/css, assets/js  estilo e comportamento (filtros, tema, mapa)
```

A ligação entre as versões PT e EN de uma página faz-se pelo **nome do ficheiro**,
que tem de ser igual nas duas línguas (ex.: `_especies/pt/bubo-bubo.md` e
`_especies/en/bubo-bubo.md`). Nas páginas fixas usa-se o campo `ref`.

## Acrescentar uma espécie

1. Em `_data/especies.yml`, acrescentar uma entrada com o nome científico em
   minúsculas e hífenes como chave:

   ```yaml
   aquila-fasciata:
     sci: "Aquila fasciata"
     group: aves            # um id de grupos.yml
     ill: i-eagle           # opcional; sem isto usa a ilustração do grupo
     status: EN             # opcional; só se a fonte o indicar (LC NT VU EN CR DD)
     months: "111100000011" # jan→dez, 1 = boa época
     zones:
       sico: nao-confirmada # confirmada | provavel | nao-confirmada
   ```

2. Criar `_especies/pt/aquila-fasciata.md` e `_especies/en/aquila-fasciata.md`:

   ```markdown
   ---
   title: Águia-de-Bonelli
   summary: Uma ou duas frases gerais sobre a espécie.
   badges: ["Etiqueta opcional"]
   how: Como e quando a observar.
   where:
     sico: Onde a ver nesta zona.
   ---
   Texto opcional mais longo (Markdown).
   ```

A espécie aparece automaticamente no catálogo, nos filtros, no "Este mês" e nas
páginas das zonas que listam o seu grupo.

## Acrescentar uma zona

1. Em `_data/zonas.yml`, acrescentar a zona com `center: [lat, lon]` (marcador no
   mapa geral), `ill` (ilustração do cartão) e `sources`.
2. Criar `_zonas/pt/<zona>.html` e `_zonas/en/<zona>.html`. No cabeçalho:
   `title`, `region`, `summary` e, opcionalmente, `calendar` (12 entradas) e `rules`.
   O corpo é HTML livre. Para listar espécies, usar:

   ```liquid
   {% include especies.html zona="<zona>" %}                       todas
   {% include especies.html zona="<zona>" grupo="aves" %}          só um grupo
   {% include especies.html zona="<zona>" slugs="bubo-bubo alcedo-atthis" %}  por esta ordem
   ```

   A página de Sicó (`_zonas/pt/sico.html`) serve de exemplo completo.
3. Indicar a zona em `zones:` de cada espécie em `_data/especies.yml`.

## Acrescentar um guia

Criar `_guias/pt/<nome>.md` e `_guias/en/<nome>.md` com `title`, `summary`,
`order` (posição na lista) e, se for sobre uma zona, `zona: <zona>`. Os guias de
uma zona aparecem na página dessa zona, com a lista das aves dessa zona no fim.

## Ilustrações

As ilustrações são símbolos SVG em `_includes/ilustracoes.html` (`i-owl`,
`i-bat`, `i-bird`, `i-oak`…). Usam as cores definidas em `assets/css/style.css`
e adaptam-se ao modo escuro. Para uma nova, acrescentar um `<symbol id="i-…">`
com `viewBox="0 0 200 140"`. Não usar imagens de outros sites sem licença.

## Testar localmente (opcional)

```bash
gem install jekyll -v 3.10.0 kramdown-parser-gfm webrick
jekyll serve --safe
```

Abrir `http://localhost:4000/faunaeflora/`.

Nota: o Jekyll 3 não aplica as regras `defaults` do `_config.yml` às páginas fixas
quando se usa `collections_dir`; por isso as páginas em `pt/` e `en/` indicam
`lang` e `layout` no próprio cabeçalho.
