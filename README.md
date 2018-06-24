# "PT" Newsrater

## What is this?
`pt-newsrater` is the API for "PT".

## Data collected
The following data is collected:

### A typical `metric` object
Firstly, I should add that a `metric` can be of the following types:
* News Article, `type: 'article'`
* Trend, `type: 'trend'`
* Alexa Ranking, `type: 'ranking'`
* Circulation (by year), `type: 'circulation'`
* Press Complaint, `type: 'complaint'`
* Price, `type: 'price'`
* Fact Check, `type: 'factcheck'`

`metric` entries share the following object values:
* `publicationId` - The ID of the Publication. (`string`)
* `dateCreated` - The Date/Time the entry was created. (`timestamp`)
* `dateModified` - The Date/Time the entry was modified. (`timestamp`)
* `type` - The Type of `metric`, see above. (`string`)
* `body` - Contains specific values related to the type of `metric`. (`object`)

Example object for `metric` to be used in the _type_ examples:
```
const metricExample = {
  publicationId: '5b2a9ec9e7179a589285988a',
  dateCreated: '2018-06-20T16:00:00Z',
  dateModified: '2018-06-20T16:00:00Z'
}
```

#### News Article, `type: 'article'`

Example object for News Article on creation:
```
{
  ...metricExample,
  body: {
    datePublished: '2018-06-20T16:00:00Z',
    description: 'The car giant BMW has followed plane-maker Airbus in warning about the consequences of Brexit uncertainty.',
    sentiment: {
      caps: [
        'WARNING'
      ],
      positive: [
        'join'
      ],
      negative: [
        'threatens'
      ],
      score: {
        caps: 0,
        sentiment: -2,
        total: -2
      }
    },
    title: 'BMW threatens to join Airbus in Brexit WARNING',
    trends: [
      '5b2a9ec9e7179a589285988a',
      '5b2a9ec9e7179a589285988b',
      '5b2a9ec9e7179a589285988c'
    ],
    url: 'https://www.bbc.co.uk/news/business-44582831'
  },
  type: 'article'
}
```

#### Trend, `type: 'trend'`
```
{
  ...metricExample,
  body: {
    value: 'Brexit',
    aka: [
      'United Kingdom European Union membership referendum, 2016',
      'United Kingdom withdrawal from the European Union'
    ]
  },
  type: 'trend'
}
```

#### Alexa Ranking, `type: 'ranking'`
```
{
  ...metricExample,
  body: {
  },
  type: 'ranking'
}
```

#### Circulation (by year), `type: 'circulation'`
```
{
  ...metricExample,
  body: {
    label: '2018',
    value: '3,000,005'
  },
  type: 'circulation'
}
```

#### Press Complaint, `type: 'complaint'`
```
{
  ...metricExample,
  body: {
  },
  type: 'complaint'
}
```

#### Price, `type: 'price'`
```
{
  ...metricExample,
  body: {
    title: 'The Mail On Sunday',
    value: 2.80
  },
  type: 'price'
}
```

#### Fact Check, `type: 'factcheck'`
```
{
  ...metricExample,
  body: {
  },
  type: 'factcheck'
}
```
