import { get, has } from "lodash"; // filter, map, property

export default function(metadata) {
  const {
    general,
    openGraph
  } = metadata; // jsonLd, schemaOrg

  // Authors
  const authorsFilter = (data) => {
    return data
      .split(/,| and | \| | by | By /g)
      .map(author => author.trim())
      .filter(author => !(author.toLowerCase().search(/correspondent|editor/g) > -1));
  }
  let authors = {
    'general': () => {
      switch (has(general, 'author')) {
        case false:
          return null;
        default:
          const getGeneralAuthor = get(general, 'author');
          const isGeneralAuthorArray = Array.isArray(getGeneralAuthor);
          return isGeneralAuthorArray ? getGeneralAuthor : authorsFilter(getGeneralAuthor)
      }
    }
  }

  // Date Published
  let datePublished = {
    'openGraph': () => {
      switch (has(openGraph, 'published_time')) {
        case false:
          switch (has(openGraph, 'pubdate')) {
            case false:
              return null;
            default:
              return get(openGraph, 'pubdate');
          }
        default:
          return get(openGraph, 'published_time');
      }
    }
  }

  // Description
  let description = {
    'general': () => {
      switch (has(general, 'description')) {
        case false:
          return null;
        default:
          return get(general, 'description');
      }
    }
    // TODO: Add openGraph
  }

  // Locale
  let locale = {
    'openGraph': () => {
      switch (has(openGraph, 'locale')) {
        case false:
          return null;
        default:
          return get(openGraph, 'locale');
      }
    }
  }

  // Section
  let section = {
    'openGraph': () => {
      switch (has(openGraph, 'section')) {
        case false:
          return null;
        default:
          return get(openGraph, 'section');
      }
    }
  }

  // Title
  let title = {
    'general': () => {
      switch (has(general, 'title')) {
        case false:
          return null;
        default:
          return get(general, 'title');
      }
    }
    // TODO: Add openGraph
  }

  // Trends
  const trendsFilter = (data) => {
    return data
      .split(/,/g)
      .map(author => author.trim());
  }
  let trends = {
    'general': () => {
      switch (has(general, 'keywords')) {
        case false:
          return null;
        default:
          const getKeywords = get(general, 'keywords');
          const isKeywordsArray = Array.isArray(getKeywords);
          return isKeywordsArray ? getKeywords : trendsFilter(getKeywords)
      }
    },
    'openGraph': () => {
      switch (has(openGraph, 'tag')) {
        case false:
          return null;
        default:
          const getKeywords = get(openGraph, 'tag');
          const isKeywordsArray = Array.isArray(getKeywords);
          return isKeywordsArray ? getKeywords : trendsFilter(getKeywords)
      }
    }
  }

  // URL to Image
  let urlToImage = {
    'openGraph': () => {
      switch (has(openGraph, 'image')) {
        case false:
          return null;
        default:
          return get(openGraph, 'image').url;
      }
    }
    // TODO: Add general
  }

  return {
    authors: authors.general() || [],
    datePublished: datePublished.openGraph(),
    description: description.general(),
    locale: locale.openGraph(),
    section: section.openGraph(),
    title: title.general(),
    trends: trends.general() || trends.openGraph() || [],
    urlToImage: urlToImage.openGraph()
  }
}

// // Authors
// let authors;
// if (has(general, 'author')) {
//   console.log('its an general array');
//   authors = get(general, 'author').split(/,| and | by | By /g).map(author => author.trim());
// } else {
//   if (has(schemaOrg, 'items')) {
//     console.log('its an schemaOrg array');
//     authors = filter(map(schemaOrg.items, property('properties.author[0].properties.name')), undefined)[0];
//   } else {
//     if (Array.isArray(jsonLd)) {
//       console.log('its an jsonLd array');
//       authors = filter(map(jsonLd, property('author.name')), undefined);
//     } else {
//       if (has(jsonLd, 'author.name')) {
//         console.log('its an author.name');
//         authors.push(get(jsonLd, 'author.name'));
//       } else if (has(jsonLd, 'author')) {
//         authors.push(get(jsonLd, 'author'));
//       }
//     }
//   }
// }
