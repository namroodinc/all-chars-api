# "PT" Newsrater

## What is this?
`pt-newsrater` is the API for "PT".

## Data collected
The following data is collected:

### A typical `metric` object
Firstly, I should add that a `metric` can be a:
* News Article, `type: 'article'`
* Alexa Ranking, `type: 'ranking'`
* Circulation (by year), `type: 'circulation'`
* Press Complaint, `type: 'complaint'`

`metric` entries share the following object values:
* `publicationId` - The ID of the Publication. (`string`)
* `dateCreated` - The Date/Time the entry was created. (`timestamp`)
* `dateModified` - The Date/Time the entry was modified. (`timestamp`)
* `body` - Contains specific values related to the type of `metric`. (`object`)

#### News Article
blurb

#### Alexa Ranking
blurb

#### Circulation (by year)
blurb

#### Press Complaint
blurb
