# Imagens do Front-end

## SVGs Incluídos

1. **logo.svg** - Logo da aplicação (relógio + linha de saúde)
2. **hero-child.svg** - Ilustração de criança para onboarding
3. **family.svg** - Ilustração de família para dashboard
4. **glucose-meter.svg** - Glicosímetro para view de glicemia
5. **medical-records.svg** - Prontuário médico
6. **empty-state.svg** - Estado vazio genérico

## Como Melhorar

### Imagens Reais Sugeridas

Para um visual mais profissional, considere adicionar:

- **Fotos de famílias reais** (stock photos de pais com crianças)
- **Ilustrações médicas** de sites como:
  - unDraw (https://undraw.co)
  - Freepik (https://freepik.com)
  - Unsplash (https://unsplash.com)

### Ícones Adicionais

Material UI já fornece ícones, mas você pode adicionar:
- Ícones customizados de insulina
- Ícones de sensores CGM
- Ícones de alimentos

### Onde Adicionar Mais Imagens

- `/images/onboarding/` - Tutorial visual
- `/images/avatars/` - Avatares de crianças
- `/images/backgrounds/` - Padrões de fundo
- `/images/illustrations/` - Ilustrações temáticas

## Uso

```tsx
<img src="/images/logo.svg" alt="Logo" />
```

As imagens estão em `/frontend/public/images/` e são servidas estaticamente.
