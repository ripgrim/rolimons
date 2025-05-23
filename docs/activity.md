---
description: rolimons.activity
---

# 🗓 Activity

## .getTradeAds(\<void>)

Gets the recent trade ads

**Note:**
- If the API rate limits you, this function will return `{ rateLimited: true }`.
- If the API response is invalid, it returns an empty array.

### Example usage

```javascript
// Get Trade Ads exmaple
const rolimons = require("rolimons-fixed")

rolimons.activity.getTradeAds().then(function(data){
    console.log(data[0]) // Gets the most recent trade ad
})
```

Note: Amount of returned trade ads from the endpoint are random (40-60), please add counting in your code.

| Returned Value     | Description                        |
| ------------------ | ---------------------------------- |
| posted \<int>      | The ID of the current trade        |
| userid \<int>      | User ID of the trade offer sender  |
| username \<string> | Username of the trade offer sender |
| offer \<array>     | The offer in array (see below)     |
| request \<array>   | The offer in array (see below)     |

### Offer/Request array data

| Item           | Description               | Found in          |
| -------------- | ------------------------- | ----------------- |
| items \<array> | List of items offered     | Offers & Requests |
| robux \<int>   | Amount of Robux requested | Offers & Requests |
| tags \<array>  | List of tags              | Offers only       |

