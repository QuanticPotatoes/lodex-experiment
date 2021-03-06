const should = require("should");
const sinon = require("sinon");
const request = require("request");
const expect = require("expect");
const unit = require("./ezsLocal.js");
const ezs = require("ezs");
const from = require("from");
const fs = require("fs");

/* eslint-disable */
let dataTest = [
  JSON.stringify({
    total: 29,
    scroll: "1m",
    scrollId: "DnF1ZXJ5VGhlbkZldGNoVQAAAAAAGYzGFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSUhZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZlkAWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGdJbFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSbBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lwWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGYzZFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4TxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjMkWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhQFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABl4URZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZ0lMWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzaFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVhZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZjMoWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzHFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZ0l0WTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGYzIFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVRZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZlkEWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGZZCFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABmWSRZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZlkMWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGXhWFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABmWRBZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZeFMWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGXhSFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSXhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjMsWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGZZFFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABnSXxZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZeFQWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGXhVFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABmMzBZwQlI1c1hpeVNHZUY3R28zVDNCR3B3AAAAAAAZ0lcWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGZZKFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABl4VxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjM0WcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhcFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSWBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZjM4WcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzPFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4WBZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZ0mAWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGdJZFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABmWRhZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZ0mEWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGXhZFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSYhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZeFoWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGdJjFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSZBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lsWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGdJlFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSZhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0loWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzTFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4XRZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjNAWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhbFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSZxZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lwWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzRFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4XxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjNsWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzSFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSaBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjNQWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzVFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSaRZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjNYWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGdJdFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABnSXxZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZ0moWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGdJeFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABmWRxZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZjNcWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzYFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSYBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZeF4Wb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGdJrFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABmWSBZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZlksWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGZZMFlVFNHpjY29KUURLX1UwakVzTlU5SEE=",
    nextScrollURI: "https://api-v5.istex.fr/document/?q=language:cze&size=15&output=doi&defaultOperator=OR&scroll=1m&scrollId=DnF1ZXJ5VGhlbkZldGNoVQAAAAAAGYzGFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSUhZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZlkAWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGdJbFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSbBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lwWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGYzZFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4TxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjMkWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhQFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABl4URZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZ0lMWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzaFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVhZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZjMoWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzHFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZ0l0WTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGYzIFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVRZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZlkEWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGZZCFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABmWSRZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZlkMWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGXhWFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABmWRBZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZeFMWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGXhSFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSXhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjMsWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGZZFFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABnSXxZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZeFQWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGXhVFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABmMzBZwQlI1c1hpeVNHZUY3R28zVDNCR3B3AAAAAAAZ0lcWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGZZKFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABl4VxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjM0WcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhcFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSWBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZjM4WcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzPFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4WBZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZ0mAWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGdJZFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABmWRhZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZ0mEWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGXhZFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSYhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZeFoWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGdJjFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSZBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lsWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGdJlFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSZhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0loWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzTFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4XRZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjNAWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhbFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSZxZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lwWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzRFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4XxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjNsWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzSFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSaBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjNQWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzVFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSaRZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjNYWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGdJdFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABnSXxZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZ0moWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGdJeFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABmWRxZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZjNcWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzYFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSYBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZeF4Wb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGdJrFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABmWSBZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZlksWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGZZMFlVFNHpjY29KUURLX1UwakVzTlU5SEE%3D",
    noMoreScrollResults: false,
    hits: [
      {
        doi: ["10.2478/v10227-011-0020-9"],
        id: "B23588AA1F6A4141455BC177B6838C19CF9804D3"
      },
      {
        doi: ["10.2478/v10217-012-0007-x"],
        id: "09A65C9E1115F045067A6ABD34047025A23CFF18"
      },
      {
        doi: ["10.2478/v10227-011-0012-9"],
        id: "C563051BC4431B541DA34509B4CA55713BBE3F37"
      },
      {
        doi: ["10.2478/v10227-011-0017-4"],
        id: "F731072411600E3E1A42239469D757A0F0214C32"
      },
      {
        doi: ["10.2478/v10227-011-0018-3"],
        id: "F51B6D3C3B02C64E472333F2692E4C080D45A23F"
      },
      {
        doi: ["10.2478/v10227-011-0019-2"],
        id: "044951B634229DF92BB7414F512207976896E2C6"
      },
      {
        doi: ["10.2478/v10227-011-0016-5"],
        id: "D6EA40B974758C367E5E0E180FD0D67B540E6CC3"
      },
      {
        doi: ["10.2478/v10227-011-0011-x"],
        id: "930767671A61AE837D238EB56E5CBFB0890C6E89"
      },
      {
        doi: ["10.2478/v10227-011-0014-7"],
        id: "FE52751005483711DBBF3850F327718CADB7FCE7"
      },
      {
        doi: ["10.2478/v10227-011-0015-6"],
        id: "0A532307A49AC644381B029FC55A217711E7F416"
      },
      {
        doi: ["10.2478/v10217-012-0006-y"],
        id: "F7FF19ADDD49D885FE99C9CC0C9D10A5E0FBD65D"
      },
      {
        doi: ["10.2478/v10217-012-0008-9"],
        id: "E39C3BED1F40F263B2978035EBC8F35E17B9D7EF"
      },
      {
        doi: ["10.2478/v10217-012-0004-0"],
        id: "EC61B3691B05C4D2975F43713497FD26431CE746"
      },
      {
        doi: ["10.2478/v10227-011-0013-8"],
        id: "4B48AABF4649239A822FE739E979D2DDDC37DAC7"
      },
      {
        doi: ["10.2478/v10217-012-0005-z"],
        id: "02E913566DBAEB6479BC7680B4988F41C383F1EF"
      }
    ],
    aggregations: {}
  }),
  JSON.stringify({
    total: 29,
    scroll: "1m",
    scrollId: "DnF1ZXJ5VGhlbkZldGNoVQAAAAAAGYzGFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSUhZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZlkAWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGdJbFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSbBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lwWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGYzZFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4TxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjMkWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhQFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABl4URZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZ0lMWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzaFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVhZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZjMoWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzHFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZ0l0WTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGYzIFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSVRZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZlkEWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGZZCFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABmWSRZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZlkMWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGXhWFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABmWRBZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZeFMWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGXhSFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSXhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjMsWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGZZFFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABnSXxZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZeFQWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGXhVFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABmMzBZwQlI1c1hpeVNHZUY3R28zVDNCR3B3AAAAAAAZ0lcWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGZZKFlVFNHpjY29KUURLX1UwakVzTlU5SEEAAAAAABl4VxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjM0WcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhcFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSWBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZjM4WcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzPFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4WBZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZ0mAWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGdJZFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABmWRhZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZ0mEWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGXhZFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSYhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZeFoWb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGdJjFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSZBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lsWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGdJlFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABnSZhZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0loWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzTFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4XRZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjNAWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGXhbFm9jeDZhdG9BVHppRHJyemF4dUgwOUEAAAAAABnSZxZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZ0lwWbVhjV1J6MFFSam05MmxPYTlINzV2dwAAAAAAGYzRFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABl4XxZvY3g2YXRvQVR6aURycnpheHVIMDlBAAAAAAAZjNsWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzSFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSaBZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjNQWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzVFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSaRZNdkhTVHBIN1JCNmlPY2dZS2hxYmJRAAAAAAAZjNYWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGdJdFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABnSXxZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZ0moWTXZIU1RwSDdSQjZpT2NnWUtocWJiUQAAAAAAGdJeFm1YY1dSejBRUmptOTJsT2E5SDc1dncAAAAAABmWRxZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZjNcWcEJSNXNYaXlTR2VGN0dvM1QzQkdwdwAAAAAAGYzYFnBCUjVzWGl5U0dlRjdHbzNUM0JHcHcAAAAAABnSYBZtWGNXUnowUVJqbTkybE9hOUg3NXZ3AAAAAAAZeF4Wb2N4NmF0b0FUemlEcnJ6YXh1SDA5QQAAAAAAGdJrFk12SFNUcEg3UkI2aU9jZ1lLaHFiYlEAAAAAABmWSBZVRTR6Y2NvSlFES19VMGpFc05VOUhBAAAAAAAZlksWVUU0emNjb0pRREtfVTBqRXNOVTlIQQAAAAAAGZZMFlVFNHpjY29KUURLX1UwakVzTlU5SEE=",
    noMoreScrollResults: true,
    hits: [
      {
        doi: ["10.2478/v10217-012-0009-8"],
        id: "52C6EDCF46C970BEC764507E065CF30597C5F5E5"
      },
      {
        doi: ["10.2478/v10217-012-0010-2"],
        id: "8DDAB9F9DBDDFA4ECD01BA661F3C7E4A76194234"
      },
      {
        id: "6AFBF025454390C1DB60970CC9F1A2E4D1D54836"
      },
      {
        doi: ["10.1007/BF02891755"],
        id: "64038A142AACB8528DB18B15766DFD19FE780167"
      },
      {
        doi: ["10.1007/BF02892307"],
        id: "5843A99CA558D6CADD337A6FCDBE4DB0E36B10A2"
      },
      {
        doi: ["10.1007/BF02891756"],
        id: "7403BF50F0FD0ED3701A54151EFAE48E016E9703"
      },
      {
        doi: ["10.1007/BF02891748"],
        id: "07595384882E67E0F97687CF5FEA53AA3B73FD2A"
      },
      {
        doi: ["10.1007/BF02891751"],
        id: "111C95FBBB153C2B2B7195AC04BB761F19014ED4"
      },
      {
        doi: ["10.1007/BF02891750"],
        id: "BF66FD7F6A1D73BA2356925655B24EE4EDF39C22"
      },
      {
        doi: ["10.1007/BF02891749"],
        id: "F49A85AF7D94D6AA8024BFF8629204307AEF679D"
      },
      {
        doi: ["10.1007/BF02891753"],
        id: "7026DE04A693D63DB98A5C7ECF07C476CBF210D8"
      },
      {
        doi: ["10.1007/BF02891754"],
        id: "50C2716A6FE5FAA94B3F13617DEBC2798F89B892"
      },
      {
        doi: ["10.1007/BF02891752"],
        id: "EDE8F8B9D57300ADCD1F339975AEB5C963AB7D9C"
      },
      {
        doi: ["10.1007/BF02891747"],
        id: "14DB64A077AEC817B8D42E9FE3B0C6118E6BA444"
      }
    ],
    aggregations: {}
  })
];

/* eslint-enable */

var sandbox;
beforeEach(() => {
  sandbox = sinon.sandbox.create();
  const s = sandbox.stub(request, "get");
  s.onFirstCall().yields(null, null,JSON.parse(dataTest[0]));
  s.onSecondCall().yields(null, null,JSON.parse(dataTest[1]));
});

afterEach(() => {
  sandbox.restore();
});

ezs.use(unit);

describe("The scrollISTEX function", () => {
  it("should return dataset of the API", done => {

    /* Fake URL */
    from(["https://api-v5.istex.fr/document/?q=language:test"])
      .pipe(ezs("scroll"))
      .pipe(ezs((data, feed) =>
      {
        expect(dataTest).toContain(JSON.stringify(data));
        if (data.noMoreScrollResults) {
          done();
        }

        feed.end();
      })
    );
  });
});

describe("The conversion hits to extended Nquads", () => {
  it("should return dataset of the API", done => {

    /* should result of the nquads conversion */
    let dataNquads = fs.readFileSync('test.txt','utf8');

    /* Fake URL */
    from(["https://api-v5.istex.fr/document/?q=language:test"])
      .pipe(ezs("scroll"))
      .pipe(ezs("convertToNquadsExtended",{ graph:"http://test-unit.fr"}))
      .pipe(ezs((data,feed) =>
      {
        if(data === null)
        {
          done();
        }

        expect(dataNquads).toContain(JSON.stringify(data));

        feed.end();
      }))
  });
});