# pt-newsrater

## What is this?
`pt-newsrater` is the API for Press Torch.

## Data collected
The following data is collected:

### A typical `metric` object
Firstly, I should add that a `metric` can be a:
* News Article, `type: 'article'`
* Alexa Ranking, `type: 'ranking'`
* Circulation (by year), `type: 'circulation'`
* Press Complaint, `type: 'complaint'`

`metric` entries share the following object values:
* `publicationId` - The ID of the Publication
* `dateCreated` - The Date/Time the entry was created
* `dateModified` - The Date/Time the entry was modified
