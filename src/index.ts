import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

interface ContentQuery {
  contents(): Content[];
}

interface Content {
  id: string;
  title?: string;
  year?: string;
}

interface Query extends ContentQuery {
  topProducts(_: any, product: Product): Product[];
}

export interface Product {
  upc: string;
  name?: string;
  price?: number;
  weight?: number;
  first?: number;
}

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product]
  }
  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }
`;

const resolvers = {
  Product: {
    __resolveReference(product: Product) {
      return products.find(p => p.upc === product.upc);
    },
  },
  Query: {
    topProducts(_: null, product: Product) {
      return products.slice(0, product.first);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4004 }).then(({ url }) => {
  console.log(`🚀 Products service ready at ${url}`);
});

const products: Product[] = [
  {
    upc: '1',
    name: 'Table',
    price: 899,
    weight: 100,
  },
  {
    upc: '2',
    name: 'Couch',
    price: 1299,
    weight: 1000,
  },
  {
    upc: '3',
    name: 'Chair',
    price: 54,
    weight: 50,
  },
];
