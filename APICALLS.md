Stories
=======
Items in quotes, i.e. 'Article', are models.
Items in \*'s are variables.
=======

--------------------------------------------------------------------------------------

Publication gets added:
/api/create/publication <<<=======
- Adds 'Publication'

Publication can be updated:
/api/create/publication <<<=======
- needs *publicationId*
- needs object keys changed, i.e. *name*

Publication can be deleted:
/api/delete/publication/:publicationId <<<=======

Publication can be retrieved:
/api/retrieve/publication/:publicationId <<<=======

User can search for publications:
/api/search/publications <<<=======
- needs *page*?
- can filter by *searchTerm*
- can filter by *country*

--------------------------------------------------------------------------------------

Article can be created:
/api/create/article <<<=======
- Adds 'Article' (if author doesn't exist)
- Adds 'Author' (if author doesn't exist)
- Adds 'Trend' (if trend doesn't exist)

Article can be deleted:
/api/delete/article/:articleId <<<=======

Article can be retrieved:
/api/retrieve/article/:articleId <<<=======

User can search for articles:
/api/search/articles <<<=======
- needs *page*
- can filter by *searchTerm*
- can filter by *author*
- can filter by *trend*

Article can be updated:
/api/update/article/:articleId <<<=======
- needs object keys changed, i.e. *title*

--------------------------------------------------------------------------------------

Author can be created:
/api/create/author <<<=======
- Adds 'Author' (if author doesn't exist)

Author can be deleted:
/api/delete/author/:authorId <<<=======

Author can be retrieved:
/api/retrieve/author/:authorId <<<=======

User can search for authors:
/api/search/authors <<<=======
- needs *page*
- can filter by *searchTerm*
- can filter by *publication*

Author can be updated:
/api/update/author/:authorId <<<=======
- needs object keys changed, i.e. *name*

--------------------------------------------------------------------------------------

User can review an article:
/api/create/review <<<=======
- Adds 'Review'
- needs *articleId*
- needs *publicationId*

Review can be deleted:
/api/delete/review/:reviewId <<<=======

User can search for reviews:
/api/search/reviews <<<=======
- needs *page*
- can filter by *searchTerm*
- can filter by *user*
- can filter by *reviewType*

Review can be updated:
/api/update/review/:reviewId <<<=======
- needs object keys changed, i.e. *title*
