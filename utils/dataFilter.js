import { filter, get, has, map, property } from "lodash";

export default function(metadata) {
  const { general, jsonLd, openGraph, schemaOrg } = metadata;

  // Authors
  let authors = [];
  if (has(general, 'author')) {
    authors = get(general, 'author').split(/,| and | by | By /g).map(author => author.trim());
  } else {
    if (has(schemaOrg, 'items')) {
      authors = filter(map(schemaOrg.items, property('properties.author[0].properties.name')), undefined)[0] || [];
    } else {
      if (Array.isArray(jsonLd)) {
        authors = filter(map(jsonLd, property('author.name')), undefined)[0];
      } else {
        if (has(jsonLd, 'author.name')) {
          authors.push(get(jsonLd, 'author.name'));
        } else if (has(jsonLd, 'author')) {
          authors.push(get(jsonLd, 'author'));
        }
      }
    }
  }

  return {
    authors
  }
}


// const { author, keywords } = general;
// const { tag } = openGraph;
//
// let schemaOrgProps = {};
// if (schemaOrg !== undefined) {
//   schemaOrg.items.map(item => {
//     if (item.properties.author !== undefined) {
//       schemaOrgProps.author = item.properties.author[0].properties.name;
//     }
//   });
// }
//
// // authors
// let authors = author === undefined ? [] : author.split(',');
// if (jsonLd !== undefined) if (jsonLd.author !== undefined) authors = jsonLd.author.name;
// if (schemaOrgProps.author !== undefined) authors = schemaOrgProps.author;
//
// // datePublished
// let datePublished = pubDate[0];
// if (openGraph !== undefined) if (openGraph['published_time'] !== undefined) datePublished = openGraph['published_time'];
//
// // description
// let description = '';
// if (general !== undefined) if (general.description !== undefined) description = general.description;
// if (openGraph !== undefined) if (openGraph.description !== undefined) description = openGraph.description;
//
// // title
// let title = '';
// if (general !== undefined) if (general.title !== undefined) title = general.title;
// if (openGraph !== undefined) if (openGraph.title !== undefined) title = openGraph.title;
//
// // trends
// const trendsList = keywords || tag || [];
// const trends = Array.isArray(trendsList) ? trendsList : trendsList.split(',');
//
// // urlToImage
// let urlToImage = '';
// if (openGraph !== undefined) if (openGraph.image !== undefined) urlToImage = openGraph.image.url;
