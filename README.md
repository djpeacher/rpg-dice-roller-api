# rpg-dice-roller-api

API wrapper for [rpg-dice-roller](https://github.com/dice-roller/rpg-dice-roller).

This API allows you to roll dice using [dice notation](https://dice-roller.github.io/documentation/guide/notation/)!

## /api/roll/:notation[?v]

> https://rpgdr.djpeacher.com/api/roll/4d6
>
> → 200 { "averageTotal": 14, "maxTotal": 24, "minTotal": 4, "output": "4d6: [1, 1, 3, 3] = 8", "total": 8 }

## /api/stats

> https://rpgdr.djpeacher.com/api/stats
>
> → 200 { "rolls": 9001 }
