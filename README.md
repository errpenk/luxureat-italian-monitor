# LuxurEat Italian Monitor

Dashboard separata in italiano per i dati del monitor SEO WordPress.

La password `cina` è solo un filtro lato browser: GitHub Pages non offre una protezione reale per una pagina statica. Non pubblicare dati personali o IP in `data.json` senza aggiungere un backend con autenticazione.

## Sincronizzazione giornaliera

Il pannello BaiduSEO usa richieste amministrative WordPress con nonce e sessione. Per sincronizzare in modo sicuro serve uno di questi due collegamenti:

1. un endpoint WordPress read-only protetto da token che restituisca il JSON normalizzato;
2. un workflow GitHub Actions con credenziali WordPress conservate nei Secrets GitHub, senza inserirle nel codice.

Il sito è già predisposto per leggere `data.json`; la struttura prevista è:

```json
{
  "updatedAt": "2026-11-05T00:00:00Z",
  "summary": {"todayPv": 0, "yesterdayPv": 0, "weekPv": 0, "monthPv": 0},
  "daily": [{"date": "2026-11-05", "pv": 0}],
  "sources": [{"label": "Google", "value": 0}],
  "pages": [{"label": "/it/", "value": 0}]
}
```
