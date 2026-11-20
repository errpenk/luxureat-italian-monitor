# LuxurEat Italian Monitor

Dashboard separata in italiano per i dati del monitor SEO WordPress.

La password `cina` è solo un filtro lato browser: GitHub Pages non offre una protezione reale per una pagina statica. Non pubblicare dati personali o IP in `data.json` senza aggiungere un backend con autenticazione.

## Aggiornamento manuale (senza push automatici programmati)

Il dashboard legge i dati da `data.json`. La configurazione GitHub Actions `.github/workflows/update-data.yml` **non ha alcun trigger `schedule`**: è avviabile soltanto manualmente tramite `workflow_dispatch` e, quando avviata, legge l'endpoint configurato nei Secrets e aggiorna `data.json`.

I dati possono anche essere inseriti manualmente modificando `data.json`. L'istantanea del 20 novembre 2026 (17:40, fuso italiano) deriva da tre schermate del pannello delle statistiche: andamento giornaliero, andamento settimanale e top 5 delle pagine più visitate. Il PV mensile non era presente nelle schermate. Per questo ora viene mostrata una **stima di 1.779 PV**: 1.070 PV già cumulati nell'istantanea del 13 novembre + 709 PV dalle righe dei CSV datate dal 14 al 20 novembre 2026. La riga datata 21 novembre (1 PV) è esclusa da questa stima. Le due istantanee possono avere scostamenti: il totale non è una misura consolidata ricavata da un unico export mensile.

Per il confronto settimanale, i dati di **Settimana scorsa** (375 PV) e **Due settimane fa** (695 PV) sono stati ripresi dalla versione precedente di `data.json` del 13 novembre 2026, anziché dai valori delle schermate del 20 novembre. Si tratta di dati storici disponibili alla data del rilevamento, non di una conferma dei totali finali della settimana.

La scheda del dashboard consente inoltre di inviare manualmente un collegamento tramite il pulsante SUBMIT. Questo è separato dal workflow GitHub Actions. Eventuali processi esterni all'archivio non sono gestiti dalla configurazione GitHub Actions.

## Analisi geografica

`geo.json` contiene soltanto valori aggregati, **senza IP individuali**. Le otto esportazioni CSV del 20/11/2026 coprono le date riportate dal sistema 14–21/11/2026 e comprendono **374 record** e **710 visualizzazioni di pagina**. L'attribuzione a Paese è basata sui prefissi IP e sulle informazioni di rete/ASN; rappresenta il Paese stimato dell'IP di uscita, **non la cittadinanza o la posizione fisica certa della persona**. Le reti cloud (compresa Tencent Cloud) e i crawler possono produrre molti record e non identificano necessariamente visitatori umani.

Il dashboard ordina i Paesi per **Share of Records**, calcolata come record di un Paese / totale record. I PV sono la somma del campo `访问页数` dei CSV. Il file `geo.json` espone anche `newVisitors` per eventuali analisi successive, senza dati identificabili.

Fonti di verifica dei prefissi (esempi): [IPinfo — 49.232/16](https://ipinfo.io/ips/49.232.0.0/16), [IPinfo — 62.234/16](https://ipinfo.io/ips/62.234.0.0/16), [IPinfo — 81.70/16](https://ipinfo.io/ips/81.70.0.0/16), [IPIP — Tencent AS45090](https://whois.ipip.net/AS45090/154.8.128.0/17), [IPinfo — 62.19/16](https://ipinfo.io/ips/62.19.0.0/16).

## Struttura dei dati

```json
{
  "updatedAt": "2026-11-20T16:40:46Z",
  "summary": {"todayPv": 93, "yesterdayPv": 340, "weekPv": 689, "monthPv": 1779, "monthPvEstimated": true},
  "daily": [{"date": "Oggi", "pv": 93}],
  "dailySeries": [{"label": "Oggi", "labels": ["00", "01"], "values": [17, 0]}],
  "weeklySeries": [{"label": "Questa settimana", "labels": ["1", "2"], "values": [46, 18]}],
  "sources": [],
  "pages": [{"label": "luxureat.cn/", "value": 83, "sharePct": 32.42}]
}
```
