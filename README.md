# "PT" Newsrater

## What is this?
`pt-newsrater` is the API for "PT".

## Getting started
1. Clone the repo locally
2. Add the following environment variables to your `.env` file
* `MONGODB_URI=`_get from mLabs_
* `APIKEY=`_get from mLabs_
* `NODE_ENV=dev`
* `PORT=5050`
* `NEWS_APIKEY=`_get from newsapi.org_
3. Run `npm run start` in your terminal

## Data Schemas

### Publications
The `Publication` schema:
```
{
  dateCreated: Number,
  dateModified: Number,
  disambiguation: String,
  featured: {
    type: Boolean,
    default: false
  },
  name: String,
  newsApiId: String,
  shortenedUrl: String,
  url: String
}
```

### News Articles
The `Article` schema:
```
{
  dateCreated: Number,
  dateModified: Number,
  datePublished: String,
  factCheck: [],
  publicationId: String,
  sentiment: mongoose.Schema.Types.Mixed,
  title: String,
  trends: [],
  url: String,
  type: String
}
```

### Trends
```
// TODO
```

### Metrics
A `metric` can be one of the following types:
* Alexa Ranking, `type: 'ranking'`
* Circulation (by year), `type: 'circulation'`
* Press Complaint, `type: 'complaint'`
* Price, `type: 'price'`
* Fact Check, `type: 'factcheck'`

`metric` entries share the following object values:
* `publicationId` - The ID of the Publication. (`string`)
* `type` - The Type of `metric`, see above. (`string`)
* `body` - Contains specific values related to the type of `metric`. (`object`)

## API calls
```
// TODO
```

## Postman Examples

#### Publication
Example object for Publication on creation (copy & paste in Postman):
```
{
  "name": "The Daily Telegraph",
  "newsApiId": "the-telegraph",
  "url": "https://www.telegraph.co.uk"
}
```

#### News Article
Example object for News Article on creation (copy & paste in Postman):
```
{
  "datePublished": "2018-06-20T16:00:00Z",
  "description": "The car giant BMW has followed plane-maker Airbus in warning about the consequences of Brexit uncertainty.",
  "factCheck": [
    "5b2a9ec9e7179a589285988a",
    "5b2a9ec9e7179a589285988b",
    "5b2a9ec9e7179a589285988c"
  ],
  "sentiment": {
    "caps": [
      "WARNING"
    ],
    "positive": [
      "join"
    ],
    "negative": [
      "threatens"
    ],
    "score": {
      "caps": 0,
      "sentiment": -2,
      "total": -2
    }
  },
  "title": "Lamborghini threatens to join Airbus in Brexit WARNING",
  "trends": [
    "5b2a9ec9e7179a589285988a",
    "5b2a9ec9e7179a589285988b",
    "5b2a9ec9e7179a589285988c"
  ],
  "url": "https://www.bbc.co.uk/news/business-44582831",
  "type": "article"
}
```

#### Metrics
##### Trend
```
// TODO
```

##### Alexa Ranking
```
// TODO
```

##### Circulation (by year)
```
// TODO
```

##### Press Complaint
```
// TODO
```

##### Price
```
// TODO
```

##### Fact Check
```
// TODO
```
