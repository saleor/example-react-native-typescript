This tutorial will show how you can create a mobile application with React Native and Expo, that gets data from the Saleor API using GraphQL. Along with some basic styling. Our goal is to show you how to create a mobile basis for an e-commerce app in React Native.

### Introduction

GraphQL is a query language and server-side runtime for APIs. It can provide a complete and convenient description of the data in your API. The query language allows clients to form the data requests for the exact shape of the data they need. GraphQL is designed to make APIs flexible and convenient to use so that they are easier to evolve and maintain. GraphQL helps you keep up with the growing complexity of apps.

GraphQL has many advantages compared to REST. Instead of using a fixed data structure approach, GraphQL requests specific data the client needs. REST responses are notorious for containing too much data or not enough. GraphQL solves this by fetching exact data in a single request. GraphQL also has an introspection feature that allows developers to check types & the schema to ensure they’re asking for data the right way.

[Saleor](https://saleor.io/) is an all-in-one platform for creating a production-grade shopping experience on the Internet. Saleor exposes a comprehensive set of e-commerce notions as a GraphQL endpoint. Building digital shops used to be complex. Nowadays you can rely on specialist solutions such as Saleor providing consolidated e-commerce knowledge that exposes it in an easy-to-use manner. Saleor allows you to manage any number of storefronts such as web or mobile apps from a single back-end.

In this tutorial, we will create a mobile app on top of the Saleor GraphQL API using React Native and Expo. React Native is an open-source library created by Google, that lets you create mobile applications for iOS and Android using JavaScript or TypeScript. It's powering some of the biggest mobile applications like Facebook Messenger, Skype, and Pinterest. With Expo, you can quickly build cross-platform applications for mobile (iOS, Android) and the web. By using Expo we have one unified approach to building, compiling, and running React Native from a local machine.

### Prerequisites

Before you start this tutorial, you’ll need the following:

- Basic understanding of mobile app development
- Expo (follow [the official installation guide](https://docs.expo.dev/get-started/installation/))
- VS Code as the editor

### Getting started

Creating a new React Native application with Expo starts by using the Expo CLI from your terminal, which helps you to kickstart the development of your application. You can do this by running the following command from the terminal:

```
expo init saleor-react-native

```

This project will be named `saleor-react-native`, and you'll be asked to select a template to kickstart the development of the application but for this tutorial, the `blank (TypeScript)` template will be sufficient.

After the installation is finished, you can by running `yarn start`. This will start the Expo Developer Tools in your browser on [http://localhost:19002/](http://localhost:19002/). From this page, you can select where you want to run the React Native application (iOS, Android, or web) and find tools to debug the application. Alternatively, you can start the application directly at the location of your choice, by running `yarn ios|android|web`.

To run the application you have to either install the Expo Go application on your mobile device, install XCode on your Mac computer, or Android Studio on any computer. Preferably you use the Expo Go application that's available in the Apple App Store and Android Play Store. By using this application you open the React Native application by scanning the QR code that you find in the Expo Developer Tools, or by creating an Expo account and share the link from there.

The application will look something like this when we first start it:

![Initial application](initial_application.png 'Initial application')

Let's proceed by adding GraphQL to this application, and connect it with the Saleor GraphQL API to render a list of products.

### Installing the Libraries & Dependencies

We need to install Apollo Client, a library to connect with a GraphQL server, and `graphql` itself. We can install these packages from npm using:

```
yarn add @apollo/client graphql
```

After installing Apollo Client make sure to restart the React Native application, so that the bundle will be rebuild containing these new dependencies.

### Setting up Apollo Client

[Apollo Client](https://www.apollographql.com/docs/react/) is the most popular library to manage GraphQL data from a React or React Native application. You can use it to fetch, mutate or cache data from a GraphQL API. The library comes with a set of predefined Hooks that are optimized for working with GraphQL in web and mobile applications.

To set up Apollo Client in our application we need to make changes to the entry point of our application in `App.tsx`. In this file you need to import Apollo Client, create a client and wrap the application with the connection details to the GraphQL API:

```tsx
// App.tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://demo.saleor.io/graphql/',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style='auto' />
      </View>
    </ApolloProvider>
  );
}
```

Any component that is now rendered within `ApolloProvider` can connect with the GraphQL API that's available at [https://demo.saleor.io/graphql/](https://demo.saleor.io/graphql/).

In the next section, you'll learn more about this GraphQL API, which is a demo instance of the Saleor GraphQL API.

### Your first query

The GraphQL API from Saleor has a demo instance from which you can retrieve mock products, category and everything else you need to build an e-commerce store. This demo API has a GraphQL playground that you can find at [https://demo.saleor.io/graphql/](https://demo.saleor.io/graphql/), where you can use the following query to retrieve a list of products:

```graphql
query getProducts {
  products(first: 10, channel: "default-channel") {
    edges {
      node {
        id
        name
        description
        thumbnail {
          url
        }
      }
    }
  }
}
```

Let's add this query into a new file called `Products.tsx`, and import the required dependencies from React Native and Apollo Client. The query is wrapped with `gql` which lets you use the GraphQL syntax within a JavaScript (or TypeScript) application.

```tsx
// Products.tsx
import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query getProducts {
    products(first: 10, channel: "default-channel") {
      edges {
        node {
          id
          name
          description
          thumbnail {
            url
          }
        }
      }
    }
  }
`;
```

After which you can create the `Products` component in this file, which is using the `useQuery` Hook from Apollo Client to send this query to the GraphQL API and return the variables `loading` and `data`. The value for `loading` will be `true` until the data is resolved after which the list of products can be rendered. But for now, the value for `data` will be logged into the console, where you can check its value either in the Expo Developer Tools or the command line. Also, some basic styling is applied here.

```tsx
// Products.tsx

// ...

export default function Products() {
  const { loading, data } = useQuery(GET_PRODUCTS);

  console.log({ data });

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text>Products will be rendered here!</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

To render the `Products` component you need to nest it within `ApolloProvider` in `App.tsx`, so this component will be able to connect with the GraphQL API. Also, you can add a header to the page by adding a `View` component with a blue background and a `Text` component that's rendered within a `SafeAreaView` component. This component will make sure that the text is visible on all mobile screens.

```tsx
// App.tsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Products from './Products';

// ...

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <StatusBar style='auto' />
        <View style={styles.header}>
          <SafeAreaView style={styles.container}>
            <Text style={{ color: '#fff', fontSize: 18 }}>
              React Native Demo Home Page
            </Text>
          </SafeAreaView>
        </View>
        <Products />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'blue',
    width: '100%',
    height: 100,
  },
});
```

If you've checked if the products are retrieved properly from the Saleor GraphQL API, you can build the interface to display the products in our application. Multiple React Native components can be used to render a list of elements, but the `FlatList` component is the most suitable one. This component is optimized to render large sets of data, and it can iterate over the data that we retrieved from the GraphQL server and render this data in a grid.

```tsx
// Products.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';

// ...

export default function Products() {
  const { loading, data } = useQuery(GET_PRODUCTS);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <FlatList
          data={data.products.edges}
          renderItem={({ item }) => (
            <View>
              <Image
                source={{ uri: item.node.thumbnail.url }}
                style={{ height: 150, width: 150 }}
              />
              <Text>{item.node.name}</Text>
              <Text>$4.50</Text>
            </View>
          )}
          numColumns={2}
          keyExtractor={(item) => item.node.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

The `FlatList` component will iterate over the data coming from the GraphQL server and render a `View` component for every item in the list. This `View` component will hold an `Image` component and two `Text` components with the title and the price of the product. For simplicity, the price of the product is fixed.

To make this page look pretty, you can add a header title above the list of products and make sure that the grid of products is styled. The title and price that are rendered by `Text` components can also be styled, and as you probably have noticed a combination of style objects and inline styling is used in this tutorial.

```tsx
// Products.tsx

// ...

export default function Products() {
  const { loading, data } = useQuery(GET_PRODUCTS);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <FlatList
          data={data.products.edges}
          ListHeaderComponent={() => <Text style={styles.title}>Products</Text>}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <Image
                source={{ uri: item.node.thumbnail.url }}
                style={{ height: 150, width: 150 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {item.node.name}
              </Text>
              <Text>$4.50</Text>
            </View>
          )}
          numColumns={2}
          keyExtractor={(item) => item.node.id}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
  },
  product: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

```

When you're finished making the changes, the application will be styled and looks something like the following:

![Final application](final_application.png 'Final application')

This application is rendering a list of products from the Saleor GraphQL API, which has much more to offer than just retrieving products. Great!

### Next Steps
As an exercise, try to modify the GraphQL query to include the real price. You can start from the GraphQL playground. Use the `docs` tab to explore possible parameters of a query. The query we use is called products. Find it and identify which fields are needed to get the price of each product as the response.


### Conclusion

In this tutorial, we've created a React Native application using the toolchain Expo. With Expo, you can quickly build cross-platform applications for mobile (iOS, Android) and the web. By using Expo we have one unified approach to building, compiling, and running React Native on a local machine. This application is connected to the Saleor GraphQL API, which delivers a headless approach for modern e-commerce. Using this API you can focus on building a frontend application for your clients or customers, using any library or framework that you're familiar with.

If you had any problems with finishing this tutorial, let us know on [GitHub Discussions](https://github.com/mirumee/saleor/discussions) or [Twitter](https://twitter.com/getsaleor). We’d be happy to help!

The code is available on our [GitHub](https://github.com/mirumee/saleor).