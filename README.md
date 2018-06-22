# "PT" Newsrater

## What is this?
`pt-newsrater` is the API for "PT".

## Data collected
The following data is collected:

### A typical `metric` object
Firstly, I should add that a `metric` can be of the following types:
* News Article, `type: 'article'`
* Alexa Ranking, `type: 'ranking'`
* Circulation (by year), `type: 'circulation'`
* Press Complaint, `type: 'complaint'`
* Fact Check, `type: 'factcheck'`

`metric` entries share the following object values:
* `publicationId` - The ID of the Publication. (`string`)
* `dateCreated` - The Date/Time the entry was created. (`timestamp`)
* `dateModified` - The Date/Time the entry was modified. (`timestamp`)
* `type` - The Type of `metric`, see above. (`string`)
* `body` - Contains specific values related to the type of `metric`. (`object`)

#### News Article, `type: 'article'`

Example object for News Article:
```
{
  _...metric_,
  body: {
    title: 'BMW joins Airbus in Brexit warning',
    url: 'https://www.bbc.co.uk/news/business-44582831'
  }
}
```

#### Alexa Ranking, `type: 'ranking'`
blurb

#### Circulation (by year), `type: 'circulation'`
blurb

#### Press Complaint, `type: 'complaint'`
blurb

#### Fact Check, `type: 'factcheck'`
blurb
