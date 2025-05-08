---
description: rolimons.Items
---

# 👑 Items

## `.getItems(<void>)`

Gets the entire item data from Rolimons.\
\
_This does not have a "practical" use._

**Note:**
- If the API rate limits you, this function will return `{ rateLimited: true }`.
- If the API response is invalid, it returns an empty object.

### Example usage

```javascript
// Get items example
const rolimons = require("rolimons-fixed")

rolimons.items.getItems().then(function(data) {
    console.log(data) // Returns all of the items in Rolimons
})

```



## `.searchItem(<str> type, <str/int> input)`

Fetches about an item from the Rolimons API and returns it\
\
_THIS FUNCTION USES CACHING!! SEE BELOW ON HOW TO DELETE CACHE OCCASIONALLY!_

**Note:**
- Searching by name is case-insensitive.
- If the API rate limits you, this function will return `{ rateLimited: true }`.
- If the item is not found or the API response is invalid, it returns `false`.

### Example usage

```javascript
// Searching VIA acryonym
const rolimons = require("rolimons-fixed")

rolimons.items.searchItem("name", "SSHF").then(
    function(item) {
        if (!item) return;
        console.log(item.name, "which is also known as", item.acronym, "has a demand of", item.demand)
})

// Output: Super Super Happy Face which is also known as SSHF has a demand of Amazing
```

```javascript
//Searching VIA ID
const rolimons = require("rolimons-fixed")

rolimons.items.searchItem("id", 1028606).then(
    function(item) {
        if (!item) return;
        console.log(item.name,  "has a demand of", item.demand)
    })

// Output: Red Baseball Cap has a demand of Unassigned
```

| Returned Value        | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| name <string>        | **The item's full name**                                    |
| acronym <string>     | **The item's full acronym **~~**(empty when no acronym)**~~ |
| value <int>          | **The item's value**                                        |
| default_value <int> | **Also the item's value**                                   |
| rap <int>            | **The item's RAP (Recent Average Price)**                   |
| demand <string>      | **The item's demand**                                       |
| trend <string>       | **The item's trend**                                        |
| projected <boolean>  | **Is the item projected**                                   |
| hyped <boolean>      | **Is the item hyped**                                       |
| rare <boolean>       | **Is the item rare**                                        |

## `.clear_cache( <void> )`

Clears the stored cache data to update item info.

### Example usage

```javascript
// Clear cache example
const rolimons = require("rolimons-fixed")

rolimons.items.searchItem("name", "CWHP").then(
    function(item) {
        console.log(item.name, "which is also known as", item.acronym, "has a demand of", item.demand)
    }).finally(
    rolimons.items.clear_cache() // Any search after this will have updated data
)

```

## `.getUUID(<int> UUID, <int> users>`

Gets UUID current owner & it's history.

**Note:**
- If the API rate limits you, this function will return `{ rateLimited: true }`.
- If the API response is invalid, it returns an empty array.

### Example usage

```javascript
// Get UUID example
// Do not take the response from this snippet as granted, as results are subject to change!
const rolimons = require("rolimons-fixed")

rolimons.items.getUUID(50921234383, 3).then(function(uuid) {
    console.log(uuid.last_owner, "is the current owner")
    console.log(uuid.history[1].name, 'was the owner before them')
})

// Output: EnvyCait is the current owner | EnvyKiwi was the owner before them
```

| Returned Value             | Description                          |
| -------------------------- | ------------------------------------ |
| item_name <string>       | **Item Name**                        |
| last_owner <string>      | **Last owner name**                  |
| serial <string>           | **Item UUID serial**                 |
| owned since <string>      | **Last owner owned this UUID since** |
| created <string>          | **Item UUID creation date**          |
| uuid_discovered <string> | **Item UUID discovery date**         |
| history <array>           | **Item UUID history**                |

NOTICE: history[0] IS ALWAYS THE CURRENT OWNER!!!

| History data             | Description               |
| ------------------------ | ------------------------- |
| id <int>                | **Previous Owner's ID**   |
| name <string>           | **Previous Owner's name** |
| updated_since <string> | **Last Updated**          |
| updated_date <string>  | **Updated Date**          |
