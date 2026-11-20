# LuxurEat Italian Monitor

Dashboard separata in italiano per i dati del monitor SEO WordPress.

La password `cina` è solo un filtro lato browser: GitHub Pages non offre una protezione reale per una pagina statica. Non pubblicare dati personali o IP in `data.json` senza aggiungere un backend con autenticazione.

## Aggiornamento manuale (senza push automatici programmati)

Il dashboard legge i dati da `data.json`. La configurazione GitHub Actions `.github/workflows/update-data.yml` **non ha alcun trigger `schedule`**: è avviabile soltanto manualmente tramite `workflow_dispatch` e, quando avviata, legge l'endpoint configurato nei Secrets e aggiorna `data.json`.

I dati possono anche essere inseriti manualmente modificando `data.json`. L'istantanea del 20 novembre 2026 (17:40, fuso italiano) deriva da tre schermate del pannello delle statistiche: andamento giornaliero, andamento settimanale e top 5 delle pagine più visitate. Il PV mensile non era presente nelle schermate e resta `null` fino a quando non sarà disponibile un dato verificato.

La scheda del dashboard consente inoltre di inviare manualmente un collegamento tramite il pulsante SUBMIT. Questo è separato dal workflow GitHub Actions. Eventuali processi esterni all'archivio non sono gestiti dalla configurazione GitHub Actions.

## Struttura dei dati

```json
{
  "updatedAt": "2026-11-20T16:40:46Z",
  "summary": {"todayPv": 93, "yesterdayPv": 340, "weekPv": 689, "monthPv": null},
  "daily": [{"date": "Oggi", "pv": 93}],
  "dailySeries": [{"label": "Oggi", "labels": ["00", "01"], "values": [17, 0]}],
  "weeklySeries": [{"label": "Questa settimana", "labels": ["1", "2"], "values": [46, 18]}],
  "sources": [],
  "pages": [{"label": "luxureat.cn/", "value": 83, "sharePct": 32.42}]
}
```
